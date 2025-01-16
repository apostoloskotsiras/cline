import styled from "styled-components"
import { ThemeMode } from '../../../../../../utils/theme'
import getThemeColors from '../../theme'

export const SettingsWrapper = styled.div<{ mode: ThemeMode }>`
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

export const SettingsContainer = styled.div<{ mode: ThemeMode }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
`

export const SettingsHeader = styled.header<{ mode: ThemeMode }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 17px;
  padding-right: 17px;
`

export const SettingsTitle = styled.h3<{ mode: ThemeMode }>`
  color: var(--vscode-foreground);
  margin: 0;
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

  &:hover {
    background-color: var(--vscode-button-hoverBackground);
  }

  &:active {
    background-color: var(--vscode-button-background);
  }
`

export const SettingsContent = styled.div<{ mode: ThemeMode }>`
  flex-grow: 1;
  overflow-y: scroll;
  padding-right: 8px;
  display: flex;
  flex-direction: column;
`

export const SettingsSection = styled.div<{ mode: ThemeMode }>`
  margin-bottom: 5px;
`

export const SettingsLabel = styled.span<{ mode: ThemeMode }>`
  font-weight: 500;
  color: var(--vscode-foreground);
`

export const SettingsDescription = styled.p<{ mode: ThemeMode }>`
  font-size: 12px;
  margin-top: 5px;
  color: var(--vscode-descriptionForeground);
`

export const SettingsFooter = styled.div<{ mode: ThemeMode }>`
  text-align: center;
  color: var(--vscode-descriptionForeground);
  font-size: 12px;
  line-height: 1.2;
  margin-top: auto;
  padding: 10px 8px 15px 0px;

  p {
    word-wrap: break-word;
    margin: 0;
    padding: 0;
  }

  .version {
    font-style: italic;
    margin: 10px 0 0 0;
    padding: 0;
  }
`

export const DebugSection = styled.div<{ mode: ThemeMode }>`
  margin-top: 10px;
  margin-bottom: 4px;
`

export const DebugButton = styled.div<{ mode: ThemeMode }>`
  margin-top: 5px;
  width: auto;
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

  &:hover {
    background-color: var(--vscode-button-secondaryHoverBackground);
  }

  &:active {
    background-color: var(--vscode-button-secondaryBackground);
  }

  i {
    margin-right: 4px;
  }
`

// Global styles for VSCode components
export const styles = (mode: ThemeMode) => `
  vscode-text-area {
    width: 100%;
  }

  vscode-text-area::part(control) {
    width: 100%;
  }

  vscode-button {
    --vscode-button-background: var(--vscode-button-background);
    --vscode-button-foreground: var(--vscode-button-foreground);
    --vscode-button-border: var(--vscode-button-border);
    --vscode-button-hoverBackground: var(--vscode-button-hoverBackground);
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
  }

  vscode-button:hover {
    background-color: var(--vscode-button-hoverBackground);
  }

  vscode-button:active {
    background-color: var(--vscode-button-background);
  }

  vscode-button[appearance="secondary"] {
    --vscode-button-background: var(--vscode-button-secondaryBackground);
    --vscode-button-foreground: var(--vscode-button-secondaryForeground);
    --vscode-button-border: var(--vscode-button-secondaryBorder);
    --vscode-button-hoverBackground: var(--vscode-button-secondaryHoverBackground);
  }

  vscode-button[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  vscode-link {
    display: inline;
    color: var(--vscode-textLink-foreground);
    text-decoration: none;
    cursor: pointer;
  }

  vscode-link:hover {
    color: var(--vscode-textLink-activeForeground);
    text-decoration: underline;
  }
`
