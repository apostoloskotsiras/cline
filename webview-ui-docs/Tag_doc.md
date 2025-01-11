# Tag Component Documentation

## Overview

The Tag component is a versatile UI element used to display status, categories, or labels with different severity levels and styling options.

## Basic Usage

```typescript
import { Tag } from '../common/Tag';

// Basic usage
<Tag value="Primary" severity="primary" rounded />
```

## Props Interface

```typescript
interface TagProps {
	value: string // Text content of the tag
	severity?: "primary" | "success" | "info" | "warning" | "danger" | "secondary" | "contrast"
	rounded?: boolean // Whether to use rounded corners
	style?: React.CSSProperties // Additional inline styles
}
```

## Severity Levels

The component supports the following severity levels with corresponding styling:

| Severity  | Usage Case                       | Default Color |
| --------- | -------------------------------- | ------------- |
| primary   | Main actions, primary indicators | Purple        |
| success   | Successful operations, positive  | Green         |
| info      | Informational messages           | Blue          |
| warning   | Warnings, potential issues       | Yellow        |
| danger    | Errors, critical issues          | Red           |
| secondary | Secondary information            | Gray          |
| contrast  | High contrast, emphasis          | White         |

## Styling Customization

The Tag component uses styled-components for styling. You can customize the appearance by:

1. Modifying the base styles in `Tag.tsx`:

```typescript
const TagContainer = styled.span<{ severity: string; rounded: boolean }>`
	// Base styles here
`
```

2. Overriding styles via the `style` prop:

```typescript
<Tag
  value="Custom"
  severity="info"
  style={{
    fontSize: '0.8rem',
    padding: '2px 8px'
  }}
/>
```

## Implementation Examples

### Basic Tags

```typescript
<Tag value="Primary" severity="primary" />
<Tag value="Success" severity="success" />
<Tag value="Info" severity="info" />
<Tag value="Warning" severity="warning" />
<Tag value="Danger" severity="danger" />
<Tag value="Secondary" severity="secondary" />
<Tag value="Contrast" severity="contrast" />
```

### Rounded Tags

```typescript
<Tag value="Rounded Primary" severity="primary" rounded />
<Tag value="Rounded Success" severity="success" rounded />
```

### Custom Styled Tags

```typescript
<Tag
  value="Custom Style"
  severity="warning"
  rounded
  style={{
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 600
  }}
/>
```

## Best Practices

1. **Consistent Usage**

    - Use the same severity level for similar types of information
    - Maintain consistent tag sizes across the application

2. **Accessibility**

    - Ensure sufficient color contrast between text and background
    - Use appropriate aria-labels for screen readers

3. **Performance**

    - Memoize tags when used in lists or frequently re-rendered components
    - Avoid inline styles when possible

4. **Internationalization**
    - Keep tag text concise and translatable
    - Consider text length variations for different languages

## Related Components

-   `Badge`: For numeric indicators
-   `Label`: For form field labels
-   `Pill`: For chip-style selections

## Common Issues & Solutions

1. **Text Overflow**

    - Solution: Set a max-width and use text-overflow: ellipsis

    ```typescript
    style={{ maxWidth: '120px' }}
    ```

2. **Color Contrast Issues**

    - Solution: Use the contrast severity level or adjust colors in the theme

3. **Inconsistent Sizes**
    - Solution: Define standard sizes in the theme or component styles

## Theme Integration

The Tag component integrates with the VSCode theme system using CSS variables:

```css
--vscode-tag-primary: var(--vscode-button-background);
--vscode-tag-success: var(--vscode-gitDecoration-addedResourceForeground);
--vscode-tag-info: var(--vscode-editorInfo-foreground);
--vscode-tag-warning: var(--vscode-editorWarning-foreground);
--vscode-tag-danger: var(--vscode-errorForeground);
--vscode-tag-secondary: var(--vscode-descriptionForeground);
--vscode-tag-contrast: var(--vscode-foreground);
```

To customize these colors, modify the theme configuration in your VSCode extension settings.
