import { McpResource, McpResourceTemplate } from "../../../../src/shared/mcp"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { useThemeStyles } from "../../utils/theme"

type McpResourceRowProps = {
	item: McpResource | McpResourceTemplate
}

const McpResourceRow = ({ item }: McpResourceRowProps) => {
	const { themeMode, themeType } = useExtensionState()
	const S = useThemeStyles('mcp/McpResourceRow', themeMode || 'dark', themeType || 'modern')
	
	const hasUri = "uri" in item
	const uri = hasUri ? item.uri : item.uriTemplate

	return (
		<S.ResourceRow mode={themeMode || 'dark'} key={uri}>
			<S.ResourceHeader mode={themeMode || 'dark'}>
				<S.ResourceIcon mode={themeMode || 'dark'} />
				<S.ResourceTitle mode={themeMode || 'dark'}>{uri}</S.ResourceTitle>
			</S.ResourceHeader>
			<S.ResourceDescription mode={themeMode || 'dark'}>
				{item.name && item.description
					? `${item.name}: ${item.description}`
					: !item.name && item.description
						? item.description
						: !item.description && item.name
							? item.name
							: "No description"}
			</S.ResourceDescription>
			<S.ResourceMimeType mode={themeMode || 'dark'}>
				<S.MimeTypeLabel mode={themeMode || 'dark'}>Returns </S.MimeTypeLabel>
				<S.MimeTypeCode mode={themeMode || 'dark'}>{item.mimeType || "Unknown"}</S.MimeTypeCode>
			</S.ResourceMimeType>
		</S.ResourceRow>
	)
}

export default McpResourceRow
