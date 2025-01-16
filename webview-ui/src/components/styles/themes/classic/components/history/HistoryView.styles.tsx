import styled from 'styled-components'
import { ThemeMode } from '../../../../../../utils/theme'
import getThemeColors from '../../theme'

export const HistoryWrapper = styled.div<{ mode: ThemeMode }>`
  position: fixed;
  top: 33px;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 0px 0px 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${props => getThemeColors(props.mode).chatView.wrapper.background};
`

export const HistoryContainer = styled.div<{ mode: ThemeMode }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
`

export const HistoryHeader = styled.header<{ mode: ThemeMode }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 17px;
  padding-right: 17px;
`

export const HistoryTitle = styled.div<{ mode: ThemeMode }>`
  color: var(--vscode-foreground);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    font-size: 16px;
  }

  span {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.3px;
  }
`

export const DoneButton = styled.div<{ mode: ThemeMode }>`
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border: 1px solid var(--vscode-button-border);
  padding: 4px 12px;
  border-radius: 2px;
  cursor: pointer;
  font-family: var(--vscode-font-family);
  font-size: var(--vscode-font-size);
  line-height: 1.4;
  text-align: center;
  white-space: nowrap;
  transition: background-color 0.2s ease-out;
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    font-size: 14px;
  }

  &:hover {
    background-color: var(--vscode-button-hoverBackground);
  }

  &:active {
    background-color: var(--vscode-button-background);
  }
`

export const SearchContainer = styled.div<{ mode: ThemeMode }>`
  position: sticky;
  top: 0;
  background: transparent;
  z-index: 10;
  padding: 10px 10px 10px 0;
  border-bottom: 1px solid var(--vscode-widget-border);
`

export const SortOptionsContainer = styled.div<{ mode: ThemeMode }>`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  background: transparent;
  border-radius: 2px;
`

export const SortOption = styled.div<{ selected?: boolean; disabled?: boolean; mode: ThemeMode }>`
  padding: 4px 10px;
  font-size: 11px;
  border-radius: 2px;
  cursor: pointer;
  color: var(--vscode-foreground);
  opacity: ${props => props.disabled ? 0.4 : 0.6};
  transition: all 0.2s ease;
  background: ${props => props.selected ? 'var(--vscode-button-secondaryBackground)' : 'transparent'};
  border: 1px solid ${props => props.selected ? 'var(--vscode-button-secondaryBorder)' : 'transparent'};
  display: flex;
  align-items: center;
  gap: 6px;
  user-select: none;

  &:hover:not(.selected) {
    opacity: ${props => props.disabled ? 0.4 : 0.8};
    background: ${props => props.disabled ? 'transparent' : 'var(--vscode-list-hoverBackground)'};
  }

  ${props => props.disabled && `
    cursor: not-allowed;
  `}

  i {
    font-size: 14px;
    display: flex;
    align-items: center;
  }
`

export const HistoryItem = styled.div<{ mode: ThemeMode }>`
  background: transparent;
  margin: 4px 16px 4px 0;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  border-radius: 2px;
  cursor: pointer;
  border: 1px solid transparent;
  padding: 8px;

  &:hover {
    background: var(--vscode-list-hoverBackground);
    border-color: var(--vscode-list-focusBorder);
  }
`

export const DeleteButton = styled.span`
  opacity: 0;
  transition: opacity 0.2s ease;
  position: relative;
  color: var(--vscode-icon-foreground);

  ${HistoryItem}:hover & {
    opacity: 1;
  }

  &:hover {
    color: var(--vscode-errorForeground);
  }
`

export const ExportButton = styled.span`
  opacity: 0;
  transition: opacity 0.2s ease;
  position: relative;
  color: var(--vscode-icon-foreground);

  ${HistoryItem}:hover & {
    opacity: 1;
  }

  &:hover {
    color: var(--vscode-textLink-activeForeground);
  }
`

export const HistoryItemHighlight = styled.span<{ mode: ThemeMode }>`
  background-color: var(--vscode-editor-findMatchHighlightBackground);
  color: inherit;
  border-radius: 2px;
  padding: 0 2px;
`

export const TaskContent = styled.div`
  font-size: 13px;
  color: var(--vscode-foreground);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-wrap;
`

export const MetadataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85em;
  margin-top: 8px;
`

export const MetadataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--vscode-descriptionForeground);
`

export const MetadataLabel = styled.span`
  font-weight: 500;
  color: var(--vscode-descriptionForeground);
  opacity: 0.8;
`

export const MetadataValue = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  color: var(--vscode-descriptionForeground);
  opacity: 0.8;
` 