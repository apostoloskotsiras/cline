# Navigation Bar Documentation

## Overview

The Navigation Bar component (`NavBar.tsx`) is a top-level navigation component used in the Cline application. It provides access to core functionalities like creating new tasks, accessing MCP servers, viewing history, and configuring settings.

## Component Structure

### NavBar Props Interface

```typescript
interface NavBarProps {
	showSettings: boolean
	showHistory: boolean
	showMcp: boolean
	logoUrl: string
	onNewTask: () => void
	onMcpServers: () => void
	onHistory: () => void
	onSettings: () => void
	onPopout: () => void
}
```

## Styling

The navigation bar uses styled-components defined in `NavBar.styles.tsx`. Key style components include:

-   `NavContainer`: Root container for the navigation bar
-   `NavContent`: Content wrapper with max-width constraint
-   `NavWrapper`: Flex container for logo and buttons
-   `LogoContainer`: Container for logo and text
-   `ButtonContainer`: Container for navigation buttons
-   `NavButton`: Individual navigation button with active state
-   `ButtonIcon`: Icon wrapper for consistent icon styling

### Responsive Design

The navigation bar includes responsive design features:

-   Below 600px viewport width:
    -   Logo text is hidden
    -   Button text is hidden, showing only icons
    -   Button padding is reduced

## Integration

### In App.tsx

The NavBar is integrated at the top level in `App.tsx`. State management for different views is handled through useState hooks:

```typescript
const [showSettings, setShowSettings] = useState(false)
const [showHistory, setShowHistory] = useState(false)
const [showMcp, setShowMcp] = useState(false)
```

### Command Registration

Commands for each navigation action are registered in `package.json`:

```json
{
	"commands": [
		{
			"command": "cline.plusButtonClicked",
			"title": "New Task"
		},
		{
			"command": "cline.mcpButtonClicked",
			"title": "MCP Servers"
		},
		{
			"command": "cline.historyButtonClicked",
			"title": "History"
		},
		{
			"command": "cline.settingsButtonClicked",
			"title": "Settings"
		},
		{
			"command": "cline.popoutButtonClicked",
			"title": "Open in Editor"
		}
	]
}
```

## How to Modify

### Adding a New Navigation Item

1. Add new state in `App.tsx`:

```typescript
const [showNewFeature, setShowNewFeature] = useState(false)
```

2. Add new prop to NavBarProps in `NavBar.tsx`:

```typescript
interface NavBarProps {
	showNewFeature: boolean
	onNewFeature: () => void
	// ... existing props
}
```

3. Add new button in NavBar component:

```typescript
<S.NavButton
    onClick={onNewFeature}
    $isActive={showNewFeature}
>
    <S.ButtonIcon>
        <VscIcon />
    </S.ButtonIcon>
    <span>New Feature</span>
</S.NavButton>
```

4. Register command in `package.json`:

```json
{
	"command": "cline.newFeatureClicked",
	"title": "New Feature"
}
```

5. Register command handler in `extension.ts`:

```typescript
context.subscriptions.push(
	vscode.commands.registerCommand("cline.newFeatureClicked", () => {
		sidebarProvider.postMessageToWebview({
			type: "action",
			action: "newFeatureClicked",
		})
	}),
)
```

### Removing a Navigation Item

1. Remove the state from `App.tsx`
2. Remove the prop from NavBarProps interface
3. Remove the button from NavBar component
4. Remove the command from `package.json`
5. Remove the command registration from `extension.ts`

### Styling Modifications

To modify the appearance of navigation items:

1. Update styles in `NavBar.styles.tsx`:

```typescript
export const NavButton = styled.button<NavButtonProps>`
	// Modify existing styles or add new ones
	padding: 8px 16px; // Example modification
	// ... other styles
`
```

2. For responsive changes, modify the media queries:

```typescript
@media (max-width: 600px) {
    // Modify existing or add new responsive styles
}
```
