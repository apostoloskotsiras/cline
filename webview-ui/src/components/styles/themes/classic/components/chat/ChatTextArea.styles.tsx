import styled from "styled-components"
import { ThemeMode } from "../../../../../../utils/theme"
import getThemeColors from "../../theme"

interface Props {
	mode: ThemeMode
}

export const AddContextButton = styled.button<Props>`
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 2px 6px;
	background: transparent;
	border: 1px solid ${props => getThemeColors(props.mode).chatTextArea.tagBorder};
	border-radius: 2px;
	color: ${props => getThemeColors(props.mode).textPrimary};
	font-size: 11px;
	cursor: pointer;
	transition: background-color 0.2s ease-out;
	opacity: 0.7;
	position: absolute;
	left: 7px;
	top: 7px;
	z-index: 10;

	&:hover {
		background: ${props => getThemeColors(props.mode).chatTextArea.buttonHover};
		opacity: 1;
	}

	i.codicon {
		font-size: 12px;
		opacity: 0.7;
	}
`

export const ChatTextAreaContainer = styled.div<{ disabled: boolean; hasTagsAbove?: boolean; mode: ThemeMode }>`
	padding: 20px 16px;
	opacity: ${props => props.disabled ? 0.6 : 1};
	position: relative;
	display: flex;
	transition: opacity 0.2s ease-out;
	background: ${props => getThemeColors(props.mode).chatTextArea.containerBackground};
	border-radius: ${props => props.hasTagsAbove ? "0 0 2px 2px" : "2px"};
	border: 1px solid ${props => getThemeColors(props.mode).border};
	margin-top: ${props => props.hasTagsAbove ? "-1px" : "0"};
	min-height: 56px;

	&:hover:not(:disabled) {
		background: ${props => getThemeColors(props.mode).chatTextArea.containerHover};
		border-color: ${props => getThemeColors(props.mode).primary};
	}
`

export const TextContainer = styled.div<{ hasAddContextButton?: boolean; mode: ThemeMode }>`
	position: relative;
	width: 100%;
	margin-top: 8px;

	textarea {
		padding: 10px 52px 10px 12px !important;
		min-height: 24px !important;
		background: ${props => getThemeColors(props.mode).chatTextArea.textAreaBackground};
	}

	.mention-context-textarea-highlight {
		background-color: ${props => getThemeColors(props.mode).chatTextArea.mentionHighlight};
		border-radius: 2px;
		box-shadow: 0 0 0 0.5px ${props => getThemeColors(props.mode).border};
		color: transparent;
	}
`

export const BottomControls = styled.div`
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: calc(100% - 32px);
	bottom: 6px;
	left: 15px;
	z-index: 3;
`

export const PhotoButton = styled.div<{ disabled: boolean; mode: ThemeMode }>`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 3px;
	opacity: ${props => props.disabled ? 0.5 : 0.8};
	cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
	transition: opacity 0.2s ease-out;
	padding: 2px 4px;
	border-radius: 2px;
	background: ${props => getThemeColors(props.mode).chatTextArea.buttonBackground};

	&:hover:not(:disabled) {
		background: ${props => getThemeColors(props.mode).chatTextArea.buttonHover};
		opacity: 1;
	}

	span {
		font-size: 11px;
		opacity: 0.8;
		font-family: var(--vscode-font-family);
	}
`

export const TagsBox = styled.div<Props>`
	background: ${props => getThemeColors(props.mode).chatTextArea.containerBackground};
	border: 1px solid ${props => getThemeColors(props.mode).border};
	border-bottom: none;
	border-radius: 2px 2px 0 0;
	margin: 0;
	padding: 4px 8px;
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	min-height: 28px;
	position: relative;
	align-items: center;

	&:after {
		content: "";
		position: absolute;
		bottom: -1px;
		left: 0;
		right: 0;
		height: 1px;
		background: ${props => getThemeColors(props.mode).border};
	}
`

export const TagsSection = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	align-items: center;
`

export const ThumbnailsSection = styled.div<Props>`
	margin-left: auto;
	padding-left: 8px;
	border-left: 1px solid ${props => getThemeColors(props.mode).border};
`

export const Tag = styled.div<Props>`
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 2px 6px;
	background: ${props => getThemeColors(props.mode).chatTextArea.tagBackground};
	border-radius: 2px;
	font-size: 11px;
	color: ${props => getThemeColors(props.mode).textPrimary};
	border: 1px solid ${props => getThemeColors(props.mode).chatTextArea.tagBorder};
	transition: background-color 0.2s ease-out;

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
		background: ${props => getThemeColors(props.mode).chatTextArea.tagHover};
	}
`

export const StyledSvg = styled.svg<Props>`
	color: ${props => getThemeColors(props.mode).textPrimary};
	transition: opacity 0.2s ease-out;

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

export const ActionButton = styled.div<{ disabled: boolean; mode: ThemeMode }>`
	width: 16px;
	height: 16px;
	opacity: ${props => props.disabled ? 0.5 : 1};
	cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
	transition: opacity 0.2s ease-out;
	padding: 2px;
	border-radius: 2px;
	background: ${props => getThemeColors(props.mode).chatTextArea.buttonBackground};

	&:hover:not(:disabled) {
		background: ${props => getThemeColors(props.mode).chatTextArea.buttonHover};
		opacity: 0.8;
	}
`
