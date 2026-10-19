export default function SectionHeader({ title, subtitle, count }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-5 gap-2">
      <div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
          <span className="border-l-4 border-[#E50914] pl-3">{title}</span>
        </h1>
        {subtitle && (
          <p className="text-[#B3B3B3] text-sm sm:text-base mt-1 pl-4">{subtitle}</p>
        )}
      </div>
      {count !== undefined && (
        <span className="text-xs sm:text-sm font-semibold text-[#B3B3B3] bg-[#1F1F1F] px-3 py-1.5 rounded-full border border-white/10 self-start sm:self-auto">
          {count} {count === 1 ? 'Movie' : 'Movies'}
        </span>
      )}
    </div>
  );
}
