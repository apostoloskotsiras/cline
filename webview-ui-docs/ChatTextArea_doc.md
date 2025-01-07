# ChatTextArea Component Documentation

## Overview
The ChatTextArea is a sophisticated text input component that provides rich functionality including:
- File/folder mentions with auto-complete
- Image attachments
- Animated send button
- Thanos-style disintegration effect
- Smart cursor navigation through mentions

## Key Features

### 1. Mention System
- **Trigger**: Type `@` to activate the mention context menu
- **Location**: Mention handling logic in `handleMentionSelect` and `updateHighlights`
- **Styling**: Mention tags styled in `TextContainer` styled component
- **Icons**: SVG icons defined in `updateHighlights` for files/folders/problems

### 2. Animations
- **Send Animation**: Flying paper plane effect in `SendSvg` styled component
- **Text Disintegration**: Thanos effect in `TextContainer` keyframes
- **Timing**: Animation durations and curves can be adjusted in respective styled components

### 3. Styling Customization
```typescript
// Main container styling
const ChatTextAreaContainer = styled.div<{ disabled: boolean }>`
  // Modify container appearance here
`

// Mention tag styling
.mention-context-textarea-highlight {
  // Modify tag appearance here
}

// Icon styling
.mention-icon {
  // Modify icon appearance here
}
```

### 4. Key Event Handling
- **Arrow Navigation**: Custom handling in `handleKeyDown` for mention navigation
- **Enter Key**: Triggers send with animation
- **Backspace**: Special handling for mention deletion

## Common Modification Points

### Adding New Mention Types
1. Add new type to `ContextMenuOptionType` enum
2. Add icon in `updateHighlights`
3. Add handling in `handleMentionSelect`

### Modifying Tag Appearance
```typescript
.mention-context-textarea-highlight {
    background: rgb(75 89 97);  // Tag background color
    border-radius: 4px;         // Tag corner roundness
    padding: 1px 2px;          // Tag internal spacing
    // ... other styling
}
```

### Customizing Animations
```typescript
@keyframes disintegrate {
    // Modify animation keyframes here
}

@keyframes fly {
    // Modify send button animation here
}
```

## Props Interface
```typescript
interface ChatTextAreaProps {
    inputValue: string                  // Current input value
    setInputValue: (value: string) => void
    textAreaDisabled: boolean           // Disable state
    placeholderText: string            // Placeholder text
    selectedImages: string[]           // Selected image data URLs
    setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>
    onSend: () => void                // Send callback
    onSelectImages: () => void        // Image selection callback
    shouldDisableImages: boolean      // Image upload state
    onHeightChange?: (height: number) => void
}
```

## Important Constants
- `MAX_IMAGES_PER_MESSAGE`: Maximum number of images allowed per message
- Animation durations: 
  - Send animation: 800ms
  - Disintegration: 600ms

## Event Flow
1. User types `@` → `handleInputChange` → shows context menu
2. User selects mention → `handleMentionSelect` → updates input
3. User hits enter → `handleSendWithAnimation` → triggers animations → `onSend`

## Dependencies
- `react-textarea-autosize`: For auto-resizing textarea
- `styled-components`: For component styling
- Context mention utilities from shared folder

## Best Practices
1. Always update both textarea and highlight layer when modifying text
2. Use `useCallback` for event handlers to prevent unnecessary rerenders
3. Keep animations in sync with state changes
4. Handle disabled states appropriately

## Common Issues & Solutions
1. **Text/Highlight Misalignment**: Ensure identical styling between textarea and highlight layer
2. **Animation Glitches**: Check timing in `handleSendWithAnimation`
3. **Cursor Position**: Use `setIntendedCursorPosition` for cursor management

## Related Components
- `ContextMenu`: Handles mention suggestions
- `Thumbnails`: Manages image previews
