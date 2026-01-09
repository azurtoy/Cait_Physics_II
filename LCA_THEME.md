# 🎀 LCA's Secret Archive - Design System

## 컨셉
**"LCA의 시크릿 아카이브"** - 흑백 미니멀리즘 + 룰루레몬 핑크 포인트

---

## 🎨 Color Palette

### Primary Colors
```css
White:      #FFFFFF   (배경)
Black:      #1a1a1a   (텍스트)
Grey:       #9CA3AF   (보조)
Neutral:    #D4D4D4   (Mystery Box)
```

### Accent Color (LCA Pink)
```css
Primary:    #FF358B   (룰루레몬 핫핑크)
Light:      #FFE5F1   (배경 강조)
Dark:       #E6006B   (호버 효과)
```

---

## 📐 Typography

### Font Family
```css
font-family: 'Inter', 'Pretendard', system-ui, sans-serif;
```

### Sizes & Weights
- **Header**: `text-sm`, `font-light`, `tracking-widest`
- **Body**: `text-xs`, `font-light`, `tracking-wide`
- **Buttons**: `text-xs`, `font-light`, `tracking-widest`

---

## ✨ Interactive Elements

### Hover States
- Text: `hover:text-lca-pink`
- Border: `hover:border-lca-pink`
- Background: `hover:bg-lca-pink`

### Focus States
- Input: `focus:border-lca-pink`
- Link: Pink underline

### Active States
- Button: Pink background + white text
- Link: Pink text

---

## 🎭 Animations

### Fade In
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
duration: 300ms
```

### Shake (Error)
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
duration: 500ms
```

### Transitions
- All: `transition-all duration-300`
- Colors: `transition-colors duration-300`
- Opacity: `transition-opacity duration-300`

---

## 📦 Components

### Mystery Box
```
Initial:
┌──────────┐
│          │  bg-neutral-300, 40x10
└──────────┘

Clicked:
┌──────────┐
│Physics II│  border-lca-pink, text-lca-pink
└──────────┘
```

### Buttons
```css
Primary: 
  border-black
  hover: bg-lca-pink + text-white

Secondary:
  border-gray
  hover: bg-pink-50 + text-lca-pink
```

### Links
```css
Normal: text-gray-700
Hover: text-lca-pink
Active: text-lca-pink + font-medium
```

### Inputs
```css
Border: border-black
Focus: border-lca-pink
Error: border-lca-pink + shake animation
```

---

## 🌟 Special Features

### LCA Signature
```
text-lca-pink
italic
text-right
"from. LCA"
```

### Error Messages
```
text-lca-pink
font-light
animate-fade-in
"Incorrect password."
```

### Contact Button
```
fixed bottom-8 right-8
text-gray-400
hover:text-lca-pink
```

---

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Desktop: >= 768px

### Layout
- Center-aligned
- Max-width: 4xl (56rem)
- Generous whitespace
- Gallery-like feeling

---

## 🎯 Brand Guidelines

### Do's ✅
- Use pure black & white as base
- Use LCA Pink for all interactions
- Keep fonts small and light
- Maintain generous spacing
- Smooth animations (300ms)

### Don'ts ❌
- Don't use blue colors
- Don't use heavy fonts
- Don't add shadows
- Don't use emojis excessively
- Don't clutter the space

---

## 🔐 Course-Specific Features

### Environment Variables
```bash
PHYSICS_PASSWORD=physics2026
CALCULUS_PASSWORD=calculus2026
SITE_PASSWORD=default_fallback
```

### Course Identification
- Each course has unique password
- Extensible for future courses
- Fallback to SITE_PASSWORD

---

## 📝 Notes

Created for: **LCA's Secret Archive**  
Theme: **Ultra-Minimalist + Lululemon Pink**  
Mood: **Stealth Mode, Professional, Clean**

> "Physics isn't exactly my strongest suit, so I hope this space can serve as a survival guide for us."  
> **— from. LCA**
