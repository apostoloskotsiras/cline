import { memo, useEffect } from "react"
import { useRemark } from "react-remark"
import rehypeHighlight, { Options } from "rehype-highlight"
import { visit } from "unist-util-visit"
import { useExtensionState } from "../../context/ExtensionStateContext"
import * as S from "../styles/themes/modern/dark/common/CodeBlock.styles"

interface CodeBlockProps {
	source?: string
	forceWrap?: boolean
}

const CodeBlock = memo(({ source, forceWrap = false }: CodeBlockProps) => {
	const { theme } = useExtensionState()
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
				pre: ({ node, ...preProps }: any) => <S.StyledPre {...preProps} theme={theme} />,
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
			<S.StyledMarkdown forceWrap={forceWrap}>{reactContent}</S.StyledMarkdown>
		</div>
	)
})

export default CodeBlock
