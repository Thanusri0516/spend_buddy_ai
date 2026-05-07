const logos = [
  { name: "Northstar", color: "hover:text-indigo-600" },
  { name: "PulseOps", color: "hover:text-emerald-500" },
  { name: "Linear Labs", color: "hover:text-sky-500" },
  { name: "Vector", color: "hover:text-violet-600" },
  { name: "Beam", color: "hover:text-cyan-500" },
  { name: "Runway", color: "hover:text-slate-900" },
  { name: "Caldera", color: "hover:text-amber-500" },
];

export function LogoMarquee() {
  const repeatedLogos = [...logos, ...logos];

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="logo-marquee-track flex w-max gap-3">
        {repeatedLogos.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className={`min-w-40 rounded-md border bg-card px-5 py-3 text-center text-sm font-semibold text-slate-500 opacity-50 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 ${logo.color}`}
          >
            {logo.name}
          </div>
        ))}
      </div>
    </div>
  );
}
