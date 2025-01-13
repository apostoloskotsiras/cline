import styled from "styled-components"
import { ThemeMode } from "../../../../../../utils/theme"
import { getThemeColors } from "../../../modern/theme"

export const Container = styled.div<{ mode: ThemeMode }>`
	background: ${({ mode }) => getThemeColors(mode).secondary};
	border-radius: 12px;
	padding: 20px 24px;
	margin: 12px 16px;
	position: relative;
	flex-shrink: 0;
	border: 1px solid ${({ mode }) => getThemeColors(mode).border};
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	backdrop-filter: blur(8px);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
		border-color: ${({ mode }) => getThemeColors(mode).hover};
	}
`

export const CloseButton = styled.div<{ mode: ThemeMode }>`
	position: absolute;
	top: 16px;
	right: 16px;
	cursor: pointer;
	opacity: 0.6;
	transition: all 0.2s ease;
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: ${({ mode }) => getThemeColors(mode).hover};

	&:hover {
		opacity: 1;
		background: ${({ mode }) => getThemeColors(mode).active};
		transform: rotate(90deg);
	}
`

export const Title = styled.h3<{ mode: ThemeMode }>`
	margin: 0 0 16px;
	font-size: 1.2em;
	font-weight: 600;
	color: ${({ mode }) => getThemeColors(mode).textPrimary};
	letter-spacing: -0.01em;
	padding-right: 32px;
`

export const List = styled.ul<{ mode: ThemeMode }>`
	margin: 0 0 16px;
	padding-left: 20px;
	line-height: 1.6;
	color: ${({ mode }) => getThemeColors(mode).textPrimary};
	opacity: 0.9;
`

export const SubList = styled.ul`
	margin: 8px 0;
	padding-left: 28px;
	opacity: 0.85;
`

export const ListItem = styled.li<{ mode: ThemeMode }>`
	margin-bottom: 8px;
	transition: opacity 0.2s ease;
	
	&:hover {
		opacity: 1;
	}
	
	.codicon {
		font-size: 15px;
		margin-right: 8px;
		vertical-align: middle;
		opacity: 0.9;
		color: ${({ mode }) => getThemeColors(mode).primary};
	}

	&:last-child {
		margin-bottom: 0;
	}
`

export const Divider = styled.div<{ mode: ThemeMode }>`
	height: 1px;
	background: linear-gradient(
		to right,
		${({ mode }) => getThemeColors(mode).divider},
		${({ mode }) => `${getThemeColors(mode).divider}50`}
	);
	margin: 16px 0;
`

export const FooterText = styled.p<{ mode: ThemeMode }>`
	margin: 0;
	font-size: 0.9em;
	color: ${({ mode }) => getThemeColors(mode).textSecondary};
	transition: opacity 0.2s ease;

	&:hover {
		opacity: 0.9;
	}
`
