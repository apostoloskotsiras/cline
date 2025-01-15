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

interface ChatViewColors {
    wrapper: {
        background: string
        backdropBlur: string
        radialGlow: string
    }
    container: {
        background: string
        backdropBlur: string
        border: string
        shadow: string
        topGradient: string
    }
    button: {
        primaryBackground: string
        primaryHover: string
        secondaryBackground: string
        secondaryHover: string
        border: string
        shadow: string
        hoverShadow: string
    }
    scrollToTop: {
        background: string
        hover: string
        border: string
        shadow: string
        hoverShadow: string
    }
}

interface GradientColors {
    primaryGradient: string
    secondaryGradient: string
    backgroundGradient: string
    buttonPrimaryGradient: string
    buttonSecondaryGradient: string
}

interface EffectColors {
    blur: string
    glow: string
    shadow: string
    radialGlow: string
}

interface McpColors {
    serverCard: {
        background: string
        hoverBackground: string
        border: string
        hoverBorder: string
    }
    doneButton: {
        background: string
        hoverBackground: string
        border: string
        hoverBorder: string
        text: string
    }
    settingsButton: {
        background: string
        hoverBackground: string
        border: string
        hoverBorder: string
        text: string
    }
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
    gradients: GradientColors
    effects: EffectColors
    chatView: ChatViewColors
    mcp: McpColors
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
    },
    gradients: {
        primaryGradient: 'linear-gradient(145deg, #0E639CE6 0%, #0E639CD9 100%)',
        secondaryGradient: 'linear-gradient(145deg, #252526F2 0%, #252526F2 100%)',
        backgroundGradient: 'linear-gradient(145deg, #1E1E1EFA 0%, #1E1E1EFA 100%)',
        buttonPrimaryGradient: 'linear-gradient(145deg, #0E639C 0%, #0E639CF2 100%)',
        buttonSecondaryGradient: 'linear-gradient(145deg, #252526FA 0%, #252526FA 100%)'
    },
    effects: {
        blur: 'blur(12px)',
        glow: '0 6px 20px #0E639C40',
        shadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        radialGlow: 'radial-gradient(circle at 50% 0%, #0E639C14 0%, #0E639C0D 25%, transparent 50%)'
    },
    chatView: {
        wrapper: {
            background: 'linear-gradient(145deg, #1E1E1EFA 0%, #1E1E1EFA 100%)',
            backdropBlur: 'blur(12px)',
            radialGlow: 'radial-gradient(circle at 50% 0%, #0E639C14 0%, #0E639C0D 25%, transparent 50%)'
        },
        container: {
            background: '#252526D9',
            backdropBlur: 'blur(16px)',
            border: '#45454514',
            shadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
            topGradient: 'linear-gradient(90deg, transparent 0%, #0E639C1A 50%, transparent 100%)'
        },
        button: {
            primaryBackground: 'linear-gradient(145deg, #0E639CE6 0%, #0E639CD9 100%)',
            primaryHover: 'linear-gradient(145deg, #0E639C 0%, #0E639CF2 100%)',
            secondaryBackground: 'linear-gradient(145deg, #252526F2 0%, #252526F2 100%)',
            secondaryHover: 'linear-gradient(145deg, #252526FA 0%, #252526FA 100%)',
            border: '#45454514',
            shadow: 'none',
            hoverShadow: '0 6px 20px #0E639C40'
        },
        scrollToTop: {
            background: '#252526F2',
            hover: '#252526FA',
            border: '#4545451A',
            shadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            hoverShadow: '0 6px 20px rgba(0, 0, 0, 0.25)'
        }
    },
    mcp: {
        serverCard: {
            background: '#2A2A2A',
            hoverBackground: '#323232',
            border: 'rgba(66, 153, 244, 0.2)',
            hoverBorder: 'rgb(66, 153, 244)'
        },
        doneButton: {
            background: 'rgba(66, 153, 244, 0.2)',
            hoverBackground: 'rgba(66, 153, 244, 0.4)',
            border: 'rgba(66, 153, 244, 0.4)',
            hoverBorder: 'rgb(66, 153, 244)',
            text: '#FFFFFF'
        },
        settingsButton: {
            background: 'rgba(66, 153, 244, 0.1)',
            hoverBackground: 'rgba(66, 153, 244, 0.2)',
            border: 'rgba(66, 153, 244, 0.2)',
            hoverBorder: 'rgba(66, 153, 244, 0.4)',
            text: '#FFFFFF'
        }
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
    },
    gradients: {
        primaryGradient: 'linear-gradient(145deg, #0078D4E6 0%, #0078D4D9 100%)',
        secondaryGradient: 'linear-gradient(145deg, #F5F5F5F2 0%, #F5F5F5F2 100%)',
        backgroundGradient: 'linear-gradient(145deg, #FFFFFFFA 0%, #FFFFFFFA 100%)',
        buttonPrimaryGradient: 'linear-gradient(145deg, #0078D4 0%, #0078D4F2 100%)',
        buttonSecondaryGradient: 'linear-gradient(145deg, #F5F5F5FA 0%, #F5F5F5FA 100%)'
    },
    effects: {
        blur: 'blur(12px)',
        glow: '0 6px 20px #0078D440',
        shadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        radialGlow: 'radial-gradient(circle at 50% 0%, #0078D414 0%, #0078D40D 25%, transparent 50%)'
    },
    chatView: {
        wrapper: {
            background: 'linear-gradient(145deg, #FFFFFFFA 0%, #FFFFFFFA 100%)',
            backdropBlur: 'blur(12px)',
            radialGlow: 'radial-gradient(circle at 50% 0%, #0078D414 0%, #0078D40D 25%, transparent 50%)'
        },
        container: {
            background: '#F5F5F5D9',
            backdropBlur: 'blur(16px)',
            border: '#E0E0E014',
            shadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
            topGradient: 'linear-gradient(90deg, transparent 0%, #0078D41A 50%, transparent 100%)'
        },
        button: {
            primaryBackground: 'linear-gradient(145deg, #0078D4E6 0%, #0078D4D9 100%)',
            primaryHover: 'linear-gradient(145deg, #0078D4 0%, #0078D4F2 100%)',
            secondaryBackground: 'linear-gradient(145deg, #F5F5F5F2 0%, #F5F5F5F2 100%)',
            secondaryHover: 'linear-gradient(145deg, #F5F5F5FA 0%, #F5F5F5FA 100%)',
            border: '#E0E0E014',
            shadow: 'none',
            hoverShadow: '0 6px 20px #0078D440'
        },
        scrollToTop: {
            background: '#F5F5F5F2',
            hover: '#F5F5F5FA',
            border: '#E0E0E01A',
            shadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            hoverShadow: '0 6px 20px rgba(0, 0, 0, 0.25)'
        }
    },
    mcp: {
        serverCard: {
            background: '#FAFAFA',
            hoverBackground: '#F5F5F5',
            border: 'rgba(22, 104, 194, 0.2)',
            hoverBorder: 'rgb(22, 104, 194)'
        },
        doneButton: {
            background: 'rgba(22, 104, 194, 0.2)',
            hoverBackground: 'rgba(22, 104, 194, 0.4)',
            border: 'rgba(22, 104, 194, 0.4)',
            hoverBorder: 'rgb(22, 104, 194)',
            text: '#1F1F1F'
        },
        settingsButton: {
            background: 'rgba(22, 104, 194, 0.1)',
            hoverBackground: 'rgba(22, 104, 194, 0.2)',
            border: 'rgba(22, 104, 194, 0.2)',
            hoverBorder: 'rgba(22, 104, 194, 0.4)',
            text: '#1F1F1F'
        }
    }
}

export const getThemeColors = (mode: ThemeMode): ThemeColors => {
    return mode === 'dark' ? darkColors : lightColors
}

export default getThemeColors 