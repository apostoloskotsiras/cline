import styled from "styled-components"
import { VSCodeLink } from "@vscode/webview-ui-toolkit/react"

export const Wrapper = styled.div`
  position: fixed;
  top: 33px;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(145deg, 
    rgba(255, 15, 15, 0.98) 0%,
    rgba(10, 10, 10, 0.98) 100%
  );
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;

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

export const Container = styled.div`
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
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;

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

export const Header = styled.header`
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--vscode-foreground);
`

export const TitleIcon = styled.i.attrs({ className: "codicon codicon-server" })`
  font-size: 16px;
  opacity: 0.8;
`

export const TitleText = styled.span`
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.3px;
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
`

export const DoneButtonIcon = styled.i.attrs({ className: "codicon codicon-check" })`
  font-size: 14px;
  opacity: 0.8;
`

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

export const ContentInner = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const Description = styled.div`
  color: var(--vscode-foreground);
  font-size: 13px;
  margin-bottom: 20px;
  margin-top: 5px;
`

export const StyledLink = styled(VSCodeLink)`
  display: inline;
`

export const ServerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const ServerCard = styled.div`
  background: rgba(25, 25, 25, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  transition: all 0.2s ease;
  margin-bottom: 10px;

  &:hover {
    border-color: rgba(103, 58, 183, 0.2);
    transform: translateY(-1px);
  }
`

export const ServerHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  background: rgba(30, 30, 30, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`

export const ServerContent = styled.div`
  background: rgba(25, 25, 25, 0.95);
  padding: 16px;
  font-size: 13px;
`

export const ErrorMessage = styled.div`
  color: var(--vscode-testing-iconFailed);
  margin-bottom: 8px;
`

export const NoContentMessage = styled.div`
  padding: 10px 0;
  color: var(--vscode-descriptionForeground);
`

export const StatusIndicator = styled.div<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 8px;
  transition: all 0.2s ease;
  background: ${props => {
    switch (props.status) {
      case 'connected':
        return 'var(--vscode-testing-iconPassed)';
      case 'connecting':
        return 'var(--vscode-charts-yellow)';
      case 'disconnected':
        return 'var(--vscode-testing-iconFailed)';
      default:
        return 'transparent';
    }
  }};
  box-shadow: ${props => {
    switch (props.status) {
      case 'connected':
        return '0 0 8px rgba(var(--vscode-testing-iconPassed), 0.4)';
      case 'connecting':
        return '0 0 8px rgba(var(--vscode-charts-yellow), 0.4)';
      case 'disconnected':
        return '0 0 8px rgba(var(--vscode-testing-iconFailed), 0.4)';
      default:
        return 'none';
    }
  }};
`

export const SettingsButtonContainer = styled.div`
  margin-top: auto;
  padding: 10px 0;
  width: 100%;
  position: sticky;
  bottom: 0;
  background: rgba(20, 20, 20, 0.85);
  backdrop-filter: blur(16px);
`

export const Button = styled.button<{ disabled?: boolean }>`
  padding: 8px 12px;
  font-size: 11px;
  border-radius: 4px;
  background: rgba(103, 58, 183, 0.1);
  border: 1px solid rgba(103, 58, 183, 0.2);
  color: var(--vscode-foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  width: 100%;
  margin: 8px 0;

  &:hover:not(:disabled) {
    background: rgba(103, 58, 183, 0.2);
    border-color: rgba(103, 58, 183, 0.3);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

export const SettingsButton = styled(Button)`
  margin: 0 auto;
  max-width: calc(100% - 40px);
  transform: translateZ(0);
  backface-visibility: hidden;
`

export const ButtonIcon = styled.i`
  font-size: 14px;
  opacity: 0.8;
`

export const ChevronIcon = styled.i.attrs<{ expanded: boolean }>(props => ({
  className: `codicon codicon-chevron-${props.expanded ? 'down' : 'right'}`
}))<{ expanded: boolean }>`
  margin-right: 8px;
  font-size: 14px;
  opacity: 0.8;
` 