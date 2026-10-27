# omnirush.ai (Signalpath) — 3D Spatial UI Architecture & Design System

## Executive Overview
**omnirush.ai (Signalpath)** implements a high-performance, GPU-accelerated **3D Spatial Interface Architecture** tailored for high-stakes multichain forensics. It breaks away from flat, low-contrast "vibe coded" glassmorphic UI by replacing them with **physically grounded, thick machined light-acrylic and claymorphic slabs** hovering dynamically over an independent kinetic canvas plane.

---

## 1. Two-Plane Viewport Separation Architecture

The interface strictly decouples visual motion and depth from content readability across two distinct spatial layers:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ VIEWPORT ROOT                                                          │
│                                                                        │
│  [LAYER 1: DEEP INTERACTIVE CANVAS PLANE] (z-index: 0, fixed)          │
│  ├── Dynamic 60fps HTML5 Kinetic Constellation Canvas                  │
│  ├── Micro-repulsion particle field (Electric Blue / Cyan)            │
│  ├── Diffused ambient illumination fields (Glow Orbs)                  │
│  └── Geometric Cartesian coordinate ticks & alignment marks            │
│                                                                        │
│  [LAYER 2: FLOATING 3D CONTAINER INTERFACE] (z-index: 10, dynamic)    │
│  ├── Sticky blade navigation with micro-elevation                      │
│  ├── Floating Flagship Capsule (Command Station & Address Search)      │
│  ├── 3D Gimbal Radar & Gyroscopic Core Assembly                        │
│  └── Machined Acrylic Forensic Report Slabs (Depth 1, 2, 3)            │
└────────────────────────────────────────────────────────────────────────┘
```

### Why Layer Separation Matters
- **Zero Text Bleed-Through:** Background animations, particles, and radial energy fields run on a dedicated hardware-composited canvas layer behind the DOM. Content cards possess high-opacity frosted satin bases (`rgba(255, 255, 255, 0.94)` with `saturate(180%)`), guaranteeing zero interference with contrast or legibility.
- **Pointer Event Isolation:** The background canvas sets `pointer-events: none`. Canvas coordinates are driven via passive global window pointer tracking, ensuring that interactive buttons, inputs, and tables receive 100% uninterrupted browser event handling.

---

## 2. Thick 3D Container Physics (Claymorphic & Machined Acrylic)

Every container in Signalpath behaves as a physical slab of machined optic-grade acrylic with simulated volumetric thickness and light diffraction:

```html
<article class="floating-container tactile-slab" data-depth="2">
  <!-- Semantic, accessible HTML content -->
</article>
```

### The 4 Anatomical Depth Cues:
1. **Micro-Beveled Inner Rim (Top/Left Light Catch):**
   Rendered via `::before` pseudo-element:
   - `border-top: 1.5px solid rgba(255, 255, 255, 1.0)`
   - `border-left: 1.5px solid rgba(255, 255, 255, 1.0)`
   - `border-bottom: 1px solid rgba(226, 232, 240, 1.0)`
   This simulates light striking the polished upper-left chamfer of a physical acrylic slab.

2. **Dual-Layered Ambient Occlusion & Elevation:**
   Instead of a single blurry shadow, each container combines:
   - **Grounding Contact Shadow:** A tight, crisp dark-slate shadow (`0 2px 4px rgba(9, 30, 58, 0.05)`) pinning the container's proximity.
   - **Massive Volumetric Lift Shadow:** A wide, low-opacity electric-tinted shadow (`0 35px 70px -10px rgba(9, 30, 58, 0.09)`) providing spatial separation from the canvas.

3. **Sub-Surface Ambient Shadow Footprint:**
   Rendered via `::after` pseudo-element with `filter: blur(20px)` and negative z-index, projecting an elliptical volumetric shadow that dynamically casts backward and stretches based on pointer displacement.

4. **Frosted Satin Optical Finish:**
   Uses `backdrop-filter: blur(28px) saturate(180%)` over an ultra-clean white base. It diffuses ambient background illumination without muddying text contrast.

---

## 3. High-Performance GPU Parallax & Gyroscopic Tracking

The mouse-parallax engine in `public/app.js` runs on a dedicated, non-blocking hardware-compositing pipeline:

```
[Window PointerMove (Passive)]
       │
       ▼
[Store Raw Target Coordinates (mouse.targetX, mouse.targetY)]
       │
       ▼
[Single requestAnimationFrame Loop]
       ├── Smooth Dampening / Linear Interpolation (Lerp: 0.12 factor)
       ├── Compute Normalized Viewport Coordinates (-0.5 to +0.5)
       ├── Dynamic 3D Radar Gyroscope Gimbal Pitch & Yaw
       └── Per-Container Center-Relative Offset Calculation:
             localX = (cursorX - cardCenterX) / (width * 0.75)
             localY = (cursorY - cardCenterY) / (height * 0.75)
             tiltX  = localX * depth * 2.8°
             tiltY  = -localY * depth * 2.4°
             shadowX = localX * depth * 12px
             shadowY = 14px + |localY| * depth * 8px
       │
       ▼
[Apply CSS Custom Properties & GPU Transform]
       transform: perspective(1200px) rotateX(...) rotateY(...)
```

### Performance Optimizations:
- **Offscreen Viewport Culling:** Containers outside the current viewport are skipped during frame updates.
- **Hardware Compositing:** Parallax updates touch only CSS variables and CSS `transform` properties (`rotateX`, `rotateY`), triggering zero layout recalibration or reflows.
- **Scroll Integrity:** Native smooth scrolling is never intercepted or hijacked.
- **Reduced Motion Support:** When `prefers-reduced-motion: reduce` is active, all tilt calculations, ring orbits, and translations are automatically nullified.

---

## 4. High-Contrast Light Scheme (Zero Purples, Zero Dark Mode)

The design system enforces strict brand discipline: **No dark mode, no deep grays, no purples, violets, or dark magentas.**

| Token Role | Hex / HSL | Usage | Accessibility Contrast |
|---|---|---|---|
| **Canvas Base** | `#f4f8fc` | Deep ambient canvas | Base canvas |
| **Surface Solid** | `#ffffff` | Machined acrylic panel body | 100% white base |
| **Ink Primary** | `#091e3a` | High-contrast headlines & values | **14.2:1 (AAA Pass)** |
| **Ink Secondary**| `#1e3a5f` | Subheadings, table rows, labels | **9.6:1 (AAA Pass)** |
| **Ink Muted** | `#475f7b` | Captions, timestamps, descriptions| **5.2:1 (AA Pass)** |
| **Electric Blue**| `#0066ff` | Action buttons, focus rings, brand | Primary focus anchor |
| **Vibrant Blue** | `#0052ff` | Active states, hover gradients | Primary interactive |
| **Electric Cyan**| `#00b4d8` | Secondary badges, radar rings | High-energy highlight |
| **Stone Divider**| `#e2e8f0` | Precision geometric borders | Structural separation |

---

## 5. Physics-Based Micro-Interactions

Every actionable UI element features tactile feedback inspired by physical mechanical switches:

- **Primary Button Hover (`.btn-primary-tactile:hover`):**
  Lifts upward along the Z-axis (`translateY(-2px) translateZ(4px)`) with an expanded electric-blue aura.
- **Primary Button Active (`.btn-primary-tactile:active`):**
  Compresses downward into the container surface (`translateY(2px) scale(0.975)`) with an inset physical depression shadow, delivering an immediate sensation of mechanical travel.
- **Tactile Slabs (`.tactile-slab:active`):**
  Snappily compress toward the canvas (`translateZ(-2px) scale(0.996)`) using `cubic-bezier(0.25, 1, 0.5, 1)`.

---

## 6. Complete Tailwind CSS 3D Depth Configuration

If migrating or extending Signalpath with Tailwind CSS (v3 / v4), use this comprehensive depth configuration in `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        canvas: {
          base: '#f4f8fc',
          subtle: '#edf4f9',
          bright: '#ffffff',
        },
        ink: {
          primary: '#091e3a',
          secondary: '#1e3a5f',
          muted: '#475f7b',
          faint: '#758da3',
        },
        electric: {
          blue: '#0066ff',
          vibrant: '#0052ff',
          hover: '#004ee0',
          tint: '#e6f0ff',
        },
        cyan: {
          vibrant: '#00b4d8',
          intense: '#06b6d4',
          tint: '#e0f7fa',
        },
        stone: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
        },
      },
      boxShadow: {
        'depth-1': '0 1px 2px rgba(9, 30, 58, 0.04), 0 4px 10px rgba(9, 30, 58, 0.05), 0 12px 28px rgba(9, 30, 58, 0.06), inset 1px 1px 0 #ffffff',
        'depth-2': '0 2px 4px rgba(9, 30, 58, 0.05), 0 8px 18px rgba(9, 30, 58, 0.07), 0 22px 45px -4px rgba(0, 82, 255, 0.08), 0 35px 70px -10px rgba(9, 30, 58, 0.09), inset 1px 1px 0 #ffffff',
        'depth-3': '0 3px 6px rgba(9, 30, 58, 0.06), 0 14px 28px rgba(9, 30, 58, 0.08), 0 32px 64px -6px rgba(0, 102, 255, 0.12), 0 48px 96px -12px rgba(9, 30, 58, 0.12), inset 1px 1px 0 #ffffff, inset 0 0 0 1px rgba(255, 255, 255, 0.6)',
        'btn-tactile': '0 2px 4px rgba(0, 82, 255, 0.2), 0 8px 20px rgba(0, 102, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 0 rgba(0, 45, 140, 0.3)',
      },
      transitionTimingFunction: {
        'spring-snappy': 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
        'spring-dampened': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'ease-smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
```

---

## 7. Layout Container Wrappers Reference

When adding new forensic analysis modules or metrics to the interface, wrap components in the standardized depth layout containers:

```html
<!-- High-Elevation Flagship Input Container -->
<div class="floating-container tactile-slab" data-depth="3">
  <!-- Interactive Form / Search Input -->
</div>

<!-- Primary Report Slab (Risk, Signals, Evidence) -->
<article class="floating-container dashboard-card" data-depth="2">
  <div class="dashboard-card-head">
    <div class="dashboard-card-title">
      <span class="metric-label-tag">ANOMALY DETECTION</span>
      <h3>Module Title</h3>
    </div>
  </div>
  <!-- Module Contents -->
</article>

<!-- Supporting Metric Tile (Footprint, Transactions) -->
<article class="floating-container metric-tile" data-depth="1">
  <div class="metric-tile-header">
    <span class="metric-label-tag">ACTIVE CHAINS</span>
    <div class="metric-icon-badge cyan">⌁</div>
  </div>
  <div class="metric-stat-value">05</div>
</article>
```

---
*Architected and maintained by omnirush.ai for the Blockscout Multichain Hackathon 2026.*
