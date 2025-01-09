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

// Add severity mapping for descriptions
const getDescriptionSeverity = (actionId: string): 'critical' | 'warning' | 'info' => {
	const severityMap: Record<string, 'critical' | 'warning' | 'info'> = {
		'editFiles': 'critical',
		'executeCommands': 'critical',
		'readFiles': 'warning',
		'useBrowser': 'warning',
		'useMcp': 'warning'
	};
	return severityMap[actionId] || 'info';
};

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
				userSelect: "none",
				borderTop: isExpanded ? `1px solid var(--vscode-panel-border)` : "none",
				overflowY: "auto",
				...style,
			}}>
			<div
				className="menu-header"
				role="button"
				tabIndex={0}
				aria-expanded={isExpanded}
				aria-controls="auto-approve-content"
				onMouseEnter={() => setIsHoveringCollapsibleSection(true)}
				onMouseLeave={() => setIsHoveringCollapsibleSection(false)}
				onClick={(e) => {
					// Don't toggle if clicking the checkbox
					if ((e.target as HTMLElement).closest('vscode-checkbox')) {
						return;
					}
					setIsExpanded((prev) => !prev);
				}}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						setIsExpanded((prev) => !prev);
					}
				}}>
				<div className="checkbox-container">
					<VSCodeCheckbox
						checked={hasEnabledActions && autoApprovalSettings.enabled}
						disabled={!hasEnabledActions}
						onClick={(e) => {
							e.stopPropagation();
							if (!hasEnabledActions) return;
							updateEnabled(!autoApprovalSettings.enabled);
						}}
					/>
					<span className="label-text">Auto-approve:</span>
				</div>
				<div className="tag-container">
					{enabledActions.length === 0 ? (
						<span style={{ color: 'var(--vscode-descriptionForeground)', fontSize: '12px' }}>None</span>
					) : (
						enabledActions.map((action) => {
							const severityMap: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'secondary'> = {
								'Read': 'success',
								'Edit': 'danger',
								'Commands': 'warning',
								'Browser': 'info',
								'MCP': 'info'
							};
							const severity = severityMap[action.shortName] || 'secondary';
							return (
								<Tag 
									key={action.id}
									value={action.shortName} 
									severity={severity}
									rounded
								/>
							)
						})
					)}
				</div>
				<span
					className={`codicon ${isExpanded ? 'codicon-chevron-down' : 'codicon-chevron-right'}`}
					style={{
						marginLeft: "auto",
						fontSize: "12px",
						opacity: 0.8,
						transition: "transform 0.2s ease"
					}}
					aria-hidden="true"
				/>
			</div>
			<div 
				id="auto-approve-content"
				className={`menu-content ${isExpanded ? 'expanded' : ''}`}
				role="region"
				aria-label="Auto-approve settings">
				<div className="menu-content-inner">
					<div className="description-text">
						<div className="checkbox-description">
							Auto-approve allows Cline to perform the following actions without asking for permission. Please use with
							caution and only enable if you understand the risks.
						</div>
					</div>

					{/* Permissions Section */}
					<div className="auto-approve-section" role="region" aria-label="Permission Settings">
						<div className="settings-section" role="group" aria-labelledby="file-operations-header">
							<div className="section-header" id="file-operations-header">
								<span className="codicon codicon-files" aria-hidden="true" />
								<h3>File Operations</h3>
								<span className="section-badge" aria-label="2 options available">2</span>
							</div>
							<div className="settings-options-group">
								{ACTION_METADATA.slice(0, 2).map((action) => (
									<div key={action.id} className="settings-option">
										<VSCodeCheckbox
											checked={autoApprovalSettings.actions[action.id]}
											onChange={(e) => {
												const checked = (e.target as HTMLInputElement).checked
												updateAction(action.id, checked)
											}}
											aria-describedby={`${action.id}-description`}>
											{action.label}
										</VSCodeCheckbox>
										<div 
											id={`${action.id}-description`} 
											className={`checkbox-description severity-${getDescriptionSeverity(action.id)}`}>
											{action.description}
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="settings-section" role="group" aria-labelledby="system-access-header">
							<div className="section-header" id="system-access-header">
								<span className="codicon codicon-terminal" aria-hidden="true" />
								<h3>System Access</h3>
								<span className="section-badge" aria-label="2 options available">2</span>
							</div>
							<div className="settings-options-group">
								{ACTION_METADATA.slice(2, 4).map((action) => (
									<div key={action.id} className="settings-option">
										<VSCodeCheckbox
											checked={autoApprovalSettings.actions[action.id]}
											onChange={(e) => {
												const checked = (e.target as HTMLInputElement).checked
												updateAction(action.id, checked)
											}}
											aria-describedby={`${action.id}-description`}>
											{action.label}
										</VSCodeCheckbox>
										<div 
											id={`${action.id}-description`} 
											className={`checkbox-description severity-${getDescriptionSeverity(action.id)}`}>
											{action.description}
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="settings-section" role="group" aria-labelledby="advanced-features-header">
							<div className="section-header" id="advanced-features-header">
								<span className="codicon codicon-settings-gear" aria-hidden="true" />
								<h3>Advanced Features</h3>
								<span className="section-badge" aria-label="1 option available">1</span>
							</div>
							<div className="settings-options-group">
								{ACTION_METADATA.slice(4).map((action) => (
									<div key={action.id} className="settings-option">
										<VSCodeCheckbox
											checked={autoApprovalSettings.actions[action.id]}
											onChange={(e) => {
												const checked = (e.target as HTMLInputElement).checked
												updateAction(action.id, checked)
											}}
											aria-describedby={`${action.id}-description`}>
											{action.label}
										</VSCodeCheckbox>
										<div 
											id={`${action.id}-description`} 
											className={`checkbox-description severity-${getDescriptionSeverity(action.id)}`}>
											{action.description}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* <div className="divider" role="separator" aria-hidden="true" /> */}

					{/* Limits Section */}
					<div className="settings-section" role="group" aria-labelledby="limits-header">
						<div className="section-header" id="limits-header">
							<span className="codicon codicon-graph" aria-hidden="true" />
							<h3>Limits</h3>
						</div>
						<div className="settings-options-group">
							<div className="settings-row">
								<label htmlFor="max-requests" className="settings-label">Max Requests:</label>
								<VSCodeTextField
									id="max-requests"
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
									aria-describedby="max-requests-description"
								/>
							</div>
							<div id="max-requests-description" className="checkbox-description severity-info">
								Cline will automatically make this many API requests before asking for approval to proceed with the task.
							</div>
						</div>
					</div>

					{/* <div className="divider" role="separator" aria-hidden="true" /> */}

					{/* Notifications Section */}
					<div className="settings-section" role="group" aria-labelledby="notifications-header">
						<div className="section-header" id="notifications-header">
							<span className="codicon codicon-bell" aria-hidden="true" />
							<h3>Notifications</h3>
						</div>
						<div className="settings-options-group">
							<div className="settings-option">
								<VSCodeCheckbox
									checked={autoApprovalSettings.enableNotifications}
									onChange={(e) => {
										const checked = (e.target as HTMLInputElement).checked
										updateNotifications(checked)
									}}
									aria-describedby="notifications-description">
									Enable Notifications
								</VSCodeCheckbox>
								<div 
									id="notifications-description" 
									className={`checkbox-description severity-${getDescriptionSeverity('enableNotifications')}`}>
									Receive system notifications when Cline requires approval to proceed or when a task is completed.
								</div>
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
