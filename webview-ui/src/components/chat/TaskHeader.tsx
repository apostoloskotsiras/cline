import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import React, { memo, useEffect, useMemo, useRef, useState } from "react"
import { useWindowSize } from "react-use"
import { mentionRegexGlobal } from "../../../../src/shared/context-mentions"
import { ClineMessage } from "../../../../src/shared/ExtensionMessage"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { formatLargeNumber } from "../../utils/format"
import { formatSize } from "../../utils/size"
import { vscode } from "../../utils/vscode"
import Thumbnails from "../common/Thumbnails"
import "./TaskHeader.css"

interface TaskHeaderProps {
	task: ClineMessage
	tokensIn: number
	tokensOut: number
	doesModelSupportPromptCache: boolean
	cacheWrites?: number
	cacheReads?: number
	totalCost: number
	onClose: () => void
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
	task,
	tokensIn,
	tokensOut,
	doesModelSupportPromptCache,
	cacheWrites,
	cacheReads,
	totalCost,
	onClose,
}) => {
	const { apiConfiguration, currentTaskItem, checkpointTrackerErrorMessage } = useExtensionState()
	const [isTaskExpanded, setIsTaskExpanded] = useState(true)
	const [isTextExpanded, setIsTextExpanded] = useState(false)
	const [showSeeMore, setShowSeeMore] = useState(false)
	const textContainerRef = useRef<HTMLDivElement>(null)
	const textRef = useRef<HTMLDivElement>(null)

	/*
	When dealing with event listeners in React components that depend on state variables, we face a challenge. We want our listener to always use the most up-to-date version of a callback function that relies on current state, but we don't want to constantly add and remove event listeners as that function updates. This scenario often arises with resize listeners or other window events. Simply adding the listener in a useEffect with an empty dependency array risks using stale state, while including the callback in the dependencies can lead to unnecessary re-registrations of the listener. There are react hook libraries that provide a elegant solution to this problem by utilizing the useRef hook to maintain a reference to the latest callback function without triggering re-renders or effect re-runs. This approach ensures that our event listener always has access to the most current state while minimizing performance overhead and potential memory leaks from multiple listener registrations. 
	Sources
	- https://usehooks-ts.com/react-hook/use-event-listener
	- https://streamich.github.io/react-use/?path=/story/sensors-useevent--docs
	- https://github.com/streamich/react-use/blob/master/src/useEvent.ts
	- https://stackoverflow.com/questions/55565444/how-to-register-event-with-useeffect-hooks

	Before:
	
	const updateMaxHeight = useCallback(() => {
		if (isExpanded && textContainerRef.current) {
			const maxHeight = window.innerHeight * (3 / 5)
			textContainerRef.current.style.maxHeight = `${maxHeight}px`
		}
	}, [isExpanded])

	useEffect(() => {
		updateMaxHeight()
	}, [isExpanded, updateMaxHeight])

	useEffect(() => {
		window.removeEventListener("resize", updateMaxHeight)
		window.addEventListener("resize", updateMaxHeight)
		return () => {
			window.removeEventListener("resize", updateMaxHeight)
		}
	}, [updateMaxHeight])

	After:
	*/

	const { height: windowHeight, width: windowWidth } = useWindowSize()

	useEffect(() => {
		if (!textContainerRef.current) return;
		
		if (isTextExpanded) {
			// When expanded, set max height to fit content or 50% of window height
			const contentHeight = textRef.current?.scrollHeight || 0;
			const maxHeight = Math.min(contentHeight, windowHeight * 0.5);
			textContainerRef.current.style.maxHeight = `${maxHeight}px`;
			textContainerRef.current.style.overflowY = 'auto';
		} else {
			// When collapsed, set max height to show 3 lines
			textContainerRef.current.style.maxHeight = '4.5em'; // 3 lines * 1.5 line-height
			textContainerRef.current.style.overflowY = 'hidden';
		}
	}, [isTextExpanded, windowHeight, task.text]);

	useEffect(() => {
		if (!textRef.current || !textContainerRef.current) return;
		
		// Calculate if text is overflowing in collapsed state
		const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight);
		const collapsedHeight = lineHeight * 3; // 3 lines
		const isOverflowing = textRef.current.scrollHeight > collapsedHeight;
		
		setShowSeeMore(isOverflowing);
		
		// If text is not overflowing, ensure it's not in expanded state
		if (!isOverflowing) {
			setIsTextExpanded(false);
		}
	}, [task.text, windowWidth]);

	const isCostAvailable = useMemo(() => {
		return (
			apiConfiguration?.apiProvider !== "openai" &&
			apiConfiguration?.apiProvider !== "ollama" &&
			apiConfiguration?.apiProvider !== "lmstudio" &&
			apiConfiguration?.apiProvider !== "gemini"
		)
	}, [apiConfiguration?.apiProvider])

	const shouldShowPromptCacheInfo = doesModelSupportPromptCache && apiConfiguration?.apiProvider !== "openrouter"

	return (
		<div className="task-header-container">
			<div className="task-header-content">
				<div className="task-header-top">
					<div className="task-header-title"
						onClick={() => setIsTaskExpanded(!isTaskExpanded)}>
						<div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
							<span className={`codicon codicon-chevron-${isTaskExpanded ? "down" : "right"}`}></span>
						</div>
						<div className="task-header-title-text">
							<span style={{ fontWeight: "bold" }}>Task{!isTaskExpanded && ":"}</span>
							{!isTaskExpanded && <span style={{ marginLeft: 4 }}>{highlightMentions(task.text, false)}</span>}
						</div>
					</div>
					{!isTaskExpanded && isCostAvailable && (
					<div className="task-header-cost-badge">
							${totalCost?.toFixed(4)}
						</div>
					)}
					<VSCodeButton appearance="icon" onClick={onClose} style={{ marginLeft: 6, flexShrink: 0 }}>
						<span className="codicon codicon-close"></span>
					</VSCodeButton>
				</div>
				{isTaskExpanded && (
					<>
						<div
							ref={textContainerRef}
							className={`task-text-container ${isTextExpanded ? 'task-text-expanded' : ''}`}
							style={{ overflowY: isTextExpanded ? "auto" : "hidden" }}>
							<div
								ref={textRef}
								className="task-text-content">
								{highlightMentions(task.text, false)}
							</div>
							{!isTextExpanded && showSeeMore && (
								<div className="see-more-container">
									<div className="see-more-gradient" />
									<div className="see-more-text"
										onClick={() => setIsTextExpanded(!isTextExpanded)}>
										See more
									</div>
								</div>
							)}
						</div>
						{isTextExpanded && showSeeMore && (
								<div className="see-less-text"
								onClick={() => setIsTextExpanded(!isTextExpanded)}>
								See less
							</div>
						)}
						{task.images && task.images.length > 0 && <Thumbnails images={task.images} />}
						<div className="task-metrics-container">
							<div className="task-metrics-row">
								<div className="task-metrics-label">
									<span style={{ fontWeight: "bold" }}>Tokens:</span>
									<span className="task-metrics-value">
										<i
											className="codicon codicon-arrow-up"
											style={{
												fontSize: "12px",
												fontWeight: "bold",
												marginBottom: "-2px",
											}}
										/>
										{formatLargeNumber(tokensIn || 0)}
									</span>
									<span className="task-metrics-value">
										<i
											className="codicon codicon-arrow-down"
											style={{
												fontSize: "12px",
												fontWeight: "bold",
												marginBottom: "-2px",
											}}
										/>
										{formatLargeNumber(tokensOut || 0)}
									</span>
								</div>
								{!isCostAvailable && (
									<DeleteButton taskSize={formatSize(currentTaskItem?.size)} taskId={currentTaskItem?.id} />
								)}
							</div>

							{shouldShowPromptCacheInfo && (cacheReads !== undefined || cacheWrites !== undefined) && (
								<div className="task-metrics-label">
									<span style={{ fontWeight: "bold" }}>Cache:</span>
									<span className="task-metrics-value">
										<i
											className="codicon codicon-database"
											style={{
												fontSize: "12px",
												fontWeight: "bold",
												marginBottom: "-1px",
											}}
										/>
										+{formatLargeNumber(cacheWrites || 0)}
									</span>
									<span className="task-metrics-value">
										<i
											className="codicon codicon-arrow-right"
											style={{
												fontSize: "12px",
												fontWeight: "bold",
												marginBottom: 0,
											}}
										/>
										{formatLargeNumber(cacheReads || 0)}
									</span>
								</div>
							)}
							{isCostAvailable && (
								<div className="task-metrics-row">
									<div className="task-metrics-label">
										<span style={{ fontWeight: "bold" }}>API Cost:</span>
										<span>${totalCost?.toFixed(4)}</span>
									</div>
									<DeleteButton taskSize={formatSize(currentTaskItem?.size)} taskId={currentTaskItem?.id} />
								</div>
							)}
							{checkpointTrackerErrorMessage && (
								<div className="task-error-message">
									<i className="codicon codicon-warning" />
									<span>
										{checkpointTrackerErrorMessage}
										{checkpointTrackerErrorMessage.includes("Git must be installed to use checkpoints.") && (
											<>
												{" "}
												<a
													href="https://github.com/cline/cline/wiki/Installing-Git-for-Checkpoints"
													style={{
														color: "inherit",
														textDecoration: "underline",
													}}>
													See here for instructions.
												</a>
											</>
										)}
									</span>
								</div>
							)}
						</div>
					</>
				)}
			</div>
			{/* {apiProvider === "" && (
				<div
					style={{
						backgroundColor: "color-mix(in srgb, var(--vscode-badge-background) 50%, transparent)",
						color: "var(--vscode-badge-foreground)",
						borderRadius: "0 0 3px 3px",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						padding: "4px 12px 6px 12px",
						fontSize: "0.9em",
						marginLeft: "10px",
						marginRight: "10px",
					}}>
					<div style={{ fontWeight: "500" }}>Credits Remaining:</div>
					<div>
						{formatPrice(Credits || 0)}
						{(Credits || 0) < 1 && (
							<>
								{" "}
								<VSCodeLink style={{ fontSize: "0.9em" }} href={getAddCreditsUrl(vscodeUriScheme)}>
									(get more?)
								</VSCodeLink>
							</>
						)}
					</div>
				</div>
			)} */}
		</div>
	)
}

export const highlightMentions = (text?: string, withShadow = true) => {
	if (!text) return text
	const parts = text.split(mentionRegexGlobal)
	return parts.map((part, index) => {
		if (index % 2 === 0) {
			// This is regular text
			return part
		} else {
			// This is a mention
			return (
				<span
					key={index}
					className={withShadow ? "mention-context-highlight-with-shadow" : "mention-context-highlight"}
					style={{ cursor: "pointer" }}
					onClick={() => vscode.postMessage({ type: "openMention", text: part })}>
					@{part}
				</span>
			)
		}
	})
}

const DeleteButton: React.FC<{
	taskSize: string
	taskId?: string
}> = ({ taskSize, taskId }) => (
	<VSCodeButton
		appearance="icon"
		onClick={() => vscode.postMessage({ type: "deleteTaskWithId", text: taskId })}
		className="delete-button-container">
		<div className="delete-button-content">
			<i className={`codicon codicon-trash`} />
			{taskSize}
		</div>
	</VSCodeButton>
)

// const ExportButton = () => (
// 	<VSCodeButton
// 		appearance="icon"
// 		onClick={() => vscode.postMessage({ type: "exportCurrentTask" })}
// 		style={
// 			{
// 				// marginBottom: "-2px",
// 				// marginRight: "-2.5px",
// 			}
// 		}>
// 		<div style={{ fontSize: "10.5px", fontWeight: "bold", opacity: 0.6 }}>EXPORT</div>
// 	</VSCodeButton>
// )

export default memo(TaskHeader)
