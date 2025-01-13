import styled from "styled-components"

export const Container = styled.div`
	background: rgba(34, 34, 34, 0.8);
	border-radius: 12px;
	padding: 20px 24px;
	margin: 12px 16px;
	position: relative;
	flex-shrink: 0;
	border: 1px solid rgba(255, 255, 255, 0.05);
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	backdrop-filter: blur(8px);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
		border-color: rgba(255, 255, 255, 0.1);
	}
`

export const CloseButton = styled.div`
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
	background: rgba(255, 255, 255, 0.1);

	&:hover {
		opacity: 1;
		background: rgba(255, 255, 255, 0.15);
		transform: rotate(90deg);
	}
`

export const Title = styled.h3`
	margin: 0 0 16px;
	font-size: 1.2em;
	font-weight: 600;
	color: var(--vscode-foreground);
	letter-spacing: -0.01em;
	padding-right: 32px;
`

export const List = styled.ul`
	margin: 0 0 16px;
	padding-left: 20px;
	line-height: 1.6;
	color: var(--vscode-foreground);
	opacity: 0.9;
`

export const SubList = styled.ul`
	margin: 8px 0;
	padding-left: 28px;
	opacity: 0.85;
`

export const ListItem = styled.li`
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
		color: var(--vscode-textLink-foreground);
	}

	&:last-child {
		margin-bottom: 0;
	}
`

export const Divider = styled.div`
	height: 1px;
	background: linear-gradient(
		to right,
		rgba(255, 255, 255, 0.1),
		rgba(255, 255, 255, 0.05)
	);
	margin: 16px 0;
`

export const FooterText = styled.p`
	margin: 0;
	font-size: 0.9em;
	opacity: 0.75;
	transition: opacity 0.2s ease;

	&:hover {
		opacity: 0.9;
	}
`
