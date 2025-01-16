import styled from "styled-components"
import { VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import { ThemeMode } from "../../../../../../utils/theme"
import { getThemeColors } from "../../theme"

export const Wrapper = styled.div<{ mode: ThemeMode }>`
  position: fixed;
  top: 33px;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ mode }) => getThemeColors(mode).chatView.wrapper.background};
  backdrop-filter: ${({ mode }) => getThemeColors(mode).chatView.wrapper.backdropBlur};
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
    background: ${({ mode }) => getThemeColors(mode).chatView.wrapper.radialGlow};
    pointer-events: none;
  }
`

export const Container = styled.div<{ mode: ThemeMode }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ mode }) => getThemeColors(mode).chatView.container.background};
  backdrop-filter: ${({ mode }) => getThemeColors(mode).chatView.container.backdropBlur};
  position: relative;
  border-radius: 12px;
  margin: 12px;
  box-shadow: ${({ mode }) => getThemeColors(mode).chatView.container.shadow};
  border: 1px solid ${({ mode }) => getThemeColors(mode).chatView.container.border};
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
    background: ${({ mode }) => getThemeColors(mode).chatView.container.topGradient};
  }
`

export const Header = styled.header<{ mode: ThemeMode }>`
  background: transparent;
  border-bottom: 1px solid ${({ mode }) => `${getThemeColors(mode).border}0A`};
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
`

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--vscode-foreground);
`

export const TitleIcon = styled.i.attrs<{ mode: ThemeMode }>({ className: "codicon codicon-server" })`
  font-size: 16px;
  opacity: 0.8;
  color: ${({ mode }) => getThemeColors(mode).mcp.doneButton.text};
`

export const TitleText = styled.span`
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.3px;
`

export const DoneButton = styled.div<{ mode: ThemeMode }>`
  padding: 6px 14px;
  font-size: 11px;
  border-radius: 6px;
  background: ${({ mode }) => getThemeColors(mode).mcp.doneButton.background};
  border: 1px solid ${({ mode }) => getThemeColors(mode).mcp.doneButton.border};
  color: ${({ mode }) => getThemeColors(mode).mcp.doneButton.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${({ mode }) => getThemeColors(mode).mcp.doneButton.hoverBackground};
    border-color: ${({ mode }) => getThemeColors(mode).mcp.doneButton.hoverBorder};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`

export const DoneButtonIcon = styled.i.attrs({ className: "codicon codicon-check" })`
  font-size: 14px;
  opacity: 0.9;
`

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 0;

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
  line-height: 1.5;
`

export const StyledLink = styled(VSCodeLink)`
  display: inline;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const ServerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const ServerCard = styled.div<{ mode: ThemeMode }>`
  background: ${({ mode }) => getThemeColors(mode).mcp.serverCard.background};
  border-radius: 12px;
  border: 1px solid ${({ mode }) => getThemeColors(mode).mcp.serverCard.border};
  overflow: hidden;
  transition: all 0.2s ease;
  margin-bottom: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    background: ${({ mode }) => getThemeColors(mode).mcp.serverCard.hoverBackground};
    border-color: ${({ mode }) => getThemeColors(mode).mcp.serverCard.hoverBorder};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`

export const ServerHeader = styled.div<{ mode: ThemeMode }>`
  display: flex;
  align-items: center;
  padding: 14px 18px;
  cursor: pointer;
  background: ${({ mode }) => getThemeColors(mode).mcp.serverCard.background};
  border-bottom: 1px solid ${({ mode }) => getThemeColors(mode).mcp.serverCard.border};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ mode }) => getThemeColors(mode).mcp.serverCard.hoverBackground};
  }
`

export const ServerContent = styled.div<{ mode: ThemeMode }>`
  background: ${({ mode }) => getThemeColors(mode).mcp.serverCard.background};
  padding: 16px 18px;
  font-size: 13px;
  line-height: 1.5;
`

export const ErrorMessage = styled.div`
  color: var(--vscode-testing-iconFailed);
  margin-bottom: 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '⚠';
    font-size: 14px;
  }
`

export const NoContentMessage = styled.div`
  padding: 12px 0;
  color: var(--vscode-descriptionForeground);
  font-style: italic;
  font-size: 12px;
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

export const SettingsButtonContainer = styled.div<{ mode: ThemeMode }>`
  margin-top: auto;
  width: 100%;
  position: sticky;
  bottom: 0;
  background: transparent;
  display: flex;
  justify-content: center;
`

export const Button = styled.button<{ disabled?: boolean; mode: ThemeMode }>`
  padding: 10px 16px;
  font-size: 12px;
  border-radius: 6px;
  background: ${({ mode }) => getThemeColors(mode).mcp.settingsButton.background};
  border: 1px solid ${({ mode }) => getThemeColors(mode).mcp.settingsButton.border};
  color: ${({ mode }) => getThemeColors(mode).mcp.settingsButton.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  width: 100%;
  margin: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 500;

  &:hover:not(:disabled) {
    background: ${({ mode }) => getThemeColors(mode).mcp.settingsButton.hoverBackground};
    border-color: ${({ mode }) => getThemeColors(mode).mcp.settingsButton.hoverBorder};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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
  opacity: 0.9;
`

export const ChevronIcon = styled.i.attrs<{ expanded: boolean }>(props => ({
  className: `codicon codicon-chevron-${props.expanded ? 'down' : 'right'}`
}))<{ expanded: boolean }>`
  margin-right: 8px;
  font-size: 14px;
  opacity: 0.9;
  transition: transform 0.2s ease;
  transform: ${props => props.expanded ? 'rotate(0deg)' : 'rotate(-90deg)'};
` 