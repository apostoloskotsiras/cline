import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import { memo } from "react"
import { useThemeStyles } from "../../utils/theme"
import { useExtensionState } from "../../context/ExtensionStateContext"

interface AnnouncementProps {
	version: string
	hideAnnouncement: () => void
}

const Announcement = ({ version, hideAnnouncement }: AnnouncementProps) => {
	const minorVersion = version.split(".").slice(0, 2).join(".") // 2.0.0 -> 2.0
	const { themeMode, themeType } = useExtensionState()
	const S = useThemeStyles('chat/Announcement', themeMode || 'dark', themeType || 'modern')
	
	return (
		<S.Container mode={themeMode || 'dark'}>
			<S.CloseButton mode={themeMode || 'dark'}>
				<VSCodeButton appearance="icon" onClick={hideAnnouncement}>
					<span className="codicon codicon-close"></span>
				</VSCodeButton>
			</S.CloseButton>
			<S.Title mode={themeMode || 'dark'}>
				🎉{"  "}New in v{minorVersion}
			</S.Title>
			<S.List mode={themeMode || 'dark'}>
				<S.ListItem mode={themeMode || 'dark'}>
					<b>Checkpoints are here!</b> Cline now saves a snapshot of your workspace at each step of the task. Hover over
					any message to see two new buttons:
					<S.SubList>
						<S.ListItem mode={themeMode || 'dark'}>
							<span className="codicon codicon-diff-multiple"></span>
							<b>Compare</b> shows you a diff between the snapshot and your current workspace
						</S.ListItem>
						<S.ListItem mode={themeMode || 'dark'}>
							<span className="codicon codicon-discard"></span>
							<b>Restore</b> lets you revert your project's files back to that point in the task
						</S.ListItem>
					</S.SubList>
				</S.ListItem>
				<S.ListItem mode={themeMode || 'dark'}>
					<b>'See new changes' button</b> when a task is completed, showing you an overview of all the changes Cline
					made to your workspace throughout the task
				</S.ListItem>
			</S.List>
			<p style={{ margin: "8px 0" }}>
				<VSCodeLink href="https://x.com/sdrzn/status/1876378124126236949" style={{ display: "inline" }}>
					See a demo of Checkpoints here!
				</VSCodeLink>
			</p>
			<S.Divider mode={themeMode || 'dark'} />
			<S.FooterText mode={themeMode || 'dark'}>
				Join
				<VSCodeLink style={{ display: "inline" }} href="https://discord.gg/cline">
					discord.gg/cline
				</VSCodeLink>
				for more updates!
			</S.FooterText>
		</S.Container>
	)
}

export default memo(Announcement)
