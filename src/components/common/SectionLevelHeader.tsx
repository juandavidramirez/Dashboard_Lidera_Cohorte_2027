import React from 'react';

interface Props {
  level: number | string;
  title: string;
  theme?: 'amber' | 'navy';
  badgeText?: string;
  rightContent?: React.ReactNode;
}

export const SectionLevelHeader: React.FC<Props> = ({
  level,
  title,
  theme = 'amber',
  badgeText,
  rightContent
}) => {
  const isNavy = theme === 'navy';

  return (
    <div
      className={`flex items-center justify-between gap-3 border-b-2 ${
        isNavy ? 'border-[#152238]' : 'border-amber-400'
      } pb-2`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`${
            isNavy
              ? 'bg-[#152238] text-white'
              : 'bg-[#F2A900] text-slate-950'
          } text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider shadow-2xs`}
        >
          {badgeText || `Nivel ${level}`}
        </span>
        <h2 className="text-sm font-black text-[#152238] uppercase tracking-wide">
          {title}
        </h2>
      </div>

      {rightContent && <div>{rightContent}</div>}
    </div>
  );
};
