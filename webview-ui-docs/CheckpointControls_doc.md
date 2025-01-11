## Checkpoint Controls

The checkpoint controls component (`CheckpointControls.tsx`) manages conversation and workspace checkpoints through an expandable UI interface. The component uses styled-components for styling and React portals for menu rendering.

### Component Structure

-   `CheckpointOverlay`: Main component handling the UI and logic
-   `Controls`: Styled container positioning the controls at top-right
-   `ButtonGroup`: Manages the expandable button set
-   `ActionButton`: Individual control buttons with animations
-   `Menu`: Dropdown menu for restore options

### Styling Customization

The component uses CSS variables from VSCode's theme:

-   `--vscode-descriptionForeground`: Button icon colors
-   `--vscode-toolbar-hoverBackground`: Button hover states
-   `--vscode-menu-background`: Menu background
-   `--vscode-widget-border`: Menu borders
-   `--vscode-list-hoverBackground`: Menu item hover

To modify animations, update the keyframes in `ActionButton`:

```css
@keyframes rotate360 {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
```

### State Management

Key state variables:

-   `expanded`: Controls button group expansion
-   `showMenu`: Toggles restore menu visibility
-   `*Disabled`: Manages button disabled states during operations

### Event Handling

The component listens to:

-   Window messages for control relinquishment
-   Scroll events for menu positioning
-   Click-away events for closing menus

### Extending Functionality

To add new checkpoint actions:

1. Add new state variables if needed
2. Extend the `ButtonGroup` with new `ActionButton` components
3. Implement handler functions for new actions
4. Add corresponding message types in `ExtensionMessage`

### Menu Customization

The restore menu (`Menu` component) can be extended by:

1. Adding new `MenuItem` components
2. Creating new handler functions in `handleRestore`
3. Adding new restore types to `ClineCheckpointRestore`

### Portal Management

The menu uses React portals for rendering. To modify portal behavior:

1. Update `menuPosition` calculation in `updateMenuPosition`
2. Modify scroll and resize event listeners
3. Adjust menu positioning logic based on viewport constraints

### Message Communication

The component communicates with the extension through:

-   `checkpointRestore`: Triggers restore operations
-   `checkpointDiff`: Initiates diff comparisons
-   `relinquishControl`: Resets control states

To add new messages:

1. Define message type in `ExtensionMessage`
2. Add handler in `handleMessage`
3. Implement `vscode.postMessage` call

### Adding New Tools

To add a new tool to the checkpoint controls:

1. **Add New Button Icon**

    ```tsx
    // Import new codicon or use existing ones from VSCode
    <ActionButton title="New Tool">
    	<i className="codicon codicon-your-icon" />
    </ActionButton>
    ```

2. **Add Animation (Optional)**

    ```css
    // In ActionButton styled component
    &:hover {
      i.codicon-your-icon {
        animation: your-animation 0.5s ease-out;
      }
    }

    @keyframes your-animation {
      // Define animation keyframes
    }
    ```

3. **Add Menu Item**

    ```tsx
    <MenuItem onClick={() => handleNewAction()}>
    	<MenuItemTitle>
    		<i className="codicon codicon-your-icon" />
    		Your Tool Name
    	</MenuItemTitle>
    	<MenuItemDescription>Description of what your tool does</MenuItemDescription>
    </MenuItem>
    ```

4. **Add State Management**

    ```tsx
    const [newToolDisabled, setNewToolDisabled] = useState(false)
    // Add to relinquishControl handler
    if (message.type === "relinquishControl") {
    	setNewToolDisabled(false)
    }
    ```

5. **Implement Handler**
    ```tsx
    const handleNewAction = () => {
    	setNewToolDisabled(true)
    	vscode.postMessage({
    		type: "yourNewAction",
    		number: messageTs,
    		// additional parameters
    	})
    	setShowMenu(false)
    }
    ```

Remember to:

-   Follow VSCode's design patterns for consistency
-   Add appropriate loading/disabled states
-   Handle errors and edge cases
-   Update types in shared message interfaces
