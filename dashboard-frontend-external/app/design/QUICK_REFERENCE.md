# ClawLens Quick Reference Card

## 🎨 Colors

```
Primary:     cyan        #00D4AA   hsl(160, 80%, 45%)
Alert:       vermillion  #D64545   hsl(355, 70%, 55%)
Background:  charcoal    #12141A   hsl(220, 15%, 8%)
Card BG:     charcoal-l  #1A1D26   hsl(220, 10%, 12%)
Border:      charcoal-ll #2A2E3D   hsl(220, 10%, 18%)
Text:        offwhite    #F2F2F2   hsl(0, 0%, 95%)
Muted:       gray        #6B7280   hsl(220, 10%, 45%)
```

## 🔤 Typography

```tsx
// Page title
<h2 className="section-title text-2xl font-bold tracking-wider">TITLE</h2>
<p className="text-xs text-gray tracking-widest mt-1">JAPANESE // SUB</p>

// Card title
<CardTitle className="text-sm font-bold tracking-wider">TITLE</CardTitle>
<p className="text-[9px] text-gray tracking-widest">JAPANESE</p>

// Monospace data
<span className="font-mono text-sm text-cyan">VALUE</span>

// Label
<Label className="text-[10px] text-gray tracking-wider uppercase">LABEL</Label>
```

## 📦 Card Pattern

```tsx
<Card className="hud-card">
  <CardHeader className="pb-3 border-b border-charcoal-lighter">
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-cyan" strokeWidth={1.5} />
      <div>
        <CardTitle className="text-sm font-bold tracking-wider">TITLE</CardTitle>
        <p className="text-[9px] text-gray tracking-widest">JAPANESE</p>
      </div>
    </div>
  </CardHeader>
  <CardContent className="pt-4">
    {/* Content */}
  </CardContent>
</Card>
```

## 🔘 Buttons

```tsx
// Primary
<Button className="btn-cyan">
  <Icon className="w-4 h-4 mr-2" strokeWidth={1.5} />
  LABEL
</Button>

// Secondary
<Button variant="outline" className="btn-outline">LABEL</Button>

// Icon
<Button variant="ghost" size="icon" className="text-gray hover:text-cyan">
  <Icon className="w-4 h-4" strokeWidth={1.5} />
</Button>
```

## 🏷️ Badges

```tsx
<Badge className="badge-cyan">STATUS</Badge>
<Badge className="badge-vermillion">ALERT</Badge>
<Badge className="bg-charcoal-lighter text-gray">DEFAULT</Badge>
```

## 📊 Status Indicators

```tsx
// Active (pulsing)
<span className="w-2 h-2 rounded-full bg-cyan animate-pulse-cyan shadow-[0_0_10px_hsl(160,80%,45%)]" />

// Inactive
<span className="w-2 h-2 rounded-full bg-gray/50" />

// Alert
<span className="w-2 h-2 rounded-full bg-vermillion" />
```

## 🎬 Animations

```tsx
// Page fade-in
<div className="animate-fade-in">

// Pulsing status
<span className="animate-pulse-cyan">

// Hover transitions
className="transition-all duration-200"

// Staggered list
style={{ animationDelay: `${i * 50}ms` }}
```

## 📐 Spacing

```
Page padding:     p-8      (32px)
Section gap:      space-y-6 (24px)
Card gap:         gap-4    (16px)
Tight gap:        gap-3    (12px)
Card padding:     p-4/p-5  (16-20px)
```

## 🎯 Icon Sizes

```
Small:   w-3 h-3    (badges, inline)
Medium:  w-4 h-4    (buttons, lists)
Large:   w-5 h-5    (headers, nav)
```

**Always use:** `strokeWidth={1.5}`

## 🔧 Common Tailwind Patterns

```
// Border
border-charcoal-lighter

// Background
bg-charcoal-lighter/30
bg-cyan/10

// Text
text-offwhite
text-offwhite/80
text-gray
text-cyan

// Hover
hover:text-cyan
hover:border-cyan/30
hover:bg-cyan/5

// Focus
focus:ring-cyan/50
focus:border-cyan
```

## 📝 CSS Custom Classes

```css
.hud-card          /* Card with HUD styling */
.corner-accent     /* Corner bracket decorations */
.cyan-glow         /* Text glow effect */
.cyan-border-glow  /* Border with glow */
.g1-hud            /* G1 display simulator */
.section-title     /* Title with underline */
.btn-cyan          /* Primary button */
.btn-outline       /* Outline button */
.badge-cyan        /* Cyan badge */
.badge-vermillion  /* Vermillion badge */
.animate-fade-in   /* Page fade-in */
.animate-pulse-cyan /* Pulsing cyan */
```

## 🚫 Don'ts

- ❌ `strokeWidth` without value (use 1.5)
- ❌ Forget Japanese labels
- ❌ Pure black/white (use charcoal/offwhite)
- ❌ Large border-radius (use rounded-sm max)
- ❌ Mix icon libraries (use Lucide only)
- ❌ Animate width/height (use transform)

---

*Print this out or keep it pinned while developing*
