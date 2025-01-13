import styled from "styled-components"
import { ThemeMode } from "../../../../../../utils/theme"
import { getThemeColors } from "../../theme"

export const Wrapper = styled.div<{ mode: ThemeMode }>`
	position: fixed;
	top: 33px;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(145deg, 
		${({ mode }) => `${getThemeColors(mode).background}FA`} 0%, 
		${({ mode }) => `${getThemeColors(mode).background}FA`} 100%
	);
	color: ${({ mode }) => getThemeColors(mode).textPrimary};
	font-family: var(--vscode-font-family);
	font-size: var(--vscode-font-size);
	line-height: 1.5;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	backdrop-filter: blur(12px);

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(
			circle at 50% 0%, 
			${({ mode }) => `${getThemeColors(mode).primary}14`} 0%, 
			${({ mode }) => `${getThemeColors(mode).primary}0D`} 25%, 
			transparent 50%
		);
		pointer-events: none;
	}
`

export const Container = styled.div<{ mode: ThemeMode }>`
	height: 100%;
	display: flex;
	flex-direction: column;
	background: ${({ mode }) => `${getThemeColors(mode).secondary}D9`};
	backdrop-filter: blur(16px);
	position: relative;
	border-radius: 12px;
	margin: 12px;
	box-shadow:
		0 4px 6px rgba(0, 0, 0, 0.1),
		0 1px 3px rgba(0, 0, 0, 0.08);
	border: 1px solid ${({ mode }) => `${getThemeColors(mode).border}14`};

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(
			90deg, 
			transparent 0%, 
			${({ mode }) => `${getThemeColors(mode).primary}1A`} 50%, 
			transparent 100%
		);
	}
`

export const WelcomeHeading = styled.h2<{ mode: ThemeMode }>`
	position: relative;
	color: ${({ mode }) => getThemeColors(mode).textPrimary};
	font-weight: 500;
	letter-spacing: -0.015em;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`

export const StyledButton = styled.button<{ $primary?: boolean; mode: ThemeMode }>`
	background: ${({ $primary, mode }) =>
		$primary
			? `linear-gradient(145deg, ${getThemeColors(mode).primary}E6 0%, ${getThemeColors(mode).primary}D9 100%)`
			: `linear-gradient(145deg, ${getThemeColors(mode).secondary}F2 0%, ${getThemeColors(mode).secondary}F2 100%)`};
	backdrop-filter: blur(16px);
	border-radius: 8px;
	border: 1px solid ${({ $primary, mode }) => 
		$primary ? `${getThemeColors(mode).primary}33` : `${getThemeColors(mode).border}14`};
	color: ${({ $primary, mode }) => 
		$primary ? getThemeColors(mode).textPrimary : `${getThemeColors(mode).textPrimary}E6`};
	padding: 8px 16px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	min-width: 100px;

	&:hover {
		background: ${({ $primary, mode }) =>
			$primary
				? `linear-gradient(145deg, ${getThemeColors(mode).primary} 0%, ${getThemeColors(mode).primary}F2 100%)`
				: `linear-gradient(145deg, ${getThemeColors(mode).secondary}FA 0%, ${getThemeColors(mode).secondary}FA 100%)`};
		transform: translateY(-1px);
		box-shadow: ${({ $primary, mode }) => 
			$primary 
				? `0 6px 20px ${getThemeColors(mode).primary}40` 
				: "0 6px 12px rgba(0, 0, 0, 0.15)"};
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	&:active {
		transform: translateY(0);
	}
`

export const ScrollToBottomButton = styled.div<{ mode: ThemeMode }>`
	background: ${({ mode }) => `${getThemeColors(mode).secondary}F2`};
	backdrop-filter: blur(8px);
	border-radius: 12px;
	padding: 8px;
	cursor: pointer;
	border: 1px solid ${({ mode }) => `${getThemeColors(mode).border}1A`};
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
	transition: all 0.2s ease;

	&:hover {
		background: ${({ mode }) => `${getThemeColors(mode).secondary}FA`};
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
	}

	.codicon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: ${({ mode }) => `${getThemeColors(mode).textPrimary}E6`};
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
