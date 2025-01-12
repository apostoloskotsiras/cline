# Cline Theming Guide

## Overview

Cline supports a flexible theming system that allows for multiple theme types (e.g., modern, classic) and modes (light/dark). This guide explains how to create and customize themes.

## Theme Structure

Themes are organized in the following directory structure:
```
webview-ui/src/components/styles/themes/
├── modern/                  # Modern theme type
│   ├── dark/               # Dark mode
│   │   ├── chat/          # Chat component styles
│   │   │   └── ChatView.styles.tsx
│   │   └── settings/      # Settings component styles
│   │       └── SettingsView.styles.tsx
│   └── light/             # Light mode
│       ├── chat/
│       │   └── ChatView.styles.tsx
│       └── settings/
│           └── SettingsView.styles.tsx
└── classic/               # Classic theme type
    ├── dark/
    │   ├── chat/
    │   │   └── ChatView.styles.tsx
    │   └── settings/
    │       └── SettingsView.styles.tsx
    └── light/
        ├── chat/
        │   └── ChatView.styles.tsx
        └── settings/
            └── SettingsView.styles.tsx
```

## Adding a New Theme Type

1. Create a new directory under `webview-ui/src/components/styles/themes/` with your theme name (e.g., `minimal/`)
2. Create the required mode directories (`dark/` and `light/`)
3. Create component directories and style files matching the existing structure
4. Update `webview-ui/src/utils/theme.ts`:
   - Add imports for the new theme styles
   - Add the new theme type to the `ThemeType` type
   - Add the new theme components to the `ThemeComponents` interface
   - Add the new theme styles to the `themeComponents` object

Example:
```typescript
// Add new imports
import * as MinimalDarkSettingsView from '../components/styles/themes/minimal/dark/settings/SettingsView.styles'
import * as MinimalLightSettingsView from '../components/styles/themes/minimal/light/settings/SettingsView.styles'

// Update ThemeType
type ThemeType = 'modern' | 'classic' | 'minimal'

// Update ThemeComponents interface
interface ThemeComponents {
    // ... existing themes ...
    minimal: {
        dark: {
            'settings/SettingsView': typeof MinimalDarkSettingsView;
            // ... other components
        };
        light: {
            'settings/SettingsView': typeof MinimalLightSettingsView;
            // ... other components
        };
    };
}
```

## Creating Style Files

Each style file should export a `styles` string containing the CSS for that component. Use CSS-in-JS with styled-components:

```typescript
import { css } from 'styled-components'

export const styles = css`
  .settings-wrapper {
    background: var(--vscode-editor-background);
    color: var(--vscode-editor-foreground);
  }

  .settings-header {
    border-bottom: 1px solid var(--vscode-panel-border);
  }

  // ... more styles
`
```

## Using VSCode Theme Variables

For consistency with VSCode's theming, use VSCode CSS variables:

- `--vscode-editor-background`: Main background color
- `--vscode-editor-foreground`: Main text color
- `--vscode-button-background`: Button background color
- `--vscode-button-foreground`: Button text color
- `--vscode-button-hover-background`: Button hover state
- `--vscode-input-background`: Input field background
- `--vscode-input-foreground`: Input text color
- `--vscode-panel-border`: Border colors
- `--vscode-dropdown-background`: Dropdown background
- `--vscode-dropdown-foreground`: Dropdown text color

## Best Practices

1. **Consistency**: Keep style structure consistent across themes
2. **VSCode Integration**: Use VSCode theme variables when possible
3. **Fallbacks**: Provide fallback values for critical styles
4. **Documentation**: Document any custom variables or complex styles
5. **Component Isolation**: Keep styles scoped to their components
6. **Responsive Design**: Ensure styles work across different window sizes
7. **Accessibility**: Maintain sufficient contrast ratios
8. **Performance**: Minimize use of complex selectors and animations

## Testing Themes

1. Switch between themes using the theme selector in Settings
2. Test in both light and dark modes
3. Verify all components render correctly
4. Check responsive behavior
5. Validate accessibility
6. Test theme switching performance

## Common Issues

1. **Missing Styles**: Ensure all required components have style files
2. **Import Errors**: Check path correctness in theme.ts
3. **Type Errors**: Verify ThemeComponents interface matches implementation
4. **Style Conflicts**: Use specific selectors to avoid conflicts
5. **Performance**: Monitor style switching performance

## Example: Adding a New Component

1. Create style files in each theme:
```typescript
// modern/dark/newComponent/NewComponent.styles.tsx
export const styles = css`
  .new-component {
    background: var(--vscode-editor-background);
    padding: 16px;
  }
`
```

2. Update theme.ts:
```typescript
type ThemeComponentKey = 'settings/SettingsView' | 'chat/ChatView' | 'newComponent/NewComponent'
```

3. Add to ThemeComponents interface and themeComponents object

## Resources

- [VSCode Theme Color Reference](https://code.visualstudio.com/api/references/theme-color)
- [Styled Components Documentation](https://styled-components.com/docs)
- [VSCode Webview UI Toolkit](https://github.com/microsoft/vscode-webview-ui-toolkit) 