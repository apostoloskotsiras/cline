import { VSCodeLink, VSCodeTextArea } from "@vscode/webview-ui-toolkit/react"
import { memo, useEffect, useState } from "react"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { validateApiConfiguration, validateModelId } from "../../utils/validate"
import { vscode } from "../../utils/vscode"
import { useThemeStyles } from "../../utils/theme"
import ApiOptions from "./ApiOptions"

const IS_DEV = true // FIXME: use flags when packaging

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
		<S.SettingsWrapper mode={themeMode || 'dark'}>
			<S.SettingsContainer mode={themeMode || 'dark'}>
				<S.SettingsHeader mode={themeMode || 'dark'}>
					<S.SettingsTitle mode={themeMode || 'dark'}>
						<i className="codicon codicon-settings-gear"></i>
						<span>SETTINGS</span>
					</S.SettingsTitle>
					<S.DoneButton mode={themeMode || 'dark'} onClick={handleSubmit}>
						<i className="codicon codicon-check"></i>
						<span>Done</span>
					</S.DoneButton>
				</S.SettingsHeader>

				<S.SettingsContent mode={themeMode || 'dark'}>
					<S.SettingsSection mode={themeMode || 'dark'}>
						<ApiOptions
							showModelOptions={true}
							apiErrorMessage={apiErrorMessage}
							modelIdErrorMessage={modelIdErrorMessage}
						/>
					</S.SettingsSection>

					<S.SettingsSection mode={themeMode || 'dark'}>
						<VSCodeTextArea
							value={customInstructions ?? ""}
							style={{ width: "100%" }}
							rows={4}
							placeholder={
								'e.g. "Run unit tests at the end", "Use TypeScript with async/await", "Speak in Spanish"'
							}
							onInput={(e: any) => setCustomInstructions(e.target?.value ?? "")}>
							<S.SettingsLabel mode={themeMode || 'dark'}>Custom Instructions</S.SettingsLabel>
						</VSCodeTextArea>
						<S.SettingsDescription mode={themeMode || 'dark'}>
							These instructions are added to the end of the system prompt sent with every request.
						</S.SettingsDescription>
					</S.SettingsSection>

					<S.SettingsSection mode={themeMode || 'dark'}>
						<S.SettingsLabel mode={themeMode || 'dark'}>Theme Settings</S.SettingsLabel>
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
						<S.SettingsDescription mode={themeMode || 'dark'}>
							Customize the appearance of the Cline interface with different themes and color modes.
						</S.SettingsDescription>
					</S.SettingsSection>

					{IS_DEV && (
						<S.SettingsSection mode={themeMode || 'dark'}>
							<S.SettingsLabel mode={themeMode || 'dark'}>Debug</S.SettingsLabel>
							<S.DoneButton mode={themeMode || 'dark'} onClick={handleResetState} style={{ marginTop: 8 }}>
								<i className="codicon codicon-debug-restart"></i>
								<span>Reset State</span>
							</S.DoneButton>
							<S.SettingsDescription mode={themeMode || 'dark'}>
								This will reset all global state and secret storage in the extension.
							</S.SettingsDescription>
						</S.SettingsSection>
					)}
				</S.SettingsContent>

				<S.SettingsFooter mode={themeMode || 'dark'}>
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
				</S.SettingsFooter>
			</S.SettingsContainer>
		</S.SettingsWrapper>
	)
}

export default memo(SettingsView)
