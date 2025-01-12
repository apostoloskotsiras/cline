export const severityColors = {
	primary: "rgba(13, 71, 161, 0.1)",
	success: "rgba(46, 125, 50, 0.1)",
	info: "rgba(2, 136, 209, 0.1)",
	warning: "rgba(245, 124, 0, 0.1)",
	danger: "rgba(211, 47, 47, 0.1)",
	secondary: "rgba(97, 97, 97, 0.1)",
	contrast: "rgba(250, 250, 250, 0.1)",
}

export const severityTextColors = {
	primary: "rgba(13, 71, 161, 0.9)",
	success: "rgba(46, 125, 50, 0.9)",
	info: "rgba(2, 136, 209, 0.9)",
	warning: "rgba(245, 124, 0, 0.9)",
	danger: "rgba(211, 47, 47, 0.9)",
	secondary: "rgba(97, 97, 97, 0.9)",
	contrast: "rgba(250, 250, 250, 0.9)",
}

export const getTagStyle = (severity: string, rounded: boolean) => ({
	display: "inline-flex",
	alignItems: "center",
	padding: "2px 8px",
	fontSize: "12px",
	fontWeight: 500,
	borderRadius: rounded ? "12px" : "4px",
	backgroundColor: severityColors[severity as keyof typeof severityColors],
	color: severityTextColors[severity as keyof typeof severityTextColors],
}) 