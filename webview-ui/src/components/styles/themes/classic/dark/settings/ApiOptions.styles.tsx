import styled from "styled-components"

export const styles = `
.dropdown-container {
  margin-top: 5px;
}

.model-search-field {
  background: rgba(30, 30, 30, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  border-radius: 4px !important;
  transition: all 0.2s ease !important;
}

.model-search-field:hover {
  background: rgba(35, 35, 35, 0.7) !important;
  border-color: rgba(103, 58, 183, 0.2) !important;
}

.model-search-field:focus-within {
  border-color: rgba(103, 58, 183, 0.3) !important;
  background: rgba(40, 40, 40, 0.8) !important;
}

.model-search-field .control,
vscode-text-field::part(control) {
  background: transparent !important;
  border: none !important;
  color: var(--vscode-foreground) !important;
  font-family: var(--vscode-font-family) !important;
  font-size: 13px !important;
}

vscode-text-field::part(control) {
  background: transparent !important;
  --input-background: transparent !important;
}

.model-search-field input::placeholder {
  color: var(--vscode-input-placeholderForeground);
  opacity: 0.6;
}

.see-more-container {
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  background: linear-gradient(to right, 
    rgba(25, 25, 25, 0) 0%,
    rgba(25, 25, 25, 0.85) 20%,
    rgba(25, 25, 25, 0.98) 60%
  );
  padding: 4px 8px 4px 24px;
}

.see-more-button {
  padding: 3px 8px;
  font-size: 11px;
  border-radius: 4px;
  background: rgba(103, 58, 183, 0.15);
  border: 1px solid rgba(103, 58, 183, 0.25);
  color: var(--vscode-foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  opacity: 0.9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.see-more-button:hover {
  background: rgba(103, 58, 183, 0.25);
  border-color: rgba(103, 58, 183, 0.35);
  opacity: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.see-more-button .codicon {
  font-size: 11px;
  opacity: 0.9;
  transition: transform 0.2s ease;
}

.see-more-button:hover .codicon {
  transform: translateY(1px);
}

.see-more-button span {
  font-weight: 500;
  letter-spacing: 0.2px;
}
` 