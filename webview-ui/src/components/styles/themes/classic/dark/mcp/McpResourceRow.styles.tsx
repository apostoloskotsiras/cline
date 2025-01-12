import styled from "styled-components"

export const ResourceRow = styled.div`
  padding: 3px 0;
`

export const ResourceHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`

export const ResourceIcon = styled.span.attrs({ className: "codicon codicon-symbol-file" })`
  margin-right: 6px;
`

export const ResourceTitle = styled.span`
  font-weight: 500;
  word-break: break-all;
`

export const ResourceDescription = styled.div`
  font-size: 12px;
  opacity: 0.8;
  margin: 4px 0;
`

export const ResourceMimeType = styled.div`
  font-size: 12px;
`

export const MimeTypeLabel = styled.span`
  opacity: 0.8;
`

export const MimeTypeCode = styled.code`
  color: var(--vscode-textPreformat-foreground);
  background: var(--vscode-textPreformat-background);
  padding: 1px 4px;
  border-radius: 3px;
` 