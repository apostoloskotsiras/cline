import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { vscode } from "../../utils/vscode"
import { Virtuoso } from "react-virtuoso"
import { memo, useMemo, useState, useEffect } from "react"
import Fuse, { FuseResult } from "fuse.js"
import { formatLargeNumber } from "../../utils/format"
import { formatSize } from "../../utils/size"
import { useThemeStyles } from '../../utils/theme'

type HistoryViewProps = {
	onDone: () => void
}

type SortOption = "newest" | "oldest" | "mostExpensive" | "mostTokens" | "mostRelevant"

// https://gist.github.com/evenfrost/1ba123656ded32fb7a0cd4651efd4db0
export const highlight = (fuseSearchResult: FuseResult<any>[], highlightClassName: string = "history-item-highlight") => {
	const set = (obj: Record<string, any>, path: string, value: any) => {
		const pathValue = path.split(".")
		let i: number

		for (i = 0; i < pathValue.length - 1; i++) {
			obj = obj[pathValue[i]] as Record<string, any>
		}

		obj[pathValue[i]] = value
	}

	// Function to merge overlapping regions
	const mergeRegions = (regions: [number, number][]): [number, number][] => {
		if (regions.length === 0) return regions

		// Sort regions by start index
		regions.sort((a, b) => a[0] - b[0])

		const merged: [number, number][] = [regions[0]]

		for (let i = 1; i < regions.length; i++) {
			const last = merged[merged.length - 1]
			const current = regions[i]

			if (current[0] <= last[1] + 1) {
				// Overlapping or adjacent regions
				last[1] = Math.max(last[1], current[1])
			} else {
				merged.push(current)
			}
		}

		return merged
	}

	const generateHighlightedText = (inputText: string, regions: [number, number][] = []) => {
		if (regions.length === 0) {
			return inputText
		}

		const mergedRegions = mergeRegions(regions)

		let content = ""
		let nextUnhighlightedRegionStartingIndex = 0

		mergedRegions.forEach((region) => {
			const start = region[0]
			const end = region[1]
			const lastRegionNextIndex = end + 1

			content += [
				inputText.substring(nextUnhighlightedRegionStartingIndex, start),
				`<span class="${highlightClassName}">`,
				inputText.substring(start, lastRegionNextIndex),
				"</span>",
			].join("")

			nextUnhighlightedRegionStartingIndex = lastRegionNextIndex
		})

		content += inputText.substring(nextUnhighlightedRegionStartingIndex)

		return content
	}

	return fuseSearchResult
		.filter(({ matches }) => matches && matches.length)
		.map(({ item, matches }) => {
			const highlightedItem = { ...item }

			matches?.forEach((match) => {
				if (match.key && typeof match.value === "string" && match.indices) {
					const mergedIndices = mergeRegions([...match.indices])
					set(highlightedItem, match.key, generateHighlightedText(match.value, mergedIndices))
				}
			})

			return highlightedItem
		})
}

const HistoryView = ({ onDone }: HistoryViewProps) => {
	const { taskHistory, themeMode, themeType } = useExtensionState()
	const S = useThemeStyles('history/HistoryView', themeMode || 'dark', themeType || 'modern')
	const [searchQuery, setSearchQuery] = useState("")
	const [sortOption, setSortOption] = useState<SortOption>("newest")
	const [lastNonRelevantSort, setLastNonRelevantSort] = useState<SortOption | null>("newest")

	useEffect(() => {
		if (searchQuery && sortOption !== "mostRelevant" && !lastNonRelevantSort) {
			setLastNonRelevantSort(sortOption)
			setSortOption("mostRelevant")
		} else if (!searchQuery && sortOption === "mostRelevant" && lastNonRelevantSort) {
			setSortOption(lastNonRelevantSort)
			setLastNonRelevantSort(null)
		}
	}, [searchQuery, sortOption, lastNonRelevantSort])

	const handleHistorySelect = (id: string) => {
		vscode.postMessage({ type: "showTaskWithId", text: id })
		onDone()
	}

	const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		vscode.postMessage({ type: "deleteTaskWithId", text: id })
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

	const presentableTasks = useMemo(() => {
		return taskHistory.filter((item) => item.ts && item.task)
	}, [taskHistory])

	const fuse = useMemo(() => {
		return new Fuse(presentableTasks, {
			keys: ["task"],
			threshold: 0.6,
			shouldSort: true,
			isCaseSensitive: false,
			ignoreLocation: false,
			includeMatches: true,
			minMatchCharLength: 1,
		})
	}, [presentableTasks])

	const taskHistorySearchResults = useMemo(() => {
		let results = searchQuery ? highlight(fuse.search(searchQuery)) : presentableTasks

		results.sort((a, b) => {
			switch (sortOption) {
				case "oldest":
					return a.ts - b.ts
				case "mostExpensive":
					return (b.totalCost || 0) - (a.totalCost || 0)
				case "mostTokens":
					return (
						(b.tokensIn || 0) +
						(b.tokensOut || 0) +
						(b.cacheWrites || 0) +
						(b.cacheReads || 0) -
						((a.tokensIn || 0) + (a.tokensOut || 0) + (a.cacheWrites || 0) + (a.cacheReads || 0))
					)
				case "mostRelevant":
					return searchQuery ? 0 : b.ts - a.ts
				case "newest":
				default:
					return b.ts - a.ts
			}
		})

		return results
	}, [presentableTasks, searchQuery, fuse, sortOption])

	return (
		<S.HistoryWrapper mode={themeMode || 'dark'}>
			<S.HistoryContainer mode={themeMode || 'dark'}>
				<S.HistoryHeader mode={themeMode || 'dark'}>
					<S.HistoryTitle mode={themeMode || 'dark'}>
						<i className="codicon codicon-history"></i>
						<span>HISTORY</span>
					</S.HistoryTitle>
					<S.DoneButton mode={themeMode || 'dark'} onClick={onDone}>
						<i className="codicon codicon-check"></i>
						<span>Done</span>
					</S.DoneButton>
				</S.HistoryHeader>

				<S.SearchContainer mode={themeMode || 'dark'}>
					<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
						<VSCodeTextField
							style={{ width: "100%" }}
							placeholder="Search history..."
							value={searchQuery}
							onInput={(e) => {
								const newValue = (e.target as HTMLInputElement)?.value
								setSearchQuery(newValue)
								if (newValue && !searchQuery && sortOption !== "mostRelevant") {
									setLastNonRelevantSort(sortOption)
									setSortOption("mostRelevant")
								}
							}}>
							<div
								slot="start"
								className="codicon codicon-search"
								style={{
									fontSize: 13,
									marginTop: 2.5,
									opacity: 0.8,
								}}></div>
							{searchQuery && (
								<div
									className="codicon codicon-close"
									onClick={() => setSearchQuery("")}
									slot="end"
									style={{
										cursor: "pointer",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										height: "100%",
									}}
								/>
							)}
						</VSCodeTextField>

						<S.SortOptionsContainer mode={themeMode || 'dark'}>
							<S.SortOption mode={themeMode || 'dark'} selected={sortOption === "newest"} onClick={() => setSortOption("newest")}>
								<i className="codicon codicon-arrow-up"></i>
								Newest
							</S.SortOption>
							<S.SortOption mode={themeMode || 'dark'} selected={sortOption === "oldest"} onClick={() => setSortOption("oldest")}>
								<i className="codicon codicon-arrow-down"></i>
								Oldest
							</S.SortOption>
							<S.SortOption mode={themeMode || 'dark'} selected={sortOption === "mostExpensive"} onClick={() => setSortOption("mostExpensive")}>
								<i className="codicon codicon-credit-card"></i>
								Most Expensive
							</S.SortOption>
							<S.SortOption mode={themeMode || 'dark'} selected={sortOption === "mostTokens"} onClick={() => setSortOption("mostTokens")}>
								<i className="codicon codicon-symbol-parameter"></i>
								Most Tokens
							</S.SortOption>
							<S.SortOption
								mode={themeMode || 'dark'}
								selected={sortOption === "mostRelevant"}
								disabled={!searchQuery}
								onClick={() => {
									if (searchQuery) {
										setSortOption("mostRelevant")
									}
								}}>
								<i className="codicon codicon-target"></i>
								Most Relevant
							</S.SortOption>
						</S.SortOptionsContainer>
					</div>
				</S.SearchContainer>

				<div style={{ flexGrow: 1, overflowY: "auto" }}>
					<Virtuoso
						style={{ height: "100%" }}
						data={taskHistorySearchResults}
						itemContent={(index, item) => (
							<S.HistoryItem
								mode={themeMode || 'dark'}
								key={item.id}
								onClick={() => handleHistorySelect(item.id)}
								style={{
									borderBottom:
										index < taskHistory.length - 1 ? "1px solid rgba(255, 255, 255, 0.06)" : "none",
								}}>
								<div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
									<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
										<span style={{ color: "var(--vscode-descriptionForeground)", fontSize: "0.85em", fontWeight: 500, opacity: 0.8 }}>
											{formatDate(item.ts)}
										</span>

										<VSCodeButton
											appearance="icon"
											className={S.DeleteButton}
											onClick={(e) => handleDeleteHistoryItem(item.id, e)}
											style={{ padding: "4px 8px" }}>
											<div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", opacity: 0.8 }}>
												<span className="codicon codicon-trash"></span>
												{formatSize(item.size)}
											</div>
										</VSCodeButton>
									</div>

									<S.TaskContent mode={themeMode || 'dark'} dangerouslySetInnerHTML={{ __html: item.task }} />

									<S.MetadataContainer mode={themeMode || 'dark'}>
										<S.MetadataRow mode={themeMode || 'dark'}>
											<div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
												<S.MetadataLabel mode={themeMode || 'dark'}>Tokens:</S.MetadataLabel>
												<S.MetadataValue mode={themeMode || 'dark'}>
													<i className="codicon codicon-arrow-up" style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "-2px" }} />
													{formatLargeNumber(item.tokensIn || 0)}
												</S.MetadataValue>
												<S.MetadataValue mode={themeMode || 'dark'}>
													<i className="codicon codicon-arrow-down" style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "-2px" }} />
													{formatLargeNumber(item.tokensOut || 0)}
												</S.MetadataValue>
											</div>
											{!item.totalCost && <ExportButton itemId={item.id} />}
										</S.MetadataRow>

										{!!item.cacheWrites && (
											<div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
												<S.MetadataLabel mode={themeMode || 'dark'}>Cache:</S.MetadataLabel>
												<S.MetadataValue mode={themeMode || 'dark'}>
													<i className="codicon codicon-database" style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "-1px" }} />
													+{formatLargeNumber(item.cacheWrites || 0)}
												</S.MetadataValue>
												<S.MetadataValue mode={themeMode || 'dark'}>
													<i className="codicon codicon-arrow-right" style={{ fontSize: "12px", fontWeight: "bold", marginBottom: 0 }} />
													{formatLargeNumber(item.cacheReads || 0)}
												</S.MetadataValue>
											</div>
										)}
										{!!item.totalCost && (
											<S.MetadataRow mode={themeMode || 'dark'}>
												<div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
													<S.MetadataLabel mode={themeMode || 'dark'}>API Cost:</S.MetadataLabel>
													<span style={{ color: "var(--vscode-descriptionForeground)" }}>
														${item.totalCost?.toFixed(4)}
													</span>
												</div>
												<ExportButton itemId={item.id} />
											</S.MetadataRow>
										)}
									</S.MetadataContainer>
								</div>
							</S.HistoryItem>
						)}
					/>
				</div>
			</S.HistoryContainer>
		</S.HistoryWrapper>
	)
}

const ExportButton = ({ itemId }: { itemId: string }) => {
	const { themeMode } = useExtensionState()
	const S = useThemeStyles('history/HistoryView', themeMode || 'dark', 'modern')
	
	return (
		<VSCodeButton
			className={S.ExportButton}
			appearance="icon"
			onClick={(e: React.MouseEvent) => {
				e.stopPropagation()
				vscode.postMessage({ type: "exportTaskWithId", text: itemId })
			}}>
			<div style={{ fontSize: "11px", fontWeight: 500, opacity: 1 }}>EXPORT</div>
		</VSCodeButton>
	)
}

export default memo(HistoryView)
