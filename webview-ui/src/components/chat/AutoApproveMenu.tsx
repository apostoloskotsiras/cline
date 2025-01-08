import { VSCodeCheckbox, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { useCallback, useState } from "react"
import { Tag } from "../common/Tag"
import styled from "styled-components"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { AutoApprovalSettings } from "../../../../src/shared/AutoApprovalSettings"
import { vscode } from "../../utils/vscode"
import "./AutoApproveMenu.css"

interface AutoApproveMenuProps {
	style?: React.CSSProperties
}

const ACTION_METADATA: {
	id: keyof AutoApprovalSettings["actions"]
	label: string
	shortName: string
	description: string
}[] = [
	{
		id: "readFiles",
		label: "Read files and directories",
		shortName: "Read",
		description: "Allows access to read any file on your computer.",
	},
	{
		id: "editFiles",
		label: "Edit files",
		shortName: "Edit",
		description: "Allows modification of any files on your computer.",
	},
	{
		id: "executeCommands",
		label: "Execute safe commands",
		shortName: "Commands",
		description:
			"Allows execution of safe terminal commands. If the model determines a command is potentially destructive, it will still require approval.",
	},
	{
		id: "useBrowser",
		label: "Use the browser",
		shortName: "Browser",
		description: "Allows ability to launch and interact with any website in a headless browser.",
	},
	{
		id: "useMcp",
		label: "Use MCP servers",
		shortName: "MCP",
		description: "Allows use of configured MCP servers which may modify filesystem or interact with APIs.",
	},
]

const AutoApproveMenu = ({ style }: AutoApproveMenuProps) => {
	const { autoApprovalSettings } = useExtensionState()
	const [isExpanded, setIsExpanded] = useState(false)
	const [isHoveringCollapsibleSection, setIsHoveringCollapsibleSection] = useState(false)

	// Careful not to use partials to mutate since spread operator only does shallow copy

	const enabledActions = ACTION_METADATA.filter((action) => autoApprovalSettings.actions[action.id])
	const enabledActionsList = enabledActions.map((action) => action.shortName).join(", ")
	const hasEnabledActions = enabledActions.length > 0

	const updateEnabled = useCallback(
		(enabled: boolean) => {
			vscode.postMessage({
				type: "autoApprovalSettings",
				autoApprovalSettings: {
					...autoApprovalSettings,
					enabled,
				},
			})
		},
		[autoApprovalSettings],
	)

	const updateAction = useCallback(
		(actionId: keyof AutoApprovalSettings["actions"], value: boolean) => {
			// Calculate what the new actions state will be
			const newActions = {
				...autoApprovalSettings.actions,
				[actionId]: value,
			}

			// Check if this will result in any enabled actions
			const willHaveEnabledActions = Object.values(newActions).some(Boolean)

			vscode.postMessage({
				type: "autoApprovalSettings",
				autoApprovalSettings: {
					...autoApprovalSettings,
					actions: newActions,
					// If no actions will be enabled, ensure the main toggle is off
					enabled: willHaveEnabledActions ? autoApprovalSettings.enabled : false,
				},
			})
		},
		[autoApprovalSettings],
	)

	const updateMaxRequests = useCallback(
		(maxRequests: number) => {
			vscode.postMessage({
				type: "autoApprovalSettings",
				autoApprovalSettings: {
					...autoApprovalSettings,
					maxRequests,
				},
			})
		},
		[autoApprovalSettings],
	)

	const updateNotifications = useCallback(
		(enableNotifications: boolean) => {
			vscode.postMessage({
				type: "autoApprovalSettings",
				autoApprovalSettings: {
					...autoApprovalSettings,
					enableNotifications,
				},
			})
		},
		[autoApprovalSettings],
	)

	return (
		<div
			style={{
				padding: "0 15px 5px",
				userSelect: "none",
				borderTop: isExpanded
					? `1px solid rgba(103, 58, 183, 0.15)`
					: "none",
				overflowY: "auto",
				...style,
			}}>
			<div
				className="menu-header"
				style={{
					display: "flex",
					alignItems: "center",
					gap: "12px",
					cursor: !hasEnabledActions ? "pointer" : "default",
					position: "relative",
				}}
				onMouseEnter={() => {
					if (!hasEnabledActions) {
						setIsHoveringCollapsibleSection(true)
					}
				}}
				onMouseLeave={() => {
					if (!hasEnabledActions) {
						setIsHoveringCollapsibleSection(false)
					}
				}}
				onClick={() => {
					if (!hasEnabledActions) {
						setIsExpanded((prev) => !prev)
					}
				}}>
				<VSCodeCheckbox
					style={{
						pointerEvents: hasEnabledActions ? "auto" : "none",
					}}
					checked={hasEnabledActions && autoApprovalSettings.enabled}
					disabled={!hasEnabledActions}
					onClick={(e) => {
						if (!hasEnabledActions) return
						e.stopPropagation()
						updateEnabled(!autoApprovalSettings.enabled)
					}}
				/>
				<CollapsibleSection
					isHovered={isHoveringCollapsibleSection}
					style={{ cursor: "pointer" }}
					onClick={() => {
						if (hasEnabledActions) {
							setIsExpanded((prev) => !prev)
						}
					}}>
					<span
						style={{
							color: "var(--vscode-foreground)",
							whiteSpace: "nowrap",
							fontWeight: 500,
						}}>
						Auto-approve:
					</span>
					<span
						style={{
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}>
						{enabledActions.length === 0 ? "None" : (
							enabledActions.map((action) => {
								const severityMap: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'> = {
									'Read': 'success',
									'Edit': 'danger',
									'Commands': 'warning',
									'Browser': 'info',
									'MCP': 'secondary'
								};
								const severity = severityMap[action.shortName] || 'secondary';
								return (
									<Tag 
										key={action.id}
										value={action.shortName} 
										severity={severity}
										rounded
										style={{ marginLeft: '4px' }}
									/>
								)
							})
						)}
					</span>
					<span
						className={`codicon ${isExpanded ? 'codicon-chevron-down' : 'codicon-chevron-right'} chevron-icon`}
						style={{
							flexShrink: 0,
							marginLeft: "4px",
							transition: "transform 0.2s ease"
						}}
					/>
				</CollapsibleSection>
			</div>
			<div className={`menu-content ${isExpanded ? 'expanded' : ''}`}>
				<div className="menu-content-inner">
					<div className="description-text">
						Auto-approve allows Cline to perform the following actions without asking for permission. Please use with
						caution and only enable if you understand the risks.
					</div>

					{/* Permissions Section */}
					<div className="auto-approve-section">
						<div className="settings-section">
							<div className="section-header">
								<span className="codicon codicon-files" />
								<h3>File Operations</h3>
							</div>
							{ACTION_METADATA.slice(0, 2).map((action) => (
								<div key={action.id} style={{ margin: "8px 0" }}>
									<VSCodeCheckbox
										checked={autoApprovalSettings.actions[action.id]}
										onChange={(e) => {
											const checked = (e.target as HTMLInputElement).checked
											updateAction(action.id, checked)
										}}>
										{action.label}
									</VSCodeCheckbox>
									<div className="checkbox-description">
										{action.description}
									</div>
								</div>
							))}
						</div>

						<div className="settings-section">
							<div className="section-header">
								<span className="codicon codicon-terminal" />
								<h3>System Access</h3>
							</div>
							{ACTION_METADATA.slice(2, 4).map((action) => (
								<div key={action.id} style={{ margin: "8px 0" }}>
									<VSCodeCheckbox
										checked={autoApprovalSettings.actions[action.id]}
										onChange={(e) => {
											const checked = (e.target as HTMLInputElement).checked
											updateAction(action.id, checked)
										}}>
										{action.label}
									</VSCodeCheckbox>
									<div className="checkbox-description">
										{action.description}
									</div>
								</div>
							))}
						</div>

						<div className="settings-section">
							<div className="section-header">
								<span className="codicon codicon-settings-gear" />
								<h3>Advanced Features</h3>
							</div>
							{ACTION_METADATA.slice(4).map((action) => (
								<div key={action.id} style={{ margin: "8px 0" }}>
									<VSCodeCheckbox
										checked={autoApprovalSettings.actions[action.id]}
										onChange={(e) => {
											const checked = (e.target as HTMLInputElement).checked
											updateAction(action.id, checked)
										}}>
										{action.label}
									</VSCodeCheckbox>
									<div className="checkbox-description">
										{action.description}
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="divider" />

					{/* Limits Section */}
					<div className="settings-section">
						<div className="section-header">
							<span className="codicon codicon-graph" />
							<h3>Limits</h3>
						</div>
						<div className="settings-row">
							<span className="settings-label">Max Requests:</span>
							<VSCodeTextField
								value={autoApprovalSettings.maxRequests.toString()}
								onInput={(e) => {
									const input = e.target as HTMLInputElement
									input.value = input.value.replace(/[^0-9]/g, "")
									const value = parseInt(input.value)
									if (!isNaN(value) && value > 0) {
										updateMaxRequests(value)
									}
								}}
								onKeyDown={(e) => {
									if (!/^\d$/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)) {
										e.preventDefault()
									}
								}}
								style={{ flex: 1 }}
							/>
						</div>
						<div className="description-text">
							Cline will automatically make this many API requests before asking for approval to proceed with the task.
						</div>
					</div>

					<div className="divider" />

					{/* Notifications Section */}
					<div className="settings-section">
						<div className="section-header">
							<span className="codicon codicon-bell" />
							<h3>Notifications</h3>
						</div>
						<div style={{ margin: "8px 0" }}>
							<VSCodeCheckbox
								checked={autoApprovalSettings.enableNotifications}
								onChange={(e) => {
									const checked = (e.target as HTMLInputElement).checked
									updateNotifications(checked)
								}}>
								Enable Notifications
							</VSCodeCheckbox>
							<div className="checkbox-description">
								Receive system notifications when Cline requires approval to proceed or when a task is completed.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const CollapsibleSection = styled.div<{ isHovered?: boolean }>`
	display: flex;
	align-items: center;
	gap: 4px;
	color: ${(props) => (props.isHovered ? "var(--vscode-foreground)" : "var(--vscode-descriptionForeground)")};
	flex: 1;
	min-width: 0;

	&:hover {
		color: var(--vscode-foreground);
	}
`

export default AutoApproveMenu
