// Copy the same content but update the imports to use classic light theme paths
// Settings
import * as SettingsView from './settings/SettingsView.styles'
import * as TabNavbar from './settings/TabNavbar.styles'
import * as ApiOptions from './settings/ApiOptions.styles'
import * as OpenRouterModelPicker from './settings/OpenRouterModelPicker.styles'

// Chat
import * as ChatView from './chat/ChatView.styles'
import * as BrowserSessionRow from './chat/BrowserSessionRow.styles'
import * as Announcement from './chat/Announcement.styles'
import * as AutoApproveMenu from './chat/AutoApproveMenu.styles'
import * as ChatRow from './chat/chatrow.styles'
import * as TaskHeader from './chat/TaskHeader.styles'
import * as ContextMenu from './chat/ContextMenu.styles'
import * as ChatTextArea from './chat/ChatTextArea.styles'

// Welcome
import * as WelcomeView from './welcome/WelcomeView.styles'

// Navigation
import * as NavBar from './navigation/NavBar.styles'

// MCP
import * as McpView from './mcp/McpView.styles'
import * as McpResourceRow from './mcp/McpResourceRow.styles'
import * as McpToolRow from './mcp/McpToolRow.styles'

// History
import * as HistoryView from './history/HistoryView.styles'
import * as HistoryPreview from './history/HistoryPreview.styles'

// Common
import * as SuccessButton from './common/SuccessButton.styles'
import * as Tag from './common/Tag.styles'
import * as Thumbnails from './common/Thumbnails.styles'
import * as MarkdownBlock from './common/MarkdownBlock.styles'
import * as CodeAccordian from './common/CodeAccordian.styles'
import * as CodeBlock from './common/CodeBlock.styles'
import * as CheckpointControls from './common/CheckpointControls.styles'

// Export with theme keys
const themeStyles = {
    'settings/SettingsView': SettingsView,
    'settings/TabNavbar': TabNavbar,
    'settings/ApiOptions': ApiOptions,
    'settings/OpenRouterModelPicker': OpenRouterModelPicker,
    'chat/ChatView': ChatView,
    'chat/BrowserSessionRow': BrowserSessionRow,
    'chat/Announcement': Announcement,
    'chat/AutoApproveMenu': AutoApproveMenu,
    'chat/ChatRow': ChatRow,
    'chat/TaskHeader': TaskHeader,
    'chat/ContextMenu': ContextMenu,
    'chat/ChatTextArea': ChatTextArea,
    'welcome/WelcomeView': WelcomeView,
    'navigation/NavBar': NavBar,
    'mcp/McpView': McpView,
    'mcp/McpResourceRow': McpResourceRow,
    'mcp/McpToolRow': McpToolRow,
    'history/HistoryView': HistoryView,
    'history/HistoryPreview': HistoryPreview,
    'common/SuccessButton': SuccessButton,
    'common/Tag': Tag,
    'common/Thumbnails': Thumbnails,
    'common/MarkdownBlock': MarkdownBlock,
    'common/CodeAccordian': CodeAccordian,
    'common/CodeBlock': CodeBlock,
    'common/CheckpointControls': CheckpointControls
}

export default themeStyles 