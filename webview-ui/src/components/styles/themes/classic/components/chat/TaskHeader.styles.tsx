import styled from "styled-components"
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { ThemeMode } from '../../../../../../utils/theme'
import getThemeColors from '../../theme'

interface Props {
	mode: ThemeMode
}

interface TextProps {
	isExpanded: boolean
}

export const Container = styled.div<Props>`
	padding: 10px 13px 10px 13px;
`

export const Content = styled.div<Props>`
	background-color: ${props => getThemeColors(props.mode).badge.background};
	color: ${props => getThemeColors(props.mode).badge.foreground};
	border-radius: 3px;
	padding: 9px 10px 9px 14px;
	display: flex;
	flex-direction: column;
	gap: 6px;
	position: relative;
	z-index: 1;
`

export const TopSection = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const Title = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	margin-left: -2px;
	user-select: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	flex-grow: 1;
	min-width: 0;
`

export const TitleIcon = styled.div`
	display: flex;
	align-items: center;
	flex-shrink: 0;
`

export const TitleText = styled.div`
	margin-left: 6px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	flex-grow: 1;
	min-width: 0;
`

export const CostBadge = styled.div<Props>`
	margin-left: 10px;
	background-color: color-mix(in srgb, ${props => getThemeColors(props.mode).badge.foreground} 70%, transparent);
	color: ${props => getThemeColors(props.mode).badge.background};
	padding: 2px 4px;
	border-radius: 500px;
	font-size: 11px;
	font-weight: 500;
	display: inline-block;
	flex-shrink: 0;
`

export const TextContainer = styled.div<{ isExpanded: boolean }>`
	margin-top: -2px;
	font-size: var(--vscode-font-size);
	overflow-y: ${props => props.isExpanded ? "auto" : "hidden"};
	word-break: break-word;
	overflow-wrap: anywhere;
	position: relative;
`

export const TextContent = styled.div<TextProps>`
	display: -webkit-box;
	-webkit-line-clamp: ${props => props.isExpanded ? "unset" : 3};
	-webkit-box-orient: vertical;
	overflow: hidden;
	white-space: pre-wrap;
	word-break: break-word;
	overflow-wrap: anywhere;
`

export const SeeMoreContainer = styled.div<Props>`
	position: absolute;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
`

export const SeeMoreGradient = styled.div<Props>`
	width: 30px;
	height: 1.2em;
	background: linear-gradient(to right, transparent, ${props => getThemeColors(props.mode).badge.background});
`

export const SeeMoreButton = styled.div<Props>`
	cursor: pointer;
	color: ${props => getThemeColors(props.mode).primary};
	padding-right: 0;
	padding-left: 3px;
	background-color: ${props => getThemeColors(props.mode).badge.background};
`

export const SeeLessButton = styled.div<Props>`
	cursor: pointer;
	color: ${props => getThemeColors(props.mode).primary};
	margin-left: auto;
	text-align: right;
	padding-right: 2px;
`

export const MetricsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`

export const MetricsRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const MetricsLabel = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	flex-wrap: wrap;
`

export const MetricsValue = styled.span`
	display: flex;
	align-items: center;
	gap: 3px;
`

export const ErrorMessage = styled.div<Props>`
	display: flex;
	align-items: center;
	gap: 8px;
	color: ${props => getThemeColors(props.mode).error};
	font-size: 11px;
`

export const StyledDeleteButton = styled(VSCodeButton)`
	padding: 0px 0px;
`

export const DeleteButtonContent = styled.div`
	display: flex;
	align-items: center;
	gap: 3px;
	font-size: 10px;
	font-weight: bold;
	opacity: 0.6;
`
