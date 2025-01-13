import styled from "styled-components"
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"

export const TAB_NAVBAR_HEIGHT = 32 // Increased height for better visual balance

export const NavbarContainer = styled.div`
  position: absolute;
  top: 4px;
  right: 0;
  left: 0;
  height: ${TAB_NAVBAR_HEIGHT}px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`

export const NavButton = styled(VSCodeButton)`
  width: 32px;
  height: 32px;
  position: relative;
  border-radius: 6px;
  transition: all 0.2s ease;
  background: transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  i {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    opacity: 0.9;
  }
`

export const TooltipContainer = styled.div<{ isVisible: boolean; x: number; y: number; align: string }>`
  position: fixed;
  top: ${(props) => props.y}px;
  left: ${(props) => (props.align === "center" ? props.x + "px" : "auto")};
  right: ${(props) => (props.align === "right" ? "10px" : "auto")};
  transform: ${(props) => (props.align === "center" ? "translateX(-50%)" : "none")};
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease,
    transform 0.2s ease;
  background-color: var(--vscode-editorHoverWidget-background);
  color: var(--vscode-editorHoverWidget-foreground);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--vscode-editorHoverWidget-border);
  text-align: center;
  white-space: nowrap;
`

export const TooltipArrow = styled.div<{ align: string }>`
  position: absolute;
  top: -5px;
  left: ${(props) => (props.align === "center" ? "50%" : props.align === "left" ? "10px" : "auto")};
  right: ${(props) => (props.align === "right" ? "10px" : "auto")};
  margin-left: ${(props) => (props.align === "center" ? "-5px" : "0")};
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid var(--vscode-editorHoverWidget-border);

  &::after {
    content: "";
    position: absolute;
    left: -5px;
    top: 1px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid var(--vscode-editorHoverWidget-background);
  }
` 