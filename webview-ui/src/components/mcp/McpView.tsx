import { VSCodeLink, VSCodePanels, VSCodePanelTab, VSCodePanelView } from "@vscode/webview-ui-toolkit/react"
import { useState, useCallback, memo } from "react"
import { vscode } from "../../utils/vscode"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { McpServer } from "../../../../src/shared/mcp"
import McpToolRow from "./McpToolRow"
import McpResourceRow from "./McpResourceRow"

type McpViewProps = {
	onDone: () => void
}

const McpView = memo(({ onDone }: McpViewProps) => {
	const { mcpServers: servers } = useExtensionState()
	// const [servers, setServers] = useState<McpServer[]>([
	// 	// Add some mock servers for testing
	// 	{
	// 		name: "local-tools",
	// 		config: JSON.stringify({
	// 			mcpServers: {
	// 				"local-tools": {
	// 					command: "npx",
	// 					args: ["-y", "@modelcontextprotocol/server-tools"],
	// 				},
	// 			},
	// 		}),
	// 		status: "connected",
	// 		tools: [
	// 			{
	// 				name: "execute_command",
	// 				description: "Run a shell command on the local system",
	// 			},
	// 			{
	// 				name: "read_file",
	// 				description: "Read contents of a file from the filesystem",
	// 			},
	// 		],
	// 	},
	// 	{
	// 		name: "postgres-db",
	// 		config: JSON.stringify({
	// 			mcpServers: {
	// 				"postgres-db": {
	// 					command: "npx",
	// 					args: ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"],
	// 				},
	// 			},
	// 		}),
	// 		status: "disconnected",
	// 		error: "Failed to connect to database: Connection refused",
	// 	},
	// 	{
	// 		name: "github-tools",
	// 		config: JSON.stringify({
	// 			mcpServers: {
	// 				"github-tools": {
	// 					command: "npx",
	// 					args: ["-y", "@modelcontextprotocol/server-github"],
	// 				},
	// 			},
	// 		}),
	// 		status: "connecting",
	// 		resources: [
	// 			{
	// 				uri: "github://repo/issues",
	// 				name: "Repository Issues",
	// 			},
	// 			{
	// 				uri: "github://repo/pulls",
	// 				name: "Pull Requests",
	// 			},
	// 		],
	// 	},
	// ])

	return (
		<div className="mcp-wrapper">
			<style>
				{`
					.mcp-wrapper {
						position: fixed;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background: linear-gradient(145deg, 
							rgba(15, 15, 15, 0.98) 0%,
							rgba(10, 10, 10, 0.98) 100%
						);
						backdrop-filter: blur(12px);
						display: flex;
						flex-direction: column;
						overflow: hidden;
						will-change: transform;
						transform: translateZ(0);
						backface-visibility: hidden;
					}

					.mcp-wrapper::before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background: radial-gradient(
							circle at 50% 0%,
							rgba(103, 58, 183, 0.08) 0%,
							rgba(81, 45, 168, 0.05) 25%,
							transparent 50%
						);
						pointer-events: none;
					}

					.mcp-container {
						height: 100%;
						display: flex;
						flex-direction: column;
						background: rgba(20, 20, 20, 0.85);
						backdrop-filter: blur(16px);
						position: relative;
						border-radius: 12px;
						margin: 12px;
						box-shadow: 
							0 4px 6px rgba(0, 0, 0, 0.1),
							0 1px 3px rgba(0, 0, 0, 0.08);
						border: 1px solid rgba(255, 255, 255, 0.08);
						will-change: transform;
						transform: translateZ(0);
						backface-visibility: hidden;
					}

					.mcp-container::before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						height: 1px;
						background: linear-gradient(
							90deg,
							transparent 0%,
							rgba(103, 58, 183, 0.1) 50%,
							transparent 100%
						);
					}

					.mcp-header {
						background: transparent;
						border-bottom: 1px solid rgba(255, 255, 255, 0.06);
						padding: 12px 16px;
						display: flex;
						justify-content: space-between;
						align-items: center;
					}

					.mcp-title {
						display: flex;
						align-items: center;
						gap: 8px;
						color: var(--vscode-foreground);
					}

					.mcp-title i {
						font-size: 16px;
						opacity: 0.8;
					}

					.mcp-title span {
						font-size: 13px;
						font-weight: 500;
						letter-spacing: 0.3px;
					}

					.done-button {
						padding: 4px 12px;
						font-size: 11px;
						border-radius: 4px;
						background: rgba(103, 58, 183, 0.1);
						border: 1px solid rgba(103, 58, 183, 0.2);
						color: var(--vscode-foreground);
						cursor: pointer;
						display: flex;
						align-items: center;
						gap: 6px;
						transition: all 0.2s ease;
					}

					.done-button:hover {
						background: rgba(103, 58, 183, 0.2);
						border-color: rgba(103, 58, 183, 0.3);
					}

					.done-button i {
						font-size: 14px;
						opacity: 0.8;
					}

					.mcp-content {
						flex: 1;
						overflow-y: auto;
						padding: 16px 20px;
						display: flex;
						flex-direction: column;
						/* Hide scrollbar for Chrome/Safari/Opera */
						&::-webkit-scrollbar {
							display: none;
						}
						/* Hide scrollbar for IE, Edge and Firefox */
						-ms-overflow-style: none;
						scrollbar-width: none;
					}

					.mcp-content-inner {
						flex: 1;
						display: flex;
						flex-direction: column;
					}

					.mcp-settings-button-container {
						margin-top: auto;
						padding: 10px 0;
						width: 100%;
						position: sticky;
						bottom: 0;
						background: rgba(20, 20, 20, 0.85);
						backdrop-filter: blur(16px);
					}

					.mcp-settings-button {
						padding: 8px 12px;
						font-size: 11px;
						border-radius: 4px;
						background: rgba(103, 58, 183, 0.1);
						border: 1px solid rgba(103, 58, 183, 0.2);
						color: var(--vscode-foreground);
						cursor: pointer;
						display: flex;
						align-items: center;
						justify-content: center;
						gap: 6px;
						transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
						width: 100%;
						margin: 0 auto;
						max-width: calc(100% - 40px); /* This ensures the button stays within bounds */
						transform: translateZ(0);
						backface-visibility: hidden;
					}

					.mcp-settings-button:hover {
						background: rgba(103, 58, 183, 0.2);
						border-color: rgba(103, 58, 183, 0.3);
						transform: translateY(-1px);
					}

					.mcp-settings-button i {
						font-size: 14px;
						opacity: 0.8;
					}

					.mcp-settings-button span {
						font-weight: 500;
						opacity: 0.9;
					}

					.server-card {
						background: rgba(25, 25, 25, 0.95);
						border-radius: 12px;
						border: 1px solid rgba(255, 255, 255, 0.06);
						overflow: hidden;
						transition: all 0.2s ease;
						margin-bottom: 10px;
					}

					.server-card:hover {
						border-color: rgba(103, 58, 183, 0.2);
						transform: translateY(-1px);
					}

					.server-header {
						display: flex;
						align-items: center;
						padding: 12px 16px;
						cursor: pointer;
						background: rgba(30, 30, 30, 0.95);
						border-bottom: 1px solid rgba(255, 255, 255, 0.06);
					}

					.server-content {
						background: rgba(25, 25, 25, 0.95);
						padding: 16px;
						font-size: 13px;
					}

					.mcp-button {
						padding: 8px 12px;
						font-size: 11px;
						border-radius: 4px;
						background: rgba(103, 58, 183, 0.1);
						border: 1px solid rgba(103, 58, 183, 0.2);
						color: var(--vscode-foreground);
						cursor: pointer;
						display: flex;
						align-items: center;
						justify-content: center;
						gap: 6px;
						transition: all 0.2s ease;
						width: 100%;
						margin: 8px 0;
					}

					.mcp-button:hover {
						background: rgba(103, 58, 183, 0.2);
						border-color: rgba(103, 58, 183, 0.3);
						transform: translateY(-1px);
					}

					.mcp-button:disabled {
						opacity: 0.5;
						cursor: not-allowed;
						transform: none;
					}

					.mcp-button i {
						font-size: 14px;
						opacity: 0.8;
					}

					.status-indicator {
						width: 8px;
						height: 8px;
						border-radius: 50%;
						margin-left: 8px;
						transition: all 0.2s ease;
					}

					.status-connected {
						background: var(--vscode-testing-iconPassed);
						box-shadow: 0 0 8px rgba(var(--vscode-testing-iconPassed), 0.4);
					}

					.status-connecting {
						background: var(--vscode-charts-yellow);
						box-shadow: 0 0 8px rgba(var(--vscode-charts-yellow), 0.4);
					}

					.status-disconnected {
						background: var(--vscode-testing-iconFailed);
						box-shadow: 0 0 8px rgba(var(--vscode-testing-iconFailed), 0.4);
					}

					vscode-panels {
						background: transparent;
						border-radius: 8px;
						overflow: hidden;
						margin: 8px 0;
					}

					vscode-panel-tab {
						background: rgba(103, 58, 183, 0.1);
						border: none;
						padding: 8px 16px;
						font-size: 12px;
					}

					vscode-panel-tab[selected] {
						background: rgba(103, 58, 183, 0.2);
						border-bottom: 2px solid rgba(103, 58, 183, 0.3);
					}

					vscode-panel-view {
						background: rgba(30, 30, 30, 0.4);
						padding: 16px;
						border-radius: 0 0 8px 8px;
					}
				`}
			</style>

			<div className="mcp-container">
				<header className="mcp-header">
					<div className="mcp-title">
						<i className="codicon codicon-server"></i>
						<span>MCP SERVERS</span>
				</div>
					<div 
						className="done-button"
						onClick={onDone}
					>
						<i className="codicon codicon-check"></i>
						<span>Done</span>
					</div>
				</header>

				<McpContent servers={servers} />
			</div>
		</div>
	)
})

// Server Row Component
const ServerRow = memo(({ server }: { server: McpServer }) => {
	const [isExpanded, setIsExpanded] = useState(false)


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
		<div className="server-card">
			<div className="server-header" onClick={handleRowClick}>
				{!server.error && (
					<i 
						className={`codicon codicon-chevron-${isExpanded ? "down" : "right"}`} 
						style={{ marginRight: "8px", fontSize: "14px", opacity: 0.8 }}
					/>
				)}
				<span style={{ flex: 1 }}>{server.name}</span>
				<div className={`status-indicator status-${server.status}`} />
			</div>

			{server.error ? (
				<div className="server-content">
					<div style={{
							color: "var(--vscode-testing-iconFailed)",
							marginBottom: "8px",
						}}>
						{server.error}
					</div>
					<button
						className="mcp-button"
						onClick={handleRestart}
						disabled={server.status === "connecting"}
					>
						<i className="codicon codicon-debug-restart"></i>
						<span>{server.status === "connecting" ? "Retrying..." : "Retry Connection"}</span>
					</button>
				</div>
			) : (
				isExpanded && (
					<div className="server-content">
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
									<div
										style={{
											padding: "10px 0",
											color: "var(--vscode-descriptionForeground)",
										}}>
										No tools found
									</div>
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
									<div
										style={{
											padding: "10px 0",
											color: "var(--vscode-descriptionForeground)",
										}}>
										No resources found
									</div>
								)}
							</VSCodePanelView>
						</VSCodePanels>

						<button
							className="mcp-button"
							onClick={handleRestart}
							disabled={server.status === "connecting"}
						>
							<i className="codicon codicon-debug-restart"></i>
							<span>{server.status === "connecting" ? "Restarting..." : "Restart Server"}</span>
						</button>
					</div>
				)
			)}
		</div>
	)
})

// Memoize the content section
const McpContent = memo(({ servers }: { servers: McpServer[] }) => {
	const handleOpenSettings = useCallback(() => {
		vscode.postMessage({ type: "openMcpSettings" })
	}, [])

	return (
		<div className="mcp-content">
			<div className="mcp-content-inner">
				<div style={{
					color: "var(--vscode-foreground)",
					fontSize: "13px",
					marginBottom: "20px",
					marginTop: "5px",
				}}>
					The{" "}
					<VSCodeLink href="https://github.com/modelcontextprotocol" style={{ display: "inline" }}>
						Model Context Protocol
					</VSCodeLink>{" "}
					enables communication with locally running MCP servers that provide additional tools and resources to extend
					Cline's capabilities. You can use{" "}
					<VSCodeLink href="https://github.com/modelcontextprotocol/servers" style={{ display: "inline" }}>
						community-made servers
					</VSCodeLink>{" "}
					or ask Cline to create new tools specific to your workflow (e.g., "add a tool that gets the latest npm docs").{" "}
					<VSCodeLink href="https://x.com/sdrzn/status/1867271665086074969" style={{ display: "inline" }}>
						See a demo here.
					</VSCodeLink>
				</div>

				{servers.length > 0 && (
					<div style={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
					}}>
						{servers.map((server) => (
							<ServerRow key={server.name} server={server} />
						))}
					</div>
				)}
			</div>

			<div className="mcp-settings-button-container">
				<div 
					className="mcp-settings-button"
					onClick={handleOpenSettings}
				>
					<i className="codicon codicon-edit"></i>
					<span>Edit MCP Settings</span>
				</div>
			</div>
		</div>
	)
})

export default McpView
