import { VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import { VSCodePanels, VSCodePanelTab, VSCodePanelView } from "@vscode/webview-ui-toolkit/react"
import { useState, useCallback, memo } from "react"
import { vscode } from "../../utils/vscode"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { McpServer } from "../../../../src/shared/mcp"
import McpToolRow from "./McpToolRow"
import McpResourceRow from "./McpResourceRow"
import { useThemeStyles } from "../../utils/theme"

type McpViewProps = {
	onDone: () => void
}

type McpContentProps = {
	servers: McpServer[]
}

type ServerRowProps = {
	server: McpServer
}

const ServerRow = memo(({ server }: ServerRowProps) => {
	const { themeMode , themeType } = useExtensionState()
	const [isExpanded, setIsExpanded] = useState(false)
	const S = useThemeStyles('mcp/McpView', themeMode || 'dark', themeType || 'modern')

	const handleRowClick = () => {
		if (!server.error) {
			setIsExpanded(!isExpanded)
		}
	}

	const handleRestart = () => {
		vscode.postMessage({
			type: "restartMcpServer",
			text: server.name,
		})
	}

	return (
		<S.ServerCard>
			<S.ServerHeader onClick={handleRowClick}>
				{!server.error && <S.ChevronIcon expanded={isExpanded} />}
				<span style={{ flex: 1 }}>{server.name}</span>
				<S.StatusIndicator status={server.status} />
			</S.ServerHeader>

			{server.error ? (
				<S.ServerContent>
					<S.ErrorMessage>{server.error}</S.ErrorMessage>
					<S.Button onClick={handleRestart} disabled={server.status === "connecting"}>
						<S.ButtonIcon className="codicon codicon-debug-restart" />
						<span>{server.status === "connecting" ? "Retrying..." : "Retry Connection"}</span>
					</S.Button>
				</S.ServerContent>
			) : (
				isExpanded && (
					<S.ServerContent>
						<VSCodePanels>
							<VSCodePanelTab id="tools">Tools ({server.tools?.length || 0})</VSCodePanelTab>
							<VSCodePanelTab id="resources">
								Resources ({[...(server.resourceTemplates || []), ...(server.resources || [])].length || 0})
							</VSCodePanelTab>

							<VSCodePanelView id="tools-view">
								{server.tools && server.tools.length > 0 ? (
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											gap: "8px",
											width: "100%",
										}}>
										{server.tools.map((tool) => (
											<McpToolRow key={tool.name} tool={tool} />
										))}
									</div>
								) : (
									<S.NoContentMessage>No tools found</S.NoContentMessage>
								)}
							</VSCodePanelView>

							<VSCodePanelView id="resources-view">
								{(server.resources && server.resources.length > 0) ||
								(server.resourceTemplates && server.resourceTemplates.length > 0) ? (
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											gap: "8px",
											width: "100%",
										}}>
										{[...(server.resourceTemplates || []), ...(server.resources || [])].map((item) => (
											<McpResourceRow
												key={"uriTemplate" in item ? item.uriTemplate : item.uri}
												item={item}
											/>
										))}
									</div>
								) : (
									<S.NoContentMessage>No resources found</S.NoContentMessage>
								)}
							</VSCodePanelView>
						</VSCodePanels>

						<S.Button onClick={handleRestart} disabled={server.status === "connecting"}>
							<S.ButtonIcon className="codicon codicon-debug-restart" />
							<span>{server.status === "connecting" ? "Restarting..." : "Restart Server"}</span>
						</S.Button>
					</S.ServerContent>
				)
			)}
		</S.ServerCard>
	)
})

const McpContent = memo(({ servers }: McpContentProps) => {
	const handleOpenSettings = useCallback(() => {
		vscode.postMessage({ type: "openMcpSettings" })
	}, [])
	const { themeMode , themeType } = useExtensionState()
	const S = useThemeStyles('mcp/McpView', themeMode || 'dark', themeType || 'modern')

	return (
		<S.Content>
			<S.ContentInner>
				<S.Description>
					The{" "}
					<S.StyledLink href="https://github.com/modelcontextprotocol">
						Model Context Protocol
					</S.StyledLink>{" "}
					enables communication with locally running MCP servers that provide additional tools and resources to extend
					Cline's capabilities. You can use{" "}
					<S.StyledLink href="https://github.com/modelcontextprotocol/servers">
						community-made servers
					</S.StyledLink>{" "}
					or ask Cline to create new tools specific to your workflow (e.g., "add a tool that gets the latest npm docs").{" "}
					<S.StyledLink href="https://x.com/sdrzn/status/1867271665086074969">
						See a demo here.
					</S.StyledLink>
				</S.Description>

				{servers.length > 0 && (
					<S.ServerList>
						{servers.map((server) => (
							<ServerRow key={server.name} server={server} />
						))}
					</S.ServerList>
				)}
			</S.ContentInner>

			<S.SettingsButtonContainer>
				<S.SettingsButton onClick={handleOpenSettings}>
					<S.ButtonIcon className="codicon codicon-edit" />
					<span>Edit MCP Settings</span>
				</S.SettingsButton>
			</S.SettingsButtonContainer>
		</S.Content>
	)
})

const McpView = memo(({ onDone }: McpViewProps) => {
	const { mcpServers: servers , themeMode , themeType } = useExtensionState()
	const S = useThemeStyles('mcp/McpView', themeMode || 'dark', themeType || 'modern')

	return (
		<S.Wrapper className="mcp-wrapper">
			<S.Container>
				<S.Header>
					<S.Title>
						<S.TitleIcon />
						<S.TitleText>MCP SERVERS</S.TitleText>
					</S.Title>
					<S.DoneButton onClick={onDone}>
						<S.DoneButtonIcon />
						<span>Done</span>
					</S.DoneButton>
				</S.Header>

				<McpContent servers={servers} />
			</S.Container>
		</S.Wrapper>
	)
})

export default McpView
