import { VSCodeLink, VSCodeTextArea } from "@vscode/webview-ui-toolkit/react"
import { memo, useEffect, useState } from "react"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { validateApiConfiguration, validateModelId } from "../../utils/validate"
import { vscode } from "../../utils/vscode"
import { useThemeStyles } from "../../utils/theme"
import ApiOptions from "./ApiOptions"

const IS_DEV = false // FIXME: use flags when packaging

type SettingsViewProps = {
	onDone: () => void
}

const SettingsView = ({ onDone }: SettingsViewProps) => {
	const { 
		apiConfiguration, 
		version, 
		customInstructions, 
		setCustomInstructions, 
		openRouterModels, 
		themeMode, 
		themeType,
		setThemeMode,
		setThemeType 
	} = useExtensionState()
	const [apiErrorMessage, setApiErrorMessage] = useState<string | undefined>(undefined)
	const [modelIdErrorMessage, setModelIdErrorMessage] = useState<string | undefined>(undefined)
	const [forceUpdate, setForceUpdate] = useState(0)
	const S = useThemeStyles('settings/SettingsView', themeMode || 'dark', themeType || 'modern')

	const handleThemeModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setThemeMode(e.target.value as 'light' | 'dark')
		setForceUpdate(prev => prev + 1) // Force re-render
	}

	const handleThemeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setThemeType(e.target.value as 'modern' | 'classic')
		setForceUpdate(prev => prev + 1) // Force re-render
	}

	const handleSubmit = () => {
		const apiValidationResult = validateApiConfiguration(apiConfiguration)
		const modelIdValidationResult = validateModelId(apiConfiguration, openRouterModels)

		setApiErrorMessage(apiValidationResult)
		setModelIdErrorMessage(modelIdValidationResult)
		if (!apiValidationResult && !modelIdValidationResult) {
			vscode.postMessage({ type: "apiConfiguration", apiConfiguration })
			vscode.postMessage({
				type: "customInstructions",
				text: customInstructions,
			})
			onDone()
		}
	}

	useEffect(() => {
		setApiErrorMessage(undefined)
		setModelIdErrorMessage(undefined)
	}, [apiConfiguration])

	const handleResetState = () => {
		vscode.postMessage({ type: "resetState" })
	}

	return (
		<div className="settings-wrapper">
			<style>{S?.styles}</style>

			<div className="settings-container">
				<header className="settings-header">
					<div className="settings-title">
						<i className="codicon codicon-settings-gear"></i>
						<span>SETTINGS</span>
					</div>
					<div className="done-button" onClick={handleSubmit}>
						<i className="codicon codicon-check"></i>
						<span>Done</span>
					</div>
				</header>

				<div className="settings-content">
					<div className="settings-section">
						<ApiOptions
							showModelOptions={true}
							apiErrorMessage={apiErrorMessage}
							modelIdErrorMessage={modelIdErrorMessage}
						/>
					</div>

					<div className="settings-section">
						<VSCodeTextArea
							value={customInstructions ?? ""}
							style={{ width: "100%" }}
							rows={4}
							placeholder={
								'e.g. "Run unit tests at the end", "Use TypeScript with async/await", "Speak in Spanish"'
							}
							onInput={(e: any) => setCustomInstructions(e.target?.value ?? "")}>
							<span className="settings-label">Custom Instructions</span>
						</VSCodeTextArea>
						<p className="settings-description">
							These instructions are added to the end of the system prompt sent with every request.
						</p>
					</div>

					<div className="settings-section">
						<span className="settings-label">Theme Settings</span>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<select 
									className="theme-selector"
									value={themeMode || 'dark'}
									onChange={handleThemeModeChange}
									style={{
										padding: '4px 8px',
										borderRadius: '4px',
										border: '1px solid var(--vscode-button-border)',
										background: 'var(--vscode-dropdown-background)',
										color: 'var(--vscode-dropdown-foreground)',
										cursor: 'pointer'
									}}>
									<option value="dark">Dark Mode</option>
									{IS_DEV ? (
										<option value="light">Light Mode</option>
									) : (
										<option value="light" disabled>Light Mode (Coming Soon)</option>
									)}
								</select>
								<i className={`codicon codicon-${themeMode === 'dark' ? 'moon' : 'sun'}`} />
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<select 
									className="theme-selector"
									value={themeType || 'modern'}
									onChange={handleThemeTypeChange}
									style={{
										padding: '4px 8px',
										borderRadius: '4px',
										border: '1px solid var(--vscode-button-border)',
										background: 'var(--vscode-dropdown-background)',
										color: 'var(--vscode-dropdown-foreground)',
										cursor: 'pointer'
									}}>
									<option value="modern">Modern Theme</option>
									{IS_DEV ? (
										<option value="classic">Classic Theme</option>
									) : (
										<option value="classic" disabled>Classic Theme (Coming Soon)</option>
									)}
								</select>
								<i className="codicon codicon-paintcan" />
							</div>
						</div>
						<p className="settings-description">
							Customize the appearance of the Cline interface with different themes and color modes.
						</p>
					</div>

					{IS_DEV && (
						<div className="settings-section">
							<span className="settings-label">Debug</span>
							<button className="done-button" onClick={handleResetState} style={{ marginTop: 8 }}>
								<i className="codicon codicon-debug-restart"></i>
								<span>Reset State</span>
							</button>
							<p className="settings-description">
								This will reset all global state and secret storage in the extension.
							</p>
						</div>
					)}
				</div>

				<div className="settings-footer">
					<p style={{ margin: 0 }}>
						If you have any questions or feedback, feel free to open an issue at{" "}
						<VSCodeLink href="https://github.com/cline/cline" style={{ display: "inline" }}>
							https://github.com/cline/cline
						</VSCodeLink>
					</p>
					<p
						style={{
							fontStyle: "italic",
							margin: "10px 0 0 0",
						}}>
						v{version}
					</p>
				</div>
			</div>
		</div>
	)
}

export default memo(SettingsView)
