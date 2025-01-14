import styled from "styled-components"
import { ThemeMode } from "../../../../../../utils/theme"

export const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const OPENROUTER_MODEL_PICKER_Z_INDEX = 1_000

export const DropdownList = styled.div<{ mode: ThemeMode }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: ${({ mode }) => mode === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border: 1px solid rgba(103, 58, 183, 0.2);
  border-radius: 4px;
  z-index: ${OPENROUTER_MODEL_PICKER_Z_INDEX - 1};
  backdrop-filter: blur(16px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

export const DropdownItem = styled.div<{ isSelected: boolean; mode: ThemeMode }>`
  padding: 8px 12px;
  cursor: pointer;
  word-break: break-all;
  white-space: normal;
  transition: all 0.2s ease;
  font-size: 13px;
  color: ${({ mode }) => mode === 'dark' ? 'var(--vscode-foreground)' : 'var(--vscode-editor-foreground)'};

  background: ${({ isSelected }) => (isSelected ? "rgba(103, 58, 183, 0.15)" : "transparent")};

  &:hover {
    background: rgba(103, 58, 183, 0.1);
  }
`

export const StyledMarkdown = styled.div<{ mode: ThemeMode }>`
  font-family: var(--vscode-font-family);
  font-size: 12px;
  color: ${({ mode }) => mode === 'dark' ? 'var(--vscode-descriptionForeground)' : 'var(--vscode-editor-foreground)'};

  p,
  li,
  ol,
  ul {
    line-height: 1.4;
    margin: 0;
  }

  ol,
  ul {
    padding-left: 1.5em;
    margin-left: 0;
  }

  p {
    white-space: pre-wrap;
  }

  a {
    text-decoration: none;
    color: var(--vscode-textLink-foreground);
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
      text-decoration: underline;
    }
  }
` 