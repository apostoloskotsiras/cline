import { ThemeColors, ThemeMode } from '../../../../utils/theme'

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
    disabled: '#4D4D4D'
}

const lightColors: ThemeColors = {
    background: '#FFFFFF',
    foreground: '#000000',
    border: '#D4D4D4',
    primary: '#007ACC',
    secondary: '#F3F3F3',
    success: '#388A34',
    error: '#E51400',
    warning: '#CD9731',
    info: '#217DAF',
    textPrimary: '#000000',
    textSecondary: '#6F6F6F',
    textDisabled: '#A0A0A0',
    text: '#000000',
    divider: '#CCCCCC',
    hover: '#F0F0F0',
    active: '#E8E8E8',
    selected: '#E8E8E8',
    disabled: '#CCCCCC'
}

export const getThemeColors = (mode: ThemeMode): ThemeColors => {
    return mode === 'dark' ? darkColors : lightColors
} 