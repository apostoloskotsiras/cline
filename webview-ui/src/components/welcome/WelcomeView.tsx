import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import { useEffect, useState } from "react"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { validateApiConfiguration } from "../../utils/validate"
import { vscode } from "../../utils/vscode"
import ApiOptions from "../settings/ApiOptions"
import * as S from "../styles/themes/modern/dark/welcome/WelcomeView.styles"

const WelcomeView = () => {
	const { apiConfiguration } = useExtensionState()
	const [apiErrorMessage, setApiErrorMessage] = useState<string | undefined>(undefined)
	const disableLetsGoButton = apiErrorMessage != null

	const handleSubmit = () => {
		vscode.postMessage({ type: "apiConfiguration", apiConfiguration })
	}

	useEffect(() => {
		setApiErrorMessage(validateApiConfiguration(apiConfiguration))
	}, [apiConfiguration])

	return (
		<S.Container>
			<S.Title>Hi, I'm Cline</S.Title>
			
			<S.Description delay={0.1}>
				I can do all kinds of tasks thanks to the latest breakthroughs in{" "}
				<VSCodeLink
					href="https://www-cdn.anthropic.com/fed9cc193a14b84131812372d8d5857f8f304c52/Model_Card_Claude_3_Addendum.pdf"
					style={{ display: "inline" }}>
					Claude 3.5 Sonnet's agentic coding capabilities
				</VSCodeLink>
				. With access to powerful tools, I can:
			</S.Description>

			<S.FeatureList>
				<S.Feature>Create & edit files seamlessly</S.Feature>
				<S.Feature>Explore complex projects efficiently</S.Feature>
				<S.Feature>Use the browser for research</S.Feature>
				<S.Feature>Execute terminal commands (with your permission)</S.Feature>
				<S.Feature>Leverage MCP to create new tools and extend capabilities</S.Feature>
			</S.FeatureList>

			<S.Highlight>
				To get started, this extension needs an API provider.
			</S.Highlight>

			<S.ButtonContainer>
				<ApiOptions showModelOptions={false} />
				<S.StyledButton>
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
