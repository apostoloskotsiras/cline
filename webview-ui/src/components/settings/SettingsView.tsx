import { VSCodeLink, VSCodeTextArea } from "@vscode/webview-ui-toolkit/react"
import { memo, useEffect, useState } from "react"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { validateApiConfiguration, validateModelId } from "../../utils/validate"
import { vscode } from "../../utils/vscode"
import ApiOptions from "./ApiOptions"
import * as S from "../styles/settings/SettingsView.styles"

const IS_DEV = true // FIXME: use flags when packaging

type SettingsViewProps = {
	onDone: () => void
}

const SettingsView = ({ onDone }: SettingsViewProps) => {
	const { apiConfiguration, version, customInstructions, setCustomInstructions, openRouterModels } = useExtensionState()
	const [apiErrorMessage, setApiErrorMessage] = useState<string | undefined>(undefined)
	const [modelIdErrorMessage, setModelIdErrorMessage] = useState<string | undefined>(undefined)
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
			<style>{S.styles}</style>

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
