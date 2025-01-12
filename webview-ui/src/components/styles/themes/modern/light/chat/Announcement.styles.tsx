import styled from "styled-components"

export const Container = styled.div`
	background-color: var(--vscode-editor-inactiveSelectionBackground);
	border-radius: 3px;
	padding: 12px 16px;
	margin: 5px 15px 5px 15px;
	position: relative;
	flex-shrink: 0;
`

export const CloseButton = styled.div`
	position: absolute;
	top: 8px;
	right: 8px;
`

export const Title = styled.h3`
	margin: 0 0 8px;
`

export const List = styled.ul`
	margin: 0 0 8px;
	padding-left: 12px;
`

export const SubList = styled.ul`
	margin: 4px 0;
	padding-left: 22px;
`

export const ListItem = styled.li`
	.codicon {
		font-size: 12px;
		margin-right: 4px;
	}
`

export const Divider = styled.div`
	height: 1px;
	background: var(--vscode-foreground);
	opacity: 0.1;
	margin: 8px 0;
`

export const FooterText = styled.p`
	margin: 0;
`
