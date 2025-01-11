import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useClickAway, useEvent } from "react-use"
import styled from "styled-components"
import { ExtensionMessage } from "../../../../src/shared/ExtensionMessage"
import { vscode } from "../../utils/vscode"
import { ClineCheckpointRestore } from "../../../../src/shared/WebviewMessage"

interface CheckpointOverlayProps {
	messageTs?: number
}

const Controls = styled.div`
	position: absolute;
	top: 8px;
	right: 8px;
	display: flex;
	align-items: center;
	z-index: 10;
`

const ButtonGroup = styled.div<{ $expanded: boolean }>`
	display: flex;
	align-items: center;
	border-radius: 4px;
	overflow: hidden;
`

const ActionButton = styled.div<{ $isMain?: boolean; $expanded?: boolean }>`
	width: 26px;
	height: 26px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	position: relative;
	background: transparent;
	transition: all 0.15s ease-out;

	i {
		font-size: 14px;
		color: var(--vscode-descriptionForeground);
		opacity: 0.8;
		transition: all 0.15s ease-out;
	}

	&:hover {
		background: var(--vscode-toolbar-hoverBackground);
		i {
			color: var(--vscode-foreground);
			opacity: 1;
		}

		i.codicon-diff {
			animation: glow 0.4s ease-out;
		}

		i.codicon-refresh {
			animation: rotate360 0.7s ease-out;
		}
	}

	${(props) =>
		props.$expanded &&
		`
		i.codicon-history {
			animation: rotateBack 0.8s ease-out;
		}
	`}

	${(props) =>
		!props.$expanded &&
		props.$isMain &&
		`
		&.was-expanded i.codicon-history {
			animation: rotate360 0.8s ease-out;
		}
	`}

	&[data-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	@keyframes rotate360 {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes rotateBack {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(-360deg);
		}
	}

	@keyframes glow {
		0% {
			filter: brightness(1);
		}
		50% {
			filter: brightness(1.3);
		}
		100% {
			filter: brightness(1);
		}
	}
`

const ExpandingOptions = styled.div<{ $expanded: boolean }>`
	display: flex;
	width: ${(props) => (props.$expanded ? "52px" : "0")};
	overflow: hidden;
	transition: all 0.2s ease-out;
`

const Menu = styled.div<{ $top: number; $right: number }>`
	position: fixed;
	top: ${(props) => props.$top}px;
	right: ${(props) => props.$right}px;
	background: var(--vscode-menu-background);
	border: 1px solid var(--vscode-widget-border);
	border-radius: 6px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
	min-width: 280px;
	overflow: hidden;
	z-index: 999999;
`

const MenuItem = styled.div<{ $disabled?: boolean }>`
	padding: 8px 12px;
	cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
	display: flex;
	flex-direction: column;
	gap: 4px;
	transition: all 0.1s ease-out;

	&:not(:last-child) {
		border-bottom: 1px solid var(--vscode-widget-border);
	}

	&:hover {
		background: ${(props) => (props.$disabled ? "none" : "var(--vscode-list-hoverBackground)")};
	}

	${(props) =>
		props.$disabled &&
		`
		opacity: 0.5;
		pointer-events: none;
	`}
`

const MenuItemTitle = styled.div`
	font-size: 13px;
	color: var(--vscode-foreground);
	display: flex;
	align-items: center;
	gap: 8px;

	i {
		font-size: 14px;
		transition: transform 0.2s ease-out;
	}

	&:hover {
		i.codicon-refresh {
			animation: rotate360 0.7s ease-out;
		}
		i.codicon-comment-discussion {
			animation: bounce 0.5s ease-out;
		}
		i.codicon-files {
			animation: shake 0.5s ease-out;
		}
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3px);
		}
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-2px);
		}
		75% {
			transform: translateX(2px);
		}
	}
`

const MenuItemDescription = styled.div`
	font-size: 11px;
	color: var(--vscode-descriptionForeground);
	opacity: 0.8;
`

export const CheckpointOverlay = ({ messageTs }: CheckpointOverlayProps) => {
	const [expanded, setExpanded] = useState(false)
	const [wasExpanded, setWasExpanded] = useState(false)
	const [showMenu, setShowMenu] = useState(false)
	const [compareDisabled, setCompareDisabled] = useState(false)
	const [restoreTaskDisabled, setRestoreTaskDisabled] = useState(false)
	const [restoreWorkspaceDisabled, setRestoreWorkspaceDisabled] = useState(false)
	const [restoreBothDisabled, setRestoreBothDisabled] = useState(false)
	const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 })

	const buttonRef = useRef<HTMLDivElement>(null)
	const menuRef = useRef<HTMLDivElement>(null)
	const chatContainerRef = useRef<HTMLElement | null>(null)

	useEffect(() => {
		// Find the chat container element
		chatContainerRef.current = document.querySelector('[data-virtuoso-scroller="true"]')
	}, [])

	useEffect(() => {
		if (showMenu && chatContainerRef.current) {
			const handleScroll = () => {
				requestAnimationFrame(updateMenuPosition)
			}

			const chatContainer = chatContainerRef.current
			chatContainer.addEventListener("scroll", handleScroll, { passive: true })
			window.addEventListener("resize", updateMenuPosition)

			return () => {
				chatContainer.removeEventListener("scroll", handleScroll)
				window.removeEventListener("resize", updateMenuPosition)
			}
		}
	}, [showMenu])

	const handleMessage = useCallback((event: MessageEvent) => {
		const message: ExtensionMessage = event.data
		if (message.type === "relinquishControl") {
			setCompareDisabled(false)
			setRestoreTaskDisabled(false)
			setRestoreWorkspaceDisabled(false)
			setRestoreBothDisabled(false)
			setExpanded(false)
			setShowMenu(false)
		}
	}, [])

	useEvent("message", handleMessage)

	useClickAway(menuRef, (event) => {
		if ((showMenu || expanded) && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
			if (expanded) setExpanded(false)
			if (showMenu) setShowMenu(false)
		}
	})

	const updateMenuPosition = useCallback(() => {
		if (!buttonRef.current) return
		const rect = buttonRef.current.getBoundingClientRect()
		const spaceBelow = window.innerHeight - rect.bottom

		// Position menu below button if there's enough space, otherwise above
		const top = spaceBelow > 200 ? rect.bottom + 4 : rect.top - 4

		// Always align with the right edge of the button
		const right = window.innerWidth - rect.right

		setMenuPosition({ top, right })
	}, [])

	const handleRestore = (type: ClineCheckpointRestore) => {
		switch (type) {
			case "task":
				setRestoreTaskDisabled(true)
				break
			case "workspace":
				setRestoreWorkspaceDisabled(true)
				break
			case "taskAndWorkspace":
				setRestoreBothDisabled(true)
				break
		}

		vscode.postMessage({
			type: "checkpointRestore",
			number: messageTs,
			text: type,
		})
		setShowMenu(false)
	}

	const handleExpandClick = () => {
		if (!expanded) {
			setWasExpanded(false)
		} else {
			setWasExpanded(true)
		}
		setExpanded(!expanded)
	}

	return (
		<Controls ref={buttonRef}>
			<ButtonGroup $expanded={expanded}>
				<ExpandingOptions $expanded={expanded}>
					<ActionButton
						data-disabled={compareDisabled}
						onClick={() => {
							setCompareDisabled(true)
							vscode.postMessage({
								type: "checkpointDiff",
								number: messageTs,
							})
						}}
						title="Compare Changes">
						<i className="codicon codicon-diff" />
					</ActionButton>
					<ActionButton
						onClick={() => {
							updateMenuPosition()
							setShowMenu(true)
						}}
						title="Restore Checkpoint">
						<i className="codicon codicon-refresh" />
					</ActionButton>
				</ExpandingOptions>
				<ActionButton
					$isMain
					$expanded={expanded}
					className={wasExpanded ? "was-expanded" : ""}
					onClick={handleExpandClick}
					title="Checkpoint Actions">
					<i className="codicon codicon-history" />
				</ActionButton>
			</ButtonGroup>

			{showMenu &&
				createPortal(
					<Menu ref={menuRef} $top={menuPosition.top} $right={menuPosition.right}>
						<MenuItem onClick={() => handleRestore("taskAndWorkspace")} $disabled={restoreBothDisabled}>
							<MenuItemTitle>
								<i className="codicon codicon-refresh" />
								Restore Task and Workspace
							</MenuItemTitle>
							<MenuItemDescription>Restores both the conversation and your project files</MenuItemDescription>
						</MenuItem>
						<MenuItem onClick={() => handleRestore("task")} $disabled={restoreTaskDisabled}>
							<MenuItemTitle>
								<i className="codicon codicon-comment-discussion" />
								Restore Task Only
							</MenuItemTitle>
							<MenuItemDescription>Removes messages after this point</MenuItemDescription>
						</MenuItem>
						<MenuItem onClick={() => handleRestore("workspace")} $disabled={restoreWorkspaceDisabled}>
							<MenuItemTitle>
								<i className="codicon codicon-files" />
								Restore Workspace Only
							</MenuItemTitle>
							<MenuItemDescription>Restores project files only</MenuItemDescription>
						</MenuItem>
					</Menu>,
					document.body,
				)}
		</Controls>
	)
}

export const CheckpointControls = Controls
