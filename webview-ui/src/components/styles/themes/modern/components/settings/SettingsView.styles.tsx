import styled from "styled-components"
import { ThemeMode } from '../../../../../../utils/theme'
import getThemeColors from '../../theme'

export const SettingsWrapper = styled.div<{ mode: ThemeMode }>`
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

export const SettingsContainer = styled.div<{ mode: ThemeMode }>`
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

export const SettingsHeader = styled.header<{ mode: ThemeMode }>`
  background: transparent;
  border-bottom: 1px solid ${props => getThemeColors(props.mode).border};
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const SettingsTitle = styled.div<{ mode: ThemeMode }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => getThemeColors(props.mode).text};

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

export const SettingsContent = styled.div<{ mode: ThemeMode }>`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

export const SettingsFooter = styled.div<{ mode: ThemeMode }>`
  text-align: center;
  color: ${props => getThemeColors(props.mode).textSecondary};
  font-size: 12px;
  line-height: 1.2;
  padding: 16px 20px;
  border-top: 1px solid ${props => getThemeColors(props.mode).border};
  background: ${props => getThemeColors(props.mode).chatView.container.background};
  backdrop-filter: blur(8px);
  border-radius: 0 0 12px 12px;

  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .feedback-section {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${props => getThemeColors(props.mode).text};
    opacity: 0.7;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.9;
    }

    i {
      font-size: 14px;
    }

    a {
      color: ${props => getThemeColors(props.mode).text};
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        color: ${props => getThemeColors(props.mode).mcp.doneButton.hoverBackground};
        text-decoration: underline;
      }
    }
  }

  .version {
    font-size: 11px;
    font-style: italic;
    opacity: 0.5;
    letter-spacing: 0.3px;
  }
`

export const SettingsLabel = styled.span<{ mode: ThemeMode }>`
  font-size: 12px;
  font-weight: 500;
  color: ${props => getThemeColors(props.mode).text};
  opacity: 0.9;
  margin-bottom: 4px;
  display: block;
`

export const SettingsSection = styled.div<{ mode: ThemeMode }>`
  background: ${props => getThemeColors(props.mode).mcp.serverCard.background};
  border: 1px solid ${props => getThemeColors(props.mode).mcp.serverCard.border};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  &:hover {
    border-color: ${props => getThemeColors(props.mode).mcp.serverCard.hoverBorder};
  }
`

export const SettingsDescription = styled.p<{ mode: ThemeMode }>`
  font-size: 12px;
  color: ${props => getThemeColors(props.mode).textSecondary};
  margin-top: 4px;
  line-height: 1.4;
`

export const SettingsError = styled.div<{ mode: ThemeMode }>`
  color: ${props => getThemeColors(props.mode).error};
  background: ${props => getThemeColors(props.mode).chatTextArea.containerBackground};
  border: 1px solid ${props => getThemeColors(props.mode).error};
  border-radius: 4px;
  padding: 8px 12px;
  margin-top: 8px;
  font-size: 12px;
`

// Global styles for VSCode components
export const styles = (mode: ThemeMode) => `
/* Input field styles */
vscode-text-field,
vscode-text-area,
vscode-dropdown {
  --input-background: transparent !important;
  background: ${getThemeColors(mode).chatTextArea.textAreaBackground} !important;
  border-radius: 4px !important;
  transition: all 0.2s ease !important;
}

vscode-text-field:hover,
vscode-text-area:hover,
vscode-dropdown:hover {
  background: ${getThemeColors(mode).chatTextArea.containerHover} !important;
  border-color: ${getThemeColors(mode).mcp.doneButton.border} !important;
}

vscode-text-field:focus-within,
vscode-text-area:focus-within,
vscode-dropdown:focus-within {
  border-color: ${getThemeColors(mode).mcp.doneButton.hoverBorder} !important;
  background: ${getThemeColors(mode).chatTextArea.containerHover} !important;
}

/* Override VS Code default input styles */
vscode-text-field .control,
vscode-text-area .control,
vscode-dropdown .control {
  background: ${getThemeColors(mode).chatTextArea.textAreaBackground} !important;
  color: ${getThemeColors(mode).text} !important;
  font-family: var(--vscode-font-family) !important;
  font-size: 13px !important;
}

vscode-text-field:hover .control,
vscode-text-area:hover .control,
vscode-dropdown:hover .control {
  background: ${getThemeColors(mode).chatTextArea.containerHover} !important;
  border-color: ${getThemeColors(mode).mcp.doneButton.border} !important;
}

vscode-text-field:focus-within .control,
vscode-text-area:focus-within .control,
vscode-dropdown:focus-within .control {
  border-color: ${getThemeColors(mode).mcp.doneButton.hoverBorder} !important;
  background: ${getThemeColors(mode).chatTextArea.containerHover} !important;
}

/* Remove default VS Code input background */
.settings-section vscode-text-field,
.settings-section vscode-text-area,
.settings-section vscode-dropdown {
  background: transparent !important;
}

/* Style the dropdown options */
vscode-dropdown::part(listbox) {
  background: ${getThemeColors(mode).mcp.serverCard.background} !important;
  border: 1px solid ${getThemeColors(mode).mcp.serverCard.border} !important;
  border-radius: 6px !important;
  padding: 6px !important;
  box-shadow: ${getThemeColors(mode).chatView.container.shadow} !important;
  backdrop-filter: ${getThemeColors(mode).chatView.container.backdropBlur} !important;
  margin-top: 4px !important;
}

vscode-option {
  background: transparent !important;
  transition: all 0.2s ease !important;
  border-radius: 4px !important;
  padding: 8px 12px !important;
  margin: 2px 0 !important;
  cursor: pointer !important;
  font-size: 13px !important;
  color: ${getThemeColors(mode).text} !important;
}

vscode-option:hover {
  background: ${getThemeColors(mode).mcp.doneButton.hoverBackground} !important;
}

vscode-option[selected] {
  background: ${getThemeColors(mode).mcp.doneButton.background} !important;
  color: ${getThemeColors(mode).text} !important;
  font-weight: 500 !important;
}

/* Enhance dropdown trigger button */
vscode-dropdown::part(control) {
  background: ${getThemeColors(mode).chatTextArea.textAreaBackground} !important;
  border: 1px solid ${getThemeColors(mode).border} !important;
  border-radius: 6px !important;
  padding: 6px 12px !important;
  height: 32px !important;
  transition: all 0.2s ease !important;
  display: flex;
  align-items: center;
  gap: 8px;
}

vscode-dropdown:hover::part(control) {
  background: ${getThemeColors(mode).chatTextArea.containerHover} !important;
  border-color: ${getThemeColors(mode).mcp.doneButton.border} !important;
}

vscode-dropdown:focus-within::part(control) {
  border-color: ${getThemeColors(mode).mcp.doneButton.hoverBorder} !important;
  background: ${getThemeColors(mode).chatTextArea.containerHover} !important;
  box-shadow: 0 0 0 2px ${getThemeColors(mode).mcp.doneButton.hoverBorder}33 !important;
}

/* Style dropdown indicators */
vscode-dropdown::part(indicator) {
  color: ${getThemeColors(mode).textSecondary} !important;
  font-size: 12px !important;
  transition: all 0.2s ease !important;
}

vscode-dropdown:hover::part(indicator) {
  color: ${getThemeColors(mode).text} !important;
}
`
