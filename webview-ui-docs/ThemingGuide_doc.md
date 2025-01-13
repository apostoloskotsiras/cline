# Cline Theming Guide

## Overview
Cline uses a flexible theming system that supports multiple theme types (modern/classic) and modes (light/dark). The system is built using styled-components and TypeScript for type safety.

## Theme Structure

```
webview-ui/src/components/styles/themes/
├── modern/
│   ├── dark/
│   │   └── index.ts        # Main barrel file for modern dark theme
│   └── light/
│       └── index.ts        # Main barrel file for modern light theme
└── classic/
    ├── dark/
    │   └── index.ts        # Main barrel file for classic dark theme
    └── light/
        └── index.ts        # Main barrel file for classic light theme
```

## Adding Styles to a Component

1. **Create a Style File**
Create a `.styles.tsx` file next to your component:

```typescript
// MyComponent.styles.tsx
import styled from 'styled-components'

export const Wrapper = styled.div`
  background: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
  padding: 16px;
`

export const Title = styled.h1`
  font-size: 20px;
  margin-bottom: 8px;
`

export const styles = `
  .my-component {
    /* For global styles if needed */
  }
`
```

2. **Use Styles in Component**
```typescript
// MyComponent.tsx
import { useExtensionState } from '../../context/ExtensionStateContext'
import { useThemeStyles } from '../../utils/theme'

const MyComponent = () => {
  const { themeMode, themeType } = useExtensionState()
  const S = useThemeStyles('section/MyComponent', themeMode, themeType)

  return (
    <S.Wrapper>
      <style>{S?.styles}</style>
      <S.Title>My Component</S.Title>
    </S.Wrapper>
  )
}
```

3. **Register Component in Theme**
Add your component to the theme's index.ts:

```typescript
// themes/modern/dark/index.ts
import * as MyComponent from './section/MyComponent.styles'

const themeStyles = {
  'section/MyComponent': MyComponent,
  // ... other components
}

export default themeStyles
```

## Adding a New Theme

1. **Create Theme Directory**
Create a new directory under `themes/` with your theme name:
```
themes/
└── mytheme/
    ├── dark/
    │   └── index.ts
    └── light/
        └── index.ts
```

2. **Update Theme Types**
Add your theme to `utils/theme.ts`:
```typescript
export type ThemeType = 'modern' | 'classic' | 'mytheme'
```

3. **Import Theme Files**
Update the theme imports in `utils/theme.ts`:
```typescript
import * as MyThemeDark from '../components/styles/themes/mytheme/dark'
import * as MyThemeLight from '../components/styles/themes/mytheme/light'

export const useThemeStyles = (component: ThemeComponentKey, mode: ThemeMode, type: ThemeType) => {
  const themeStyles = {
    modern: { /*...*/ },
    classic: { /*...*/ },
    mytheme: {
      dark: MyThemeDark.default,
      light: MyThemeLight.default
    }
  }
  return themeStyles[type][mode][component]
}
```

## Using VSCode Theme Variables

For consistent theming with VSCode:

```typescript
// Common VSCode theme variables
const commonStyles = `
  --background: var(--vscode-editor-background);
  --foreground: var(--vscode-editor-foreground);
  --button-bg: var(--vscode-button-background);
  --button-fg: var(--vscode-button-foreground);
  --link: var(--vscode-textLink-foreground);
`

// Use in styled components
export const Button = styled.button`
  background: var(--button-bg);
  color: var(--button-fg);
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`
```

## Best Practices

1. **Component Organization**
   - Keep style files next to their components
   - Use descriptive names for styled components
   - Group related styles together

2. **Theme Consistency**
   - Use VSCode theme variables when possible
   - Maintain consistent spacing and colors
   - Test themes in both light and dark modes

3. **Type Safety**
   - Add new components to `ThemeComponentKey` type
   - Use proper TypeScript types for styled components
   - Validate theme imports and exports

## Troubleshooting

Common issues and solutions:

1. **Styles Not Updating**
   - Verify component is registered in theme index
   - Check theme path in useThemeStyles
   - Ensure style component names match usage

2. **Type Errors**
   - Add component to ThemeComponentKey
   - Check import/export paths
   - Verify theme type definitions

3. **VSCode Integration**
   - Use correct VSCode theme variables
   - Test with different VSCode themes
   - Check variable availability in context

## Resources

- [VSCode Theme Color Reference](https://code.visualstudio.com/api/references/theme-color)
- [styled-components Documentation](https://styled-components.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) 