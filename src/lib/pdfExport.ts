import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

export interface PdfExportProgress {
  step: number;
  totalSteps: number;
  message: string;
}

export interface PdfExportResult {
  success: boolean;
  blob?: Blob;
  blobUrl?: string;
  dataUri?: string;
  error?: string;
}

/**
 * Motor robusto de exportación a PDF basado en html-to-image (SVG foreignObject)
 * y jsPDF. Compatible al 100% con Tailwind CSS v4, sintaxis de color oklch(),
 * Recharts SVGs y ejecución dentro de entornos iframe (AI Studio, Cloud Run, Vercel).
 */
export async function exportReporteToPdf(
  onProgress?: (progress: PdfExportProgress) => void
): Promise<PdfExportResult> {
  try {
    const sectionIds = [
      'reporte-hero-header',
      'resumen-ejecutivo',
      'alcance-definiciones',
      'embudo-completo',
      'convocatoria',
      'lecturas',
      'entrevistas',
      'lidera-lab',
      'comite-matricula',
      'cambio-perfil',
      'perfil-cohorte',
      'conclusiones-recomendaciones',
      'anexo'
    ];

    // Localizar las secciones existentes en el DOM
    const elements: { id: string; el: HTMLElement }[] = [];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        elements.push({ id, el });
      }
    }

    if (elements.length === 0) {
      const mainEl = document.getElementById('reporte-documento-completo');
      if (mainEl) {
        elements.push({ id: 'reporte-documento-completo', el: mainEl });
      } else {
        throw new Error('No se encontraron los elementos del reporte para exportar.');
      }
    }

    const totalSteps = elements.length + 1;
    onProgress?.({
      step: 1,
      totalSteps,
      message: 'Iniciando compilador PDF...'
    });

    // Dimensiones estándar Carta (Letter) en milímetros
    const pageWidth = 215.9;
    const pageHeight = 279.4;
    const marginX = 12;
    const marginTop = 12;
    const marginBottom = 14;
    const printableWidth = pageWidth - marginX * 2;
    const printableHeight = pageHeight - marginTop - marginBottom;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      compress: true
    });

    let isFirstPage = true;

    for (let i = 0; i < elements.length; i++) {
      const item = elements[i];
      const sectionHeading =
        item.el.querySelector('h1, h2')?.textContent?.trim() || `Sección ${i + 1}`;

      onProgress?.({
        step: i + 1,
        totalSteps,
        message: `Compilando: ${sectionHeading.slice(0, 30)}...`
      });

      // Renderizado mediante html-to-image (soporte nativo de oklch y SVG)
      const dataUrl = await toPng(item.el, {
        quality: 0.95,
        pixelRatio: 1.5,
        backgroundColor: '#ffffff',
        filter: (node) => {
          if (node instanceof HTMLElement) {
            return (
              node.getAttribute('data-html2canvas-ignore') !== 'true' &&
              !node.classList.contains('print:hidden')
            );
          }
          return true;
        }
      });

      // Cargar la imagen para calcular proporciones exactas
      const img = new Image();
      img.src = dataUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Error al procesar imagen de sección ${item.id}`));
      });

      const imgWidthPx = img.naturalWidth || 1000;
      const imgHeightPx = img.naturalHeight || 800;
      const imgHeightMm = (imgHeightPx * printableWidth) / imgWidthPx;

      if (imgHeightMm <= printableHeight) {
        // La sección cabe en una página
        if (!isFirstPage) {
          doc.addPage('letter', 'portrait');
        } else {
          isFirstPage = false;
        }

        doc.addImage(dataUrl, 'PNG', marginX, marginTop, printableWidth, imgHeightMm);
      } else {
        // La sección excede la altura de una página: secciona limpiamente
        const pxPerMm = imgWidthPx / printableWidth;
        const pageHeightPx = Math.floor(printableHeight * pxPerMm);
        let remainingHeightPx = imgHeightPx;
        let sourceY = 0;

        while (remainingHeightPx > 0) {
          if (!isFirstPage) {
            doc.addPage('letter', 'portrait');
          } else {
            isFirstPage = false;
          }

          const currentChunkHeightPx = Math.min(pageHeightPx, remainingHeightPx);

          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = imgWidthPx;
          sliceCanvas.height = currentChunkHeightPx;
          const ctx = sliceCanvas.getContext('2d');

          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
            ctx.drawImage(
              img,
              0,
              sourceY,
              imgWidthPx,
              currentChunkHeightPx,
              0,
              0,
              imgWidthPx,
              currentChunkHeightPx
            );

            const sliceDataUrl = sliceCanvas.toDataURL('image/png');
            const sliceHeightMm = (currentChunkHeightPx * printableWidth) / imgWidthPx;
            doc.addImage(sliceDataUrl, 'PNG', marginX, marginTop, printableWidth, sliceHeightMm);
          }

          sourceY += currentChunkHeightPx;
          remainingHeightPx -= currentChunkHeightPx;
        }
      }
    }

    onProgress?.({
      step: totalSteps,
      totalSteps,
      message: 'Aplicando membrete institucional y numeración...'
    });

    // Añadir encabezado y pie de página institucional
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 150, 165);

      // Encabezado
      doc.text(
        'Enseña por Colombia — Convocatoria LIDERA Cohorte 2027 (Reporte Final Ejecutivo)',
        marginX,
        7
      );

      // Pie de página
      doc.text(
        `Página ${p} de ${totalPages}`,
        pageWidth - marginX - 22,
        pageHeight - 6
      );
      doc.text(
        'Corte oficial: 4 y 6 de noviembre de 2026',
        marginX,
        pageHeight - 6
      );
    }

    // Exportar el documento como Blob y DataURI
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const dataUri = doc.output('datauristring');
    const fileName = 'Reporte_Final_Convocatoria_LIDERA_Cohorte_2027.pdf';

    // Intento de descarga programática
    try {
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 500);
    } catch (e) {
      console.warn('Descarga automática directa no permitida por sandbox:', e);
    }

    return {
      success: true,
      blob,
      blobUrl,
      dataUri
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error durante la generación del PDF:', err);
    return {
      success: false,
      error: errorMsg
    };
  }
}
