# Inspection Readiness Agent - Design Guide

## Overview
This design guide documents the UI/UX specifications for the Inspection Readiness Overview dashboard. Use this as a reference for building or maintaining the interface.

---

## Color Palette

### Primary Colors
- **Brand Red**: `#D72027` (Logo, critical alerts)
- **Orange/Amber**: `#C77F3E` (Progress indicators, warnings)
- **Light Orange Fill**: `#FFF4E6` (Chart backgrounds)

### Status Colors
- **Critical**: `#DC2626` (Red dot)
- **At-Risk**: `#F59E0B` (Orange/Amber dot)
- **Needs Review**: `#FB923C` (Light orange dot)
- **Ready**: `#10B981` (Green dot)

### Neutral Colors
- **Background**: `#F9FAFB` (Page background)
- **Card Background**: `#FFFFFF`
- **Text Primary**: `#111827`
- **Text Secondary**: `#6B7280`
- **Border**: `#E5E7EB`

---

## Typography

### Font Family
- Primary: System font stack (Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)

### Font Sizes & Weights
- **Page Title**: 30px, Bold (font-weight: 700)
- **Subtitle**: 14px, Regular (font-weight: 400), Gray
- **Section Heading**: 16px, Semibold (font-weight: 600)
- **Metric Numbers**: 36px, Bold (font-weight: 700)
- **Metric Labels**: 12px, Regular (font-weight: 400), Gray
- **Body Text**: 14px, Regular (font-weight: 400)
- **Small Text**: 12px, Regular (font-weight: 400)

---

## Layout Structure

### Grid System
- **Container Max Width**: 1440px
- **Sidebar Width**: 240px (fixed)
- **Main Content**: Flex-grow with padding
- **Gutter/Spacing**: 24px between major sections

### Spacing Scale
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

---

## Components

### 1. Header Bar
**Height**: 64px  
**Background**: White with bottom border (#E5E7EB)

**Left Side**:
- Logo: Red square (32x32px) with "IRA" in white
- Brand name: "Inspection Readiness Agent" (16px, semibold)

**Right Side**:
- Search bar with icon (placeholder: "Search trials, systems, owners...")
- Notification bell icon with red badge
- User profile section:
  - Avatar icon (red background)
  - "Quality Admin" label
  - "Org-wide visibility" subtitle

---

### 2. Left Sidebar
**Width**: 240px  
**Background**: White with right border (#E5E7EB)

**User Section** (top):
- "QUALITY ADMIN" label (12px, uppercase, gray)
- "Org-wide visibility" subtitle (11px, light gray)

**Navigation Menu**:
- **Active Item** (Home): White text on dark gray background, rounded corners
- **Inactive Items**: Dark gray text, hover state with light gray background
- **Badge Indicators**: Percentage badges (e.g., "100%") on right side in light gray

**Menu Items**:
1. Home (active)
2. Trial Readiness
3. Systems
4. Gap Storyboards
5. Simulation (100%)
6. Request Translation (100%)
7. Responsive Drafting (100%)

**Spacing**: 8px between items, 16px padding on each side

---

### 3. Breadcrumb Navigation
**Position**: Top of main content area  
**Style**: 
- Text: 13px, gray (#6B7280)
- Separator: ">" symbol
- Active page: Default text color

**Example**: Home > Inspection Readiness Overview

---

### 4. Page Header
**Components**:
- **Title**: "Inspection Readiness Overview" (30px, bold, dark gray)
- **Subtitle**: Descriptive text (14px, gray) explaining the page purpose
- **Snapshot Date**: Right-aligned, with calendar icon, "Snapshot — Apr 24, 2026"

---

### 5. Metrics Cards Section

#### Overall Readiness Coverage Card
**Layout**: Left side of metrics row

**Circular Progress Chart**:
- **Size**: ~180px diameter
- **Stroke Width**: 20px
- **Color**: Orange (#C77F3E)
- **Background Track**: Light gray (#E5E7EB)
- **Center Content**:
  - Large percentage: "82%" (42px, bold)
  - Small label: "COVERAGE" (10px, uppercase, gray)

**Supporting Info**:
- Primary stat: "184 of 225 required artifacts available" (14px)
- Trend indicator: "+4 pts vs 30 days ago" (12px, gray) with small upward arrow

**Line Chart**:
- **Height**: 60px
- **Line Color**: Orange (#C77F3E)
- **Fill**: Light orange gradient (#FFF4E6 to transparent)
- **X-axis**: Mar 25 to Apr 24
- Simple, minimal styling

---

#### Headline KPIs
**Layout**: 2x2 grid on right side

**Each KPI Card**:
- **Background**: White
- **Border**: 1px solid #E5E7EB
- **Border Radius**: 8px
- **Padding**: 20px
- **Structure**:
  - Label (12px, gray, uppercase or sentence case)
  - Large number (32px, bold, dark)
  - Supporting text (12px, gray) - varies by metric

**Four KPIs**:
1. **Total Systems**: 8 (large), "46 in scope" (small, gray)
2. **Systems at Risk**: 2 (large), ">5% lag" + "Critical + At Risk" (small, gray)
3. **Open Gaps**: 9 (large), "<2.2 new across all systems" (small, gray)
4. **Critical Gaps**: 3 (large), "stable, immediate action" (small, gray)

---

### 6. Trials by Readiness Status Section

**Section Header**:
- Title: "Trials by Readiness Status" (18px, semibold)
- Action Link: "Open Trial Readiness >" (14px, red, right-aligned)

**Description**:
- Gray text explaining the metric methodology
- Font: 13px, #6B7280

**Status Cards** (horizontal row):
Each card contains:
- **Colored Dot Indicator**: 8px circle, positioned top-left or with label
- **Label**: 11px, uppercase or title case, gray
- **Count**: 24-28px, bold, dark
- **Percentage/Detail**: 11px, gray

**Five Status Cards**:
1. **Total trials**: 12, "18 things" (no dot)
2. **Critical**: 0, "0.0%" (red dot)
3. **At-Risk**: 1, "94~76%" (orange dot)
4. **Needs Review**: 11, "70~46%" (light orange dot)
5. **Ready**: 0, "0.0%" (green dot)

**Card Styling**:
- Background: White
- Border: 1px solid #E5E7EB
- Border radius: 6px
- Padding: 16px
- Equal width distribution

---

### 7. Trials Needing Review Section

**Section Header**:
- Title: "Trials Needing Review" (18px, semibold)
- Action Link: "All trials >" (14px, red, right-aligned)

**Description**:
- Gray explanatory text
- Font: 13px, #6B7280

**Content Area**:
- White background card
- List or table of trials requiring review
- (Specific content not visible in screenshot)

---

### 8. Footer
**Position**: Bottom of page  
**Background**: Light gray or white  
**Content**:
- Left: Company name "El Lilly & Company"
- Right: Version "v3.0.0 - Quality Admin"
- Font: 12px, gray
- Padding: 16px

---

## Interaction Patterns

### Hover States
- **Navigation Items**: Background changes to light gray (#F3F4F6)
- **Links**: Underline appears
- **Cards**: Subtle shadow lift effect (optional)

### Active States
- **Navigation**: Dark background with white text
- **Links**: Darker color shade

### Loading States
- Skeleton screens for metrics
- Spinner for data refresh

---

## Icons
- **Logo**: Custom "IRA" lockup
- **Search**: Magnifying glass icon
- **Notifications**: Bell icon with badge
- **Calendar**: For snapshot date
- **User Avatar**: Circle with initials or icon
- **Arrows**: For trends (up/down indicators)
- **Dots**: Status indicators (filled circles)
- **Chevrons**: For navigation (>)

---

## Responsive Behavior

### Desktop (1440px+)
- Full layout as described
- Sidebar visible
- Metrics in 2-column layout

### Tablet (768px - 1439px)
- Sidebar collapsible or overlayed
- Metrics stack into single column
- Reduce padding/spacing

### Mobile (<768px)
- Hamburger menu for sidebar
- Vertical card stacking
- Simplified charts
- Full-width components

---

## Accessibility

### WCAG Compliance
- **Color Contrast**: Minimum 4.5:1 for text
- **Focus States**: Visible keyboard focus indicators
- **ARIA Labels**: For icons and interactive elements
- **Semantic HTML**: Proper heading hierarchy (h1, h2, h3)

### Screen Reader Support
- Descriptive alt text for icons
- ARIA live regions for dynamic updates
- Logical tab order

---

## Data Visualization Guidelines

### Charts
- **Circular Progress**: Use for percentage-based coverage metrics
- **Line Charts**: Show trends over time with minimal gridlines
- **Color Coding**: Consistent use of status colors across all visualizations

### Metric Display
- Large, bold numbers for primary values
- Smaller, gray text for context and supporting details
- Use separators (commas) for thousands
- Percentage signs where applicable

---

## Component Spacing

### Section Spacing
- Between major sections: 32px
- Between subsections: 24px
- Between cards: 16px

### Internal Card Spacing
- Card padding: 20-24px
- Element spacing within cards: 12-16px
- Tight spacing for related items: 4-8px

---

## Animation/Transitions

### Recommended Transitions
- **Duration**: 200-300ms
- **Easing**: ease-in-out
- **Properties**: opacity, transform, background-color

### Use Cases
- Navigation hover states
- Card hover effects
- Chart data updates
- Modal/overlay appearances

---

## Technical Notes

### Framework Suggestions
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** or **Chart.js** for data visualization
- **Lucide React** for icons

### Performance Considerations
- Lazy load chart components
- Optimize images and icons (SVG preferred)
- Use React.memo for static components
- Implement virtual scrolling for long lists

---

## Copy/Content Guidelines

### Tone
- Professional and authoritative
- Clear and concise
- Data-focused with actionable insights

### Number Formatting
- Use decimals for percentages (e.g., "0.0%")
- Include thousand separators (e.g., "225")
- Show trends with +/- indicators

### Labels
- Sentence case for most labels
- UPPERCASE for specific emphasis (e.g., "COVERAGE")
- Consistent terminology across the application

---

## Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-brand-red: #D72027;
  --color-orange: #C77F3E;
  --color-orange-light: #FFF4E6;
  --color-critical: #DC2626;
  --color-at-risk: #F59E0B;
  --color-needs-review: #FB923C;
  --color-ready: #10B981;
  
  /* Neutrals */
  --color-background: #F9FAFB;
  --color-card: #FFFFFF;
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-border: #E5E7EB;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  /* Typography */
  --font-size-xs: 11px;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
  --font-size-2xl: 24px;
  --font-size-3xl: 30px;
  --font-size-4xl: 36px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

---

## Implementation Checklist

- [ ] Set up color palette and design tokens
- [ ] Implement header component with logo, search, notifications
- [ ] Build sidebar navigation with active states
- [ ] Create breadcrumb component
- [ ] Develop page header with title and snapshot date
- [ ] Build circular progress chart component
- [ ] Create KPI card component (reusable)
- [ ] Implement line chart for trend visualization
- [ ] Build status cards with dot indicators
- [ ] Create section headers with action links
- [ ] Implement footer component
- [ ] Add responsive breakpoints
- [ ] Test accessibility compliance
- [ ] Add hover and focus states
- [ ] Implement loading states

---

**Last Updated**: April 29, 2026  
**Version**: 1.0  
**Maintained By**: Development Team
