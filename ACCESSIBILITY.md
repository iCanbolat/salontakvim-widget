# Widget Accessibility Guide

## Keyboard Navigation

### Tab Order

- **Natural flow**: Service → Staff → Location → Date → Time → Customer Info → Confirmation
- **Focus visible**: All interactive elements have visible focus indicators
- **Skip to content**: Header has skip link for keyboard users

### Keyboard Shortcuts

- `Tab`: Move forward through interactive elements
- `Shift + Tab`: Move backward
- `Enter/Space`: Activate buttons and select options
- `Escape`: Close modals and dropdowns
- `Arrow keys`: Navigate within date picker and dropdowns

## Screen Reader Support

### ARIA Labels

All interactive elements have appropriate ARIA labels:

```tsx
<button aria-label="Select service: Haircut - $50">
  Haircut
</button>

<div role="region" aria-label="Service selection">
  {/* Service list */}
</div>
```

### ARIA Live Regions

Dynamic content updates are announced:

```tsx
<div aria-live="polite" aria-atomic="true">
  {isLoading ? "Loading services..." : `${services.length} services available`}
</div>
```

### Semantic HTML

- `<main>` for main content
- `<nav>` for sidebar navigation
- `<section>` for step containers
- `<article>` for cards
- Proper heading hierarchy (h1 → h2 → h3)

## Color Contrast

### WCAG AA Compliance

- Text contrast ratio: Minimum 4.5:1 for normal text
- Large text: Minimum 3:1
- UI components: Minimum 3:1

### Contrast Validation

```typescript
// Check contrast ratio
function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Ensure minimum contrast
const contrastRatio = getContrastRatio(primaryColor, backgroundColor);
if (contrastRatio < 4.5) {
  console.warn("Insufficient contrast ratio");
}
```

## Focus Management

### Focus Trap in Modals

Modals trap focus within their boundaries:

```tsx
<Dialog>
  <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
    {/* Modal content */}
  </DialogContent>
</Dialog>
```

### Focus Restoration

Focus returns to trigger element when closing modals:

```tsx
const triggerRef = useRef<HTMLButtonElement>(null);

function closeModal() {
  setIsOpen(false);
  triggerRef.current?.focus();
}
```

### Skip to Main Content

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

<main id="main-content">
  {/* Widget content */}
</main>
```

## Form Accessibility

### Labels and Descriptions

```tsx
<div>
  <label htmlFor="customer-email" className="sr-only">
    Email address
  </label>
  <input
    id="customer-email"
    type="email"
    aria-describedby="email-hint"
    aria-required="true"
    aria-invalid={!!errors.email}
  />
  <p id="email-hint" className="text-sm text-muted-foreground">
    We'll send your confirmation to this email
  </p>
  {errors.email && (
    <p role="alert" className="text-sm text-destructive">
      {errors.email}
    </p>
  )}
</div>
```

### Error Handling

- Errors announced to screen readers with `role="alert"`
- Error summary at top of form
- Inline error messages linked to inputs

### Required Fields

```tsx
<input required aria-required="true" aria-label="First name (required)" />
```

## Loading States

### Accessible Loading Indicators

```tsx
<div role="status" aria-live="polite">
  <LoadingSpinner />
  <span className="sr-only">Loading services...</span>
</div>
```

### Progress Indication

```tsx
<div
  role="progressbar"
  aria-valuenow={currentStep}
  aria-valuemin={0}
  aria-valuemax={totalSteps}
  aria-label={`Step ${currentStep} of ${totalSteps}`}
>
  {/* Progress bar visual */}
</div>
```

## Testing Checklist

### Keyboard Navigation

- [ ] All interactive elements reachable via Tab
- [ ] Focus order is logical
- [ ] Focus visible on all elements
- [ ] No keyboard traps
- [ ] Escape closes modals

### Screen Reader

- [ ] All images have alt text
- [ ] Form labels properly associated
- [ ] ARIA labels on icon buttons
- [ ] Live regions announce updates
- [ ] Heading structure is logical

### Color & Contrast

- [ ] Text contrast ≥ 4.5:1
- [ ] Large text contrast ≥ 3:1
- [ ] UI component contrast ≥ 3:1
- [ ] Color not sole indicator
- [ ] Focus indicators visible

### Forms

- [ ] Labels for all inputs
- [ ] Error messages announced
- [ ] Required fields indicated
- [ ] Helper text available
- [ ] Validation feedback clear

### Mobile

- [ ] Touch targets ≥ 44×44 pixels
- [ ] Pinch-to-zoom enabled
- [ ] Horizontal scrolling avoided
- [ ] Content reflows properly

## Tools for Testing

### Automated Testing

- **axe DevTools**: Browser extension for accessibility auditing
- **Lighthouse**: Built into Chrome DevTools
- **WAVE**: Web accessibility evaluation tool

### Manual Testing

- **Keyboard only**: Navigate without mouse
- **Screen reader**: Test with NVDA (Windows) or VoiceOver (Mac)
- **Zoom**: Test at 200% zoom level
- **Color blindness**: Use color blindness simulators

### Code Linting

```bash
# Install eslint-plugin-jsx-a11y
npm install -D eslint-plugin-jsx-a11y

# Add to ESLint config
{
  "extends": ["plugin:jsx-a11y/recommended"]
}
```

## Common Issues to Avoid

### ❌ Don't

```tsx
// Missing alt text
<img src="service.jpg" />

// Div button without role
<div onClick={handleClick}>Click me</div>

// Color-only indication
<span style={{ color: 'red' }}>Required</span>

// Placeholder as label
<input placeholder="Email" />
```

### ✅ Do

```tsx
// Proper alt text
<img src="service.jpg" alt="Haircut service" />

// Button element or proper role
<button onClick={handleClick}>Click me</button>

// Multiple indicators
<span className="text-destructive font-semibold">
  Required *
</span>

// Proper label
<label htmlFor="email">Email</label>
<input id="email" placeholder="you@example.com" />
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [React Accessibility](https://react.dev/learn/accessibility)
- [Radix UI Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
