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
	badge: {
		background: string
		foreground: string
	}
	autoApprove: {
		background: string
		hover: {
			background: string
			border: string
		}
		warning: string
		error: string
		info: string
	}
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
		containerBackground: 'rgb(30, 30, 30)',
		containerHover: 'rgb(35, 35, 35)',
		textAreaBackground: 'rgb(30, 30, 30)',
		buttonBackground: 'rgb(30, 30, 30)',
		buttonHover: 'rgb(40, 40, 40)',
		mentionHighlight: 'rgba(255, 255, 255, 0.3)',
		tagBackground: 'rgba(255, 255, 255, 0.04)',
		tagHover: 'rgba(255, 255, 255, 0.06)',
		tagBorder: 'rgba(255, 255, 255, 0.08)'
	},
	gradients: {
		primaryGradient: '#0E639C',
		secondaryGradient: '#252526',
		backgroundGradient: '#1E1E1E',
		buttonPrimaryGradient: '#0E639C',
		buttonSecondaryGradient: '#252526'
	},
	effects: {
		blur: 'none',
		glow: 'none',
		shadow: 'none',
		radialGlow: 'none'
	},
	chatView: {
		wrapper: {
			background: '#1E1E1E',
			backdropBlur: 'none',
			radialGlow: 'none'
		},
		container: {
			background: '#252526',
			backdropBlur: 'none',
			border: '#454545',
			shadow: 'none',
			topGradient: 'none'
		},
		button: {
			primaryBackground: '#0E639C',
			primaryHover: '#1177BB',
			secondaryBackground: '#252526',
			secondaryHover: '#2D2D2D',
			border: '#454545',
			shadow: 'none',
			hoverShadow: 'none'
		},
		scrollToTop: {
			background: '#252526',
			hover: '#2D2D2D',
			border: '#454545',
			shadow: 'none',
			hoverShadow: 'none'
		}
	},
	mcp: {
		serverCard: {
			background: '#252526',
			hoverBackground: '#2D2D2D',
			border: '#454545',
			hoverBorder: 'rgb(66, 153, 244)'
		},
		doneButton: {
			background: 'rgb(66, 153, 244)',
			hoverBackground: 'rgb(82, 166, 255)',
			border: 'rgb(66, 153, 244)',
			hoverBorder: 'rgb(82, 166, 255)',
			text: '#FFFFFF'
		},
		settingsButton: {
			background: 'rgb(66, 153, 244)',
			hoverBackground: 'rgb(82, 166, 255)',
			border: 'rgb(66, 153, 244)',
			hoverBorder: 'rgb(82, 166, 255)',
			text: '#FFFFFF'
		}
	},
	badge: {
		background: '#4D4D4D',
		foreground: '#FFFFFF'
	},
	autoApprove: {
		background: '#1E1E1E',
		hover: {
			background: '#2A2D2E',
			border: '#0E639C'
		},
		warning: '#CCA700',
		error: '#F14C4C',
		info: '#75BEFF'
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
		mentionHighlight: 'rgba(0, 0, 0, 0.3)',
		tagBackground: 'rgba(0, 0, 0, 0.04)',
		tagHover: 'rgba(0, 0, 0, 0.06)',
		tagBorder: 'rgba(0, 0, 0, 0.08)'
	},
	gradients: {
		primaryGradient: '#0078D4',
		secondaryGradient: '#F5F5F5',
		backgroundGradient: '#FFFFFF',
		buttonPrimaryGradient: '#0078D4',
		buttonSecondaryGradient: '#F5F5F5'
	},
	effects: {
		blur: 'none',
		glow: 'none',
		shadow: 'none',
		radialGlow: 'none'
	},
	chatView: {
		wrapper: {
			background: '#FFFFFF',
			backdropBlur: 'none',
			radialGlow: 'none'
		},
		container: {
			background: '#F5F5F5',
			backdropBlur: 'none',
			border: '#E0E0E0',
			shadow: 'none',
			topGradient: 'none'
		},
		button: {
			primaryBackground: '#0078D4',
			primaryHover: '#0086F0',
			secondaryBackground: '#F5F5F5',
			secondaryHover: '#E8E8E8',
			border: '#E0E0E0',
			shadow: 'none',
			hoverShadow: 'none'
		},
		scrollToTop: {
			background: '#F5F5F5',
			hover: '#E8E8E8',
			border: '#E0E0E0',
			shadow: 'none',
			hoverShadow: 'none'
		}
	},
	mcp: {
		serverCard: {
			background: '#F8F8F8',
			hoverBackground: '#F0F0F0',
			border: '#E0E0E0',
			hoverBorder: 'rgb(22, 104, 194)'
		},
		doneButton: {
			background: 'rgb(22, 104, 194)',
			hoverBackground: 'rgb(28, 116, 214)',
			border: 'rgb(22, 104, 194)',
			hoverBorder: 'rgb(28, 116, 214)',
			text: '#FFFFFF'
		},
		settingsButton: {
			background: 'rgb(22, 104, 194)',
			hoverBackground: 'rgb(28, 116, 214)',
			border: 'rgb(22, 104, 194)',
			hoverBorder: 'rgb(28, 116, 214)',
			text: '#FFFFFF'
		}
	},
	badge: {
		background: '#EBEBEB',
		foreground: '#1F1F1F'
	},
	autoApprove: {
		background: '#FFFFFF',
		hover: {
			background: '#F5F5F5',
			border: '#0078D4'
		},
		warning: '#DDB100',
		error: '#CD3131',
		info: '#0068C4'
	}
}

export const getThemeColors = (mode: ThemeMode): ThemeColors => {
	return mode === 'dark' ? darkColors : lightColors
}

export default getThemeColors 