import styled from "styled-components"
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"

export const Container = styled.div`
	padding: 12px 16px;
	background: linear-gradient(145deg, rgba(30, 30, 30, 0.95) 0%, rgba(25, 25, 25, 0.95) 100%);
	backdrop-filter: blur(16px);
	border-radius: 12px;
	border: 1px solid rgba(255, 255, 255, 0.08);
	box-shadow:
		0 4px 6px rgba(0, 0, 0, 0.1),
		0 1px 3px rgba(0, 0, 0, 0.08);
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

	&:hover {
		background: linear-gradient(145deg, rgba(35, 35, 35, 0.98) 0%, rgba(30, 30, 30, 0.98) 100%);
		transform: translateY(-1px);
		box-shadow:
			0 6px 12px rgba(0, 0, 0, 0.15),
			0 2px 4px rgba(0, 0, 0, 0.1);
	}
`

export const Content = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`

export const TopSection = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
`

export const Title = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	cursor: pointer;
	user-select: none;
	flex-grow: 1;
	min-width: 0;
	padding: 4px;
	border-radius: 4px;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}
`

export const TitleText = styled.div`
	font-size: 14px;
	font-weight: 500;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	color: var(--vscode-foreground);
`

export const CostBadge = styled.div`
	background-color: rgba(103, 58, 183, 0.15);
	color: var(--vscode-foreground);
	padding: 2px 8px;
	border-radius: 12px;
	font-size: 12px;
	font-weight: 500;
	margin-left: 8px;
	flex-shrink: 0;
`

export const TextContainer = styled.div<{ isExpanded: boolean }>`
	margin-top: 4px;
	font-size: 13px;
	line-height: 1.5;
	color: var(--vscode-foreground);
	position: relative;
	transition: all 0.2s ease;
	overflow-y: ${(props) => (props.isExpanded ? "auto" : "hidden")};
`

export const TextContent = styled.div`
	white-space: pre-wrap;
	word-break: break-word;
	overflow-wrap: anywhere;
	line-height: 1.5;
`

export const SeeMoreContainer = styled.div`
	position: absolute;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	background: linear-gradient(to right, transparent, rgba(30, 30, 30, 0.95) 50%);
	padding-left: 24px;
	backdrop-filter: blur(4px);
	border-radius: 0 0 8px 0;
`

const sharedButtonStyles = `
  cursor: pointer;
  color: var(--vscode-textLink-foreground);
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
  background-color: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`

export const SeeMoreText = styled.div`
	${sharedButtonStyles}
`

export const SeeLessText = styled.div`
	${sharedButtonStyles}
	text-align: right;
	margin-left: auto;
`

export const MetricsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 8px;
	background-color: rgba(255, 255, 255, 0.03);
	border-radius: 8px;
	margin-top: 8px;
`

export const MetricsRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
`

export const MetricsLabel = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 12px;
	color: var(--vscode-foreground);
`

export const MetricsValue = styled.span`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	color: var(--vscode-foreground);
`

export const ErrorMessage = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	color: var(--vscode-errorForeground);
	font-size: 12px;
	padding: 8px;
	background-color: rgba(255, 0, 0, 0.05);
	border-radius: 4px;
	margin-top: 8px;
`

export const StyledDeleteButton = styled(VSCodeButton)`
	padding: 0;
	margin-left: 8px;
`

export const DeleteButtonContent = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	font-weight: 500;
	color: var(--vscode-foreground);
	opacity: 0.7;
	transition: opacity 0.2s ease;

	&:hover {
		opacity: 1;
	}
`
