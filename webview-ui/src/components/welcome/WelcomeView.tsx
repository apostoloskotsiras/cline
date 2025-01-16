import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import { useEffect, useState } from "react"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { validateApiConfiguration } from "../../utils/validate"
import { vscode } from "../../utils/vscode"
import ApiOptions from "../settings/ApiOptions"
import { useThemeStyles } from "../../utils/theme"

const WelcomeView = () => {
	const { apiConfiguration, themeMode, themeType } = useExtensionState()
	const S = useThemeStyles('welcome/WelcomeView', themeMode || 'dark', themeType || 'modern')
	const [apiErrorMessage, setApiErrorMessage] = useState<string | undefined>(undefined)
	const disableLetsGoButton = apiErrorMessage != null

	const handleSubmit = () => {
		vscode.postMessage({ type: "apiConfiguration", apiConfiguration })
	}

	useEffect(() => {
		setApiErrorMessage(validateApiConfiguration(apiConfiguration))
	}, [apiConfiguration])

	return (
		<S.Container mode={themeMode || 'dark'}>
			<S.Title mode={themeMode || 'dark'}>Hi, I'm Cline</S.Title>
			
			<S.Description mode={themeMode || 'dark'} delay={0.1}>
				I can do all kinds of tasks thanks to the latest breakthroughs in{" "}
				<VSCodeLink
					href="https://www-cdn.anthropic.com/fed9cc193a14b84131812372d8d5857f8f304c52/Model_Card_Claude_3_Addendum.pdf"
					style={{ display: "inline" }}>
					Claude 3.5 Sonnet's agentic coding capabilities
				</VSCodeLink>
				. With access to powerful tools, I can:
			</S.Description>

			<S.FeatureList mode={themeMode || 'dark'}>
				<S.Feature mode={themeMode || 'dark'}>Create & edit files seamlessly</S.Feature>
				<S.Feature mode={themeMode || 'dark'}>Explore complex projects efficiently</S.Feature>
				<S.Feature mode={themeMode || 'dark'}>Use the browser for research</S.Feature>
				<S.Feature mode={themeMode || 'dark'}>Execute terminal commands (with your permission)</S.Feature>
				<S.Feature mode={themeMode || 'dark'}>Leverage MCP to create new tools and extend capabilities</S.Feature>
			</S.FeatureList>

			<S.Highlight mode={themeMode || 'dark'}>
				To get started, Cline needs an API provider.
			</S.Highlight>

			<S.ButtonContainer mode={themeMode || 'dark'}>
				<ApiOptions showModelOptions={false} />
				<S.StyledButton mode={themeMode || 'dark'}>
					<VSCodeButton 
						onClick={handleSubmit} 
						disabled={disableLetsGoButton}
					>
						Let's go!
					</VSCodeButton>
				</S.StyledButton>
			</S.ButtonContainer>
		</S.Container>
	)
}

export default WelcomeView
