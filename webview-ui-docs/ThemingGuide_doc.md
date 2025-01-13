# Cline Theming Guide

## Overview
Cline uses a theme system that supports multiple theme types (Modern/Classic) and color modes (Light/Dark). The system is built to be extensible and maintainable.

## Directory Structure
```
webview-ui/src/components/styles/
├── themes/
│   ├── modern/
│   │   ├── dark/
│   │   │   ├── settings/
│   │   │   │   ├── SettingsView.styles.tsx
│   │   │   │   └── ...
│   │   │   ├── chat/
│   │   │   │   ├── ChatView.styles.tsx
│   │   │   │   └── ...
│   │   │   └── index.ts
│   │   └── light/
│   │       └── ... (same structure as dark)
│   └── classic/
│       ├── dark/
│       │   └── ... (same structure as modern)
│       └── light/
│           └── ... (same structure as modern)
```

## Adding New Components

### 1. Create Style File
Create a new `.styles.tsx` file in the appropriate component directory:

```tsx
// Example: webview-ui/src/components/styles/themes/modern/dark/myfeature/MyComponent.styles.tsx
import styled from 'styled-components'

export const Container = styled.div`
    background: var(--vscode-editor-background);
    color: var(--vscode-editor-foreground);
`

export const Header = styled.header`
    border-bottom: 1px solid var(--vscode-panel-border);
`

// Export styles object that will be used by the theme system
export default {
    styles: `
        .my-component {
            /* Your styles here */
        }
    `
}
```

### 2. Update Theme Types
Add your component to the `ThemeComponentKey` type in `webview-ui/src/utils/theme.ts`:

```typescript
export type ThemeComponentKey = 
    | 'myfeature/MyComponent'  // Add your component here
    | 'settings/SettingsView'
    | ...
```

### 3. Create Component
Use the theme styles in your component:

```tsx
import { useExtensionState } from "../../context/ExtensionStateContext"

const MyComponent = () => {
    const { themeMode, themeType, getThemeStyles } = useExtensionState()
    const S = getThemeStyles('myfeature/MyComponent')

    return (
        <div className="my-component">
            <style>{S?.styles}</style>
            {/* Your component content */}
        </div>
    )
}
```

## Adding New Theme Variants

### 1. Create Theme Directory
To add a new theme variant (e.g., "Retro"):
1. Create directory: `webview-ui/src/components/styles/themes/retro/`
2. Add `dark/` and `light/` subdirectories
3. Copy component structure from existing theme

### 2. Update Theme Types
Modify `ThemeType` in `webview-ui/src/utils/theme.ts`:

```typescript
export type ThemeType = 'modern' | 'classic' | 'retro'  // Add your theme
```

### 3. Import Theme in Context
Update `ExtensionStateContext.tsx` to include your theme:

```typescript
import * as RetroDarkTheme from '../components/styles/themes/retro/dark'
import * as RetroLightTheme from '../components/styles/themes/retro/light'

// Add to themeStyles object
const themeStyles = {
    modern: { ... },
    classic: { ... },
    retro: {
        dark: RetroDarkTheme.default,
        light: RetroLightTheme.default
    }
}
```

## Best Practices

### VSCode Theme Integration
- Use VSCode's built-in theme variables when possible:
  ```css
  background: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
  border: 1px solid var(--vscode-panel-border);
  ```
- Common variables:
  - `--vscode-editor-background`: Main background
  - `--vscode-editor-foreground`: Main text color
  - `--vscode-button-background`: Primary button background
  - `--vscode-button-foreground`: Primary button text
  - `--vscode-panel-border`: Border colors
  - `--vscode-input-background`: Input fields background
  - `--vscode-input-foreground`: Input text color

### Style Organization
1. Group related styles together
2. Use descriptive class/component names
3. Comment complex style rules
4. Keep styles modular and reusable

### Troubleshooting
Common issues and solutions:

1. **Styles not updating:**
   - Check if `getThemeStyles` is called with correct component key
   - Verify theme mode and type are set correctly
   - Ensure style element is present in component

2. **Type errors:**
   - Make sure component is added to `ThemeComponentKey`
   - Check theme imports in context
   - Verify style object structure matches expected format

3. **VSCode theme variables not working:**
   - Ensure VSCode theme is properly loaded
   - Check variable names in documentation
   - Use fallback values for custom properties

## Resources
- [VSCode Theme Color Reference](https://code.visualstudio.com/api/references/theme-color)
- [Styled Components Documentation](https://styled-components.com/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) 