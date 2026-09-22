import React from 'react';

interface Props {
  dashboardName: string;
  viewName: string;
  theme?: 'amber' | 'emerald' | 'navy' | 'purple';
  cohortBadge?: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
}

export const DashboardViewHeader: React.FC<Props> = ({
  dashboardName,
  viewName,
  theme = 'amber',
  cohortBadge,
  subtitle,
  rightContent
}) => {
  // Configuración de acento sutil y elegante sin ruidos ni saturación excesiva
  const accentStyles = {
    amber: {
      bar: 'bg-[#F2A900]',
      badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
      line: 'from-amber-400/80 via-amber-200/40 to-transparent'
    },
    emerald: {
      bar: 'bg-[#2E9E82]',
      badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      line: 'from-emerald-500/80 via-emerald-200/40 to-transparent'
    },
    navy: {
      bar: 'bg-[#152238]',
      badgeBg: 'bg-slate-100 text-slate-900 border-slate-300',
      line: 'from-[#152238]/80 via-slate-300/40 to-transparent'
    },
    purple: {
      bar: 'bg-purple-600',
      badgeBg: 'bg-purple-100 text-purple-950 border-purple-300',
      line: 'from-purple-500/80 via-purple-200/40 to-transparent'
    }
  }[theme];

  return (
    <div className="mb-6 pb-4 border-b border-slate-200/80 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="flex items-start gap-3.5">
          {/* Barra vertical de acento distintivo elegante */}
          <div className={`w-1.5 self-stretch rounded-full ${accentStyles.bar} shadow-2xs`} />

          <div>
            {/* Título principal con jerarquía visual de primer orden */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#152238] tracking-tight">
                {dashboardName}{' '}
                <span className="text-slate-400 font-normal">/</span>{' '}
                <span className="text-slate-700 font-extrabold">{viewName}</span>
              </h1>

              {cohortBadge && (
                <span
                  className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${accentStyles.badgeBg}`}
                >
                  {cohortBadge}
                </span>
              )}
            </div>

            {/* Subtítulo aclaratorio o descriptivo */}
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {rightContent && <div className="shrink-0">{rightContent}</div>}
      </div>

      {/* Sutil gradiente de acento en la base inferior */}
      <div
        className={`absolute bottom-[-1px] left-0 h-[2px] w-48 bg-gradient-to-r ${accentStyles.line}`}
      />
    </div>
  );
};
