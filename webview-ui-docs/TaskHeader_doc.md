# TaskHeader Component Documentation

## Overview
The TaskHeader component provides a collapsible header interface for task management, featuring:
- Expandable/collapsible task details
- Token and cost metrics display
- Image thumbnails integration
- Error message handling
- Cache operation indicators

## Component Structure

### Main Sections
- `task-header-container`: Outer container with hover effects
- `task-header-content`: Inner content wrapper
- `task-header-top`: Top bar with title and controls
- `task-text-container`: Expandable text area
- `task-metrics-container`: Metrics display section

### Key Subcomponents
- `Thumbnails`: Handles image previews
- `DeleteButton`: Task deletion control
- `VSCodeButton`: VS Code styled buttons

## Props Interface
```typescript
interface TaskHeaderProps {
  task: ClineMessage
  tokensIn: number
  tokensOut: number
  doesModelSupportPromptCache: boolean
  cacheWrites?: number
  cacheReads?: number
  totalCost: number
  onClose: () => void
}
```

## Styling System

### CSS Variables
The component uses these VS Code theme variables:
```css
--vscode-foreground: Text color
--vscode-badge-background: Header background
--vscode-textLink-foreground: Link colors
--vscode-editorWarning-foreground: Warning colors
```

### Customization Points
1. Modify gradients in `.task-header-container`
2. Adjust spacing in `task-header-content`
3. Change animation durations in hover states
4. Update typography in `.task-header-title-text`

Example customization:
```css
.task-header-container {
  background: linear-gradient(145deg, 
    rgba(40, 40, 40, 0.95) 0%,
    rgba(35, 35, 35, 0.95) 100%
  );
  transition: all 0.3s ease-out;
}
```

## State Management

### Key State Variables
- `isTaskExpanded`: Controls main expansion
- `isTextExpanded`: Manages text area expansion
- `showSeeMore`: Toggles "See more" button

### Event Handling
- Window resize events for dynamic sizing
- Click handlers for expansion/collapse
- Message posting for delete operations

## Best Practices for Modification

### Adding New Features
1. Create new state variables if needed
2. Add corresponding UI elements
3. Implement event handlers
4. Update TypeScript interfaces
5. Document new functionality

### Modifying Layout
- Use flexbox for component structure
- Maintain consistent spacing (8px increments)
- Follow VS Code design patterns

### Performance Optimization
- Use `memo` for component optimization
- Debounce resize event handlers
- Lazy load images in Thumbnails

## Common Issues & Solutions

### 1. Text Overflow
- Solution: Ensure proper text container sizing
- Use `white-space: pre-wrap` and `overflow-wrap: anywhere`

### 2. Animation Jank
- Solution: Use `will-change` and hardware acceleration
- Optimize CSS transitions

### 3. State Sync Issues
- Solution: Use useEffect dependencies properly
- Clean up event listeners

## Integration Points

### With Thumbnails Component
- Handles image display and previews
- Shares image data through props

### With VS Code Toolkit
- Uses VSCodeButton for consistent styling
- Integrates with VS Code theme system

### With Extension State
- Connects to extension state through context
- Displays API configuration details

## Example Modifications

### Adding New Metric
1. Add prop to interface
2. Create new metric display component
3. Add to metrics container
4. Update documentation

### Customizing Animations
```css
@keyframes slideIn {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.task-header-container {
  animation: slideIn 0.3s ease-out;
}
```

## Version History
- v1.0: Initial implementation
- v1.1: Added hover effects and animations
- v1.2: Integrated Thumbnails component
- v1.3: Improved responsive design

## Related Components
- `ChatRow`: For task message display
- `Thumbnails`: For image handling
- `AutoApproveMenu`: For task controls
