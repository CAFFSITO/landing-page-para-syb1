# SKILL: Design System SYB

Siempre que construyas componentes para este proyecto, seguí estas reglas estrictamente.
No inventés colores ni fuentes fuera de este sistema.

# SYB — Design System

## Identidad visual

El logo de SYB combina una montaña con geometría triangular. Representa **crecimiento, superación y base firme**. El diseño de toda la interfaz debe respirar esa misma energía: sólido, elegante, con autoridad.

---

## Paleta de colores

```css
/* Modo oscuro (default) */
--color-primary:    #3B1E63;   /* Púrpura Profundo — fondos principales */
--color-secondary:  #9D5CC0;   /* Lavanda/Amatista — acentos, hover, highlights */
--color-contrast:   #FFFFFF;   /* Blanco Puro — textos sobre fondo oscuro */
--color-accent:     #2D2D2D;   /* Gris Carbón — textos secundarios */

/* Semánticos */
--color-success:    #4ADE80;   /* Verde — entregables leídos, estados OK */
--color-danger:     #EF4444;   /* Rojo — entregables rechazados */
--color-warning:    #F59E0B;   /* Ámbar — estados pendientes */

/* Barra de progreso (llamativa, alto contraste) */
--color-progress-bg:   #1A0A2E;   /* Fondo de la barra */
--color-progress-fill: #C084FC;   /* Fill con glow púrpura brillante */
--color-progress-glow: rgba(192, 132, 252, 0.6); /* Box-shadow glow */
```

### Uso de colores por superficie

| Superficie | Fondo (dark) | Fondo (light) | Texto principal |
|------------|-------------|---------------|-----------------|
| Landing | `#0D0618` | `#F9F7FF` | `#FFFFFF` / `#2D2D2D` |
| Lobby | `#0F0720` | `#F3F0FF` | `#FFFFFF` / `#1A0A2E` |
| Admin | `#0D0618` | `#F9F7FF` | `#FFFFFF` / `#2D2D2D` |
| Cards/módulos | `#1C0D35` | `#FFFFFF` | heredado |
| Borders | `rgba(157,92,192,0.25)` | `rgba(59,30,99,0.15)` | — |

---

## Tipografía

**Fuente**: Merriweather (Google Fonts)  
**Import**: `https://fonts.google.com/specimen/Merriweather`

```css
/* Jerarquía */
h1 { font-size: 3.5rem;  font-weight: 700; line-height: 1.1; }  /* Hero */
h2 { font-size: 2.25rem; font-weight: 700; line-height: 1.2; }  /* Secciones */
h3 { font-size: 1.5rem;  font-weight: 700; line-height: 1.3; }  /* Subsecciones */
h4 { font-size: 1.125rem;font-weight: 700; }                    /* Labels, toggles */
p  { font-size: 1rem;    font-weight: 400; line-height: 1.7; }  /* Cuerpo */
em { font-style: italic; }                                       /* Citas, énfasis */
```

---

## Componentes de UI — Especificaciones

### Botón primario
```
Background: gradiente linear de #3B1E63 → #9D5CC0
Texto: #FFFFFF, Merriweather Bold
Border-radius: 6px
Padding: 14px 28px
Hover: brightness +15%, shadow 0 4px 20px rgba(157,92,192,0.4)
Transition: 200ms ease
```

### Botón secundario (outline)
```
Background: transparent
Border: 1.5px solid #9D5CC0
Texto: #9D5CC0
Hover: background #9D5CC020
```

### Cards / Módulos
```
Background: var(--card-bg)  → dark: #1C0D35 / light: #FFFFFF
Border: 1px solid var(--border-color)
Border-radius: 12px
Padding: 24px
Shadow: 0 2px 20px rgba(59,30,99,0.15)
```

### Inputs
```
Background: #0F0720 (dark) / #F3F0FF (light)
Border: 1.5px solid rgba(157,92,192,0.4)
Focus border: #9D5CC0
Border-radius: 6px
Texto: inherit
```

---

## Barra de progreso (Lobby)

La barra de progreso es el elemento más llamativo de toda la interfaz. Debe contrastar fuertemente con el resto del layout.

```
Posición: sticky top-0, full width, z-index alto
Altura: 56px
Background: #1A0A2E con sutil textura de ruido (noise)
Fill: gradiente animado #9D5CC0 → #C084FC → #E879F9
Glow: box-shadow 0 0 24px rgba(192,132,252,0.7) sobre el fill
Texto: "FASE X · N% completado" en blanco, Merriweather Bold
Animación: fill se expande con spring animation (Framer Motion)
Milestone markers: puntitos blancos en 33%, 66%, 100%
```

---

## Dark / Light Mode

Toggle visible en el navbar del Lobby y del Admin. Icono de luna (dark) / sol (light).

Implementación:
- Tailwind con `darkMode: 'class'`
- La clase `dark` se aplica al `<html>` tag
- Preferencia guardada en `localStorage`
- Valores por defecto: **dark mode**

---

## Árbol / Branch (Lobby)

El componente más complejo visualmente. Representa el roadmap del socio como un árbol vertical con ramas.

```
Layout: columna central con línea vertical continua (#9D5CC0, 2px)
Fases: nodos grandes circulares (32px) sobre la línea vertical
  → Completadas: fill #9D5CC0 con checkmark blanco
  → Activa: fill con pulse animation + glow
  → Pendiente: outline only

Entregables (ramas):
  → Se despliegan desde el nodo de fase hacia la derecha/izquierda
  → Línea horizontal de conexión (─────●)
  → Cards compactas con ícono de tipo (PDF / Video / Reunión / Reporte)
  → Estado leído: checkmark verde + opacity 0.7
  → Estado rechazado: borde rojo + ícono X
  → Estado pendiente: borde punteado + opacity 0.5

Toggle de fase: click en el nodo o header de fase → expand/collapse con Framer Motion
Transición: spring, stagger de 80ms entre hijos
```

---

## Íconos

Usar **Lucide React** (`lucide-react`). Íconos principales:

| Concepto | Ícono Lucide |
|----------|-------------|
| PDF | `FileText` |
| Video | `Play` |
| Reunión | `Video` |
| Reporte | `BarChart2` |
| Agenda | `Calendar` |
| Leído | `CheckCircle2` |
| Rechazado | `XCircle` |
| Pendiente | `Clock` |
| Dark mode | `Moon` |
| Light mode | `Sun` |
| Progreso | `TrendingUp` |
| Admin | `Settings` |
| Logout | `LogOut` |

---

## Microinteracciones

- Hover en cards: `translateY(-2px)` + shadow increase
- Click en entregable: se marca como leído con animación de checkmark (scale 0 → 1)
- Toggle de fase: spring expansion con fade-in de hijos
- Progress bar fill: spring animation al cargar
- Dark/light toggle: transición 300ms en todos los colores via CSS transitions