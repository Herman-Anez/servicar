---
name: Modern Pulse
colors:
  surface: '#fff8f7'
  surface-dim: '#fecfcb'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ef'
  surface-container: '#ffe9e7'
  surface-container-high: '#ffe2df'
  surface-container-highest: '#ffdad7'
  on-surface: '#2d1413'
  on-surface-variant: '#603e39'
  inverse-surface: '#452927'
  inverse-on-surface: '#ffedeb'
  outline: '#956d67'
  outline-variant: '#ebbbb4'
  surface-tint: '#c00100'
  primary: '#bc0100'
  on-primary: '#ffffff'
  primary-container: '#eb0000'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a8'
  secondary: '#b72114'
  on-secondary: '#ffffff'
  secondary-container: '#ff5540'
  on-secondary-container: '#5c0100'
  tertiary: '#63595c'
  on-tertiary: '#ffffff'
  tertiary-container: '#7d7275'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#930100'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a8'
  on-secondary-fixed: '#410100'
  on-secondary-fixed-variant: '#930300'
  tertiary-fixed: '#eddfe2'
  tertiary-fixed-dim: '#d1c3c6'
  on-tertiary-fixed: '#211a1c'
  on-tertiary-fixed-variant: '#4e4447'
  background: '#fff8f7'
  on-background: '#2d1413'
  surface-variant: '#ffdad7'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: '2'
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
---

# Design System: Modern Pulse

## Brand & Style
The brand identity is characterized by energy, urgency, and modern precision. By combining a high-energy primary red with a bold, warm secondary accent and the "Inter" typeface, the brand achieves a "Corporate / Modern" aesthetic with "High-Contrast" accents. It is designed to evoke a sense of immediate action and reliability, making it suitable for performance-driven applications or high-impact digital products. The style is clean, utilizing deliberate white space and sharp typography to maintain professional balance despite the aggressive color palette.

## Colors
The color palette is anchored by a vibrant primary red (#fe0000) that serves as the main driver for brand recognition and critical calls to action. The secondary color is a vivid, warm vermillion (#db3c2a), which reinforces the high-energy theme while providing depth to interactive elements. A very pale pink tertiary tone (#FFF0F3) acts as a soft surface accent or highlight color. The neutral palette is derived from a deep, dark espresso brown (#3B201E), replacing standard grays to ensure the UI feels grounded, sophisticated, and high-contrast in light mode.

## Typography
The system uses "Inter" exclusively across all levels to achieve maximum legibility and a contemporary technical feel. Inter’s tall x-height and clean geometric properties ensure that headlines carry a strong presence, while body text remains highly readable at smaller scales. 

*   **Headlines:** Bold Inter (700) for large displays, scaling down to Semi-Bold for subheadings.
*   **Body:** Regular Inter (400) at 16px and 14px for optimal readability.
*   **Labels:** Medium Inter (500) with 0.5px letter spacing for functional UI elements.

## Layout & Spacing
The layout follows a strict 8pt grid system derived from a base spacing unit of 2. It utilizes a fluid grid model that adapts to screen width while maintaining consistent internal gutters of 16px and outer margins of 24px on mobile, scaling to larger margins on desktop. Content is organized in logical blocks with ample vertical rhythm to prevent the high-intensity color palette from feeling overwhelming.

## Elevation & Depth
Depth is communicated through tonal layering and subtle, ambient shadows. To complement the rounded edges and bold colors, surfaces are lifted using low-opacity diffused shadows that prevent the interface from appearing flat. Containers use the tertiary surface (#FFF0F3) or light neutral tones to separate themselves from the page surface, creating a clear hierarchical structure.

## Shapes
The UI adopts a "Rounded" shape language with a base roundedness of 0.5rem (8px). This softens the visual impact of the vibrant red palette and the utilitarian nature of the Inter typeface. Larger components like cards and modals utilize 16px or 24px corner radii to create a friendly, accessible feel while maintaining a modern professional standard.

## Components
- **Buttons:** Primary buttons use the bold #fe0000 with white text and 8px corners. Secondary buttons use the warm vermillion #db3c2a for active states.
- **Input Fields:** Utilize the deep neutral #3B201E for text and borders, which thickens and changes to the primary red on focus.
- **Cards:** Feature 16px corner radii with subtle ambient shadows and consistent 16px internal padding, often utilizing the tertiary #FFF0F3 for container backgrounds.
- **Chips & Labels:** Use the tertiary palette for background states, employing the secondary vermillion (#db3c2a) for high-priority status indicators.
- **Checkboxes/Radios:** Leverage the primary red for active states to ensure high visibility and user feedback.