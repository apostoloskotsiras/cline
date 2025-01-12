import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import * as S from "../styles/common/SuccessButton.styles"

interface SuccessButtonProps extends React.ComponentProps<typeof VSCodeButton> {}

const SuccessButton: React.FC<SuccessButtonProps> = (props) => {
	return <S.StyledButton {...props} />
}

export default SuccessButton
