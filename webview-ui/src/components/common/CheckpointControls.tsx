import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useClickAway, useEvent } from "react-use"
import { ExtensionMessage } from "../../../../src/shared/ExtensionMessage"
import { vscode } from "../../utils/vscode"
import { ClineCheckpointRestore } from "../../../../src/shared/WebviewMessage"
import * as S from "../styles/themes/modern/dark/common/CheckpointControls.styles"

interface CheckpointOverlayProps {
	messageTs?: number
}

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
		<S.Controls ref={buttonRef}>
			<S.ButtonGroup $expanded={expanded}>
				<S.ExpandingOptions $expanded={expanded}>
					<S.ActionButton
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
					</S.ActionButton>
					<S.ActionButton
						onClick={() => {
							updateMenuPosition()
							setShowMenu(true)
						}}
						title="Restore Checkpoint">
						<i className="codicon codicon-refresh" />
					</S.ActionButton>
				</S.ExpandingOptions>
				<S.ActionButton
					$isMain
					$expanded={expanded}
					className={wasExpanded ? "was-expanded" : ""}
					onClick={handleExpandClick}
					title="Checkpoint Actions">
					<i className="codicon codicon-history" />
				</S.ActionButton>
			</S.ButtonGroup>

			{showMenu &&
				createPortal(
					<S.Menu ref={menuRef} $top={menuPosition.top} $right={menuPosition.right}>
						<S.MenuItem onClick={() => handleRestore("taskAndWorkspace")} $disabled={restoreBothDisabled}>
							<S.MenuItemTitle>
								<i className="codicon codicon-refresh" />
								Restore Task and Workspace
							</S.MenuItemTitle>
							<S.MenuItemDescription>Restores both the conversation and your project files</S.MenuItemDescription>
						</S.MenuItem>
						<S.MenuItem onClick={() => handleRestore("task")} $disabled={restoreTaskDisabled}>
							<S.MenuItemTitle>
								<i className="codicon codicon-comment-discussion" />
								Restore Task Only
							</S.MenuItemTitle>
							<S.MenuItemDescription>Removes messages after this point</S.MenuItemDescription>
						</S.MenuItem>
						<S.MenuItem onClick={() => handleRestore("workspace")} $disabled={restoreWorkspaceDisabled}>
							<S.MenuItemTitle>
								<i className="codicon codicon-files" />
								Restore Workspace Only
							</S.MenuItemTitle>
							<S.MenuItemDescription>Restores project files only</S.MenuItemDescription>
						</S.MenuItem>
					</S.Menu>,
					document.body,
				)}
		</S.Controls>
	)
}

export const CheckpointControls = S.Controls
