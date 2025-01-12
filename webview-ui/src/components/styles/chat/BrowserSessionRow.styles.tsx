import styled from "styled-components"
import { CheckpointControls } from "../../common/CheckpointControls"

export const Container = styled.div`
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

	&:hover ${CheckpointControls} {
		opacity: 1;
	}
`

export const HeaderContainer = styled.div`
	padding: 4px 0 12px 0;
	display: flex;
	align-items: center;
	gap: 10px;
	opacity: 0.9;

	.codicon {
		color: rgba(18, 167, 252, 0.95);
		font-size: 14px;
	}

	span {
		color: rgba(18, 167, 252, 0.95);
		font-weight: 500;
		font-size: 0.9em;
		letter-spacing: 0.3px;
	}
`

export const BrowserContainer = styled.div`
	border-radius: 8px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	overflow: hidden;
	background-color: rgba(28, 28, 28, 0.95);
	margin-bottom: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

export const URLBar = styled.div`
	margin: 8px;
	width: calc(100% - 16px);
	box-sizing: border-box;
	background-color: rgba(28, 28, 28, 0.6);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 6px;
	padding: 8px 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: rgba(255, 255, 255, 0.9);
	font-size: 0.9em;
	transition: border-color 0.2s ease;

	&:hover {
		border-color: rgba(255, 255, 255, 0.15);
	}
`

export const URLText = styled.div<{ $empty?: boolean }>`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	width: 100%;
	text-align: center;
	color: ${(props) => (props.$empty ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.9)")};
	transition: color 0.2s ease;
`

export const ScreenshotArea = styled.div`
	width: 100%;
	padding-bottom: calc(200% / 3);
	position: relative;
	background-color: rgba(28, 28, 28, 0.6);
	border-top: 1px solid rgba(255, 255, 255, 0.08);
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`

export const Screenshot = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: contain;
	cursor: pointer;
	transition: opacity 0.2s ease;

	&:hover {
		opacity: 0.95;
	}
`

export const EmptyScreenshot = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	.codicon {
		font-size: 80px;
		color: rgba(255, 255, 255, 0.2);
		transition: color 0.2s ease;
	}

	&:hover .codicon {
		color: rgba(255, 255, 255, 0.25);
	}
`

export const BrowserCursor = styled.img<{ $x: number; $y: number }>`
	position: absolute;
	top: ${(props) => props.$y}%;
	left: ${(props) => props.$x}%;
	width: 17px;
	height: 22px;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	pointer-events: none;
`

export const ConsoleHeader = styled.div<{ $expanded: boolean }>`
	display: flex;
	align-items: center;
	gap: 8px;
	width: 100%;
	justify-content: flex-start;
	cursor: pointer;
	padding: 12px;
	background: rgba(28, 28, 28, 0.6);
	transition: background-color 0.2s ease;

	&:hover {
		background: rgba(28, 28, 28, 0.8);
	}

	.codicon {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.6);
	}
`

export const ConsoleTitle = styled.span`
	font-size: 0.9em;
	color: rgba(255, 255, 255, 0.8);
	font-weight: 500;
`

export const PaginationContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 0;
	margin-top: 16px;
	border-top: 1px solid rgba(255, 255, 255, 0.08);
	font-size: 0.9em;
	color: rgba(255, 255, 255, 0.8);
`

export const PaginationButtons = styled.div`
	display: flex;
	gap: 8px;

	vscode-button {
		min-width: 80px;
	}
`
