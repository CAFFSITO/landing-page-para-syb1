"use client";

/**
 * ProgramaRoadmap — componente principal de la pestaña "Mi programa".
 *
 * Muestra: bienvenida, roadmap de 3 fases con scroll horizontal
 * en desktop / vertical en mobile, y nota al pie.
 */

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Search,
  FileText,
  BarChart2,
  Video,
  Settings,
  Rocket,
  ShieldCheck,
  Users,
  ArrowRight,
  Info,
} from "lucide-react";
import RoadmapFaseCard from "@/components/lobby/RoadmapFaseCard";
import RoadmapNav from "@/components/lobby/RoadmapNav";

type ProgramaRoadmapProps = {
  nombreSocio: string;
  empresaNombre: string;
};

/* ─── Datos de las fases (basado en la metodología SYB) ───────────── */

const FASES_DATA = [
  {
    fase: 1 as const,
    titulo: "Diagnóstico",
    duracion: "Semanas 1–2",
    hitos: [
      {
        icono: <Search size={24} />,
        titulo: "Auditoría del negocio",
        descripcion:
          "Revisamos cada proceso de [Empresa] para identificar cuellos de botella y oportunidades ocultas.",
      },
      {
        icono: <FileText size={24} />,
        titulo: "Mapeo de procesos (COM)",
        descripcion:
          "Construimos el Current Operating Model: un mapa visual de cómo opera [Empresa] hoy.",
      },
      {
        icono: <BarChart2 size={24} />,
        titulo: "Roadmap de priorización",
        descripcion:
          "Definimos qué resolver primero según impacto y viabilidad para [Empresa].",
      },
    ],
  },
  {
    fase: 2 as const,
    titulo: "Diseño y Ejecución",
    duracion: "Semanas 3–5",
    hitos: [
      {
        icono: <Settings size={24} />,
        titulo: "Diseño del sistema ideal (TOM)",
        descripcion:
          "Diseñamos el Target Operating Model: la arquitectura que [Empresa] necesita para escalar.",
      },
      {
        icono: <Rocket size={24} />,
        titulo: "Construcción iterativa",
        descripcion:
          "Construimos el sistema con validaciones semanales. Nada se entrega sin tu aprobación.",
      },
      {
        icono: <Settings size={24} />,
        titulo: "Primera automatización atómica",
        descripcion:
          "Entregamos la primera pieza funcional del sistema para que [Empresa] la pruebe en real.",
      },
    ],
  },
  {
    fase: 3 as const,
    titulo: "Validación",
    duracion: "Semanas 6–8",
    hitos: [
      {
        icono: <Users size={24} />,
        titulo: "Capacitaciones progresivas",
        descripcion:
          "Tu equipo aprende a operar el sistema sin depender de nosotros.",
      },
      {
        icono: <ShieldCheck size={24} />,
        titulo: "Simulacro de autonomía",
        descripcion:
          "Durante 28 días, [Empresa] opera el sistema con nuestro seguimiento semanal.",
      },
      {
        icono: <Video size={24} />,
        titulo: "Cierre y entrega formal",
        descripcion:
          "4 reuniones de seguimiento, documentación final y cierre del programa.",
      },
    ],
  },
];

/* ─── Componente principal ────────────────────────────────────────── */

export default function ProgramaRoadmap({
  nombreSocio,
  empresaNombre,
}: ProgramaRoadmapProps) {
  const [faseActiva, setFaseActiva] = useState<1 | 2 | 3>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(topRef, { once: true });

  /** Scroll a la fase seleccionada en el carril horizontal */
  function handleFaseChange(fase: 1 | 2 | 3) {
    setFaseActiva(fase);

    // Scroll a la card correspondiente en desktop
    const container = containerRef.current;
    if (container) {
      const cards = container.querySelectorAll<HTMLElement>("[data-fase-card]");
      const target = cards[fase - 1];
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }

  return (
    <motion.div
      ref={topRef}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.15 },
        },
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      {/* ─── 1) Encabezado de bienvenida ──────────────────────────── */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          background: "linear-gradient(135deg, #1C0D35, #0F0720)",
          border: "1px solid rgba(157,92,192,0.25)",
          borderRadius: "16px",
          padding: "28px 24px",
        }}
      >
        <h2
          style={{
            fontFamily: "Merriweather, Georgia, serif",
            fontWeight: 700,
            fontSize: "1.75rem",
            color: "#FFFFFF",
            margin: "0 0 12px 0",
            lineHeight: 1.2,
          }}
        >
          Hola, {nombreSocio}.{" "}
          <motion.span
            style={{
              display: "inline-block",
              transformOrigin: "70% 80%",
            }}
            animate={{ rotate: [-20, 10, -20] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            👋
          </motion.span>
        </h2>
        <p
          style={{
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.7,
            margin: "0 0 8px 0",
          }}
        >
          Bienvenido al portal de tu programa.
          Acá vas a encontrar todo lo que necesitás saber sobre el proceso de transformación de{" "}
          <strong style={{ color: "#C084FC" }}>{empresaNombre}</strong>.
        </p>
        <p
          style={{
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Debajo podés explorar las 3 fases del programa: qué hacemos en cada una, qué
          entregables vas a recibir y cómo vamos a trabajar juntos durante las próximas 8 semanas.
        </p>
      </motion.div>

      {/* ─── 2) Roadmap de fases ──────────────────────────────────── */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Navegación arriba */}
        <RoadmapNav faseActiva={faseActiva} onFaseChange={handleFaseChange} />

        {/* Carril de cards: horizontal (desktop) / vertical (mobile) */}
        <div
          ref={containerRef}
          className="flex flex-col gap-6 md:flex-row md:gap-0 md:overflow-x-auto md:snap-x md:snap-mandatory md:pb-4"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(157,92,192,0.3) transparent",
          }}
        >
          {FASES_DATA.map((faseData, i) => (
            <div
              key={faseData.fase}
              data-fase-card
              style={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
              className="flex-col md:flex-row"
            >
              <RoadmapFaseCard
                fase={faseData.fase}
                titulo={faseData.titulo}
                duracion={faseData.duracion}
                hitos={faseData.hitos}
                empresaNombre={empresaNombre}
              />

              {/* Conector entre fases (solo entre cards, no después de la última) */}
              {i < FASES_DATA.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 12px",
                  }}
                  className="rotate-90 md:rotate-0"
                >
                  <motion.div
                    animate={{ x: [0, 6, 0] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight size={20} color="#9D5CC0" />
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── 3) Nota al pie ───────────────────────────────────────── */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
          backgroundColor: "rgba(157,92,192,0.06)",
          border: "1px solid rgba(157,92,192,0.19)",
          borderRadius: "10px",
          padding: "16px 20px",
        }}
      >
        <Info size={18} color="#9D5CC0" style={{ flexShrink: 0, marginTop: "2px" }} />
        <p
          style={{
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.7,
            margin: 0,
            fontStyle: "italic",
          }}
        >
          Las duraciones son estimadas y pueden ajustarse según las necesidades de{" "}
          {empresaNombre}. Tu consultor te mantendrá informado sobre cualquier cambio en el
          cronograma.
        </p>
      </motion.div>
    </motion.div>
  );
}
