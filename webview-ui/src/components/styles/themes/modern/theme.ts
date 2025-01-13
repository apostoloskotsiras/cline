import { ThemeMode } from '../../../../utils/theme'

interface ChatTextAreaColors {
    containerBackground: string
    containerHover: string
    textAreaBackground: string
    buttonBackground: string
    buttonHover: string
    mentionHighlight: string
    tagBackground: string
    tagHover: string
    tagBorder: string
}

interface ThemeColors {
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
    chatTextArea: ChatTextAreaColors
}

const darkColors: ThemeColors = {
    background: '#1E1E1E',
    foreground: '#D4D4D4',
    border: '#454545',
    primary: '#0E639C',
    secondary: '#252526',
    success: '#89D185',
    error: '#F14C4C',
    warning: '#CCA700',
    info: '#75BEFF',
    textPrimary: '#D4D4D4',
    textSecondary: '#A6A6A6',
    textDisabled: '#6B6B6B',
    text: '#FFFFFF',
    divider: '#454545',
    hover: '#2A2D2E',
    active: '#37373D',
    selected: '#094771',
    disabled: '#4D4D4D',
    chatTextArea: {
        containerBackground: '#1E1E1E',
        containerHover: '#252526',
        textAreaBackground: '#1E1E1E',
        buttonBackground: '#2D2D2D',
        buttonHover: '#3D3D3D',
        mentionHighlight: '#094771CC',
        tagBackground: '#252526FA',
        tagHover: '#37373DFA',
        tagBorder: '#454545CC'
    }
}

const lightColors: ThemeColors = {
    background: '#FFFFFF',
    foreground: '#1F1F1F',
    border: '#E0E0E0',
    primary: '#0078D4',
    secondary: '#F5F5F5',
    success: '#16825D',
    error: '#CD3131',
    warning: '#DDB100',
    info: '#0068C4',
    textPrimary: '#1F1F1F',
    textSecondary: '#616161',
    textDisabled: '#A0A0A0',
    text: '#1F1F1F',
    divider: '#E0E0E0',
    hover: '#F5F5F5',
    active: '#E8E8E8',
    selected: '#CCE5F7',
    disabled: '#E0E0E0',
    chatTextArea: {
        containerBackground: '#FFFFFF',
        containerHover: '#F5F5F5',
        textAreaBackground: '#FFFFFF',
        buttonBackground: '#F5F5F5',
        buttonHover: '#E8E8E8',
        mentionHighlight: '#CCE5F7CC',
        tagBackground: '#F5F5F5FA',
        tagHover: '#E8E8E8FA',
        tagBorder: '#E0E0E0CC'
    }
}

export const getThemeColors = (mode: ThemeMode): ThemeColors => {
    return mode === 'dark' ? darkColors : lightColors
}

export default getThemeColors 