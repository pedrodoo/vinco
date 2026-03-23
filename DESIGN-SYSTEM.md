# VINCO Web Design System
Version 0.2 - Feb 2026

---

## Visual Identity

### Logo Usage
- Maintain clearspace equal to the height of the "V".
- Do not distort, recolor, or place on busy backgrounds.
- Preferred placement: top-left in nav; footer uses monochrome variant.

---

## Color Palette

Usage rule: 60% cream, 30% black, 10% burgundy/browns.

| Token | Hex | Usage |
|---|---|---|
| vinco-cream | `#f0eddd` | Primary background |
| vinco-black | `#262626` | Primary text, dark sections |
| vinco-brown-1 | `#706a60` | Accents, separators |
| vinco-brown-2 | `#524c43` | Secondary accents |
| vinco-burgundy | `#683542` | Emphasis, CTAs, active states |

- Ensure contrast ratios ≥ 4.5:1 for all text.
- Burgundy for emphasis only — never body text.
- Body text never in burgundy or brown.

---

## Typography

### Type Stack

| Role | Typeface | Usage |
|---|---|---|
| Display | AV-Estiana | H1–H2. Geometric, technical, high character. Tight letterspacing. Primary headlines and hero statements. |
| Editorial | Cormorant Garamond | H3–H4. Serif with high stroke contrast. Subheadlines, section intros, pull quotes. |
| UI & Body | Inter | Body, captions, labels, UI elements. Neutral, highly legible at screen sizes. |

> Note: AV-Estiana is self-hosted as a variable font (woff2). Cormorant Garamond and Inter are loaded via Google Fonts.

### Scale

| Level | Font | Size | Line-height | Letterspacing |
|---|---|---|---|---|
| H1 | AV-Estiana | 48–64px | 1.2 | -0.02em |
| H2 | AV-Estiana | 32–40px | 1.2 | -0.01em |
| H3 | Cormorant Garamond | 28–32px | 1.3 | Normal |
| H4 | Cormorant Garamond | 22–26px | 1.3 | Normal |
| Body | Inter | 16–18px | 1.6 | Normal |
| Small / Meta | Inter | 13–14px | 1.5 | Normal |

---

## Bilingual System (PT / EN)

VINCO operates in PT and EN. The language approach is route-based — each locale has its own URL and renders content entirely in that language.

- PT: `vinco-studio.com/` (default, no prefix)
- EN: `vinco-studio.com/en/`

### Rules

**All content — headlines, CTAs, nav, body, footer**
Single language per route. No inline mixing. Each JSON file (`pt.json`, `en.json`) contains the full content for that locale.

**Language toggle**
Top-right in nav. Links to the equivalent page in the alternate locale.

---

## Layout System

### Grid
- 12-column grid
- Gutters: 24–32px
- Max content width: 1200–1440px
- Spacing scale (8pt): 4, 8, 12, 16, 24, 32, 48, 64, 96

### Breakpoints

| Name | Width |
|---|---|
| XS | ≤ 480px |
| SM | ≤ 768px |
| MD | ≤ 1024px |
| LG | ≤ 1440px |
| XL | > 1440px |

Stack to single column at SM and below.

### Color Block Layouts
Modular, full-bleed sections using VINCO palette. Hard edge between blocks. Optional 1px vinco-brown-1 separator.

- Use for: hero bands, editorial dividers, feature highlights.
- Avoid behind: dense forms, long body copy.
- Proportions: follow 60/30/10 rule at page level.
- Limit burgundy/brown blocks to emphasis moments.
- Content max width 1200–1440px. Internal padding 24–64px (8pt scale).
- Default left alignment. Center allowed for hero statements only.
- Text color: cream sections → vinco-black. Black sections → vinco-cream. Always ≥ 4.5:1 contrast.

---

## Components

### Buttons
- Primary: burgundy fill, cream text
- Secondary: outline burgundy, burgundy text
- Tertiary: text link, burgundy
- Radius: 4–8px. Padding: 12–16px vertical, 24–32px horizontal.
- Focus ring: 2px high-contrast outline.

### Navigation
- Sticky top bar. Logo left. Links center or right.
- Language toggle (PT / EN) top-right.
- Mobile: hamburger drawer, slides from right.
- Hover: subtle underline or opacity shift.
- Active: vinco-burgundy indicator.

### Cards
- Cream or white background. Generous whitespace.
- Image dominant, minimal text below.
- 1px vinco-brown-1 border. Subtle shadow: `0 2px 8px rgba(0,0,0,0.08)`.
- Hover: 2–4px lift + shadow deepen. Optional image scale 1.02.
- Spacing: 24–32px internal padding. 8pt scale throughout.
- Limit text to: title + one line of meta + optional CTA.

### Forms
- Input border: 1px vinco-brown-1, 8px radius.
- Focus state: vinco-burgundy ring.
- Clear labels above fields. Helper text below.
- Inline validation on blur.
- Submit button: primary button style.

---

## Image Treatments
- Aspect ratios: 3:2 hero, 4:3 cards, 1:1 thumbnails.
- Photography: warm tones, natural light, minimal clutter. Consistent color grading to match burgundy/brown warmth.
- Soft vignette or subtle border where appropriate. No heavy filters.

---

## Patterns and Textures
Brand modular pattern used sparingly: section headers, dividers, background texture.
- Opacity: 5–10%. Never behind body text or interactive elements.

---

## Motion and Interactions

### Principles
Motion should feel like natural material response — present but never distracting. Enhances hierarchy and guides attention without demanding it.

### Timing
- Duration: 150–250ms. Max 300ms except video or complex sequences.
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` for all transitions.
- Animate only: opacity, transform. Never animate layout properties.

### Scroll Reveals
- Elements fade in + translate upward 16–24px as they enter viewport.
- Trigger at 10–20% visibility using Intersection Observer API.
- Stagger grouped items by 50–100ms.

### Hover States
- Cards: 2–4px lift + shadow deepen. Optional image scale 1.02.
- Buttons: subtle scale 0.98 on press.
- Nav links: underline/indicator slides in at 150ms.

### Page Transitions
- Smooth fade between routes: 200–300ms.
- Optional slide for directional navigation.

### Micro-interactions
- Button press: scale 0.98.
- Form focus: ring fade-in 150ms.
- Success state: subtle checkmark draw or bounce.

---

## Hero — Desktop Only
- Optional ambient video or subtle scroll-triggered depth effect in hero section.
- Desktop only. On mobile: static image fallback. No parallax on mobile.
- If video: autoplay, muted, loop. Low-intensity motion. Sits beneath content with clear contrast.
- Provide high-quality poster image as fallback.
- Video accessibility: visible play/pause/stop controls. Keyboard operable.

---

## Reduced Motion
Respect `prefers-reduced-motion` at all times. Disable all non-essential motion. Keep only functional transitions.

---

## Accessibility
- Contrast: WCAG AA minimum across all states including hover and focus.
- Focus: visible across all interactive components. Keyboard navigable throughout.
- Images: meaningful alt text. Decorative images marked as `aria-hidden`.
- Forms: labels associated with inputs. Error messages descriptive.
- Performance: responsive images, lazy-load below fold. Audit with Lighthouse. Target score >90.

---

## Token Maintenance Workflow

Design tokens are managed with a hybrid model:
- Source of truth: `src/tokens/**/*.json`
- Generated output: `src/styles/tokens.generated.css`
- Integration layer: `src/styles/global.css`

### Update Process
1. Edit token values in `src/tokens`.
2. Run `pnpm tokens:build`.
3. Validate visual output with `pnpm build` or `pnpm dev`.

### Naming Convention
- Nested token keys become kebab-case CSS custom properties.
- Example: `semantic.surface.base` -> `--semantic-surface-base`
- Existing legacy vars (`--color-vinco-*`, `--font-*`, etc.) remain stable for compatibility.
