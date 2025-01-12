import styled from "styled-components"

export const Container = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
	row-gap: 3px;
`

export const ThumbnailWrapper = styled.div`
	position: relative;
`

export const ThumbnailImage = styled.img`
	width: 34px;
	height: 34px;
	object-fit: cover;
	border-radius: 4px;
	cursor: pointer;
`

export const DeleteButton = styled.div`
	position: absolute;
	top: -4px;
	right: -4px;
	width: 13px;
	height: 13px;
	border-radius: 50%;
	background-color: var(--vscode-badge-background);
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
`

export const DeleteIcon = styled.span.attrs({ className: "codicon codicon-close" })`
	color: var(--vscode-foreground);
	font-size: 10px;
	font-weight: bold;
` 