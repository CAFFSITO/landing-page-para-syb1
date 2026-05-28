"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL ?? "#";

function MountainGlyph() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <div className="absolute inset-0 bg-secondary/10 rounded-full blur-[80px] scale-75" />
      <svg
        viewBox="0 0 320 320"
        className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mtn-fill" x1="160" y1="40" x2="160" y2="270" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#3B1E63" />
          </linearGradient>
          <linearGradient id="mtn-stroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#9D5CC0" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Subtle grid */}
        {[60, 110, 160, 210, 260].map((y) => (
          <line key={y} x1="20" y1={y} x2="300" y2={y} stroke="#9D5CC0" strokeOpacity="0.05" strokeWidth="1" />
        ))}

        {/* Outer triangle */}
        <motion.polygon
          points="160,38 295,265 25,265"
          fill="url(#mtn-fill)"
          fillOpacity="0.12"
          stroke="url(#mtn-stroke)"
          strokeWidth="1.5"
          animate={{ rotate: [0, 1.2, -1.2, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "160px 160px" }}
        />
        {/* Mid triangle */}
        <motion.polygon
          points="160,88 260,235 60,235"
          fill="url(#mtn-fill)"
          fillOpacity="0.2"
          stroke="url(#mtn-stroke)"
          strokeWidth="1"
          animate={{ rotate: [0, -1.8, 1.8, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          style={{ transformOrigin: "160px 160px" }}
        />
        {/* Peak triangle */}
        <motion.polygon
          points="160,126 220,210 100,210"
          fill="url(#mtn-fill)"
          fillOpacity="0.45"
          stroke="url(#mtn-stroke)"
          strokeWidth="1"
          animate={{ rotate: [0, 2.4, -2.4, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          style={{ transformOrigin: "160px 160px" }}
        />
        {/* Summit dot */}
        <motion.circle
          cx="160" cy="126" r="4.5"
          fill="#C084FC"
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Floating card — top right */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-6 right-0 lg:right-6 bg-[#1C0D35]/75 backdrop-blur-md border border-[rgba(157,92,192,0.25)] rounded-xl px-4 py-2.5"
      >
        <p className="text-[10px] font-bold text-secondary/70 uppercase tracking-[0.15em]">Sistema</p>
        <p className="text-xs text-contrast/80 font-medium">Diseñado, no improvisado</p>
      </motion.div>

      {/* Floating card — bottom left */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute bottom-8 left-0 lg:left-4 bg-[#1C0D35]/75 backdrop-blur-md border border-[rgba(157,92,192,0.25)] rounded-xl px-4 py-2.5"
      >
        <p className="text-[10px] font-bold text-secondary/70 uppercase tracking-[0.15em]">Garantía</p>
        <p className="text-xs text-contrast/80 font-medium">100% devuelto si no funciona</p>
      </motion.div>
    </div>
  );
}

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

export default function Hero() {
  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-[#0D0618]">
      {/* Bg glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-[15%] w-[480px] h-[480px] bg-primary/25 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 right-[10%] w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />
      </div>

      {/* Main grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center min-h-[100dvh]">

        {/* Left: text */}
        <div className="flex flex-col items-start">

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
            className="text-[2rem] sm:text-[2.5rem] lg:text-[3.25rem] font-bold text-contrast leading-[1.1] tracking-tight mb-6"
          >
            <span className="block">Los dueños de negocios físicos no tienen un</span>
            <span className="block">problema de tiempo.</span>
            <span className="block text-secondary mt-2">Tienen un problema de diseño.</span>
          </motion.h1>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.35 }}
            className="text-base md:text-lg text-contrast/60 max-w-lg mb-10 leading-relaxed"
          >
            Ayudamos a dueños de negocios físicos a que puedan escalar, creando sistemas de trabajo predecibles que permitan eliminar el techo que le pone límite a su crecimiento
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Link
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3.5 text-base font-bold text-contrast rounded-md bg-gradient-to-r from-primary to-secondary hover:brightness-110 shadow-[0_4px_20px_rgba(157,92,192,0.4)] transition-all duration-200 active:scale-[0.97]"
            >
              Agendá la llamada →
            </Link>
            <a
              href="#metodologia"
              className="text-sm font-bold text-secondary/70 hover:text-secondary transition-colors duration-200"
            >
              Ver metodología ↓
            </a>
          </motion.div>


        </div>

        {/* Right: visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, stiffness: 60, delay: 0.3 }}
          className="hidden lg:flex items-center justify-center h-full py-12"
        >
          <MountainGlyph />
        </motion.div>
      </div>

      {/* Scroll line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-8 z-10"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-secondary/50 to-transparent mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  );
}
