

## Redesign Offline Banner

Replace the current top-bar offline banner with a modern floating toast-style notification in the bottom-right corner.

### Design
- Floating card positioned `fixed bottom-6 right-6` with rounded corners, shadow, and backdrop blur
- Icon + message + dismiss button in a compact layout
- Slide-in animation from the bottom
- Uses existing card/border styling for theme consistency

### Changes
- **`src/components/OfflineBanner.tsx`** — Rewrite to a floating bottom-right toast card with dismiss capability and entrance animation

