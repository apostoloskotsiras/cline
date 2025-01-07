import React, { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import DynamicTextArea from "react-textarea-autosize"
import styled from "styled-components"
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

const StyledSvg = styled.svg`
	color: var(--vscode-input-foreground);
	transition: opacity 0.2s ease;

	&:hover {
		opacity: 0.8;
	}
`

const TextContainer = styled.div`
	position: relative;
	width: 100%;
	
	.mention-context-textarea-highlight {
		background: rgb(75 89 97);
		border-radius: 4px;
		padding: 1px 2px;
		display: inline-flex;
		align-items: center;
		gap: 3px;
		color: var(--vscode-input-foreground);
		white-space: nowrap;
		margin: 0 1px;
		position: relative;
		z-index: 2;
		min-width: 0;
		max-width: fit-content;
		backdrop-filter: none;
	}

	.mention-text {
		opacity: 0;
		position: absolute;
		pointer-events: none;
		user-select: none;
		visibility: hidden;
		width: 0;
		height: 0;
		overflow: hidden;
	}

	.mention-display {
		font-size: 0.95em;
		opacity: 1;
		color: var(--vscode-editor-foreground);
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.mention-icon {
		width: 12px;
		height: 12px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		opacity: 0.9;
		color: var(--vscode-editor-foreground);
		flex-shrink: 0;
	}

	textarea {
		color: transparent;
		caret-color: var(--vscode-input-foreground);
		background: transparent;
		
		&::selection {
			background-color: var(--vscode-editor-selectionBackground);
			color: transparent;
		}
	}
	
	@keyframes disintegrate {
		0% {
			clip-path: inset(0 0 0 0);
			opacity: 1;
			transform: translateX(0);
		}
		20% {
			clip-path: inset(0 0% 0 0);
			opacity: 0.95;
			transform: translateX(0);
		}
		99.9% {
			clip-path: inset(0 100% 0 0);
			opacity: 0;
			transform: translateX(2px);
			visibility: visible;
		}
		100% {
			clip-path: inset(0 100% 0 0);
			opacity: 0;
			transform: translateX(2px);
			visibility: hidden;
		}
	}

	&.disintegrating {
		animation: disintegrate 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
		transform-origin: right;
	}
`

const SendSvg = styled(StyledSvg)`
	@keyframes fly {
		0% {
			transform: scale(1) translate(0, 0);
			opacity: 1;
		}
		40% {
			transform: scale(0.8) translate(100%, -100%);
			opacity: 0;
		}
		40.1% {
			transform: scale(0.8) translate(0, 0);
			opacity: 0;
		}
		100% {
			transform: scale(1) translate(0, 0);
			opacity: 1;
		}
	}

	&.flying {
		animation: fly 0.8s ease-in-out forwards;
	}
`

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

const ChatTextAreaContainer = styled.div<{ disabled: boolean }>`
	padding: 8px 12px;
	opacity: ${props => props.disabled ? 0.6 : 1};
	position: relative;
	display: flex;
	transition: all 0.2s ease;
	box-shadow: none;
	border-radius: 8px;
	background: ${props => props.disabled 
		? "rgba(30, 30, 30, 0.95)"
		: "rgba(40, 40, 40, 0.4)"};
	backdrop-filter: blur(16px);
	border: ${props => props.disabled
		? "1px solid rgba(255, 255, 255, 0.08)"
		: "1px solid rgba(255, 255, 255, 0.1)"};
	box-shadow: ${props => props.disabled
		? "none"
		: "0 1px 4px rgba(0, 0, 0, 0.1)"};
	transform: ${props => props.disabled ? "none" : "translateY(0)"};

	&:hover {
		background: ${props => props.disabled
			? "rgba(30, 30, 30, 0.95)"
			: "rgba(45, 45, 45, 0.5)"};
		border-color: ${props => props.disabled
			? "rgba(255, 255, 255, 0.08)"
			: "rgba(255, 255, 255, 0.15)"};
		transform: ${props => props.disabled ? "none" : "translateY(-1px)"};
		box-shadow: ${props => props.disabled
			? "none"
			: "0 2px 8px rgba(0, 0, 0, 0.15)"};
	}
`

const ActionButton = styled.div<{ disabled: boolean }>`
	width: 16px;
	height: 16px;
	opacity: ${props => props.disabled ? 0.5 : 1};
	cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
	transition: all 0.2s ease;

	&:hover {
		transform: ${props => props.disabled ? "none" : "scale(1.1)"};
		opacity: ${props => props.disabled ? 0.5 : 0.8};
	}
`

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
			const svg = document.querySelector('.send-icon');
			const textContainer = document.querySelector('.text-container');
			
			if (svg) {
				svg.classList.add('flying');
				setTimeout(() => {
					svg.classList.remove('flying');
				}, 800);
			}
			
			if (textContainer) {
				textContainer.classList.add('disintegrating');
				// Call onSend just before the animation completes
				setTimeout(() => {
					onSend();
					// Remove the class after the text is cleared
					requestAnimationFrame(() => {
						textContainer.classList.remove('disintegrating');
					});
				}, 590); // Slightly before animation ends
			} else {
				onSend();
			}
		}, [onSend]);

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
					const text = textAreaRef.current?.value || "";
					const currentPos = textAreaRef.current?.selectionStart || 0;
					
					// Find all mention matches with their positions
					const mentions: { start: number; end: number }[] = [];
					let match;
					while ((match = mentionRegexGlobal.exec(text)) !== null) {
						mentions.push({
							start: match.index,
							end: match.index + match[0].length
						});
					}

					// Check if we're at the edge of a mention
					for (const mention of mentions) {
						if (event.key === "ArrowLeft") {
							// If cursor is at the end or inside a mention, jump to its start
							if (currentPos <= mention.end && currentPos > mention.start) {
								event.preventDefault();
								const newPos = mention.start;
								textAreaRef.current?.setSelectionRange(newPos, newPos);
								return;
							}
						} else { // ArrowRight
							// If cursor is at the start or inside a mention, jump to its end
							if (currentPos >= mention.start && currentPos < mention.end) {
								event.preventDefault();
								const newPos = mention.end;
								textAreaRef.current?.setSelectionRange(newPos, newPos);
								return;
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

			const folderIcon = `<svg class="mention-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`
			const fileIcon = `<svg class="mention-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>`
			const problemsIcon = `<svg class="mention-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`

			const processedText = text
				.replace(/\n$/, "\n\n")
				.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] || c)
				.replace(mentionRegexGlobal, (match) => {
					let icon = fileIcon;
					let displayText = match;

					if (match === '@problems') {
						icon = problemsIcon;
						displayText = 'problems';
					} else {
						// Remove just the @ prefix but keep the full path
						displayText = match.substring(1);
						
						// If it ends with a slash, it's a folder
						if (match.endsWith('/')) {
							icon = folderIcon;
						}
					}

					return `<mark class="mention-context-textarea-highlight">
						${icon}
						<span class="mention-display">${displayText}</span>
						<span class="mention-text">${match}</span>
					</mark>`;
				})

			highlightLayerRef.current.innerHTML = processedText
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

		return (
			<ChatTextAreaContainer disabled={textAreaDisabled}>
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
				{!isTextAreaFocused && (
					<div
						style={{
							position: "absolute",
							inset: "12px 16px",
							border: "none",
							borderRadius: "12px",
							pointerEvents: "none",
							zIndex: 5,
							transition: "all 0.2s ease",
							opacity: 0.5
						}}
					/>
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
							borderBottom: `${thumbnailsHeight + 6}px solid transparent`,
							padding: "6px 52px 6px 8px",
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
							borderBottom: `${thumbnailsHeight + 6}px solid transparent`,
							padding: "6px 52px 6px 8px",
							cursor: textAreaDisabled ? "not-allowed" : "text",
							flex: 1,
							outline: "none",
							zIndex: 1,
							transition: "all 0.2s ease",
						}}
						onScroll={() => updateHighlights()}
					/>
				</TextContainer>
				{selectedImages.length > 0 && (
					<Thumbnails
						images={selectedImages}
						setImages={setSelectedImages}
						onHeightChange={handleThumbnailsHeightChange}
						style={{
							position: "absolute",
							paddingTop: 4,
							bottom: 12,
							left: 18,
							right: 60,
							zIndex: 2,
						}}
					/>
				)}
				<div
					style={{
						position: "absolute",
						right: 18,
						display: "flex",
						alignItems: "flex-center",
						height: textAreaBaseHeight || 31,
						bottom: 8,
						zIndex: 2,
					}}>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							gap: "10px"
						}}>
						<ActionButton
							disabled={shouldDisableImages}
							onClick={() => {
								if (!shouldDisableImages) {
									onSelectImages()
								}
							}}
						>
							<StyledSvg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								<circle cx="8.5" cy="8.5" r="1.5" stroke="none" fill="currentColor"/>
								<path d="M21 15l-5-5L5 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</StyledSvg>
						</ActionButton>
						<ActionButton
							disabled={textAreaDisabled}
							onClick={() => {
								if (!textAreaDisabled) {
									handleSendWithAnimation();
								}
							}}
						>
							<SendSvg 
								className="send-icon"
								width="16" 
								height="16" 
								viewBox="0 0 24 24" 
								fill="none" 
								stroke="currentColor"
							>
								<path
									d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</SendSvg>
						</ActionButton>
					</div>
				</div>
			</ChatTextAreaContainer>
		)
	},
)

export default ChatTextArea
