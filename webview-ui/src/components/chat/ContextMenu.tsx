import React, { useEffect, useMemo, useRef } from "react"
import { ContextMenuOptionType, ContextMenuQueryItem, getContextMenuOptions } from "../../utils/context-mentions"
import { removeLeadingNonAlphanumeric } from "../common/CodeAccordian"
import * as S from "../styles/chat/ContextMenu.styles"

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
				return <S.MenuText>Problems</S.MenuText>
			case ContextMenuOptionType.URL:
				return <S.MenuText>Paste URL to fetch contents</S.MenuText>
			case ContextMenuOptionType.NoResults:
				return <S.MenuText>No results found</S.MenuText>
			case ContextMenuOptionType.File:
			case ContextMenuOptionType.Folder:
				if (option.value) {
					return (
						<div>
							<span>/</span>
							{option.value?.startsWith("/.") && <span>.</span>}
							<S.PathText>{removeLeadingNonAlphanumeric(option.value || "") + "\u200E"}</S.PathText>
						</div>
					)
				} else {
					return <S.MenuText>Add {option.type === ContextMenuOptionType.File ? "File" : "Folder"}</S.MenuText>
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
		<S.Wrapper onMouseDown={onMouseDown}>
			<S.Container ref={menuRef}>
				{filteredOptions.map((option, index) => (
					<S.MenuItem
						key={`${option.type}-${option.value || index}`}
						isSelected={index === selectedIndex}
						isSelectable={isOptionSelectable(option)}
						onClick={() => isOptionSelectable(option) && onSelect(option.type, option.value)}
						onMouseEnter={() => isOptionSelectable(option) && setSelectedIndex(index)}>
						<S.ItemContent>
							<i className={`codicon codicon-${getIconForOption(option)}`} />
							{renderOptionContent(option)}
						</S.ItemContent>
						{(option.type === ContextMenuOptionType.File || option.type === ContextMenuOptionType.Folder) &&
							!option.value && <i className="codicon codicon-chevron-right action-icon" />}
						{(option.type === ContextMenuOptionType.Problems ||
							((option.type === ContextMenuOptionType.File || option.type === ContextMenuOptionType.Folder) &&
								option.value)) && <i className="codicon codicon-add action-icon" />}
					</S.MenuItem>
				))}
			</S.Container>
		</S.Wrapper>
	)
}

export default ContextMenu
