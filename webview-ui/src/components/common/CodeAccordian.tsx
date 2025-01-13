import { memo, useMemo } from "react"
import { getLanguageFromPath } from "../../utils/getLanguageFromPath"
import CodeBlock from "./CodeBlock"
import * as S from "../styles/themes/modern/components/common/CodeAccordian.styles"

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
	const inferredLanguage = useMemo(
		() => code && (language ?? (path ? getLanguageFromPath(path) : undefined)),
		[path, language, code],
	)

	return (
		<S.Container>
			{(path || isFeedback || isConsoleLogs) && (
				<S.Header isLoading={isLoading} onClick={isLoading ? undefined : onToggleExpand}>
					{isFeedback || isConsoleLogs ? (
						<S.HeaderContent>
							<S.HeaderIcon className={`codicon codicon-${isFeedback ? "feedback" : "output"}`} />
							<S.HeaderText>{isFeedback ? "User Edits" : "Console Logs"}</S.HeaderText>
						</S.HeaderContent>
					) : (
						<>
							{path?.startsWith(".") && <span>.</span>}
							<S.PathText>{removeLeadingNonAlphanumeric(path ?? "") + "\u200E"}</S.PathText>
						</>
					)}
					<S.Spacer />
					<span className={`codicon codicon-chevron-${isExpanded ? "up" : "down"}`} />
				</S.Header>
			)}
			{(!(path || isFeedback || isConsoleLogs) || isExpanded) && (
				<S.CodeBlockContainer>
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
