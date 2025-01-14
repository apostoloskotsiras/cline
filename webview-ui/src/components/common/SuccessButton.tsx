import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { useThemeStyles } from "../../utils/theme"

interface SuccessButtonProps extends React.ComponentProps<typeof VSCodeButton> {}

const SuccessButton: React.FC<SuccessButtonProps> = (props) => {
	const { themeMode, themeType } = useExtensionState()
	const S = useThemeStyles('common/SuccessButton', themeMode || 'dark', themeType || 'modern')

	return <S.StyledButton mode={themeMode || 'dark'} {...props} />
}

export default SuccessButton
