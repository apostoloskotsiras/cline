import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { vscode } from "../../utils/vscode"
import { Virtuoso } from "react-virtuoso"
import { memo, useMemo, useState, useEffect } from "react"
import Fuse, { FuseResult } from "fuse.js"
import { formatLargeNumber } from "../../utils/format"
import { formatSize } from "../../utils/size"

type HistoryViewProps = {
	onDone: () => void
}

type SortOption = "newest" | "oldest" | "mostExpensive" | "mostTokens" | "mostRelevant"

const HistoryView = ({ onDone }: HistoryViewProps) => {
	const { taskHistory } = useExtensionState()
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
	}

	const handleDeleteHistoryItem = (id: string) => {
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
					// NOTE: you must never sort directly on object since it will cause members to be reordered
					return searchQuery ? 0 : b.ts - a.ts // Keep fuse order if searching, otherwise sort by newest
				case "newest":
				default:
					return b.ts - a.ts
			}
		})

		return results
	}, [presentableTasks, searchQuery, fuse, sortOption])

	return (
		<>
			<style>
				{`
					.history-wrapper {
						position: fixed;
						top: 33px;
						left: 0;
						right: 0;
						bottom: 0;
						background: linear-gradient(145deg, 
							rgba(15, 15, 15, 0.98) 0%,
							rgba(10, 10, 10, 0.98) 100%
						);
						backdrop-filter: blur(12px);
						display: flex;
						flex-direction: column;
						overflow: hidden;
					}

					.history-wrapper::before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background: radial-gradient(
							circle at 50% 0%,
							rgba(103, 58, 183, 0.08) 0%,
							rgba(81, 45, 168, 0.05) 25%,
							transparent 50%
						);
						pointer-events: none;
					}

					.history-container {
						height: 100%;
						display: flex;
						flex-direction: column;
						background: rgba(20, 20, 20, 0.85);
						backdrop-filter: blur(16px);
						position: relative;
						border-radius: 12px;
						margin: 12px;
						box-shadow: 
							0 4px 6px rgba(0, 0, 0, 0.1),
							0 1px 3px rgba(0, 0, 0, 0.08);
						border: 1px solid rgba(255, 255, 255, 0.08);
					}

					.history-container::before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						height: 1px;
						background: linear-gradient(
							90deg,
							transparent 0%,
							rgba(103, 58, 183, 0.1) 50%,
							transparent 100%
						);
					}

					.history-header {
						background: transparent;
						border-bottom: 1px solid rgba(255, 255, 255, 0.06);
						padding: 12px 16px;
						display: flex;
						justify-content: space-between;
						align-items: center;
					}

					.history-item {
						background: rgba(25, 25, 25, 0.95);
						margin: 8px 16px;
						transition: all 0.2s ease;
						position: relative;
						overflow: hidden;
						border-radius: 12px;
						border: 1px solid rgba(255, 255, 255, 0.06);
					}

					.history-item:hover {
						background: rgba(35, 35, 35, 0.95);
					}
					.history-item::before {
						content: '';
						position: absolute;
						left: 0;
						top: 0;
						bottom: 0;
						width: 2px;
						background: transparent;
						transition: background 0.2s ease;
					}
					.history-item:hover::before {
						background: var(--vscode-textLink-foreground);
					}
					.delete-button, .export-button {
						opacity: 0;
						transition: opacity 0.2s ease;
						pointer-events: none;
					}
					.history-item:hover .delete-button,
					.history-item:hover .export-button {
						opacity: 1;
						pointer-events: auto;
					}
					.history-item-highlight {
						background-color: rgba(103, 58, 183, 0.3);
						color: inherit;
						border-radius: 2px;
						padding: 0 2px;
					}
					.search-container {
						position: sticky;
						top: 0;
						background: rgba(20, 20, 20, 0.98);
						z-index: 10;
						padding: 10px;
						border-bottom: 1px solid rgba(255, 255, 255, 0.06);
					}
					.history-title {
						display: flex;
						align-items: center;
						gap: 8px;
						color: var(--vscode-foreground);
					}
					.history-title i {
						font-size: 16px;
						opacity: 0.8;
					}
					.history-title span {
						font-size: 13px;
						font-weight: 500;
						letter-spacing: 0.3px;
					}
					.done-button {
						padding: 4px 12px;
						font-size: 11px;
						border-radius: 4px;
						background: rgba(103, 58, 183, 0.1);
						border: 1px solid rgba(103, 58, 183, 0.2);
						color: var(--vscode-foreground);
						cursor: pointer;
						display: flex;
						align-items: center;
						gap: 6px;
						transition: all 0.2s ease;
					}
					.done-button:hover {
						background: rgba(103, 58, 183, 0.2);
						border-color: rgba(103, 58, 183, 0.3);
					}
					.done-button i {
						font-size: 14px;
						opacity: 0.8;
					}
					.radio-group-container {
						display: flex;
						gap: 8px;
						padding: 4px;
						background: rgba(30, 30, 30, 0.5);
						border-radius: 4px;
						margin-top: 4px;
					}
					vscode-radio {
						font-size: 12px;
						opacity: 0.8;
						transition: opacity 0.2s ease;
					}
					vscode-radio:hover {
						opacity: 1;
					}
					.sort-options-container {
						display: flex;
						flex-wrap: wrap;
						gap: 4px;
						padding: 4px;
						background: rgba(30, 30, 30, 0.4);
						border-radius: 6px;
					}
					.sort-option {
						padding: 4px 10px;
						font-size: 11px;
						border-radius: 4px;
						cursor: pointer;
						color: var(--vscode-foreground);
						opacity: 0.6;
						transition: all 0.2s ease;
						background: transparent;
						border: 1px solid transparent;
						display: flex;
						align-items: center;
						gap: 6px;
						user-select: none;
					}
					.sort-option:hover:not(.selected) {
						opacity: 0.8;
						background: rgba(255, 255, 255, 0.05);
					}
					.sort-option.selected {
						background: rgba(103, 58, 183, 0.2);
						border-color: rgba(103, 58, 183, 0.3);
						opacity: 1;
					}
					.sort-option.disabled {
						opacity: 0.4;
						cursor: not-allowed;
					}
					.sort-option i {
						font-size: 14px;
						display: flex;
						align-items: center;
					}
				`}
			</style>
			<div className="history-wrapper">
				<div className="history-container">
					<header className="history-header">
						<div className="history-title">
							<i className="codicon codicon-history"></i>
							<span>HISTORY</span>
						</div>
						<div 
							className="done-button"
							onClick={onDone}
						>
							<i className="codicon codicon-check"></i>
							<span>Done</span>
						</div>
					</header>

					<div className="search-container">
						<div style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '8px',
						}}>
							<VSCodeTextField
								style={{ width: '100%' }}
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
								<div slot="start" className="codicon codicon-search" style={{
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
											cursor: 'pointer',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											height: '100%',
										}}
									/>
								)}
							</VSCodeTextField>

							<div className="sort-options-container">
								<div 
									className={`sort-option ${sortOption === "newest" ? "selected" : ""}`}
									onClick={() => setSortOption("newest")}
								>
									<i className="codicon codicon-arrow-up"></i>
									Newest
								</div>
								<div 
									className={`sort-option ${sortOption === "oldest" ? "selected" : ""}`}
									onClick={() => setSortOption("oldest")}
								>
									<i className="codicon codicon-arrow-down"></i>
									Oldest
								</div>
								<div 
									className={`sort-option ${sortOption === "mostExpensive" ? "selected" : ""}`}
									onClick={() => setSortOption("mostExpensive")}
								>
									<i className="codicon codicon-credit-card"></i>
									Most Expensive
								</div>
								<div 
									className={`sort-option ${sortOption === "mostTokens" ? "selected" : ""}`}
									onClick={() => setSortOption("mostTokens")}
								>
									<i className="codicon codicon-symbol-parameter"></i>
									Most Tokens
								</div>
								<div 
									className={`sort-option ${sortOption === "mostRelevant" ? "selected" : ""} ${!searchQuery ? "disabled" : ""}`}
									onClick={() => {
										if (searchQuery) {
											setSortOption("mostRelevant")
										}
									}}
								>
									<i className="codicon codicon-target"></i>
									Most Relevant
								</div>
							</div>
						</div>
					</div>

					<div style={{ flexGrow: 1, overflowY: 'auto' }}>
						<Virtuoso
							style={{ height: '100%' }}
							data={taskHistorySearchResults}
							itemContent={(index, item) => (
								<div
									key={item.id}
									className="history-item"
									onClick={() => handleHistorySelect(item.id)}
									style={{
										cursor: 'pointer',
										borderBottom: index < taskHistory.length - 1 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
									}}>
									<div style={{
										padding: '12px 16px',
										display: 'flex',
										flexDirection: 'column',
										gap: '10px',
									}}>
										<div style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
										}}>
											<span style={{
												color: 'var(--vscode-descriptionForeground)',
												fontSize: '0.85em',
												fontWeight: 500,
												opacity: 0.8,
											}}>
												{formatDate(item.ts)}
											</span>
											
											<VSCodeButton
												appearance="icon"
												className="delete-button"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													handleDeleteHistoryItem(item.id)
												}}
												style={{
													padding: '4px 8px',
												}}>
												<div style={{
													display: 'flex',
													alignItems: 'center',
													gap: '6px',
													fontSize: '11px',
													opacity: 0.8,
												}}>
													<span className="codicon codicon-trash"></span>
													{formatSize(item.size)}
												</div>
											</VSCodeButton>
										</div>

										{/* Task content */}
										<div style={{
											fontSize: '13px',
											color: 'var(--vscode-foreground)',
											lineHeight: '1.5',
											display: '-webkit-box',
											WebkitLineClamp: 3,
											WebkitBoxOrient: 'vertical',
											overflow: 'hidden',
											whiteSpace: 'pre-wrap',
											opacity: 0.9,
										}} dangerouslySetInnerHTML={{
											__html: item.task,
										}} />

										{/* Tokens and costs section */}
										<div style={{
											display: 'flex',
											flexDirection: 'column',
											gap: '6px',
											fontSize: '0.85em',
											opacity: 0.8,
										}}>
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
												}}>
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: '4px',
														flexWrap: 'wrap',
													}}>
													<span
														style={{
															fontWeight: 500,
															color: 'var(--vscode-descriptionForeground)',
														}}>
														Tokens:
													</span>
													<span
														style={{
															display: 'flex',
															alignItems: 'center',
															gap: '3px',
															color: 'var(--vscode-descriptionForeground)',
														}}>
														<i
															className="codicon codicon-arrow-up"
															style={{
																fontSize: '12px',
																fontWeight: 'bold',
																marginBottom: '-2px',
															}}
														/>
														{formatLargeNumber(item.tokensIn || 0)}
													</span>
													<span
														style={{
															display: 'flex',
															alignItems: 'center',
															gap: '3px',
															color: 'var(--vscode-descriptionForeground)',
														}}>
														<i
															className="codicon codicon-arrow-down"
															style={{
																fontSize: '12px',
																fontWeight: 'bold',
																marginBottom: '-2px',
															}}
														/>
														{formatLargeNumber(item.tokensOut || 0)}
													</span>
												</div>
												{!item.totalCost && <ExportButton itemId={item.id} />}
											</div>

											{!!item.cacheWrites && (
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: '4px',
														flexWrap: 'wrap',
													}}>
													<span
														style={{
															fontWeight: 500,
															color: 'var(--vscode-descriptionForeground)',
														}}>
															Cache:
														</span>
													<span
														style={{
															display: 'flex',
															alignItems: 'center',
															gap: '3px',
															color: 'var(--vscode-descriptionForeground)',
														}}>
														<i
															className="codicon codicon-database"
															style={{
																fontSize: '12px',
																fontWeight: 'bold',
																marginBottom: '-1px',
															}}
														/>
														+{formatLargeNumber(item.cacheWrites || 0)}
													</span>
													<span
														style={{
															display: 'flex',
															alignItems: 'center',
															gap: '3px',
															color: 'var(--vscode-descriptionForeground)',
														}}>
														<i
															className="codicon codicon-arrow-right"
															style={{
																fontSize: '12px',
																fontWeight: 'bold',
																marginBottom: 0,
															}}
														/>
														{formatLargeNumber(item.cacheReads || 0)}
													</span>
												</div>
											)}
											{!!item.totalCost && (
												<div
													style={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
														marginTop: -2,
													}}>
													<div
														style={{
															display: 'flex',
															alignItems: 'center',
															gap: '4px',
														}}>
														<span
															style={{
																fontWeight: 500,
																color: 'var(--vscode-descriptionForeground)',
															}}>
																API Cost:
															</span>
														<span
															style={{
																color: 'var(--vscode-descriptionForeground)',
															}}>
																${item.totalCost?.toFixed(4)}
															</span>
													</div>
													<ExportButton itemId={item.id} />
												</div>
											)}
										</div>
									</div>
								</div>
							)}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

const ExportButton = ({ itemId }: { itemId: string }) => (
	<VSCodeButton
		className="export-button"
		appearance="icon"
		onClick={(e) => {
			e.preventDefault();
			e.stopPropagation();
			vscode.postMessage({ type: "exportTaskWithId", text: itemId })
		}}>
		<div style={{ fontSize: "11px", fontWeight: 500, opacity: 1 }}>EXPORT</div>
	</VSCodeButton>
)

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

		// Sort and merge overlapping regions
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
					// Merge overlapping regions before generating highlighted text
					const mergedIndices = mergeRegions([...match.indices])
					set(highlightedItem, match.key, generateHighlightedText(match.value, mergedIndices))
				}
			})

			return highlightedItem
		})
}

export default memo(HistoryView)

