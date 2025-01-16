import styled from "styled-components"
import { ThemeMode } from "../../../../../../utils/theme"
import getThemeColors from "../../theme"

interface Props {
	mode: ThemeMode
}

export const Wrapper = styled.div<Props>`
	position: fixed;
	top: 33px;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background: ${props => getThemeColors(props.mode).chatView.wrapper.background};
	color: var(--vscode-foreground);
	font-family: var(--vscode-font-family);
	font-size: var(--vscode-font-size);
	line-height: 1.5;
`

export const Container = styled.div<Props>`
	height: 100%;
	display: flex;
	flex-direction: column;
	background: transparent;
	position: relative;
`

export const WelcomeHeading = styled.h2<Props>`
	position: relative;
	color: var(--vscode-foreground);
	font-weight: 500;
	letter-spacing: -0.015em;
`

export const StyledButton = styled.button<{ $primary?: boolean; mode: ThemeMode }>`
	background-color: ${props => props.$primary ? 'var(--vscode-button-background)' : 'var(--vscode-button-secondaryBackground)'};
	color: ${props => props.$primary ? 'var(--vscode-button-foreground)' : 'var(--vscode-button-secondaryForeground)'};
	border: 1px solid ${props => props.$primary ? 'var(--vscode-button-border)' : 'var(--vscode-button-secondaryBorder)'};
	border-radius: 2px;
	padding: 4px 12px;
	font-size: var(--vscode-font-size);
	font-family: var(--vscode-font-family);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	min-width: 100px;
	transition: background-color 0.2s ease-out;

	&:hover {
		background-color: ${props => props.$primary ? 'var(--vscode-button-hoverBackground)' : 'var(--vscode-button-secondaryHoverBackground)'};
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	&:active {
		background-color: ${props => props.$primary ? 'var(--vscode-button-background)' : 'var(--vscode-button-secondaryBackground)'};
	}
`

export const ScrollToBottomButton = styled.div`
	background-color: var(--vscode-toolbar-hoverBackground);
	opacity: 0.55;
	border-radius: 2px;
	overflow: hidden;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 1;
	height: 24px;

	&:hover {
		opacity: 0.9;
	}

	&:active {
		opacity: 0.7;
	}
`

export const ScrollableContent = styled.div`
	flex: 1 1 0;
	min-height: 0;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	padding-bottom: 10px;
`

export const WelcomeContent = styled.div`
	padding: 0 20px;
	flex-shrink: 0;
`

export const ButtonContainer = styled.div<{ $visible?: boolean }>`
	opacity: ${({ $visible }) => ($visible ? 1 : 0.5)};
	display: flex;
	padding: ${({ $visible }) => ($visible ? "10px" : "0")} 15px 10px 15px;
`

export const ChatTextAreaContainer = styled.div`
	padding: 16px;
`
