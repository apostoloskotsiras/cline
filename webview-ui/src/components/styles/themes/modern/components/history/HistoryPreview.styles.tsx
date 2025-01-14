import styled from 'styled-components'
import { ThemeMode } from '../../../../../../utils/theme'

export const PreviewWrapper = styled.div<{ mode: ThemeMode }>`
  flex-shrink: 0;
  padding: 8px 0;
`

export const HistoryPreviewItem = styled.div<{ mode: ThemeMode }>`
  background: var(--vscode-editor-background);
  margin: 12px 16px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: transparent;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover::before {
    background: var(--vscode-textLink-foreground);
    box-shadow: 0 0 8px rgba(103, 58, 183, 0.3);
  }
`

export const HistoryTitle = styled.div<{ mode: ThemeMode }>`
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--vscode-foreground);
  margin: 16px 24px 8px;

  i {
    font-size: 16px;
    opacity: 0.9;
    color: var(--vscode-textLink-foreground);
  }

  span {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
`

export const HistoryMetadata = styled.div<{ mode: ThemeMode }>`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85em;
  opacity: 0.85;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`

export const MetadataItem = styled.div<{ mode: ThemeMode }>`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const MetadataLabel = styled.span<{ mode: ThemeMode }>`
  font-weight: 500;
  color: var(--vscode-descriptionForeground);
`

export const MetadataValue = styled.div<{ mode: ThemeMode }>`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const ViewAllButton = styled.button<{ mode: ThemeMode }>`
  margin: 8px auto;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 400;
  border-radius: 4px;
  background: var(--vscode-button-secondaryBackground);
  border: 1px solid var(--vscode-button-border);
  color: var(--vscode-button-secondaryForeground);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;
  height: 24px;
  opacity: 0.9;

  &:hover {
    background: var(--vscode-button-secondaryHoverBackground);
    opacity: 1;
  }

  &:active {
    transform: translateY(1px);
  }
`

export const TimestampText = styled.span<{ mode: ThemeMode }>`
  color: var(--vscode-textLink-foreground);
  font-size: 0.85em;
  font-weight: 600;
  opacity: 0.9;
  letter-spacing: 0.3px;
`

export const TaskText = styled.div<{ mode: ThemeMode }>`
  font-size: 13px;
  color: var(--vscode-foreground);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-wrap;
  opacity: 0.95;
  margin: 8px 0;
` 