import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { vscode } from "../../utils/vscode"
import { memo } from "react"
import { formatLargeNumber } from "../../utils/format"
import { useThemeStyles } from '../../utils/theme'

type HistoryPreviewProps = {
	showHistoryView: () => void
}

const HistoryPreview = ({ showHistoryView }: HistoryPreviewProps) => {
	const { taskHistory, themeMode, themeType } = useExtensionState()
	const S = useThemeStyles('history/HistoryPreview', themeMode || 'dark', themeType || 'modern')
	const handleHistorySelect = (id: string) => {
		vscode.postMessage({ type: "showTaskWithId", text: id })
	}

	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp)
		return date
			?.toLocaleString("en-US", {
				month: "long",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			})
			.replace(", ", " ")
			.replace(" at", ",")
			.toUpperCase()
	}

	return (
		<S.PreviewWrapper mode={themeMode || 'dark'}>
			<S.HistoryTitle mode={themeMode || 'dark'}>
				<i className="codicon codicon-history"></i>
				<span>RECENT TASKS</span>
			</S.HistoryTitle>

			<div>
				{taskHistory
					.filter((item) => item.ts && item.task)
					.slice(0, 3)
					.map((item) => (
						<S.HistoryPreviewItem key={item.id} mode={themeMode || 'dark'} onClick={() => handleHistorySelect(item.id)}>
							<div style={{ padding: "16px 20px" }}>
								<div>
									<S.TimestampText mode={themeMode || 'dark'}>{formatDate(item.ts)}</S.TimestampText>
								</div>
								<S.TaskText mode={themeMode || 'dark'}>{item.task}</S.TaskText>
								<S.HistoryMetadata mode={themeMode || 'dark'}>
									<S.MetadataItem mode={themeMode || 'dark'}>
										<S.MetadataLabel mode={themeMode || 'dark'}>Tokens:</S.MetadataLabel>
										<S.MetadataValue mode={themeMode || 'dark'}>
											<i className="codicon codicon-arrow-up" style={{ fontSize: "12px" }} />
											{formatLargeNumber(item.tokensIn || 0)}
										</S.MetadataValue>
										<S.MetadataValue mode={themeMode || 'dark'}>
											<i className="codicon codicon-arrow-down" style={{ fontSize: "12px" }} />
											{formatLargeNumber(item.tokensOut || 0)}
										</S.MetadataValue>
									</S.MetadataItem>
									{!!item.cacheWrites && (
										<S.MetadataItem mode={themeMode || 'dark'}>
											<S.MetadataLabel mode={themeMode || 'dark'}>Cache:</S.MetadataLabel>
											<S.MetadataValue mode={themeMode || 'dark'}>
												<i className="codicon codicon-database" style={{ fontSize: "12px" }} />+
												{formatLargeNumber(item.cacheWrites || 0)}
											</S.MetadataValue>
											<S.MetadataValue mode={themeMode || 'dark'}>
												<i className="codicon codicon-arrow-right" style={{ fontSize: "12px" }} />
												{formatLargeNumber(item.cacheReads || 0)}
											</S.MetadataValue>
										</S.MetadataItem>
									)}
									{!!item.totalCost && (
										<S.MetadataItem mode={themeMode || 'dark'}>
											<S.MetadataLabel mode={themeMode || 'dark'}>Cost:</S.MetadataLabel>
											<span>${item.totalCost?.toFixed(4)}</span>
										</S.MetadataItem>
									)}
								</S.HistoryMetadata>
							</div>
						</S.HistoryPreviewItem>
					))}
			</div>

			<div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
				<S.ViewAllButton mode={themeMode || 'dark'} onClick={showHistoryView}>
					<i className="codicon codicon-history" style={{ fontSize: "11px" }} />
					<span>View all history</span>
				</S.ViewAllButton>
			</div>
		</S.PreviewWrapper>
	)
}

export default memo(HistoryPreview)
