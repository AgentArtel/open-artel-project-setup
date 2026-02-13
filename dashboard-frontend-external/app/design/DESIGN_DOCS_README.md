# ClawLens Design Documentation

This directory contains comprehensive design system documentation for the ClawLens dashboard.

## 📚 Documentation Files

| File | Purpose | When to Read |
|------|---------|--------------|
| `DESIGN_SYSTEM.md` | Complete design system specification | Starting new work, need full context |
| `COMPONENT_GUIDE.md` | Copy-paste ready component patterns | Building new UI components |
| `ANIMATION_GUIDE.md` | Animation standards and patterns | Adding motion/interactions |
| `QUICK_REFERENCE.md` | One-page cheat sheet | Daily development, quick lookups |

## 🎯 Quick Start

**New to the project?** Read in this order:
1. `DESIGN_SYSTEM.md` — Understand the philosophy and principles
2. `QUICK_REFERENCE.md` — Get familiar with common patterns
3. `COMPONENT_GUIDE.md` — Reference when building components

**Building a new section?**
1. Check `COMPONENT_GUIDE.md` for similar patterns
2. Reference `QUICK_REFERENCE.md` for colors/typography
3. Use `ANIMATION_GUIDE.md` for transitions

**Adding animations?**
1. Read `ANIMATION_GUIDE.md` principles first
2. Check timing standards
3. Copy patterns from examples

## 🎨 Design Philosophy Summary

**Dark HUD Aesthetic** inspired by:
- Even G1 smart glasses UI (cyan-on-black)
- Japanese minimalist design
- Military/aviation HUD interfaces
- Cyberpunk visual language

### Core Principles
1. **Function Over Form** — Every element serves a purpose
2. **High Contrast** — Critical for readability
3. **Information Density** — Compact, efficient layouts
4. **Visual Hierarchy** — Clear distinction between info levels
5. **Consistency** — Reusable patterns throughout

## 🌈 Color Palette

```
Primary:     cyan        #00D4AA
Alert:       vermillion  #D64545  
Background:  charcoal    #12141A
Card BG:     charcoal-l  #1A1D26
Border:      charcoal-ll #2A2E3D
Text:        offwhite    #F2F2F2
Muted:       gray        #6B7280
```

## 🔤 Typography

- **Primary:** Noto Sans JP
- **Monospace:** JetBrains Mono (data, timestamps)
- **Japanese labels:** Always paired with English

## 📦 Key Components

| Component | CSS Class | Usage |
|-----------|-----------|-------|
| Card | `.hud-card` | Primary container |
| Button Primary | `.btn-cyan` | Main actions |
| Button Secondary | `.btn-outline` | Secondary actions |
| Badge Cyan | `.badge-cyan` | Active states |
| Badge Vermillion | `.badge-vermillion` | Alerts |

## 🎬 Animation Defaults

| Type | Duration | Easing |
|------|----------|--------|
| Micro | 100-150ms | ease-out |
| Standard | 200ms | ease-out |
| Page | 300ms | ease-out |
| Ambient | 2000ms | ease-in-out |

## 📁 File Structure

```
src/
├── components/
│   ├── ui/              # shadcn components (don't modify)
│   └── Sidebar.tsx      # Navigation
├── sections/            # Page sections
│   ├── LiveMonitor.tsx
│   ├── AgentManagement.tsx
│   ├── GlassesConfig.tsx
│   ├── AgentStudio.tsx
│   └── ComputeTiers.tsx
├── types/
│   └── index.ts         # TypeScript types
├── App.tsx
├── index.css            # Global styles + design system
└── main.tsx
```

## 🛠️ Tech Stack

- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Icons:** Lucide React
- **Fonts:** Noto Sans JP, JetBrains Mono

## ✅ Do's and Don'ts

### ✅ Do
- Use `strokeWidth={1.5}` for all icons
- Include Japanese labels for major sections
- Use monospace for data/timestamps
- Apply `animate-fade-in` to page sections
- Use `tracking-wider` for uppercase text
- Keep borders subtle

### ❌ Don't
- Use default icon stroke width
- Forget Japanese labels
- Use pure black/white
- Over-animate
- Use large border-radius
- Mix icon libraries

## 🆘 Need Help?

1. Check `QUICK_REFERENCE.md` for common patterns
2. Look at existing sections in `src/sections/`
3. Reference `COMPONENT_GUIDE.md` for examples
4. Follow `ANIMATION_GUIDE.md` for motion

## 📝 Contributing

When adding new features:
1. Follow existing patterns from `COMPONENT_GUIDE.md`
2. Maintain color and typography consistency
3. Add Japanese labels for new sections
4. Use appropriate animations from `ANIMATION_GUIDE.md`
5. Update this documentation if adding new patterns

---

*Keep the design consistent. When in doubt, reference existing code.*
