'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
}

export default function AdminModal({ isOpen, onClose, titulo, children, footer, maxWidth }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(13,6,24,0.55)',
          backdropFilter: 'blur(6px)',
          zIndex: 50,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 51,
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-md)',
          maxWidth: `${maxWidth ?? 560}px`,
          width: 'calc(100vw - 32px)',
          maxHeight: '90dvh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-elevated)',
        }}
      >
        <div
          style={{
            padding: '20px 24px 18px',
            borderBottom: '1px solid var(--hairline)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'var(--foreground)',
              letterSpacing: '-0.005em',
            }}
          >
            {titulo}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--foreground-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: 4,
              transition: 'color 150ms ease',
            }}
            aria-label="Cerrar"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </div>
        {footer && (
          <div
            style={{
              padding: '14px 24px',
              borderTop: '1px solid var(--hairline)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              backgroundColor: 'var(--surface-2)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
