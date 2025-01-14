import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import React, { useState } from "react"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { useThemeStyles } from "../../utils/theme"

type TabNavbarProps = {
	onPlusClick: () => void
	onHistoryClick: () => void
	onSettingsClick: () => void
}

type TooltipProps = {
	text: string
	isVisible: boolean
	position: { x: number; y: number }
	align?: "left" | "center" | "right"
}

const Tooltip: React.FC<TooltipProps> = ({ text, isVisible, position, align = "center" }) => {
	const { themeMode } = useExtensionState()
	const S = useThemeStyles('settings/TabNavbar', themeMode || 'dark', 'modern')
	
	return (
		<S.TooltipContainer isVisible={isVisible} x={position.x} y={position.y} align={align} mode={themeMode || 'dark'}>
			<S.TooltipArrow align={align} mode={themeMode || 'dark'} />
			{text}
		</S.TooltipContainer>
	)
}

const TabNavbar = ({ onPlusClick, onHistoryClick, onSettingsClick }: TabNavbarProps) => {
	const { themeMode, themeType } = useExtensionState()
	const S = useThemeStyles('settings/TabNavbar', themeMode || 'dark', themeType || 'modern')
	
	const [tooltip, setTooltip] = useState<TooltipProps>({
		text: "",
		isVisible: false,
		position: { x: 0, y: 0 },
		align: "center",
	})

	const showTooltip = (text: string, event: React.MouseEvent<HTMLElement>, align: "left" | "center" | "right" = "center") => {
		const rect = event.currentTarget.getBoundingClientRect()
		setTooltip({
			text,
			isVisible: true,
			position: { x: rect.left + rect.width / 2, y: rect.bottom + 7 },
			align,
		})
	}

	const hideTooltip = () => {
		setTooltip((prev) => ({ ...prev, isVisible: false }))
	}

	return (
		<>
			<S.NavbarContainer mode={themeMode || 'dark'}>
				<VSCodeButton
					onClick={onPlusClick}
					onMouseEnter={(e: React.MouseEvent<HTMLElement>) => showTooltip("New Chat", e, "center")}
					onMouseLeave={hideTooltip}
					onMouseMove={(e: React.MouseEvent<HTMLElement>) => showTooltip("New Chat", e, "center")}>
					<i className="codicon codicon-new-file"></i>
				</VSCodeButton>
				<VSCodeButton
					onClick={onHistoryClick}
					onMouseEnter={(e: React.MouseEvent<HTMLElement>) => showTooltip("History", e, "center")}
					onMouseLeave={hideTooltip}
					onMouseMove={(e: React.MouseEvent<HTMLElement>) => showTooltip("History", e, "center")}>
					<i className="codicon codicon-history"></i>
				</VSCodeButton>
				<VSCodeButton
					onClick={onSettingsClick}
					onMouseEnter={(e: React.MouseEvent<HTMLElement>) => showTooltip("Settings", e, "right")}
					onMouseLeave={hideTooltip}
					onMouseMove={(e: React.MouseEvent<HTMLElement>) => showTooltip("Settings", e, "right")}>
					<i className="codicon codicon-gear"></i>
				</VSCodeButton>
			</S.NavbarContainer>
			<Tooltip {...tooltip} />
		</>
	)
}

export default TabNavbar
