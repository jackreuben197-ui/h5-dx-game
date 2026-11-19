---
name: Nocturne Anchorage Poker
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e0e2eb'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e0e2eb'
  inverse-on-surface: '#2d3037'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#ffb1c5'
  on-secondary: '#65002f'
  secondary-container: '#e30071'
  on-secondary-container: '#fffbff'
  tertiary: '#f4f5ff'
  on-tertiary: '#283042'
  tertiary-container: '#d0d9f0'
  on-tertiary-container: '#565f72'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#ffd9e1'
  secondary-fixed-dim: '#ffb1c5'
  on-secondary-fixed: '#3f001b'
  on-secondary-fixed-variant: '#8f0045'
  tertiary-fixed: '#dae2fa'
  tertiary-fixed-dim: '#bec6dd'
  on-tertiary-fixed: '#121c2c'
  on-tertiary-fixed-variant: '#3e475a'
  background: '#10131a'
  on-background: '#e0e2eb'
  surface-variant: '#32353c'
typography:
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 20px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 15px
  data-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: -0.02em
  data-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: -0.01em
  data-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.5rem
  gutter-md: 0.75rem
  margin: 0.75rem
  margin-mobile: 0.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style
The design system establishes a high-stakes, competitive, and refined nocturnal poker environment. Tailored for analytical poker enthusiasts, competitive grinders, and high-roller mobile players, the visual experience prioritizes razor-sharp data legibility, low eye-strain under prolonged sessions, and an industrial marine aesthetic.

The design movement synthesizes **Industrial Tactile Minimalism** with **Cybernetic Nocturne Accents**:
- **Atmosphere:** Deep oceanic ink tones evoking late-night industrial sea terminals, foggy pier lights, and low-contrast woven felt texture.
- **Physicality:** Precision-milled brushed gunmetal rail borders with double-stitched recessed seams, avoiding hyper-glossy or plastic skeuomorphism in favor of muted, tactile aerospace finishes.
- **Contrast & Energy:** Action cues rely on controlled, high-luminance Electric Cyan accents (#00F0FF) with faint dual-tone rim light reflections in Subtle Magenta (#FF2A85), deliberately avoiding wide diffuse neon glows to preserve clean, uncompromised typography.

## Colors
The palette is calibrated for high information density, rapid split-second recognition, and strict dark-mode discipline:

- **Primary Action (Electric Cyan `#00F0FF`):** Reserved exclusively for active user turns, countdown breath indicators, and positive decision confirmations. High-luminance contrast against the dark base ensures zero ambiguity.
- **Secondary Accent (Subtle Magenta `#FF2A85`):** Serves as an atmospheric cool/warm secondary rim reflection and alert state (e.g., timeout urgency, all-in warning).
- **Table Felt & Canvas (Tertiary `#161F30` & Neutral `#080B11`):** The primary felt consists of deep ink blue (`#0D1522` to `#161F30`) overlaid with a micro-woven fabric grain. Background ambient canvas drops to near-abyssal gunmetal (`#080B11`).
- **Cards & Data Neutral:**
  - Card face: Solid ivory neutral `#F7F8FA` with zero glare.
  - Card pips: True arterial crimson `#E62335` for Hearts/Diamonds, pitch carbon `#12151A` for Spades/Clubs.
  - Text typography: Clean off-white `#E1E7F0` for primary figures and muted steel `#728299` for secondary labels.

## Typography
Typography is split strictly into structural headers, interface copy, and computational data:

- **Monospaced Data (`JetBrains Mono`):** All stack totals, bet values, pot numbers, and countdown counters use strict tabular alignment to eliminate jitter as amounts shift dynamically.
- **Structural Chrome (`Space Grotesk`):** Applied to major game states, action triggers, and primary HUD navigation for a crisp, engineered personality.
- **Interface Copy (`Inter`):** Renders player usernames, system notifications, and chat text with neutral, high-density legibility.
- **Rule of No Glow:** Font tokens strictly forbid outer neon glow, text drop-shadows with bloom, or gradient text fills. All text must stay razor-sharp and legible against dark surfaces.

## Layout & Spacing
The layout operates within a tight portrait mobile envelope (360px to 430px base viewport width) with an elliptical 8-seat poker stadium:

- **Vertical Layer Hierarchy:**
  - **Top Rail (44px):** Global table state, room identity, network status, quick deposit, audio controls.
  - **Upper Stadium Field:** Positions 1, 2, 3, 4, 5 distributed along the upper and lateral perimeter arcs.
  - **Felt Center (Core Zone):** Main Pot & Side Pots, Dealer Badge (`D`), 5 Community Cards aligned horizontally with a standard `4px` gap.
  - **Lower Field:** Lateral seats 6 & 7, player focal position (Seat 0 / User) anchored bottom-center.
  - **Action HUD (Pinned Bottom):** Dual hole-cards overlap with quick pot-multiplier pills (1/3, 1/2, 2/3, 1.0, All-in), followed by large thumb-zone decision triggers (Fold, Check/Call, Raise).
  - **Bottom Dock:** Brushed gunmetal pill bar for Table Stats, Hand History, Emotes, and Platform Certification.

## Elevation & Depth
Depth is modeled after physical industrial architecture rather than generic software shadows:

- **Level 0 (Environment Canvas):** Deepest background layer exhibiting subtle, cold oceanic twilight with far-off nautical light flickers rendered through low-opacity Gaussian blurs (30–40px blur, opacity < 0.15).
- **Level 1 (Table Perimeter & Rail):** Heavy gunmetal outer bumper with fine longitudinal brushed strokes. Inset bevels (`inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.6)`) establish weight. A recessed inner seam simulates tensioned industrial thread stitch.
- **Level 2 (Table Felt Core):** Deep ink blue surface with an ambient radial gradient vignette darkening toward the rail.
- **Level 3 (Player Pods & Interactive Badges):** Dual-layer micro-elevation: 1px hairline border (`rgba(255,255,255,0.1)`) accompanied by a directional contact shadow (`0 4px 12px rgba(0,0,0,0.4)`).
- **Level 4 (Active Player Turn & Overlays):** The active player pod projects an Electric Cyan (`#00F0FF`) concentric breathing ring (`0 0 12px rgba(0,240,255,0.45)`), accompanied on the opposite edge by a hairline specular rim reflection of Subtle Magenta (`rgba(255, 42, 133, 0.3)`).

## Shapes
Shapes express precision engineering and machined symmetry:

- **Avatars & Indicator Nodes:** Pure geometric circles (`rounded-full`) for 8-seat avatar pods, dealer tokens, and quick-bet percentage pills.
- **Playing Cards:** Custom engineered aspect ratio (5:7) with micro-radius corners (`rounded` - 4px) to retain authentic crisp corner profiles while eliminating harsh screen edges.
- **Action Triggers & Badges:** Rounded chamfer-like curves (`rounded-lg` / 8px to 12px) featuring distinct boundary highlights.
- **HUD Dock:** Machined capsule profile (`rounded-full`) at the base, creating a handheld industrial deck feel.

## Components

### 1. 8-Player Pods (Seat Nodes)
- **Base Avatar Frame:** Circular 48px to 54px frame with a gunmetal bevel ring (`#1C2638`).
- **Turn Indicator Ring:** When the action arrives, the circular border transforms into an active radial countdown timer ring in Electric Cyan (`#00F0FF`). Under 5 seconds remaining, it shifts to Subtle Magenta (`#FF2A85`) with heightened pulsing frequency.
- **Info Stack:** A connected dual-tier capsule pinned underneath the avatar:
  - Line 1: Monospaced Nickname truncated to 7 characters in `#B8C5D6`.
  - Line 2: Monospaced stack depth (e.g., `1,420.50 BB` or currency value) rendered in `#00F0FF` with high optical weight.
- **Folded State:** 40% master opacity with a desaturated slate fill.

### 2. Playing Cards (Hole & Community)
- **Material:** Ultra-smooth ivory core `#F7F8FA`, micro-border `#D1D8E0`, subtle under-card drop shadow (`0 2px 6px rgba(0,0,0,0.5)`).
- **Suits & Ranks:** High-legibility casino-standard indices. No gradients or glow effects on face figures.
- **User Hole Cards:** Rendered 25% larger than community cards at the screen bottom, angled at -3° and +3° overlap to optimize thumb reach and read clarity.

### 3. Bets & Pot Markers
- **Table Bets:** Positioned dynamically along the inner perimeter toward the central pot, featuring a high-contrast stacked poker chip icon coupled with a JetBrains Mono bet tag.
- **Central Pot Capsule:** Pill-shaped slate chassis (`#0E1624`) with an Electric Cyan inner keyline, displaying:
  - Header: `POT` in micro-caps.
  - Value: Bold monospaced number in pure white `#FFFFFF`.

### 4. Primary Decision Action Buttons (Fold / Check-Call / Raise)
- **Fold:** Brushed carbon `#1F2733` surface with muted neutral text `#8B9BB0`.
- **Check / Call:** Deep marine core `#0A3247` bordered by Electric Cyan (`#00F0FF`), dynamic text updating to "CHECK" or "CALL [AMT]".
- **Raise / Bet:** Electric Cyan filled CTA `#00F0FF` with dark void text `#050F1A` for maximal thumb visibility.
- **Pot Fraction Quick-Pills:** Placed above the main buttons (1/3, 1/2, 2/3, Pot, All-in) in translucent dark slate with 1px gunmetal rims.

### 5. Floating Chat & Hand History
- **Floating Chat Orb:** Semi-translucent dark capsule hovering at the lower left flank, housing an unread counter badge in Subtle Magenta (`#FF2A85`).
- **Footer Control Bar:** Frosted gunmetal capsule housing tactical utility icons (Stats, Hand Log, Presets, Fairplay Cert), separated by vertical hairline dividers (`rgba(255,255,255,0.08)`).