import { VSCodeCheckbox, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { useCallback, useState } from "react"
import styled from "styled-components"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { AutoApprovalSettings } from "../../../../src/shared/AutoApprovalSettings"
import { vscode } from "../../utils/vscode"

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
			<style>
				{`
					/* Animation container */
					.menu-content {
						overflow: hidden;
						transition: max-height 0.35s cubic-bezier(0.33, 1, 0.68, 1);
						max-height: 0;
						will-change: max-height;
					}

					.menu-content.expanded {
						max-height: 1000px;
						transition: max-height 0.45s cubic-bezier(0.33, 1, 0.68, 1);
					}

					.menu-content-inner {
						opacity: 0;
						transform: translateY(-6px);
						transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
						will-change: transform, opacity;
					}

					.menu-content.expanded .menu-content-inner {
						opacity: 1;
						transform: translateY(0);
						transition-delay: 0.05s;
					}

					/* Custom Checkbox Styling */
					vscode-checkbox {
						--checkbox-size: 16px;
					}

					vscode-checkbox::part(control) {
						background: rgba(30, 30, 30, 0.6) !important;
						border: 1px solid rgba(255, 255, 255, 0.1) !important;
						border-radius: 4px !important;
						transition: all 0.2s ease !important;
						width: var(--checkbox-size) !important;
						height: var(--checkbox-size) !important;
						position: relative !important;
						cursor: pointer !important;
					}

					vscode-checkbox:hover::part(control) {
						background: rgba(35, 35, 35, 0.7) !important;
						border-color: rgba(103, 58, 183, 0.2) !important;
					}

					vscode-checkbox[checked]::part(control) {
						background: rgba(103, 58, 183, 0.2) !important;
						border-color: rgba(103, 58, 183, 0.3) !important;
					}

					vscode-checkbox[checked]:hover::part(control) {
						background: rgba(103, 58, 183, 0.25) !important;
						border-color: rgba(103, 58, 183, 0.35) !important;
					}

					vscode-checkbox::part(input) {
						cursor: pointer !important;
					}

					vscode-checkbox[disabled]::part(control) {
						opacity: 0.5 !important;
						cursor: not-allowed !important;
						background: rgba(30, 30, 30, 0.3) !important;
						border-color: rgba(255, 255, 255, 0.05) !important;
					}

					vscode-checkbox[disabled]::part(input) {
						cursor: not-allowed !important;
					}

					/* Custom checkmark */
					vscode-checkbox[checked]::part(control)::after {
						content: '';
						position: absolute !important;
						left: 5px !important;
						top: 2px !important;
						width: 4px !important;
						height: 8px !important;
						border: solid rgba(103, 58, 183, 0.9) !important;
						border-width: 0 2px 2px 0 !important;
						transform: rotate(45deg) !important;
						transition: all 0.2s ease !important;
					}

					vscode-checkbox[checked]:hover::part(control)::after {
						border-color: rgba(103, 58, 183, 1) !important;
					}

					/* Label styling */
					vscode-checkbox::part(label) {
						color: var(--vscode-foreground) !important;
						font-size: 13px !important;
						padding-left: 8px !important;
						cursor: pointer !important;
						transition: opacity 0.2s ease !important;
					}

					vscode-checkbox:hover::part(label) {
						opacity: 0.9 !important;
					}

					vscode-checkbox[disabled]::part(label) {
						opacity: 0.5 !important;
						cursor: not-allowed !important;
					}

					/* Rest of your existing styles */
					vscode-text-field {
						background: rgba(30, 30, 30, 0.6) !important;
						border: 1px solid rgba(255, 255, 255, 0.06) !important;
						border-radius: 4px !important;
						transition: all 0.2s ease !important;
					}

					vscode-text-field:hover {
						background: rgba(35, 35, 35, 0.7) !important;
						border-color: rgba(103, 58, 183, 0.2) !important;
					}

					vscode-text-field:focus-within {
						border-color: rgba(103, 58, 183, 0.3) !important;
						background: rgba(40, 40, 40, 0.8) !important;
					}

					vscode-text-field::part(control) {
						background: transparent !important;
						--input-background: transparent !important;
						border: none !important;
						color: var(--vscode-foreground) !important;
						font-family: var(--vscode-font-family) !important;
						font-size: 13px !important;
					}

					.auto-approve-section {
						background: rgba(25, 25, 25, 0.95);
						border: 1px solid rgba(103, 58, 183, 0.15);
						border-radius: 8px;
						padding: 12px;
						margin: 12px 0;
						transition: all 0.2s ease;
					}

					.auto-approve-section:hover {
						border-color: rgba(103, 58, 183, 0.25);
						background: rgba(28, 28, 28, 0.95);
					}

					.description-text {
						color: var(--vscode-descriptionForeground);
						font-size: 12px;
						line-height: 1.4;
						margin: 8px 0;
						opacity: 0.85;
					}

					.divider {
						height: 1px;
						background: linear-gradient(
							90deg,
							transparent 0%,
							rgba(103, 58, 183, 0.15) 50%,
							transparent 100%
						);
						margin: 15px 0;
					}

					.checkbox-description {
						margin-left: 28px;
						color: var(--vscode-descriptionForeground);
						font-size: 12px;
						line-height: 1.4;
						opacity: 0.85;
					}

					.settings-row {
						display: flex;
						align-items: center;
						gap: 8px;
						margin: 10px 0;
						padding: 4px 0;
					}

					.settings-label {
						color: var(--vscode-foreground);
						font-size: 13px;
						flex-shrink: 1;
						min-width: 0;
					}

					/* Chevron animation */
					.chevron-icon {
						transition: transform 0.35s cubic-bezier(0.33, 1, 0.68, 1);
						transform: rotate(-90deg);
						will-change: transform;
						opacity: 0.8;
					}

					.chevron-icon.expanded {
						transform: rotate(0deg);
						opacity: 1;
					}

					/* Collapsible section hover effect */
					${CollapsibleSection} {
						transition: color 0.2s ease;
					}

					${CollapsibleSection}:hover .chevron-icon {
						opacity: 1;
					}

					/* Smooth transition for the header padding */
					.menu-header {
						transition: padding 0.35s cubic-bezier(0.33, 1, 0.68, 1);
					}
				`}
			</style>
			<div
				className="menu-header"
				style={{
					display: "flex",
					alignItems: "center",
					gap: "12px",
					padding: isExpanded ? "8px 0" : "8px 0 0 0",
					cursor: !hasEnabledActions ? "pointer" : "default",
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
						{enabledActions.length === 0 ? "None" : enabledActionsList}
					</span>
					<span
						className={`codicon codicon-chevron-right chevron-icon ${isExpanded ? 'expanded' : ''}`}
						style={{
							flexShrink: 0,
							marginLeft: isExpanded ? "2px" : "-2px",
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
					<div className="auto-approve-section">
						{ACTION_METADATA.map((action) => (
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
					<div className="divider" />
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
