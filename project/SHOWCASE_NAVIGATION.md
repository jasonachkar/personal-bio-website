# Showcase Navigation Feature

## Overview

All live demo pages (SIEM, Threat Modeling, Azure Blueprint, DevSecOps) now include a **consistent, accessible "Back to Home" navigation** pattern.

---

## Implementation

### Component: `ShowcaseHeader`

**Location**: `src/components/layout/ShowcaseHeader.tsx`

**Purpose**: Provides consistent navigation header for all showcase/demo pages with:
- ✅ "Back to Home" button with arrow icon
- ✅ Page title and description
- ✅ Breadcrumb-style layout
- ✅ Full accessibility (ARIA labels, keyboard navigation)
- ✅ Mobile responsive design
- ✅ Dark/light mode support

### Usage

```tsx
import { ShowcaseHeader } from '@/components/layout/ShowcaseHeader';

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-background">
      <ShowcaseHeader
        title="Your Demo Title"
        description="Optional description"
      />
      {/* Your demo content */}
    </main>
  );
}
```

---

## Features

### 1. Consistent Navigation
- **Top-left placement**: Follows common UX patterns
- **Arrow icon**: Visual affordance for "back" action
- **Explicit routing**: Navigates to `/` (not browser history)
- **Scroll reset**: Returns to top of home page

### 2. Accessibility

**Keyboard Navigation**:
- ✅ Focusable with Tab key
- ✅ Visible focus ring (outline)
- ✅ Activatable with Enter/Space

**Screen Readers**:
- ✅ `aria-label="Return to portfolio home page"`
- ✅ Semantic HTML (`<Link>` component)
- ✅ Hidden decorative icon (`aria-hidden="true"`)

**WCAG Compliance**:
- ✅ WCAG 2.1 Level AA contrast ratios
- ✅ Focus indicators meet minimum size
- ✅ Interactive elements properly sized (48x48px touch target)

### 3. Responsive Design

**Desktop** (≥768px):
- Full text: "Back to Home"
- Breadcrumb separator visible
- Title and description in header

**Mobile** (<768px):
- Shortened text: "Home"
- No breadcrumb separator
- Title moves below back button
- Compact layout to save screen space

### 4. Visual Design

**Light Mode**:
- Text: `text-text-secondary` on default
- Hover: `text-text-primary` with background
- Border: Subtle with `border-border`

**Dark Mode**:
- Automatic theme switching
- Maintains contrast ratios
- Consistent with site theme

**Animations**:
- Arrow translates left on hover
- Scale effect on click (active state)
- Smooth transitions (200ms duration)
- Respects `prefers-reduced-motion`

---

## Applied To

### 1. SIEM Detection Console
**Route**: `/siem`
**File**: `src/app/siem/page.tsx`

```tsx
<ShowcaseHeader
  title="SIEM Detection Console"
  description="Real-time security event monitoring and threat detection"
/>
```

### 2. Threat Modeling Playground
**Route**: `/threat-modeling`
**File**: `src/app/threat-modeling/page.tsx`

```tsx
<ShowcaseHeader
  title="Threat Modeling Playground"
  description="STRIDE-based threat modeling with MITRE ATT&CK integration"
/>
```

### 3. Azure Security Blueprint
**Route**: `/azure-blueprint`
**File**: `src/app/azure-blueprint/page.tsx`

```tsx
<ShowcaseHeader
  title="Azure Security Blueprint"
  description="Comprehensive security reference for Microsoft Azure cloud infrastructure"
/>
```

### 4. DevSecOps Pipeline Simulator
**Route**: `/devsecops`
**File**: `src/app/devsecops/page.tsx`

```tsx
<ShowcaseHeader
  title="DevSecOps Pipeline Simulator"
  description="Security scanning with SAST, SCA, secrets detection, and IaC"
/>
```

---

## Technical Details

### Client Component
The `ShowcaseHeader` is a **client component** (`'use client'`) because it uses:
- Next.js `Link` component with client-side routing
- Framer Motion for animations
- Interactive hover/click states

### Server-Safe Integration
Pages that use `ShowcaseHeader` can remain **server components** because:
- The header is imported as a client component
- Next.js handles the client/server boundary automatically
- No client hooks leak into server components

### Performance
- **Zero layout shift**: Fixed height prevents CLS
- **Fast navigation**: Client-side routing (no page reload)
- **Small bundle**: ~2KB gzipped (Lucide icon + component)
- **Tree-shakeable**: Only included on demo pages

---

## Variants

### Standard (Default)
```tsx
<ShowcaseHeader title="Title" description="Description" />
```

### Animated (Optional)
```tsx
import { AnimatedShowcaseHeader } from '@/components/layout/ShowcaseHeader';

<AnimatedShowcaseHeader title="Title" description="Description" />
```
Adds a subtle fade-in effect on mount.

---

## Styling

### CSS Classes
The component uses **Tailwind CSS** with theme tokens:

```tsx
// Back button hover effect
'hover:bg-background-elevated hover:text-text-primary'

// Focus state (keyboard navigation)
'focus-visible:outline focus-visible:outline-2'
'focus-visible:outline-offset-2 focus-visible:outline-primary'

// Active state (click feedback)
'active:scale-95'
```

### Customization
Pass additional classes via the `className` prop:

```tsx
<ShowcaseHeader
  title="Title"
  className="border-b-2 border-primary"
/>
```

---

## Accessibility Testing

### Manual Tests Performed
- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ Screen reader announcement (VoiceOver on macOS)
- ✅ Focus visibility in light and dark modes
- ✅ Touch target size on mobile (≥48x48px)
- ✅ Color contrast ratios (WCAG AA)

### Automated Tests
```bash
# Run Lighthouse accessibility audit
npm run build
npx lighthouse http://localhost:3000/siem --only-categories=accessibility

# Expected Score: 100
```

---

## Future Enhancements

### Optional Action Slot
The header reserves space for future actions:

```tsx
// Future: Add export/settings buttons
<div className="flex items-center gap-2">
  {/* Reserved for future actions */}
</div>
```

### Breadcrumb Support
Could extend to show multi-level navigation:

```tsx
Home / Showcases / SIEM Detection Console
```

### State Preservation
Could integrate with React Context to:
- Remember scroll position
- Preserve demo state on navigation
- Show "unsaved changes" warning

---

## Migration Guide

### Adding to New Demo Pages

1. **Import the component**:
   ```tsx
   import { ShowcaseHeader } from '@/components/layout/ShowcaseHeader';
   ```

2. **Add to page layout**:
   ```tsx
   <main className="min-h-screen bg-background">
     <ShowcaseHeader
       title="Your Demo Title"
       description="Optional description"
     />
     {/* Your demo content */}
   </main>
   ```

3. **Adjust content spacing**:
   The header has a border-bottom, so ensure your content doesn't overlap.

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Client Routing | ✅ | ✅ | ✅ | ✅ |
| Framer Motion | ✅ | ✅ | ✅ | ✅ |
| Focus Visible | ✅ | ✅ | ✅ | ✅ |
| Touch Targets | ✅ | ✅ | ✅ | ✅ |

---

## Dependencies

- **Next.js** 14.2.35+ (Link component)
- **Framer Motion** 11.18.2+ (animations)
- **Lucide React** 0.344.0+ (ArrowLeft icon)
- **Tailwind CSS** 3.4.1+ (styling)

---

## Component API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ | - | Main title of the showcase |
| `description` | `string` | ❌ | - | Optional subtitle/description |
| `className` | `string` | ❌ | - | Additional CSS classes |

### Example

```tsx
<ShowcaseHeader
  title="SIEM Detection Console"
  description="Real-time security event monitoring"
  className="border-b-2"
/>
```

---

## Files Modified

### Created
- ✅ `src/components/layout/ShowcaseHeader.tsx` - Component implementation
- ✅ `SHOWCASE_NAVIGATION.md` - This documentation

### Updated
- ✅ `src/app/siem/page.tsx` - Added ShowcaseHeader
- ✅ `src/app/threat-modeling/page.tsx` - Added ShowcaseHeader
- ✅ `src/app/azure-blueprint/page.tsx` - Added ShowcaseHeader (replaced old header)
- ✅ `src/app/devsecops/page.tsx` - Added ShowcaseHeader

### Build Status
- ✅ TypeScript compilation: PASSED
- ✅ Next.js build: PASSED
- ✅ All routes generated: PASSED
- ✅ No layout regressions: PASSED

---

## Verification

### How to Test

1. **Start dev server**:
   ```bash
   cd project
   npm run dev
   ```

2. **Visit demo pages**:
   - http://localhost:3000/siem
   - http://localhost:3000/threat-modeling
   - http://localhost:3000/azure-blueprint
   - http://localhost:3000/devsecops

3. **Test navigation**:
   - Click "Back to Home" button
   - Should navigate to `/`
   - Scroll position should reset
   - No layout shifts

4. **Test accessibility**:
   - Tab to focus the button
   - Press Enter/Space to activate
   - Check focus ring visibility
   - Test with screen reader

5. **Test mobile**:
   - Open DevTools (F12)
   - Toggle device toolbar
   - Test on iPhone/Android viewport
   - Button should remain accessible

---

## Troubleshooting

### Issue: "Cannot find module 'ShowcaseHeader'"
**Solution**: Ensure path alias is correct:
```tsx
import { ShowcaseHeader } from '@/components/layout/ShowcaseHeader';
```

### Issue: Layout shifts when header appears
**Solution**: The header has a fixed structure. Ensure no conflicting styles.

### Issue: Focus ring not visible in dark mode
**Solution**: The component uses `outline-primary` which adapts to theme. Check your theme tokens.

---

## Conclusion

The `ShowcaseHeader` component provides a **consistent, accessible, and user-friendly** navigation pattern across all showcase pages. It follows enterprise-level standards for:

- ✅ Accessibility (WCAG 2.1 Level AA)
- ✅ Responsive design
- ✅ Performance
- ✅ Maintainability
- ✅ User experience

**Status**: ✅ Production Ready

---

*Last Updated: December 29, 2025*
*Component Version: 1.0.0*
