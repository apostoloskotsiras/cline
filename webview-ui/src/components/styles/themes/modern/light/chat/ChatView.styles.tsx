import styled from "styled-components"

export const Wrapper = styled.div`
	position: fixed;
	top: 33px;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%);
	color: var(--vscode-editor-foreground);
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
		background: radial-gradient(circle at 50% 0%, rgba(103, 58, 183, 0.08) 0%, rgba(81, 45, 168, 0.05) 25%, transparent 50%);
		pointer-events: none;
	}
`

export const Container = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	background: rgba(20, 20, 20, 0.85);
	backdrop-filter: blur(16px);
	position: relative;
	border-radius: 12px;
	margin: 12px;
	box-shadow:
		0 4px 6px rgba(0, 0, 0, 0.1),
		0 1px 3px rgba(0, 0, 0, 0.08);
	border: 1px solid rgba(255, 255, 255, 0.08);

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent 0%, rgba(103, 58, 183, 0.1) 50%, transparent 100%);
	}
`

export const WelcomeHeading = styled.h2`
	position: relative;
	color: #e0e0e0;
	font-weight: 500;
	letter-spacing: -0.015em;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`

export const StyledButton = styled.button<{ $primary?: boolean }>`
	background: ${({ $primary }) =>
		$primary
			? "linear-gradient(145deg, rgba(103, 58, 183, 0.9) 0%, rgba(81, 45, 168, 0.85) 100%)"
			: "linear-gradient(145deg, rgba(30, 30, 30, 0.95) 0%, rgba(25, 25, 25, 0.95) 100%)"};
	backdrop-filter: blur(16px);
	border-radius: 8px;
	border: 1px solid ${({ $primary }) => ($primary ? "rgba(103, 58, 183, 0.2)" : "rgba(255, 255, 255, 0.08)")};
	color: ${({ $primary }) => ($primary ? "#fff" : "rgba(255, 255, 255, 0.9)")};
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
		background: ${({ $primary }) =>
			$primary
				? "linear-gradient(145deg, rgba(103, 58, 183, 1) 0%, rgba(81, 45, 168, 0.95) 100%)"
				: "linear-gradient(145deg, rgba(35, 35, 35, 0.98) 0%, rgba(30, 30, 30, 0.98) 100%)"};
		transform: translateY(-1px);
		box-shadow: ${({ $primary }) => ($primary ? "0 6px 20px rgba(103, 58, 183, 0.25)" : "0 6px 12px rgba(0, 0, 0, 0.15)")};
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

export const ScrollToBottomButton = styled.div`
	background: rgba(30, 30, 30, 0.95);
	backdrop-filter: blur(8px);
	border-radius: 12px;
	padding: 8px;
	cursor: pointer;
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
	transition: all 0.2s ease;

	&:hover {
		background: rgba(40, 40, 40, 0.95);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
	}

	.codicon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.9);
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
