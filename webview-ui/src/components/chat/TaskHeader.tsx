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
import * as S from "./TaskHeader.styles"

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

	const { height: windowHeight, width: windowWidth } = useWindowSize()

	useEffect(() => {
		if (!textContainerRef.current) return;
		
		if (isTextExpanded) {
			const contentHeight = textRef.current?.scrollHeight || 0;
			const maxHeight = Math.min(contentHeight, windowHeight * 0.5);
			textContainerRef.current.style.maxHeight = `${maxHeight}px`;
		} else {
			textContainerRef.current.style.maxHeight = '4.5em';
		}
	}, [isTextExpanded, windowHeight, task.text]);

	useEffect(() => {
		if (!textRef.current || !textContainerRef.current) return;
		
		const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight);
		const collapsedHeight = lineHeight * 3;
		const isOverflowing = textRef.current.scrollHeight > collapsedHeight;
		
		setShowSeeMore(isOverflowing);
		
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
		<S.Container>
			<S.Content>
				<S.TopSection>
					<S.Title onClick={() => setIsTaskExpanded(!isTaskExpanded)}>
						<div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
							<span className={`codicon codicon-chevron-${isTaskExpanded ? "down" : "right"}`}></span>
						</div>
						<S.TitleText>
							<span style={{ fontWeight: "bold" }}>Task{!isTaskExpanded && ":"}</span>
							{!isTaskExpanded && <span style={{ marginLeft: 4 }}>{highlightMentions(task.text, false)}</span>}
						</S.TitleText>
					</S.Title>
					{!isTaskExpanded && isCostAvailable && (
						<S.CostBadge>
							${totalCost?.toFixed(4)}
						</S.CostBadge>
					)}
					<VSCodeButton appearance="icon" onClick={onClose} style={{ marginLeft: 6, flexShrink: 0 }}>
						<span className="codicon codicon-close"></span>
					</VSCodeButton>
				</S.TopSection>
				{isTaskExpanded && (
					<>
						<S.TextContainer
							ref={textContainerRef}
							isExpanded={isTextExpanded}>
							<S.TextContent ref={textRef}>
								{highlightMentions(task.text, false)}
							</S.TextContent>
							{!isTextExpanded && showSeeMore && (
								<S.SeeMoreContainer>
									<S.SeeMoreText onClick={() => setIsTextExpanded(!isTextExpanded)}>
										See more
									</S.SeeMoreText>
								</S.SeeMoreContainer>
							)}
						</S.TextContainer>
						{isTextExpanded && showSeeMore && (
							<S.SeeLessText onClick={() => setIsTextExpanded(!isTextExpanded)}>
								See less
							</S.SeeLessText>
						)}
						{task.images && task.images.length > 0 && <Thumbnails images={task.images} />}
						<S.MetricsContainer>
							<S.MetricsRow>
								<S.MetricsLabel>
									<span style={{ fontWeight: "bold" }}>Tokens:</span>
									<S.MetricsValue>
										<i
											className="codicon codicon-arrow-up"
											style={{
												fontSize: "12px",
												fontWeight: "bold",
												marginBottom: "-2px",
											}}
										/>
										{formatLargeNumber(tokensIn || 0)}
									</S.MetricsValue>
									<S.MetricsValue>
										<i
											className="codicon codicon-arrow-down"
											style={{
												fontSize: "12px",
												fontWeight: "bold",
												marginBottom: "-2px",
											}}
										/>
										{formatLargeNumber(tokensOut || 0)}
									</S.MetricsValue>
								</S.MetricsLabel>
								{!isCostAvailable && (
									<DeleteButton taskSize={formatSize(currentTaskItem?.size)} taskId={currentTaskItem?.id} />
								)}
							</S.MetricsRow>

							{shouldShowPromptCacheInfo && (cacheReads !== undefined || cacheWrites !== undefined) && (
								<S.MetricsLabel>
									<span style={{ fontWeight: "bold" }}>Cache:</span>
									<S.MetricsValue>
										<i
											className="codicon codicon-database"
											style={{
												fontSize: "12px",
												fontWeight: "bold",
												marginBottom: "-1px",
											}}
										/>
										+{formatLargeNumber(cacheWrites || 0)}
									</S.MetricsValue>
									<S.MetricsValue>
										<i
											className="codicon codicon-arrow-right"
											style={{
												fontSize: "12px",
												fontWeight: "bold",
												marginBottom: 0,
											}}
										/>
										{formatLargeNumber(cacheReads || 0)}
									</S.MetricsValue>
								</S.MetricsLabel>
							)}
							{isCostAvailable && (
								<S.MetricsRow>
									<S.MetricsLabel>
										<span style={{ fontWeight: "bold" }}>API Cost:</span>
										<span>${totalCost?.toFixed(4)}</span>
									</S.MetricsLabel>
									<DeleteButton taskSize={formatSize(currentTaskItem?.size)} taskId={currentTaskItem?.id} />
								</S.MetricsRow>
							)}
							{checkpointTrackerErrorMessage && (
								<S.ErrorMessage>
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
								</S.ErrorMessage>
							)}
						</S.MetricsContainer>
					</>
				)}
			</S.Content>
		</S.Container>
	)
}

export const highlightMentions = (text?: string, withShadow = true) => {
	if (!text) return text
	const parts = text.split(mentionRegexGlobal)
	return parts.map((part, index) => {
		if (index % 2 === 0) {
			return part
		} else {
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
	<S.StyledDeleteButton
		appearance="icon"
		onClick={() => vscode.postMessage({ type: "deleteTaskWithId", text: taskId })}>
		<S.DeleteButtonContent>
			<i className={`codicon codicon-trash`} />
			{taskSize}
		</S.DeleteButtonContent>
	</S.StyledDeleteButton>
)

export default memo(TaskHeader)
