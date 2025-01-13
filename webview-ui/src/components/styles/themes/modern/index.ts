import { ThemeComponentKey, ThemeMode, ThemeStyles } from '../../../../utils/theme'
import { getThemeColors } from './theme'

// Settings
import * as SettingsView from './components/settings/SettingsView.styles'
import * as TabNavbar from './components/settings/TabNavbar.styles'
import * as ApiOptions from './components/settings/ApiOptions.styles'
import * as OpenRouterModelPicker from './components/settings/OpenRouterModelPicker.styles'

// Chat
import * as ChatView from './components/chat/ChatView.styles'
import * as BrowserSessionRow from './components/chat/BrowserSessionRow.styles'
import * as Announcement from './components/chat/Announcement.styles'
import * as AutoApproveMenu from './components/chat/AutoApproveMenu.styles'
import * as ChatRow from './components/chat/chatrow.styles'
import * as TaskHeader from './components/chat/TaskHeader.styles'
import * as ContextMenu from './components/chat/ContextMenu.styles'
import * as ChatTextArea from './components/chat/ChatTextArea.styles'

// Welcome
import * as WelcomeView from './components/welcome/WelcomeView.styles'

// Navigation
import * as NavBar from './components/navigation/NavBar.styles'

// MCP
import * as McpView from './components/mcp/McpView.styles'
import * as McpResourceRow from './components/mcp/McpResourceRow.styles'
import * as McpToolRow from './components/mcp/McpToolRow.styles'

// History
import * as HistoryView from './components/history/HistoryView.styles'
import * as HistoryPreview from './components/history/HistoryPreview.styles'

// Common
import * as SuccessButton from './components/common/SuccessButton.styles'
import * as Tag from './components/common/Tag.styles'
import * as Thumbnails from './components/common/Thumbnails.styles'
import * as MarkdownBlock from './components/common/MarkdownBlock.styles'
import * as CodeAccordian from './components/common/CodeAccordian.styles'
import * as CodeBlock from './components/common/CodeBlock.styles'
import * as CheckpointControls from './components/common/CheckpointControls.styles'

const createThemeStyles = (mode: ThemeMode): Record<ThemeComponentKey, any> => {
    const colors = getThemeColors(mode)
    
    return {
        // Settings
        'settings/SettingsView': SettingsView,
        'settings/TabNavbar': TabNavbar,
        'settings/ApiOptions': ApiOptions,
        'settings/OpenRouterModelPicker': OpenRouterModelPicker,
        
        // Chat
        'chat/ChatView': ChatView,
        'chat/BrowserSessionRow': BrowserSessionRow,
        'chat/Announcement': Announcement,
        'chat/AutoApproveMenu': AutoApproveMenu,
        'chat/ChatRow': ChatRow,
        'chat/TaskHeader': TaskHeader,
        'chat/ContextMenu': ContextMenu,
        'chat/ChatTextArea': ChatTextArea,
        
        // Welcome
        'welcome/WelcomeView': WelcomeView,
        
        // Navigation
        'navigation/NavBar': NavBar,
        
        // MCP
        'mcp/McpView': McpView,
        'mcp/McpResourceRow': McpResourceRow,
        'mcp/McpToolRow': McpToolRow,
        
        // History
        'history/HistoryView': HistoryView,
        'history/HistoryPreview': HistoryPreview,
        
        // Common
        'common/SuccessButton': SuccessButton,
        'common/Tag': Tag,
        'common/Thumbnails': Thumbnails,
        'common/MarkdownBlock': MarkdownBlock,
        'common/CodeAccordian': CodeAccordian,
        'common/CodeBlock': CodeBlock,
        'common/CheckpointControls': CheckpointControls
    }
}

export const modernTheme = {
    dark: createThemeStyles('dark'),
    light: createThemeStyles('light')
}

export default modernTheme 