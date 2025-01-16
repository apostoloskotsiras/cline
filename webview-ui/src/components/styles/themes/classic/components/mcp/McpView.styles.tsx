import styled from "styled-components"
import { VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import { ThemeMode } from "../../../../../../utils/theme"
import getThemeColors from "../../theme"

export const Wrapper = styled.div<{ mode: ThemeMode }>`
  position: fixed;
  top: 33px;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 15px 0px 15px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${props => getThemeColors(props.mode).chatView.wrapper.background};
`

export const Container = styled.div<{ mode: ThemeMode }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
`

export const Header = styled.header<{ mode: ThemeMode }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 17px;
`

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--vscode-foreground);

  i {
    font-size: 16px;
  }

  span {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.3px;
  }
`

export const TitleIcon = styled.i.attrs({ className: "codicon codicon-server" })`
  font-size: 16px;
`

export const TitleText = styled.span`
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.3px;
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

export const DoneButtonIcon = styled.i.attrs({ className: "codicon codicon-check" })`
  font-size: 14px;
`

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  position: relative;
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
  color: var(--vscode-textLink-foreground);

  &:hover {
    text-decoration: underline;
    color: var(--vscode-textLink-activeForeground);
  }
`

export const ServerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const ServerCard = styled.div<{ mode: ThemeMode }>`
  background: transparent;
  border-radius: 2px;
  border: 1px solid var(--vscode-widget-border);
  overflow: hidden;
  transition: all 0.2s ease;
  margin-bottom: 4px;

  &:hover {
    background: var(--vscode-list-hoverBackground);
    border-color: var(--vscode-list-focusBorder);
  }
`

export const ServerHeader = styled.div<{ mode: ThemeMode }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  background: transparent;
  border-bottom: 1px solid var(--vscode-widget-border);
  transition: all 0.2s ease;

  &:hover {
    background: var(--vscode-list-hoverBackground);
  }
`

export const ServerContent = styled.div<{ mode: ThemeMode }>`
  background: transparent;
  padding: 12px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vscode-foreground);
`

export const ErrorMessage = styled.div`
  color: var(--vscode-errorForeground);
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
`

export const SettingsButtonContainer = styled.div<{ mode: ThemeMode }>`
  margin-top: auto;
  width: 100%;
  position: sticky;
  bottom: 0;
  background: transparent;
  display: flex;
  justify-content: center;
  padding: 16px 0;
`

export const Button = styled.button<{ disabled?: boolean; mode: ThemeMode }>`
  background-color: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
  border: 1px solid var(--vscode-button-secondaryBorder);
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
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin: 0;

  &:hover:not(:disabled) {
    background-color: var(--vscode-button-secondaryHoverBackground);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    background-color: var(--vscode-button-secondaryBackground);
  }
`

export const SettingsButton = styled(Button)`
  margin: 0 auto;
  max-width: calc(100% - 32px);
`

export const ButtonIcon = styled.i`
  font-size: 14px;
`

export const ChevronIcon = styled.i.attrs<{ expanded: boolean }>(props => ({
  className: `codicon codicon-chevron-${props.expanded ? 'down' : 'right'}`
}))<{ expanded: boolean }>`
  margin-right: 8px;
  font-size: 14px;
  transition: transform 0.2s ease;
  transform: ${props => props.expanded ? 'rotate(0deg)' : 'rotate(-90deg)'};
`