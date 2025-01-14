import { memo, useMemo } from "react"
import { getLanguageFromPath } from "../../utils/getLanguageFromPath"
import CodeBlock from "./CodeBlock"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { useThemeStyles } from "../../utils/theme"

interface CodeAccordianProps {
	code?: string
	diff?: string
	language?: string | undefined
	path?: string
	isFeedback?: boolean
	isConsoleLogs?: boolean
	isExpanded: boolean
	onToggleExpand: () => void
	isLoading?: boolean
}

/*
We need to remove leading non-alphanumeric characters from the path in order for our leading ellipses trick to work.
^: Anchors the match to the start of the string.
[^a-zA-Z0-9]+: Matches one or more characters that are not alphanumeric.
The replace method removes these matched characters, effectively trimming the string up to the first alphanumeric character.
*/
export const removeLeadingNonAlphanumeric = (path: string): string => path.replace(/^[^a-zA-Z0-9]+/, "")

const CodeAccordian = ({
	code,
	diff,
	language,
	path,
	isFeedback,
	isConsoleLogs,
	isExpanded,
	onToggleExpand,
	isLoading,
}: CodeAccordianProps) => {
	const { themeMode, themeType } = useExtensionState()
	const S = useThemeStyles('common/CodeAccordian', themeMode || 'dark', themeType || 'modern')

	const inferredLanguage = useMemo(
		() => code && (language ?? (path ? getLanguageFromPath(path) : undefined)),
		[path, language, code],
	)

	return (
		<S.Container mode={themeMode || 'dark'}>
			{(path || isFeedback || isConsoleLogs) && (
				<S.Header mode={themeMode || 'dark'} isLoading={isLoading} onClick={isLoading ? undefined : onToggleExpand}>
					{isFeedback || isConsoleLogs ? (
						<S.HeaderContent mode={themeMode || 'dark'}>
							<S.HeaderIcon mode={themeMode || 'dark'} className={`codicon codicon-${isFeedback ? "feedback" : "output"}`} />
							<S.HeaderText mode={themeMode || 'dark'}>{isFeedback ? "User Edits" : "Console Logs"}</S.HeaderText>
						</S.HeaderContent>
					) : (
						<>
							{path?.startsWith(".") && <span>.</span>}
							<S.PathText mode={themeMode || 'dark'}>{removeLeadingNonAlphanumeric(path ?? "") + "\u200E"}</S.PathText>
						</>
					)}
					<S.Spacer />
					<span className={`codicon codicon-chevron-${isExpanded ? "up" : "down"}`} />
				</S.Header>
			)}
			{(!(path || isFeedback || isConsoleLogs) || isExpanded) && (
				<S.CodeBlockContainer mode={themeMode || 'dark'}>
					<CodeBlock
						source={`${"```"}${diff !== undefined ? "diff" : inferredLanguage}\n${(
							code ??
							diff ??
							""
						).trim()}\n${"```"}`}
					/>
				</S.CodeBlockContainer>
			)}
		</S.Container>
	)
}

// memo does shallow comparison of props, so if you need it to re-render when a nested object changes, you need to pass a custom comparison function
export default memo(CodeAccordian)
