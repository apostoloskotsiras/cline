import styled from 'styled-components';
import { CheckpointControls } from '../common/CheckpointControls';

export const Container = styled.div`
  padding: 10px 6px 10px 15px;
  position: relative;

  &:hover ${CheckpointControls} {
    opacity: 1;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

export const BrowserContainer = styled.div`
  border-radius: 3px;
  border: 1px solid var(--vscode-editorGroup-border);
  overflow: hidden;
  background-color: var(--vscode-editor-background);
  margin-bottom: 10px;
`;

export const URLBar = styled.div`
  margin: 5px auto;
  width: calc(100% - 10px);
  box-sizing: border-box;
  background-color: var(--vscode-input-background);
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  padding: 3px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vscode-input-foreground);
  font-size: 12px;
`;

export const URLText = styled.div<{ $empty?: boolean }>`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-align: center;
  color: ${props => props.$empty ? 'var(--vscode-descriptionForeground)' : 'var(--vscode-input-foreground)'};
`;

export const ScreenshotArea = styled.div`
  width: 100%;
  padding-bottom: calc(200%/3);
  position: relative;
  background-color: var(--vscode-input-background);
`;

export const Screenshot = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
`;

export const EmptyScreenshot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .codicon {
    font-size: 80px;
    color: var(--vscode-descriptionForeground);
  }
`;

export const BrowserCursor = styled.img<{ $x: number; $y: number }>`
  position: absolute;
  top: ${props => props.$y}%;
  left: ${props => props.$x}%;
  width: 17px;
  height: 22px;
  transition: top 0.3s ease-out, left 0.3s ease-out;
`;

export const ConsoleHeader = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  justify-content: flex-start;
  cursor: pointer;
  padding: 9px 8px ${props => props.$expanded ? '0' : '8'}px 8px;
`;

export const ConsoleTitle = styled.span`
  font-size: 0.8em;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0px;
  margin-top: 15px;
  border-top: 1px solid var(--vscode-editorGroup-border);
`;

export const PaginationButtons = styled.div`
  display: flex;
  gap: 4px;
`; 