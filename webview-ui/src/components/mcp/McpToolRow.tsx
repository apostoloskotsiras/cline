import { McpTool } from "../../../../src/shared/mcp"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { useThemeStyles } from "../../utils/theme"

type McpToolRowProps = {
	tool: McpTool
}

const McpToolRow = ({ tool }: McpToolRowProps) => {
	const { themeMode, themeType } = useExtensionState()
	const S = useThemeStyles('mcp/McpToolRow', themeMode || 'dark', themeType || 'modern')

	return (
		<S.ToolRow mode={themeMode || 'dark'} key={tool.name}>
			<S.ToolHeader mode={themeMode || 'dark'}>
				<S.ToolIcon mode={themeMode || 'dark'} />
				<S.ToolName mode={themeMode || 'dark'}>{tool.name}</S.ToolName>
			</S.ToolHeader>
			{tool.description && (
				<S.ToolDescription mode={themeMode || 'dark'}>{tool.description}</S.ToolDescription>
			)}
			{tool.inputSchema &&
				"properties" in tool.inputSchema &&
				Object.keys(tool.inputSchema.properties as Record<string, any>).length > 0 && (
					<S.ParametersContainer mode={themeMode || 'dark'}>
						<S.ParametersHeader mode={themeMode || 'dark'}>Parameters</S.ParametersHeader>
						{Object.entries(tool.inputSchema.properties as Record<string, any>).map(([paramName, schema]) => {
							const isRequired =
								tool.inputSchema &&
								"required" in tool.inputSchema &&
								Array.isArray(tool.inputSchema.required) &&
								tool.inputSchema.required.includes(paramName)

							return (
								<S.ParameterRow mode={themeMode || 'dark'} key={paramName}>
									<S.ParameterCode mode={themeMode || 'dark'}>
										{paramName}
										{isRequired && <S.RequiredIndicator mode={themeMode || 'dark'}>*</S.RequiredIndicator>}
									</S.ParameterCode>
									<S.ParameterDescription mode={themeMode || 'dark'}>
										{schema.description || "No description"}
									</S.ParameterDescription>
								</S.ParameterRow>
							)
						})}
					</S.ParametersContainer>
				)}
		</S.ToolRow>
	)
}

export default McpToolRow
