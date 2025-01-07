import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { vscode } from "../../utils/vscode"
import { memo } from "react"
import { formatLargeNumber } from "../../utils/format"

type HistoryPreviewProps = {
  showHistoryView: () => void
}

const HistoryPreview = ({ showHistoryView }: HistoryPreviewProps) => {
  const { taskHistory } = useExtensionState()
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
    <div style={{ flexShrink: 0, padding: "8px 0" }}>
      <style>
        {`
          .history-preview-item {
            background: var(--vscode-editor-background);
            margin: 12px 16px;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }

          .history-preview-item:hover {
            transform: translateY(-1px);
            border-color: rgba(255, 255, 255, 0.12);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }

          .history-preview-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: transparent;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .history-preview-item:hover::before {
            background: var(--vscode-textLink-foreground);
            box-shadow: 0 0 8px rgba(103, 58, 183, 0.3);
          }

          .history-title {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--vscode-foreground);
            margin: 16px 24px 8px;
          }

          .history-title i {
            font-size: 16px;
            opacity: 0.9;
            color: var(--vscode-textLink-foreground);
          }

          .history-title span {
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.5px;
          }

          .history-metadata {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.85em;
            opacity: 0.85;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
          }

          .metadata-item {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .metadata-label {
            font-weight: 500;
            color: var(--vscode-descriptionForeground);
          }

          .metadata-value {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .view-all-button {
            margin: 8px auto;
            padding: 4px 12px;
            font-size: 11px;
            font-weight: 400;
            border-radius: 4px;
            background: var(--vscode-button-secondaryBackground);
            border: 1px solid var(--vscode-button-border);
            color: var(--vscode-button-secondaryForeground);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
            min-width: 120px;
            justify-content: center;
            height: 24px;
            opacity: 0.9;
          }

          .view-all-button:hover {
            background: var(--vscode-button-secondaryHoverBackground);
            opacity: 1;
          }

          .view-all-button:active {
            transform: translateY(1px);
          }
        `}
      </style>

      <div className="history-title">
        <i className="codicon codicon-history"></i>
        <span>RECENT TASKS</span>
      </div>

      <div>
        {taskHistory
          .filter((item) => item.ts && item.task)
          .slice(0, 3)
          .map((item) => (
            <div key={item.id} className="history-preview-item" onClick={() => handleHistorySelect(item.id)}>
              <div style={{ padding: "16px 20px" }}>
                <div>
                  <span
                    style={{
                      color: "var(--vscode-textLink-foreground)",
                      fontSize: "0.85em",
                      fontWeight: 600,
                      opacity: 0.9,
                      letterSpacing: "0.3px"
                    }}>
                    {formatDate(item.ts)}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--vscode-foreground)",
                    lineHeight: "1.6",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    whiteSpace: "pre-wrap",
                    opacity: 0.95,
                    margin: "8px 0",
                  }}>
                  {item.task}
                </div>
                <div className="history-metadata">
                  <div className="metadata-item">
                    <span className="metadata-label">Tokens:</span>
                    <div className="metadata-value">
                      <i className="codicon codicon-arrow-up" style={{ fontSize: "12px" }} />
                      {formatLargeNumber(item.tokensIn || 0)}
                    </div>
                    <div className="metadata-value">
                      <i className="codicon codicon-arrow-down" style={{ fontSize: "12px" }} />
                      {formatLargeNumber(item.tokensOut || 0)}
                    </div>
                  </div>
                  {!!item.cacheWrites && (
                    <div className="metadata-item">
                      <span className="metadata-label">Cache:</span>
                      <div className="metadata-value">
                        <i className="codicon codicon-database" style={{ fontSize: "12px" }} />
                        +{formatLargeNumber(item.cacheWrites || 0)}
                      </div>
                      <div className="metadata-value">
                        <i className="codicon codicon-arrow-right" style={{ fontSize: "12px" }} />
                        {formatLargeNumber(item.cacheReads || 0)}
                      </div>
                    </div>
                  )}
                  {!!item.totalCost && (
                    <div className="metadata-item">
                      <span className="metadata-label">Cost:</span>
                      <span>${item.totalCost?.toFixed(4)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
        <button
          onClick={() => showHistoryView()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            fontSize: '11px',
            background: 'transparent',
            border: 'none',
            color: 'var(--vscode-textLink-foreground)',
            cursor: 'pointer',
            opacity: 0.8,
            transition: 'opacity 0.2s ease',
          }}>
          <i className="codicon codicon-history" style={{ fontSize: "11px" }} />
          <span>View all history</span>
        </button>
      </div>
    </div>
  )
}

export default memo(HistoryPreview)
