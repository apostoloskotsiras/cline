import { McpTool } from "../../../../src/shared/mcp"
import * as S from "../styles/themes/modern/dark/mcp/McpToolRow.styles"

type McpToolRowProps = {
	tool: McpTool
}

const McpToolRow = ({ tool }: McpToolRowProps) => {
	return (
		<S.ToolRow key={tool.name}>
			<S.ToolHeader>
				<S.ToolIcon />
				<S.ToolName>{tool.name}</S.ToolName>
			</S.ToolHeader>
			{tool.description && (
				<S.ToolDescription>{tool.description}</S.ToolDescription>
			)}
			{tool.inputSchema &&
				"properties" in tool.inputSchema &&
				Object.keys(tool.inputSchema.properties as Record<string, any>).length > 0 && (
					<S.ParametersContainer>
						<S.ParametersHeader>Parameters</S.ParametersHeader>
						{Object.entries(tool.inputSchema.properties as Record<string, any>).map(([paramName, schema]) => {
							const isRequired =
								tool.inputSchema &&
								"required" in tool.inputSchema &&
								Array.isArray(tool.inputSchema.required) &&
								tool.inputSchema.required.includes(paramName)

							return (
								<S.ParameterRow key={paramName}>
									<S.ParameterCode>
										{paramName}
										{isRequired && <S.RequiredIndicator>*</S.RequiredIndicator>}
									</S.ParameterCode>
									<S.ParameterDescription>
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
