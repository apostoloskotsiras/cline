import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import debounce from "debounce"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useDeepCompareEffect, useEvent, useMount } from "react-use"
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso"
import {
	ClineAsk,
	ClineMessage,
	ClineSayBrowserAction,
	ClineSayTool,
	ExtensionMessage,
} from "../../../../src/shared/ExtensionMessage"
import { findLast } from "../../../../src/shared/array"
import { combineApiRequests } from "../../../../src/shared/combineApiRequests"
import { combineCommandSequences } from "../../../../src/shared/combineCommandSequences"
import { getApiMetrics } from "../../../../src/shared/getApiMetrics"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { vscode } from "../../utils/vscode"
import HistoryPreview from "../history/HistoryPreview"
import { normalizeApiConfiguration } from "../settings/ApiOptions"
import Announcement from "./Announcement"
import BrowserSessionRow from "./BrowserSessionRow"
import ChatRow from "./ChatRow"
import ChatTextArea from "./ChatTextArea"
import TaskHeader from "./TaskHeader"
import AutoApproveMenu from "./AutoApproveMenu"
import * as S from "../styles/chat/ChatView.styles"

interface ChatViewProps {
	isHidden: boolean
	showAnnouncement: boolean
	hideAnnouncement: () => void
	showHistoryView: () => void
}

export const MAX_IMAGES_PER_MESSAGE = 20 // Anthropic limits to 20 images

const ChatView = ({ isHidden, showAnnouncement, hideAnnouncement, showHistoryView }: ChatViewProps) => {
	const { version, clineMessages: messages, taskHistory, apiConfiguration } = useExtensionState()

	const task = useMemo(() => messages.at(0), [messages])
	const modifiedMessages = useMemo(() => combineApiRequests(combineCommandSequences(messages.slice(1))), [messages])
	const apiMetrics = useMemo(() => getApiMetrics(modifiedMessages), [modifiedMessages])

	const [inputValue, setInputValue] = useState("")
	const textAreaRef = useRef<HTMLTextAreaElement>(null)
	const [textAreaDisabled, setTextAreaDisabled] = useState(false)
	const [selectedImages, setSelectedImages] = useState<string[]>([])

	const [clineAsk, setClineAsk] = useState<ClineAsk | undefined>(undefined)
	const [enableButtons, setEnableButtons] = useState<boolean>(false)
	const [primaryButtonText, setPrimaryButtonText] = useState<string | undefined>("Approve")
	const [secondaryButtonText, setSecondaryButtonText] = useState<string | undefined>("Reject")
	const [didClickCancel, setDidClickCancel] = useState(false)
	const virtuosoRef = useRef<VirtuosoHandle>(null)
	const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})
	const scrollContainerRef = useRef<HTMLDivElement>(null)
	const disableAutoScrollRef = useRef(false)
	const [showScrollToBottom, setShowScrollToBottom] = useState(false)
	const [isAtBottom, setIsAtBottom] = useState(false)

	const lastMessage = useMemo(() => messages.at(-1), [messages])
	const secondLastMessage = useMemo(() => messages.at(-2), [messages])

	useDeepCompareEffect(() => {
		if (lastMessage) {
			switch (lastMessage.type) {
				case "ask":
					const isPartial = lastMessage.partial === true
					switch (lastMessage.ask) {
						case "api_req_failed":
							setTextAreaDisabled(true)
							setClineAsk("api_req_failed")
							setEnableButtons(true)
							setPrimaryButtonText("Retry")
							setSecondaryButtonText("Start New Task")
							break
						case "mistake_limit_reached":
							setTextAreaDisabled(false)
							setClineAsk("mistake_limit_reached")
							setEnableButtons(true)
							setPrimaryButtonText("Proceed Anyways")
							setSecondaryButtonText("Start New Task")
							break
						case "auto_approval_max_req_reached":
							setTextAreaDisabled(true)
							setClineAsk("auto_approval_max_req_reached")
							setEnableButtons(true)
							setPrimaryButtonText("Proceed")
							setSecondaryButtonText("Start New Task")
							break
						case "followup":
							setTextAreaDisabled(isPartial)
							setClineAsk("followup")
							setEnableButtons(isPartial)
							break
						case "tool":
							setTextAreaDisabled(isPartial)
							setClineAsk("tool")
							setEnableButtons(!isPartial)
							const tool = JSON.parse(lastMessage.text || "{}") as ClineSayTool
							switch (tool.tool) {
								case "editedExistingFile":
								case "newFileCreated":
									setPrimaryButtonText("Save")
									setSecondaryButtonText("Reject")
									break
								default:
									setPrimaryButtonText("Approve")
									setSecondaryButtonText("Reject")
									break
							}
							break
						case "browser_action_launch":
							setTextAreaDisabled(isPartial)
							setClineAsk("browser_action_launch")
							setEnableButtons(!isPartial)
							setPrimaryButtonText("Approve")
							setSecondaryButtonText("Reject")
							break
						case "command":
							setTextAreaDisabled(isPartial)
							setClineAsk("command")
							setEnableButtons(!isPartial)
							setPrimaryButtonText("Run Command")
							setSecondaryButtonText("Reject")
							break
						case "command_output":
							setTextAreaDisabled(false)
							setClineAsk("command_output")
							setEnableButtons(true)
							setPrimaryButtonText("Proceed While Running")
							setSecondaryButtonText(undefined)
							break
						case "use_mcp_server":
							setTextAreaDisabled(isPartial)
							setClineAsk("use_mcp_server")
							setEnableButtons(!isPartial)
							setPrimaryButtonText("Approve")
							setSecondaryButtonText("Reject")
							break
						case "completion_result":
							setTextAreaDisabled(isPartial)
							setClineAsk("completion_result")
							setEnableButtons(!isPartial)
							setPrimaryButtonText("Start New Task")
							setSecondaryButtonText(undefined)
							break
						case "resume_task":
							setTextAreaDisabled(false)
							setClineAsk("resume_task")
							setEnableButtons(true)
							setPrimaryButtonText("Resume Task")
							setSecondaryButtonText(undefined)
							setDidClickCancel(false)
							break
						case "resume_completed_task":
							setTextAreaDisabled(false)
							setClineAsk("resume_completed_task")
							setEnableButtons(true)
							setPrimaryButtonText("Start New Task")
							setSecondaryButtonText(undefined)
							setDidClickCancel(false)
							break
					}
					break
				case "say":
					switch (lastMessage.say) {
						case "api_req_started":
							if (secondLastMessage?.ask === "command_output") {
								setInputValue("")
								setTextAreaDisabled(true)
								setSelectedImages([])
								setClineAsk(undefined)
								setEnableButtons(false)
							}
							break
						case "task":
						case "error":
						case "api_req_finished":
						case "text":
						case "browser_action":
						case "browser_action_result":
						case "browser_action_launch":
						case "command":
						case "use_mcp_server":
						case "command_output":
						case "mcp_server_request_started":
						case "mcp_server_response":
						case "completion_result":
						case "tool":
							break
					}
					break
			}
		}
	}, [lastMessage, secondLastMessage])

	useEffect(() => {
		if (messages.length === 0) {
			setTextAreaDisabled(false)
			setClineAsk(undefined)
			setEnableButtons(false)
			setPrimaryButtonText("Approve")
			setSecondaryButtonText("Reject")
		}
	}, [messages.length])

	useEffect(() => {
		setExpandedRows({})
	}, [task?.ts])

	const isStreaming = useMemo(() => {
		const isLastAsk = !!modifiedMessages.at(-1)?.ask
		const isToolCurrentlyAsking = isLastAsk && clineAsk !== undefined && enableButtons && primaryButtonText !== undefined
		if (isToolCurrentlyAsking) {
			return false
		}

		const isLastMessagePartial = modifiedMessages.at(-1)?.partial === true
		if (isLastMessagePartial) {
			return true
		} else {
			const lastApiReqStarted = findLast(modifiedMessages, (message) => message.say === "api_req_started")
			if (lastApiReqStarted && lastApiReqStarted.text != null && lastApiReqStarted.say === "api_req_started") {
				const cost = JSON.parse(lastApiReqStarted.text).cost
				if (cost === undefined) {
					return true
				}
			}
		}

		return false
	}, [modifiedMessages, clineAsk, enableButtons, primaryButtonText])

	const handleSendMessage = useCallback(
		(text: string, images: string[]) => {
			text = text.trim()
			if (text || images.length > 0) {
				if (messages.length === 0) {
					vscode.postMessage({ type: "newTask", text, images })
				} else if (clineAsk) {
					switch (clineAsk) {
						case "followup":
						case "tool":
						case "browser_action_launch":
						case "command":
						case "command_output":
						case "use_mcp_server":
						case "completion_result":
						case "resume_task":
						case "resume_completed_task":
						case "mistake_limit_reached":
							vscode.postMessage({
								type: "askResponse",
								askResponse: "messageResponse",
								text,
								images,
							})
							break
					}
				}
				setInputValue("")
				setTextAreaDisabled(true)
				setSelectedImages([])
				setClineAsk(undefined)
				setEnableButtons(false)
				disableAutoScrollRef.current = false
			}
		},
		[messages.length, clineAsk],
	)

	const startNewTask = useCallback(() => {
		vscode.postMessage({ type: "clearTask" })
	}, [])

	const handlePrimaryButtonClick = useCallback(() => {
		switch (clineAsk) {
			case "api_req_failed":
			case "command":
			case "command_output":
			case "tool":
			case "browser_action_launch":
			case "use_mcp_server":
			case "resume_task":
			case "mistake_limit_reached":
			case "auto_approval_max_req_reached":
				vscode.postMessage({
					type: "askResponse",
					askResponse: "yesButtonClicked",
				})
				break
			case "completion_result":
			case "resume_completed_task":
				startNewTask()
				break
		}
		setTextAreaDisabled(true)
		setClineAsk(undefined)
		setEnableButtons(false)
		disableAutoScrollRef.current = false
	}, [clineAsk, startNewTask])

	const handleSecondaryButtonClick = useCallback(() => {
		if (isStreaming) {
			vscode.postMessage({ type: "cancelTask" })
			setDidClickCancel(true)
			return
		}

		switch (clineAsk) {
			case "api_req_failed":
			case "mistake_limit_reached":
			case "auto_approval_max_req_reached":
				startNewTask()
				break
			case "command":
			case "tool":
			case "browser_action_launch":
			case "use_mcp_server":
				vscode.postMessage({
					type: "askResponse",
					askResponse: "noButtonClicked",
				})
				break
		}
		setTextAreaDisabled(true)
		setClineAsk(undefined)
		setEnableButtons(false)
		disableAutoScrollRef.current = false
	}, [clineAsk, startNewTask, isStreaming])

	const handleTaskCloseButtonClick = useCallback(() => {
		startNewTask()
	}, [startNewTask])

	const { selectedModelInfo } = useMemo(() => {
		return normalizeApiConfiguration(apiConfiguration)
	}, [apiConfiguration])

	const selectImages = useCallback(() => {
		vscode.postMessage({ type: "selectImages" })
	}, [])

	const shouldDisableImages =
		!selectedModelInfo.supportsImages || textAreaDisabled || selectedImages.length >= MAX_IMAGES_PER_MESSAGE

	const handleMessage = useCallback(
		(e: MessageEvent) => {
			const message: ExtensionMessage = e.data
			switch (message.type) {
				case "action":
					switch (message.action!) {
						case "didBecomeVisible":
							if (!isHidden && !textAreaDisabled && !enableButtons) {
								textAreaRef.current?.focus()
							}
							break
					}
					break
				case "selectedImages":
					const newImages = message.images ?? []
					if (newImages.length > 0) {
						setSelectedImages((prevImages) => [...prevImages, ...newImages].slice(0, MAX_IMAGES_PER_MESSAGE))
					}
					break
				case "invoke":
					switch (message.invoke!) {
						case "sendMessage":
							handleSendMessage(message.text ?? "", message.images ?? [])
							break
						case "primaryButtonClick":
							handlePrimaryButtonClick()
							break
						case "secondaryButtonClick":
							handleSecondaryButtonClick()
							break
					}
			}
		},
		[isHidden, textAreaDisabled, enableButtons, handleSendMessage, handlePrimaryButtonClick, handleSecondaryButtonClick],
	)

	useEvent("message", handleMessage)

	useMount(() => {
		textAreaRef.current?.focus()
	})

	useEffect(() => {
		const timer = setTimeout(() => {
			if (!isHidden && !textAreaDisabled && !enableButtons) {
				textAreaRef.current?.focus()
			}
		}, 50)
		return () => {
			clearTimeout(timer)
		}
	}, [isHidden, textAreaDisabled, enableButtons])

	const visibleMessages = useMemo(() => {
		return modifiedMessages.filter((message) => {
			switch (message.ask) {
				case "completion_result":
					if (message.text === "") {
						return false
					}
					break
				case "api_req_failed":
				case "resume_task":
				case "resume_completed_task":
					return false
			}
			switch (message.say) {
				case "api_req_finished":
				case "api_req_retried":
				case "deleted_api_reqs":
					return false
				case "text":
					if ((message.text ?? "") === "" && (message.images?.length ?? 0) === 0) {
						return false
					}
					break
				case "mcp_server_request_started":
					return false
			}
			return true
		})
	}, [modifiedMessages])

	const isBrowserSessionMessage = (message: ClineMessage): boolean => {
		if (message.type === "ask") {
			return ["browser_action_launch"].includes(message.ask!)
		}
		if (message.type === "say") {
			return ["browser_action_launch", "api_req_started", "text", "browser_action", "browser_action_result"].includes(
				message.say!,
			)
		}
		return false
	}

	const groupedMessages = useMemo(() => {
		const result: (ClineMessage | ClineMessage[])[] = []
		let currentGroup: ClineMessage[] = []
		let isInBrowserSession = false

		const endBrowserSession = () => {
			if (currentGroup.length > 0) {
				result.push([...currentGroup])
				currentGroup = []
				isInBrowserSession = false
			}
		}

		visibleMessages.forEach((message) => {
			if (message.ask === "browser_action_launch" || message.say === "browser_action_launch") {
				endBrowserSession()
				isInBrowserSession = true
				currentGroup.push(message)
			} else if (isInBrowserSession) {
				if (message.say === "api_req_started") {
					const lastApiReqStarted = [...currentGroup].reverse().find((m) => m.say === "api_req_started")
					if (lastApiReqStarted?.text != null) {
						const info = JSON.parse(lastApiReqStarted.text)
						const isCancelled = info.cancelReason != null
						if (isCancelled) {
							endBrowserSession()
							result.push(message)
							return
						}
					}
				}

				if (isBrowserSessionMessage(message)) {
					currentGroup.push(message)

					if (message.say === "browser_action") {
						const browserAction = JSON.parse(message.text || "{}") as ClineSayBrowserAction
						if (browserAction.action === "close") {
							endBrowserSession()
						}
					}
				} else {
					endBrowserSession()
					result.push(message)
				}
			} else {
				result.push(message)
			}
		})

		if (currentGroup.length > 0) {
			result.push([...currentGroup])
		}

		return result
	}, [visibleMessages])

	const scrollToBottomSmooth = useMemo(
		() =>
			debounce(
				() => {
					virtuosoRef.current?.scrollTo({
						top: Number.MAX_SAFE_INTEGER,
						behavior: "smooth",
					})
				},
				10,
				{ immediate: true },
			),
		[],
	)

	const scrollToBottomAuto = useCallback(() => {
		virtuosoRef.current?.scrollTo({
			top: Number.MAX_SAFE_INTEGER,
			behavior: "auto",
		})
	}, [])

	const toggleRowExpansion = useCallback(
		(ts: number) => {
			const isCollapsing = expandedRows[ts] ?? false
			const lastGroup = groupedMessages.at(-1)
			const isLast = Array.isArray(lastGroup) ? lastGroup[0].ts === ts : lastGroup?.ts === ts
			const secondToLastGroup = groupedMessages.at(-2)
			const isSecondToLast = Array.isArray(secondToLastGroup)
				? secondToLastGroup[0].ts === ts
				: secondToLastGroup?.ts === ts

			const isLastCollapsedApiReq =
				isLast && !Array.isArray(lastGroup) && lastGroup?.say === "api_req_started" && !expandedRows[lastGroup.ts]

			setExpandedRows((prev) => ({
				...prev,
				[ts]: !prev[ts],
			}))

			if (!isCollapsing) {
				disableAutoScrollRef.current = true
			}

			if (isCollapsing && isAtBottom) {
				const timer = setTimeout(() => {
					scrollToBottomAuto()
				}, 0)
				return () => clearTimeout(timer)
			} else if (isLast || isSecondToLast) {
				if (isCollapsing) {
					if (isSecondToLast && !isLastCollapsedApiReq) {
						return
					}
					const timer = setTimeout(() => {
						scrollToBottomAuto()
					}, 0)
					return () => clearTimeout(timer)
				} else {
					const timer = setTimeout(() => {
						virtuosoRef.current?.scrollToIndex({
							index: groupedMessages.length - (isLast ? 1 : 2),
							align: "start",
						})
					}, 0)
					return () => clearTimeout(timer)
				}
			}
		},
		[groupedMessages, expandedRows, scrollToBottomAuto, isAtBottom],
	)

	const handleRowHeightChange = useCallback(
		(isTaller: boolean) => {
			if (!disableAutoScrollRef.current) {
				if (isTaller) {
					scrollToBottomSmooth()
				} else {
					setTimeout(() => {
						scrollToBottomAuto()
					}, 0)
				}
			}
		},
		[scrollToBottomSmooth, scrollToBottomAuto],
	)

	useEffect(() => {
		if (!disableAutoScrollRef.current) {
			setTimeout(() => {
				scrollToBottomSmooth()
			}, 50)
		}
	}, [groupedMessages.length, scrollToBottomSmooth])

	const handleWheel = useCallback((event: Event) => {
		const wheelEvent = event as WheelEvent
		if (wheelEvent.deltaY && wheelEvent.deltaY < 0) {
			if (scrollContainerRef.current?.contains(wheelEvent.target as Node)) {
				disableAutoScrollRef.current = true
			}
		}
	}, [])
	useEvent("wheel", handleWheel, window, { passive: true })

	const placeholderText = useMemo(() => {
		const text = task ? "Type a message (@ to add context)..." : "Type your task here (@ to add context)..."
		return text
	}, [task])

	const itemContent = useCallback(
		(index: number, messageOrGroup: ClineMessage | ClineMessage[]) => {
			if (Array.isArray(messageOrGroup)) {
				return (
					<BrowserSessionRow
						messages={messageOrGroup}
						isLast={index === groupedMessages.length - 1}
						lastModifiedMessage={modifiedMessages.at(-1)}
						onHeightChange={handleRowHeightChange}
						isExpanded={(messageTs: number) => expandedRows[messageTs] ?? false}
						onToggleExpand={(messageTs: number) => {
							setExpandedRows((prev) => ({
								...prev,
								[messageTs]: !prev[messageTs],
							}))
						}}
					/>
				)
			}

			return (
				<ChatRow
					key={messageOrGroup.ts}
					message={messageOrGroup}
					isExpanded={expandedRows[messageOrGroup.ts] || false}
					onToggleExpand={() => toggleRowExpansion(messageOrGroup.ts)}
					lastModifiedMessage={modifiedMessages.at(-1)}
					isLast={index === groupedMessages.length - 1}
					onHeightChange={handleRowHeightChange}
				/>
			)
		},
		[expandedRows, modifiedMessages, groupedMessages.length, toggleRowExpansion, handleRowHeightChange],
	)

	return (
		<S.Wrapper style={{ display: isHidden ? "none" : "flex" }}>
			<S.Container>
				{task ? (
					<TaskHeader
						task={task}
						tokensIn={apiMetrics.totalTokensIn}
						tokensOut={apiMetrics.totalTokensOut}
						doesModelSupportPromptCache={selectedModelInfo.supportsPromptCache}
						cacheWrites={apiMetrics.totalCacheWrites}
						cacheReads={apiMetrics.totalCacheReads}
						totalCost={apiMetrics.totalCost}
						onClose={handleTaskCloseButtonClick}
					/>
				) : (
					<S.ScrollableContent>
						{showAnnouncement && <Announcement version={version} hideAnnouncement={hideAnnouncement} />}
						<S.WelcomeContent>
							<S.WelcomeHeading>Hey I'm CLINE, how can I assist you today?</S.WelcomeHeading>
							<p>
								While I can utilize multiple AI models, I work best with Claude 3.5 Sonnet. I can assist with
								complex coding tasks, create and edit files, explore projects, use the browser, and run terminal
								commands with your approval. I can also create new tools to expand my abilities.
							</p>
						</S.WelcomeContent>
						{taskHistory.length > 0 && <HistoryPreview showHistoryView={showHistoryView} />}
					</S.ScrollableContent>
				)}

				{!task && (
					<AutoApproveMenu
						style={{
							marginBottom: -2,
							flex: "0 1 auto",
							minHeight: 0,
						}}
					/>
				)}

				{task && (
					<>
						<div style={{ flexGrow: 1, display: "flex" }} ref={scrollContainerRef}>
							<Virtuoso
								ref={virtuosoRef}
								key={task.ts}
								className="scrollable"
								style={{
									flexGrow: 1,
									overflowY: "scroll",
								}}
								components={{
									Footer: () => <div style={{ height: 5 }} />,
								}}
								increaseViewportBy={{
									top: 3_000,
									bottom: Number.MAX_SAFE_INTEGER,
								}}
								data={groupedMessages}
								itemContent={itemContent}
								atBottomStateChange={(isAtBottom) => {
									setIsAtBottom(isAtBottom)
									if (isAtBottom) {
										disableAutoScrollRef.current = false
									}
									setShowScrollToBottom(disableAutoScrollRef.current && !isAtBottom)
								}}
								atBottomThreshold={10}
								initialTopMostItemIndex={groupedMessages.length - 1}
							/>
						</div>
						<AutoApproveMenu />
						{showScrollToBottom ? (
							<div style={{ display: "flex", padding: "10px 15px 0px 15px" }}>
								<S.ScrollToBottomButton
									onClick={() => {
										scrollToBottomSmooth()
										disableAutoScrollRef.current = false
									}}>
									<span className="codicon codicon-chevron-down" style={{ fontSize: "18px" }}></span>
								</S.ScrollToBottomButton>
							</div>
						) : (
							<S.ButtonContainer $visible={!!(primaryButtonText || secondaryButtonText || isStreaming)}>
								{primaryButtonText && !isStreaming && (
									<S.StyledButton
										$primary
										disabled={!enableButtons}
										style={{
											flex: secondaryButtonText ? 1 : 2,
											marginRight: secondaryButtonText ? "6px" : "0",
										}}
										onClick={handlePrimaryButtonClick}>
										{primaryButtonText}
									</S.StyledButton>
								)}
								{(secondaryButtonText || isStreaming) && (
									<S.StyledButton
										disabled={!enableButtons && !(isStreaming && !didClickCancel)}
										style={{
											flex: isStreaming ? 2 : 1,
											marginLeft: isStreaming ? 0 : "6px",
										}}
										onClick={handleSecondaryButtonClick}>
										{isStreaming ? "Cancel" : secondaryButtonText}
									</S.StyledButton>
								)}
							</S.ButtonContainer>
						)}
					</>
				)}
				<S.ChatTextAreaContainer>
					<ChatTextArea
						ref={textAreaRef}
						inputValue={inputValue}
						setInputValue={setInputValue}
						textAreaDisabled={textAreaDisabled}
						placeholderText={placeholderText}
						selectedImages={selectedImages}
						setSelectedImages={setSelectedImages}
						onSend={() => handleSendMessage(inputValue, selectedImages)}
						onSelectImages={selectImages}
						shouldDisableImages={shouldDisableImages}
						onHeightChange={() => {
							if (isAtBottom) {
								scrollToBottomAuto()
							}
						}}
					/>
				</S.ChatTextAreaContainer>
			</S.Container>
		</S.Wrapper>
	)
}

export default ChatView
