import { VSCodeCheckbox, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { useCallback, useState } from "react"
import { Tag } from "../common/Tag"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { useThemeStyles } from "../../utils/theme"
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

// Add severity mapping for descriptions
const getDescriptionSeverity = (actionId: string): "critical" | "warning" | "info" => {
	const severityMap: Record<string, "critical" | "warning" | "info"> = {
		editFiles: "critical",
		executeCommands: "critical",
		readFiles: "warning",
		useBrowser: "warning",
		useMcp: "warning",
	}
	return severityMap[actionId] || "info"
}

const AutoApproveMenu = ({ style }: AutoApproveMenuProps) => {
	const { autoApprovalSettings, themeMode, themeType } = useExtensionState()
	const S = useThemeStyles('chat/AutoApproveMenu', themeMode || 'dark', themeType || 'modern')
	const [isExpanded, setIsExpanded] = useState(false)
	const [isHoveringCollapsibleSection, setIsHoveringCollapsibleSection] = useState(false)

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
			const newActions = {
				...autoApprovalSettings.actions,
				[actionId]: value,
			}

			const willHaveEnabledActions = Object.values(newActions).some(Boolean)

			vscode.postMessage({
				type: "autoApprovalSettings",
				autoApprovalSettings: {
					...autoApprovalSettings,
					actions: newActions,
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
			<S.MenuHeader
				mode={themeMode || 'dark'}
				role="button"
				tabIndex={0}
				aria-expanded={isExpanded}
				aria-controls="auto-approve-content"
				onMouseEnter={() => setIsHoveringCollapsibleSection(true)}
				onMouseLeave={() => setIsHoveringCollapsibleSection(false)}
				onClick={(e: React.MouseEvent) => {
					if ((e.target as HTMLElement).closest("vscode-checkbox")) {
						return
					}
					setIsExpanded((prev) => !prev)
				}}
				onKeyDown={(e: React.KeyboardEvent) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault()
						setIsExpanded((prev) => !prev)
					}
				}}>
				<S.CheckboxContainer mode={themeMode || 'dark'}>
					<VSCodeCheckbox
						checked={hasEnabledActions && autoApprovalSettings.enabled}
						disabled={!hasEnabledActions}
						onClick={(e) => {
							e.stopPropagation()
							if (!hasEnabledActions) return
							updateEnabled(!autoApprovalSettings.enabled)
						}}
					/>
					<S.LabelText mode={themeMode || 'dark'}>Auto-approve:</S.LabelText>
				</S.CheckboxContainer>
				<S.TagContainer mode={themeMode || 'dark'}>
					{enabledActions.length === 0 ? (
						<span style={{ color: "var(--vscode-descriptionForeground)", fontSize: "12px" }}>None</span>
					) : (
						enabledActions.map((action) => {
							const severityMap: Record<string, "success" | "info" | "warning" | "danger" | "secondary"> = {
								Read: "success",
								Edit: "danger",
								Commands: "warning",
								Browser: "info",
								MCP: "info",
							}
							const severity = severityMap[action.shortName] || "secondary"
							return <Tag key={action.id} value={action.shortName} severity={severity} rounded />
						})
					)}
				</S.TagContainer>
				<span
					className={`codicon ${isExpanded ? "codicon-chevron-down" : "codicon-chevron-right"}`}
					style={{
						marginLeft: "auto",
						fontSize: "12px",
						opacity: 0.8,
						transition: "transform 0.2s ease",
					}}
					aria-hidden="true"
				/>
			</S.MenuHeader>
			<S.MenuContent mode={themeMode || 'dark'} id="auto-approve-content" $expanded={isExpanded} role="region" aria-label="Auto-approve settings">
				<S.MenuContentInner mode={themeMode || 'dark'}>
					<S.DescriptionText mode={themeMode || 'dark'}>
						<S.CheckboxDescription mode={themeMode || 'dark'}>
							Auto-approve allows Cline to perform the following actions without asking for permission. Please use
							with caution and only enable if you understand the risks.
						</S.CheckboxDescription>
					</S.DescriptionText>

					{/* Permissions Section */}
					<S.AutoApproveSection mode={themeMode || 'dark'} role="region" aria-label="Permission Settings">
						<S.SettingsSection mode={themeMode || 'dark'} role="group" aria-labelledby="file-operations-header">
							<S.SectionHeader mode={themeMode || 'dark'} id="file-operations-header">
								<span className="codicon codicon-files" aria-hidden="true" />
								<h3>File Operations</h3>
								<S.SectionBadge mode={themeMode || 'dark'} aria-label="2 options available">2</S.SectionBadge>
							</S.SectionHeader>
							<S.SettingsOptionsGroup mode={themeMode || 'dark'}>
								{ACTION_METADATA.slice(0, 2).map((action) => (
									<S.SettingsOption mode={themeMode || 'dark'} key={action.id}>
										<VSCodeCheckbox
											checked={autoApprovalSettings.actions[action.id]}
											onChange={(e) => {
												const checked = (e.target as HTMLInputElement).checked
												updateAction(action.id, checked)
											}}
											aria-describedby={`${action.id}-description`}>
											{action.label}
										</VSCodeCheckbox>
										<S.CheckboxDescription
											mode={themeMode || 'dark'}
											id={`${action.id}-description`}
											$severity={getDescriptionSeverity(action.id)}>
											{action.description}
										</S.CheckboxDescription>
									</S.SettingsOption>
								))}
							</S.SettingsOptionsGroup>
						</S.SettingsSection>

						<S.SettingsSection mode={themeMode || 'dark'} role="group" aria-labelledby="system-access-header">
							<S.SectionHeader mode={themeMode || 'dark'} id="system-access-header">
								<span className="codicon codicon-terminal" aria-hidden="true" />
								<h3>System Access</h3>
								<S.SectionBadge mode={themeMode || 'dark'} aria-label="2 options available">2</S.SectionBadge>
							</S.SectionHeader>
							<S.SettingsOptionsGroup mode={themeMode || 'dark'}>
								{ACTION_METADATA.slice(2, 4).map((action) => (
									<S.SettingsOption mode={themeMode || 'dark'} key={action.id}>
										<VSCodeCheckbox
											checked={autoApprovalSettings.actions[action.id]}
											onChange={(e) => {
												const checked = (e.target as HTMLInputElement).checked
												updateAction(action.id, checked)
											}}
											aria-describedby={`${action.id}-description`}>
											{action.label}
										</VSCodeCheckbox>
										<S.CheckboxDescription
											mode={themeMode || 'dark'}
											id={`${action.id}-description`}
											$severity={getDescriptionSeverity(action.id)}>
											{action.description}
										</S.CheckboxDescription>
									</S.SettingsOption>
								))}
							</S.SettingsOptionsGroup>
						</S.SettingsSection>

						<S.SettingsSection mode={themeMode || 'dark'} role="group" aria-labelledby="advanced-features-header">
							<S.SectionHeader mode={themeMode || 'dark'} id="advanced-features-header">
								<span className="codicon codicon-settings-gear" aria-hidden="true" />
								<h3>Advanced Features</h3>
								<S.SectionBadge mode={themeMode || 'dark'} aria-label="1 option available">1</S.SectionBadge>
							</S.SectionHeader>
							<S.SettingsOptionsGroup mode={themeMode || 'dark'}>
								{ACTION_METADATA.slice(4).map((action) => (
									<S.SettingsOption mode={themeMode || 'dark'} key={action.id}>
										<VSCodeCheckbox
											checked={autoApprovalSettings.actions[action.id]}
											onChange={(e) => {
												const checked = (e.target as HTMLInputElement).checked
												updateAction(action.id, checked)
											}}
											aria-describedby={`${action.id}-description`}>
											{action.label}
										</VSCodeCheckbox>
										<S.CheckboxDescription
											mode={themeMode || 'dark'}
											id={`${action.id}-description`}
											$severity={getDescriptionSeverity(action.id)}>
											{action.description}
										</S.CheckboxDescription>
									</S.SettingsOption>
								))}
							</S.SettingsOptionsGroup>
						</S.SettingsSection>
					</S.AutoApproveSection>

					{/* Limits Section */}
					<S.SettingsSection mode={themeMode || 'dark'} role="group" aria-labelledby="limits-header">
						<S.SectionHeader mode={themeMode || 'dark'} id="limits-header">
							<span className="codicon codicon-graph" aria-hidden="true" />
							<h3>Limits</h3>
						</S.SectionHeader>
						<S.SettingsOptionsGroup mode={themeMode || 'dark'}>
							<S.SettingsRow mode={themeMode || 'dark'}>
								<S.SettingsLabel mode={themeMode || 'dark'} htmlFor="max-requests">Max Requests:</S.SettingsLabel>
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
										if (
											!/^\d$/.test(e.key) &&
											!["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)
										) {
											e.preventDefault()
										}
									}}
									style={{ flex: 1 }}
									aria-describedby="max-requests-description"
								/>
							</S.SettingsRow>
							<S.CheckboxDescription mode={themeMode || 'dark'} id="max-requests-description" $severity="info">
								Cline will automatically make this many API requests before asking for approval to proceed with
								the task.
							</S.CheckboxDescription>
						</S.SettingsOptionsGroup>
					</S.SettingsSection>

					{/* Notifications Section */}
					<S.SettingsSection mode={themeMode || 'dark'} role="group" aria-labelledby="notifications-header">
						<S.SectionHeader mode={themeMode || 'dark'} id="notifications-header">
							<span className="codicon codicon-bell" aria-hidden="true" />
							<h3>Notifications</h3>
						</S.SectionHeader>
						<S.SettingsOptionsGroup mode={themeMode || 'dark'}>
							<S.SettingsOption mode={themeMode || 'dark'}>
								<VSCodeCheckbox
									checked={autoApprovalSettings.enableNotifications}
									onChange={(e) => {
										const checked = (e.target as HTMLInputElement).checked
										updateNotifications(checked)
									}}
									aria-describedby="notifications-description">
									Enable Notifications
								</VSCodeCheckbox>
								<S.CheckboxDescription
									mode={themeMode || 'dark'}
									id="notifications-description"
									$severity={getDescriptionSeverity("enableNotifications")}>
									Receive system notifications when Cline requires approval to proceed or when a task is
									completed.
								</S.CheckboxDescription>
							</S.SettingsOption>
						</S.SettingsOptionsGroup>
					</S.SettingsSection>
				</S.MenuContentInner>
			</S.MenuContent>
		</div>
	)
}

export default AutoApproveMenu
