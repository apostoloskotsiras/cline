import { CSSProperties } from "react"
import * as S from "../styles/themes/modern/components/common/Tag.styles"

interface TagProps {
	value: string
	severity?: "primary" | "success" | "info" | "warning" | "danger" | "secondary" | "contrast"
	rounded?: boolean
	style?: CSSProperties
}

export const Tag = ({ value, severity = "primary", rounded = false, style }: TagProps) => {
	return (
		<span style={{ ...S.getTagStyle(severity, rounded), ...style }}>
			{value}
		</span>
	)
}
