# ChatRow Component Documentation

## Overview

The ChatRow component is responsible for rendering individual chat messages in the conversation view. It handles different message types (user messages, questions, API requests, commands, etc.) with appropriate styling and functionality.

## Key Features

-   Message type detection and rendering
-   API request state visualization (loading, completed, failed)
-   Command execution display
-   MCP server interactions
-   Checkpoint controls integration
-   Responsive design with smooth animations

## Component Structure

### Main Sections

-   `ChatRowContainer`: Outer container with hover effects and animations
-   `QuestionContainer`: Special styling for question-type messages
-   `UserMessageContainer`: Styling for regular user messages
-   `ChatRowContent`: Inner content handling message-specific rendering

### Message Types

1. **API Requests**

    - Loading state with animated border
    - Completed state with green border
    - Failed state with error indicators
    - Cost display for completed requests

2. **Commands**

    - Command text display
    - Output expansion/collapse
    - Execution state indicators

3. **MCP Server Interactions**

    - Tool usage display
    - Resource access details
    - Server response visualization

4. **Completion Results**
    - Task completion indicators
    - Change visualization controls
    - Success state styling

## Styling System

### CSS Classes

-   `.chat-row-container`: Base message container
-   `.loading-api`: API request loading state
-   `.completed-api`: API request completed state
-   `.question-container`: Question message styling
-   `.user-message-container`: Regular message styling

### Animations

-   `rainbow-border`: Loading state border animation
-   `glow-pulse`: Subtle background glow effect
-   Smooth hover transitions for interactive elements

## Props Interface

```typescript
interface ChatRowProps {
	message: ClineMessage
	isExpanded: boolean
	onToggleExpand: () => void
	lastModifiedMessage?: ClineMessage
	isLast: boolean
	onHeightChange: (isTaller: boolean) => void
}
```

## State Management

-   Tracks message expansion state
-   Manages API request loading states
-   Handles height changes for smooth scrolling
-   Controls checkpoint visibility

## Best Practices

1. Use appropriate container classes for different message types
2. Maintain consistent spacing and animations
3. Handle API states clearly with visual indicators
4. Ensure accessibility for all interactive elements
5. Keep animations performant and subtle

## Integration Points

-   Works with CheckpointControls for task management
-   Integrates with MCP server components
-   Connects with CodeAccordian for code display
-   Uses MarkdownBlock for text rendering

## Customization

To modify styles:

1. Update ChatRow.css with new styles
2. Add new CSS classes as needed
3. Maintain existing animation timing
4. Follow VSCode theme variables

## Common Issues & Solutions

1. **Animation Jank**

    - Solution: Use `will-change` and optimize CSS transitions

2. **State Sync Issues**

    - Solution: Ensure proper useEffect dependencies

3. **Text Overflow**
    - Solution: Use `overflow-wrap: anywhere` and proper container sizing

## Related Components

-   `CheckpointControls`: For task management
-   `CodeAccordian`: For code display
-   `MarkdownBlock`: For text rendering
-   `McpResourceRow`: For MCP resource display
