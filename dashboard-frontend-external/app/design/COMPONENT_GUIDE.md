# ClawLens Component Guide

## Quick Start Patterns

Copy-paste ready components for common UI patterns.

---

## 1. Page Header

```tsx
// Standard page header with Japanese label
<div className="flex items-end justify-between border-b border-charcoal-lighter pb-4">
  <div>
    <h2 className="section-title text-2xl font-bold tracking-wider text-offwhite">
      PAGE TITLE
    </h2>
    <p className="text-xs text-gray tracking-widest mt-1">
      ページタイトル // SUBTITLE
    </p>
  </div>
  <div className="flex gap-3">
    {/* Action buttons */}
  </div>
</div>
```

---

## 2. Status Grid (4 columns)

```tsx
<div className="grid grid-cols-4 gap-4">
  {[
    { icon: Server, label: 'GATEWAY', value: 'ONLINE', sub: '127.0.0.1:18789' },
    { icon: Wifi, label: 'WEBSOCKET', value: 'OPEN', sub: 'Latency: 12ms' },
    { icon: Bluetooth, label: 'BLE', value: '-45 dBm', sub: 'RSSI: Good' },
    { icon: Battery, label: 'BATTERY', value: '87%', sub: '4.2h remaining' },
  ].map((item, i) => (
    <Card key={i} className="hud-card corner-accent">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-sm bg-cyan/10 border border-cyan/20 flex items-center justify-center">
            <item.icon className="w-4 h-4 text-cyan" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] text-gray tracking-wider">{item.label}</p>
            <p className="text-sm font-mono text-cyan cyan-glow">{item.value}</p>
            <p className="text-[9px] text-gray/60 font-mono">{item.sub}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

---

## 3. Data Card with Header

```tsx
<Card className="hud-card">
  <CardHeader className="pb-3 border-b border-charcoal-lighter">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Activity className="w-4 h-4 text-cyan" strokeWidth={1.5} />
        <div>
          <CardTitle className="text-sm font-bold tracking-wider text-offwhite">
            CARD TITLE
          </CardTitle>
          <p className="text-[9px] text-gray tracking-widest">
            カードタイトル
          </p>
        </div>
      </div>
      <Badge className="badge-cyan">STATUS</Badge>
    </div>
  </CardHeader>
  <CardContent className="pt-4">
    {/* Content */}
  </CardContent>
</Card>
```

---

## 4. List with Scroll

```tsx
<ScrollArea className="h-[280px]">
  <div className="space-y-2">
    {items.map((item) => (
      <div
        key={item.id}
        className="flex items-start gap-3 p-3 rounded-sm bg-charcoal-lighter/30 border border-charcoal-lighter hover:border-cyan/20 transition-colors"
      >
        <div className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0 border border-cyan/30 bg-cyan/10 text-cyan">
          <Icon className="w-4 h-4" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray font-mono">{item.timestamp}</span>
            <span className="text-xs text-offwhite/70">{item.source}</span>
            {item.badge && (
              <Badge className="badge-cyan text-[9px] h-4">{item.badge}</Badge>
            )}
          </div>
          <p className="text-sm text-offwhite/90 mt-0.5 truncate">{item.message}</p>
        </div>
      </div>
    ))}
  </div>
</ScrollArea>
```

---

## 5. Agent Card Grid

```tsx
<div className="grid grid-cols-2 gap-4">
  {agents.map((agent) => (
    <Card 
      key={agent.id} 
      className={`hud-card cursor-pointer transition-all duration-200 ${
        selectedAgent?.id === agent.id ? 'cyan-border-glow' : ''
      }`}
      onClick={() => setSelectedAgent(agent)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-sm bg-cyan/10 border border-cyan/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm text-offwhite tracking-wide">
                  {agent.name.toUpperCase()}
                </h3>
                <span className={`w-1.5 h-1.5 rounded-sm ${
                  agent.status === 'active' 
                    ? 'bg-cyan shadow-[0_0_8px_hsl(160,80%,45%)]' 
                    : 'bg-gray/50'
                }`} />
              </div>
              <p className="text-xs text-gray mt-0.5 line-clamp-1">{agent.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge className="badge-cyan text-[9px]">{agent.tier.toUpperCase()}</Badge>
                <span className="text-[10px] text-gray font-mono">P{agent.priority}</span>
                <span className="text-[10px] text-gray/60">{agent.lastActive}</span>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-gray hover:text-cyan"
          >
            <Edit3 className="w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>

        <Separator className="my-4 bg-charcoal-lighter" />

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {agent.skills.slice(0, 3).map((skill) => (
              <Badge 
                key={skill} 
                className="text-[9px] bg-charcoal-lighter text-gray border-charcoal-lighter capitalize"
              >
                {skill}
              </Badge>
            ))}
            {agent.skills.length > 3 && (
              <Badge className="text-[9px] bg-charcoal-lighter text-gray border-charcoal-lighter">
                +{agent.skills.length - 3}
              </Badge>
            )}
          </div>
          <Switch 
            checked={agent.enabled}
            className="data-[state=checked]:bg-cyan"
          />
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

---

## 6. Form Controls

### Slider

```tsx
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <Label className="text-xs text-gray tracking-wider uppercase">Brightness</Label>
    <span className="text-sm font-mono text-cyan">{value}%</span>
  </div>
  <Slider
    value={[value]}
    onValueChange={(v) => setValue(v[0])}
    max={100}
    step={5}
    className="w-full"
  />
</div>
```

### Toggle Group

```tsx
<div className="flex gap-2">
  {options.map((option) => (
    <Button
      key={option.value}
      variant={selected === option.value ? 'default' : 'outline'}
      className={`flex-1 h-auto py-2 ${
        selected === option.value 
          ? 'bg-cyan text-charcoal border-cyan' 
          : 'border-charcoal-lighter text-gray hover:text-cyan hover:border-cyan/50'
      }`}
      onClick={() => setSelected(option.value)}
    >
      <span className="text-lg font-mono">{option.label}</span>
    </Button>
  ))}
</div>
```

### Switch with Label

```tsx
<div className="flex items-center justify-between">
  <div className="space-y-0.5">
    <Label className="text-xs text-gray tracking-wider uppercase">Auto-Scroll</Label>
    <p className="text-[10px] text-gray/60">Automatically scroll long responses</p>
  </div>
  <Switch 
    checked={enabled}
    onCheckedChange={setEnabled}
    className="data-[state=checked]:bg-cyan"
  />
</div>
```

---

## 7. G1 Display Simulator

```tsx
<div className="g1-hud">
  {/* Corner accents */}
  <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan/40" />
  <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan/40" />
  <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyan/40" />
  <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyan/40" />
  
  <div className="relative z-10 space-y-3">
    {isTyping && (
      <div className="flex items-center gap-2 text-cyan text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
        <span className="font-mono tracking-wider">PROCESSING...</span>
      </div>
    )}
    <p className="text-cyan/90 font-mono text-sm leading-relaxed tracking-wide">
      {displayText}
    </p>
    {totalPages > 1 && (
      <div className="flex justify-center gap-1.5 mt-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-sm ${
              i + 1 === currentPage 
                ? 'bg-cyan shadow-[0_0_5px_hsl(160,80%,45%)]' 
                : 'bg-cyan/20'
            }`}
          />
        ))}
      </div>
    )}
  </div>
</div>
```

---

## 8. Tab Interface

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList className="bg-charcoal-lighter border border-charcoal-lighter">
    <TabsTrigger 
      value="preview" 
      className="data-[state=active]:bg-cyan data-[state=active]:text-charcoal text-xs"
    >
      <Glasses className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />
      PREVIEW
    </TabsTrigger>
    <TabsTrigger 
      value="test" 
      className="data-[state=active]:bg-cyan data-[state=active]:text-charcoal text-xs"
    >
      <Play className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />
      TEST
    </TabsTrigger>
  </TabsList>

  <TabsContent value="preview" className="mt-4">
    {/* Preview content */}
  </TabsContent>

  <TabsContent value="test" className="mt-4">
    {/* Test content */}
  </TabsContent>
</Tabs>
```

---

## 9. Table/List

```tsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="border-b border-charcoal-lighter">
        <th className="text-left py-3 px-3 text-[10px] text-gray tracking-wider">
          CAPABILITY
        </th>
        <th className="text-center py-3 px-3 text-[10px] text-cyan tracking-wider">
          TIER 1
        </th>
        <th className="text-center py-3 px-3 text-[10px] text-cyan tracking-wider">
          TIER 2
        </th>
        <th className="text-center py-3 px-3 text-[10px] text-cyan tracking-wider">
          TIER 3
        </th>
      </tr>
    </thead>
    <tbody>
      {data.map((row) => (
        <tr key={row.name} className="border-b border-charcoal-lighter/50">
          <td className="py-3 px-3">
            <span className="text-sm text-offwhite/80">{row.name}</span>
          </td>
          <td className="text-center py-3 px-3">
            {row.tier1 ? (
              <Check className="w-4 h-4 text-cyan mx-auto" strokeWidth={1.5} />
            ) : (
              <X className="w-4 h-4 text-gray/30 mx-auto" strokeWidth={1.5} />
            )}
          </td>
          {/* ... */}
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## 10. Dialog/Modal

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button className="btn-cyan">
      <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} />
      NEW AGENT
    </Button>
  </DialogTrigger>
  <DialogContent className="bg-charcoal border-charcoal-lighter text-offwhite max-w-lg">
    <DialogHeader>
      <DialogTitle className="text-lg font-bold tracking-wider">
        CREATE NEW AGENT
      </DialogTitle>
    </DialogHeader>
    <div className="space-y-5 pt-5">
      <div className="space-y-2">
        <Label className="text-xs text-gray tracking-wider uppercase">
          Agent Name
        </Label>
        <Input 
          placeholder="e.g., Travel Planner" 
          className="bg-charcoal-lighter border-charcoal-lighter text-offwhite" 
        />
      </div>
      {/* More fields */}
      <Button className="w-full btn-cyan">CREATE</Button>
    </div>
  </DialogContent>
</Dialog>
```

---

## CSS Utilities Reference

### Custom Classes (from index.css)

| Class | Description |
|-------|-------------|
| `.hud-card` | Standard card with HUD styling |
| `.corner-accent` | Corner bracket decorations |
| `.cyan-glow` | Text glow effect |
| `.cyan-border-glow` | Border with glow |
| `.g1-hud` | G1 display simulator container |
| `.section-title` | Page title with underline |
| `.btn-cyan` | Primary cyan button |
| `.btn-outline` | Outline button style |
| `.badge-cyan` | Cyan badge |
| `.badge-vermillion` | Vermillion badge |

### Animation Classes

| Class | Description |
|-------|-------------|
| `.animate-fade-in` | Page fade-in (0.3s) |
| `.animate-pulse-cyan` | Pulsing cyan (2s) |

---

## Icon Reference

### Common Icons by Section

| Section | Icons |
|---------|-------|
| Live Monitor | `Activity`, `Server`, `Wifi`, `Bluetooth`, `Battery`, `Bot` |
| Agents | `Bot`, `Plus`, `Settings`, `Bell`, `Cpu`, `Edit3`, `Trash2` |
| Glasses | `Sun`, `Type`, `Hand`, `Mic`, `Moon`, `Clock`, `Bell`, `Zap` |
| Studio | `FileCode`, `Play`, `Save`, `Download`, `Upload`, `Copy`, `Glasses` |
| Compute | `Cpu`, `Cloud`, `Smartphone`, `Server`, `Activity`, `Wifi` |

---

## Responsive Breakpoints

The design is optimized for desktop (1280px+). For smaller screens:

```tsx
// 4-col grid becomes 2-col on tablet
<div className="grid grid-cols-4 md:grid-cols-2 gap-4">

// Sidebar collapses on mobile (not yet implemented)
```

---

*Reference this guide when building new sections or components.*
