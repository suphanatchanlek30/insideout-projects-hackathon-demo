export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h1 className="text-[1.55rem] font-semibold tracking-tight text-[#153822] sm:text-[2.2rem] lg:text-[2.6rem]">{title}</h1>
      <p className="mt-2 max-w-4xl text-[0.78rem] leading-5 text-slate-500 sm:text-[0.92rem] sm:leading-6 lg:text-[1.02rem] lg:leading-7">{subtitle}</p>
    </div>
  );
}
