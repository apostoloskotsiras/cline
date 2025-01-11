import React from "react"
import * as S from "./NavBar.styles"
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
	return (
		<S.NavContainer>
			<S.NavContent>
				<S.NavWrapper>
					<S.LogoContainer>
						<img src={logoUrl} alt="Cline" width={24} height={24} />
						<S.LogoText>Cline</S.LogoText>
					</S.LogoContainer>

					<S.ButtonContainer>
						<S.NavButton onClick={onNewTask} $isActive={!showSettings && !showHistory && !showMcp}>
							<S.ButtonIcon>
								<VscAdd />
							</S.ButtonIcon>
							<span>New Task</span>
						</S.NavButton>
						<S.NavButton onClick={onMcpServers} $isActive={showMcp}>
							<S.ButtonIcon>
								<VscServer />
							</S.ButtonIcon>
							<span>MCP Servers</span>
						</S.NavButton>
						<S.NavButton onClick={onHistory} $isActive={showHistory}>
							<S.ButtonIcon>
								<VscHistory />
							</S.ButtonIcon>
							<span>History</span>
						</S.NavButton>
						<S.NavButton onClick={onSettings} $isActive={showSettings}>
							<S.ButtonIcon>
								<VscSettingsGear />
							</S.ButtonIcon>
							<span>Settings</span>
						</S.NavButton>
						<S.NavButton onClick={onPopout}>
							<S.ButtonIcon>
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
