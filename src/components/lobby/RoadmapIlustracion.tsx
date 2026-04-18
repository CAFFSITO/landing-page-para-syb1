/**
 * Ilustraciones SVG inline para cada fase del roadmap.
 * Server Component — sin interactividad.
 *
 * Colores: solo los del design system (#9D5CC0, #C084FC, #3B1E63, #1C0D35).
 */

type RoadmapIlustracionProps = {
  fase: 1 | 2 | 3;
};

/* ─── Fase 1: Lupa sobre mapa esquemático ─────────────────────────── */
function Fase1Svg() {
  return (
    <svg
      width="200"
      height="160"
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="fase1-title"
    >
      <title id="fase1-title">Fase 1 — Diagnóstico: lupa sobre mapa esquemático</title>

      {/* Plano de fondo: nodos y líneas de mapa */}
      <line x1="30" y1="120" x2="80" y2="90" stroke="#3B1E63" strokeWidth="2" />
      <line x1="80" y1="90" x2="140" y2="110" stroke="#3B1E63" strokeWidth="2" />
      <line x1="140" y1="110" x2="170" y2="80" stroke="#3B1E63" strokeWidth="2" />
      <line x1="80" y1="90" x2="60" y2="50" stroke="#3B1E63" strokeWidth="2" />
      <line x1="60" y1="50" x2="120" y2="40" stroke="#3B1E63" strokeWidth="2" />
      <line x1="120" y1="40" x2="140" y2="110" stroke="#3B1E63" strokeWidth="2" />
      <line x1="120" y1="40" x2="170" y2="80" stroke="#3B1E63" strokeWidth="2" />

      {/* Nodos del mapa */}
      <circle cx="30" cy="120" r="5" fill="#1C0D35" stroke="#9D5CC0" strokeWidth="1.5" />
      <circle cx="80" cy="90" r="5" fill="#1C0D35" stroke="#9D5CC0" strokeWidth="1.5" />
      <circle cx="140" cy="110" r="5" fill="#1C0D35" stroke="#9D5CC0" strokeWidth="1.5" />
      <circle cx="170" cy="80" r="5" fill="#1C0D35" stroke="#9D5CC0" strokeWidth="1.5" />
      <circle cx="60" cy="50" r="5" fill="#1C0D35" stroke="#9D5CC0" strokeWidth="1.5" />
      <circle cx="120" cy="40" r="5" fill="#1C0D35" stroke="#9D5CC0" strokeWidth="1.5" />

      {/* Lupa — aro */}
      <circle
        cx="100"
        cy="75"
        r="36"
        fill="none"
        stroke="#C084FC"
        strokeWidth="3"
        opacity="0.9"
      />
      {/* Lupa — cristal translúcido */}
      <circle cx="100" cy="75" r="34" fill="#9D5CC0" opacity="0.1" />
      {/* Lupa — mango */}
      <line
        x1="126"
        y1="101"
        x2="152"
        y2="130"
        stroke="#C084FC"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Brillito en el cristal */}
      <path
        d="M86 60 Q88 54 94 56"
        stroke="#C084FC"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Fase 2: Engranajes encajados ────────────────────────────────── */
function Fase2Svg() {
  /**
   * Genera un path SVG de engranaje con dientes.
   */
  function gearPath(cx: number, cy: number, innerR: number, outerR: number, teeth: number): string {
    const step = (Math.PI * 2) / teeth;
    const half = step / 4;
    let d = "";

    for (let i = 0; i < teeth; i++) {
      const angle = step * i - Math.PI / 2;
      const x1 = cx + innerR * Math.cos(angle - half);
      const y1 = cy + innerR * Math.sin(angle - half);
      const x2 = cx + outerR * Math.cos(angle - half * 0.5);
      const y2 = cy + outerR * Math.sin(angle - half * 0.5);
      const x3 = cx + outerR * Math.cos(angle + half * 0.5);
      const y3 = cy + outerR * Math.sin(angle + half * 0.5);
      const x4 = cx + innerR * Math.cos(angle + half);
      const y4 = cy + innerR * Math.sin(angle + half);

      if (i === 0) d += `M${x1.toFixed(1)},${y1.toFixed(1)} `;
      d += `L${x2.toFixed(1)},${y2.toFixed(1)} L${x3.toFixed(1)},${y3.toFixed(1)} L${x4.toFixed(1)},${y4.toFixed(1)} `;
    }
    d += "Z";
    return d;
  }

  return (
    <svg
      width="200"
      height="160"
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="fase2-title"
    >
      <title id="fase2-title">Fase 2 — Diseño y Ejecución: engranajes trabajando juntos</title>

      {/* Engranaje grande */}
      <path d={gearPath(80, 80, 30, 40, 10)} fill="#3B1E63" stroke="#9D5CC0" strokeWidth="1.5" />
      <circle cx="80" cy="80" r="12" fill="#1C0D35" stroke="#9D5CC0" strokeWidth="1.5" />

      {/* Engranaje mediano */}
      <path d={gearPath(135, 60, 20, 28, 8)} fill="#3B1E63" stroke="#C084FC" strokeWidth="1.5" />
      <circle cx="135" cy="60" r="8" fill="#1C0D35" stroke="#C084FC" strokeWidth="1.5" />

      {/* Engranaje pequeño */}
      <path d={gearPath(148, 110, 14, 20, 7)} fill="#3B1E63" stroke="#9D5CC0" strokeWidth="1.5" />
      <circle cx="148" cy="110" r="6" fill="#1C0D35" stroke="#9D5CC0" strokeWidth="1.5" />

      {/* Puntos de contacto */}
      <circle cx="112" cy="68" r="3" fill="#C084FC" opacity="0.8" />
      <circle cx="118" cy="95" r="3" fill="#C084FC" opacity="0.8" />
      <circle cx="139" cy="88" r="3" fill="#C084FC" opacity="0.8" />
    </svg>
  );
}

/* ─── Fase 3: Cohete + escudo geométrico ──────────────────────────── */
function Fase3Svg() {
  return (
    <svg
      width="200"
      height="160"
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="fase3-title"
    >
      <title id="fase3-title">Fase 3 — Validación: cohete con escudo de protección</title>

      {/* Escudo geométrico */}
      <path
        d="M100 20 L145 45 L145 100 L100 130 L55 100 L55 45 Z"
        fill="#1C0D35"
        stroke="#3B1E63"
        strokeWidth="2"
      />
      <path
        d="M100 30 L138 50 L138 96 L100 122 L62 96 L62 50 Z"
        fill="none"
        stroke="#9D5CC0"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Cohete cuerpo */}
      <path
        d="M100 35 L92 75 L92 100 L100 108 L108 100 L108 75 Z"
        fill="#3B1E63"
        stroke="#9D5CC0"
        strokeWidth="1.5"
      />
      {/* Ventana del cohete */}
      <circle cx="100" cy="65" r="6" fill="#1C0D35" stroke="#C084FC" strokeWidth="1.5" />
      {/* Aletas */}
      <path d="M92 90 L80 108 L92 100 Z" fill="#9D5CC0" opacity="0.8" />
      <path d="M108 90 L120 108 L108 100 Z" fill="#9D5CC0" opacity="0.8" />
      {/* Punta del cohete */}
      <path d="M100 35 L95 50 L105 50 Z" fill="#C084FC" />

      {/* Estela de partículas */}
      <circle cx="96" cy="118" r="3" fill="#C084FC" opacity="0.7" />
      <circle cx="104" cy="116" r="2.5" fill="#9D5CC0" opacity="0.6" />
      <circle cx="100" cy="124" r="4" fill="#C084FC" opacity="0.5" />
      <circle cx="93" cy="128" r="2" fill="#9D5CC0" opacity="0.4" />
      <circle cx="107" cy="130" r="2" fill="#9D5CC0" opacity="0.4" />
      <circle cx="100" cy="134" r="3" fill="#C084FC" opacity="0.3" />
      <circle cx="96" cy="140" r="2" fill="#9D5CC0" opacity="0.2" />
      <circle cx="104" cy="142" r="1.5" fill="#C084FC" opacity="0.2" />
    </svg>
  );
}

export default function RoadmapIlustracion({ fase }: RoadmapIlustracionProps) {
  switch (fase) {
    case 1:
      return <Fase1Svg />;
    case 2:
      return <Fase2Svg />;
    case 3:
      return <Fase3Svg />;
  }
}
