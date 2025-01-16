import styled from "styled-components"

export const ChatRowContainer = styled.div`
	padding: 16px 24px;
	position: relative;
	background: var(--vscode-editor-background);
	border-bottom: 1px solid var(--vscode-editorGroup-border);
	margin: 0;
	transition: all 0.2s ease;

	&:hover {
		background: var(--vscode-list-hoverBackground);
	}

	& + & {
		margin-top: 8px;
	}

	&:last-child {
		border-bottom: none;
	}
`

export const UserMessageContainer = styled(ChatRowContainer)`
	background: color-mix(in srgb, var(--vscode-editor-foreground) 3%, var(--vscode-editor-background));
	border-left: 2px solid color-mix(in srgb, var(--vscode-editor-foreground) 20%, var(--vscode-editor-background));
	padding-left: 22px;
	margin: 16px 0;

	&:hover {
		background: color-mix(in srgb, var(--vscode-editor-foreground) 5%, var(--vscode-editor-background));
	}
`

export const QuestionContainer = styled(ChatRowContainer)`
	background: color-mix(in srgb, var(--vscode-editor-foreground) 2%, var(--vscode-editor-background));
	border-left: 2px solid color-mix(in srgb, var(--vscode-editor-foreground) 15%, var(--vscode-editor-background));
	padding-left: 22px;
	margin: 16px 0;

	&:hover {
		background: color-mix(in srgb, var(--vscode-editor-foreground) 4%, var(--vscode-editor-background));
	}
`

export const SeeNewChangesBtn = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 16px;
	padding: 8px 16px;
	background: var(--vscode-button-background);
	border: 1px solid var(--vscode-button-border);
	border-radius: 3px;
	color: var(--vscode-button-foreground);
	font-size: 13px;
	cursor: pointer;
	transition: all 0.2s ease;
	font-weight: 500;

	&:hover:not(:disabled) {
		background: var(--vscode-button-hoverBackground);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	i.codicon {
		font-size: 14px;
	}
`

export const UserMessageHeader = styled.div`
	padding: 4px 0 12px 0;
	display: flex;
	align-items: center;
	gap: 10px;
	color: var(--vscode-foreground);
`

export const UserIconContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	border-radius: 4px;
	background: color-mix(in srgb, var(--vscode-badge-background) 80%, var(--vscode-editor-background));
	border: 1px solid var(--vscode-badge-background);

	.codicon {
		color: var(--vscode-badge-foreground);
		font-size: 16px;
	}
`

export const UserMessageTitle = styled.span`
	color: var(--vscode-foreground);
	font-weight: 500;
	font-size: 13px;
	letter-spacing: 0.1px;
`

export const UserMessageContent = styled.div`
	background: var(--vscode-textBlockQuote-background);
	color: var(--vscode-foreground);
	border-radius: 4px;
	padding: 12px 16px;
	white-space: pre-line;
	overflow-wrap: break-word;
	border: 1px solid var(--vscode-editorGroup-border);
	margin-top: 4px;
	font-size: 13px;
	line-height: 1.5;
	transition: border-color 0.2s ease;

	&:hover {
		border-color: color-mix(in srgb, var(--vscode-editorGroup-border) 80%, var(--vscode-editor-foreground));
	}

	.thumbnails {
		margin-top: 16px;
	}
`

export const QuestionHeader = styled.div`
	padding: 4px 0 12px 0;
	display: flex;
	align-items: center;
	gap: 10px;
`

export const QuestionIconContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	border-radius: 4px;
	background: color-mix(in srgb, var(--vscode-badge-background) 80%, var(--vscode-editor-background));
	border: 1px solid var(--vscode-badge-background);

	.codicon {
		color: var(--vscode-badge-foreground);
		font-size: 16px;
	}
`

export const QuestionTitle = styled.span`
	color: var(--vscode-foreground);
	font-weight: 500;
	font-size: 13px;
	letter-spacing: 0.1px;
`

export const QuestionContent = styled.div`
	background: var(--vscode-textBlockQuote-background);
	color: var(--vscode-foreground);
	border-radius: 4px;
	padding: 12px 16px;
	white-space: pre-line;
	overflow-wrap: break-word;
	border: 1px solid var(--vscode-editorGroup-border);
	margin-top: 4px;
	font-size: 13px;
	line-height: 1.5;
	transition: border-color 0.2s ease;

	&:hover {
		border-color: color-mix(in srgb, var(--vscode-editorGroup-border) 80%, var(--vscode-editor-foreground));
	}

	code {
		background: var(--vscode-textCodeBlock-background);
		color: var(--vscode-textPreformat-foreground);
		padding: 3px 6px;
		border-radius: 3px;
		font-size: 12px;
		font-family: var(--vscode-editor-font-family);
	}
`

export const CommandApprovalWarning = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	margin-top: 16px;
	padding: 10px 12px;
	border-radius: 4px;
	font-size: 12px;
	background: var(--vscode-inputValidation-warningBackground);
	border: 1px solid var(--vscode-inputValidation-warningBorder);
	color: var(--vscode-inputValidation-warningForeground);
	transition: all 0.2s ease;

	&:hover {
		background: color-mix(in srgb, var(--vscode-inputValidation-warningBackground) 90%, var(--vscode-editor-background));
	}

	i.codicon {
		font-size: 16px;
	}
`

export const TaskCompletedHeader = styled.div`
	padding: 4px 0 12px 0;
	display: flex;
	align-items: center;
	gap: 10px;
`

export const TaskCompletedIconContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	border-radius: 4px;
	background: color-mix(in srgb, var(--vscode-charts-green) 8%, var(--vscode-editor-background));
	border: 1px solid color-mix(in srgb, var(--vscode-charts-green) 30%, var(--vscode-editor-background));

	.codicon {
		color: var(--vscode-charts-green);
		font-size: 16px;
	}
`

export const TaskCompletedTitle = styled.span`
	color: var(--vscode-charts-green);
	font-weight: 500;
	font-size: 13px;
	letter-spacing: 0.1px;
`

export const TaskCompletedContent = styled.div`
	background: color-mix(in srgb, var(--vscode-charts-green) 4%, var(--vscode-textBlockQuote-background));
	color: var(--vscode-foreground);
	border-radius: 4px;
	padding: 12px 16px;
	white-space: pre-line;
	overflow-wrap: break-word;
	border: 1px solid color-mix(in srgb, var(--vscode-charts-green) 15%, var(--vscode-editorGroup-border));
	margin-top: 4px;
	font-size: 13px;
	line-height: 1.5;
	transition: border-color 0.2s ease;

	&:hover {
		border-color: color-mix(in srgb, var(--vscode-charts-green) 25%, var(--vscode-editorGroup-border));
	}

	code {
		background: color-mix(in srgb, var(--vscode-charts-green) 8%, var(--vscode-textCodeBlock-background));
		color: var(--vscode-charts-green);
		padding: 3px 6px;
		border-radius: 3px;
		font-size: 12px;
		font-family: var(--vscode-editor-font-family);
	}
`

export const CommandHeader = styled.div`
	padding: 4px 0 12px 0;
	display: flex;
	align-items: center;
	gap: 10px;
`

export const CommandIconContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	border-radius: 4px;
	background: color-mix(in srgb, var(--vscode-errorForeground) 8%, var(--vscode-editor-background));
	border: 1px solid color-mix(in srgb, var(--vscode-errorForeground) 30%, var(--vscode-editor-background));

	.codicon {
		color: var(--vscode-errorForeground);
		font-size: 16px;
	}
`

export const CommandTitle = styled.span`
	color: var(--vscode-errorForeground);
	font-weight: 500;
	font-size: 13px;
	letter-spacing: 0.1px;
`

export const CommandContent = styled.div`
	background: color-mix(in srgb, var(--vscode-errorForeground) 4%, var(--vscode-textBlockQuote-background));
	color: var(--vscode-foreground);
	border-radius: 4px;
	padding: 12px 16px;
	white-space: pre-line;
	overflow-wrap: break-word;
	border: 1px solid color-mix(in srgb, var(--vscode-errorForeground) 15%, var(--vscode-editorGroup-border));
	margin-top: 4px;
	font-size: 13px;
	line-height: 1.5;
	transition: border-color 0.2s ease;

	&:hover {
		border-color: color-mix(in srgb, var(--vscode-errorForeground) 25%, var(--vscode-editorGroup-border));
	}

	code {
		background: color-mix(in srgb, var(--vscode-errorForeground) 8%, var(--vscode-textCodeBlock-background));
		color: var(--vscode-errorForeground);
		padding: 3px 6px;
		border-radius: 3px;
		font-size: 12px;
		font-family: var(--vscode-editor-font-family);
	}

	pre {
		background: var(--vscode-textCodeBlock-background);
		border: 1px solid var(--vscode-editorGroup-border);
		border-radius: 4px;
		padding: 12px;
		margin: 12px 0;
		overflow-x: auto;
		font-family: var(--vscode-editor-font-family);
	}
`

export const ApiRequestHeader = styled.div`
	padding: 4px 0 12px 0;
	display: flex;
	align-items: center;
	gap: 10px;
`

export const ApiRequestIconContainer = styled.div<{ $state?: "loading" | "completed" | "failed" | "cancelled" }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	border-radius: 4px;
	background: ${({ $state }) => {
		switch ($state) {
			case "completed":
				return "color-mix(in srgb, var(--vscode-charts-green) 8%, var(--vscode-editor-background))"
			case "failed":
			case "cancelled":
				return "color-mix(in srgb, var(--vscode-errorForeground) 8%, var(--vscode-editor-background))"
			default:
				return "color-mix(in srgb, var(--vscode-badge-background) 80%, var(--vscode-editor-background))"
		}
	}};
	border: 1px solid ${({ $state }) => {
		switch ($state) {
			case "completed":
				return "color-mix(in srgb, var(--vscode-charts-green) 30%, var(--vscode-editor-background))"
			case "failed":
			case "cancelled":
				return "color-mix(in srgb, var(--vscode-errorForeground) 30%, var(--vscode-editor-background))"
			default:
				return "var(--vscode-badge-background)"
		}
	}};
	cursor: ${({ $state }) => ($state === "loading" ? "pointer" : "default")};
	transition: all 0.2s ease;

	.codicon {
		font-size: 16px;
		color: ${({ $state }) => {
			switch ($state) {
				case "completed":
					return "var(--vscode-charts-green)"
				case "failed":
				case "cancelled":
					return "var(--vscode-errorForeground)"
				default:
					return "var(--vscode-badge-foreground)"
			}
		}};
	}
`

export const ApiRequestTitle = styled.span<{ $state?: "loading" | "completed" | "failed" | "cancelled" }>`
	font-weight: 500;
	font-size: 13px;
	letter-spacing: 0.1px;
	color: ${({ $state }) => {
		switch ($state) {
			case "completed":
				return "var(--vscode-charts-green)"
			case "failed":
			case "cancelled":
				return "var(--vscode-errorForeground)"
			default:
				return "var(--vscode-foreground)"
		}
	}};
`

export const ApiRequestContent = styled.div<{ $state?: "loading" | "completed" | "failed" | "cancelled" }>`
	background: ${({ $state }) => {
		switch ($state) {
			case "completed":
				return "color-mix(in srgb, var(--vscode-charts-green) 4%, var(--vscode-textBlockQuote-background))"
			case "failed":
			case "cancelled":
				return "color-mix(in srgb, var(--vscode-errorForeground) 4%, var(--vscode-textBlockQuote-background))"
			default:
				return "var(--vscode-textBlockQuote-background)"
		}
	}};
	color: var(--vscode-foreground);
	border-radius: 4px;
	padding: 12px 16px;
	white-space: pre-line;
	overflow-wrap: break-word;
	border: 1px solid ${({ $state }) => {
		switch ($state) {
			case "completed":
				return "color-mix(in srgb, var(--vscode-charts-green) 15%, var(--vscode-editorGroup-border))"
			case "failed":
			case "cancelled":
				return "color-mix(in srgb, var(--vscode-errorForeground) 15%, var(--vscode-editorGroup-border))"
			default:
				return "var(--vscode-editorGroup-border)"
		}
	}};
	margin-top: 4px;
	font-size: 13px;
	line-height: 1.5;
	transition: border-color 0.2s ease;

	&:hover {
		border-color: ${({ $state }) => {
			switch ($state) {
				case "completed":
					return "color-mix(in srgb, var(--vscode-charts-green) 25%, var(--vscode-editorGroup-border))"
				case "failed":
				case "cancelled":
					return "color-mix(in srgb, var(--vscode-errorForeground) 25%, var(--vscode-editorGroup-border))"
				default:
					return "color-mix(in srgb, var(--vscode-editorGroup-border) 80%, var(--vscode-editor-foreground))"
			}
		}};
	}

	code {
		background: ${({ $state }) => {
			switch ($state) {
				case "completed":
					return "color-mix(in srgb, var(--vscode-charts-green) 8%, var(--vscode-textCodeBlock-background))"
				case "failed":
				case "cancelled":
					return "color-mix(in srgb, var(--vscode-errorForeground) 8%, var(--vscode-textCodeBlock-background))"
				default:
					return "var(--vscode-textCodeBlock-background)"
			}
		}};
		color: ${({ $state }) => {
			switch ($state) {
				case "completed":
					return "var(--vscode-charts-green)"
				case "failed":
				case "cancelled":
					return "var(--vscode-errorForeground)"
				default:
					return "var(--vscode-textPreformat-foreground)"
			}
		}};
		padding: 3px 6px;
		border-radius: 3px;
		font-size: 12px;
		font-family: var(--vscode-editor-font-family);
	}
`

export const SpinnerRing = styled.div`
	width: 18px;
	height: 18px;
	border: 2px solid var(--vscode-editorGroup-border);
	border-top: 2px solid var(--vscode-foreground);
	border-radius: 50%;
	animation: spin 1s linear infinite;
	transition: all 0.2s ease;

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
`

export const ProgressContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	position: relative;
	cursor: pointer;
`
