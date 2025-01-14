import React from "react"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { useThemeStyles } from "../../utils/theme"
import { VscAdd, VscServer, VscHistory, VscSettingsGear, VscLinkExternal } from "react-icons/vsc"

interface NavBarProps {
	showSettings: boolean
	showHistory: boolean
	showMcp: boolean
	logoUrl: string
	onNewTask: () => void
	onMcpServers: () => void
	onHistory: () => void
	onSettings: () => void
	onPopout: () => void
}

const NavBar: React.FC<NavBarProps> = ({
	showSettings,
	showHistory,
	showMcp,
	logoUrl,
	onNewTask,
	onMcpServers,
	onHistory,
	onSettings,
	onPopout,
}) => {
	const { themeMode, themeType } = useExtensionState()
	const S = useThemeStyles('navigation/NavBar', themeMode || 'dark', themeType || 'modern')

	return (
		<S.NavContainer mode={themeMode || 'dark'}>
			<S.NavContent mode={themeMode || 'dark'}>
				<S.NavWrapper mode={themeMode || 'dark'}>
					<S.LogoContainer mode={themeMode || 'dark'}>
						<img src={logoUrl} alt="Cline" width={24} height={24} />
						<S.LogoText mode={themeMode || 'dark'}>Cline</S.LogoText>
					</S.LogoContainer>

					<S.ButtonContainer mode={themeMode || 'dark'}>
						<S.NavButton onClick={onNewTask} $isActive={!showSettings && !showHistory && !showMcp} mode={themeMode || 'dark'}>
							<S.ButtonIcon mode={themeMode || 'dark'}>
								<VscAdd />
							</S.ButtonIcon>
							<span>New Task</span>
						</S.NavButton>
						<S.NavButton onClick={onMcpServers} $isActive={showMcp} mode={themeMode || 'dark'}>
							<S.ButtonIcon mode={themeMode || 'dark'}>
								<VscServer />
							</S.ButtonIcon>
							<span>MCP Servers</span>
						</S.NavButton>
						<S.NavButton onClick={onHistory} $isActive={showHistory} mode={themeMode || 'dark'}>
							<S.ButtonIcon mode={themeMode || 'dark'}>
								<VscHistory />
							</S.ButtonIcon>
							<span>History</span>
						</S.NavButton>
						<S.NavButton onClick={onSettings} $isActive={showSettings} mode={themeMode || 'dark'}>
							<S.ButtonIcon mode={themeMode || 'dark'}>
								<VscSettingsGear />
							</S.ButtonIcon>
							<span>Settings</span>
						</S.NavButton>
						<S.NavButton onClick={onPopout} mode={themeMode || 'dark'}>
							<S.ButtonIcon mode={themeMode || 'dark'}>
								<VscLinkExternal />
							</S.ButtonIcon>
							<span>Open in Editor</span>
						</S.NavButton>
					</S.ButtonContainer>
				</S.NavWrapper>
			</S.NavContent>
		</S.NavContainer>
	)
}

export default NavBar
