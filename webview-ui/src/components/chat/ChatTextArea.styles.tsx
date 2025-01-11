import styled from "styled-components"

export const StyledSvg = styled.svg`
	color: var(--vscode-input-foreground);
	transition: opacity 0.2s ease;

	&:hover {
		opacity: 0.8;
	}
`

export const TextContainer = styled.div`
	position: relative;
	width: 100%;
	
	.mention-context-textarea-highlight {
		background-color: color-mix(in srgb, var(--vscode-badge-foreground) 30%, transparent);
		border-radius: 3px;
		box-shadow: 0 0 0 0.5px color-mix(in srgb, var(--vscode-badge-foreground) 30%, transparent);
		color: transparent;
	}

	textarea {
		color: transparent;
		caret-color: var(--vscode-input-foreground);
		background: transparent;
		
		&::selection {
			background-color: var(--vscode-editor-selectionBackground);
			color: transparent;
		}
	}
	
	@keyframes disintegrate {
		0% {
			clip-path: inset(0 0 0 0);
			opacity: 1;
			transform: translateX(0);
		}
		20% {
			clip-path: inset(0 0% 0 0);
			opacity: 0.95;
			transform: translateX(0);
		}
		99.9% {
			clip-path: inset(0 100% 0 0);
			opacity: 0;
			transform: translateX(2px);
			visibility: visible;
		}
		100% {
			clip-path: inset(0 100% 0 0);
			opacity: 0;
			transform: translateX(2px);
			visibility: hidden;
		}
	}

	&.disintegrating {
		animation: disintegrate 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
		transform-origin: right;
	}
`

export const SendSvg = styled(StyledSvg)`
	@keyframes fly {
		0% {
			transform: scale(1) translate(0, 0);
			opacity: 1;
		}
		40% {
			transform: scale(0.8) translate(100%, -100%);
			opacity: 0;
		}
		40.1% {
			transform: scale(0.8) translate(0, 0);
			opacity: 0;
		}
		100% {
			transform: scale(1) translate(0, 0);
			opacity: 1;
		}
	}

	&.flying {
		animation: fly 0.8s ease-in-out forwards;
	}
`

export const ChatTextAreaContainer = styled.div<{ disabled: boolean }>`
	padding: 8px 12px;
	opacity: ${props => props.disabled ? 0.6 : 1};
	position: relative;
	display: flex;
	transition: all 0.2s ease;
	box-shadow: none;
	border-radius: 8px;
	background: ${props => props.disabled 
		? "rgba(30, 30, 30, 0.95)"
		: "rgba(40, 40, 40, 0.4)"};
	backdrop-filter: blur(16px);
	border: ${props => props.disabled
		? "1px solid rgba(255, 255, 255, 0.08)"
		: "1px solid rgba(255, 255, 255, 0.1)"};
	box-shadow: ${props => props.disabled
		? "none"
		: "0 1px 4px rgba(0, 0, 0, 0.1)"};
	transform: ${props => props.disabled ? "none" : "translateY(0)"};

	&:hover {
		background: ${props => props.disabled
			? "rgba(30, 30, 30, 0.95)"
			: "rgba(45, 45, 45, 0.5)"};
		border-color: ${props => props.disabled
			? "rgba(255, 255, 255, 0.08)"
			: "rgba(255, 255, 255, 0.15)"};
		transform: ${props => props.disabled ? "none" : "translateY(-1px)"};
		box-shadow: ${props => props.disabled
			? "none"
			: "0 2px 8px rgba(0, 0, 0, 0.15)"};
	}
`

export const ActionButton = styled.div<{ disabled: boolean }>`
	width: 16px;
	height: 16px;
	opacity: ${props => props.disabled ? 0.5 : 1};
	cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
	transition: all 0.2s ease;

	&:hover {
		transform: ${props => props.disabled ? "none" : "scale(1.1)"};
		opacity: ${props => props.disabled ? 0.5 : 0.8};
	}
` 