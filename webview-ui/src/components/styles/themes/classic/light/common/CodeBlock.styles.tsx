import styled from "styled-components"

export const StyledMarkdown = styled.div<{ forceWrap: boolean }>`
	${({ forceWrap }) =>
		forceWrap &&
		`
    pre, code {
      white-space: pre-wrap;
      word-break: break-all;
      overflow-wrap: anywhere;
    }
  `}

	pre {
		background-color: var(--vscode-editor-background, --vscode-sideBar-background, rgb(30 30 30));
		border-radius: 5px;
		margin: 0;
		min-width: ${({ forceWrap }) => (forceWrap ? "auto" : "max-content")};
		padding: 10px 10px;
	}

	pre > code {
		.hljs-deletion {
			background-color: var(--vscode-diffEditor-removedTextBackground);
			display: inline-block;
			width: 100%;
		}
		.hljs-addition {
			background-color: var(--vscode-diffEditor-insertedTextBackground);
			display: inline-block;
			width: 100%;
		}
	}

	code {
		span.line:empty {
			display: none;
		}
		word-wrap: break-word;
		border-radius: 5px;
		background-color: var(--vscode-editor-background, --vscode-sideBar-background, rgb(30 30 30));
		font-size: var(--vscode-editor-font-size, var(--vscode-font-size, 12px));
		font-family: var(--vscode-editor-font-family);
	}

	code:not(pre > code) {
		font-family: var(--vscode-editor-font-family);
		color: #f78383;
	}

	background-color: var(--vscode-editor-background, --vscode-sideBar-background, rgb(30 30 30));
	font-family:
		var(--vscode-font-family),
		system-ui,
		-apple-system,
		BlinkMacSystemFont,
		"Segoe UI",
		Roboto,
		Oxygen,
		Ubuntu,
		Cantarell,
		"Open Sans",
		"Helvetica Neue",
		sans-serif;
	font-size: var(--vscode-editor-font-size, var(--vscode-font-size, 12px));
	color: var(--vscode-editor-foreground, #fff);

	p,
	li,
	ol,
	ul {
		line-height: 1.5;
	}
`

export const StyledPre = styled.pre<{ theme: any }>`
	& .hljs {
		color: var(--vscode-editor-foreground, #fff);
	}

	${(props) =>
		Object.keys(props.theme)
			.map((key) => {
				return `
      & ${key} {
        color: ${props.theme[key]};
      }
    `
			})
			.join("")}
` 