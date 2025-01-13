import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useEvent } from "react-use"
import { DEFAULT_AUTO_APPROVAL_SETTINGS } from "../../../src/shared/AutoApprovalSettings"
import { ExtensionMessage, ExtensionState } from "../../../src/shared/ExtensionMessage"
import { ApiConfiguration, ModelInfo, openRouterDefaultModelId, openRouterDefaultModelInfo } from "../../../src/shared/api"
import { findLastIndex } from "../../../src/shared/array"
import { McpServer } from "../../../src/shared/mcp"
import { convertTextMateToHljs } from "../utils/textMateToHljs"
import { vscode } from "../utils/vscode"
import * as ModernDarkTheme from '../components/styles/themes/modern/dark'
import * as ModernLightTheme from '../components/styles/themes/modern/light'
import * as ClassicDarkTheme from '../components/styles/themes/classic/dark'
import * as ClassicLightTheme from '../components/styles/themes/classic/light'
import { ThemeComponentKey, ThemeMode, ThemeStyles, ThemeType } from '../utils/theme'

interface ExtensionStateContextType extends ExtensionState {
	didHydrateState: boolean
	showWelcome: boolean
	theme: any
	themeMode: ThemeMode
	themeType: ThemeType
	openRouterModels: Record<string, ModelInfo>
	mcpServers: McpServer[]
	filePaths: string[]
	setApiConfiguration: (config: ApiConfiguration) => void
	setCustomInstructions: (value?: string) => void
	setShowAnnouncement: (value: boolean) => void
	setThemeMode: (mode: ThemeMode) => void
	setThemeType: (type: ThemeType) => void
	getThemeStyles: (component: ThemeComponentKey) => any
}

const ExtensionStateContext = createContext<ExtensionStateContextType | undefined>(undefined)

export const ExtensionStateContextProvider: React.FC<{
	children: React.ReactNode
}> = ({ children }) => {
	const [state, setState] = useState<ExtensionState>({
		version: "",
		clineMessages: [],
		taskHistory: [],
		shouldShowAnnouncement: false,
		autoApprovalSettings: DEFAULT_AUTO_APPROVAL_SETTINGS,
	})
	const [didHydrateState, setDidHydrateState] = useState(false)
	const [showWelcome, setShowWelcome] = useState(false)
	const [theme, setTheme] = useState<any>(undefined)
	const [themeMode, setThemeMode] = useState<ThemeMode>('dark')
	const [themeType, setThemeType] = useState<ThemeType>('modern')
	const [filePaths, setFilePaths] = useState<string[]>([])
	const [openRouterModels, setOpenRouterModels] = useState<Record<string, ModelInfo>>({
		[openRouterDefaultModelId]: openRouterDefaultModelInfo,
	})
	const [mcpServers, setMcpServers] = useState<McpServer[]>([])

	const handleMessage = useCallback((event: MessageEvent) => {
		const message: ExtensionMessage = event.data
		switch (message.type) {
			case "state": {
				setState(message.state!)
				const config = message.state?.apiConfiguration
				const hasKey = config
					? [
							config.apiKey,
							config.openRouterApiKey,
							config.awsRegion,
							config.vertexProjectId,
							config.openAiApiKey,
							config.ollamaModelId,
							config.lmStudioModelId,
							config.geminiApiKey,
							config.openAiNativeApiKey,
							config.deepSeekApiKey,
						].some((key) => key !== undefined)
					: false
				setShowWelcome(!hasKey)
				setDidHydrateState(true)
				break
			}
			case "theme": {
				if (message.text) {
					setTheme(convertTextMateToHljs(JSON.parse(message.text)))
				}
				break
			}
			case "themeChanged": {
				if (message.mode) {
					setThemeMode(message.mode)
				}
				if (message.themeType) {
					setThemeType(message.themeType)
				}
				break
			}
			case "workspaceUpdated": {
				setFilePaths(message.filePaths ?? [])
				break
			}
			case "partialMessage": {
				const partialMessage = message.partialMessage!
				setState((prevState) => {
					// worth noting it will never be possible for a more up-to-date message to be sent here or in normal messages post since the presentAssistantContent function uses lock
					const lastIndex = findLastIndex(prevState.clineMessages, (msg) => msg.ts === partialMessage.ts)
					if (lastIndex !== -1) {
						const newClineMessages = [...prevState.clineMessages]
						newClineMessages[lastIndex] = partialMessage
						return { ...prevState, clineMessages: newClineMessages }
					}
					return prevState
				})
				break
			}
			case "openRouterModels": {
				const updatedModels = message.openRouterModels ?? {}
				setOpenRouterModels({
					[openRouterDefaultModelId]: openRouterDefaultModelInfo, // in case the extension sent a model list without the default model
					...updatedModels,
				})
				break
			}
			case "mcpServers": {
				setMcpServers(message.mcpServers ?? [])
				break
			}
		}
	}, [])

	useEvent("message", handleMessage)

	useEffect(() => {
		vscode.postMessage({ type: "webviewDidLaunch" })
	}, [])

	const getThemeStyles = useCallback((component: ThemeComponentKey) => {
		const themeStyles: Record<ThemeType, Record<ThemeMode, ThemeStyles>> = {
			modern: {
				dark: ModernDarkTheme.default,
				light: ModernLightTheme.default
			},
			classic: {
				dark: ClassicDarkTheme.default,
				light: ClassicLightTheme.default
			}
		}
		return themeStyles[themeType || 'modern'][themeMode || 'dark'][component]
	}, [themeMode, themeType])

	const contextValue: ExtensionStateContextType = {
		...state,
		didHydrateState,
			showWelcome,
			theme,
			themeMode,
			themeType,
			openRouterModels,
			mcpServers,
			filePaths,
			setApiConfiguration: (value) =>
				setState((prevState) => ({
					...prevState,
					apiConfiguration: value,
				})),
			setCustomInstructions: (value) =>
				setState((prevState) => ({
					...prevState,
					customInstructions: value,
				})),
			setShowAnnouncement: (value) =>
				setState((prevState) => ({
					...prevState,
					shouldShowAnnouncement: value,
				})),
			setThemeMode: (mode) => {
				setThemeMode(mode)
				vscode.postMessage({ type: "themeChanged", mode })
			},
			setThemeType: (type) => {
				setThemeType(type)
				vscode.postMessage({ type: "themeChanged", mode: themeMode, themeType: type })
			},
			getThemeStyles,
	}

	return <ExtensionStateContext.Provider value={contextValue}>{children}</ExtensionStateContext.Provider>
}

export const useExtensionState = () => {
	const context = useContext(ExtensionStateContext)
	if (context === undefined) {
		throw new Error("useExtensionState must be used within an ExtensionStateContextProvider")
	}
	return context
}
