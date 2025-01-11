import React, { useEffect, useState } from "react"
import { ExtensionMessage } from "../../src/shared/ExtensionMessage"
import { WebviewMessage } from "../../src/shared/WebviewMessage"
import ChatView from "./components/chat/ChatView"
import HistoryView from "./components/history/HistoryView"
import SettingsView from "./components/settings/SettingsView"
import WelcomeView from "./components/welcome/WelcomeView"
import { ExtensionStateContextProvider, useExtensionState } from "./context/ExtensionStateContext"
import { vscode } from "./utils/vscode"
import McpView from "./components/mcp/McpView"
import NavBar from "./components/navigation/NavBar"

const AppContent = () => {
	const { didHydrateState, showWelcome, shouldShowAnnouncement } = useExtensionState()
	const [showSettings, setShowSettings] = useState(false)
	const [showHistory, setShowHistory] = useState(false)
	const [showMcp, setShowMcp] = useState(false)
	const [showAnnouncement, setShowAnnouncement] = useState(false)

	useEffect(() => {
		if (shouldShowAnnouncement) {
			setShowAnnouncement(true)
			vscode.postMessage({ type: "didShowAnnouncement" } as WebviewMessage)
		}
	}, [shouldShowAnnouncement])

	if (!didHydrateState) {
		return null
	}

	return (
		<div className="h-full flex flex-col">
			<NavBar 
				showSettings={showSettings}
				showHistory={showHistory}
				showMcp={showMcp}
				logoUrl={(window as any).robotPanelDarkUri}
				onNewTask={() => {
					setShowSettings(false)
					setShowHistory(false)
					setShowMcp(false)
				}}
				onMcpServers={() => {
					setShowSettings(false)
					setShowHistory(false)
					setShowMcp(true)
				}}
				onHistory={() => {
					setShowSettings(false)
					setShowHistory(true)
					setShowMcp(false)
				}}
				onSettings={() => {
					setShowSettings(true)
					setShowHistory(false)
					setShowMcp(false)
				}}
				onPopout={() => {
					vscode.postMessage({ type: "popoutButtonClicked" } as WebviewMessage)
				}}
			/>

			<div className="flex-1 overflow-hidden">
				{showWelcome ? (
					<WelcomeView />
				) : showSettings ? (
					<SettingsView onDone={() => setShowSettings(false)} />
				) : showHistory ? (
					<HistoryView onDone={() => setShowHistory(false)} />
				) : showMcp ? (
					<McpView onDone={() => setShowMcp(false)} />
				) : (
					<ChatView
						isHidden={false}
						showAnnouncement={showAnnouncement}
						hideAnnouncement={() => setShowAnnouncement(false)}
						showHistoryView={() => {
							setShowSettings(false)
							setShowMcp(false)
							setShowHistory(true)
						}}
					/>
				)}
			</div>
		</div>
	)
}

const App = () => {
	return (
		<ExtensionStateContextProvider>
			<AppContent />
		</ExtensionStateContextProvider>
	)
}

export default App
