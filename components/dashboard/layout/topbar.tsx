import type { TopBarItem } from "@/types/dashboard";

export function Topbar({ items }: { items: TopBarItem[] }) {
  return (
    <div className="grid gap-0 overflow-hidden rounded-[22px] border border-[#eadfce] bg-[#fbf8f3] shadow-[0_8px_30px_-22px_rgba(0,0,0,0.24)] sm:rounded-[26px] md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={`flex items-center gap-3 bg-white/65 px-3 py-2.5 backdrop-blur-sm sm:gap-4 sm:px-4 sm:py-3.5 ${
            index > 0 ? "border-l border-[#ece1d1]" : ""
          }`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#eef6e8] text-base text-[#0e5a2a] sm:h-10 sm:w-10 sm:text-lg">
            {item.icon}
          </span>
          <div className="min-w-0">
            <p className="text-[0.7rem] text-slate-500 sm:text-xs">{item.label}</p>
            <p className="truncate text-[0.82rem] font-semibold text-[#173b24] sm:text-[0.98rem]">{item.value}</p>
            {item.subvalue ? <p className="text-[0.7rem] text-slate-500 sm:text-xs">{item.subvalue}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
