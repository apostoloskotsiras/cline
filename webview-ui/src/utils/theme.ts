import { useState, useEffect } from 'react'

// Import all theme styles statically
import * as ModernDarkSettingsView from '../components/styles/themes/modern/dark/settings/SettingsView.styles'
import * as ModernLightSettingsView from '../components/styles/themes/modern/light/settings/SettingsView.styles'
import * as ModernDarkChatView from '../components/styles/themes/modern/dark/chat/ChatView.styles'
import * as ModernLightChatView from '../components/styles/themes/modern/light/chat/ChatView.styles'

// Import classic theme styles (temporarily using modern as placeholder)
import * as ClassicDarkSettingsView from '../components/styles/themes/classic/dark/settings/SettingsView.styles'
import * as ClassicLightSettingsView from '../components/styles/themes/classic/light/settings/SettingsView.styles'
import * as ClassicDarkChatView from '../components/styles/themes/classic/dark/chat/ChatView.styles'
import * as ClassicLightChatView from '../components/styles/themes/classic/light/chat/ChatView.styles'

type ThemeComponentKey = 'settings/SettingsView' | 'chat/ChatView'
type ThemeMode = 'light' | 'dark'
type ThemeType = 'modern' | 'classic'

interface ThemeComponents {
    modern: {
        dark: {
            'settings/SettingsView': typeof ModernDarkSettingsView;
            'chat/ChatView': typeof ModernDarkChatView;
        };
        light: {
            'settings/SettingsView': typeof ModernLightSettingsView;
            'chat/ChatView': typeof ModernLightChatView;
        };
    };
    classic: {
        dark: {
            'settings/SettingsView': typeof ClassicDarkSettingsView;
            'chat/ChatView': typeof ClassicDarkChatView;
        };
        light: {
            'settings/SettingsView': typeof ClassicLightSettingsView;
            'chat/ChatView': typeof ClassicLightChatView;
        };
    };
}

const themeComponents: ThemeComponents = {
    modern: {
        dark: {
            'settings/SettingsView': ModernDarkSettingsView,
            'chat/ChatView': ModernDarkChatView
        },
        light: {
            'settings/SettingsView': ModernLightSettingsView,
            'chat/ChatView': ModernLightChatView
        }
    },
    classic: {
        dark: {
            'settings/SettingsView': ClassicDarkSettingsView,
            'chat/ChatView': ClassicDarkChatView
        },
        light: {
            'settings/SettingsView': ClassicLightSettingsView,
            'chat/ChatView': ClassicLightChatView
        }
    }
}

type ThemeComponentType<K extends ThemeComponentKey> = 
    K extends 'settings/SettingsView' ? 
        typeof ModernDarkSettingsView | typeof ModernLightSettingsView | 
        typeof ClassicDarkSettingsView | typeof ClassicLightSettingsView :
    K extends 'chat/ChatView' ? 
        typeof ModernDarkChatView | typeof ModernLightChatView |
        typeof ClassicDarkChatView | typeof ClassicLightChatView :
    never;

export const getThemeStyles = <K extends ThemeComponentKey>(
    component: K, 
    mode: ThemeMode,
    type: ThemeType = 'modern'
): ThemeComponentType<K> => {
    const themeStyles = themeComponents[type][mode][component] as ThemeComponentType<K>
    if (!themeStyles) {
        // Fallback to modern dark theme if component not found
        if (type === 'classic') {
            return getThemeStyles(component, mode, 'modern')
        }
        if (mode === 'light') {
            return getThemeStyles(component, 'dark', type)
        }
        return themeComponents.modern.dark[component] as ThemeComponentType<K>
    }
    return themeStyles
}

export const useThemeStyles = <K extends ThemeComponentKey>(
    component: K, 
    mode: ThemeMode,
    type: ThemeType = 'modern'
): ThemeComponentType<K> => {
    const [styles, setStyles] = useState<ThemeComponentType<K>>(() => getThemeStyles(component, mode, type))

    useEffect(() => {
        setStyles(getThemeStyles(component, mode, type))
    }, [component, mode, type])

    return styles
} 