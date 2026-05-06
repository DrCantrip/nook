# Cornr Icon — Production Export

Master composition: corner mark above "Cornr" wordmark (Lora Bold Italic),
cream `#FAF7F3` on terracotta `#C4785A`. Locked from v6 capitalisation
comparison.

## Files

### Vector source
- `cornr-icon-master.svg` — full master with Lora 700 italic embedded as
  base64 woff2. Renders standalone in any browser/viewer.
- `cornr-icon-master-lean.svg` — same composition but references Lora by
  name without embedding. Use this if your build pipeline supplies the
  font separately.

### iOS PNG sizes
All rendered directly from the master SVG at native resolution
(not downsampled from 1024).

| File | Use |
|---|---|
| cornr-icon-1024.png | App Store marketing |
| cornr-icon-180.png | iPhone @3x |
| cornr-icon-167.png | iPad Pro @2x |
| cornr-icon-152.png | iPad @2x |
| cornr-icon-120.png | iPhone @2x |
| cornr-icon-87.png | iPhone Settings @3x |
| cornr-icon-80.png | iPhone Spotlight @2x |
| cornr-icon-76.png | iPad @1x |
| cornr-icon-60.png | iPhone Notification @3x |
| cornr-icon-58.png | iPhone Settings @2x |
| cornr-icon-40.png | iPhone Spotlight @1x, iPad Notification @2x |
| cornr-icon-29.png | iPhone Settings @1x |
| cornr-icon-20.png | iPad Notification @1x |

### Compositing variant
- `cornr-icon-1024-transparent.png` — mark + wordmark only, no terracotta
  background. 92.8% transparent pixels.

## Legibility flag

The full composition reads cleanly down to **29×29**. At **20×20** the
mark's right-vertical and wordmark merge into visual noise and individual
letterforms are unreadable. If 20×20 fidelity matters, a simplified
mark-only variant should be commissioned for iPad Notification @1x.

## Composition geometry (for reference)

- Canvas: 1024×1024, no pre-rounded corners (iOS applies the squircle mask)
- Wordmark: Lora 700 italic, 280px font-size, baseline y=730
- Wordmark rendered width: ~683px (~67% canvas)
- Corner mark: path `M 10 14 L 190 14 L 190 90` in 200×95 viewBox
- Mark width: 683px (matches wordmark width)
- Mark stroke: 36px on canvas (matched to Lora Bold Italic stem weight)
- Mark position: top-left at (170.5, 230.5)
- Stack vertical centre: 47% of canvas height
- Margins: ~14-15% canvas on all sides
