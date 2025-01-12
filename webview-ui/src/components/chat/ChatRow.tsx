import { VSCodeBadge, VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react"
import deepEqual from "fast-deep-equal"
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useEvent, useSize } from "react-use"
import * as S from "../styles/themes/modern/dark/chat/chatrow.styles"
import {
	ClineApiReqInfo,
	ClineAskUseMcpServer,
	ClineMessage,
	ClineSayTool,
	ExtensionMessage,
	COMPLETION_RESULT_CHANGES_FLAG,
} from "../../../../src/shared/ExtensionMessage"
import { COMMAND_OUTPUT_STRING, COMMAND_REQ_APP_STRING } from "../../../../src/shared/combineCommandSequences"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { findMatchingResourceOrTemplate } from "../../utils/mcp"
import { vscode } from "../../utils/vscode"
import { CheckpointOverlay } from "../common/CheckpointControls"
import CodeAccordian, { removeLeadingNonAlphanumeric } from "../common/CodeAccordian"
import CodeBlock from "../common/CodeBlock"
import MarkdownBlock from "../common/MarkdownBlock"
import SuccessButton from "../common/SuccessButton"
import Thumbnails from "../common/Thumbnails"
import McpResourceRow from "../mcp/McpResourceRow"
import McpToolRow from "../mcp/McpToolRow"
import { highlightMentions } from "./TaskHeader"

interface ChatRowProps {
	message: ClineMessage
	isExpanded: boolean
	onToggleExpand: () => void
	lastModifiedMessage?: ClineMessage
	isLast: boolean
	onHeightChange: (isTaller: boolean) => void
}

interface ChatRowContentProps extends Omit<ChatRowProps, "onHeightChange"> {}

const ChatRow = memo(
	(props: ChatRowProps) => {
		const { isLast, onHeightChange, message, lastModifiedMessage } = props
		const prevHeightRef = useRef(0)

		const apiState = useMemo(() => {
			if (message.text != null && message.say === "api_req_started") {
				const info: ClineApiReqInfo = JSON.parse(message.text || "{}")
				const { cost, cancelReason, streamingFailedMessage } = info

				// Get the request failed message if it exists
				const requestFailedMessage =
					isLast && lastModifiedMessage?.ask === "api_req_failed" ? lastModifiedMessage?.text : undefined

				// Use the exact same logic as the icon system
				if (cancelReason != null) {
					return { state: "cancelled" }
				} else if (cost != null) {
					return { state: "completed" }
				} else if (streamingFailedMessage || requestFailedMessage) {
					return {
						state: "failed",
						streamingFailedMessage,
						requestFailedMessage,
					}
				} else {
					return { state: "loading" }
				}
			}
			return { state: "none" }
		}, [message.text, message.say, isLast, lastModifiedMessage])

		let shouldShowCheckpoints =
			message.lastCheckpointHash != null &&
			(message.say === "tool" ||
				message.ask === "tool" ||
				message.say === "command" ||
				message.ask === "command" ||
				message.say === "completion_result" ||
				message.ask === "completion_result" ||
				message.say === "use_mcp_server" ||
				message.ask === "use_mcp_server")

		if (shouldShowCheckpoints && isLast) {
			shouldShowCheckpoints =
				lastModifiedMessage?.ask === "resume_completed_task" || lastModifiedMessage?.ask === "resume_task"
		}

		const [chatrow, { height }] = useSize(
			message.type === "ask" ? (
				<S.QuestionContainer>
					<ChatRowContent {...props} />
					{shouldShowCheckpoints && <CheckpointOverlay messageTs={message.ts} />}
				</S.QuestionContainer>
			) : (
				<S.UserMessageContainer
					className={`
				  ${apiState.state === "loading" && !apiState.requestFailedMessage && !apiState.streamingFailedMessage ? "loading-api" : ""}
				  ${apiState.state === "completed" ? "completed-api" : ""}
				  ${apiState.state === "cancelled" ? "cancelled-api" : ""}
				  ${apiState.state === "failed" || apiState.requestFailedMessage || apiState.streamingFailedMessage ? "failed-api" : ""}
				`}>
					<ChatRowContent {...props} />
					{shouldShowCheckpoints && <CheckpointOverlay messageTs={message.ts} />}
				</S.UserMessageContainer>
			),
		)

		useEffect(() => {
			// used for partials, command output, etc.
			// NOTE: it's important we don't distinguish between partial or complete here since our scroll effects in chatview need to handle height change during partial -> complete
			const isInitialRender = prevHeightRef.current === 0 // prevents scrolling when new element is added since we already scroll for that
			// height starts off at Infinity
			if (isLast && height !== 0 && height !== Infinity && height !== prevHeightRef.current) {
				if (!isInitialRender) {
					onHeightChange(height > prevHeightRef.current)
				}
				prevHeightRef.current = height
			}
		}, [height, isLast, onHeightChange, message])

		// we cannot return null as virtuoso does not support it, so we use a separate visibleMessages array to filter out messages that should not be rendered
		return chatrow
	},
	// memo does shallow comparison of props, so we need to do deep comparison of arrays/objects whose properties might change
	deepEqual,
)

export default ChatRow

export const ChatRowContent = ({ message, isExpanded, onToggleExpand, lastModifiedMessage, isLast }: ChatRowContentProps) => {
	const { mcpServers } = useExtensionState()

	const [seeNewChangesDisabled, setSeeNewChangesDisabled] = useState(false)

	const [cost, apiReqCancelReason, apiReqStreamingFailedMessage] = useMemo(() => {
		if (message.text != null && message.say === "api_req_started") {
			const info: ClineApiReqInfo = JSON.parse(message.text)
			return [info.cost, info.cancelReason, info.streamingFailedMessage]
		}
		return [undefined, undefined, undefined]
	}, [message.text, message.say])
	// when resuming task, last wont be api_req_failed but a resume_task message, so api_req_started will show loading spinner. that's why we just remove the last api_req_started that failed without streaming anything
	const apiRequestFailedMessage =
		isLast && lastModifiedMessage?.ask === "api_req_failed" // if request is retried then the latest message is a api_req_retried
			? lastModifiedMessage?.text
			: undefined
	const isCommandExecuting =
		isLast &&
		(lastModifiedMessage?.ask === "command" || lastModifiedMessage?.say === "command") &&
		lastModifiedMessage?.text?.includes(COMMAND_OUTPUT_STRING)

	const isMcpServerResponding = isLast && lastModifiedMessage?.say === "mcp_server_request_started"

	const type = message.type === "ask" ? message.ask : message.say

	const normalColor = "var(--vscode-foreground)"
	const errorColor = "var(--vscode-errorForeground)"
	const successColor = "var(--vscode-charts-green)"
	const cancelledColor = "var(--vscode-descriptionForeground)"

	const handleMessage = useCallback((event: MessageEvent) => {
		const message: ExtensionMessage = event.data
		switch (message.type) {
			case "relinquishControl": {
				setSeeNewChangesDisabled(false)
				break
			}
		}
	}, [])

	useEvent("message", handleMessage)

	const [icon, title] = useMemo(() => {
		switch (type) {
			case "error":
				return [
					<span
						className="codicon codicon-error"
						style={{
							color: errorColor,
							marginBottom: "-1.5px",
						}}></span>,
					<span style={{ color: errorColor, fontWeight: "bold" }}>Error</span>,
				]
			case "mistake_limit_reached":
				return [
					<span
						className="codicon codicon-error"
						style={{
							color: errorColor,
							marginBottom: "-1.5px",
						}}></span>,
					<span style={{ color: errorColor, fontWeight: "bold" }}>Cline is having trouble...</span>,
				]
			case "auto_approval_max_req_reached":
				return [
					<span
						className="codicon codicon-warning"
						style={{
							color: errorColor,
							marginBottom: "-1.5px",
						}}></span>,
					<span style={{ color: errorColor, fontWeight: "bold" }}>Maximum Requests Reached</span>,
				]
			case "command":
				return [
					<S.CommandIconContainer key="icon">
						{isCommandExecuting ? <ProgressIndicator /> : <span className="codicon codicon-terminal" />}
					</S.CommandIconContainer>,
					<S.CommandTitle key="title">
						{message.type === "ask" ? "Cline wants to execute this command:" : "Cline executed this command:"}
					</S.CommandTitle>,
				]
			case "use_mcp_server":
				const mcpServerUse = JSON.parse(message.text || "{}") as ClineAskUseMcpServer
				return [
					isMcpServerResponding ? (
						<ProgressIndicator />
					) : (
						<span
							className="codicon codicon-server"
							style={{
								color: normalColor,
								marginBottom: "-1.5px",
							}}></span>
					),
					<span style={{ color: normalColor, fontWeight: "bold" }}>
						{message.type === "ask" ? (
							<>
								Cline wants to {mcpServerUse.type === "use_mcp_tool" ? "use a tool" : "access a resource"} on the{" "}
								<code>{mcpServerUse.serverName}</code> MCP server:
							</>
						) : (
							<>
								Cline {mcpServerUse.type === "use_mcp_tool" ? "used a tool" : "accessed a resource"} on the{" "}
								<code>{mcpServerUse.serverName}</code> MCP server:
							</>
						)}
					</span>,
				]
			case "completion_result":
				return [
					<S.TaskCompletedIconContainer key="icon">
						<span className="codicon codicon-check" />
					</S.TaskCompletedIconContainer>,
					<S.TaskCompletedTitle key="title">Task Completed</S.TaskCompletedTitle>,
				]
			case "api_req_started":
				const getIconSpan = (iconName: string, color: string) => (
					<div
						style={{
							width: 16,
							height: 16,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}>
						<span
							className={`codicon codicon-${iconName}`}
							style={{
								color,
								fontSize: 16,
								marginBottom: "-1.5px",
							}}></span>
					</div>
				)
				return [
					apiReqCancelReason != null ? (
						apiReqCancelReason === "user_cancelled" ? (
							getIconSpan("error", cancelledColor)
						) : (
							getIconSpan("error", errorColor)
						)
					) : cost != null ? (
						getIconSpan("check", successColor)
					) : apiRequestFailedMessage ? (
						getIconSpan("error", errorColor)
					) : (
						<ProgressIndicator />
					),
					apiReqCancelReason != null ? (
						apiReqCancelReason === "user_cancelled" ? (
							<span
								style={{
									color: normalColor,
									fontWeight: "bold",
								}}>
								API Request Cancelled
							</span>
						) : (
							<span
								style={{
									color: errorColor,
									fontWeight: "bold",
								}}>
								API Streaming Failed
							</span>
						)
					) : cost != null ? (
						<span style={{ color: normalColor, fontWeight: "bold" }}>API Request</span>
					) : apiRequestFailedMessage ? (
						<span style={{ color: errorColor, fontWeight: "bold" }}>API Request Failed</span>
					) : (
						<span style={{ color: normalColor, fontWeight: "bold" }}>API Request...</span>
					),
				]
			case "followup":
				return [
					<S.QuestionIconContainer key="icon">
						<span className="codicon codicon-question" />
					</S.QuestionIconContainer>,
					<S.QuestionTitle key="title">Cline has a question:</S.QuestionTitle>,
				]
			default:
				return [null, null]
		}
	}, [
		type,
		cost,
		apiRequestFailedMessage,
		isCommandExecuting,
		apiReqCancelReason,
		isMcpServerResponding,
		message.text,
		message.type,
	])

	const headerStyle: React.CSSProperties = {
		display: "flex",
		alignItems: "center",
		gap: "10px",
		marginBottom: "12px",
	}

	const pStyle: React.CSSProperties = {
		margin: 0,
		whiteSpace: "pre-wrap",
		wordBreak: "break-word",
		overflowWrap: "anywhere",
	}

	const tool = useMemo(() => {
		if (message.ask === "tool" || message.say === "tool") {
			return JSON.parse(message.text || "{}") as ClineSayTool
		}
		return null
	}, [message.ask, message.say, message.text])

	if (tool) {
		const toolIcon = (name: string) => (
			<span
				className={`codicon codicon-${name}`}
				style={{
					color: "var(--vscode-foreground)",
					marginBottom: "-1.5px",
				}}></span>
		)

		switch (tool.tool) {
			case "editedExistingFile":
				return (
					<>
						<div style={headerStyle}>
							{toolIcon("edit")}
							<span style={{ fontWeight: "bold" }}>
								{message.type === "ask" ? "Cline wants to edit this file:" : "Cline is editing this file:"}
							</span>
						</div>
						<CodeAccordian
							// isLoading={message.partial}
							code={tool.content}
							path={tool.path!}
							isExpanded={isExpanded}
							onToggleExpand={onToggleExpand}
						/>
					</>
				)
			case "newFileCreated":
				return (
					<>
						<div style={headerStyle}>
							{toolIcon("new-file")}
							<span style={{ fontWeight: "bold" }}>
								{message.type === "ask" ? "Cline wants to create a new file:" : "Cline is creating a new file:"}
							</span>
						</div>
						<CodeAccordian
							isLoading={message.partial}
							code={tool.content!}
							path={tool.path!}
							isExpanded={isExpanded}
							onToggleExpand={onToggleExpand}
						/>
					</>
				)
			case "readFile":
				return (
					<>
						<div style={headerStyle}>
							{toolIcon("file-code")}
							<span style={{ fontWeight: "bold" }}>
								{message.type === "ask" ? "Cline wants to read this file:" : "Cline read this file:"}
							</span>
						</div>
						{/* <CodeAccordian
							code={tool.content!}
							path={tool.path!}
							isExpanded={isExpanded}
							onToggleExpand={onToggleExpand}
						/> */}
						<div
							style={{
								borderRadius: 3,
								backgroundColor: "var(--vscode-editor-background, --vscode-sideBar-background, rgb(30 30 30))",
								overflow: "hidden",
								border: "1px solid var(--vscode-editorGroup-border)",
							}}>
							<div
								style={{
									color: "var(--vscode-descriptionForeground)",
									display: "flex",
									alignItems: "center",
									padding: "9px 10px",
									cursor: "pointer",
									userSelect: "none",
									WebkitUserSelect: "none",
									MozUserSelect: "none",
									msUserSelect: "none",
								}}
								onClick={() => {
									vscode.postMessage({
										type: "openFile",
										text: tool.content,
									})
								}}>
								{tool.path?.startsWith(".") && <span>.</span>}
								<span
									style={{
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										marginRight: "8px",
										direction: "rtl",
										textAlign: "left",
									}}>
									{removeLeadingNonAlphanumeric(tool.path ?? "") + "\u200E"}
								</span>
								<div style={{ flexGrow: 1 }}></div>
								<span
									className={`codicon codicon-link-external`}
									style={{
										fontSize: 13.5,
										margin: "1px 0",
									}}></span>
							</div>
						</div>
					</>
				)
			case "listFilesTopLevel":
				return (
					<>
						<div style={headerStyle}>
							{toolIcon("folder-opened")}
							<span style={{ fontWeight: "bold" }}>
								{message.type === "ask"
									? "Cline wants to view the top level files in this directory:"
									: "Cline viewed the top level files in this directory:"}
							</span>
						</div>
						<CodeAccordian
							code={tool.content!}
							path={tool.path!}
							language="shell-session"
							isExpanded={isExpanded}
							onToggleExpand={onToggleExpand}
						/>
					</>
				)
			case "listFilesRecursive":
				return (
					<>
						<div style={headerStyle}>
							{toolIcon("folder-opened")}
							<span style={{ fontWeight: "bold" }}>
								{message.type === "ask"
									? "Cline wants to recursively view all files in this directory:"
									: "Cline recursively viewed all files in this directory:"}
							</span>
						</div>
						<CodeAccordian
							code={tool.content!}
							path={tool.path!}
							language="shell-session"
							isExpanded={isExpanded}
							onToggleExpand={onToggleExpand}
						/>
					</>
				)
			case "listCodeDefinitionNames":
				return (
					<>
						<div style={headerStyle}>
							{toolIcon("file-code")}
							<span style={{ fontWeight: "bold" }}>
								{message.type === "ask"
									? "Cline wants to view source code definition names used in this directory:"
									: "Cline viewed source code definition names used in this directory:"}
							</span>
						</div>
						<CodeAccordian
							code={tool.content!}
							path={tool.path!}
							isExpanded={isExpanded}
							onToggleExpand={onToggleExpand}
						/>
					</>
				)
			case "searchFiles":
				return (
					<>
						<div style={headerStyle}>
							{toolIcon("search")}
							<span style={{ fontWeight: "bold" }}>
								{message.type === "ask" ? (
									<>
										Cline wants to search this directory for <code>{tool.regex}</code>:
									</>
								) : (
									<>
										Cline searched this directory for <code>{tool.regex}</code>:
									</>
								)}
							</span>
						</div>
						<CodeAccordian
							code={tool.content!}
							path={tool.path! + (tool.filePattern ? `/(${tool.filePattern})` : "")}
							language="plaintext"
							isExpanded={isExpanded}
							onToggleExpand={onToggleExpand}
						/>
					</>
				)
			// case "inspectSite":
			// 	const isInspecting =
			// 		isLast && lastModifiedMessage?.say === "inspect_site_result" && !lastModifiedMessage?.images
			// 	return (
			// 		<>
			// 			<div style={headerStyle}>
			// 				{isInspecting ? <ProgressIndicator /> : toolIcon("inspect")}
			// 				<span style={{ fontWeight: "bold" }}>
			// 					{message.type === "ask" ? (
			// 						<>Cline wants to inspect this website:</>
			// 					) : (
			// 						<>Cline is inspecting this website:</>
			// 					)}
			// 				</span>
			// 			</div>
			// 			<div
			// 				style={{
			// 					borderRadius: 3,
			// 					border: "1px solid var(--vscode-editorGroup-border)",
			// 					overflow: "hidden",
			// 					backgroundColor: CODE_BLOCK_BG_COLOR,
			// 				}}>
			// 				<CodeBlock source={`${"```"}shell\n${tool.path}\n${"```"}`} forceWrap={true} />
			// 			</div>
			// 		</>
			// 	)
			default:
				return null
		}
	}

	if (message.ask === "command" || message.say === "command") {
		const splitMessage = (text: string) => {
			const outputIndex = text.indexOf(COMMAND_OUTPUT_STRING)
			if (outputIndex === -1) {
				return { command: text, output: "" }
			}
			return {
				command: text.slice(0, outputIndex).trim(),
				output: text
					.slice(outputIndex + COMMAND_OUTPUT_STRING.length)
					.trim()
					.split("")
					.map((char) => {
						switch (char) {
							case "\t":
								return "→   "
							case "\b":
								return "⌫"
							case "\f":
								return "⏏"
							case "\v":
								return "⇳"
							default:
								return char
						}
					})
					.join(""),
			}
		}

		const { command: rawCommand, output } = splitMessage(message.text || "")

		const requestsApproval = rawCommand.endsWith(COMMAND_REQ_APP_STRING)
		const command = requestsApproval ? rawCommand.slice(0, -COMMAND_REQ_APP_STRING.length) : rawCommand

		return (
			<>
				<div style={headerStyle}>
					{icon}
					{title}
				</div>
				<S.CommandContent>
					<CodeBlock source={`${"```"}shell\n${command}\n${"```"}`} forceWrap={true} />
					{output.length > 0 && (
						<div style={{ width: "100%" }}>
							<div
								onClick={onToggleExpand}
								style={{
									display: "flex",
									alignItems: "center",
									gap: "4px",
									width: "100%",
									justifyContent: "flex-start",
									cursor: "pointer",
									padding: `2px 8px ${isExpanded ? 0 : 8}px 8px`,
								}}>
								<span className={`codicon codicon-chevron-${isExpanded ? "down" : "right"}`}></span>
								<span style={{ fontSize: "0.8em" }}>Command Output</span>
							</div>
							{isExpanded && <CodeBlock source={`${"```"}shell\n${output}\n${"```"}`} />}
						</div>
					)}
				</S.CommandContent>
				{requestsApproval && (
					<S.CommandApprovalWarning>
						<i className="codicon codicon-warning" />
						<span>The model has determined this command requires explicit approval.</span>
					</S.CommandApprovalWarning>
				)}
			</>
		)
	}

	if (message.ask === "use_mcp_server" || message.say === "use_mcp_server") {
		const useMcpServer = JSON.parse(message.text || "{}") as ClineAskUseMcpServer
		const server = mcpServers.find((server) => server.name === useMcpServer.serverName)
		return (
			<>
				<div style={headerStyle}>
					{icon}
					{title}
				</div>

				<div
					style={{
						background: "var(--vscode-textCodeBlock-background)",
						borderRadius: "3px",
						padding: "8px 10px",
						marginTop: "8px",
					}}>
					{useMcpServer.type === "access_mcp_resource" && (
						<McpResourceRow
							item={{
								// Use the matched resource/template details, with fallbacks
								...(findMatchingResourceOrTemplate(
									useMcpServer.uri || "",
									server?.resources,
									server?.resourceTemplates,
								) || {
									name: "",
									mimeType: "",
									description: "",
								}),
								// Always use the actual URI from the request
								uri: useMcpServer.uri || "",
							}}
						/>
					)}

					{useMcpServer.type === "use_mcp_tool" && (
						<>
							<McpToolRow
								tool={{
									name: useMcpServer.toolName || "",
									description:
										server?.tools?.find((tool) => tool.name === useMcpServer.toolName)?.description || "",
								}}
							/>
							{useMcpServer.arguments && useMcpServer.arguments !== "{}" && (
								<div style={{ marginTop: "8px" }}>
									<div
										style={{
											marginBottom: "4px",
											opacity: 0.8,
											fontSize: "12px",
											textTransform: "uppercase",
										}}>
										Arguments
									</div>
									<CodeAccordian
										code={useMcpServer.arguments}
										language="json"
										isExpanded={true}
										onToggleExpand={onToggleExpand}
									/>
								</div>
							)}
						</>
					)}
				</div>
			</>
		)
	}

	switch (message.type) {
		case "say":
			switch (message.say) {
				case "api_req_started":
					return (
						<>
							<div
								style={{
									...headerStyle,
									marginBottom:
										(cost == null && apiRequestFailedMessage) || apiReqStreamingFailedMessage ? 10 : 0,
									justifyContent: "space-between",
									cursor: "pointer",
									userSelect: "none",
									WebkitUserSelect: "none",
									MozUserSelect: "none",
									msUserSelect: "none",
									position: "relative", // Add this
									zIndex: 1, // Add this to ensure content stays above glow effects
								}}
								onClick={onToggleExpand}>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "10px",
									}}>
									{icon}
									{title}
									{/* Need to render this everytime since it affects height of row by 2px */}
									<VSCodeBadge
										style={{
											opacity: cost != null && cost > 0 ? 1 : 0,
										}}>
										${Number(cost || 0)?.toFixed(4)}
									</VSCodeBadge>
								</div>
								<span className={`codicon codicon-chevron-${isExpanded ? "up" : "down"}`}></span>
							</div>
							{((cost == null && apiRequestFailedMessage) || apiReqStreamingFailedMessage) && (
								<>
									<p
										style={{
											...pStyle,
											color: "var(--vscode-errorForeground)",
										}}>
										{apiRequestFailedMessage || apiReqStreamingFailedMessage}
										{apiRequestFailedMessage?.toLowerCase().includes("powershell") && (
											<>
												<br />
												<br />
												It seems like you're having Windows PowerShell issues, please see this{" "}
												<a
													href="https://github.com/cline/cline/wiki/TroubleShooting-%E2%80%90-%22PowerShell-is-not-recognized-as-an-internal-or-external-command%22"
													style={{
														color: "inherit",
														textDecoration: "underline",
													}}>
													troubleshooting guide
												</a>
												.
											</>
										)}
									</p>

									{/* {apiProvider === "" && (
											<div
												style={{
													display: "flex",
													alignItems: "center",
													backgroundColor:
														"color-mix(in srgb, var(--vscode-errorForeground) 20%, transparent)",
													color: "var(--vscode-editor-foreground)",
													padding: "6px 8px",
													borderRadius: "3px",
													margin: "10px 0 0 0",
													fontSize: "12px",
												}}>
												<i
													className="codicon codicon-warning"
													style={{
														marginRight: 6,
														fontSize: 16,
														color: "var(--vscode-errorForeground)",
													}}></i>
												<span>
													Uh-oh, this could be a problem on end. We've been alerted and
													will resolve this ASAP. You can also{" "}
													<a
														href=""
														style={{ color: "inherit", textDecoration: "underline" }}>
														contact us
													</a>
													.
												</span>
											</div>
										)} */}
								</>
							)}

							{isExpanded && (
								<div style={{ marginTop: "10px" }}>
									<CodeAccordian
										code={JSON.parse(message.text || "{}").request}
										language="markdown"
										isExpanded={true}
										onToggleExpand={onToggleExpand}
									/>
								</div>
							)}
						</>
					)
				case "api_req_finished":
					return null // we should never see this message type
				case "text":
					return (
						<div>
							<Markdown markdown={message.text} />
						</div>
					)
				case "user_feedback":
					return (
						<>
							<S.UserMessageHeader>
								<S.UserIconContainer>
									<span className="codicon codicon-account" />
								</S.UserIconContainer>
								<S.UserMessageTitle>User's Message</S.UserMessageTitle>
							</S.UserMessageHeader>
							<S.UserMessageContent>
								<span style={{ display: "block" }}>{highlightMentions(message.text)}</span>
								{message.images && message.images.length > 0 && (
									<Thumbnails images={message.images} style={{ marginTop: "12px" }} />
								)}
							</S.UserMessageContent>
						</>
					)
				case "user_feedback_diff":
					const tool = JSON.parse(message.text || "{}") as ClineSayTool
					return (
						<div
							style={{
								marginTop: -10,
								width: "100%",
							}}>
							<CodeAccordian
								diff={tool.diff!}
								isFeedback={true}
								isExpanded={isExpanded}
								onToggleExpand={onToggleExpand}
							/>
						</div>
					)
				case "error":
					return (
						<>
							{title && (
								<div style={headerStyle}>
									{icon}
									{title}
								</div>
							)}
							<p
								style={{
									...pStyle,
									color: "var(--vscode-errorForeground)",
								}}>
								{message.text}
							</p>
						</>
					)
				case "diff_error":
					const diffErrorContainerStyle: React.CSSProperties = {
						display: "flex",
						flexDirection: "column",
						background: "linear-gradient(145deg, rgba(255, 145, 0, 0.15) 0%, rgba(255, 100, 0, 0.1) 100%)",
						padding: "12px",
						borderRadius: "6px",
						fontSize: "13px",
						border: "1px solid rgba(255, 145, 0, 0.2)",
						boxShadow: "0 4px 6px rgba(255, 145, 0, 0.05), 0 1px 3px rgba(255, 145, 0, 0.03)",
					}

					const diffErrorHeaderStyle: React.CSSProperties = {
						display: "flex",
						alignItems: "center",
						gap: "8px",
						marginBottom: "6px",
						fontWeight: 500,
						color: "rgba(255, 200, 100, 0.95)",
					}

					const diffErrorMessageStyle: React.CSSProperties = {
						lineHeight: 1.4,
						color: "rgba(255, 200, 100, 0.85)",
					}

					return (
						<div style={diffErrorContainerStyle}>
							<div style={diffErrorHeaderStyle}>
								<i className="codicon codicon-warning" style={{ fontSize: 16 }} />
								<span>Diff Edit Failed</span>
							</div>
							<div style={diffErrorMessageStyle}>
								This usually happens when the search patterns don't match the file content. The system will
								automatically retry with adjusted parameters.
							</div>
						</div>
					)
				case "completion_result":
					const hasChanges = message.text?.endsWith(COMPLETION_RESULT_CHANGES_FLAG) ?? false
					const text = hasChanges ? message.text?.slice(0, -COMPLETION_RESULT_CHANGES_FLAG.length) : message.text
					return (
						<>
							<S.TaskCompletedHeader>
								<S.TaskCompletedIconContainer>
									<span className="codicon codicon-check" />
								</S.TaskCompletedIconContainer>
								<S.TaskCompletedTitle>Task Completed</S.TaskCompletedTitle>
							</S.TaskCompletedHeader>
							<S.TaskCompletedContent>
								<Markdown markdown={text} />
							</S.TaskCompletedContent>
							{message.partial !== true && hasChanges && (
								<S.SeeNewChangesBtn
									disabled={seeNewChangesDisabled}
									onClick={() => {
										setSeeNewChangesDisabled(true)
										vscode.postMessage({
											type: "taskCompletionViewChanges",
											number: message.ts,
										})
									}}>
									<i className="codicon codicon-new-file" />
									See new changes
								</S.SeeNewChangesBtn>
							)}
						</>
					)
				case "shell_integration_warning":
					return (
						<>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									backgroundColor: "rgba(255, 191, 0, 0.1)",
									padding: 8,
									borderRadius: 3,
									fontSize: 12,
								}}>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										marginBottom: 4,
									}}>
									<i
										className="codicon codicon-warning"
										style={{
											marginRight: 8,
											fontSize: 18,
											color: "#FFA500",
										}}></i>
									<span
										style={{
											fontWeight: 500,
											color: "#FFA500",
										}}>
										Shell Integration Unavailable
									</span>
								</div>
								<div>
									Cline won't be able to view the command's output. Please update VSCode (
									<code>CMD/CTRL + Shift + P</code> → "Update") and make sure you're using a supported shell:
									zsh, bash, fish, or PowerShell (<code>CMD/CTRL + Shift + P</code> → "Terminal: Select Default
									Profile").{" "}
									<a
										href="https://github.com/cline/cline/wiki/Troubleshooting-%E2%80%90-Shell-Integration-Unavailable"
										style={{
											color: "inherit",
											textDecoration: "underline",
										}}>
										Still having trouble?
									</a>
								</div>
							</div>
						</>
					)
				case "mcp_server_response":
					return (
						<>
							<div style={{ paddingTop: 0 }}>
								<div
									style={{
										marginBottom: "4px",
										opacity: 0.8,
										fontSize: "12px",
										textTransform: "uppercase",
									}}>
									Response
								</div>
								<CodeAccordian
									code={message.text}
									language="json"
									isExpanded={true}
									onToggleExpand={onToggleExpand}
								/>
							</div>
						</>
					)
				default:
					return (
						<>
							{title && (
								<div style={headerStyle}>
									{icon}
									{title}
								</div>
							)}
							<div style={{ paddingTop: 10 }}>
								<Markdown markdown={message.text} />
							</div>
						</>
					)
			}
		case "ask":
			switch (message.ask) {
				case "mistake_limit_reached":
					return (
						<>
							<div style={headerStyle}>
								{icon}
								{title}
							</div>
							<p
								style={{
									...pStyle,
									color: "var(--vscode-errorForeground)",
								}}>
								{message.text}
							</p>
						</>
					)
				case "auto_approval_max_req_reached":
					return (
						<>
							<div style={headerStyle}>
								{icon}
								{title}
							</div>
							<p
								style={{
									...pStyle,
									color: "var(--vscode-errorForeground)",
								}}>
								{message.text}
							</p>
						</>
					)
				case "completion_result":
					if (message.text) {
						// FIXME: is this ever even used?
						const hasChanges = message.text.endsWith(COMPLETION_RESULT_CHANGES_FLAG) ?? false
						const text = hasChanges ? message.text.slice(0, -COMPLETION_RESULT_CHANGES_FLAG.length) : message.text
						return (
							<div>
								<div
									style={{
										...headerStyle,
										marginBottom: "10px",
									}}>
									{icon}
									{title}
								</div>
								<div
									style={{
										color: "var(--vscode-charts-green)",
										paddingTop: 10,
									}}>
									<Markdown markdown={text} />
									{message.partial !== true && hasChanges && (
										<div style={{ marginTop: 15 }}>
											<SuccessButton
												appearance="secondary"
												disabled={seeNewChangesDisabled}
												onClick={() => {
													setSeeNewChangesDisabled(true)
													vscode.postMessage({
														type: "taskCompletionViewChanges",
														number: message.ts,
													})
												}}>
												<i
													className="codicon codicon-new-file"
													style={{
														marginRight: 6,
														cursor: seeNewChangesDisabled ? "wait" : "pointer",
													}}
												/>
												See new changes
											</SuccessButton>
										</div>
									)}
								</div>
							</div>
						)
					} else {
						return null // Don't render anything when we get a completion_result ask without text
					}
				case "followup":
					return (
						<>
							{title && (
								<div style={headerStyle}>
									{icon}
									{title}
								</div>
							)}
							<S.QuestionContent>
								<Markdown markdown={message.text} />
							</S.QuestionContent>
						</>
					)
				default:
					return null
			}
	}
}

export const ProgressIndicator = () => (
	<div
		style={{
			width: "16px",
			height: "16px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		}}>
		<div style={{ transform: "scale(0.55)", transformOrigin: "center" }}>
			<VSCodeProgressRing />
		</div>
	</div>
)

const Markdown = memo(({ markdown }: { markdown?: string }) => {
	return (
		<div
			style={{
				wordBreak: "break-word",
				overflowWrap: "anywhere",
				marginBottom: -15,
				marginTop: -15,
			}}>
			<MarkdownBlock markdown={markdown} />
		</div>
	)
})
