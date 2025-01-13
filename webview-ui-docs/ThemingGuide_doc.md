# Cline Theming Guide

## Overview
Cline uses a flexible theming system that supports multiple theme types (modern, classic) and modes (light, dark). The system is designed to be maintainable and extensible, with centralized color management and component-specific styles.

## Directory Structure
```
webview-ui/src/components/styles/themes/
├── modern/
│   ├── components/
│   │   ├── chat/
│   │   ├── settings/
│   │   ├── welcome/
│   │   ├── navigation/
│   │   ├── mcp/
│   │   ├── history/
│   │   └── common/
│   ├── theme.ts        # Theme colors and variables
│   └── index.ts        # Theme exports and component styles
```

## Theme Colors
Theme colors are defined in `modern/theme.ts` and provide a consistent color palette for both light and dark modes:

```typescript
export interface ThemeColors {
    background: string
    foreground: string
    border: string
    primary: string
    secondary: string
    success: string
    error: string
    warning: string
    info: string
    textPrimary: string
    textSecondary: string
    textDisabled: string
    divider: string
    hover: string
    active: string
    selected: string
    disabled: string
}

// Access theme colors using getThemeColors(mode)
const colors = getThemeColors('dark')
```

## Adding New Components

1. Create a new style file in the appropriate component directory:
```typescript
// modern/components/your-section/YourComponent.styles.tsx
import styled from 'styled-components'
import { ThemeMode } from '../../../../../../utils/theme'
import { getThemeColors } from '../../../theme'

interface StyledProps {
    mode: ThemeMode
}

export const Container = styled.div<StyledProps>`
    // IMPORTANT: Always use mode prop to get theme colors
    background: ${({ mode }) => getThemeColors(mode).background};
    color: ${({ mode }) => getThemeColors(mode).textPrimary};
    border: 1px solid ${({ mode }) => getThemeColors(mode).border};

    // For colors with opacity, append hex values:
    // FA = 98% opacity
    // CC = 80% opacity
    // 80 = 50% opacity
    background: ${({ mode }) => `${getThemeColors(mode).background}FA`};
`
```

2. Add your component key to `ThemeComponentKey` in `utils/theme.ts`:
```typescript
export type ThemeComponentKey = 
    | 'existing/components'
    | 'your-section/YourComponent'
```

3. Import and export your styles in `modern/index.ts`:
```typescript
import * as YourComponent from './components/your-section/YourComponent.styles'

const themeStyles = {
    'your-section/YourComponent': YourComponent,
    // ... other components
}
```

## Using Themed Components

1. Import the required hooks and styles:
```typescript
import { useExtensionState } from '../../context/ExtensionStateContext'
import { useThemeStyles } from '../../utils/theme'
```

2. Get the theme styles and mode in your component:
```typescript
const YourComponent = () => {
    const { themeMode, themeType } = useExtensionState()
    const { Container, OtherStyledComponent } = useThemeStyles(
        'your-section/YourComponent',
        themeMode || 'dark',
        themeType || 'modern'
    )
    
    return (
        // IMPORTANT: Always pass mode prop to styled components
        <Container mode={themeMode || 'dark'}>
            <OtherStyledComponent mode={themeMode || 'dark'}>
                Your content
            </OtherStyledComponent>
        </Container>
    )
}
```

## Color Usage Examples

1. **Basic Color Usage**
```typescript
// Basic color
color: ${({ mode }) => getThemeColors(mode).textPrimary};

// With opacity (98%)
background: ${({ mode }) => `${getThemeColors(mode).background}FA`};

// With opacity (80%)
border: ${({ mode }) => `${getThemeColors(mode).border}CC`};

// With opacity (50%)
color: ${({ mode }) => `${getThemeColors(mode).textSecondary}80`};
```

2. **Conditional Colors**
```typescript
// Based on props
background: ${(props) => props.disabled 
    ? `${getThemeColors(props.mode).background}80`
    : getThemeColors(props.mode).background};

// Hover states
&:hover {
    background: ${({ mode }) => `${getThemeColors(mode).hover}FA`};
    border-color: ${({ mode }) => getThemeColors(mode).active};
}
```

## Best Practices

1. **Theme Mode Handling**
   - Always provide a fallback for theme mode: `mode={themeMode || 'dark'}`
   - Pass the mode prop to every styled component that uses `getThemeColors`
   - Use the same mode value consistently across child components

2. **Color Usage**
   - Always use theme colors from `getThemeColors` instead of hardcoding values
   - Use semantic color names (e.g., `textPrimary` instead of specific colors)
   - Use hex opacity values (FA, CC, 80) for consistent transparency effects
   - Test colors in both light and dark modes

3. **Component Organization**
   - Keep related components in their respective section directories
   - Use consistent naming for style components
   - Export styled components with proper TypeScript interfaces

4. **VSCode Theme Integration**
   - Use VSCode theme variables when needed (e.g., `var(--vscode-editor-background)`)
   - Test components in both light and dark modes
   - Ensure sufficient contrast ratios for accessibility

## Troubleshooting

1. **Colors Not Updating**
   - Verify the `mode` prop is passed to all styled components
   - Check that `getThemeColors` is being called with the mode prop
   - Ensure the component is wrapped with proper theme context

2. **Type Errors**
   - Add proper interfaces for styled component props including `mode: ThemeMode`
   - Import `ThemeMode` from the correct path
   - Ensure all styled components have the mode prop defined

3. **Theme Not Applying**
   - Check that `useThemeStyles` is called with correct parameters
   - Verify the component key is properly registered
   - Ensure all styled components receive the mode prop

## Resources
- [Styled Components Documentation](https://styled-components.com/docs)
- [VSCode Theme Color Reference](https://code.visualstudio.com/api/references/theme-color)
- [Web Accessibility Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) 