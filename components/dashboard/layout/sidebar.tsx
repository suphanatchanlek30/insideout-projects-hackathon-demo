import type { DashboardPageKey, SidebarItem } from "@/types/dashboard";

export function Sidebar({
  items,
  activePage,
  onSelect,
  isOpen,
  onClose,
}: {
  items: SidebarItem[];
  activePage: DashboardPageKey;
  onSelect: (key: DashboardPageKey) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/35 transition-opacity duration-200 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`relative z-50 overflow-hidden bg-[linear-gradient(180deg,#063919_0%,#0a4624_40%,#082f16_100%)] text-white transition-transform duration-300 lg:static lg:z-auto lg:min-h-screen lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed inset-y-0 left-0 w-[84vw] max-w-[280px] lg:w-auto`}
      >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.16),transparent_34%)]" />
      <div className="absolute inset-x-0 bottom-0 h-96 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.09),transparent_52%)]" />
      <div className="relative flex h-full flex-col px-4 py-4 sm:px-4 sm:py-5">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4 sm:pb-5">
          <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-white/8 ring-1 ring-white/10 sm:h-12 sm:w-12 sm:rounded-[16px]">
            <span className="text-xl leading-none sm:text-2xl">🦜</span>
          </div>
          <div>
            <p className="font-serif text-[1.55rem] leading-none tracking-tight sm:text-[1.85rem]">Cafe</p>
            <p className="-mt-1 font-serif text-[1.8rem] leading-none tracking-tight sm:text-[2.15rem]">Amazon</p>
          </div>
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xl lg:hidden"
          >
            ×
          </button>
        </div>

        <p className="mt-4 max-w-48 text-[0.92rem] leading-6 text-emerald-50/82 sm:mt-5 sm:max-w-52 sm:text-[1rem] sm:leading-7">
          AI Replenishment
          <br />
          Co-pilot
        </p>

        <div className="mt-4 h-px w-full bg-white/10 sm:mt-5" />
        <nav className="mt-3 space-y-2 sm:mt-4">
          {items.map((item) => {
            const isActive = item.key === activePage;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelect(item.key)}
                className={`flex w-full items-center gap-3 rounded-[16px] px-3 py-2.5 text-left transition sm:gap-4 sm:px-4 sm:py-3.5 ${
                  isActive
                    ? "bg-white/12 shadow-[inset_4px_0_0_0_rgba(134,239,172,0.98)] ring-1 ring-white/10"
                    : "hover:bg-white/6"
                }`}
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-[13px] ${isActive ? "bg-white/10" : "bg-white/7"} text-sm sm:h-9 sm:w-9 sm:text-base`}>
                  {item.icon}
                </span>
                <span className="text-[0.85rem] font-medium text-white/95 sm:text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-4 rounded-[22px] border border-white/10 bg-white/6 p-3.5 backdrop-blur-sm sm:mt-auto sm:rounded-[24px] sm:p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-100/60">Help & Support</p>
          <p className="mt-2.5 text-xs leading-5 text-emerald-50/76 sm:mt-3 sm:text-sm sm:leading-6">
            ใช้หน้าสรุปนี้เพื่อดูความเสี่ยง สั่งซื้อ และผลกระทบต่อธุรกิจในมุมเดียว
          </p>
        </div>
      </div>
      </aside>
    </>
  );
}
