"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import PhaseNode from "@/components/lobby/PhaseNode";
import EntregableCard from "@/components/lobby/EntregableCard";
import ModalPDF from "@/components/lobby/ModalPDF";
import ModalVideo from "@/components/lobby/ModalVideo";
import ModalReporte from "@/components/lobby/ModalReporte";
import ModalAgenda from "@/components/lobby/ModalAgenda";
import ModalArchivo from "@/components/lobby/ModalArchivo";
import type { Socio, Entregable, Reunion, Reporte, Lectura } from "@/types";

type PhaseTreeProps = {
  socio: Socio;
  entregables: Entregable[];
  reuniones: Reunion[];
  reportes: Reporte[];
  lecturas: Lectura[];
};

type EstadoFase = "completada" | "activa" | "pendiente";

type ModalState =
  | { tipo: "pdf"; entregable: Entregable }
  | { tipo: "video"; entregable: Entregable }
  | { tipo: "reporte"; entregable: Entregable; item: Reporte | Reunion }
  | { tipo: "agenda"; entregable: Entregable; reunion: Reunion }
  | { tipo: "archivo"; entregable: Entregable }
  | null;

const FASES = [1, 2, 3] as const;
const NOMBRES_FASE: Record<number, string> = {
  1: "Fase 1 — Diagnóstico y Bases",
  2: "Fase 2 — Implementación",
  3: "Fase 3 — Escala y Consolidación",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function PhaseTree({
  socio,
  entregables,
  reuniones,
  reportes,
  lecturas,
}: PhaseTreeProps) {
  // Estado abierto/cerrado por fase, hidratado desde localStorage
  const [fasesAbiertas, setFasesAbiertas] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
  });
  const [hidratado, setHidratado] = useState(false);
  const [modalState, setModalState] = useState<ModalState>(null);

  useEffect(() => {
    const inicial: Record<number, boolean> = {};
    FASES.forEach((fase) => {
      const key = `syb_fase_open_${socio.id}_${fase}`;
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        inicial[fase] = saved === "true";
      } else {
        // Default: abierta solo la fase actual
        inicial[fase] = fase === socio.fase_actual;
      }
    });
    setFasesAbiertas(inicial);
    setHidratado(true);
  }, [socio.id, socio.fase_actual]);

  function toggleFase(fase: number) {
    setFasesAbiertas((prev) => {
      const next = { ...prev, [fase]: !prev[fase] };
      localStorage.setItem(`syb_fase_open_${socio.id}_${fase}`, String(next[fase]));
      return next;
    });
  }

  function calcularEstadoFase(fase: 1 | 2 | 3): EstadoFase {
    const done = { 1: socio.fase_1_done, 2: socio.fase_2_done, 3: socio.fase_3_done };
    if (done[fase]) return "completada";
    if (fase === socio.fase_actual) return "activa";
    return "pendiente";
  }

  function handleOpen(entregable: Entregable) {
    // Tipos distintos a pdf con archivo subido → visor genérico
    if (entregable.storage_path && entregable.tipo !== "pdf") {
      setModalState({ tipo: "archivo", entregable });
      return;
    }

    switch (entregable.tipo) {
      case "pdf":
        setModalState({ tipo: "pdf", entregable });
        break;
      case "video":
        setModalState({ tipo: "video", entregable });
        break;
      case "reporte": {
        // Buscar reporte matcheando por fase y orden === numero
        const match =
          reportes.find(
            (r) => r.fase === entregable.fase && r.numero === entregable.orden
          ) ?? reportes.find((r) => r.fase === entregable.fase);
        if (match) {
          setModalState({ tipo: "reporte", entregable, item: match });
        } else if (entregable.descripcion) {
          // Fallback: contenido en el campo descripcion del entregable
          const syntheticReporte = {
            id: entregable.id,
            socio_id: entregable.socio_id,
            fase: entregable.fase,
            numero: entregable.orden,
            titulo: entregable.titulo,
            contenido: entregable.descripcion,
            visible: true,
            created_at: entregable.created_at,
          };
          setModalState({ tipo: "reporte", entregable, item: syntheticReporte as Reporte });
        }
        break;
      }
      case "registro_reunion": {
        const match =
          reuniones.find(
            (r) => r.fase === entregable.fase && r.numero === entregable.orden
          ) ?? reuniones.find((r) => r.fase === entregable.fase);
        if (match) {
          setModalState({ tipo: "reporte", entregable, item: match });
        } else if (entregable.descripcion) {
          const syntheticReporte = {
            id: entregable.id,
            socio_id: entregable.socio_id,
            fase: entregable.fase,
            numero: entregable.orden,
            titulo: entregable.titulo,
            contenido: entregable.descripcion,
            visible: true,
            created_at: entregable.created_at,
          };
          setModalState({ tipo: "reporte", entregable, item: syntheticReporte as Reporte });
        }
        break;
      }
      case "agenda": {
        const match =
          reuniones.find(
            (r) => r.fase === entregable.fase && r.numero === entregable.orden
          ) ?? reuniones.find((r) => r.fase === entregable.fase);
        if (match) {
          setModalState({ tipo: "agenda", entregable, reunion: match });
        }
        break;
      }
    }
  }

  function cerrarModal() {
    setModalState(null);
  }

  // No renderizar hasta hidratar para evitar mismatch SSR/cliente en localStorage
  if (!hidratado) return null;

  return (
    <div style={{ position: "relative" }}>
      {/* Línea vertical hairline */}
      <div
        style={{
          position: "absolute",
          left: "14.5px",
          top: "16px",
          bottom: "16px",
          width: "1px",
          backgroundColor: "var(--hairline-strong)",
          zIndex: 0,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
        {FASES.map((fase) => {
          const estado = calcularEstadoFase(fase);
          const isOpen = fasesAbiertas[fase];
          const itemsFase = entregables
            .filter((e) => e.fase === fase)
            .sort((a, b) => a.orden - b.orden);

          return (
            <div key={fase} id={`fase-${fase}`} style={{ position: "relative", zIndex: 1 }}>
              {/* Header de fase — clickeable para toggle */}
              <button
                onClick={() => toggleFase(fase)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <PhaseNode estado={estado} faseNum={fase} />

                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-serif)",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      letterSpacing: "-0.005em",
                      color:
                        estado === "pendiente"
                          ? "var(--foreground-subtle)"
                          : "var(--foreground)",
                    }}
                  >
                    {NOMBRES_FASE[fase]}
                  </h3>
                  <p
                    style={{
                      margin: "3px 0 0",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "var(--foreground-subtle)",
                    }}
                  >
                    {itemsFase.length === 0
                      ? "Sin entregables"
                      : `${itemsFase.length} entregable${itemsFase.length !== 1 ? "s" : ""}`}
                  </p>
                </div>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: "var(--foreground-muted)", flexShrink: 0 }}
                >
                  <ChevronDown size={16} strokeWidth={1.5} />
                </motion.div>
              </button>

              {/* Accordion con stagger de hijos */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ overflow: "hidden" }}
                  >
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      style={{
                        paddingTop: "16px",
                        paddingLeft: "44px", // alinear con el texto del header
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {itemsFase.length === 0 ? (
                        <p style={{ color: "var(--foreground-subtle)", fontSize: "0.85rem", fontStyle: "italic" }}>
                          No hay entregables enviados en esta fase.
                        </p>
                      ) : (
                        itemsFase.map((entregable) => {
                          const yaLeido = lecturas.some(
                            (l) => l.entregable_id === entregable.id
                          );
                          return (
                            <motion.div key={entregable.id} variants={itemVariants}>
                              <EntregableCard
                                entregable={entregable}
                                yaLeido={yaLeido}
                                onOpen={handleOpen}
                              />
                            </motion.div>
                          );
                        })
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Modales */}
      {modalState?.tipo === "pdf" && (
        <ModalPDF
          isOpen
          onClose={cerrarModal}
          entregable={modalState.entregable}
        />
      )}
      {modalState?.tipo === "video" && (
        <ModalVideo
          isOpen
          onClose={cerrarModal}
          entregable={modalState.entregable}
        />
      )}
      {modalState?.tipo === "reporte" && (
        <ModalReporte
          isOpen
          onClose={cerrarModal}
          item={modalState.item}
        />
      )}
      {modalState?.tipo === "agenda" && (
        <ModalAgenda
          isOpen
          onClose={cerrarModal}
          reunion={modalState.reunion}
        />
      )}
      {modalState?.tipo === "archivo" && (
        <ModalArchivo
          isOpen
          onClose={cerrarModal}
          entregable={modalState.entregable}
        />
      )}
    </div>
  );
}
