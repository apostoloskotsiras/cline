import React, { useState, useRef, useLayoutEffect, memo } from "react"
import { useWindowSize } from "react-use"
import { vscode } from "../../utils/vscode"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { useThemeStyles } from "../../utils/theme"

interface ThumbnailsProps {
	images: string[]
	style?: React.CSSProperties
	setImages?: React.Dispatch<React.SetStateAction<string[]>>
	onHeightChange?: (height: number) => void
}

const Thumbnails = ({ images, style, setImages, onHeightChange }: ThumbnailsProps) => {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const { width } = useWindowSize()
	const { themeMode, themeType } = useExtensionState()
	const S = useThemeStyles('common/Thumbnails', themeMode || 'dark', themeType || 'modern')

	useLayoutEffect(() => {
		if (containerRef.current) {
			let height = containerRef.current.clientHeight
			// some browsers return 0 for clientHeight
			if (!height) {
				height = containerRef.current.getBoundingClientRect().height
			}
			onHeightChange?.(height)
		}
		setHoveredIndex(null)
	}, [images, width, onHeightChange])

	const handleDelete = (index: number) => {
		setImages?.((prevImages) => prevImages.filter((_, i) => i !== index))
	}

	const isDeletable = setImages !== undefined

	const handleImageClick = (image: string) => {
		vscode.postMessage({ type: "openImage", text: image })
	}

	return (
		<S.Container ref={containerRef} style={style} mode={themeMode || 'dark'}>
			{images.map((image, index) => (
				<S.ThumbnailWrapper
					key={index}
					onMouseEnter={() => setHoveredIndex(index)}
					onMouseLeave={() => setHoveredIndex(null)}
					mode={themeMode || 'dark'}>
					<S.ThumbnailImage
						src={image}
						alt={`Thumbnail ${index + 1}`}
						onClick={() => handleImageClick(image)}
						mode={themeMode || 'dark'}
					/>
					{isDeletable && hoveredIndex === index && (
						<S.DeleteButton onClick={() => handleDelete(index)} mode={themeMode || 'dark'}>
							<S.DeleteIcon mode={themeMode || 'dark'} />
						</S.DeleteButton>
					)}
				</S.ThumbnailWrapper>
			))}
		</S.Container>
	)
}

export default memo(Thumbnails)
