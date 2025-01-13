import styled from "styled-components"
import { ThemeMode } from "../../../../../../utils/theme"
import { getThemeColors } from "../../theme"

interface ThemedButtonProps {
	mode: ThemeMode
}

export const AddContextButton = styled.button<{ mode: ThemeMode }>`
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 2px 6px;
	background: transparent;
	border: 1px solid ${({ mode }) => getThemeColors(mode).border};
	border-radius: 3px;
	color: ${({ mode }) => getThemeColors(mode).textPrimary};
	font-size: 11px;
	cursor: pointer;
	transition: all 0.15s ease;
	opacity: 0.7;
	position: absolute;
	left: 7px;
	top: 7px;
	z-index: 10;

	&:hover {
		background: ${({ mode }) => getThemeColors(mode).hover};
		border-color: ${({ mode }) => getThemeColors(mode).active};
		opacity: 1;
	}

	i.codicon {
		font-size: 12px;
		opacity: 0.7;
	}
`

export const ChatTextAreaContainer = styled.div<{ disabled: boolean; hasTagsAbove?: boolean; mode: ThemeMode }>`
	padding: 20px 16px 20px 16px;
	opacity: ${(props) => (props.disabled ? 0.6 : 1)};
	position: relative;
	display: flex;
	transition: all 0.2s ease;
	box-shadow: none;
	border-radius: ${(props) => (props.hasTagsAbove ? "0 0 6px 6px" : "6px")};
	background: ${({ mode }) => `${getThemeColors(mode).background}FA`};
	border: 1px solid ${({ mode }) => getThemeColors(mode).border};
	transform: ${(props) => (props.disabled ? "none" : "translateY(0)")};
	margin-top: ${(props) => (props.hasTagsAbove ? "-1px" : "0")};
	min-height: 56px;

	&:hover {
		background: ${(props) => props.disabled ? getThemeColors(props.mode).background : getThemeColors(props.mode).hover};
		border-color: ${({ mode }) => getThemeColors(mode).active};
	}
`

interface TextContainerProps {
	hasAddContextButton?: boolean
	mode: ThemeMode
}

export const TextContainer = styled.div<TextContainerProps>`
	position: relative;
	width: 100%;
	margin-top: 8px;

	textarea {
		padding: 10px 52px 10px 12px !important;
		min-height: 24px !important;
		color: ${({ mode }) => getThemeColors(mode).textPrimary};
		background: ${({ mode }) => `${getThemeColors(mode).background}FA`};
	}

	.mention-context-textarea-highlight {
		background-color: ${({ mode }) => `${getThemeColors(mode).selected}80`};
		border-radius: 3px;
		box-shadow: 0 0 0 0.5px ${({ mode }) => getThemeColors(mode).selected};
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
	opacity: ${(props) => (props.disabled ? 0.5 : 0.8)};
	cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
	transition: opacity 0.2s ease;
	background: ${({ mode }) => `${getThemeColors(mode).background}FA`};
	border-radius: 3px;

	&:hover {
		opacity: ${(props) => (props.disabled ? 0.5 : 1)};
		background: ${(props) => !props.disabled && getThemeColors(props.mode).hover};
	}

	span {
		font-size: 11px;
		opacity: 0.8;
		font-family: var(--vscode-font-family);
	}
`

export const TagsBox = styled.div<{ mode: ThemeMode }>`
	background: ${({ mode }) => `${getThemeColors(mode).background}FA`};
	border: 1px solid ${({ mode }) => getThemeColors(mode).border};
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
		content: "";
		position: absolute;
		bottom: -1px;
		left: 0;
		right: 0;
		height: 1px;
		background: ${({ mode }) => getThemeColors(mode).border};
	}
`

export const TagsSection = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	align-items: center;
`

export const ThumbnailsSection = styled.div<{ mode: ThemeMode }>`
	margin-left: auto;
	padding-left: 8px;
	border-left: 1px solid ${({ mode }) => getThemeColors(mode).border};
`

export const Tag = styled.div<{ mode: ThemeMode }>`
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 2px 6px;
	background: ${({ mode }) => `${getThemeColors(mode).hover}FA`};
	border-radius: 3px;
	font-size: 11px;
	color: ${({ mode }) => getThemeColors(mode).textPrimary};
	border: 1px solid ${({ mode }) => `${getThemeColors(mode).border}CC`};
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
		background: ${({ mode }) => `${getThemeColors(mode).active}FA`};
		border-color: ${({ mode }) => `${getThemeColors(mode).border}FA`};
	}
`

export const StyledSvg = styled.svg<{ mode: ThemeMode }>`
	color: ${({ mode }) => getThemeColors(mode).textPrimary};
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

export const ActionButton = styled.div<{ disabled: boolean; mode: ThemeMode }>`
	width: 16px;
	height: 16px;
	opacity: ${(props) => (props.disabled ? 0.5 : 1)};
	cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
	transition: all 0.2s ease;

	&:hover {
		transform: ${(props) => (props.disabled ? "none" : "scale(1.1)")};
		opacity: ${(props) => (props.disabled ? 0.5 : 0.8)};
	}
`
