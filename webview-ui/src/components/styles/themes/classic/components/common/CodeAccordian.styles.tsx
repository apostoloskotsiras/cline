import styled from "styled-components"

export const Container = styled.div`
  border-radius: 3px;
  background-color: var(--vscode-editor-background, --vscode-sideBar-background, rgb(30 30 30));
  overflow: hidden;
  border: 1px solid var(--vscode-editorGroup-border);
`

export const Header = styled.div<{ isLoading?: boolean }>`
  color: var(--vscode-descriptionForeground);
  display: flex;
  align-items: center;
  padding: 9px 10px;
  cursor: ${props => props.isLoading ? "wait" : "pointer"};
  opacity: ${props => props.isLoading ? 0.7 : 1};
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
`

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
`

export const HeaderIcon = styled.span`
  margin-right: 6px;
`

export const HeaderText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
`

export const PathText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
  direction: rtl;
  text-align: left;
`

export const Spacer = styled.div`
  flex-grow: 1;
`

export const CodeBlockContainer = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
` 