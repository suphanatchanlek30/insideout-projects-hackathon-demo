import type { AlertCardData } from "@/types/dashboard";

export function AlertCard({ alert }: { alert: AlertCardData }) {
  const tone =
    alert.tone === "red"
      ? "border-red-100 bg-[linear-gradient(180deg,#fff8f7_0%,#fff6f4_100%)] text-red-600"
      : "border-amber-100 bg-[linear-gradient(180deg,#fffbf2_0%,#fff8ec_100%)] text-amber-600";

  return (
    <article className={`rounded-[22px] border p-3.5 sm:rounded-[26px] sm:p-5 ${tone}`}>
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-sm sm:h-12 sm:w-12 sm:text-2xl">
          {alert.tone === "red" ? "!" : "i"}
        </span>
        <div>
          <h3 className="text-[1.05rem] font-semibold leading-tight text-[#1c251f] sm:text-[1.45rem]">{alert.title}</h3>
          <p className="mt-2 text-[0.82rem] leading-5 text-slate-600 sm:mt-2.5 sm:text-sm sm:leading-6">{alert.description}</p>
          <p className="mt-3 text-[0.9rem] font-semibold leading-tight sm:mt-4 sm:text-[1.15rem]">{alert.actionText}</p>
        </div>
      </div>
    </article>
  );
}
