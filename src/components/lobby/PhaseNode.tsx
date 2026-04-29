"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type PhaseNodeProps = {
  estado: "completada" | "activa" | "pendiente";
  faseNum: 1 | 2 | 3;
};

export default function PhaseNode({ estado, faseNum }: PhaseNodeProps) {
  const SIZE = 32;

  if (estado === "completada") {
    return (
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          backgroundColor: "#9D5CC0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2} />
      </div>
    );
  }

  if (estado === "activa") {
    return (
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "relative",
          zIndex: 2,
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          backgroundColor: "#9D5CC0",
          boxShadow: "0 0 16px rgba(157,92,192,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "Merriweather, Georgia, serif",
            fontWeight: 700,
            fontSize: "0.75rem",
            color: "#FFFFFF",
          }}
        >
          {faseNum}
        </span>
      </motion.div>
    );
  }

  // Pendiente
  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        width: SIZE,
        height: SIZE,
        borderRadius: "50%",
        border: "2px solid rgba(157,92,192,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "Merriweather, Georgia, serif",
          fontWeight: 700,
          fontSize: "0.75rem",
          color: "rgba(157,92,192,0.4)",
        }}
      >
        {faseNum}
      </span>
    </div>
  );
}
