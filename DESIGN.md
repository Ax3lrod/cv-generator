# DESIGN.md - CV Studio Design Direction

## Product & Brand Identity
- **Product:** CV Studio (Precision Resume Builder & ATS Customizer)
- **Target Audience:** Job seekers, software engineers, and professionals creating clean, recruiter-ready, and high-ATS score resumes.
- **Visual Aesthetic:** Swiss International Style / Clean Industrial Tooling.
  - Matte surfaces with crisp structural borders (no blur/glassmorphism, no artificial gradients, no colored glows).
  - High contrast, functional typography prioritizing legibility and ATS parseability.
  - Restrained palette: deep charcoal/slate neutral base with a single functional blue accent for primary actions.

## Liveliness Dials
- **ENERGY: 1 (Calm)** — Focused utility tool. The editor stays calm so the user's resume content remains the primary visual focus.
- **RHYTHM: 2 (Consistent with hierarchy)** — Split-pane workspace: left panel for structured input controls, right panel for the live A4 paper canvas.
- **MOTION: 1 (Static with interactive states only)** — Only functional hover, focus, and state transitions (0.15s ease). Strictly zero looping pulses or distracting motion.

## Palette Specification
- **Neutral Base:** Dark slate (`#020617`, `#0f172a`, `#1e293b`) for the tool shell; pure white (`#ffffff`) for the resume paper.
- **Primary Action Accent:** Solid Blue (`#2563eb`, hover `#1d4ed8`) reserved strictly for primary actions (Print, Add Item, Active Tab).
- **Text & Contrast:** High contrast text (headings `#f8fafc`, body `#e2e8f0`, muted `#94a3b8`, all exceeding WCAG AA 4.5:1 ratio).
- **Status Markers:** Real state indicators only (Amber for page overflow warning, Emerald for single-page fit).

## Typography
- **Editor Tooling:** `Inter, -apple-system, sans-serif` for clean readability, font scale 11px to 14px.
- **Resume Canvas:** User-configurable curated typefaces (`Inter`, `EB Garamond`, `Merriweather`, `Roboto`, `JetBrains Mono`).

## Anti-Slop Enforcement
- Zero decorative em dashes (`—`), replaced with clean standard hyphens (`-`), colons, or commas.
- Zero generic AI icons (`Sparkles`, magic, stars).
- Zero endless pulse animations.
- Zero decorative badges or emoji in UI copy.
- Full keyboard focus indicators on all inputs and range sliders.
