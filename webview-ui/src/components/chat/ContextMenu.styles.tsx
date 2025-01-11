import styled, { keyframes, css } from 'styled-components';

const contextMenuFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.98) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const itemHoverScale = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(4px);
  }
`;

export const Wrapper = styled.div`
  position: absolute;
  bottom: calc(100% + 25px);
  left: 15px;
  right: 15px;
  overflow: hidden;
  perspective: 1000px;
  z-index: 1000;
`;

export const Container = styled.div`
  background: linear-gradient(145deg, 
    rgb(35, 35, 35) 0%,
    rgb(28, 28, 28) 100%
  );
  border-radius: 14px;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  animation: ${contextMenuFadeIn} 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

export const MenuItem = styled.div<{ isSelected?: boolean; isSelectable?: boolean }>`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--vscode-foreground);
  opacity: ${props => props.isSelectable ? 0.9 : 0.7};
  cursor: ${props => props.isSelectable ? 'pointer' : 'default'};
  background: ${props => props.isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  ${props => props.isSelectable && css`
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      opacity: 1;
      animation: ${itemHoverScale} 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: rgba(255, 255, 255, 0.5);
        opacity: 0.8;
      }
    }
  `}

  ${props => props.isSelected && props.isSelectable && css`
    background: rgba(255, 255, 255, 0.1);
    opacity: 1;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: rgba(255, 255, 255, 0.5);
      opacity: 0.8;
    }
  `}
`;

export const ItemContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 14px;

  i.codicon {
    font-size: 16px;
    flex-shrink: 0;
    opacity: 0.8;
    transition: transform 0.2s ease;
  }

  ${MenuItem}:hover & {
    i.codicon {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  i.action-icon {
    font-size: 14px;
    margin-left: 12px;
    opacity: 0.6;
    transition: opacity 0.2s ease;
  }

  ${MenuItem}:hover & {
    i.action-icon {
      opacity: 0.9;
    }
  }
`;

export const MenuText = styled.span`
  font-size: 13.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  letter-spacing: 0.2px;
`;

export const MenuPath = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  ${MenuItem}:hover & {
    opacity: 0.9;
  }
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
  color: rgba(255, 255, 255, 0.7);
  opacity: 0.8;
`; 