import styled from "styled-components"

export const ToolRow = styled.div`
  padding: 3px 0;
`

export const ToolHeader = styled.div`
  display: flex;
`

export const ToolIcon = styled.span.attrs({ className: "codicon codicon-symbol-method" })`
  margin-right: 6px;
`

export const ToolName = styled.span`
  font-weight: 500;
`

export const ToolDescription = styled.div`
  margin-left: 0px;
  margin-top: 4px;
  opacity: 0.8;
  font-size: 12px;
`

export const ParametersContainer = styled.div`
  margin-top: 8px;
  font-size: 12px;
  border: 1px solid color-mix(in srgb, var(--vscode-descriptionForeground) 30%, transparent);
  border-radius: 3px;
  padding: 8px;
`

export const ParametersHeader = styled.div`
  margin-bottom: 4px;
  opacity: 0.8;
  font-size: 11px;
  text-transform: uppercase;
`

export const ParameterRow = styled.div`
  display: flex;
  align-items: baseline;
  margin-top: 4px;
`

export const ParameterCode = styled.code`
  color: var(--vscode-textPreformat-foreground);
  margin-right: 8px;
`

export const RequiredIndicator = styled.span`
  color: var(--vscode-errorForeground);
`

export const ParameterDescription = styled.span`
  opacity: 0.8;
  overflow-wrap: break-word;
  word-break: break-word;
` 