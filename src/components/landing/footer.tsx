import Link from "next/link";

const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL ?? "#";

const navLinks = [
  { label: "El problema", href: "#problema" },
  { label: "Metodología", href: "#metodologia" },
  { label: "Pilares", href: "#pilares" },
  { label: "Garantía", href: "#garantia" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#060310]">
      {/* Gradient top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(157,92,192,0.35)] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Col 1: Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold text-contrast tracking-tight">SYB</span>
            <span className="text-[10px] font-normal text-contrast/30 tracking-[0.2em] uppercase mt-0.5">
              Scale Your Business
            </span>
          </div>
          <p className="text-sm text-contrast/40 leading-relaxed max-w-[220px] mt-1">
            Infraestructura operativa a medida para negocios que quieren crecer sin caos.
          </p>
        </div>

        {/* Col 2: Nav */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-contrast/30 mb-1">
            Secciones
          </p>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-contrast/50 hover:text-contrast transition-colors duration-200 w-fit"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Col 3: CTA */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-contrast/30 mb-1">
            Empezá
          </p>
          <p className="text-sm text-contrast/45 leading-relaxed max-w-[220px]">
            El primer paso es un diagnóstico gratuito. Sin compromiso.
          </p>
          <Link
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center px-5 py-2.5 text-sm font-bold text-secondary border-[1.5px] border-secondary rounded-md transition-all duration-200 hover:bg-secondary/10"
          >
            Agendá la llamada
          </Link>
        </div>
      </div>


    </footer>
  );
}
