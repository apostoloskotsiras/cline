import styled from 'styled-components'

export const HistoryWrapper = styled.div`
  position: fixed;
  top: 33px;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(145deg, 
    rgba(15, 15, 15, 0.98) 0%,
    rgba(10, 10, 10, 0.98) 100%
  );
  backdrop-filter: blur(12px);
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
    background: radial-gradient(
      circle at 50% 0%,
      rgba(103, 58, 183, 0.08) 0%,
      rgba(81, 45, 168, 0.05) 25%,
      transparent 50%
    );
    pointer-events: none;
  }
`

export const HistoryContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(20, 20, 20, 0.85);
  backdrop-filter: blur(16px);
  position: relative;
  border-radius: 12px;
  margin: 12px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(103, 58, 183, 0.1) 50%,
      transparent 100%
    );
  }
`

export const HistoryHeader = styled.header`
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const HistoryItem = styled.div`
  background: rgba(25, 25, 25, 0.95);
  margin: 8px 16px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;

  &:hover {
    background: rgba(35, 35, 35, 0.95);
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
    background: var(--vscode-textLink-foreground);
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

export const HistoryItemHighlight = styled.span`
  background-color: rgba(103, 58, 183, 0.3);
  color: inherit;
  border-radius: 2px;
  padding: 0 2px;
`

export const SearchContainer = styled.div`
  position: sticky;
  top: 0;
  background: rgba(20, 20, 20, 0.98);
  z-index: 10;
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
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

export const DoneButton = styled.div`
  padding: 4px 12px;
  font-size: 11px;
  border-radius: 4px;
  background: rgba(103, 58, 183, 0.1);
  border: 1px solid rgba(103, 58, 183, 0.2);
  color: var(--vscode-foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(103, 58, 183, 0.2);
    border-color: rgba(103, 58, 183, 0.3);
  }

  i {
    font-size: 14px;
    opacity: 0.8;
  }
`

export const SortOptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  background: rgba(30, 30, 30, 0.4);
  border-radius: 6px;
`

export const SortOption = styled.div<{ selected?: boolean; disabled?: boolean }>`
  padding: 4px 10px;
  font-size: 11px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--vscode-foreground);
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
    background: ${props => props.disabled ? 'transparent' : 'rgba(255, 255, 255, 0.05)'};
  }

  ${props => props.selected && `
    background: rgba(103, 58, 183, 0.2);
    border-color: rgba(103, 58, 183, 0.3);
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