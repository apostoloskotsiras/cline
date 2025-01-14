import { VSCodeLink, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import Fuse from "fuse.js"
import React, { KeyboardEvent, memo, useEffect, useMemo, useRef, useState } from "react"
import { useRemark } from "react-remark"
import { useMount } from "react-use"
import { openRouterDefaultModelId } from "../../../../src/shared/api"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { useThemeStyles } from "../../utils/theme"
import { vscode } from "../../utils/vscode"
import { highlight } from "../history/HistoryView"
import { ModelInfoView, normalizeApiConfiguration } from "./ApiOptions"

const OpenRouterModelPicker: React.FC = () => {
	const { apiConfiguration, setApiConfiguration, openRouterModels, themeMode, themeType } = useExtensionState()
	const S = useThemeStyles('settings/OpenRouterModelPicker', themeMode || 'dark', themeType || 'modern')
	const [searchTerm, setSearchTerm] = useState(apiConfiguration?.openRouterModelId || openRouterDefaultModelId)
	const [isDropdownVisible, setIsDropdownVisible] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(-1)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const itemRefs = useRef<(HTMLDivElement | null)[]>([])
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
	const dropdownListRef = useRef<HTMLDivElement>(null)

	const handleModelChange = (newModelId: string) => {
		// could be setting invalid model id/undefined info but validation will catch it
		setApiConfiguration({
			...apiConfiguration,
			openRouterModelId: newModelId,
			openRouterModelInfo: openRouterModels[newModelId],
		})
		setSearchTerm(newModelId)
	}

	const { selectedModelId, selectedModelInfo } = useMemo(() => {
		return normalizeApiConfiguration(apiConfiguration)
	}, [apiConfiguration])

	useMount(() => {
		vscode.postMessage({ type: "refreshOpenRouterModels" })
	})

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownVisible(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [])

	const modelIds = useMemo(() => {
		return Object.keys(openRouterModels).sort((a, b) => a.localeCompare(b))
	}, [openRouterModels])

	const searchableItems = useMemo(() => {
		return modelIds.map((id) => ({
			id,
			html: id,
		}))
	}, [modelIds])

	const fuse = useMemo(() => {
		return new Fuse(searchableItems, {
			keys: ["html"], // highlight function will update this
			threshold: 0.6,
			shouldSort: true,
			isCaseSensitive: false,
			ignoreLocation: false,
			includeMatches: true,
			minMatchCharLength: 1,
		})
	}, [searchableItems])

	const modelSearchResults = useMemo(() => {
		let results: { id: string; html: string }[] = searchTerm
			? highlight(fuse.search(searchTerm), "model-item-highlight")
			: searchableItems
		// results.sort((a, b) => a.id.localeCompare(b.id)) NOTE: sorting like this causes ids in objects to be reordered and mismatched
		return results
	}, [searchableItems, searchTerm, fuse])

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (!isDropdownVisible) return

		switch (event.key) {
			case "ArrowDown":
				event.preventDefault()
				setSelectedIndex((prev) => (prev < modelSearchResults.length - 1 ? prev + 1 : prev))
				break
			case "ArrowUp":
				event.preventDefault()
				setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
				break
			case "Enter":
				event.preventDefault()
				if (selectedIndex >= 0 && selectedIndex < modelSearchResults.length) {
					handleModelChange(modelSearchResults[selectedIndex].id)
					setIsDropdownVisible(false)
				}
				break
			case "Escape":
				setIsDropdownVisible(false)
				setSelectedIndex(-1)
				break
		}
	}

	const hasInfo = useMemo(() => {
		return modelIds.some((id) => id.toLowerCase() === searchTerm.toLowerCase())
	}, [modelIds, searchTerm])

	useEffect(() => {
		setSelectedIndex(-1)
		if (dropdownListRef.current) {
			dropdownListRef.current.scrollTop = 0
		}
	}, [searchTerm])

	useEffect(() => {
		if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
			itemRefs.current[selectedIndex]?.scrollIntoView({
				block: "nearest",
				behavior: "smooth",
			})
		}
	}, [selectedIndex])

	return (
		<>
			<style>
				{`
				.model-search-field {
					background: rgba(30, 30, 30, 0.6) !important;
					border: 1px solid rgba(255, 255, 255, 0.06) !important;
					border-radius: 4px !important;
					transition: all 0.2s ease !important;
				}

				.model-search-field:hover {
					background: rgba(35, 35, 35, 0.7) !important;
					border-color: rgba(103, 58, 183, 0.2) !important;
				}

				.model-search-field:focus-within {
					border-color: rgba(103, 58, 183, 0.3) !important;
					background: rgba(40, 40, 40, 0.8) !important;
				}

				.model-search-field .control,
				vscode-text-field::part(control) {
					background: transparent !important;
					border: none !important;
					color: var(--vscode-foreground) !important;
					font-family: var(--vscode-font-family) !important;
					font-size: 13px !important;
				}

				vscode-text-field::part(control) {
					background: transparent !important;
					--input-background: transparent !important;
				}

				.model-search-field input::placeholder {
					color: var(--vscode-input-placeholderForeground);
					opacity: 0.6;
				}
				`}
			</style>
			<div>
				<label htmlFor="model-search">
					<span style={{ fontWeight: 500 }}>Model</span>
				</label>
				<S.DropdownWrapper ref={dropdownRef}>
					<VSCodeTextField
						id="model-search"
						className="model-search-field"
						placeholder="Search and select a model..."
						value={searchTerm}
						onInput={(e) => {
							handleModelChange((e.target as HTMLInputElement)?.value?.toLowerCase())
							setIsDropdownVisible(true)
						}}
						onFocus={() => setIsDropdownVisible(true)}
						onKeyDown={handleKeyDown}
						style={{
							width: "100%",
							zIndex: S.OPENROUTER_MODEL_PICKER_Z_INDEX,
							position: "relative",
						}}>
						{searchTerm && (
							<div
								className="input-icon-button codicon codicon-close"
								aria-label="Clear search"
								onClick={() => {
									handleModelChange("")
									setIsDropdownVisible(true)
								}}
								slot="end"
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: "100%",
									opacity: 0.8,
									cursor: "pointer",
									transition: "opacity 0.2s ease",
								}}
							/>
						)}
					</VSCodeTextField>
					{isDropdownVisible && (
						<S.DropdownList ref={dropdownListRef} mode={themeMode || 'dark'}>
							{modelSearchResults.map((item, index) => (
								<S.DropdownItem
									key={item.id}
									ref={(el: HTMLDivElement | null) => (itemRefs.current[index] = el)}
									isSelected={index === selectedIndex}
									mode={themeMode || 'dark'}
									onMouseEnter={() => setSelectedIndex(index)}
									onClick={() => {
										handleModelChange(item.id)
										setIsDropdownVisible(false)
									}}
									dangerouslySetInnerHTML={{
										__html: item.html,
									}}
								/>
							))}
						</S.DropdownList>
					)}
				</S.DropdownWrapper>
			</div>

			{hasInfo ? (
				<ModelInfoView
					selectedModelId={selectedModelId}
					modelInfo={selectedModelInfo}
					isDescriptionExpanded={isDescriptionExpanded}
					setIsDescriptionExpanded={setIsDescriptionExpanded}
				/>
			) : (
				<p
					style={{
						fontSize: "12px",
						marginTop: 0,
						color: "var(--vscode-descriptionForeground)",
					}}>
					The extension automatically fetches the latest list of models available on{" "}
					<VSCodeLink style={{ display: "inline", fontSize: "inherit" }} href="https://openrouter.ai/models">
						OpenRouter.
					</VSCodeLink>
					If you're unsure which model to choose, Cline works best with{" "}
					<VSCodeLink
						style={{ display: "inline", fontSize: "inherit" }}
						onClick={() => handleModelChange("anthropic/claude-3.5-sonnet:beta")}>
						anthropic/claude-3.5-sonnet:beta.
					</VSCodeLink>
					You can also try searching "free" for no-cost options currently available.
				</p>
			)}
		</>
	)
}

export default OpenRouterModelPicker

export const ModelDescriptionMarkdown = memo(
	({
		markdown,
		key,
		isExpanded,
		setIsExpanded,
	}: {
		markdown?: string
		key: string
		isExpanded: boolean
		setIsExpanded: (isExpanded: boolean) => void
	}) => {
		const [reactContent, setMarkdown] = useRemark()
		const [showSeeMore, setShowSeeMore] = useState(false)
		const textContainerRef = useRef<HTMLDivElement>(null)
		const textRef = useRef<HTMLDivElement>(null)
		const { themeMode, themeType } = useExtensionState()
		const S = useThemeStyles('settings/OpenRouterModelPicker', themeMode || 'dark', themeType || 'modern')

		useEffect(() => {
			setMarkdown(markdown || "")
		}, [markdown, setMarkdown])

		useEffect(() => {
			if (textRef.current && textContainerRef.current) {
				const { scrollHeight } = textRef.current
				const { clientHeight } = textContainerRef.current
				const isOverflowing = scrollHeight > clientHeight
				setShowSeeMore(isOverflowing)
			}
		}, [reactContent, setIsExpanded])

		return (
			<S.StyledMarkdown key={key} style={{ display: "inline-block", marginBottom: 0 }} mode={themeMode || 'dark'}>
				<div
					ref={textContainerRef}
					style={{
						overflowY: isExpanded ? "auto" : "hidden",
						position: "relative",
						wordBreak: "break-word",
						overflowWrap: "anywhere",
					}}>
					<div
						ref={textRef}
						style={{
							display: "-webkit-box",
							WebkitLineClamp: isExpanded ? "unset" : 3,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
						}}>
						{reactContent}
					</div>
					{!isExpanded && showSeeMore && (
						<div className="see-more-container">
							<button className="see-more-button" onClick={() => setIsExpanded(true)}>
								<i className="codicon codicon-chevron-down" style={{ fontSize: "10px" }} />
								<span>See more</span>
							</button>
						</div>
					)}
				</div>
			</S.StyledMarkdown>
		)
	},
)
