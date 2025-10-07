# Design Guidelines: Voice-Enabled Telugu Billing App

## Design Approach
**Selected Approach:** Utility-First Mobile Design System inspired by successful Indian billing apps (Khatabook, Vyapar) combined with Material Design principles for voice interaction feedback.

**Rationale:** This is a function-critical productivity tool for busy shopkeepers requiring maximum efficiency, clarity, and reliability. The design prioritizes quick data entry, voice feedback, and clear information display over aesthetic flourish.

## Core Design Elements

### A. Color Palette

**Light Mode (Primary):**
- Primary: 220 80% 45% (Deep Blue - trust, reliability)
- Primary Hover: 220 80% 38%
- Success: 145 65% 45% (Green for confirmations)
- Warning: 35 90% 55% (Amber for alerts)
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 220 20% 15%
- Text Secondary: 220 15% 45%
- Border: 220 15% 85%

**Dark Mode:**
- Primary: 220 75% 55%
- Background: 220 20% 10%
- Surface: 220 18% 15%
- Text Primary: 0 0% 95%
- Border: 220 15% 25%

**Voice State Colors:**
- Recording: 0 85% 60% (Red pulse)
- Processing: 220 80% 45% (Primary animated)
- Success: 145 65% 45% (Green flash)

### B. Typography

**Font Families:**
- Primary: 'Noto Sans Telugu' (Google Fonts) for Telugu text
- Secondary: 'Inter' (Google Fonts) for English/numbers
- Monospace: 'JetBrains Mono' for bill numbers, prices

**Scale & Weights:**
- Headers: text-2xl to text-3xl, font-bold (650-700)
- Item Names: text-lg, font-semibold (600)
- Quantities/Prices: text-xl, font-bold (700) - high visibility
- Labels: text-sm, font-medium (500)
- Body: text-base, font-normal (400)
- Metadata: text-xs, font-normal (400)

### C. Layout System

**Spacing Primitives:** Consistent use of Tailwind units: 3, 4, 6, 8, 12, 16
- Component padding: p-4, p-6
- Section gaps: gap-4, gap-6
- Page margins: px-4, py-6
- Large breathing room: p-8, py-12

**Grid System:**
- Single column layouts (mobile-first)
- Item lists: Full-width cards with internal flex layouts
- Bill summary: Two-column grid for label-value pairs
- Quantity input: Flexible grid adapting to content

### D. Component Library

**Voice Input Module:**
- Large circular recording button (96px diameter) - primary color
- Pulsing animation during recording (scale 1.0 to 1.1, opacity 0.5 to 1.0)
- Waveform visualization bar below button
- Status text: "రికార్డ్ చేయండి" / "వినుతోంది..." / "చేర్చబడింది"
- Floating action button positioning: bottom-center with 24px margin

**Inventory List Cards:**
- Full-width cards with 16px padding, 12px rounded corners
- Left: Item name (Telugu) - text-lg font-semibold
- Right: Stock indicator (optional) - text-sm
- Border-left accent (4px) in primary color for active items
- Tap to select for quantity entry

**Quantity Input Interface:**
- Large number display (text-4xl) centered
- Voice input button + manual numeric keypad fallback
- Unit indicator "కేజీలు" prominently displayed
- Quick add buttons: +0.5, +1, +5, +10 kg (48px height, bold text)

**Bill Display:**
- Header: Bill number, date/time (text-sm, secondary text)
- Itemized list: Item name (left), Quantity + Price (right)
- Divider line between items
- Total section: Elevated card (bg-primary-50 in light, bg-primary-900/20 in dark)
- Total amount: text-3xl font-bold in primary color
- Action buttons: Share, Print, Save - full-width, stacked, 56px height

**Bottom Navigation (if needed):**
- 3 tabs: Inventory, New Bill, History
- Icon + Telugu label
- 64px height for easy thumb access
- Active state: bg-primary with white text/icon

### E. Interaction Patterns

**Voice Feedback:**
- Haptic feedback on voice start/stop (Web Vibration API)
- Visual pulse on recording button
- Toast notifications for confirmations
- Error states with retry button (56px height, full-width)

**Touch Targets:**
- Minimum 48px height for all interactive elements
- Primary CTAs: 56px height, full-width
- Voice button: 96px diameter
- List items: 72px minimum height

**Loading States:**
- Skeleton screens for bill history loading
- Spinner overlay with 50% opacity backdrop for bill generation
- Progressive disclosure for long lists (load more pattern)

### F. Telugu Language Integration

**Text Rendering:**
- Ensure proper Telugu Unicode rendering with Noto Sans Telugu
- Right-to-left number handling for Telugu numerals if needed
- Adequate line-height (1.6) for Telugu script readability

**Voice UI Labels (in Telugu):**
- "వస్తువును చెప్పండి" (Say the item)
- "ఎంత కేజీలు?" (How many kg?)
- "బిల్లు రూపొందించు" (Generate Bill)
- All UI in Telugu with English/numeric fallbacks

## Critical Mobile Optimizations

- Thumb-zone optimization: Primary actions in bottom 40% of screen
- Large tap targets: Minimum 48x48px, preferred 56px height
- Single-column layouts for clarity
- Pull-to-refresh for bill history
- Offline-first data persistence
- PWA installation prompt for home screen access

## Images

No hero images needed. This is a pure utility application where screen real estate must be dedicated to functional elements. Use icon-based visual communication:
- Microphone icon for voice input (from Material Icons)
- Success checkmarks for confirmations
- Document icon for bills
- Package/box icons for inventory items

Focus all visual design on clarity, efficiency, and accessibility for shopkeepers working in varied lighting conditions.