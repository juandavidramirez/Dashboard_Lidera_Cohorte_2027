import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface PdfExportProgress {
  step: number;
  totalSteps: number;
  message: string;
}

export interface PdfExportResult {
  success: boolean;
  blob?: Blob;
  blobUrl?: string;
  error?: string;
}

/**
 * Motor robusto de exportación a PDF seccional para el Reporte Final LIDERA.
 * Procesa cada sección de forma independiente para evitar superar los límites
 * de memoria y altura de canvas de los navegadores (16.384px), garantizando
 * compatibilidad total en entornos iframe (AI Studio, Cloud Run, Vercel).
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

    // Recolectar elementos existentes
    const elements: { id: string; el: HTMLElement }[] = [];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        elements.push({ id, el });
      }
    }

    if (elements.length === 0) {
      // Fallback: si no encuentra secciones individuales, buscar contenedor principal
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
      message: 'Iniciando generación de documento PDF...'
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
      const sectionName = item.el.querySelector('h2, h1')?.textContent?.trim() || `Sección ${i + 1}`;

      onProgress?.({
        step: i + 1,
        totalSteps,
        message: `Procesando: ${sectionName.slice(0, 32)}...`
      });

      // Captura de alta fidelidad de la sección individual
      const canvas = await html2canvas(item.el, {
        scale: 1.6, // Nitidez óptima sin desbordar memoria
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1100,
        ignoreElements: (element) => {
          return (
            element.getAttribute('data-html2canvas-ignore') === 'true' ||
            element.classList.contains('print:hidden')
          );
        }
      });

      if (canvas.width === 0 || canvas.height === 0) {
        continue;
      }

      // Convertir altura de la sección a milímetros proporcionales
      const imgHeightMm = (canvas.height * printableWidth) / canvas.width;

      // Si la sección cabe en una sola página
      if (imgHeightMm <= printableHeight) {
        if (!isFirstPage) {
          doc.addPage('letter', 'portrait');
        } else {
          isFirstPage = false;
        }

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        doc.addImage(imgData, 'JPEG', marginX, marginTop, printableWidth, imgHeightMm);
      } else {
        // Si la sección es más alta que una página Letter, dividir el canvas en tajadas verticales
        const pxPerMm = canvas.width / printableWidth;
        const pageHeightPx = Math.floor(printableHeight * pxPerMm);
        let remainingHeightPx = canvas.height;
        let sourceY = 0;

        while (remainingHeightPx > 0) {
          if (!isFirstPage) {
            doc.addPage('letter', 'portrait');
          } else {
            isFirstPage = false;
          }

          const currentChunkHeightPx = Math.min(pageHeightPx, remainingHeightPx);

          // Crear canvas auxiliar para la tajada actual
          const chunkCanvas = document.createElement('canvas');
          chunkCanvas.width = canvas.width;
          chunkCanvas.height = currentChunkHeightPx;
          const chunkCtx = chunkCanvas.getContext('2d');

          if (chunkCtx) {
            chunkCtx.fillStyle = '#ffffff';
            chunkCtx.fillRect(0, 0, chunkCanvas.width, chunkCanvas.height);
            chunkCtx.drawImage(
              canvas,
              0,
              sourceY,
              canvas.width,
              currentChunkHeightPx,
              0,
              0,
              canvas.width,
              currentChunkHeightPx
            );

            const chunkHeightMm = (currentChunkHeightPx * printableWidth) / canvas.width;
            const chunkImgData = chunkCanvas.toDataURL('image/jpeg', 0.95);
            doc.addImage(chunkImgData, 'JPEG', marginX, marginTop, printableWidth, chunkHeightMm);
          }

          sourceY += currentChunkHeightPx;
          remainingHeightPx -= currentChunkHeightPx;
        }
      }
    }

    onProgress?.({
      step: totalSteps,
      totalSteps,
      message: 'Compilando y aplicando pie de página...'
    });

    // Añadir numeración y encabezado institucional a todas las páginas
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 150, 165);

      // Encabezado superior sutil
      doc.text(
        'Enseña por Colombia — Convocatoria LIDERA Cohorte 2027 (Reporte Ejecutivo Oficial)',
        marginX,
        7
      );

      // Pie de página con numeración
      doc.text(
        `Página ${p} de ${totalPages}`,
        pageWidth - marginX - 24,
        pageHeight - 6
      );
      doc.text(
        'Fecha de corte: 4 y 6 de noviembre de 2026',
        marginX,
        pageHeight - 6
      );
    }

    // Generación del archivo final en Blob
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const fileName = 'Reporte_Final_Convocatoria_LIDERA_Cohorte_2027.pdf';

    // Intento 1: Descarga directa por enlace HTML5 estándar
    try {
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileName;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      setTimeout(() => {
        if (document.body.contains(downloadLink)) {
          document.body.removeChild(downloadLink);
        }
      }, 500);
    } catch (clickErr) {
      console.warn('Click programático bloqueado por sandbox:', clickErr);
    }

    return {
      success: true,
      blob,
      blobUrl
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error durante la exportación a PDF:', err);
    return {
      success: false,
      error: errorMsg
    };
  }
}
