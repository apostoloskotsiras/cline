import styled from 'styled-components'
import { ThemeMode } from '../../../../../../utils/theme'
import getThemeColors from '../../theme'

interface Props {
	mode: ThemeMode
}

export const MenuWrapper = styled.div<{ $expanded?: boolean } & Props>`
	padding: 0;
	user-select: none;
	border-top: ${props => props.$expanded ? `1px solid ${getThemeColors(props.mode).border}` : 'none'};
	overflow-y: auto;
`

export const MenuHeader = styled.div<{ $expanded?: boolean; $hasEnabledActions?: boolean } & Props>`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 10px 12px;
	margin: 10px 16px 10px 16px;
	cursor: ${props => !props.$hasEnabledActions ? "pointer" : "default"};
	background: ${props => getThemeColors(props.mode).background};
	border: 1px solid ${props => getThemeColors(props.mode).border};
	border-radius: 2px;
	position: relative;

	&:hover {
		background: ${props => getThemeColors(props.mode).hover};
	}
`

export const CheckboxContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	width: 100%;
`

export const LabelText = styled.span<Props>`
	color: ${props => getThemeColors(props.mode).foreground};
	font-size: 13px;
	font-weight: 500;
	white-space: nowrap;
`

export const TagContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	flex-wrap: nowrap;
	overflow-x: hidden;
`

export const CollapsibleSection = styled.div<{ $isHovered?: boolean } & Props>`
	display: flex;
	align-items: center;
	gap: 4px;
	color: ${props => props.$isHovered ? getThemeColors(props.mode).foreground : getThemeColors(props.mode).textSecondary};
	flex: 1;
	min-width: 0;
	cursor: pointer;

	&:hover {
		color: ${props => getThemeColors(props.mode).foreground};
	}
`

export const MenuContent = styled.div<{ $expanded?: boolean } & Props>`
	overflow: hidden;
	opacity: ${props => props.$expanded ? 1 : 0};
	max-height: ${props => props.$expanded ? "500px" : "0"};
	transform: translateY(${props => props.$expanded ? "0" : "-5px"});
	transition: all 0.15s ease;
	background: ${props => getThemeColors(props.mode).background};
	border: 1px solid ${props => getThemeColors(props.mode).border};
	border-radius: 2px;
	margin: 10px 16px 5px 16px;
`

export const MenuContentInner = styled.div<Props>`
	padding: 16px;
	max-height: 450px;
	overflow-y: auto;
	background: ${props => getThemeColors(props.mode).background};
	border-radius: 2px;
	margin: 0;
`

export const SectionHeader = styled.div<Props>`
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 16px;
	padding: 12px;
	background: ${props => getThemeColors(props.mode).background};
	border-radius: 2px;
	border: 1px solid ${props => getThemeColors(props.mode).border};
	position: relative;

	h3 {
		margin: 0;
		font-size: 13px;
		font-weight: 600;
		color: ${props => getThemeColors(props.mode).foreground};
		letter-spacing: 0.3px;
		flex: 1;
	}

	.codicon {
		color: ${props => getThemeColors(props.mode).primary};
		font-size: 16px;
		opacity: 0.9;
	}
`

export const SectionBadge = styled.span<Props>`
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${props => getThemeColors(props.mode).badge.background};
	color: ${props => getThemeColors(props.mode).badge.foreground};
	min-width: 20px;
	height: 20px;
	padding: 0 6px;
	border-radius: 10px;
	font-size: 11px;
	font-weight: 500;
`

export const SettingsOptionsGroup = styled.div`
	padding: 0 8px;
`

export const SettingsOption = styled.div<Props>`
	position: relative;
	padding: 12px;
	border-radius: 2px;
	background: ${props => getThemeColors(props.mode).background};
	border: 1px solid ${props => getThemeColors(props.mode).border};
	margin-bottom: 8px;

	&:last-child {
		margin-bottom: 0;
	}

	&:focus-within {
		outline: 1px solid ${props => getThemeColors(props.mode).primary};
		outline-offset: -1px;
	}
`

export const CheckboxDescription = styled.div<{ $severity?: "critical" | "warning" | "info" } & Props>`
	margin: 6px 0 0 24px;
	padding: 8px 12px 8px 36px;
	color: ${props => getThemeColors(props.mode).textSecondary};
	font-size: 12px;
	line-height: 1.5;
	background: ${props => getThemeColors(props.mode).background};
	border-radius: 2px;
	position: relative;
	min-height: 32px;
	display: flex;
	align-items: flex-start;
	border-left: 2px solid
		${props => {
			switch (props.$severity) {
				case "critical":
					return getThemeColors(props.mode).error
				case "warning":
					return getThemeColors(props.mode).warning
				case "info":
				default:
					return getThemeColors(props.mode).info
			}
		}};

	&::before {
		content: "";
		position: absolute;
		left: 10px;
		top: 8px;
		min-width: 16px;
		width: 16px;
		height: 16px;
		background-position: center;
		background-repeat: no-repeat;
		background-size: contain;
		opacity: 0.9;
		pointer-events: none;
		flex-shrink: 0;
		background-image: ${props => {
			switch (props.$severity) {
				case "critical":
					return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23f48771'%3E%3Cpath d='M8 1a7 7 0 100 14A7 7 0 008 1zm0 1.167a5.833 5.833 0 110 11.666A5.833 5.833 0 018 2.167zM7.417 4.5v3.5h1.166V4.5H7.417zm0 4.667V10.5h1.166V9.167H7.417z'/%3E%3C/svg%3E\")"
				case "warning":
					return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23cca700'%3E%3Cpath d='M14.4 12.3 8.35 1.51a.7.7 0 0 0-1.2 0L1.1 12.3a.7.7 0 0 0 .6 1.1h12.6a.7.7 0 0 0 .6-1.1zM7.3 5.3h1v4h-1v-4zm.5 7a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z'/%3E%3C/svg%3E\")"
				case "info":
				default:
					return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23007acc'%3E%3Cpath d='M8 1a7 7 0 100 14A7 7 0 008 1zm0 1.167a5.833 5.833 0 110 11.666A5.833 5.833 0 018 2.167zM7.417 4.5V5.667h1.166V4.5H7.417zm0 2.333v4.834h1.166V6.833H7.417z'/%3E%3C/svg%3E\")"
			}
		}};
	}
`

export const DescriptionText = styled.div<Props>`
	color: ${props => getThemeColors(props.mode).foreground};
	font-size: 12px;
	line-height: 1.6;
	margin: 0 0 20px 0;
	padding: 12px;
	background: ${props => getThemeColors(props.mode).error}10;
	border-radius: 2px;
	position: relative;
	max-width: 100%;
	box-sizing: border-box;
`

export const AutoApproveSection = styled.div<Props>`
	background: ${props => getThemeColors(props.mode).background};
	border-radius: 2px;
	padding: 16px;
	margin: 16px 0;
	border: 1px solid ${props => getThemeColors(props.mode).border};
`

export const SettingsSection = styled.div<Props>`
	margin-bottom: 24px;
	padding-bottom: 24px;
	border-bottom: 1px solid ${props => getThemeColors(props.mode).border};

	&:last-child {
		margin-bottom: 0;
		padding-bottom: 0;
		border-bottom: none;
	}
`

export const SettingsRow = styled.div<Props>`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 8px 12px;
	background: ${props => getThemeColors(props.mode).background};
	border: 1px solid ${props => getThemeColors(props.mode).border};
	border-radius: 2px;
	margin-bottom: 8px;
	height: 40px;

	@media (max-width: 480px) {
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}
`

export const SettingsLabel = styled.label<Props>`
	color: ${props => getThemeColors(props.mode).foreground};
	font-size: 13px;
	font-weight: 500;
	min-width: 120px;
	display: flex;
	align-items: center;
	height: 100%;

	@media (max-width: 480px) {
		min-width: auto;
	}
`

export const Divider = styled.div<Props>`
	height: 1px;
	background: ${props => getThemeColors(props.mode).border};
	margin: 24px 0;
	opacity: 0.3;
`
