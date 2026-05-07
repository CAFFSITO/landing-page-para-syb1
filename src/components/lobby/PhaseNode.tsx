"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

type PhaseNodeProps = {
  estado: "completada" | "activa" | "pendiente";
  faseNum: 1 | 2 | 3;
};

const SIZE = 30;

export default function PhaseNode({ estado, faseNum }: PhaseNodeProps) {
  if (estado === "completada") {
    return (
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          backgroundColor: "var(--color-secondary)",
          color: "var(--color-contrast)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Check size={15} strokeWidth={2.4} />
      </div>
    );
  }

  if (estado === "activa") {
    return (
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: SIZE,
          height: SIZE,
          flexShrink: 0,
        }}
      >
        <motion.span
          animate={{ scale: [1, 1.55, 1], opacity: [0.45, 0, 0.45] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1px solid var(--color-secondary)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            backgroundColor: "var(--color-secondary)",
            color: "var(--color-contrast)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            fontSize: "0.72rem",
          }}
        >
          0{faseNum}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        width: SIZE,
        height: SIZE,
        borderRadius: "50%",
        border: "1px solid var(--hairline-strong)",
        backgroundColor: "var(--background)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
        fontSize: "0.7rem",
        color: "var(--foreground-subtle)",
      }}
    >
      0{faseNum}
    </div>
  );
}
