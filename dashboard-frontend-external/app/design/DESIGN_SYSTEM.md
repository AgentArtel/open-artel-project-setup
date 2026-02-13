# ClawLens Design System

## Design Philosophy

ClawLens follows a **Dark HUD (Heads-Up Display) Aesthetic** inspired by:
- Even G1 smart glasses UI (cyan-on-black display)
- Japanese minimalist design principles
- Military/aviation HUD interfaces
- Cyberpunk visual language

### Core Principles

1. **Function Over Form** — Every element serves a purpose
2. **High Contrast** — Critical for readability on dark backgrounds
3. **Information Density** — Compact, efficient layouts
4. **Visual Hierarchy** — Clear distinction between primary/secondary/tertiary info
5. **Consistency** — Reusable patterns, predictable behavior

---

## Color System

### Primary Palette

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `cyan` | `#00D4AA` | `hsl(160, 80%, 45%)` | Primary accent, active states, glows |
| `cyan-light` | `#33E0BF` | `hsl(160, 80%, 55%)` | Hover states |
| `cyan-dark` | `#00AA88` | `hsl(160, 80%, 35%)` | Pressed states |

### Secondary Palette

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `vermillion` | `#D64545` | `hsl(355, 70%, 55%)` | Alerts, edge tier, errors |
| `vermillion-light` | `#E06666` | `hsl(355, 60%, 65%)` | Hover alerts |
| `vermillion-dark` | `#B33636` | `hsl(355, 70%, 45%)` | Pressed alerts |

### Neutral Palette

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `charcoal` | `#12141A` | `hsl(220, 15%, 8%)` | Main background |
| `charcoal-light` | `#1A1D26` | `hsl(220, 10%, 12%)` | Card backgrounds |
| `charcoal-lighter` | `#2A2E3D` | `hsl(220, 10%, 18%)` | Borders, dividers |
| `offwhite` | `#F2F2F2` | `hsl(0, 0%, 95%)` | Primary text |
| `gray` | `#6B7280` | `hsl(220, 10%, 45%)` | Secondary text |

### Usage Rules

```css
/* Primary actions */
.btn-cyan { @apply bg-cyan text-charcoal; }

/* Destructive/alert actions */
.btn-vermillion { @apply bg-vermillion text-offwhite; }

/* Secondary text */
.text-muted { @apply text-gray; }

/* Borders */
.border-hud { @apply border-charcoal-lighter; }
```

---

## Typography

### Font Stack

```css
/* Primary (UI, headings) */
font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace (data, code, timestamps) */
font-family: 'JetBrains Mono', monospace;
```

### Type Scale

| Level | Size | Weight | Letter-Spacing | Usage |
|-------|------|--------|----------------|-------|
| H1 | `text-2xl` (24px) | `font-bold` (700) | `tracking-wider` | Page titles |
| H2 | `text-lg` (18px) | `font-bold` (700) | `tracking-wider` | Card titles |
| H3 | `text-sm` (14px) | `font-medium` (500) | `tracking-wide` | Section labels |
| Body | `text-sm` (14px) | `font-normal` (400) | `tracking-wide` | Content |
| Caption | `text-xs` (12px) | `font-normal` (400) | `tracking-wider` | Secondary info |
| Micro | `text-[10px]` | `font-normal` (400) | `tracking-widest` | Japanese labels |

### Japanese Labels

Always pair English with Japanese in smaller, muted text:

```tsx
<div>
  <h2 className="text-2xl font-bold tracking-wider">LIVE MONITOR</h2>
  <p className="text-[10px] text-gray tracking-widest">ライブモニター</p>
</div>
```

### Monospace Conventions

Use monospace for:
- Timestamps (`14:32:15`)
- Status values (`ONLINE`, `87%`)
- Technical data (`127.0.0.1:18789`)
- Code blocks

---

## Component System

### Card (`.hud-card`)

The primary container component.

```tsx
<Card className="hud-card">
  <CardHeader className="pb-3 border-b border-charcoal-lighter">
    {/* Header content */}
  </CardHeader>
  <CardContent className="pt-4">
    {/* Body content */}
  </CardContent>
</Card>
```

**CSS:**
```css
.hud-card {
  @apply bg-charcoal-light/80 backdrop-blur border border-charcoal-lighter;
  box-shadow: 
    0 0 0 1px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.03);
}
```

### Button Variants

| Variant | Class | Usage |
|---------|-------|-------|
| Primary | `btn-cyan` | Main actions (Save, Create, Run) |
| Outline | `btn-outline` | Secondary actions (Reset, Import) |
| Ghost | `variant="ghost"` | Icon buttons, subtle actions |

```tsx
// Primary action
<Button className="btn-cyan">
  <Save className="w-4 h-4 mr-2" strokeWidth={1.5} />
  SAVE
</Button>

// Secondary action
<Button variant="outline" className="btn-outline">
  RESET
</Button>

// Icon button
<Button variant="ghost" size="icon" className="text-gray hover:text-cyan">
  <Edit3 className="w-4 h-4" strokeWidth={1.5} />
</Button>
```

### Badge Variants

| Variant | Class | Usage |
|---------|-------|-------|
| Cyan | `badge-cyan` | Active states, primary info |
| Vermillion | `badge-vermillion` | Alerts, edge tier |
| Neutral | `bg-charcoal-lighter text-gray` | Default labels |

```tsx
<Badge className="badge-cyan">ONLINE</Badge>
<Badge className="badge-vermillion">EDGE</Badge>
<Badge className="bg-charcoal-lighter text-gray">P1</Badge>
```

### Status Indicators

```tsx
// Active status (pulsing)
<span className="w-2 h-2 rounded-full bg-cyan animate-pulse-cyan shadow-[0_0_10px_hsl(160,80%,45%)]" />

// Inactive status
<span className="w-2 h-2 rounded-full bg-gray/50" />

// Alert status
<span className="w-2 h-2 rounded-full bg-vermillion" />
```

---

## Layout Conventions

### Page Structure

```tsx
<div className="p-8 space-y-6 animate-fade-in">
  {/* Header */}
  <div className="flex items-end justify-between border-b border-charcoal-lighter pb-4">
    <div>
      <h2 className="section-title text-2xl font-bold tracking-wider">TITLE</h2>
      <p className="text-xs text-gray tracking-widest mt-1">JAPANESE // SUBTITLE</p>
    </div>
    {/* Actions */}
  </div>
  
  {/* Content */}
</div>
```

### Grid Patterns

```tsx
// 4-column status cards
<div className="grid grid-cols-4 gap-4">

// 2-column main content
<div className="grid grid-cols-2 gap-5">

// 3-column tier cards
<div className="grid grid-cols-3 gap-4">
```

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-y-6` | 24px | Section spacing |
| `gap-4` | 16px | Card gaps |
| `gap-3` | 12px | Tight gaps |
| `p-8` | 32px | Page padding |
| `p-4` | 16px | Card padding |
| `p-3` | 12px | Tight padding |

---

## Animation & Transitions

### Page Load

```tsx
// Fade in on mount
<div className="animate-fade-in">
```

**CSS:**
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
```

### Status Pulse

```tsx
// Pulsing cyan indicator
<span className="animate-pulse-cyan" />
```

**CSS:**
```css
@keyframes pulse-cyan {
  "0%, 100%": { opacity: "1"; }
  "50%": { opacity: "0.5"; }
}

.animate-pulse-cyan {
  animation: pulse-cyan 2s ease-in-out infinite;
}
```

### Hover Transitions

```css
/* Cards */
.hud-card {
  @apply transition-all duration-200;
}

.hud-card:hover {
  @apply border-cyan/30;
}

/* Buttons */
.btn-cyan {
  @apply transition-colors duration-200;
}

/* Navigation */
.nav-hud::before {
  @apply transition-all duration-200;
}
```

### Glow Effects

```css
/* Cyan glow on active elements */
.cyan-glow {
  text-shadow: 0 0 10px hsl(var(--cyan) / 0.5),
               0 0 20px hsl(var(--cyan) / 0.3);
}

/* Border glow */
.cyan-border-glow {
  box-shadow: 
    0 0 0 1px hsl(var(--cyan) / 0.3),
    0 0 15px hsl(var(--cyan) / 0.15),
    inset 0 1px 0 rgba(255,255,255,0.03);
}
```

### Transition Timing

| Duration | Usage |
|----------|-------|
| `150ms` | Micro-interactions (checkboxes, switches) |
| `200ms` | Buttons, cards, navigation |
| `300ms` | Page transitions, modals |

---

## Iconography

### Icon Library

Use **Lucide React** exclusively.

```tsx
import { Activity, Bot, Glasses, Cpu, Server } from 'lucide-react';
```

### Icon Conventions

| Size | Usage |
|------|-------|
| `w-3 h-3` | Inline with text, badges |
| `w-4 h-4` | Buttons, list items |
| `w-5 h-5` | Card headers, navigation |

### Stroke Width

Always use `strokeWidth={1.5}` for a refined, technical look.

```tsx
<Activity className="w-4 h-4" strokeWidth={1.5} />
```

### Icon Colors

```tsx
// Primary (cyan)
<Icon className="text-cyan" strokeWidth={1.5} />

// Secondary (gray)
<Icon className="text-gray" strokeWidth={1.5} />

// Muted
<Icon className="text-gray/60" strokeWidth={1.5} />
```

---

## Special Components

### G1 Display Simulator

```tsx
<div className="g1-hud">
  {/* Corner accents */}
  <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan/40" />
  <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan/40" />
  <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyan/40" />
  <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyan/40" />
  
  {/* Content */}
  <div className="relative z-10">
    <p className="font-mono text-sm text-cyan/90">Display text</p>
  </div>
</div>
```

### Section Title with Underline

```tsx
<h2 className="section-title text-2xl font-bold tracking-wider text-offwhite">
  LIVE MONITOR
</h2>
```

**CSS:**
```css
.section-title {
  @apply relative pb-3;
}

.section-title::after {
  content: '';
  @apply absolute bottom-0 left-0 w-16 h-[2px];
  background: linear-gradient(90deg, hsl(var(--cyan)) 0%, hsl(var(--cyan) / 0.3) 100%);
}
```

---

## File Structure

```
src/
├── components/
│   ├── ui/           # shadcn components (don't modify)
│   └── Sidebar.tsx   # Navigation sidebar
├── sections/         # Page sections
│   ├── LiveMonitor.tsx
│   ├── AgentManagement.tsx
│   ├── GlassesConfig.tsx
│   ├── AgentStudio.tsx
│   └── ComputeTiers.tsx
├── types/
│   └── index.ts      # TypeScript types
├── App.tsx
├── index.css         # Global styles + design system
└── main.tsx
```

---

## Do's and Don'ts

### ✅ Do

- Use `strokeWidth={1.5}` for all icons
- Include Japanese labels for all major sections
- Use monospace fonts for data/timestamps
- Apply `animate-fade-in` to page sections
- Use `tracking-wider` for uppercase text
- Keep borders subtle (`border-charcoal-lighter`)
- Use corner accents on important cards

### ❌ Don't

- Use default `strokeWidth` (too thick)
- Forget Japanese labels
- Use pure black (`#000`) — use `charcoal` instead
- Use pure white — use `offwhite` instead
- Over-animate (keep it subtle)
- Use rounded corners larger than `rounded-sm`
- Mix different icon libraries

---

## Quick Reference

### Common Patterns

```tsx
// Status card
<Card className="hud-card corner-accent">
  <CardContent className="p-4">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-sm bg-cyan/10 border border-cyan/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-cyan" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[10px] text-gray tracking-wider">LABEL</p>
        <p className="text-sm font-mono text-cyan cyan-glow">VALUE</p>
      </div>
    </div>
  </CardContent>
</Card>

// List item
<div className="flex items-start gap-3 p-3 rounded-sm bg-charcoal-lighter/30 border border-charcoal-lighter hover:border-cyan/20 transition-colors">
  {/* Content */}
</div>

// Badge group
<div className="flex flex-wrap gap-1">
  {items.map(item => (
    <Badge className="bg-charcoal-lighter text-gray border-0 text-xs">
      {item}
    </Badge>
  ))}
</div>
```

### Color Quick Pick

| Element | Class |
|---------|-------|
| Primary text | `text-offwhite` |
| Secondary text | `text-gray` |
| Muted text | `text-gray/60` |
| Primary accent | `text-cyan` |
| Alert/edge | `text-vermillion` |
| Card bg | `bg-charcoal-light` |
| Border | `border-charcoal-lighter` |

---

## Tailwind Config

Key additions to `tailwind.config.js`:

```js
colors: {
  cyan: {
    DEFAULT: "hsl(160, 80%, 45%)",
    light: "hsl(160, 80%, 55%)",
    dark: "hsl(160, 80%, 35%)",
  },
  vermillion: {
    DEFAULT: "hsl(355, 70%, 55%)",
    light: "hsl(355, 70%, 65%)",
    dark: "hsl(355, 70%, 45%)",
  },
  charcoal: {
    DEFAULT: "hsl(220, 15%, 8%)",
    light: "hsl(220, 10%, 12%)",
    lighter: "hsl(220, 10%, 18%)",
  },
  offwhite: "hsl(0, 0%, 95%)",
  gray: "hsl(220, 10%, 45%)",
}
```

---

## Credits

- **Even G1 UI**: Even Realities
- **Japanese Typography**: Noto Sans JP, Noto Serif JP
- **Monospace**: JetBrains Mono
- **Icons**: Lucide React
- **Components**: shadcn/ui

---

*Last updated: 2026-02-08*
*Version: 1.0*
