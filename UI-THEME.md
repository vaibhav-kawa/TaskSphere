# TaskSphere UI Theme Documentation

## 🎨 Design System Overview

TaskSphere uses a modern, professional design system built with Tailwind CSS and custom CSS variables for consistent theming across light and dark modes.

## 📝 Typography

### Font Families
- **Heading Font**: `Space Grotesk` - Modern geometric sans-serif for headings and titles
- **Body Font**: `Inter` - Clean, readable sans-serif for body text and UI elements

### Font Sizes & Weights

#### Headings
- **H1 (Hero)**: `text-6xl sm:text-7xl lg:text-8xl font-black` (96px-128px)
- **H1 (Standard)**: `text-4xl sm:text-5xl lg:text-6xl font-bold` (36px-60px)
- **H2**: `text-3xl sm:text-4xl font-semibold` (30px-36px)
- **H3**: `text-2xl font-semibold` (24px)
- **H4**: `text-xl font-semibold` (20px)
- **H5**: `text-lg font-semibold` (18px)
- **H6**: `text-base font-semibold` (16px)

#### Body Text
- **Large**: `text-lg` (18px)
- **Base**: `text-base` (16px)
- **Small**: `text-sm` (14px)
- **Extra Small**: `text-xs` (12px)

#### Font Weights
- **Black**: `font-black` (900)
- **Bold**: `font-bold` (700)
- **Semibold**: `font-semibold` (600)
- **Medium**: `font-medium` (500)
- **Regular**: `font-normal` (400)

## 🎨 Color Palette

### Light Mode Colors (HSL Values)
```css
--background: 220 33% 98%        /* #fafbfc */
--foreground: 226 46% 14%        /* #1a1f36 */
--primary: 258 86% 60%           /* #6366f1 */
--primary-foreground: 0 0% 100%  /* #ffffff */
--secondary: 216 80% 92%         /* #e0e7ff */
--secondary-foreground: 226 46% 18% /* #212749 */
--muted: 221 28% 90%             /* #e2e8f0 */
--muted-foreground: 223 18% 42%  /* #64748b */
--accent: 199 92% 70%            /* #38bdf8 */
--accent-foreground: 221 47% 15% /* #1e293b */
--destructive: 352 85% 60%       /* #ef4444 */
--border: 220 26% 85%            /* #d1d5db */
--card: 0 0% 100%                /* #ffffff */
```

### Dark Mode Colors (HSL Values)
```css
--background: 230 41% 6%         /* #0f172a */
--foreground: 218 30% 92%        /* #e2e8f0 */
--primary: 258 86% 66%           /* #7c3aed */
--primary-foreground: 0 0% 100%  /* #ffffff */
--secondary: 222 38% 20%         /* #1e293b */
--secondary-foreground: 218 30% 92% /* #e2e8f0 */
--muted: 222 38% 22%             /* #334155 */
--muted-foreground: 218 20% 70%  /* #94a3b8 */
--accent: 199 92% 54%            /* #0ea5e9 */
--accent-foreground: 226 46% 14% /* #1a1f36 */
--destructive: 352 72% 45%       /* #dc2626 */
--border: 222 38% 24%            /* #374151 */
--card: 230 41% 10%              /* #1e293b */
```

### Brand Gradients
- **Orb Gradient**: `radial-gradient(circle at top left, hsl(var(--primary) / 0.35) 0%, transparent 60%)`
- **Mesh Gradient**: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 45%, hsl(var(--secondary)) 100%)`
- **Hero Gradient**: `radial-gradient(120% 120% at 10% 10%, hsl(var(--primary) / 0.26), transparent 65%)`

## 📐 Spacing & Layout

### Container
- **Max Width**: `1400px` (2xl breakpoint)
- **Padding**: `2rem` (32px)
- **Center**: `true`

### Border Radius
- **Large**: `0.75rem` (12px)
- **Medium**: `calc(0.75rem - 2px)` (10px)
- **Small**: `calc(0.75rem - 4px)` (8px)
- **Card Radius**: `rounded-2xl` (16px)
- **Button Radius**: `rounded-xl` (12px)
- **Panel Radius**: `rounded-3xl` (24px)
- **Hero Panel**: `rounded-[32px]` (32px)

### Shadows
- **Brand Soft**: `0 20px 40px -24px rgba(93, 95, 239, 0.45)`
- **Brand Strong**: `0 45px 80px -40px rgba(20, 28, 60, 0.65)`

## 🔧 Component Styles

### Buttons
#### Primary Button
```css
bg-primary text-primary-foreground
shadow-brand-soft hover:shadow-brand-strong
px-6 py-3 rounded-xl font-medium
```

#### Secondary Button
```css
border-border/60 bg-background/70 text-foreground
backdrop-blur px-6 py-3 rounded-xl font-medium
```

#### Ghost Button
```css
text-muted-foreground hover:text-foreground
px-4 py-2 rounded-lg font-medium
```

### Cards
#### Standard Card
```css
rounded-3xl border border-border/70 bg-background/80
p-6 shadow-brand-soft
```

#### Glass Panel
```css
glass-panel rounded-[32px] border border-white/12
p-8 shadow-brand-strong backdrop-blur-md
```

### Navigation
#### Header
```css
sticky top-0 z-50 border-b border-border/60
bg-background/75 backdrop-blur-md h-16
```

#### Nav Links
```css
text-sm font-medium text-muted-foreground
hover:text-foreground transition-colors duration-200
```

## 🎭 Special Effects

### Glass Panel Effect
```css
.glass-panel {
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.04));
  box-shadow: 0 24px 60px -32px rgba(23, 25, 50, 0.45);
  backdrop-filter: blur(18px);
}

.dark .glass-panel {
  background: linear-gradient(160deg, rgba(40, 45, 75, 0.55), rgba(20, 22, 42, 0.35));
  box-shadow: 0 24px 64px -32px rgba(8, 10, 26, 0.75);
}
```

### Grid Overlay
```css
.bg-grid-overlay {
  background-image:
    linear-gradient(0deg, hsl(var(--foreground) / 0.04) 1px, transparent 1px),
    linear-gradient(90deg, hsl(var(--foreground) / 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
}
```

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1400px /* Container max-width */
```

## 🎨 Status Colors

### Task Status
- **TODO**: `border-sky-500/25 bg-sky-500/15 text-sky-500`
- **IN_PROGRESS**: `border-amber-500/25 bg-amber-500/10 text-amber-500`
- **COMPLETED**: `border-emerald-500/20 bg-emerald-500/10 text-emerald-400`
- **CANCELLED**: `border-red-500/25 bg-red-500/10 text-red-500`

### Priority Colors
- **LOW**: `text-green-500`
- **MEDIUM**: `text-yellow-500`
- **HIGH**: `text-orange-500`
- **URGENT**: `text-red-500`

## 🔤 Text Styles

### Uppercase Labels
```css
text-xs font-semibold uppercase tracking-[0.28em]
text-muted-foreground
```

### Gradient Text (Brand)
```css
bg-gradient-to-r from-primary via-accent to-primary
bg-clip-text text-transparent font-black
```

### Muted Text
```css
text-muted-foreground text-sm
```

## 🎯 Interactive States

### Hover Effects
- **Cards**: `hover:-translate-y-1 hover:shadow-brand-strong`
- **Buttons**: `hover:shadow-brand-strong`
- **Links**: `hover:text-foreground`

### Focus States
- **Ring**: `focus:ring-2 focus:ring-primary focus:ring-offset-2`

### Active States
- **Scale**: `active:scale-95`
- **Opacity**: `active:opacity-80`

## 🌙 Dark Mode Implementation

Dark mode is implemented using CSS classes and localStorage persistence:

```typescript
const [isDark, setIsDark] = useState(() => {
  const saved = localStorage.getItem('theme');
  return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
});

useEffect(() => {
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}, [isDark]);
```

## 🎨 Animation & Transitions

### Standard Transitions
- **Duration**: `transition-all duration-300`
- **Easing**: `ease-in-out`

### Hover Animations
- **Transform**: `transition-transform duration-200`
- **Colors**: `transition-colors duration-200`

### Loading States
- **Pulse**: `animate-pulse`
- **Spin**: `animate-spin`

## 📋 Usage Guidelines

1. **Consistency**: Always use design tokens instead of hardcoded values
2. **Accessibility**: Maintain proper contrast ratios (4.5:1 minimum)
3. **Responsiveness**: Design mobile-first, enhance for larger screens
4. **Performance**: Use backdrop-blur sparingly for better performance
5. **Dark Mode**: Test all components in both light and dark modes

## 🔧 CSS Variables Usage

All colors should be used with the `hsl()` function:
```css
color: hsl(var(--foreground));
background-color: hsl(var(--background));
border-color: hsl(var(--border));
```

For opacity variations:
```css
background-color: hsl(var(--primary) / 0.1);
border-color: hsl(var(--border) / 0.6);
```