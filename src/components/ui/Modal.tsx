"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  tipoBadge: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Modal({
  isOpen,
  onClose,
  titulo,
  tipoBadge,
  children,
  footer,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(13,6,24,0.55)",
            backdropFilter: "blur(6px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <motion.div
            initial={{ scale: 0.97, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--surface-1)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius-md)",
              maxWidth: "860px",
              width: "100%",
              maxHeight: "90dvh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "var(--shadow-elevated)",
            }}
          >
            {/* Header — eyebrow mono + title serif */}
            <div
              style={{
                padding: "20px 24px 18px",
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: "0 0 6px 0",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "var(--foreground-subtle)",
                  }}
                >
                  {tipoBadge}
                </p>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-serif)",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    color: "var(--foreground)",
                    letterSpacing: "-0.005em",
                    lineHeight: 1.25,
                  }}
                >
                  {titulo}
                </h2>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--foreground-muted)",
                  display: "flex",
                  alignItems: "center",
                  padding: "4px",
                  flexShrink: 0,
                  transition: "color 150ms ease",
                }}
                aria-label="Cerrar"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div
              style={{
                padding: "24px",
                flex: 1,
                overflowY: "auto",
              }}
            >
              {children}
            </div>

            {footer && (
              <div
                style={{
                  padding: "14px 24px",
                  borderTop: "1px solid var(--hairline)",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  backgroundColor: "var(--surface-2)",
                }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
