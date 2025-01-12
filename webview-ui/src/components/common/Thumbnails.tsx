import React, { useState, useRef, useLayoutEffect, memo } from "react"
import { useWindowSize } from "react-use"
import { vscode } from "../../utils/vscode"
import * as S from "../styles/themes/modern/dark/common/Thumbnails.styles"

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
		<S.Container ref={containerRef} style={style}>
			{images.map((image, index) => (
				<S.ThumbnailWrapper
					key={index}
					onMouseEnter={() => setHoveredIndex(index)}
					onMouseLeave={() => setHoveredIndex(null)}>
					<S.ThumbnailImage
						src={image}
						alt={`Thumbnail ${index + 1}`}
						onClick={() => handleImageClick(image)}
					/>
					{isDeletable && hoveredIndex === index && (
						<S.DeleteButton onClick={() => handleDelete(index)}>
							<S.DeleteIcon />
						</S.DeleteButton>
					)}
				</S.ThumbnailWrapper>
			))}
		</S.Container>
	)
}

export default memo(Thumbnails)
