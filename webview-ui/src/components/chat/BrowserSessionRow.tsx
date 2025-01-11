import deepEqual from "fast-deep-equal"
import React, { memo, useEffect, useMemo, useRef, useState } from "react"
import { useSize } from "react-use"
import { BrowserAction, BrowserActionResult, ClineMessage, ClineSayBrowserAction } from "../../../../src/shared/ExtensionMessage"
import { vscode } from "../../utils/vscode"
import CodeBlock, { CODE_BLOCK_BG_COLOR } from "../common/CodeBlock"
import { ChatRowContent, ProgressIndicator } from "./ChatRow"
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { CheckpointOverlay } from "../common/CheckpointControls"
import { findLast } from "../../../../src/shared/array"
import * as S from "./BrowserSessionRow.styles"

interface BrowserSessionRowProps {
	messages: ClineMessage[]
	isExpanded: (messageTs: number) => boolean
	onToggleExpand: (messageTs: number) => void
	lastModifiedMessage?: ClineMessage
	isLast: boolean
	onHeightChange: (isTaller: boolean) => void
}

const BrowserSessionRow = memo((props: BrowserSessionRowProps) => {
	const { messages, isLast, onHeightChange, lastModifiedMessage } = props
	const prevHeightRef = useRef(0)
	const [maxActionHeight, setMaxActionHeight] = useState(0)
	const [consoleLogsExpanded, setConsoleLogsExpanded] = useState(false)

	const isLastApiReqInterrupted = useMemo(() => {
		const lastApiReqStarted = [...messages].reverse().find((m) => m.say === "api_req_started")
		if (lastApiReqStarted?.text != null) {
			const info = JSON.parse(lastApiReqStarted.text)
			if (info.cancelReason != null) {
				return true
			}
		}
		const lastApiReqFailed = isLast && lastModifiedMessage?.ask === "api_req_failed"
		if (lastApiReqFailed) {
			return true
		}
		return false
	}, [messages, lastModifiedMessage, isLast])

	const isBrowsing = useMemo(() => {
		return isLast && messages.some((m) => m.say === "browser_action_result") && !isLastApiReqInterrupted
	}, [isLast, messages, isLastApiReqInterrupted])

	const pages = useMemo(() => {
		const result: {
			currentState: {
				url?: string
				screenshot?: string
				mousePosition?: string
				consoleLogs?: string
				messages: ClineMessage[]
			}
			nextAction?: {
				messages: ClineMessage[]
			}
		}[] = []

		let currentStateMessages: ClineMessage[] = []
		let nextActionMessages: ClineMessage[] = []

		messages.forEach((message) => {
			if (message.ask === "browser_action_launch" || message.say === "browser_action_launch") {
				currentStateMessages = [message]
			} else if (message.say === "browser_action_result") {
				if (message.text === "") {
					return
				}
				currentStateMessages.push(message)
				const resultData = JSON.parse(message.text || "{}") as BrowserActionResult

				result.push({
					currentState: {
						url: resultData.currentUrl,
						screenshot: resultData.screenshot,
						mousePosition: resultData.currentMousePosition,
						consoleLogs: resultData.logs,
						messages: [...currentStateMessages],
					},
					nextAction:
						nextActionMessages.length > 0
							? {
									messages: [...nextActionMessages],
								}
							: undefined,
				})

				currentStateMessages = []
				nextActionMessages = []
			} else if (message.say === "api_req_started" || message.say === "text" || message.say === "browser_action") {
				nextActionMessages.push(message)
			} else {
				currentStateMessages.push(message)
			}
		})

		if (currentStateMessages.length > 0 || nextActionMessages.length > 0) {
			result.push({
				currentState: {
					messages: [...currentStateMessages],
				},
				nextAction:
					nextActionMessages.length > 0
						? {
								messages: [...nextActionMessages],
							}
						: undefined,
			})
		}

		return result
	}, [messages])

	const [currentPageIndex, setCurrentPageIndex] = useState(0)
	useEffect(() => {
		setCurrentPageIndex(pages.length - 1)
	}, [pages.length])

	const initialUrl = useMemo(() => {
		const launchMessage = messages.find((m) => m.ask === "browser_action_launch" || m.say === "browser_action_launch")
		return launchMessage?.text || ""
	}, [messages])

	const isAutoApproved = useMemo(() => {
		const launchMessage = messages.find((m) => m.ask === "browser_action_launch" || m.say === "browser_action_launch")
		return launchMessage?.say === "browser_action_launch"
	}, [messages])

	const lastCheckpointMessageTs = useMemo(() => {
		const lastCheckpointMessage = findLast(messages, (m) => m.lastCheckpointHash !== undefined)
		return lastCheckpointMessage?.ts
	}, [messages])

	const latestState = useMemo(() => {
		for (let i = pages.length - 1; i >= 0; i--) {
			const page = pages[i]
			if (page.currentState.url || page.currentState.screenshot) {
				return {
					url: page.currentState.url,
					mousePosition: page.currentState.mousePosition,
					consoleLogs: page.currentState.consoleLogs,
					screenshot: page.currentState.screenshot,
				}
			}
		}
		return {
			url: undefined,
			mousePosition: undefined,
			consoleLogs: undefined,
			screenshot: undefined,
		}
	}, [pages])

	const currentPage = pages[currentPageIndex]
	const isLastPage = currentPageIndex === pages.length - 1

	const displayState = isLastPage
		? {
				url: currentPage?.currentState.url || latestState.url || initialUrl,
				mousePosition: currentPage?.currentState.mousePosition || latestState.mousePosition || "700,400",
				consoleLogs: currentPage?.currentState.consoleLogs,
				screenshot: currentPage?.currentState.screenshot || latestState.screenshot,
			}
		: {
				url: currentPage?.currentState.url || initialUrl,
				mousePosition: currentPage?.currentState.mousePosition || "700,400",
				consoleLogs: currentPage?.currentState.consoleLogs,
				screenshot: currentPage?.currentState.screenshot,
			}

	const [actionContent, { height: actionHeight }] = useSize(
		<div>
			{currentPage?.nextAction?.messages.map((message) => (
				<BrowserSessionRowContent key={message.ts} {...props} message={message} setMaxActionHeight={setMaxActionHeight} />
			))}
			{!isBrowsing && messages.some((m) => m.say === "browser_action_result") && currentPageIndex === 0 && (
				<BrowserActionBox action={"launch"} text={initialUrl} />
			)}
		</div>,
	)

	useEffect(() => {
		if (actionHeight === 0 || actionHeight === Infinity) {
			return
		}
		if (actionHeight > maxActionHeight) {
			setMaxActionHeight(actionHeight)
		}
	}, [actionHeight, maxActionHeight])

	const latestClickPosition = useMemo(() => {
		if (!isBrowsing) return undefined

		const actions = currentPage?.nextAction?.messages || []
		for (let i = actions.length - 1; i >= 0; i--) {
			const message = actions[i]
			if (message.say === "browser_action") {
				const browserAction = JSON.parse(message.text || "{}") as ClineSayBrowserAction
				if (browserAction.action === "click" && browserAction.coordinate) {
					return browserAction.coordinate
				}
			}
		}
		return undefined
	}, [isBrowsing, currentPage?.nextAction?.messages])

	const mousePosition = isBrowsing ? latestClickPosition || displayState.mousePosition : displayState.mousePosition

	let shouldShowCheckpoints = true
	if (isLast) {
		shouldShowCheckpoints = lastModifiedMessage?.ask === "resume_completed_task" || lastModifiedMessage?.ask === "resume_task"
	}

	const [browserSessionRow, { height }] = useSize(
		<S.Container style={{ marginBottom: -10 }}>
			<S.HeaderContainer>
				{isBrowsing ? (
					<ProgressIndicator />
				) : (
					<span
						className="codicon codicon-inspect"
						style={{ color: "var(--vscode-foreground)", marginBottom: "-1.5px" }}
					/>
				)}
				<span style={{ fontWeight: "bold" }}>
					<>{isAutoApproved ? "Cline is using the browser:" : "Cline wants to use the browser:"}</>
				</span>
			</S.HeaderContainer>

			<S.BrowserContainer>
				<S.URLBar>
					<S.URLText $empty={!displayState.url}>{displayState.url || "http"}</S.URLText>
				</S.URLBar>

				<S.ScreenshotArea>
					{displayState.screenshot ? (
						<S.Screenshot
							src={displayState.screenshot}
							alt="Browser screenshot"
							onClick={() =>
								vscode.postMessage({
									type: "openImage",
									text: displayState.screenshot,
								})
							}
						/>
					) : (
						<S.EmptyScreenshot>
							<span className="codicon codicon-globe" />
						</S.EmptyScreenshot>
					)}
					{displayState.mousePosition && (
						<S.BrowserCursor
							src={cursorBase64}
							$x={(parseInt(mousePosition.split(",")[0]) / 900) * 100}
							$y={(parseInt(mousePosition.split(",")[1]) / 600) * 100}
						/>
					)}
				</S.ScreenshotArea>

				<div style={{ width: "100%" }}>
					<S.ConsoleHeader $expanded={consoleLogsExpanded} onClick={() => setConsoleLogsExpanded(!consoleLogsExpanded)}>
						<span className={`codicon codicon-chevron-${consoleLogsExpanded ? "down" : "right"}`} />
						<S.ConsoleTitle>Console Logs</S.ConsoleTitle>
					</S.ConsoleHeader>
					{consoleLogsExpanded && (
						<CodeBlock source={`${"```"}shell\n${displayState.consoleLogs || "(No new logs)"}\n${"```"}`} />
					)}
				</div>
			</S.BrowserContainer>

			<div style={{ minHeight: maxActionHeight }}>{actionContent}</div>

			{pages.length > 1 && (
				<S.PaginationContainer>
					<div>
						Step {currentPageIndex + 1} of {pages.length}
					</div>
					<S.PaginationButtons>
						<VSCodeButton
							disabled={currentPageIndex === 0 || isBrowsing}
							onClick={() => setCurrentPageIndex((i) => i - 1)}>
							Previous
						</VSCodeButton>
						<VSCodeButton
							disabled={currentPageIndex === pages.length - 1 || isBrowsing}
							onClick={() => setCurrentPageIndex((i) => i + 1)}>
							Next
						</VSCodeButton>
					</S.PaginationButtons>
				</S.PaginationContainer>
			)}

			{shouldShowCheckpoints && <CheckpointOverlay messageTs={lastCheckpointMessageTs} />}
		</S.Container>,
	)

	useEffect(() => {
		const isInitialRender = prevHeightRef.current === 0
		if (isLast && height !== 0 && height !== Infinity && height !== prevHeightRef.current) {
			if (!isInitialRender) {
				onHeightChange(height > prevHeightRef.current)
			}
			prevHeightRef.current = height
		}
	}, [height, isLast, onHeightChange])

	return browserSessionRow
}, deepEqual)

interface BrowserSessionRowContentProps extends Omit<BrowserSessionRowProps, "messages"> {
	message: ClineMessage
	setMaxActionHeight: (height: number) => void
}

const BrowserSessionRowContent = ({
	message,
	isExpanded,
	onToggleExpand,
	lastModifiedMessage,
	isLast,
	setMaxActionHeight,
}: BrowserSessionRowContentProps) => {
	const headerStyle: React.CSSProperties = {
		display: "flex",
		alignItems: "center",
		gap: "10px",
		marginBottom: "10px",
	}

	if (message.ask === "browser_action_launch" || message.say === "browser_action_launch") {
		return (
			<>
				<div style={headerStyle}>
					<span style={{ fontWeight: "bold" }}>Browser Session Started</span>
				</div>
				<div
					style={{
						borderRadius: 3,
						border: "1px solid var(--vscode-editorGroup-border)",
						overflow: "hidden",
						backgroundColor: CODE_BLOCK_BG_COLOR,
					}}>
					<CodeBlock source={`${"```"}shell\n${message.text}\n${"```"}`} forceWrap={true} />
				</div>
			</>
		)
	}

	switch (message.type) {
		case "say":
			switch (message.say) {
				case "api_req_started":
				case "text":
					return (
						<div style={{ padding: "10px 0 10px 0" }}>
							<ChatRowContent
								message={message}
								isExpanded={isExpanded(message.ts)}
								onToggleExpand={() => {
									if (message.say === "api_req_started") {
										setMaxActionHeight(0)
									}
									onToggleExpand(message.ts)
								}}
								lastModifiedMessage={lastModifiedMessage}
								isLast={isLast}
							/>
						</div>
					)

				case "browser_action":
					const browserAction = JSON.parse(message.text || "{}") as ClineSayBrowserAction
					return (
						<BrowserActionBox
							action={browserAction.action}
							coordinate={browserAction.coordinate}
							text={browserAction.text}
						/>
					)

				default:
					return null
			}

		case "ask":
			switch (message.ask) {
				default:
					return null
			}
	}
}

const BrowserActionBox = ({ action, coordinate, text }: { action: BrowserAction; coordinate?: string; text?: string }) => {
	const getBrowserActionText = (action: BrowserAction, coordinate?: string, text?: string) => {
		switch (action) {
			case "launch":
				return `Launch browser at ${text}`
			case "click":
				return `Click (${coordinate?.replace(",", ", ")})`
			case "type":
				return `Type "${text}"`
			case "scroll_down":
				return "Scroll down"
			case "scroll_up":
				return "Scroll up"
			case "close":
				return "Close browser"
			default:
				return action
		}
	}
	return (
		<div style={{ padding: "10px 0 0 0" }}>
			<div
				style={{
					borderRadius: 3,
					backgroundColor: CODE_BLOCK_BG_COLOR,
					overflow: "hidden",
					border: "1px solid var(--vscode-editorGroup-border)",
				}}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						padding: "9px 10px",
					}}>
					<span
						style={{
							whiteSpace: "normal",
							wordBreak: "break-word",
						}}>
						<span style={{ fontWeight: 500 }}>Browse Action: </span>
						{getBrowserActionText(action, coordinate, text)}
					</span>
				</div>
			</div>
		</div>
	)
}

const cursorBase64 =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFaADAAQAAAABAAAAGAAAAADwi9a/AAADGElEQVQ4EZ2VbUiTURTH772be/PxZdsz3cZwC4RVaB8SAjMpxQwSWZbQG/TFkN7oW1Df+h6IRV9C+hCpKUSIZUXOfGM5tAKViijFFEyfZ7Ol29S1Pbdzl8Uw9+aBu91zzv3/nt17zt2DEZjBYOAkKrtFMXIghAWM8U2vMN/FctsxGRMpM7NbEEYNMM2CYUSInlJx3OpawO9i+XSNQYkmk2uFb9njzkcfVSr1p/GJiQKMULVaw2WuBv296UKRxWJR6wxGCmM1EAhSNppv33GBH9qI32cPTAtss9lUm6EM3N7R+RbigT+5/CeosFCZKpjEW+iorS1pb30wDUXzQfHqtD/9L3ieZ2ee1OJCmbL8QHnRs+4uj0wmW4QzrpCwvJ8zGg3JqAmhTLynuLiwv8/5KyND8Q3cEkUEDWu15oJE4KRQJt5hs1rcriGNRqP+DK4dyyWXXm/aFQ+cEpSJ8/LyDGPuEZNOmzsOroUSOqzXG/dtBU4ZysTZYKNut91sNo2Cq6cE9enz86s2g9OCMrFSqVC5hgb32u072W3jKMU90Hb1seC0oUwsB+t92bO/rKx0EFGkgFCnjjc1/gVvC8rE0L+4o63t4InjxwbAJQjTe3qD8QrLkXA4DC24fWtuajp06cLFYSBIFKGmXKPRRmAnME9sPt+yLwIWb9WN69fKoTneQz4Dh2mpPNkvfeV0jjecb9wNAkwIEVQq5VJOds4Kb+DXoAsiVquVwI1Dougpij6UyGYx+5cKroeDEFibm5lWRRMbH1+npmYrq6qhwlQHIbajZEf1fElcqGGFpGg9HMuKzpfBjhytCTMgkJ56RX09zy/ysENTBElmjIgJnmNChJqohDVQqpEfwkILE8v/o0GAnV9F1eEvofVQCbiTBEXOIPQh5PGgefDZeAcjrpGZjULBr/m3tZOnz7oEQWRAQZLjWlEU/XEJWySiILgRc5Cz1DkcAyuBFcnpfF0JiXWKpcolQXizhS5hKAqFpr0MVbgbuxJ6+5xX+P4wNpbqPPrugZfbmIbLmgQR3Aw8QSi66hUXulOFbF73GxqjE5BNXWNeAAAAAElFTkSuQmCC"

export default BrowserSessionRow
