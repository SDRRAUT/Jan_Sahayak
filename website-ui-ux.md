# WEBSITE UI/UX DESIGN SYSTEM
## Production-Ready UI/UX Specification & Coding Blueprint

**System Name:** The Luminary Architecture (Precision Editorial & Bento Modular System)  
**Version:** 1.0  
**Status:** Source of Truth for Coding Agents  
**Derived From:** `ANALYSIS/reference-analysis.md`, Visual Dataset (`01-REFERENCES/WEBSITE`)  
**Target File:** `DESIGN-SYSTEM/website-ui-ux.md`  
**Date:** September 2026  

---

> ### CRITICAL INSTRUCTION FOR CODING AGENTS
> This document is the **uncompromising, single source of truth** for all visual and interactive implementations. 
> - Every CSS variable, layout rule, component structure, typography pairing, and spacing interval specified here is **mandatory**.
> - Do **not** invent ad-hoc colors, arbitrary border radii, or unapproved drop shadows.
> - When an implementation detail is unspecified, follow the **Implementation Rule (Section 20)** to infer the correct pattern from established tokens.
> - Do **not** apply cyberpunk glows, neon AI gradients, floating cards tilted at 15 degrees, or 3D cartoon clay figures. Build clean, architectural digital craftsmanship.

---

# 1. DESIGN PHILOSOPHY

## 1.1 Core Feeling & Experience Statement
The website must feel like an **architectural monograph meeting high-performance digital engineering**:
- **Authoritative:** Grounded in mathematical alignment, rigorous 12-column geometry, and balanced hierarchy.
- **Serene & Uncluttered:** Content breathes through generous whitespace (96px–128px section margins); typography does the emotional storytelling rather than decorative fluff.
- **Tactile & Crafted:** Subtly elevated physical surfaces, crisp 1px micro-borders (`rgba(15, 23, 42, 0.08)`), and intentional hover elevations replace blurry glassmorphism.

> **Defining Experience Statement:**  
> *"Authoritative clarity through architectural structure, tactile depth through micro-craftsmanship, and purposeful momentum through directional interactions."*

## 1.2 The Five Core Principles

```
┌────────────────────────────────────────────────────────────────────────┐
│                      THE 5 GOVERNING PRINCIPLES                        │
├──────────────────────────┬─────────────────────────────────────────────┤
│ 1. Structure Over Noise  │ Strict 12-column grid and Bento modularity  │
│ 2. Dual-Surface Rhythm   │ Bone-white day canvas + Obsidian containers │
│ 3. Color as Signal       │ 90% neutral palette + 1 tactical brand hue  │
│ 4. Typographic Tension   │ Chiseled Editorial Serif H1 + Neo-Sans UI   │
│ 5. Purposeful Momentum   │ Directional affordances (arrows, pill CTAs) │
└──────────────────────────┴─────────────────────────────────────────────┘
```

1. **Structure Over Decorative Noise:** No floating blobs, glowing rings, or purposeless abstract spheres. Visual beauty arises from proportion, whitespace, and layout hierarchy.
2. **Dual-Surface Cadence:** Light-mode dominant (bone-white `#F8F9FA` with white cards `#FFFFFF`), rhythmically punctuated by high-contrast inset containers (`#0B1914` Obsidian Forest) for mission-critical metrics and case study showcases.
3. **Color as Surgical Signal:** Color is deployed exclusively for state changes, primary CTAs, active indicators, and metric data. Content surfaces remain strictly neutral.
4. **Typographic Tension:** Pairing an authoritative, chisel-cut editorial serif for display headlines with an ultra-legible neo-grotesque sans-serif for UI elements, labels, and body copy.
5. **Purposeful Momentum:** Every interactive element signals clear physical affordance. Buttons feature subtle vertical elevation on hover; links and CTAs incorporate directional arrows (`→`, `↗`) with smooth horizontal translations.

---

# 2. COLOR TOKENS

All colors are defined as CSS variables with exact HEX values and explicit usage rules.

```css
:root {
  /* Canvas & Base Surfaces */
  --color-bg-canvas:              #F8F9FA; /* Calming bone-white canvas; page background */
  --color-surface-card:           #FFFFFF; /* Pure white; default card and component surface */
  --color-surface-elevated:       #FFFFFF; /* Elevated white; popovers, dropdowns, floating nav */
  --color-surface-inset-dark:     #0B1914; /* Deep Obsidian Forest; dark section containers */
  --color-surface-inset-card:     #132A22; /* Pine Card Surface; cards nested inside dark containers */
  
  /* Brand Accents */
  --color-primary:                #0E5E3A; /* Deep Forest Green; primary CTA, active anchors, main links */
  --color-primary-hover:          #0A472C; /* Darker Forest; hover state for primary button */
  --color-secondary:              #132A22; /* Dark Pine; secondary interactive elements */
  --color-accent:                 #10B981; /* High-Visibility Emerald; stats, badges, sparklines */
  --color-accent-tint:            #E8F7F0; /* 10% soft emerald tint; badge and chip background */
  --color-accent-glow:            rgba(16, 185, 129, 0.15); /* Controlled micro-halo for active pills */
  
  /* Neutral Slate Typography Hierarchy */
  --color-text-primary:           #0F172A; /* Deep Slate Charcoal; H1, H2, H3, primary card titles */
  --color-text-secondary:         #475569; /* Balanced Slate; body paragraphs, subtitles */
  --color-text-muted:             #64748B; /* Cool Muted Slate; metadata, timestamps, input placeholders */
  --color-text-inverse:           #F8FAFC; /* Crisp Near-White; text on dark inset containers */
  --color-text-inverse-muted:     #94A3B8; /* Muted Slate; secondary text on dark inset containers */
  
  /* Boundary Rules & Dividers */
  --color-border-subtle:          rgba(15, 23, 42, 0.08);  /* 1px light mode boundary for cards & dividers */
  --color-border-medium:          rgba(15, 23, 42, 0.14);  /* 1px boundary for inputs and active borders */
  --color-border-dark:            rgba(255, 255, 255, 0.12); /* 1px boundary rule on dark surfaces */
  --color-divider:                #E2E8F0;                  /* Horizontal section separator */

  /* Semantic Feedback States */
  --color-success:                #10B981; /* Emerald; positive metrics, completion states */
  --color-success-bg:             #ECFDF5; /* Emerald tint surface */
  --color-success-text:           #065F46; /* Emerald text for WCAG AAA compliance */
  
  --color-warning:                #F59E0B; /* Amber; cautions, pending indicators */
  --color-warning-bg:             #FFFBEB; /* Amber tint surface */
  --color-warning-text:           #92400E; /* Amber text for WCAG AAA compliance */
  
  --color-error:                  #EF4444; /* Crimson Coral; validation errors, destructive actions */
  --color-error-bg:               #FEF2F2; /* Crimson tint surface */
  --color-error-text:             #991B1B; /* Crimson text for WCAG AAA compliance */
}
```

### Color Usage Rules
1. **The 60-30-10 Distribution:** 60% of visible area must be `--color-bg-canvas` or `--color-surface-card`; 30% structural slate typography and borders; maximum 10% `--color-primary` and `--color-accent`.
2. **Never Invert Card Text on Light Mode:** Content cards on light mode always use dark slate text (`--color-text-primary`). White text is reserved strictly for `--color-surface-inset-dark` or `--color-primary` filled buttons.
3. **No Pure Black:** `#000000` is strictly forbidden. Use `--color-text-primary` (`#0F172A`) for typography and `--color-surface-inset-dark` (`#0B1914`) for dark surfaces.

---

# 3. TYPOGRAPHY

The typography system creates dramatic tension between classical editorial authority and razor-sharp modern interface engineering.

## 3.1 Font Family Declarations
- **Display Font:** `'Fraunces', 'Newsreader', Georgia, serif`  
  *Usage:* Hero H1 headlines, high-impact pull-quotes, and italicized keyword accents.
- **Interface & Sans Font:** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`  
  *Usage:* Headings H2 through H4, body copy, navigation links, buttons, form inputs, metadata.
- **Monospace / Tabular Font:** `'JetBrains Mono', ui-monospace, SFMono-Regular, monospace`  
  *Usage:* High-density numbers, financial metrics, counters, dates, keyboard badges (`⌘K`).

## 3.2 Typographic Hierarchy Scale

| Token / Role | Font Family | Size (Desktop) | Size (Mobile) | Weight | Line Height | Letter Spacing | CSS Rule Example |
|---|---|---|---|---|---|---|---|
| **Display Heading (Hero H1)** | Display Serif | `56px` | `38px` | `700` | `1.08` | `-0.035em` | `font: 700 56px/1.08 var(--font-display);` |
| **H1 (Page Title)** | Sans | `44px` | `32px` | `700` | `1.12` | `-0.030em` | `font: 700 44px/1.12 var(--font-sans);` |
| **H2 (Section Heading)** | Sans | `36px` | `28px` | `700` | `1.18` | `-0.025em` | `font: 700 36px/1.18 var(--font-sans);` |
| **H3 (Feature / Bento Title)** | Sans | `24px` | `20px` | `600` | `1.28` | `-0.015em` | `font: 600 24px/1.28 var(--font-sans);` |
| **H4 (Card Subheader)** | Sans | `18px` | `16px` | `600` | `1.35` | `-0.010em` | `font: 600 18px/1.35 var(--font-sans);` |
| **Body (Primary Paragraph)** | Sans | `15px` | `15px` | `400` | `1.60` | `0.000em` | `font: 400 15px/1.60 var(--font-sans);` |
| **Small Text (Secondary Copy)** | Sans | `13px` | `13px` | `400` | `1.50` | `0.000em` | `font: 400 13px/1.50 var(--font-sans);` |
| **Caption / Micro Metadata** | Sans / Mono | `12px` | `12px` | `500` | `1.40` | `+0.010em` | `font: 500 12px/1.40 var(--font-sans);` |
| **Button Text** | Sans | `14px` | `14px` | `600` | `1.00` | `-0.010em` | `font: 600 14px/1 var(--font-sans);` |
| **Navigation Link** | Sans | `14px` | `14px` | `500` | `1.00` | `0.000em` | `font: 500 14px/1 var(--font-sans);` |
| **Overline Category Tag** | Sans | `11px` | `11px` | `700` | `1.20` | `+0.060em` | `text-transform: uppercase;` |
| **Tabular Numbers (Stats)** | Mono | `32px–48px` | `28px–36px` | `700` | `1.10` | `-0.020em` | `font-variant-numeric: tabular-nums;` |

### The Italicized Keyword Rule
In Hero H1 and Section H2 headlines, exactly 1 or 2 operative words must be styled using the Display Serif in italics with a subtle weight reduction:
```html
<h1 class="hero-headline">
  Architecting the future of <span class="headline-accent">adaptive</span> digital ecosystems.
</h1>
```
```css
.headline-accent {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 500;
  color: var(--color-primary);
}
```

---

# 4. SPACING SCALE

Spacing follows an unambiguous 8pt spatial rhythm (with 4px micro-steps).

```css
:root {
  --space-1:   4px;   /* Micro spacing, badge icon gap */
  --space-2:   8px;   /* Tag vertical padding, icon-to-label spacing */
  --space-3:   12px;  /* Compact card gap, input internal vertical pad */
  --space-4:   16px;  /* Standard container edge gap, button horizontal pad */
  --space-5:   20px;  /* Compact card padding */
  --space-6:   24px;  /* Standard card padding, grid gutter default */
  --space-8:   32px;  /* Large card padding, bento grid gap */
  --space-10:  40px;  /* Module separation sub-gap */
  --space-12:  48px;  /* Medium section header bottom margin */
  --space-16:  64px;  /* Tablet/mobile section vertical padding */
  --space-20:  80px;  /* Standard desktop section vertical padding */
  --space-24:  96px;  /* Generous desktop section padding */
  --space-32:  128px; /* Hero & closing CTA desktop section padding */
}
```

### Contextual Spacing Rules
- **Section Spacing (Desktop):** `padding: var(--space-24) 0;` (96px top and bottom).
- **Section Spacing (Mobile):** `padding: var(--space-16) 0;` (64px top and bottom).
- **Container Padding (Desktop):** `padding-left: var(--space-8); padding-right: var(--space-8);` (32px).
- **Container Padding (Mobile):** `padding-left: var(--space-4); padding-right: var(--space-4);` (16px).
- **Card Padding:** Standard content card = `var(--space-6)` (24px). Feature Bento card = `var(--space-8)` (32px).
- **Button Spacing:** Large CTA = `padding: 14px 24px`. Compact Button = `padding: 10px 18px`.

---

# 5. GRID AND CONTAINER

## 5.1 Container Specifications
- **Max Content Width:** `1240px` (enforces readable line lengths and prevents layout breakdown on 4K monitors).
- **Container Class Implementation:**
```css
.container {
  width: 100%;
  max-width: 1240px;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-8);
  padding-right: var(--space-8);
}

@media (max-width: 767px) {
  .container {
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }
}
```

## 5.2 Grid Systems

```
┌────────────────────────────────────────────────────────────────────────┐
│                        RESPONSIVE GRID SYSTEM                          │
├──────────────┬─────────────┬───────────┬──────────────┬────────────────┤
│ VIEWPORT     │ WIDTH       │ COLUMNS   │ GUTTER (GAP) │ MARGIN PADDING │
├──────────────┼─────────────┼───────────┼──────────────┼────────────────┤
│ Desktop      │ ≥ 1024px    │ 12 Cols   │ 24px / 32px  │ 32px           │
│ Tablet       │ 768px–1023px│ 6 Cols    │ 20px         │ 24px           │
│ Mobile       │ ≤ 767px     │ 2 / 1 Col │ 16px         │ 16px           │
└──────────────┴─────────────┴───────────┴──────────────┴────────────────┘
```

### Column Layout Allocations (12-Column Desktop Grid)
- **Hero Asymmetric Split:** 7 columns left (Headline, Copy, CTAs) + 5 columns right (Visual proof card).
- **3-Column Feature Grid:** 4 columns per card (`grid-column: span 4`).
- **4-Column Metric Grid:** 3 columns per card (`grid-column: span 3`).
- **2-Column Alternating Section:** 6 columns left + 6 columns right.
- **Bento Grid Module:** 8 columns wide feature card + 4 columns stacked data widgets.

---

# 6. BORDER RADIUS

Radius tokens are consistent, disciplined, and strictly hierarchical.

```css
:root {
  --radius-xs:    4px;    /* Micro status dots, inner badge items */
  --radius-sm:    6px;    /* Tooltips, small code badges, micro-tags */
  --radius-md:    10px;   /* Form inputs, dropdown menus, compact buttons */
  --radius-lg:    16px;   /* Standard content cards, Bento grid modules, image wrappers */
  --radius-xl:    24px;   /* Modal dialogs, large visual preview containers */
  --radius-2xl:   32px;   /* Inset dark section containers */
  --radius-full:  9999px; /* Floating navbar dock, primary action pill buttons, status pill chips */
}
```

### Radius Rules
1. **The Pill Rule:** Full border radius (`--radius-full` / `9999px`) is reserved exclusively for:
   - The floating navigation dock
   - Primary and secondary action buttons
   - Micro category overline tags and status pills
   - Search bar input containers
2. **The Card Inset Rule:** Content cards must use `--radius-lg` (`16px`). Any nested image inside a card must follow the nested radius formula:  
   $$\text{Inner Radius} = \text{Card Radius} - \text{Card Padding}$$  
   *Example:* If a card with `16px` radius has an image with `12px` margin, the image radius must be `4px`. If the image is full-width to the top edge of the card, it inherits `16px 16px 0 0`.

---

# 7. SHADOWS

Depth is communicated through physically plausible, multi-stop ambient occlusion shadows. Glows and saturated color halos are prohibited.

```css
:root {
  /* Subtle boundary shadow for elevated badges and chips */
  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
  
  /* Small elevation for inputs and buttons */
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.05), 
               0 1px 2px rgba(15, 23, 42, 0.03);
  
  /* Standard elevation for cards and Bento modules */
  --shadow-card: 0 1px 3px rgba(15, 23, 42, 0.04), 
                 0 6px 16px -2px rgba(15, 23, 42, 0.04);
  
  /* Card interactive hover state */
  --shadow-card-hover: 0 4px 6px -1px rgba(15, 23, 42, 0.04), 
                       0 16px 32px -4px rgba(15, 23, 42, 0.08);
  
  /* Floating Navbar, Dropdowns, and Popovers */
  --shadow-floating: 0 10px 25px -5px rgba(15, 23, 42, 0.06), 
                     0 8px 10px -6px rgba(15, 23, 42, 0.04);
  
  /* Modal dialogs */
  --shadow-modal: 0 25px 50px -12px rgba(15, 23, 42, 0.16), 
                  0 0 0 1px rgba(15, 23, 42, 0.06);
}
```

---

# 8. NAVIGATION SPECIFICATION

The navigation system implements **The Floating Frosted Pill Dock** (derived from the `12 Modern Navbar Designs` reference).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FLOATING NAVBAR DOCK                            │
├──────────────┬───────────────────────────────┬─────────────────────────┤
│ [LOGO] Brand │   Features  Solutions  Pricing │ Log in   [Start Free →] │
└──────────────┴───────────────────────────────┴─────────────────────────┘
```

## 8.1 Desktop Implementation
- **Container Geometry:**  
  `max-width: 1120px; height: 60px; margin: 16px auto; padding: 0 24px; border-radius: var(--radius-full);`
- **Surface & Boundary:**  
  `background: rgba(255, 255, 255, 0.84); backdrop-filter: blur(20px) saturate(180%); border: 1px solid var(--color-border-subtle); box-shadow: var(--shadow-floating);`
- **Positioning & Sticky Behavior:**  
  `position: sticky; top: 16px; z-index: 1000; transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);`
- **Scrolled State:** When window scroll exceeds `80px`, the navbar reduces height to `54px`, top margin shifts to `8px`, and background opacity rises to `0.92`.
- **Links:** 4 to 5 items, `font: 500 14px var(--font-sans); color: var(--color-text-secondary);`.
  - *Hover State:* Color transitions to `--color-text-primary` in 150ms.
  - *Active State:* Enclosed in a subtle tint pill (`background: #F1F5F9; color: var(--color-text-primary); padding: 6px 14px; border-radius: var(--radius-full);`).
- **Action Cluster (Right):**
  - Text link: "Log in", `font-weight: 500; margin-right: 16px;`
  - Conversion Button: Compact Pill CTA (`height: 38px; padding: 0 18px; background: var(--color-primary); color: #FFFFFF; border-radius: var(--radius-full); font-weight: 600;`).

## 8.2 Mobile Navigation (< 768px)
- The navbar spans `width: calc(100% - 32px); margin: 12px 16px; height: 56px;`.
- Displays Brand Logo on the left; compact circular hamburger button on the right (36px squircle).
- When triggered, a full-screen drawer descends smoothly (`backdrop-filter: blur(24px); background: rgba(248, 249, 250, 0.96);`), revealing vertically stacked links at 20px font size and a full-width primary CTA at the bottom.

---

# 9. HERO SPECIFICATION

The Hero is an **Asymmetrical 60/40 Split** with an interactive visual anchor (derived from *Aeline Nature* and *WizardZ*).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HERO SECTION GEOMETRY                           │
├──────────────────────────────────┬─────────────────────────────────────┤
│ LEFT COLUMN (60% Width)          │ RIGHT COLUMN (40% Width)            │
│ [🌱 OVERLINE CATEGORY PILL]      │ ┌─────────────────────────────────┐ │
│ Display H1 Headline              │ │ Visual Proof Preview Card       │ │
│ (with editorial serif keyword)   │ │ • Live metric sparkline         │ │
│ Supporting paragraph (520px max) │ │ • Tabular status rows           │ │
│ [Primary CTA →]  [▶ Watch Story] │ │ • Verified badge chips          │ │
│ ────                             │ └─────────────────────────────────┘ │
│ [Avatars] ★ 4.9/5 from 1,400+    │                                     │
└──────────────────────────────────┴─────────────────────────────────────┘
```

## 9.1 Component Breakdown
1. **Container:** Section vertical padding: `96px 0 64px 0`.
2. **Category Overline Pill:**
   - Text: `11px uppercase bold`, letter-spacing `+0.06em`.
   - Dimensions: `height: 28px; padding: 0 12px; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 6px; margin-bottom: 20px;`.
   - Palette: `background: var(--color-accent-tint); color: var(--color-primary); border: 1px solid rgba(16, 185, 129, 0.2);`.
3. **Display Headline:**
   - Typography: `var(--text-display-xl)` (56px desktop, 38px mobile), line-height 1.08, letter-spacing `-0.035em`.
   - Max Width: `620px`.
   - Accent: 1 or 2 operative keywords in `headline-accent` (Serif, italic, weight 500, `--color-primary`).
4. **Supporting Copy:**
   - Typography: `var(--text-body-md)` (15px, line-height 1.6, `--color-text-secondary`).
   - Max Width: `520px; margin-top: 20px; margin-bottom: 32px;`.
5. **CTA Action Cluster:**
   - Primary: Large Pill Button (`height: 48px; padding: 0 24px; background: var(--color-primary); color: #FFFFFF; font-weight: 600; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 8px;`). Features a rightward arrow glyph (`→`).
   - Secondary: Ghost Pill Button (`height: 48px; padding: 0 20px; border: 1px solid var(--color-border-medium); color: var(--color-text-primary); border-radius: var(--radius-full); margin-left: 12px;`).
6. **Social Proof Row:**
   - Stack of 4 overlapping circular user avatars (each 32px diameter, 2px white border).
   - Star rating: 5 gold stars (`#F59E0B`).
   - Text: `13px font-weight 500 #475569`, e.g., *"Trusted by 1,400+ innovative engineering teams"*.
7. **Right Visual Anchor:**
   - A structured white preview card (`border-radius: var(--radius-lg); border: 1px solid var(--color-border-subtle); box-shadow: var(--shadow-card); padding: 24px; background: #FFFFFF;`).
   - Displays real interface metrics: a live sparkline curve, 3 tabular data rows with status pills, and verified enterprise security tags.

---

# 10. REUSABLE SECTION PATTERNS

Every content section on the website must use one of these 8 standardized architectural patterns.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      REUSABLE SECTION PATTERNS                         │
├────┬─────────────────────────────┬─────────────────────────────────────┤
│ 01 │ Standard Section Header     │ Category Pill + H2 Title + Subtitle │
│ 02 │ 4-Module Bento Grid         │ 1 Flagship (8-col) + 3 Widgets      │
│ 03 │ Alternating 50/50 Narrative │ Text Left / Media Right & Inverse   │
│ 04 │ Inset Dark Metric Band      │ #0B1914 Inset Container + 4 Stats   │
│ 05 │ 3-Column Directory Grid     │ Uniform catalog cards with pill CTA │
│ 06 │ Customer Proof Matrix       │ 3-Column verified testimonial cards │
│ 07 │ Unified Action Banner       │ Inset card with email input pill    │
│ 08 │ Grounding Forest Footer     │ 5-Column link matrix + Watermark    │
└────┴─────────────────────────────┴─────────────────────────────────────┘
```

## Pattern 01: Standard Section Header
- Center-aligned for directory and testimonial sections; left-aligned for Bento and feature sections.
- Elements: Category Overline Pill (11px uppercase) -> H2 Section Heading (36px bold) -> Supporting Paragraph (16px, max-width 600px).
- Bottom margin: `var(--space-12)` (48px).

## Pattern 02: 4-Module Bento Grid
- Grid setup: `display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px;`.
- **Module A (Top Left, 8 Columns):** Flagship interactive preview with embedded workflow diagram, 22px heading, and sub-feature tags.
- **Module B (Top Right, 4 Columns):** High-impact stat widget (`+180%` growth) with an animated mini sparkline.
- **Module C (Bottom Left, 4 Columns):** Security & Compliance widget with icon squircle and 3 checkmark points.
- **Module D (Bottom Right, 8 Columns):** Step-by-step horizontal progress tracker with status badges.

## Pattern 03: Alternating 50/50 Narrative
- Two-column flex/grid with `align-items: center; gap: 48px;`.
- Row 1: Copy Left (H3 + Paragraph + Feature List + Link CTA) / Documentary Image Right.
- Row 2: Documentary Image Left / Copy Right.
- Images feature `border-radius: var(--radius-lg); border: 1px solid var(--color-border-subtle); box-shadow: var(--shadow-card);`.

## Pattern 04: Inset Dark Metric Band (Derived from *WizardZ* & *Nexiron*)
- Container: `background: var(--color-surface-inset-dark); border-radius: var(--radius-2xl); padding: 72px 48px; color: var(--color-text-inverse); margin: 64px auto; border: 1px solid var(--color-border-dark);`.
- Header: Centered near-white H2 + muted mint description.
- Metric Grid: 4 columns (`grid-template-columns: repeat(4, 1fr); gap: 32px; margin-top: 48px;`).
- Stat Card:
  - Big Number: `font: 700 48px var(--font-mono); color: var(--color-text-inverse); font-variant-numeric: tabular-nums;`.
  - Micro-Label: `font: 600 13px var(--font-sans); color: var(--color-accent); text-transform: uppercase; letter-spacing: +0.04em; margin-top: 8px;`.
  - Description: `font: 400 13px var(--font-sans); color: var(--color-text-inverse-muted); margin-top: 4px;`.

## Pattern 05: 3-Column Directory Grid (Derived from *Card List UI Design*)
- Symmetrical 3-column grid (`grid-template-columns: repeat(3, 1fr); gap: 24px;`).
- Each card: White background, 16px radius, icon squircle (36px), title, 3-line description, and bottom action pill.

## Pattern 06: Customer Proof Matrix
- 3-column layout of testimonial cards.
- Card contents: 5 amber rating stars (`#F59E0B`) -> Customer quote (15px regular, `#0F172A`) -> Author footer (40px circular avatar, name in bold 14px, job title in 12px muted slate, verified badge).

## Pattern 07: Unified High-Conversion Action Banner
- Inset container with soft radial emerald glow (`background: #0B1914`).
- Centered headline: *"Ready to experience architectural precision?"*
- Input form: A single unified pill container (`height: 54px; max-width: 480px; margin: 24px auto 0; background: #FFFFFF; border-radius: var(--radius-full); padding: 4px 6px; display: flex; align-items: center; box-shadow: var(--shadow-floating);`). Holds text input + embedded primary pill button ("Get Started →").

## Pattern 08: Grounding Forest Footer (Derived from *PadiSave* & *Nexiron*)
- Background: `var(--color-surface-inset-dark); padding: 80px 0 40px 0; color: var(--color-text-inverse); position: relative; overflow: hidden;`.
- Columns: 5-column directory (Product, Solutions, Platform, Resources, Legal) with 14px links (`color: var(--color-text-inverse-muted); hover: #FFFFFF`).
- Lower Baseline: Full-width brand watermark set at `4% opacity` across the bottom.
- Bottom Strip: Copyright notice, localized currency/region switcher, and monochrome social icon links.

---

# 11. COMPONENT SPECIFICATIONS

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COMPONENT ANATOMY SUITE                         │
├──────────────┬──────────────────┬─────────────────┬────────────────────┤
│ COMPONENT    │ HEIGHT           │ RADIUS          │ BORDER / SHADOW    │
├──────────────┼──────────────────┼─────────────────┼────────────────────┤
│ Button (Lg)  │ 48px             │ 9999px (Pill)   │ 0px / shadow-sm    │
│ Button (Md)  │ 40px             │ 10px / 9999px   │ 0px / shadow-sm    │
│ Input Field  │ 44px             │ 10px            │ 1px / shadow-xs    │
│ Content Card │ Auto             │ 16px            │ 1px / shadow-card  │
│ Badge / Chip │ 26px             │ 9999px (Pill)   │ 1px subtle         │
│ Tab Pill     │ 36px             │ 9999px (Pill)   │ 0px / flat         │
│ Modal Box    │ Auto (max 560px) │ 24px            │ 1px / shadow-modal │
└──────────────┴──────────────────┴─────────────────┴────────────────────┘
```

## 11.1 Buttons
- **Primary Button:**
  - `height: 48px; padding: 0 24px; border-radius: var(--radius-full); background: var(--color-primary); color: #FFFFFF; font: 600 14px var(--font-sans); border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: var(--shadow-sm); transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);`
  - *Hover:* `background: var(--color-primary-hover); transform: translateY(-2px); box-shadow: var(--shadow-card-hover);`
  - *Active:* `transform: translateY(0); box-shadow: var(--shadow-xs);`
  - *Icon:* Contains directional glyph (`→`) that translates `+3px` rightward on hover (`transition: transform 150ms ease;`).
- **Secondary Button:**
  - `height: 48px; padding: 0 22px; border-radius: var(--radius-full); background: #FFFFFF; color: var(--color-text-primary); font: 600 14px var(--font-sans); border: 1px solid var(--color-border-medium); cursor: pointer;`
  - *Hover:* `background: #F8F9FA; border-color: var(--color-text-primary);`
- **Ghost / Tertiary Link Button:**
  - `background: transparent; color: var(--color-primary); font: 600 14px var(--font-sans); border: none; padding: 0; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;`
  - *Hover:* Arrow icon translates `+4px` rightward. Underline appears smoothly.

## 11.2 Cards
- **Standard Content Card:**
  - `background: var(--color-surface-card); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: var(--space-6); box-shadow: var(--shadow-card); transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);`
  - *Hover:* `transform: translateY(-3px); box-shadow: var(--shadow-card-hover); border-color: rgba(15, 23, 42, 0.12);`
- **Metric Card:**
  - Contains top-right indicator badge (e.g., green up-arrow `↗ +14.2%`), large numerical value (`36px bold var(--font-mono)`), and secondary label (`13px #64748B`).

## 11.3 Form Inputs & Search Bar
- **Standard Input:**
  - `height: 44px; width: 100%; border-radius: var(--radius-md); border: 1px solid var(--color-border-medium); background: #FFFFFF; padding: 0 16px; font: 400 14px var(--font-sans); color: var(--color-text-primary); transition: border-color 150ms ease, box-shadow 150ms ease;`
  - *Placeholder:* `color: var(--color-text-muted);`
  - *Focus State:* `outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(14, 94, 58, 0.12);`
  - *Error State:* `border-color: var(--color-error); box-shadow: 0 0 0 3px var(--color-error-bg);`
- **Global Search Input with `⌘K` Badge:**
  - `height: 40px; border-radius: var(--radius-full); background: #F1F5F9; border: 1px solid transparent; padding: 0 14px; display: flex; align-items: center; justify-content: space-between;`
  - Includes a right-aligned keyboard shortcut tag: `kbd { background: #FFFFFF; border: 1px solid var(--color-border-subtle); border-radius: 4px; padding: 2px 6px; font: 600 11px var(--font-mono); color: var(--color-text-muted); }`

## 11.4 Badges & Status Tags
- **Status Pill (Success / Active):**
  - `height: 26px; padding: 0 10px; border-radius: var(--radius-full); background: var(--color-success-bg); color: var(--color-success-text); font: 600 11px var(--font-sans); display: inline-flex; align-items: center; gap: 6px; border: 1px solid rgba(16, 185, 129, 0.2);`
  - Includes a 6px circular indicator dot (`background: var(--color-success); border-radius: 50%;`).
- **Category Overline Badge:**
  - `height: 24px; padding: 0 10px; border-radius: var(--radius-full); background: var(--color-accent-tint); color: var(--color-primary); font: 700 11px var(--font-sans); text-transform: uppercase; letter-spacing: +0.06em;`

## 11.5 Tabs
- **Pill Tab Group:**
  - Container: `height: 42px; padding: 4px; background: #F1F5F9; border-radius: var(--radius-full); display: inline-flex; gap: 4px;`
  - Inactive Tab: `height: 34px; padding: 0 16px; border-radius: var(--radius-full); font: 500 13px var(--font-sans); color: var(--color-text-secondary); border: none; background: transparent; cursor: pointer;`
  - Active Tab: `background: #FFFFFF; color: var(--color-text-primary); font-weight: 600; box-shadow: var(--shadow-xs);`

## 11.6 Modals & Overlay Dialogs
- **Backdrop:** `background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(8px);`
- **Dialog Box:** `max-width: 560px; width: 100%; border-radius: var(--radius-xl); background: #FFFFFF; border: 1px solid var(--color-border-subtle); box-shadow: var(--shadow-modal); padding: 32px; position: relative;`
- **Close Action:** Top-right 32px circular icon button with hover background tint (`#F1F5F9`).

---

# 12. IMAGERY SPECIFICATION

```
┌────────────────────────────────────────────────────────────────────────┐
│                        IMAGERY CROPPING & RATIOS                       │
├───────────────────┬──────────────┬───────────────┬─────────────────────┤
│ CONTEXT           │ ASPECT RATIO │ BORDER RADIUS │ BORDER TREATMENT    │
├───────────────────┼──────────────┼───────────────┼─────────────────────┤
│ Hero Visual       │ 16:10        │ 20px          │ 1px subtle rule     │
│ Bento Feature Card│ 16:9         │ 12px (Inner)  │ 1px subtle rule     │
│ Directory Card    │ 4:3          │ 12px (Inner)  │ Flush or inset 1px  │
│ Team / Testimonial│ 1:1 (Circle) │ 50% (Circle)  │ 2px solid white     │
│ Case Study Banner │ 21:9         │ 24px          │ Inset dark scrim    │
└───────────────────┴──────────────┴───────────────┴─────────────────────┘
```

### Treatment & Art Direction Rules
1. **Documentary Realism:** Photography must depict authentic human moments, natural field settings, and high-fidelity product screens. Stock imagery with exaggerated poses or fake corporate smiles is banned.
2. **Text Overlay Scrim:** When typography sits over an image, apply an explicit vertical gradient scrim:
```css
.image-scrim {
  background: linear-gradient(
    to top, 
    rgba(15, 23, 42, 0.88) 0%, 
    rgba(15, 23, 42, 0.45) 45%, 
    transparent 100%
  );
}
```
3. **No Decorative 3D Clay Figures:** Never insert 3D cartoon characters or floating iridescent spheres. Product mockups must be clean, 2D vector or authentic perspective UI captures.

---

# 13. ICONOGRAPHY

- **Icon Set:** Clean, geometric line icons with consistent stroke weight (e.g., `Lucide Icons`, `Feather`, or `Heroicons Outline`).
- **Stroke Width:** Exactly `1.75px` (or `2.0px` for 16px micro-icons).
- **Default Sizes:**
  - Micro / Inline: `16px x 16px`
  - Input / Button: `18px x 18px`
  - Card Header / Feature: `24px x 24px`
  - Flagship Module Anchor: `32px x 32px`
- **Icon Squircles:** Feature cards enclose icons inside a 40px rounded squircle:
```css
.icon-squircle {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--color-accent-tint);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

# 14. RESPONSIVE TRANSFORMATION SPECIFICATION

Layouts must morph their structural orientation across breakpoints rather than uniformly scaling down.

```
┌────────────────────────────────────────────────────────────────────────┐
│                     BREAKPOINT ARCHITECTURE MATRIX                     │
├──────────────┬───────────────┬─────────────────────────────────────────┤
│ BREAKPOINT   │ WIDTH RANGE   │ PRIMARY STRUCTURAL TRANSFORMATION       │
├──────────────┼───────────────┼─────────────────────────────────────────┤
│ Desktop Wide │ ≥ 1440px      │ Full 12-col Bento, 1240px container     │
│ Laptop       │ 1024px–1439px │ 12-col grid, 24px gutters               │
│ Tablet       │ 768px–1023px  │ 6-col grid, Bento -> 2 cols, Stack Hero │
│ Mobile       │ ≤ 767px       │ 1-col linear flow, Drawer Nav, Full CTA │
└──────────────┴───────────────┴─────────────────────────────────────────┘
```

### Detailed Viewport Transformation Rules

#### 1. Desktop & Laptop (≥ 1024px)
- Navbar: Floating frosted pill dock centered with 60px height.
- Hero: 60/40 horizontal split; headline and preview card side-by-side.
- Bento Grid: 12 columns; flagship card spans 8 columns, widgets span 4 columns.
- Section Spacing: 96px top and bottom.

#### 2. Tablet (768px to 1023px)
- Navbar: Retains floating pill format but hides secondary text links into a compact menu dropdown; primary CTA button remains visible.
- Hero: Converts to a stacked layout. Headline, copy, and CTAs span full width on top; visual preview card centers below with 100% container width.
- Bento Grid: 12-column grid re-configures to 6 columns. Flagship module spans 6 columns (full width); secondary widgets sit in balanced 3-column pairs (2 per row).
- Section Spacing: Reduces to 72px top and bottom.

#### 3. Mobile (≤ 767px)
- Navbar: Collapses to edge-pinned floating bar (`width: calc(100% - 32px); height: 56px;`). Logo on left, circular hamburger toggle on right. Clicking opens a full-screen blurred navigation modal.
- Hero: Single-column linear stack. Headline drops from 56px to 38px. Dual CTAs stack vertically: Primary CTA spans 100% width; Secondary video link sits directly below as a centered text link.
- Bento Grid: Collapses completely to a 1-column vertical card stack.
- Metric Band: 4-column metric matrix transforms into a 2x2 grid with 16px gaps.
- Touch Targets: Every interactive target (button, tab, link, input) must enforce a minimum height of `44px` for touch accessibility.
- Section Spacing: Reduces to 64px top and bottom.

---

# 15. MOTION & INTERACTION SPECIFICATIONS

All animations must feel subtle, purposeful, and instant. The entire motion system runs on a deceleration cubic-bezier curve.

```css
:root {
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1); /* Rapid start, smooth settling */
  --ease-subtle: cubic-bezier(0.2, 0, 0, 1);    /* Linear deceleration */
  
  --duration-fast:    150ms; /* Button presses, micro color shifts */
  --duration-normal:  250ms; /* Card hover lifts, tab toggles, nav shrink */
  --duration-slow:    400ms; /* Modal reveals, mobile drawer open */
}
```

### Interaction Rules
1. **Card Hover Elevation:**
```css
.card {
  transition: transform var(--duration-normal) var(--ease-spring),
              box-shadow var(--duration-normal) var(--ease-spring),
              border-color var(--duration-fast) ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-card-hover);
  border-color: rgba(15, 23, 42, 0.14);
}
```
2. **Directional Arrow Propulsion:** Any arrow icon (`→`) inside a button or link must translate `+4px` on hover:
```css
.btn-primary:hover .btn-arrow {
  transform: translateX(4px);
}
.btn-arrow {
  transition: transform var(--duration-fast) var(--ease-spring);
}
```
3. **Hero Entrance Stagger:** When the page loads, hero elements enter sequentially:
   - Overline Pill: Fade-in + 8px translateY (delay 0ms)
   - Headline H1: Fade-in + 12px translateY (delay 80ms)
   - Supporting Paragraph: Fade-in + 12px translateY (delay 160ms)
   - CTA Cluster: Fade-in + 12px translateY (delay 240ms)
   - Right Visual Card: Fade-in + 16px translateY (delay 320ms)

---

# 16. ACCESSIBILITY (a11y) MANDATES

The website must strictly comply with **WCAG 2.1 Level AA** standards (targeting AAA wherever feasible).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ACCESSIBILITY STANDARDS                         │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Text Contrast (Normal)   │ Minimum 4.5:1 (Our default: 7.2:1 to 14.8:1)│
│ Text Contrast (Large H1) │ Minimum 3.0:1 (Our default: 14.8:1)         │
│ Minimum Touch Target     │ 44px x 44px on all mobile viewports         │
│ Focus Ring Indicator     │ 2px solid #0E5E3A with 2px offset           │
│ Semantic HTML Elements   │ <nav>, <header>, <main>, <section>, <footer>│
└──────────────────────────┴─────────────────────────────────────────────┘
```

### Focus Ring Specification
```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: inherit;
}
```

### Reduced Motion Query
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

# 17. SCREEN & PAGE ARCHITECTURE

This section defines the mandatory structural anatomy for the 5 core website pages.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   5 CORE WEBSITE PAGE ARCHITECTURES                    │
├──────┬───────────────────────┬─────────────────────────────────────────┤
│ PAGE │ ROUTE                 │ PURPOSE & PRIMARY METRIC                │
├──────┼───────────────────────┼─────────────────────────────────────────┤
│ P-01 │ Homepage (`/`)        │ Primary conversion & architectural proof│
│ P-02 │ Platform (`/platform`)│ Deep-dive feature & Bento capability    │
│ P-03 │ Impact (`/impact`)    │ Case studies, metrics, customer proof   │
│ P-04 │ Pricing (`/pricing`)  │ Transparent plans, enterprise tiers     │
│ P-05 │ Company (`/about`)    │ Mission, architectural team, philosophy │
└──────┴───────────────────────┴─────────────────────────────────────────┘
```

## Page 01: Homepage (`/`)
1. **Navigation:** Floating frosted pill dock.
2. **Hero Section:** Asymmetric 60/40 split with overline tag, headline with italic serif accent, dual CTAs, and interactive preview card.
3. **Trust Logo Strip:** Monochrome client marks at 40% opacity.
4. **Primary Value Bento:** 4-module asymmetrical Bento grid (Flagship feature + Sparkline metric + Security widget + Progress timeline).
5. **Inset Metric Showcase:** Dark `#0B1914` container inset highlighting 4 mission-critical stats.
6. **Solution Deep-Dive:** Two alternating 50/50 narrative rows.
7. **Interactive Catalog:** 3x2 directory grid of solution packages.
8. **Verified Social Proof:** 3-column customer quote cards with verified tags.
9. **Closing High-Conversion CTA:** Inset card with unified email subscription pill.
10. **Grounding Forest Footer:** 5-column directory with lower brand watermark.

## Page 02: Platform & Features (`/platform`)
1. **Header:** Centered editorial title ("Precision-engineered for scale") + pill tab selector.
2. **Interactive Feature Bento:** 6-module grid displaying live component previews.
3. **Architecture Deep-Dive:** 3-column technical specification matrix.
4. **Security & Governance:** Inset dark container highlighting ISO, SOC2, and compliance standards.
5. **Interactive Demo / Sandbox CTA:** Full-width conversion card.

## Page 03: Impact & Case Studies (`/impact`)
1. **Hero:** Large headline with metric callout ("$42M+ in value delivered").
2. **Featured Case Study:** Full-bleed 16:9 documentary image card with gradient scrim and floating quote pill.
3. **Case Study Directory:** 3-column card grid with category filters (Enterprise, FinTech, Sustainability).
4. **Customer Video Proof:** 2-column video player card with transcript highlights.
5. **Closing CTA:** "Schedule an Architectural Review".

## Page 04: Pricing & Plans (`/pricing`)
1. **Header:** Centered headline + Monthly/Annual toggle switch pill (with "Save 20%" badge).
2. **Pricing Matrix:** 3-tier card layout (Starter, Professional [Featured/Elevated], Enterprise).
   - *Professional Card:* Enclosed in a 2px primary border, subtle elevation, with a "Most Popular" pill tag.
3. **Feature Comparison Table:** Detailed matrix with checkmark indicators and sticky header.
4. **FAQ Accordion:** 6 collapsible question cards with smooth chevron rotation.
5. **Enterprise Contact Banner:** Inset dark container with direct sales CTA.

## Page 05: Company & Mission (`/about`)
1. **Narrative Hero:** High-impact documentary photograph of the founders/team + editorial manifesto.
2. **Core Values Grid:** 4-column Bento grid detailing foundational principles.
3. **Timeline / Milestones:** Vertical roadmap showing key architectural releases.
4. **Leadership Directory:** 4-column profile card grid with monochrome portraits and social links.
5. **Join the Team CTA:** Link to open engineering and design roles.

---

# 18. DESIGN CONSISTENCY RULES

To ensure the website feels like **one cohesive, production-grade product**:
1. **Unified Token Consumption:** Every page must consume the exact CSS variables declared in Section 2. Never hardcode ad-hoc hex codes in page-specific style sheets.
2. **Identical Navigation & Footer:** The floating frosted navbar dock and the deep forest watermark footer must be identical across all 5 pages.
3. **Consistent Corner Radii:** Cards are always `16px`; buttons and badges are always `9999px` (pill); inputs are always `10px`.
4. **Typographic Discipline:** Never introduce a third font family. Headlines are strictly Display Serif or Sans; body is strictly Sans; tabular data is strictly Mono.

---

# 19. AI CODING ANTI-PATTERNS (BLACKLIST)

Coding agents implementing this design system **must strictly avoid** the following visual blunders:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      STRICTLY FORBIDDEN PATTERNS                       │
├────────────────────────────────────────────────────────────────────────┤
│ ❌ Cyberpunk aesthetics, neon blue/purple borders, and laser glows      │
│ ❌ 3D cartoon clay characters or emoji mascots holding devices          │
│ ❌ Floating UI cards tilted at 15° angles with zero functional purpose  │
│ ❌ Unreadable glassmorphism where blurry backgrounds bleed through copy │
│ ❌ Rainbow gradient buttons or multi-color borders                      │
│ ❌ Arbitrary decorative blobs, floating geometric candy, or confetti    │
│ ❌ Pure black (#000000) surfaces                                       │
│ ❌ Inconsistent corner radii (e.g., mixing 48px cards with 4px buttons) │
│ ❌ Using different font pairings or color palettes between pages        │
└────────────────────────────────────────────────────────────────────────┘
```

---

# 20. IMPLEMENTATION RULE (DECISION TREE)

When an implementation detail is not explicitly written in this specification:

```
                  UNSPECIFIED UI ELEMENT
                            │
                            ▼
           Does it exist in reference-analysis.md?
                 ├─── YES ──► Follow analyzed reference pattern
                 │
                 └─── NO
                       │
                       ▼
        Can it be built using established tokens?
        (Colors from Sec 2, Radii from Sec 6, Fonts from Sec 3)
                 ├─── YES ──► Compose using existing design tokens
                 │
                 └─── NO
                       │
                       ▼
        Default to Minimum Architectural Invasiveness:
        • Surface: Pure white (#FFFFFF)
        • Border: 1px solid rgba(15, 23, 42, 0.08)
        • Radius: 16px (card) or 9999px (button/pill)
        • Typography: 14px/15px Plus Jakarta Sans (#0F172A)
        • Shadow: var(--shadow-card)
        • Never invent a new decorative style
```

---

## Final Verification Checklist for Coding Agents

Before submitting code, verify that:
- [ ] Base background is `--color-bg-canvas` (`#F8F9FA`).
- [ ] Navbar is a floating frosted pill dock (`60px` height, `backdrop-filter: blur(20px)`).
- [ ] Hero headline utilizes Display Serif italic accent on 1 or 2 operative keywords.
- [ ] Buttons are pill-shaped (`border-radius: 9999px`) with directional glyphs (`→`).
- [ ] Feature sections follow the 4-module Bento grid layout.
- [ ] Metric band uses the high-contrast Inset Dark Container (`#0B1914`) with tabular numbers.
- [ ] All interactive cards feature subtle `translateY(-3px)` lift on hover.
- [ ] Text contrast complies with WCAG AA (minimum 4.5:1, targeted 7:1+).
- [ ] Zero AI clichés (no neon glows, no tilted cards, no 3D clay figures).
