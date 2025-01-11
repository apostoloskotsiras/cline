import styled from "styled-components"

export const AddContextButton = styled.button`
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 2px 6px;
	background: transparent;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 3px;
	color: var(--vscode-foreground);
	font-size: 11px;
	cursor: pointer;
	transition: all 0.15s ease;
	opacity: 0.7;
	position: absolute;
	left: 7px;
	top: 7px;
	z-index: 10;

	&:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.15);
		opacity: 1;
	}

	i.codicon {
		font-size: 12px;
		opacity: 0.7;
	}
`;

export const ChatTextAreaContainer = styled.div<{ disabled: boolean; hasTagsAbove?: boolean }>`
	padding: 20px 16px 20px 16px;
	opacity: ${props => props.disabled ? 0.6 : 1};
	position: relative;
	display: flex;
	transition: all 0.2s ease;
	box-shadow: none;
	border-radius: ${props => props.hasTagsAbove ? '0 0 6px 6px' : '6px'};
	background: rgb(30, 30, 30);
	border: 1px solid rgba(255, 255, 255, 0.1);
	transform: ${props => props.disabled ? "none" : "translateY(0)"};
	margin-top: ${props => props.hasTagsAbove ? '-1px' : '0'};
	min-height: 56px;

	&:hover {
		background: ${props => props.disabled
			? "rgb(30, 30, 30)"
			: "rgb(35, 35, 35)"};
		border-color: rgba(255, 255, 255, 0.15);
	}
`;

interface TextContainerProps {
	hasAddContextButton?: boolean;
}

export const TextContainer = styled.div<TextContainerProps>`
	position: relative;
	width: 100%;
	margin-top: 8px;
	
	textarea {
		padding: 10px 52px 10px 12px !important;
		min-height: 24px !important;
	}
	
	.mention-context-textarea-highlight {
		background-color: color-mix(in srgb, var(--vscode-badge-foreground) 30%, transparent);
		border-radius: 3px;
		box-shadow: 0 0 0 0.5px color-mix(in srgb, var(--vscode-badge-foreground) 30%, transparent);
		color: transparent;
	}
`;

export const BottomControls = styled.div`
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: calc(100% - 32px);
	bottom: 6px;
	left: 15px;
	z-index: 3;
`;

export const PhotoButton = styled.div<{ disabled: boolean }>`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 3px;
	opacity: ${props => props.disabled ? 0.5 : 0.8};
	cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
	transition: opacity 0.2s ease;
	background: rgb(30, 30, 30);
	border-radius: 3px;

	&:hover {
		opacity: ${props => props.disabled ? 0.5 : 1};
	}

	span {
		font-size: 11px;
		opacity: 0.8;
		font-family: var(--vscode-font-family);
	}
`;

export const TagsBox = styled.div`
	background: rgb(30, 30, 30);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-bottom: none;
	border-radius: 6px 6px 0 0;
	margin: 0;
	padding: 4px 8px;
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	min-height: 28px;
	position: relative;
	align-items: center;

	&:after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 0;
		right: 0;
		height: 1px;
		background: rgba(255, 255, 255, 0.1);
	}
`;

export const TagsSection = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	align-items: center;
`;

export const ThumbnailsSection = styled.div`
	margin-left: auto;
	padding-left: 8px;
	border-left: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Tag = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 2px 6px;
	background: rgba(255, 255, 255, 0.04);
	border-radius: 3px;
	font-size: 11px;
	color: var(--vscode-foreground);
	border: 1px solid rgba(255, 255, 255, 0.08);
	transition: all 0.15s ease;

	i.codicon {
		font-size: 12px;
		opacity: 0.7;
	}

	.remove-tag {
		display: inline-flex;
		align-items: center;
		cursor: pointer;
		opacity: 0.5;
		margin-left: 2px;
		padding: 2px;

		&:hover {
			opacity: 0.9;
		}

		i.codicon {
			font-size: 11px;
		}
	}

	&:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.12);
	}
`;

export const StyledSvg = styled.svg`
	color: var(--vscode-input-foreground);
	transition: opacity 0.2s ease;

	&:hover {
		opacity: 0.8;
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