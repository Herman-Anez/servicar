# Estética e Identidad Visual — Servicar

Documentación de implementación. Para el spec de tokens originales ver `docs/DESIGN.md`.

---

## Sistema de Diseño: Modern Pulse

**Light mode only.** Paleta roja de alta energía sobre fondos cálidos casi blancos. Sensación: urgencia operacional, claridad profesional. Inspirado en herramientas como Linear y Vercel pero con identidad de marca fuerte.

### Filosofía visual

- **Contraste duro**: rojo intenso `#bc0100` sobre fondo `#fff8f7` (blanco cálido rosado)
- **Tonal layering**: superficies escalonadas `surface-container-lowest → highest` sin sombras pesadas
- **Sin decoración innecesaria**: cero gradientes de fondo, cero sombras dramáticas en cards. La jerarquía viene del espaciado y el peso tipográfico
- **Acción siempre visible**: botones primarios en rojo, nunca gris o secundario por defecto

---

## Tokens CSS (`--sp-*`)

Definidos en `next/src/resources/custom.css`. Se usan directamente en `style={{}}` inline en componentes admin y vistas mecánico. **Nunca usar hex hardcodeado** — siempre `var(--sp-*)`.

### Colores principales

| Variable | Valor | Uso |
|---|---|---|
| `--sp-primary` | `#bc0100` | Botones, activos, acentos, badges |
| `--sp-on-primary` | `#ffffff` | Texto sobre primario |
| `--sp-error` | `#ba1a1a` | Estados de error, bloqueado |
| `--sp-on-surface` | `#2d1413` | Texto principal (marrón oscuro, no negro) |
| `--sp-on-surface-variant` | `#603e39` | Texto secundario, labels |
| `--sp-outline` | `#956d67` | Bordes funcionales |
| `--sp-outline-variant` | `#ebbbb4` | Bordes decorativos suaves |

### Superficies (tonal layering)

```
#ffffff  ← surface-container-lowest  (cards principales)
#fff0ef  ← surface-container-low     (sidebar, inputs)
#ffe9e7  ← surface-container         (chips, áreas hover)
#ffe2df  ← surface-container-high    (hover states)
#ffdad7  ← surface-container-highest (seleccionado activo)
#fff8f7  ← background / page         (fondo base)
```

---

## Tipografía

**Inter** en todos los niveles. Configurado en `next/src/resources/once-ui.config.ts` como `heading`, `body` y `label`. JetBrains Mono para código/IDs de ticket.

| Rol | Tamaño | Peso | Uso |
|---|---|---|---|
| Display | 32px / 700 | Bold | Títulos de sección |
| Headline | 22–24px / 600 | SemiBold | Cabeceras de página |
| Body | 14px / 400 | Regular | Contenido principal |
| Label | 12px / 500–700 | Medium/Bold | Metadatos, chips, badges |
| Micro | 9–11px / 700 | Bold + uppercase | Nav items, estado chips |

Letras capitales con `text-transform: uppercase` y `letter-spacing: 0.06–0.1em` para etiquetas de estado y nav ítems.

---

## Logo

Dos variantes en `next/public/`:

| Archivo | Uso |
|---|---|
| `servicar-logo.svg` | Versión principal. Fondo transparente, formas en rojo. Para fondos claros (sidebar, top bar, login) |
| `servicar-logo-2.svg` | Versión invertida. Para fondos oscuros o rojos (home page) |

Dimensiones de render por contexto:

| Contexto | Tamaño |
|---|---|
| Login page | 260×102px |
| Admin sidebar | 180×71px |
| Mecánico top bar | 100×39px |
| Home page | 340×133px (logo invertido) |

Ratio natural: **1800:705 ≈ 2.55:1**. No distorsionar.

---

## Clases utilitarias (`.sp-*`)

Definidas en `custom.css`. Solo para componentes que no usen Once UI primitivos.

| Clase | Descripción |
|---|---|
| `.sp-card` | Card con fondo `surface-container-lowest`, borde `outline-variant`, radio 12px |
| `.sp-input` | Input con fondo `surface-container-low`, focus ring rojo 2px |
| `.sp-btn-primary` | Botón rojo primario, ancho completo, transición hover/active |
| `.sp-btn-ghost` | Botón ghost con borde `outline-variant` |
| `.sp-nav-item` | Item de sidebar: hover rojo translúcido, activo con borde derecho rojo 3px |

---

## Patrones por contexto

### Home page (`/`)
Pantalla de entrada de marca. Fondo sólido `#ff0000`, logo invertido centrado, botón blanco. Animación dramática al cargar: fondo negro → rojo (1.4s), logo cae desde scale(5) + blur con easing `cubic-bezier(0.16,1,0.3,1)` (0.4s), flash blanco al impactar (1.1s), botón sube desde abajo (1.8s).

### Panel Admin (desktop-first, responsive ≥768px)
- Sidebar fija 256px: fondo `surface-container-low`, nav items con borde derecho activo
- Top bar: backdrop blur `rgba(255,248,247,0.85)`, sticky
- Contenido: padding 40px, máximo ancho libre
- Kanban 3 cols → 1 col en mobile (≤900px)
- Sidebar se convierte en overlay slide-in con hamburger en mobile (≤768px)

### Panel Mecánico (mobile-first)
- Top bar 48px sticky: logo compacto + botón perfil
- Bottom nav 56px: 3 tabs (Panel / Fichas / Taller), borde superior activo en `--sp-primary`
- Once UI layout components (`<Column>`, `<Row>`) para layout interno
- Cards con radio `m` (8px), gaps de 12–16px

### Chips de estado

| Estado | Color texto | Color fondo |
|---|---|---|
| `pendiente_revision` | `--sp-on-surface-variant` | `surface-container` |
| `requiere_cambios` | `warning-*` | `warning-alpha-weak` |
| `aprobado` | `success-*` | `success-alpha-weak` |
| `en_progreso` | `--sp-primary` | `#bc010015` |
| `bloqueado` | `--sp-error` | `error-alpha-weak` |
| `finalizado` | neutral | `neutral-alpha-weak` |

---

## Once UI — Configuración

`next/src/resources/once-ui.config.ts`:

```ts
theme:   "light"      // always light
brand:   "red"        // → var(--brand-*) ≈ #bc0100
accent:  "orange"     // secondary vermillion
neutral: "sand"       // neutro cálido (no gris frío)
border:  "rounded"    // 0.5rem base
surface: "filled"     // tonal layering sólido
```

> En componentes Once UI usar `onBackground="brand-strong"` para el rojo de marca. En componentes admin (HTML puro) usar `var(--sp-primary)` directamente.
