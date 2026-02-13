# ClawLens Animation Guide

## Animation Philosophy

ClawLens animations should feel **technical, precise, and purposeful** — like a high-end HUD interface.

### Principles

1. **Subtlety over Flash** — Animations should enhance, not distract
2. **Consistency** — Same timing curves across similar interactions
3. **Purpose** — Every animation communicates state change
4. **Performance** — Use GPU-accelerated properties only

---

## Timing Standards

### Duration Scale

| Duration | Use Case | CSS |
|----------|----------|-----|
| `100ms` | Micro-feedback (button press) | `duration-100` |
| `150ms` | Toggles, switches, small state changes | `duration-150` |
| `200ms` | Buttons, cards, hover states | `duration-200` |
| `300ms` | Page transitions, modals, panels | `duration-300` |
| `500ms` | Complex transitions, loading states | `duration-500` |
| `2000ms` | Ambient (pulse, glow) | Custom keyframes |

### Easing Curves

| Name | Curve | Use Case |
|------|-------|----------|
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Entering elements |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exiting elements |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | State changes |
| `linear` | `linear` | Continuous animations |

**Default:** `ease-out` for entering, `ease-in` for exiting

---

## Animation Patterns

### 1. Fade In (Page Load)

```tsx
<div className="animate-fade-in">
  {/* Content */}
</div>
```

**CSS:**
```css
@keyframes fade-in {
  from { 
    opacity: 0;
    transform: translateY(4px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
```

**Use for:** Page sections, cards on load, modal content

---

### 2. Status Pulse (Active Indicators)

```tsx
<span className="animate-pulse-cyan" />
```

**CSS:**
```css
@keyframes pulse-cyan {
  0%, 100% { 
    opacity: 1;
    box-shadow: 0 0 8px hsl(160, 80%, 45%);
  }
  50% { 
    opacity: 0.5;
    box-shadow: 0 0 4px hsl(160, 80%, 45%);
  }
}

.animate-pulse-cyan {
  animation: pulse-cyan 2s ease-in-out infinite;
}
```

**Use for:** Online status, active connections, processing indicators

---

### 3. Hover Glow (Interactive Elements)

```css
/* Card hover */
.hud-card {
  @apply transition-all duration-200 ease-out;
}

.hud-card:hover {
  @apply border-cyan/30;
  box-shadow: 
    0 0 0 1px hsl(160, 80%, 45%, 0.2),
    0 0 15px hsl(160, 80%, 45%, 0.1);
}

/* Button hover */
.btn-cyan {
  @apply transition-all duration-200 ease-out;
}

.btn-cyan:hover {
  @apply bg-cyan-light;
  box-shadow: 0 0 20px hsl(160, 80%, 45%, 0.4);
}
```

**Use for:** Cards, buttons, list items

---

### 4. Slide In (Navigation)

```css
@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in-left 0.3s ease-out;
}
```

**Use for:** Sidebar items, dropdown menus

---

### 5. Scale (Press Feedback)

```css
.btn-cyan:active {
  transform: scale(0.98);
  transition: transform 0.1s ease-out;
}
```

**Use for:** Button press feedback

---

### 6. Typing Indicator

```tsx
<div className="flex items-center gap-2 text-cyan">
  <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce" 
        style={{ animationDelay: '0ms' }} />
  <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce" 
        style={{ animationDelay: '150ms' }} />
  <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce" 
        style={{ animationDelay: '300ms' }} />
</div>
```

**Use for:** "Agent is thinking..." states

---

### 7. Progress Bar

```tsx
<div className="h-1 bg-charcoal-lighter rounded-full overflow-hidden">
  <div 
    className="h-full bg-cyan transition-all duration-500 ease-out"
    style={{ width: `${progress}%` }}
  />
</div>
```

**Use for:** Load indicators, tier usage

---

### 8. Border Draw (Corner Accents)

```css
.corner-accent::before,
.corner-accent::after {
  content: '';
  @apply absolute w-3 h-3 border-cyan/40 transition-all duration-300;
}

.corner-accent::before {
  @apply top-2 left-0 border-t border-l;
  opacity: 0;
  transform: translate(-4px, -4px);
}

.corner-accent:hover::before {
  opacity: 1;
  transform: translate(0, 0);
}
```

**Use for:** Card corner accents on hover

---

### 9. Scan Line (G1 Display)

```css
.g1-hud::after {
  content: '';
  @apply absolute inset-x-0 h-px bg-cyan/10;
  animation: scan-line 3s linear infinite;
}

@keyframes scan-line {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
```

**Use for:** G1 display simulator (optional, subtle)

---

### 10. Staggered List Entry

```tsx
<div className="space-y-2">
  {items.map((item, i) => (
    <div 
      key={item.id}
      className="animate-fade-in"
      style={{ 
        animationDelay: `${i * 50}ms`,
        animationFillMode: 'both'
      }}
    >
      {/* Item content */}
    </div>
  ))}
</div>
```

**Use for:** List items appearing sequentially

---

## Performance Best Practices

### GPU-Accelerated Properties Only

✅ **Safe to animate:**
- `transform` (translate, scale, rotate)
- `opacity`

❌ **Avoid animating:**
- `width`, `height` (causes reflow)
- `top`, `left`, `right`, `bottom` (causes reflow)
- `margin`, `padding` (causes reflow)
- `box-shadow` (can be slow)

**Workaround for width/height:**
```css
/* Use scale instead */
.expandable {
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.3s ease-out;
}

.expandable.open {
  transform: scaleY(1);
}
```

### will-change

```css
/* For elements that animate frequently */
.pulsing-indicator {
  will-change: opacity, box-shadow;
}

/* Remove after animation completes */
.animated-element {
  will-change: transform, opacity;
  animation: fade-in 0.3s ease-out forwards;
}

.animated-element.animation-complete {
  will-change: auto;
}
```

---

## Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .animate-pulse-cyan {
    animation: none;
    opacity: 1;
  }
}
```

---

## Common Animation Classes

Add to `index.css`:

```css
/* Entrance */
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}

.animate-slide-in-left {
  animation: slide-in-left 0.3s ease-out;
}

/* Continuous */
.animate-pulse-cyan {
  animation: pulse-cyan 2s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse 3s ease-in-out infinite;
}

/* Hover */
.hover-lift {
  @apply transition-transform duration-200 ease-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

.hover-glow {
  @apply transition-all duration-200 ease-out;
}

.hover-glow:hover {
  box-shadow: 0 0 20px hsl(160, 80%, 45%, 0.3);
}
```

---

## Animation Checklist

When adding animations, ask:

- [ ] Does it serve a purpose (feedback, guidance, delight)?
- [ ] Is the duration appropriate (not too fast/slow)?
- [ ] Does it use GPU-accelerated properties?
- [ ] Is it consistent with existing animations?
- [ ] Does it respect `prefers-reduced-motion`?
- [ ] Is it subtle enough to not distract?

---

## Examples in Context

### Button with Full Animation Stack

```tsx
<Button 
  className="btn-cyan relative overflow-hidden group"
>
  {/* Background shimmer on hover */}
  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
  
  <Save className="w-4 h-4 mr-2 relative z-10" strokeWidth={1.5} />
  <span className="relative z-10">SAVE</span>
</Button>
```

### Card with Hover States

```tsx
<Card className="hud-card group cursor-pointer">
  {/* Corner accents that appear on hover */}
  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan/0 group-hover:border-cyan/40 transition-colors duration-300" />
  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan/0 group-hover:border-cyan/40 transition-colors duration-300" />
  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan/0 group-hover:border-cyan/40 transition-colors duration-300" />
  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan/0 group-hover:border-cyan/40 transition-colors duration-300" />
  
  <CardContent className="p-5 transition-transform duration-200 group-hover:translate-y-[-2px]">
    {/* Content */}
  </CardContent>
</Card>
```

---

*Keep animations purposeful and consistent. When in doubt, use fade-in with 200-300ms duration.*
