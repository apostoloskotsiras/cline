import styled, { keyframes } from 'styled-components';

const contextMenuFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Wrapper = styled.div`
  position: absolute;
  bottom: calc(100% + 25px);
  left: 15px;
  right: 15px;
  overflow: hidden;
  perspective: 1000px;
`;

export const Container = styled.div`
  background: linear-gradient(145deg, 
    rgba(30, 30, 30, 0.98) 0%,
    rgba(25, 25, 25, 0.98) 100%
  );
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1000;
  animation: ${contextMenuFadeIn} 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

export const MenuItem = styled.div<{ isSelected?: boolean; isSelectable?: boolean }>`
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  color: var(--vscode-foreground);
  opacity: 0.8;
  cursor: ${props => props.isSelectable ? 'pointer' : 'default'};

  &:last-child {
    border-bottom: none;
  }

  ${props => props.isSelectable && `
    &:hover, &${props.isSelected && ',' || ''} {
      background: rgba(255, 255, 255, 0.05);
      opacity: 1;
    }
  `}
`;

export const ItemContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 12px;

  i.codicon {
    font-size: 16px;
    flex-shrink: 0;
    opacity: 0.7;
  }

  i.action-icon {
    font-size: 14px;
    margin-left: 12px;
    opacity: 0.5;
  }
`;

export const MenuText = styled.span`
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MenuPath = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
`;

export const PathSeparator = styled.span`
  opacity: 0.5;
  flex-shrink: 0;
`;

export const PathDot = styled(PathSeparator)``;

export const PathText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`; 