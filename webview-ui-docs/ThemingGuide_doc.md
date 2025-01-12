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

## Extending Theme Types

### Adding a New Theme Type

1. **Update Type Definitions**
   In `src/shared/WebviewMessage.ts`:
   ```typescript
   export interface WebviewMessage {
     // ... other properties
     themeType?: 'modern' | 'classic' | 'your-new-theme'
   }
   ```

2. **Update ExtensionState**
   In `src/shared/ExtensionMessage.ts`:
   ```typescript
   export interface ExtensionState {
     // ... other properties
     themeType?: 'modern' | 'classic' | 'your-new-theme'
   }
   ```

3. **Update Theme Utilities**
   In `webview-ui/src/utils/theme.ts`:
   ```typescript
   type ThemeType = 'modern' | 'classic' | 'your-new-theme'
   ```

4. **Create Theme Structure**
   ```
   webview-ui/src/components/styles/themes/your-new-theme/
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

### Adding Custom Colors

1. **Define Custom CSS Variables**
   Create a theme-specific variables file:
   ```typescript
   // themes/your-new-theme/variables.ts
   export const darkVariables = css`
     :root {
       --theme-primary-color: #007acc;
       --theme-secondary-color: #6c757d;
       --theme-success-color: #28a745;
       --theme-warning-color: #ffc107;
       --theme-error-color: #dc3545;
       
       --theme-background-primary: #1e1e1e;
       --theme-background-secondary: #252526;
       --theme-background-tertiary: #333333;
       
       --theme-text-primary: #ffffff;
       --theme-text-secondary: #cccccc;
       --theme-text-muted: #888888;
       
       --theme-border-color: #474747;
       --theme-divider-color: #404040;
       
       --theme-hover-background: rgba(255, 255, 255, 0.1);
       --theme-active-background: rgba(255, 255, 255, 0.2);
     }
   `

   export const lightVariables = css`
     :root {
       --theme-primary-color: #0066b8;
       --theme-secondary-color: #6c757d;
       --theme-success-color: #28a745;
       --theme-warning-color: #ffc107;
       --theme-error-color: #dc3545;
       
       --theme-background-primary: #ffffff;
       --theme-background-secondary: #f5f5f5;
       --theme-background-tertiary: #e8e8e8;
       
       --theme-text-primary: #000000;
       --theme-text-secondary: #333333;
       --theme-text-muted: #666666;
       
       --theme-border-color: #d4d4d4;
       --theme-divider-color: #e0e0e0;
       
       --theme-hover-background: rgba(0, 0, 0, 0.1);
       --theme-active-background: rgba(0, 0, 0, 0.2);
     }
   `
   ```

2. **Use Custom Variables in Components**
   ```typescript
   // themes/your-new-theme/dark/chat/ChatView.styles.tsx
   import { css } from 'styled-components'
   import { darkVariables } from '../../variables'

   export const styles = css`
     ${darkVariables}

     .chat-container {
       background: var(--theme-background-primary);
       color: var(--theme-text-primary);
     }

     .message {
       border: 1px solid var(--theme-border-color);
       background: var(--theme-background-secondary);
     }

     .message:hover {
       background: var(--theme-hover-background);
     }

     .message-timestamp {
       color: var(--theme-text-muted);
     }

     .action-button {
       background: var(--theme-primary-color);
       color: var(--theme-text-primary);
       
       &:hover {
         background: var(--theme-hover-background);
       }
       
       &:active {
         background: var(--theme-active-background);
       }
     }
   `
   ```

### Theme Variants

You can create variants within a theme type:

1. **Define Variant Types**
   ```typescript
   type ThemeVariant = 'default' | 'high-contrast' | 'compact'
   ```

2. **Create Variant-Specific Styles**
   ```typescript
   export const styles = css`
     ${darkVariables}
     
     /* Default variant */
     .theme-default {
       --spacing-unit: 16px;
       --border-radius: 4px;
     }
     
     /* High contrast variant */
     .theme-high-contrast {
       --theme-text-primary: #ffffff;
       --theme-background-primary: #000000;
       --border-radius: 0;
     }
     
     /* Compact variant */
     .theme-compact {
       --spacing-unit: 8px;
       --font-size-base: 12px;
     }
   `
   ```

### Theme Transitions

Add smooth transitions between themes:

```typescript
export const styles = css`
  * {
    transition: background-color 0.3s ease,
                color 0.3s ease,
                border-color 0.3s ease;
  }
  
  /* Disable transitions for performance-sensitive elements */
  .no-transitions {
    transition: none !important;
  }
`
```

### Theme Debugging

Add debug utilities to your theme:

```typescript
export const debugStyles = css`
  /* Add this class to any element to see its boundaries */
  .debug-layout {
    outline: 1px solid var(--theme-error-color);
  }
  
  /* Visualize the spacing */
  .debug-spacing > * {
    outline: 1px dashed var(--theme-warning-color);
  }
`
```

## Theme Migration

When updating or replacing themes:

1. **Create a Theme Migration Plan**
   - Document all theme-specific variables and styles
   - Map old theme values to new theme values
   - Identify breaking changes

2. **Implement Fallbacks**
   ```typescript
   .component {
     /* Fallback for older themes */
     background: var(--legacy-background, var(--theme-background-primary));
     color: var(--legacy-text-color, var(--theme-text-primary));
   }
   ```

3. **Version Your Themes**
   ```typescript
   export const themeVersion = '2.0.0'
   export const isLegacyTheme = (version: string) => version.startsWith('1.')
   ```

## Theme Performance Tips

1. **Minimize CSS Variables**
   - Group related colors
   - Use CSS calculations for variations
   ```css
   :root {
     --theme-primary: #007acc;
     --theme-primary-light: color-mix(in srgb, var(--theme-primary) 80%, white);
     --theme-primary-dark: color-mix(in srgb, var(--theme-primary) 80%, black);
   }
   ```

2. **Use CSS Containment**
   ```css
   .theme-container {
     contain: style layout;
   }
   ```

3. **Lazy Load Theme Variants**
   ```typescript
   const loadThemeVariant = async (variant: string) => {
     const styles = await import(`./variants/${variant}.styles`)
     return styles.default
   }
   ``` 