import { memo, useEffect } from "react"
import { useRemark } from "react-remark"
import rehypeHighlight, { Options } from "rehype-highlight"
import { visit } from "unist-util-visit"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { useThemeStyles } from "../../utils/theme"

interface CodeBlockProps {
	source?: string
	forceWrap?: boolean
}

const CodeBlock = memo(({ source, forceWrap = false }: CodeBlockProps) => {
	const { theme, themeMode, themeType } = useExtensionState()
	const { StyledPre, StyledMarkdown } = useThemeStyles('common/CodeBlock', themeMode || 'dark', themeType || 'modern')
	const [reactContent, setMarkdownSource] = useRemark({
		remarkPlugins: [
			() => {
				return (tree) => {
					visit(tree, "code", (node: any) => {
						if (!node.lang) {
							node.lang = "javascript"
						} else if (node.lang.includes(".")) {
							// if the langauge is a file, get the extension
							node.lang = node.lang.split(".").slice(-1)[0]
						}
					})
				}
			},
		],
		rehypePlugins: [
			rehypeHighlight as any,
			{
				// languages: {},
			} as Options,
		],
		rehypeReactOptions: {
			components: {
				pre: ({ node, ...preProps }: any) => <StyledPre {...preProps} theme={theme} mode={themeMode || 'dark'} />,
			},
		},
	})

	useEffect(() => {
		setMarkdownSource(source || "")
	}, [source, setMarkdownSource, theme])

	return (
		<div
			style={{
				overflowY: forceWrap ? "visible" : "auto",
				maxHeight: forceWrap ? "none" : "100%",
				backgroundColor: "var(--vscode-editor-background, --vscode-sideBar-background, rgb(30 30 30))",
			}}>
			<StyledMarkdown forceWrap={forceWrap} mode={themeMode || 'dark'}>{reactContent}</StyledMarkdown>
		</div>
	)
})

export default CodeBlock
