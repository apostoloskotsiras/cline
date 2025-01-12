import React, { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import DynamicTextArea from "react-textarea-autosize"
import { mentionRegex, mentionRegexGlobal } from "../../../../src/shared/context-mentions"
import { useExtensionState } from "../../context/ExtensionStateContext"
import {
	ContextMenuOptionType,
	getContextMenuOptions,
	insertMention,
	removeMention,
	shouldShowContextMenu,
} from "../../utils/context-mentions"
import { MAX_IMAGES_PER_MESSAGE } from "./ChatView"
import ContextMenu from "./ContextMenu"
import Thumbnails from "../common/Thumbnails"
import {
	ActionButton,
	ChatTextAreaContainer,
	SendSvg,
	StyledSvg,
	TextContainer,
	TagsBox,
	Tag,
	AddContextButton,
	BottomControls,
	PhotoButton,
	TagsSection,
	ThumbnailsSection,
} from "../styles/themes/modern/dark/chat/ChatTextArea.styles"

interface ChatTextAreaProps {
	inputValue: string
	setInputValue: (value: string) => void
	textAreaDisabled: boolean
	placeholderText: string
	selectedImages: string[]
	setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>
	onSend: () => void
	onSelectImages: () => void
	shouldDisableImages: boolean
	onHeightChange?: (height: number) => void
}

interface TaggedItem {
	type: "file" | "folder" | "problems"
	value: string
}

const ChatTextArea = forwardRef<HTMLTextAreaElement, ChatTextAreaProps>(
	(
		{
			inputValue,
			setInputValue,
			textAreaDisabled,
			placeholderText,
			selectedImages,
			setSelectedImages,
			onSend,
			onSelectImages,
			shouldDisableImages,
			onHeightChange,
		},
		ref,
	) => {
		const { filePaths } = useExtensionState()
		const [isTextAreaFocused, setIsTextAreaFocused] = useState(false)
		const [thumbnailsHeight, setThumbnailsHeight] = useState(0)
		const [textAreaBaseHeight, setTextAreaBaseHeight] = useState<number | undefined>(undefined)
		const [showContextMenu, setShowContextMenu] = useState(false)
		const [cursorPosition, setCursorPosition] = useState(0)
		const [searchQuery, setSearchQuery] = useState("")
		const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
		const [isMouseDownOnMenu, setIsMouseDownOnMenu] = useState(false)
		const highlightLayerRef = useRef<HTMLDivElement>(null)
		const [selectedMenuIndex, setSelectedMenuIndex] = useState(-1)
		const [selectedType, setSelectedType] = useState<ContextMenuOptionType | null>(null)
		const [justDeletedSpaceAfterMention, setJustDeletedSpaceAfterMention] = useState(false)
		const [intendedCursorPosition, setIntendedCursorPosition] = useState<number | null>(null)
		const contextMenuContainerRef = useRef<HTMLDivElement>(null)
		const [taggedItems, setTaggedItems] = useState<TaggedItem[]>([])

		const queryItems = useMemo(() => {
			return [
				{ type: ContextMenuOptionType.Problems, value: "problems" },
				...filePaths
					.map((file) => "/" + file)
					.map((path) => ({
						type: path.endsWith("/") ? ContextMenuOptionType.Folder : ContextMenuOptionType.File,
						value: path,
					})),
			]
		}, [filePaths])

		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (contextMenuContainerRef.current && !contextMenuContainerRef.current.contains(event.target as Node)) {
					setShowContextMenu(false)
				}
			}

			if (showContextMenu) {
				document.addEventListener("mousedown", handleClickOutside)
			}

			return () => {
				document.removeEventListener("mousedown", handleClickOutside)
			}
		}, [showContextMenu, setShowContextMenu])

		const handleMentionSelect = useCallback(
			(type: ContextMenuOptionType, value?: string) => {
				if (type === ContextMenuOptionType.NoResults) {
					return
				}

				if (type === ContextMenuOptionType.File || type === ContextMenuOptionType.Folder) {
					if (!value) {
						setSelectedType(type)
						setSearchQuery("")
						setSelectedMenuIndex(0)
						return
					}
				}

				setShowContextMenu(false)
				setSelectedType(null)
				if (textAreaRef.current) {
					let insertValue = value || ""
					if (type === ContextMenuOptionType.URL) {
						insertValue = value || ""
					} else if (type === ContextMenuOptionType.File || type === ContextMenuOptionType.Folder) {
						insertValue = value || ""
					} else if (type === ContextMenuOptionType.Problems) {
						insertValue = "problems"
					}

					const { newValue, mentionIndex } = insertMention(textAreaRef.current.value, cursorPosition, insertValue)

					setInputValue(newValue)
					const newCursorPosition = newValue.indexOf(" ", mentionIndex + insertValue.length) + 1
					setCursorPosition(newCursorPosition)
					setIntendedCursorPosition(newCursorPosition)
					// textAreaRef.current.focus()

					// scroll to cursor
					setTimeout(() => {
						if (textAreaRef.current) {
							textAreaRef.current.blur()
							textAreaRef.current.focus()
						}
					}, 0)
				}
			},
			[setInputValue, cursorPosition],
		)

		const handleSendWithAnimation = useCallback(() => {
			const svg = document.querySelector(".send-icon")
			const textContainer = document.querySelector(".text-container")

			if (svg) {
				svg.classList.add("flying")
				setTimeout(() => {
					svg.classList.remove("flying")
				}, 800)
			}

			if (textContainer) {
				textContainer.classList.add("disintegrating")
				// Call onSend just before the animation completes
				setTimeout(() => {
					onSend()
					// Remove the class after the text is cleared
					requestAnimationFrame(() => {
						textContainer.classList.remove("disintegrating")
					})
				}, 590) // Slightly before animation ends
			} else {
				onSend()
			}
		}, [onSend])

		const handleKeyDown = useCallback(
			(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
				if (showContextMenu) {
					if (event.key === "Escape") {
						setSelectedType(null)
						setSelectedMenuIndex(3) // File by default
						return
					}

					if (event.key === "ArrowUp" || event.key === "ArrowDown") {
						event.preventDefault()
						setSelectedMenuIndex((prevIndex) => {
							const direction = event.key === "ArrowUp" ? -1 : 1
							const options = getContextMenuOptions(searchQuery, selectedType, queryItems)
							const optionsLength = options.length

							if (optionsLength === 0) return prevIndex

							const selectableOptions = options.filter(
								(option) =>
									option.type !== ContextMenuOptionType.URL && option.type !== ContextMenuOptionType.NoResults,
							)

							if (selectableOptions.length === 0) return -1

							const currentSelectableIndex = selectableOptions.findIndex((option) => option === options[prevIndex])

							const newSelectableIndex =
								(currentSelectableIndex + direction + selectableOptions.length) % selectableOptions.length

							return options.findIndex((option) => option === selectableOptions[newSelectableIndex])
						})
						return
					}
					if ((event.key === "Enter" || event.key === "Tab") && selectedMenuIndex !== -1) {
						event.preventDefault()
						const selectedOption = getContextMenuOptions(searchQuery, selectedType, queryItems)[selectedMenuIndex]
						if (
							selectedOption &&
							selectedOption.type !== ContextMenuOptionType.URL &&
							selectedOption.type !== ContextMenuOptionType.NoResults
						) {
							handleMentionSelect(selectedOption.type, selectedOption.value)
						}
						return
					}
				}

				const isComposing = event.nativeEvent?.isComposing ?? false

				// Handle arrow key navigation through mentions
				if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && !isComposing) {
					const text = textAreaRef.current?.value || ""
					const currentPos = textAreaRef.current?.selectionStart || 0

					// Find all mention matches with their positions
					const mentions: { start: number; end: number }[] = []
					let match
					while ((match = mentionRegexGlobal.exec(text)) !== null) {
						mentions.push({
							start: match.index,
							end: match.index + match[0].length,
						})
					}

					// Check if we're at the edge of a mention
					for (const mention of mentions) {
						if (event.key === "ArrowLeft") {
							// If cursor is at the end or inside a mention, jump to its start
							if (currentPos <= mention.end && currentPos > mention.start) {
								event.preventDefault()
								const newPos = mention.start
								textAreaRef.current?.setSelectionRange(newPos, newPos)
								return
							}
						} else {
							// ArrowRight
							// If cursor is at the start or inside a mention, jump to its end
							if (currentPos >= mention.start && currentPos < mention.end) {
								event.preventDefault()
								const newPos = mention.end
								textAreaRef.current?.setSelectionRange(newPos, newPos)
								return
							}
						}
					}
				}

				if (event.key === "Enter" && !event.shiftKey && !isComposing && !textAreaDisabled) {
					event.preventDefault()
					handleSendWithAnimation()
				}

				if (event.key === "Backspace" && !isComposing) {
					const charBeforeCursor = inputValue[cursorPosition - 1]
					const charAfterCursor = inputValue[cursorPosition + 1]

					const charBeforeIsWhitespace =
						charBeforeCursor === " " || charBeforeCursor === "\n" || charBeforeCursor === "\r\n"
					const charAfterIsWhitespace =
						charAfterCursor === " " || charAfterCursor === "\n" || charAfterCursor === "\r\n"
					// checks if char before cusor is whitespace after a mention
					if (
						charBeforeIsWhitespace &&
						inputValue.slice(0, cursorPosition - 1).match(new RegExp(mentionRegex.source + "$")) // "$" is added to ensure the match occurs at the end of the string
					) {
						const newCursorPosition = cursorPosition - 1
						// if mention is followed by another word, then instead of deleting the space separating them we just move the cursor to the end of the mention
						if (!charAfterIsWhitespace) {
							event.preventDefault()
							textAreaRef.current?.setSelectionRange(newCursorPosition, newCursorPosition)
							setCursorPosition(newCursorPosition)
						}
						setCursorPosition(newCursorPosition)
						setJustDeletedSpaceAfterMention(true)
					} else if (justDeletedSpaceAfterMention) {
						const { newText, newPosition } = removeMention(inputValue, cursorPosition)
						if (newText !== inputValue) {
							event.preventDefault()
							setInputValue(newText)
							setIntendedCursorPosition(newPosition) // Store the new cursor position in state
						}
						setJustDeletedSpaceAfterMention(false)
						setShowContextMenu(false)
					} else {
						setJustDeletedSpaceAfterMention(false)
					}
				}
			},
			[
				onSend,
				showContextMenu,
				searchQuery,
				selectedMenuIndex,
				handleMentionSelect,
				selectedType,
				inputValue,
				cursorPosition,
				setInputValue,
				justDeletedSpaceAfterMention,
				queryItems,
				textAreaDisabled,
				handleSendWithAnimation,
			],
		)

		useLayoutEffect(() => {
			if (intendedCursorPosition !== null && textAreaRef.current) {
				textAreaRef.current.setSelectionRange(intendedCursorPosition, intendedCursorPosition)
				setIntendedCursorPosition(null) // Reset the state
			}
		}, [inputValue, intendedCursorPosition])

		const handleInputChange = useCallback(
			(e: React.ChangeEvent<HTMLTextAreaElement>) => {
				const newValue = e.target.value
				const newCursorPosition = e.target.selectionStart
				setInputValue(newValue)
				setCursorPosition(newCursorPosition)
				const showMenu = shouldShowContextMenu(newValue, newCursorPosition)

				setShowContextMenu(showMenu)
				if (showMenu) {
					const lastAtIndex = newValue.lastIndexOf("@", newCursorPosition - 1)
					const query = newValue.slice(lastAtIndex + 1, newCursorPosition)
					setSearchQuery(query)
					if (query.length > 0) {
						setSelectedMenuIndex(0)
					} else {
						setSelectedMenuIndex(3) // Set to "File" option by default
					}
				} else {
					setSearchQuery("")
					setSelectedMenuIndex(-1)
				}
			},
			[setInputValue],
		)

		useEffect(() => {
			if (!showContextMenu) {
				setSelectedType(null)
			}
		}, [showContextMenu])

		const handleBlur = useCallback(() => {
			// Only hide the context menu if the user didn't click on it
			if (!isMouseDownOnMenu) {
				setShowContextMenu(false)
			}
			setIsTextAreaFocused(false)
		}, [isMouseDownOnMenu])

		const handlePaste = useCallback(
			async (e: React.ClipboardEvent) => {
				const items = e.clipboardData.items

				const pastedText = e.clipboardData.getData("text")
				// Check if the pasted content is a URL, add space after so user can easily delete if they don't want it
				const urlRegex = /^\S+:\/\/\S+$/
				if (urlRegex.test(pastedText.trim())) {
					e.preventDefault()
					const trimmedUrl = pastedText.trim()
					const newValue = inputValue.slice(0, cursorPosition) + trimmedUrl + " " + inputValue.slice(cursorPosition)
					setInputValue(newValue)
					const newCursorPosition = cursorPosition + trimmedUrl.length + 1
					setCursorPosition(newCursorPosition)
					setIntendedCursorPosition(newCursorPosition)
					setShowContextMenu(false)

					// Scroll to new cursor position
					// https://stackoverflow.com/questions/29899364/how-do-you-scroll-to-the-position-of-the-cursor-in-a-textarea/40951875#40951875
					setTimeout(() => {
						if (textAreaRef.current) {
							textAreaRef.current.blur()
							textAreaRef.current.focus()
						}
					}, 0)
					// NOTE: callbacks dont utilize return function to cleanup, but it's fine since this timeout immediately executes and will be cleaned up by the browser (no chance component unmounts before it executes)

					return
				}

				const acceptedTypes = ["png", "jpeg", "webp"] // supported by anthropic and openrouter (jpg is just a file extension but the image will be recognized as jpeg)
				const imageItems = Array.from(items).filter((item) => {
					const [type, subtype] = item.type.split("/")
					return type === "image" && acceptedTypes.includes(subtype)
				})
				if (!shouldDisableImages && imageItems.length > 0) {
					e.preventDefault()
					const imagePromises = imageItems.map((item) => {
						return new Promise<string | null>((resolve) => {
							const blob = item.getAsFile()
							if (!blob) {
								resolve(null)
								return
							}
							const reader = new FileReader()
							reader.onloadend = () => {
								if (reader.error) {
									console.error("Error reading file:", reader.error)
									resolve(null)
								} else {
									const result = reader.result
									resolve(typeof result === "string" ? result : null)
								}
							}
							reader.readAsDataURL(blob)
						})
					})
					const imageDataArray = await Promise.all(imagePromises)
					const dataUrls = imageDataArray.filter((dataUrl): dataUrl is string => dataUrl !== null)
					//.map((dataUrl) => dataUrl.split(",")[1]) // strip the mime type prefix, sharp doesn't need it
					if (dataUrls.length > 0) {
						setSelectedImages((prevImages) => [...prevImages, ...dataUrls].slice(0, MAX_IMAGES_PER_MESSAGE))
					} else {
						console.warn("No valid images were processed")
					}
				}
			},
			[shouldDisableImages, setSelectedImages, cursorPosition, setInputValue, inputValue],
		)

		const handleThumbnailsHeightChange = useCallback((height: number) => {
			setThumbnailsHeight(height)
		}, [])

		useEffect(() => {
			if (selectedImages.length === 0) {
				setThumbnailsHeight(0)
			}
		}, [selectedImages])

		const handleMenuMouseDown = useCallback(() => {
			setIsMouseDownOnMenu(true)
		}, [])

		const updateHighlights = useCallback(() => {
			if (!textAreaRef.current || !highlightLayerRef.current) return

			const text = textAreaRef.current.value

			highlightLayerRef.current.innerHTML = text
				.replace(/\n$/, "\n\n")
				.replace(/[<>&]/g, (c) => ({ "<": "<", ">": ">", "&": "&" })[c] || c)
				.replace(mentionRegexGlobal, '<mark class="mention-context-textarea-highlight">$&</mark>')

			highlightLayerRef.current.scrollTop = textAreaRef.current.scrollTop
			highlightLayerRef.current.scrollLeft = textAreaRef.current.scrollLeft
		}, [])

		useLayoutEffect(() => {
			updateHighlights()
		}, [inputValue, updateHighlights])

		const updateCursorPosition = useCallback(() => {
			if (textAreaRef.current) {
				setCursorPosition(textAreaRef.current.selectionStart)
			}
		}, [])

		const handleKeyUp = useCallback(
			(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
				if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
					updateCursorPosition()
				}
			},
			[updateCursorPosition],
		)

		const extractTaggedItems = useCallback((text: string) => {
			const matches = text.match(mentionRegexGlobal)
			if (!matches) return []

			return matches.map((match) => {
				const value = match.slice(1) // Remove @ symbol
				let type: "file" | "folder" | "problems" = "file"

				if (value === "problems") {
					type = "problems"
				} else if (value.endsWith("/")) {
					type = "folder"
				}

				return { type, value }
			})
		}, [])

		useEffect(() => {
			const items = extractTaggedItems(inputValue)
			setTaggedItems(items)
		}, [inputValue, extractTaggedItems])

		const handleRemoveTag = useCallback(
			(tagValue: string) => {
				const newValue = inputValue.replace(`@${tagValue}`, "").replace(/\s+/g, " ").trim()
				setInputValue(newValue)
			},
			[inputValue, setInputValue],
		)

		const getTagIcon = useCallback((type: "file" | "folder" | "problems") => {
			switch (type) {
				case "folder":
					return "folder"
				case "problems":
					return "warning"
				default:
					return "file"
			}
		}, [])

		const handleAddContext = useCallback(() => {
			// Trigger the context menu with @ symbol
			const newValue = inputValue + (inputValue && !inputValue.endsWith(" ") ? " " : "") + "@"
			setInputValue(newValue)
			setShowContextMenu(true)
			if (textAreaRef.current) {
				textAreaRef.current.focus()
				const newPosition = newValue.length
				textAreaRef.current.setSelectionRange(newPosition, newPosition)
				setCursorPosition(newPosition)
			}
		}, [inputValue, setInputValue])

		return (
			<>
				{(taggedItems.length > 0 || selectedImages.length > 0) && (
					<TagsBox>
						<TagsSection>
							{taggedItems.map((item, index) => (
								<Tag key={index}>
									<i className={`codicon codicon-${getTagIcon(item.type)}`} />
									<span>{item.value}</span>
									<div className="remove-tag" onClick={() => handleRemoveTag(item.value)}>
										<i className="codicon codicon-close" />
									</div>
								</Tag>
							))}
						</TagsSection>
						{selectedImages.length > 0 && (
							<ThumbnailsSection>
								<Thumbnails
									images={selectedImages}
									setImages={setSelectedImages}
									onHeightChange={handleThumbnailsHeightChange}
								/>
							</ThumbnailsSection>
						)}
					</TagsBox>
				)}
				<ChatTextAreaContainer
					disabled={textAreaDisabled}
					hasTagsAbove={taggedItems.length > 0 || selectedImages.length > 0}>
					<AddContextButton onClick={handleAddContext}>
						<i className="codicon codicon-plus" />
						Add context
					</AddContextButton>
					{showContextMenu && (
						<div ref={contextMenuContainerRef}>
							<ContextMenu
								onSelect={handleMentionSelect}
								searchQuery={searchQuery}
								onMouseDown={handleMenuMouseDown}
								selectedIndex={selectedMenuIndex}
								setSelectedIndex={setSelectedMenuIndex}
								selectedType={selectedType}
								queryItems={queryItems}
							/>
						</div>
					)}
					<TextContainer className="text-container">
						<div
							ref={highlightLayerRef}
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								pointerEvents: "none",
								whiteSpace: "pre-wrap",
								wordWrap: "break-word",
								color: "transparent",
								overflow: "hidden",
								backgroundColor: "transparent",
								fontFamily: "var(--vscode-font-family)",
								fontSize: "var(--vscode-editor-font-size)",
								lineHeight: "var(--vscode-editor-line-height)",
								borderRadius: "6px",
								border: "none",
								padding: "10px 52px 10px 12px",
								transition: "all 0.2s ease",
								width: "100%",
								boxSizing: "border-box",
							}}
						/>
						<DynamicTextArea
							ref={(el) => {
								if (typeof ref === "function") {
									ref(el)
								} else if (ref) {
									ref.current = el
								}
								textAreaRef.current = el
							}}
							value={inputValue}
							disabled={textAreaDisabled}
							onChange={(e) => {
								handleInputChange(e)
								updateHighlights()
							}}
							onKeyDown={handleKeyDown}
							onKeyUp={handleKeyUp}
							onFocus={() => setIsTextAreaFocused(true)}
							onBlur={handleBlur}
							onPaste={handlePaste}
							onSelect={updateCursorPosition}
							onMouseUp={updateCursorPosition}
							onHeightChange={(height) => {
								if (textAreaBaseHeight === undefined || height < textAreaBaseHeight) {
									setTextAreaBaseHeight(height)
								}
								onHeightChange?.(height)
							}}
							placeholder={placeholderText}
							maxRows={10}
							autoFocus={true}
							style={{
								width: "100%",
								boxSizing: "border-box",
								background: "transparent",
								color: "var(--vscode-input-foreground)",
								fontFamily: "var(--vscode-font-family)",
								fontSize: "var(--vscode-editor-font-size)",
								lineHeight: "var(--vscode-editor-line-height)",
								resize: "none",
								overflowX: "hidden",
								overflowY: "scroll",
								scrollbarWidth: "none",
								borderRadius: "6px",
								border: "none",
								padding: "10px 52px 10px 12px",
								cursor: textAreaDisabled ? "not-allowed" : "text",
								flex: 1,
								outline: "none",
								zIndex: 1,
								transition: "all 0.2s ease",
							}}
							onScroll={() => updateHighlights()}
						/>
					</TextContainer>
					<BottomControls>
						<PhotoButton
							disabled={shouldDisableImages}
							onClick={() => {
								if (!shouldDisableImages) {
									onSelectImages()
								}
							}}>
							<StyledSvg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<rect
									x="3"
									y="3"
									width="18"
									height="18"
									rx="2"
									ry="2"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<circle cx="8.5" cy="8.5" r="1.5" stroke="none" fill="currentColor" />
								<path d="M21 15l-5-5L5 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							</StyledSvg>
							<span>photo</span>
						</PhotoButton>
						<ActionButton
							disabled={textAreaDisabled}
							onClick={() => {
								if (!textAreaDisabled) {
									handleSendWithAnimation()
								}
							}}>
							<SendSvg
								className="send-icon"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor">
								<path
									d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</SendSvg>
						</ActionButton>
					</BottomControls>
				</ChatTextAreaContainer>
			</>
		)
	},
)

export default ChatTextArea
