import styled from "styled-components"

export const Controls = styled.div`
	position: absolute;
	top: 8px;
	right: 8px;
	display: flex;
	align-items: center;
	z-index: 10;
`

export const ButtonGroup = styled.div<{ $expanded: boolean }>`
	display: flex;
	align-items: center;
	border-radius: 4px;
	overflow: hidden;
`

export const ActionButton = styled.div<{ $isMain?: boolean; $expanded?: boolean }>`
	width: 26px;
	height: 26px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	position: relative;
	background: transparent;
	transition: all 0.15s ease-out;

	i {
		font-size: 14px;
		color: var(--vscode-descriptionForeground);
		opacity: 0.8;
		transition: all 0.15s ease-out;
	}

	&:hover {
		background: var(--vscode-toolbar-hoverBackground);
		i {
			color: var(--vscode-foreground);
			opacity: 1;
		}

		i.codicon-diff {
			animation: glow 0.4s ease-out;
		}

		i.codicon-refresh {
			animation: rotate360 0.7s ease-out;
		}
	}

	${(props) =>
		props.$expanded &&
		`
		i.codicon-history {
			animation: rotateBack 0.8s ease-out;
		}
	`}

	${(props) =>
		!props.$expanded &&
		props.$isMain &&
		`
		&.was-expanded i.codicon-history {
			animation: rotate360 0.8s ease-out;
		}
	`}

	&[data-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	@keyframes rotate360 {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes rotateBack {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(-360deg);
		}
	}

	@keyframes glow {
		0% {
			filter: brightness(1);
		}
		50% {
			filter: brightness(1.3);
		}
		100% {
			filter: brightness(1);
		}
	}
`

export const ExpandingOptions = styled.div<{ $expanded: boolean }>`
	display: flex;
	width: ${(props) => (props.$expanded ? "52px" : "0")};
	overflow: hidden;
	transition: all 0.2s ease-out;
`

export const Menu = styled.div<{ $top: number; $right: number }>`
	position: fixed;
	top: ${(props) => props.$top}px;
	right: ${(props) => props.$right}px;
	background: var(--vscode-menu-background);
	border: 1px solid var(--vscode-widget-border);
	border-radius: 6px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
	min-width: 280px;
	overflow: hidden;
	z-index: 999999;
`

export const MenuItem = styled.div<{ $disabled?: boolean }>`
	padding: 8px 12px;
	cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
	display: flex;
	flex-direction: column;
	gap: 4px;
	transition: all 0.1s ease-out;

	&:not(:last-child) {
		border-bottom: 1px solid var(--vscode-widget-border);
	}

	&:hover {
		background: ${(props) => (props.$disabled ? "none" : "var(--vscode-list-hoverBackground)")};
	}

	${(props) =>
		props.$disabled &&
		`
		opacity: 0.5;
		pointer-events: none;
	`}
`

export const MenuItemTitle = styled.div`
	font-size: 13px;
	color: var(--vscode-foreground);
	display: flex;
	align-items: center;
	gap: 8px;

	i {
		font-size: 14px;
		transition: transform 0.2s ease-out;
	}

	&:hover {
		i.codicon-refresh {
			animation: rotate360 0.7s ease-out;
		}
		i.codicon-comment-discussion {
			animation: bounce 0.5s ease-out;
		}
		i.codicon-files {
			animation: shake 0.5s ease-out;
		}
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3px);
		}
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-2px);
		}
		75% {
			transform: translateX(2px);
		}
	}
`

export const MenuItemDescription = styled.div`
	font-size: 11px;
	color: var(--vscode-descriptionForeground);
	opacity: 0.8;
` 