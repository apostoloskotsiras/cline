import { McpResource, McpResourceTemplate } from "../../../../src/shared/mcp"
import * as S from "../styles/mcp/McpResourceRow.styles"

type McpResourceRowProps = {
	item: McpResource | McpResourceTemplate
}

const McpResourceRow = ({ item }: McpResourceRowProps) => {
	const hasUri = "uri" in item
	const uri = hasUri ? item.uri : item.uriTemplate

	return (
		<S.ResourceRow key={uri}>
			<S.ResourceHeader>
				<S.ResourceIcon />
				<S.ResourceTitle>{uri}</S.ResourceTitle>
			</S.ResourceHeader>
			<S.ResourceDescription>
				{item.name && item.description
					? `${item.name}: ${item.description}`
					: !item.name && item.description
						? item.description
						: !item.description && item.name
							? item.name
							: "No description"}
			</S.ResourceDescription>
			<S.ResourceMimeType>
				<S.MimeTypeLabel>Returns </S.MimeTypeLabel>
				<S.MimeTypeCode>{item.mimeType || "Unknown"}</S.MimeTypeCode>
			</S.ResourceMimeType>
		</S.ResourceRow>
	)
}

export default McpResourceRow
