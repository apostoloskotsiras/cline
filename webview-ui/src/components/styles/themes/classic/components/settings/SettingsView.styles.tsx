import styled from "styled-components"

export const styles = `
.settings-wrapper {
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
}

.settings-wrapper::before {
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

.settings-container {
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
}

.settings-container::before {
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

.settings-header {
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--vscode-foreground);
}

.settings-title i {
  font-size: 16px;
  opacity: 0.8;
}

.settings-title span {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.done-button {
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
}

.done-button:hover {
  background: rgba(103, 58, 183, 0.2);
  border-color: rgba(103, 58, 183, 0.3);
}

.done-button i {
  font-size: 14px;
  opacity: 0.8;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.settings-footer {
  text-align: center;
  color: var(--vscode-descriptionForeground);
  font-size: 12px;
  line-height: 1.2;
  padding: 10px 20px 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

/* Input field styles */
vscode-text-field,
vscode-text-area,
vscode-dropdown {
  --input-background: transparent !important;
  background: rgba(30, 30, 30, 0.6) !important;
  border-radius: 4px !important;
  transition: all 0.2s ease !important;
}

vscode-text-field:hover,
vscode-text-area:hover,
vscode-dropdown:hover {
  background: rgba(35, 35, 35, 0.7) !important;
  border-color: rgba(103, 58, 183, 0.2) !important;
}

vscode-text-field:focus-within,
vscode-text-area:focus-within,
vscode-dropdown:focus-within {
  border-color: rgba(103, 58, 183, 0.3) !important;
  background: rgba(40, 40, 40, 0.8) !important;
}

/* Label styles */
.settings-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--vscode-foreground);
  opacity: 0.9;
  margin-bottom: 4px;
  display: block;
}

/* Section styles */
.settings-section {
  background: rgba(25, 25, 25, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.settings-section:hover {
  border-color: rgba(103, 58, 183, 0.15);
}

/* Description text styles */
.settings-description {
  font-size: 12px;
  color: var(--vscode-descriptionForeground);
  margin-top: 4px;
  line-height: 1.4;
}

/* Error message styles */
.settings-error {
  color: var(--vscode-inputValidation-errorForeground);
  background: var(--vscode-inputValidation-errorBackground);
  border: 1px solid var(--vscode-inputValidation-errorBorder);
  border-radius: 4px;
  padding: 8px 12px;
  margin-top: 8px;
  font-size: 12px;
}

/* Override VS Code default input styles */
vscode-text-field .control,
vscode-text-area .control,
vscode-dropdown .control {
  background: rgba(30, 30, 30, 0.6) !important;
  color: var(--vscode-foreground) !important;
  font-family: var(--vscode-font-family) !important;
  font-size: 13px !important;
}

vscode-text-field:hover .control,
vscode-text-area:hover .control,
vscode-dropdown:hover .control {
  background: rgba(35, 35, 35, 0.7) !important;
  border-color: rgba(103, 58, 183, 0.2) !important;
}

vscode-text-field:focus-within .control,
vscode-text-area:focus-within .control,
vscode-dropdown:focus-within .control {
  border-color: rgba(103, 58, 183, 0.3) !important;
  background: rgba(40, 40, 40, 0.8) !important;
}

/* Remove default VS Code input background */
.settings-section vscode-text-field,
.settings-section vscode-text-area,
.settings-section vscode-dropdown {
  background: transparent !important;
}

/* Style the dropdown options */
vscode-dropdown::part(listbox) {
  background: rgba(25, 25, 25, 0.95) !important;
  border: 1px solid rgba(103, 58, 183, 0.2) !important;
  border-radius: 4px !important;
  padding: 4px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
  backdrop-filter: blur(8px) !important;
}

vscode-option {
  background: transparent !important;
  transition: all 0.2s ease !important;
  border-radius: 3px !important;
  padding: 6px 8px !important;
  margin: 2px 0 !important;
  cursor: pointer !important;
  font-size: 13px !important;
}

vscode-option:hover {
  background: rgba(103, 58, 183, 0.15) !important;
}

vscode-option[selected] {
  background: rgba(103, 58, 183, 0.2) !important;
  color: var(--vscode-foreground) !important;
}

/* Enhance dropdown trigger button */
vscode-dropdown::part(control) {
  background: rgba(30, 30, 30, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 4px !important;
  padding: 4px 8px !important;
  height: 28px !important;
  transition: all 0.2s ease !important;
}

vscode-dropdown:hover::part(control) {
  background: rgba(35, 35, 35, 0.7) !important;
  border-color: rgba(103, 58, 183, 0.2) !important;
}

vscode-dropdown:focus-within::part(control) {
  border-color: rgba(103, 58, 183, 0.3) !important;
  background: rgba(40, 40, 40, 0.8) !important;
}

/* Style dropdown indicators */
vscode-dropdown::part(indicator) {
  color: rgba(255, 255, 255, 0.6) !important;
  font-size: 12px !important;
  transition: all 0.2s ease !important;
}

vscode-dropdown:hover::part(indicator) {
  color: rgba(255, 255, 255, 0.8) !important;
}
` 