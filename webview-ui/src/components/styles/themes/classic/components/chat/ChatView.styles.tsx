import styled from "styled-components"
import { ThemeMode } from "../../../../../../utils/theme"
import { getThemeColors } from "../../theme"

interface Props {
	mode: ThemeMode
}

export const Wrapper = styled.div<Props>`
	position: fixed;
	top: 33px;
	left: 0;
	right: 0;
	bottom: 0;
	background: ${({ mode }) => getThemeColors(mode).chatView.wrapper.background};
	color: ${({ mode }) => getThemeColors(mode).textPrimary};
	font-family: var(--vscode-font-family);
	font-size: var(--vscode-font-size);
	line-height: 1.5;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	backdrop-filter: ${({ mode }) => getThemeColors(mode).chatView.wrapper.backdropBlur};

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: ${({ mode }) => getThemeColors(mode).chatView.wrapper.radialGlow};
		pointer-events: none;
	}
`

export const Container = styled.div<Props>`
	height: 100%;
	display: flex;
	flex-direction: column;
	background: ${({ mode }) => getThemeColors(mode).chatView.container.background};
	backdrop-filter: ${({ mode }) => getThemeColors(mode).chatView.container.backdropBlur};
	position: relative;
	border-radius: 12px;
	margin: 12px;
	box-shadow: ${({ mode }) => getThemeColors(mode).chatView.container.shadow};
	border: 1px solid ${({ mode }) => getThemeColors(mode).chatView.container.border};

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: ${({ mode }) => getThemeColors(mode).chatView.container.topGradient};
	}
`

export const WelcomeHeading = styled.h2<Props>`
	position: relative;
	color: ${({ mode }) => getThemeColors(mode).textPrimary};
	font-weight: 500;
	letter-spacing: -0.015em;
	text-shadow: 0 2px 4px ${({ mode }) => `${getThemeColors(mode).border}33`};
`

export const StyledButton = styled.button<{ $primary?: boolean; mode: ThemeMode }>`
	background: ${({ $primary, mode }) =>
		$primary
			? getThemeColors(mode).chatView.button.primaryBackground
			: getThemeColors(mode).chatView.button.secondaryBackground};
	backdrop-filter: ${({ mode }) => getThemeColors(mode).chatView.container.backdropBlur};
	border-radius: 8px;
	border: 1px solid ${({ $primary, mode }) => getThemeColors(mode).chatView.button.border};
	color: ${({ $primary, mode }) => ($primary ? getThemeColors(mode).textPrimary : `${getThemeColors(mode).textPrimary}E6`)};
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
				? getThemeColors(mode).chatView.button.primaryHover
				: getThemeColors(mode).chatView.button.secondaryHover};
		transform: translateY(-1px);
		box-shadow: ${({ $primary, mode }) => 
			$primary 
				? getThemeColors(mode).chatView.button.hoverShadow 
				: getThemeColors(mode).chatView.button.shadow};
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

export const ScrollToBottomButton = styled.div<Props>`
	background: ${({ mode }) => getThemeColors(mode).chatView.scrollToTop.background};
	backdrop-filter: ${({ mode }) => getThemeColors(mode).chatView.container.backdropBlur};
	border-radius: 12px;
	padding: 8px;
	cursor: pointer;
	border: 1px solid ${({ mode }) => getThemeColors(mode).chatView.scrollToTop.border};
	box-shadow: ${({ mode }) => getThemeColors(mode).chatView.scrollToTop.shadow};
	transition: all 0.2s ease;

	&:hover {
		background: ${({ mode }) => getThemeColors(mode).chatView.scrollToTop.hover};
		transform: translateY(-2px);
		box-shadow: ${({ mode }) => getThemeColors(mode).chatView.scrollToTop.hoverShadow};
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
