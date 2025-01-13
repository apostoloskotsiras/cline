import styled, { keyframes } from "styled-components"

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const rainbowBorder = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 150% 50%;
  }
`

const glowPulse = keyframes`
  0% {
    opacity: 0.15;
    filter: blur(8px);
  }
  50% {
    opacity: 0.25;
    filter: blur(12px);
  }
  100% {
    opacity: 0.15;
    filter: blur(8px);
  }
`

interface ChatRowContainerProps {
	$isLoadingApi?: boolean
	$isCompletedApi?: boolean
}

export const ChatRowContainer = styled.div<ChatRowContainerProps>`
	padding: 16px 20px;
	position: relative;
	background: rgba(28, 28, 28, 0.98);
	backdrop-filter: blur(16px);
	border-radius: 12px;
	margin: 12px 16px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
	border: 1px solid rgba(255, 255, 255, 0.08);
	transition: border-color 0.2s ease;
	isolation: isolate;

	&:hover {
		border-color: rgba(255, 255, 255, 0.12);
	}

	&.loading-api {
		position: relative;
		transition: border-color 0.3s ease;
		cursor: pointer;

		&:hover {
			border-color: rgba(235, 87, 87, 0.3);
			&::before {
				opacity: 0.4;
			}
		}

		&::before {
			content: "";
			position: absolute;
			inset: -1px;
			padding: 1px;
			border-radius: 12px;
			background: linear-gradient(90deg, #a6d8f2, #12a7fc, #db7cf8, #fe2c69, #fea429, #a6d8f2);
			background-size: 300% 100%;
			-webkit-mask:
				linear-gradient(#fff 0 0) content-box,
				linear-gradient(#fff 0 0);
			-webkit-mask-composite: xor;
			mask-composite: exclude;
			animation: ${rainbowBorder} 3s linear infinite;
			opacity: 0.6;
			z-index: 0;
			pointer-events: none;
		}

		&::after {
			content: "";
			position: absolute;
			inset: -2px;
			padding: 2px;
			border-radius: 13px;
			background: linear-gradient(90deg, #a6d8f2, #12a7fc, #db7cf8, #fe2c69, #fea429, #a6d8f2);
			background-size: 300% 100%;
			filter: blur(8px);
			animation: ${rainbowBorder} 3s linear infinite;
			opacity: 0.1;
			z-index: -1;
			pointer-events: none;
		}

		&.failed-api {
			animation: none;
			&::before,
			&::after {
				animation: none;
				background: linear-gradient(90deg, rgba(235, 87, 87, 0.4), rgba(235, 87, 87, 0.3));
			}
		}
	}

	&.completed-api {
		position: relative;
		border-color: rgba(35, 134, 54, 0.2);
		transition: border-color 0.3s ease;

		&:hover {
			border-color: rgba(35, 134, 54, 0.3);
		}
	}

	&.cancelled-api {
		position: relative;
		border-color: rgba(235, 87, 87, 0.2);
		transition: border-color 0.3s ease;
		opacity: 0.9;

		&:hover {
			border-color: rgba(235, 87, 87, 0.3);
		}

		&::before {
			content: "";
			position: absolute;
			inset: -1px;
			padding: 1px;
			border-radius: 12px;
			background: rgba(235, 87, 87, 0.15);
			-webkit-mask:
				linear-gradient(#fff 0 0) content-box,
				linear-gradient(#fff 0 0);
			-webkit-mask-composite: xor;
			mask-composite: exclude;
			z-index: 0;
			pointer-events: none;
		}
	}

	&.failed-api {
		position: relative;
		border-color: rgba(235, 87, 87, 0.3);
		transition: border-color 0.3s ease;

		&:hover {
			border-color: rgba(235, 87, 87, 0.4);
		}

		&::before {
			content: "";
			position: absolute;
			inset: -1px;
			padding: 1px;
			border-radius: 12px;
			background: linear-gradient(90deg, rgba(235, 87, 87, 0.4), rgba(235, 87, 87, 0.3));
			-webkit-mask:
				linear-gradient(#fff 0 0) content-box,
				linear-gradient(#fff 0 0);
			-webkit-mask-composite: xor;
			mask-composite: exclude;
			z-index: 0;
			pointer-events: none;
		}

		&::after {
			content: "";
			position: absolute;
			inset: -2px;
			padding: 2px;
			border-radius: 13px;
			background: rgba(235, 87, 87, 0.2);
			filter: blur(8px);
			opacity: 0.25;
			z-index: -1;
			pointer-events: none;
		}
	}

	&.streaming-failed-api {
		position: relative;
		border-color: rgba(235, 87, 87, 0.3);
		transition: border-color 0.3s ease;

		&::before {
			content: "";
			position: absolute;
			inset: -1px;
			padding: 1px;
			border-radius: 12px;
			background: linear-gradient(90deg, rgba(235, 87, 87, 0.4), rgba(235, 87, 87, 0.3));
			-webkit-mask:
				linear-gradient(#fff 0 0) content-box,
				linear-gradient(#fff 0 0);
			-webkit-mask-composite: xor;
			mask-composite: exclude;
			z-index: 0;
			pointer-events: none;
		}

		&::after {
			content: "";
			position: absolute;
			inset: -2px;
			padding: 2px;
			border-radius: 13px;
			background: rgba(235, 87, 87, 0.2);
			filter: blur(8px);
			opacity: 0.25;
			z-index: -1;
			pointer-events: none;
		}
	}
`

export const UserMessageContainer = styled(ChatRowContainer)`
	margin-left: auto;
	margin-right: auto;
	max-width: 85%;

	&:hover {
		border-color: rgba(255, 214, 102, 0.15);
	}
`

export const QuestionContainer = styled(ChatRowContainer)`
	margin-left: auto;
	margin-right: auto;
	max-width: 85%;

	&:hover {
		border-color: rgba(147, 130, 255, 0.15);
	}
`

export const SeeNewChangesBtn = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 16px;
	padding: 8px 12px;
	background: rgba(40, 167, 69, 0.06);
	border: 1px solid rgba(40, 167, 69, 0.12);
	border-radius: 6px;
	color: rgba(40, 167, 69, 0.9);
	font-size: 0.9em;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover:not(:disabled) {
		background: rgba(40, 167, 69, 0.08);
		border-color: rgba(40, 167, 69, 0.2);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	i.codicon {
		font-size: 14px;
	}
`

export const UserMessageHeader = styled.div`
	padding: 4px 0 8px 0;
	opacity: 0.9;
	display: flex;
	align-items: center;
	gap: 8px;
`

export const UserIconContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background: linear-gradient(145deg, rgba(255, 214, 102, 0.15) 0%, rgba(255, 214, 102, 0.1) 100%);

	.codicon {
		color: rgba(255, 214, 102, 0.95);
		font-size: 14px;
	}
`

export const UserMessageTitle = styled.span`
	color: rgba(255, 214, 102, 0.95);
	font-weight: 500;
	font-size: 0.9em;
	letter-spacing: 0.3px;
`

export const UserMessageContent = styled.div`
	background-color: rgba(255, 214, 102, 0.05);
	color: rgba(255, 214, 102, 0.95);
	border-radius: 8px;
	padding: 12px 16px;
	white-space: pre-line;
	overflow-wrap: break-word;
	border: 1px solid rgba(255, 214, 102, 0.1);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	margin-top: 4px;
	font-size: 0.95em;
	line-height: 1.5;

	.thumbnails {
		margin-top: 12px;
	}
`

export const QuestionHeader = styled.div`
	padding: 4px 0 8px 0;
	display: flex;
	align-items: center;
	gap: 10px;
`

export const QuestionIconContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background: rgba(147, 130, 255, 0.1);

	.codicon {
		color: rgba(147, 130, 255, 0.95);
		font-size: 14px;
	}
`

export const QuestionTitle = styled.span`
	color: rgba(147, 130, 255, 0.95);
	font-weight: 500;
	font-size: 0.9em;
	letter-spacing: 0.3px;
`

export const QuestionContent = styled.div`
	background-color: rgba(147, 130, 255, 0.05);
	color: rgba(255, 255, 255, 0.95);
	border-radius: 8px;
	padding: 12px 16px;
	white-space: pre-line;
	overflow-wrap: break-word;
	border: 1px solid rgba(147, 130, 255, 0.1);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	margin-top: 4px;
	font-size: 0.95em;
	line-height: 1.5;

	code {
		background: rgba(147, 130, 255, 0.1);
		color: rgba(147, 130, 255, 0.95);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.9em;
	}
`

export const CommandApprovalWarning = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	margin-top: 12px;
	padding: 10px 12px;
	border-radius: 6px;
	font-size: 0.85em;
	background: linear-gradient(145deg, rgba(255, 171, 0, 0.08) 0%, rgba(255, 145, 0, 0.05) 100%);
	border: 1px solid rgba(255, 171, 0, 0.15);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	color: var(--vscode-editorWarning-foreground);
	transition: all 0.2s ease;

	&:hover {
		background: linear-gradient(145deg, rgba(255, 171, 0, 0.1) 0%, rgba(255, 145, 0, 0.07) 100%);
		border-color: rgba(255, 171, 0, 0.2);
	}

	i.codicon {
		font-size: 16px;
		opacity: 0.9;
	}

	span {
		opacity: 0.95;
		line-height: 1.4;
	}
`

export const TaskCompletedHeader = styled.div`
	padding: 4px 0 8px 0;
	display: flex;
	align-items: center;
	gap: 10px;
`

export const TaskCompletedIconContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background: rgba(35, 134, 54, 0.1);

	.codicon {
		color: var(--vscode-charts-green);
		font-size: 14px;
	}
`

export const TaskCompletedTitle = styled.span`
	color: var(--vscode-charts-green);
	font-weight: 500;
	font-size: 0.9em;
	letter-spacing: 0.3px;
`

export const TaskCompletedContent = styled.div`
	background-color: rgba(35, 134, 54, 0.05);
	color: rgba(255, 255, 255, 0.95);
	border-radius: 8px;
	padding: 12px 16px;
	white-space: pre-line;
	overflow-wrap: break-word;
	border: 1px solid rgba(35, 134, 54, 0.1);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	margin-top: 4px;
	font-size: 0.95em;
	line-height: 1.5;

	code {
		background: rgba(35, 134, 54, 0.1);
		color: var(--vscode-charts-green);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.9em;
	}
`

export const CommandHeader = styled.div`
	padding: 4px 0 8px 0;
	display: flex;
	align-items: center;
	gap: 10px;
`

export const CommandIconContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background: rgba(235, 87, 87, 0.08);

	.codicon {
		color: rgba(235, 87, 87, 0.95);
		font-size: 14px;
	}
`

export const CommandTitle = styled.span`
	color: rgba(235, 87, 87, 0.95);
	font-weight: 500;
	font-size: 0.9em;
	letter-spacing: 0.3px;
`

export const CommandContent = styled.div`
	background-color: rgba(28, 28, 28, 0.95);
	color: rgba(255, 255, 255, 0.95);
	border-radius: 8px;
	padding: 12px 16px;
	white-space: pre-line;
	overflow-wrap: break-word;
	border: 1px solid rgba(235, 87, 87, 0.15);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	margin-top: 4px;
	font-size: 0.95em;
	line-height: 1.5;

	code {
		background: rgba(235, 87, 87, 0.08);
		color: rgba(235, 87, 87, 0.95);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.9em;
	}

	pre {
		background: rgba(28, 28, 28, 0.6);
		border: 1px solid rgba(235, 87, 87, 0.1);
		border-radius: 6px;
		padding: 12px;
		margin: 8px 0;
		overflow-x: auto;
	}

	div[role="button"] {
		color: rgba(235, 87, 87, 0.9);
		opacity: 0.8;

		span {
			color: rgba(235, 87, 87, 0.9);
		}
	}
`

export const ApiRequestHeader = styled.div`
	padding: 4px 0 8px 0;
	display: flex;
	align-items: center;
	gap: 10px;
`

export const ApiRequestIconContainer = styled.div<{ $state?: "loading" | "completed" | "failed" | "cancelled" }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	cursor: ${({ $state }) => ($state === "loading" ? "pointer" : "default")};
	background: ${({ $state }) => {
		switch ($state) {
			case "completed":
				return "rgba(35, 134, 54, 0.06)"
			case "failed":
				return "rgba(235, 87, 87, 0.08)"
			case "cancelled":
				return "rgba(235, 87, 87, 0.06)"
			default:
				return "rgba(147, 130, 255, 0.1)"
		}
	}};

	&:hover {
		${({ $state }) => {
			if ($state === "loading") {
				return `
          background: rgba(235, 87, 87, 0.15);
          .codicon {
            color: rgba(235, 87, 87, 0.95);
          }
        `
			}
			if ($state === "completed") {
				return `
          background: rgba(35, 134, 54, 0.1);
          .codicon {
            color: rgba(35, 134, 54, 0.95);
          }
        `
			}
			return ""
		}}
	}

	.codicon {
		font-size: 14px;
		color: ${({ $state }) => {
			switch ($state) {
				case "completed":
					return "rgba(35, 134, 54, 0.85)"
				case "failed":
					return "rgba(235, 87, 87, 0.95)"
				case "cancelled":
					return "rgba(235, 87, 87, 0.8)"
				default:
					return "rgba(147, 130, 255, 0.95)"
			}
		}};
	}
`

export const ApiRequestTitle = styled.span<{ $state?: "loading" | "completed" | "failed" | "cancelled" }>`
	font-weight: 500;
	font-size: 0.9em;
	letter-spacing: 0.3px;
	color: ${({ $state }) => {
		switch ($state) {
			case "completed":
				return "rgba(35, 134, 54, 0.85)"
			case "failed":
				return "rgba(235, 87, 87, 0.95)"
			case "cancelled":
				return "rgba(235, 87, 87, 0.8)"
			default:
				return "rgba(147, 130, 255, 0.95)"
		}
	}};
`

export const ApiRequestContent = styled.div<{ $state?: "loading" | "completed" | "failed" | "cancelled" }>`
	position: relative;
	background-color: ${({ $state }) => {
		switch ($state) {
			case "completed":
				return "rgba(35, 134, 54, 0.03)"
			case "failed":
				return "rgba(235, 87, 87, 0.05)"
			case "cancelled":
				return "rgba(235, 87, 87, 0.03)"
			default:
				return "rgba(147, 130, 255, 0.05)"
		}
	}};
	color: rgba(255, 255, 255, 0.95);
	border-radius: 8px;
	padding: 12px 16px;
	white-space: pre-line;
	overflow-wrap: break-word;
	border: 1px solid
		${({ $state }) => {
			switch ($state) {
				case "completed":
					return "rgba(35, 134, 54, 0.06)"
				case "failed":
					return "rgba(235, 87, 87, 0.15)"
				case "cancelled":
					return "rgba(235, 87, 87, 0.08)"
				default:
					return "rgba(147, 130, 255, 0.1)"
			}
		}};
	box-shadow: ${({ $state }) =>
		$state === "failed"
			? "0 2px 8px rgba(235, 87, 87, 0.1), 0 0 1px rgba(235, 87, 87, 0.2)"
			: "0 2px 8px rgba(0, 0, 0, 0.05)"};
	margin-top: 4px;
	font-size: 0.95em;
	line-height: 1.5;
	isolation: isolate;

	&::before {
		content: "";
		position: absolute;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		top: -20px;
		right: -20px;
		background: ${({ $state }) => {
			switch ($state) {
				case "completed":
					return "radial-gradient(circle, rgba(35, 134, 54, 0.04) 0%, rgba(35, 134, 54, 0) 70%)"
				case "failed":
					return "radial-gradient(circle, rgba(235, 87, 87, 0.12) 0%, rgba(235, 87, 87, 0) 70%)"
				case "cancelled":
					return "radial-gradient(circle, rgba(235, 87, 87, 0.06) 0%, rgba(235, 87, 87, 0) 70%)"
				default:
					return "radial-gradient(circle, rgba(147, 130, 255, 0.08) 0%, rgba(147, 130, 255, 0) 70%)"
			}
		}};
		z-index: -1;
		pointer-events: none;
	}

	&::after {
		content: "";
		position: absolute;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		bottom: -10px;
		left: -10px;
		background: ${({ $state }) => {
			switch ($state) {
				case "completed":
					return "radial-gradient(circle, rgba(35, 134, 54, 0.03) 0%, rgba(35, 134, 54, 0) 70%)"
				case "failed":
					return "radial-gradient(circle, rgba(235, 87, 87, 0.1) 0%, rgba(235, 87, 87, 0) 70%)"
				case "cancelled":
					return "radial-gradient(circle, rgba(235, 87, 87, 0.04) 0%, rgba(235, 87, 87, 0) 70%)"
				default:
					return "radial-gradient(circle, rgba(147, 130, 255, 0.05) 0%, rgba(147, 130, 255, 0) 70%)"
			}
		}};
		z-index: -1;
		pointer-events: none;
	}

	code {
		background: ${({ $state }) => {
			switch ($state) {
				case "completed":
					return "rgba(35, 134, 54, 0.06)"
				case "failed":
					return "rgba(235, 87, 87, 0.12)"
				case "cancelled":
					return "rgba(235, 87, 87, 0.06)"
				default:
					return "rgba(147, 130, 255, 0.1)"
			}
		}};
		color: ${({ $state }) => {
			switch ($state) {
				case "completed":
					return "rgba(35, 134, 54, 0.85)"
				case "failed":
					return "rgba(235, 87, 87, 0.95)"
				case "cancelled":
					return "rgba(235, 87, 87, 0.8)"
				default:
					return "rgba(147, 130, 255, 0.95)"
			}
		}};
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.9em;
	}
`

export const SpinnerRing = styled.div`
	width: 16px;
	height: 16px;
	border: 2px solid rgba(147, 130, 255, 0.1);
	border-top: 2px solid rgba(147, 130, 255, 0.95);
	border-radius: 50%;
	animation: spin 1s linear infinite;
	transition: border-color 0.2s ease;

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`

export const ProgressContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	position: relative;
	cursor: pointer;

	&:hover {
		${SpinnerRing} {
			border-color: rgba(235, 87, 87, 0.2);
			border-top-color: rgba(235, 87, 87, 0.95);
		}
	}
`
