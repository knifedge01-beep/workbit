---
name: use-design-system
description: Use the project design system at src/design-system for all UI work. Use when building or editing UI, adding components, styling pages, or when the user references @src/design-system, design system, or UI components.
---

# Use Design System (@src/design-system)

When building or editing UI in this project, use the design system. Do not introduce raw HTML elements or one-off styled-components for things the design system already provides.

## Rules

1. **Import from the design system**  
   Use `@/design-system` or `src/design-system` (alias/path as configured). All exports come from the root: `import { Button, Card, Heading, Text, ... } from '@/design-system'`.

2. **Theme is required**  
   The app must be wrapped in `ThemeProvider`. Components rely on styled-components theme (colors, spacing, radii). For mode or toggle: `const { mode, setMode, toggle } = useTheme()`.

3. **Prefer design-system components**  
   - **Layout:** `Container`, `Flex`, `Stack`, `Grid` (not raw divs with custom flex/grid).  
   - **Typography:** `Heading` (level 1–6), `Text` (size, muted), `Label` (forms).  
   - **Buttons:** `Button` (variant: primary | secondary | outline | ghost, size: sm | md), `IconButton` (require `aria-label`).  
   - **Forms:** `Input`, `Textarea`, `Search`, `Select`, `Dropdown`, `Checkbox`, `Switch`.  
   - **Surfaces/overlays:** `Card`, `Modal`, `Popup`, `Tooltip`, `Drawer`.  
   - **Navigation:** `Navbar`, `Breadcrumb`, `Tabs`; sidebar: `Sidebar`, `SidebarSection`, `SidebarNavItem`, etc.  
   - **Feedback:** `Alert`, `Banner`, `Badge`, `Notification`, `Skeleton`.  
   - **Data:** `Table` (TanStack), `Avatar`, `Divider`, `Tags`, `StarRating`, etc.  
   - **Menus:** `Menu` with `MenuItem` / `MenuDivider` (`MenuEntry`).  
   Use the component that matches the intent instead of building a custom equivalent.

4. **Styled-components and theme**  
   When writing new styled-components that should match the app, use the theme: `p.theme.colors.*`, `p.theme.spacing[n]`, `p.theme.radii.*`. Do not hardcode colors or spacing that exist in the theme.

5. **Types**  
   Import shared types from the design system when needed: `ThemeMode`, `DropdownOption`, `PopupPlacement`, `PopupAlign`, `MenuItem`, `MenuDivider`, `MenuEntry`, `BreadcrumbItem`, `TabItem`, `ColumnDef`, `SortingState`, `AccordionItem`, `SelectorOption`, `AdvancedToggleOption`, `StepItem`, `TreeNode`, `ChatMessage`, `ChatUser`, `SearchVariant`, `RichTextProps`.

## Quick reference

- **Full reference:** See [.cursor/docs/DESIGN_SYSTEM.md](../../docs/DESIGN_SYSTEM.md) for component list, props, and import summary.  
- **Root exports:** `src/design-system/index.ts` re-exports colors, spacing, typography, layout, ui, navigation, `ThemeProvider`, `useTheme`, `ThemeToggle`, and theme types.

## Example

```tsx
import {
  ThemeProvider,
  Button,
  Card,
  Stack,
  Heading,
  Text,
  Input,
} from '@/design-system'

// In app root
<ThemeProvider>
  <App />
</ThemeProvider>

// In a component
<Card>
  <Stack gap={3}>
    <Heading level={2}>Title</Heading>
    <Text muted>Description</Text>
    <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter..." />
    <Button variant="primary" onClick={onSave}>Save</Button>
  </Stack>
</Card>
```

When in doubt, check the component in `src/design-system/ui/<ComponentName>/` or the DESIGN_SYSTEM.md doc for exact props and usage.
