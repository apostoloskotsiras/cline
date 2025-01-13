import { useCallback } from 'react'
import * as ModernDarkTheme from '../components/styles/themes/modern/dark'
import * as ModernLightTheme from '../components/styles/themes/modern/light'
import * as ClassicDarkTheme from '../components/styles/themes/classic/dark'
import * as ClassicLightTheme from '../components/styles/themes/classic/light'

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

export type ThemeStyles = Record<ThemeComponentKey, any>

export const useThemeStyles = (component: ThemeComponentKey, mode: ThemeMode, type: ThemeType) => {
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

    return themeStyles[type][mode][component]
} 