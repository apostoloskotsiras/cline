import { useCallback } from 'react'
import { useExtensionState } from '../context/ExtensionStateContext'

export type ThemeMode = 'light' | 'dark'
export type ThemeType = 'modern' | 'classic'

export type ThemeComponentKey = 
    | 'settings/SettingsView'
    | 'settings/TabNavbar'
    | 'settings/ApiOptions'
    | 'settings/OpenRouterModelPicker'
    | 'chat/ChatView'
    | 'chat/BrowserSessionRow'
    | 'chat/Announcement'
    | 'chat/AutoApproveMenu'
    | 'chat/ChatRow'
    | 'chat/TaskHeader'
    | 'chat/ContextMenu'
    | 'chat/ChatTextArea'
    | 'welcome/WelcomeView'
    | 'navigation/NavBar'
    | 'mcp/McpView'
    | 'mcp/McpResourceRow'
    | 'mcp/McpToolRow'
    | 'history/HistoryView'
    | 'history/HistoryPreview'
    | 'common/SuccessButton'
    | 'common/Tag'
    | 'common/Thumbnails'
    | 'common/MarkdownBlock'
    | 'common/CodeAccordian'
    | 'common/CodeBlock'
    | 'common/CheckpointControls'

export interface ThemeColors {
    background: string
    foreground: string
    border: string
    primary: string
    secondary: string
    success: string
    error: string
    warning: string
    info: string
    textPrimary: string
    textSecondary: string
    textDisabled: string
    text: string
    divider: string
    hover: string
    active: string
    selected: string
    disabled: string
}

export type ThemeStyles = Record<ThemeComponentKey, any>

export const useThemeStyles = (
    component: ThemeComponentKey,
    overrideMode?: ThemeMode,
    overrideType?: ThemeType
) => {
    const { themeMode, themeType, getThemeStyles } = useExtensionState()
    return getThemeStyles(component, overrideMode || themeMode, overrideType || themeType)
} 