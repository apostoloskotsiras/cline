import styled from 'styled-components'
import { ThemeMode } from '../../../../../../utils/theme'
import getThemeColors from '../../theme'

export const HistoryWrapper = styled.div<{ mode: ThemeMode }>`
  position: fixed;
  top: 33px;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => getThemeColors(props.mode).chatView.wrapper.background};
  backdrop-filter: ${props => getThemeColors(props.mode).chatView.wrapper.backdropBlur};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => getThemeColors(props.mode).chatView.wrapper.radialGlow};
    pointer-events: none;
  }
`

export const HistoryContainer = styled.div<{ mode: ThemeMode }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${props => getThemeColors(props.mode).chatView.container.background};
  backdrop-filter: ${props => getThemeColors(props.mode).chatView.container.backdropBlur};
  position: relative;
  border-radius: 12px;
  margin: 12px;
  box-shadow: ${props => getThemeColors(props.mode).chatView.container.shadow};
  border: 1px solid ${props => getThemeColors(props.mode).chatView.container.border};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => getThemeColors(props.mode).chatView.container.topGradient};
  }
`

export const HistoryHeader = styled.header<{ mode: ThemeMode }>`
  background: transparent;
  border-bottom: 1px solid ${props => getThemeColors(props.mode).border};
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const HistoryItem = styled.div<{ mode: ThemeMode }>`
  background: ${props => getThemeColors(props.mode).mcp.serverCard.background};
  margin: 8px 16px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background: ${props => getThemeColors(props.mode).mcp.serverCard.hoverBackground};
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: transparent;
    transition: background 0.2s ease;
  }

  &:hover::before {
    background: ${props => getThemeColors(props.mode).mcp.serverCard.hoverBorder};
  }
`

export const DeleteButton = styled.span`
  opacity: 0;
  transition: opacity 0.2s ease;
  position: relative;

  ${HistoryItem}:hover & {
    opacity: 1;
  }
`

export const ExportButton = styled.span`
  opacity: 0;
  transition: opacity 0.2s ease;
  position: relative;

  ${HistoryItem}:hover & {
    opacity: 1;
  }
`

export const HistoryItemHighlight = styled.span<{ mode: ThemeMode }>`
  background-color: ${props => getThemeColors(props.mode).mcp.doneButton.background};
  color: inherit;
  border-radius: 2px;
  padding: 0 2px;
`

export const SearchContainer = styled.div<{ mode: ThemeMode }>`
  position: sticky;
  top: 0;
  background: ${props => getThemeColors(props.mode).chatView.container.background};
  z-index: 10;
  padding: 10px;
  border-bottom: 1px solid ${props => getThemeColors(props.mode).border};
`

export const HistoryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--vscode-foreground);

  i {
    font-size: 16px;
    opacity: 0.8;
  }

  span {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.3px;
  }
`

export const DoneButton = styled.div<{ mode: ThemeMode }>`
  padding: 4px 12px;
  font-size: 11px;
  border-radius: 4px;
  background: ${props => getThemeColors(props.mode).mcp.doneButton.background};
  border: 1px solid ${props => getThemeColors(props.mode).mcp.doneButton.border};
  color: ${props => getThemeColors(props.mode).mcp.doneButton.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => getThemeColors(props.mode).mcp.doneButton.hoverBackground};
    border-color: ${props => getThemeColors(props.mode).mcp.doneButton.hoverBorder};
  }

  i {
    font-size: 14px;
    opacity: 0.8;
  }
`

export const SortOptionsContainer = styled.div<{ mode: ThemeMode }>`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  background: ${props => getThemeColors(props.mode).chatView.container.background};
  border-radius: 6px;
`

export const SortOption = styled.div<{ selected?: boolean; disabled?: boolean; mode: ThemeMode }>`
  padding: 4px 10px;
  font-size: 11px;
  border-radius: 4px;
  cursor: pointer;
  color: ${props => getThemeColors(props.mode).text};
  opacity: ${props => props.disabled ? 0.4 : 0.6};
  transition: all 0.2s ease;
  background: transparent;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  gap: 6px;
  user-select: none;

  &:hover:not(.selected) {
    opacity: ${props => props.disabled ? 0.4 : 0.8};
    background: ${props => props.disabled ? 'transparent' : getThemeColors(props.mode).hover};
  }

  ${props => props.selected && `
    background: ${getThemeColors(props.mode).mcp.doneButton.background};
    border-color: ${getThemeColors(props.mode).mcp.doneButton.border};
    opacity: 1;
  `}

  ${props => props.disabled && `
    cursor: not-allowed;
  `}

  i {
    font-size: 14px;
    display: flex;
    align-items: center;
  }
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
  opacity: 0.9;
`

export const MetadataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85em;
  opacity: 0.8;
`

export const MetadataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const MetadataLabel = styled.span`
  font-weight: 500;
  color: var(--vscode-descriptionForeground);
`

export const MetadataValue = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  color: var(--vscode-descriptionForeground);
` 