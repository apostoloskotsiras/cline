import React, { useEffect, useMemo, useRef } from "react"
import { ContextMenuOptionType, ContextMenuQueryItem, getContextMenuOptions } from "../../utils/context-mentions"
import { removeLeadingNonAlphanumeric } from "../common/CodeAccordian"
import "./ContextMenu.css"

interface ContextMenuProps {
	onSelect: (type: ContextMenuOptionType, value?: string) => void
	searchQuery: string
	onMouseDown: () => void
	selectedIndex: number
	setSelectedIndex: (index: number) => void
	selectedType: ContextMenuOptionType | null
	queryItems: ContextMenuQueryItem[]
}

const ContextMenu: React.FC<ContextMenuProps> = ({
	onSelect,
	searchQuery,
	onMouseDown,
	selectedIndex,
	setSelectedIndex,
	selectedType,
	queryItems,
}) => {
	const menuRef = useRef<HTMLDivElement>(null)

	const filteredOptions = useMemo(
		() => getContextMenuOptions(searchQuery, selectedType, queryItems),
		[searchQuery, selectedType, queryItems],
	)

	useEffect(() => {
		if (menuRef.current) {
			const selectedElement = menuRef.current.children[selectedIndex] as HTMLElement
			if (selectedElement) {
				const menuRect = menuRef.current.getBoundingClientRect()
				const selectedRect = selectedElement.getBoundingClientRect()

				if (selectedRect.bottom > menuRect.bottom) {
					menuRef.current.scrollTop += selectedRect.bottom - menuRect.bottom
				} else if (selectedRect.top < menuRect.top) {
					menuRef.current.scrollTop -= menuRect.top - selectedRect.top
				}
			}
		}
	}, [selectedIndex])

	const renderOptionContent = (option: ContextMenuQueryItem) => {
		switch (option.type) {
			case ContextMenuOptionType.Problems:
				return <span className="menu-text">Problems</span>
			case ContextMenuOptionType.URL:
				return <span className="menu-text">Paste URL to fetch contents</span>
			case ContextMenuOptionType.NoResults:
				return <span className="menu-text">No results found</span>
			case ContextMenuOptionType.File:
			case ContextMenuOptionType.Folder:
				if (option.value) {
					return (
						<div>
							<span>/</span>
							{option.value?.startsWith("/.") && <span>.</span>}
							<span
								style={{
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
									direction: "rtl",
									textAlign: "left",
								}}>
								{removeLeadingNonAlphanumeric(option.value || "") + "\u200E"}
							</span>
						</div>
					)
				} else {
					return (
						<span className="menu-text">
							Add {option.type === ContextMenuOptionType.File ? "File" : "Folder"}
						</span>
					)
				}
		}
	}

	const getIconForOption = (option: ContextMenuQueryItem): string => {
		switch (option.type) {
			case ContextMenuOptionType.File:
				return "file"
			case ContextMenuOptionType.Folder:
				return "folder"
			case ContextMenuOptionType.Problems:
				return "warning"
			case ContextMenuOptionType.URL:
				return "link"
			case ContextMenuOptionType.NoResults:
				return "info"
			default:
				return "file"
		}
	}

	const isOptionSelectable = (option: ContextMenuQueryItem): boolean => {
		return option.type !== ContextMenuOptionType.NoResults && option.type !== ContextMenuOptionType.URL
	}

	return (
		<div className="context-menu-wrapper" onMouseDown={onMouseDown}>
			<div ref={menuRef} className="context-menu-container">
				{filteredOptions.map((option, index) => (
					<div
						key={`${option.type}-${option.value || index}`}
						className={`context-menu-item ${index === selectedIndex ? "selected" : ""} ${
							isOptionSelectable(option) ? "selectable" : ""
						}`}
						onClick={() => isOptionSelectable(option) && onSelect(option.type, option.value)}
						onMouseEnter={() => isOptionSelectable(option) && setSelectedIndex(index)}>
						<div className="item-content">
							<i className={`codicon codicon-${getIconForOption(option)}`} />
							{renderOptionContent(option)}
						</div>
						{(option.type === ContextMenuOptionType.File || option.type === ContextMenuOptionType.Folder) &&
							!option.value && <i className="codicon codicon-chevron-right action-icon" />}
						{(option.type === ContextMenuOptionType.Problems ||
							((option.type === ContextMenuOptionType.File || option.type === ContextMenuOptionType.Folder) &&
								option.value)) && <i className="codicon codicon-add action-icon" />}
					</div>
				))}
			</div>
		</div>
	)
}

export default ContextMenu
