# AutoApproveMenu Styling System

## Overview
The AutoApproveMenu component uses a modular CSS system with semantic class names and CSS variables for consistent styling. Styles are organized into logical sections in `AutoApproveMenu.css`.

## Tag Component Usage

The Tag component is used to display enabled actions with appropriate severity levels:

```tsx
<Tag 
  value={action.shortName}
  severity={severity}
  rounded
  style={{ marginLeft: '4px' }}
/>
```

### Severity Levels
| Action    | Severity  | Color Scheme          |
|-----------|-----------|-----------------------|
| Read      | success   | Green                 |
| Edit      | danger    | Red                   |
| Commands  | warning   | Yellow/Orange         |
| Browser   | info      | Blue                  |
| MCP       | secondary | Gray                  |

## CSS Structure

### Main Sections
- `.menu-content` - Container for expandable content
- `.menu-content-inner` - Inner wrapper for animations
- `.auto-approve-section` - Section containing action checkboxes
- `.settings-row` - Layout for settings controls

### Utility Classes
- `.description-text` - Secondary text styling
- `.checkbox-description` - Checkbox helper text
- `.divider` - Section divider line
- `.settings-label` - Form label styling

## Customization

### Using CSS Variables
Override these VS Code theme variables for custom styling:
```css
--vscode-foreground: #ffffff;
--vscode-descriptionForeground: #cccccc;
```

### Adding New Styles
1. Add new classes in `AutoApproveMenu.css`
2. Use semantic, descriptive class names
3. Follow existing naming conventions
4. Document new classes in this file

## Animation System
- Uses cubic-bezier timing functions
- Transition properties are optimized for performance
- Animations are hardware-accelerated using `will-change`

Example animation configuration:
```css
transition: max-height 0.35s cubic-bezier(0.33, 1, 0.68, 1);
will-change: max-height;
