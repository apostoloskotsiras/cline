import { CSSProperties } from "react"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { useThemeStyles } from "../../utils/theme"
import styled from "styled-components"

interface TagProps {
	value: string
	severity?: "primary" | "success" | "info" | "warning" | "danger" | "secondary" | "contrast"
	rounded?: boolean
	style?: CSSProperties
}

const StyledSpan = styled.span<{ $mode: 'light' | 'dark' }>`
	display: inline-block;
`

export const Tag = ({ value, severity = "primary", rounded = false, style }: TagProps) => {
	const { themeMode, themeType } = useExtensionState()
	const S = useThemeStyles('common/Tag', themeMode || 'dark', themeType || 'modern')

	return (
		<StyledSpan $mode={themeMode || 'dark'} style={{ ...S.getTagStyle(severity, rounded), ...style }}>
			{value}
		</StyledSpan>
	)
}
