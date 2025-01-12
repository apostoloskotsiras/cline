import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import { memo } from "react"
import * as S from "../styles/themes/modern/dark/chat/Announcement.styles"

interface AnnouncementProps {
	version: string
	hideAnnouncement: () => void
}

const Announcement = ({ version, hideAnnouncement }: AnnouncementProps) => {
	const minorVersion = version.split(".").slice(0, 2).join(".") // 2.0.0 -> 2.0
	return (
		<S.Container>
			<S.CloseButton>
				<VSCodeButton appearance="icon" onClick={hideAnnouncement}>
					<span className="codicon codicon-close"></span>
				</VSCodeButton>
			</S.CloseButton>
			<S.Title>
				🎉{"  "}New in v{minorVersion}
			</S.Title>
			<S.List>
				<S.ListItem>
					<b>Checkpoints are here!</b> Cline now saves a snapshot of your workspace at each step of the task. Hover over
					any message to see two new buttons:
					<S.SubList>
						<S.ListItem>
							<span className="codicon codicon-diff-multiple"></span>
							<b>Compare</b> shows you a diff between the snapshot and your current workspace
						</S.ListItem>
						<S.ListItem>
							<span className="codicon codicon-discard"></span>
							<b>Restore</b> lets you revert your project's files back to that point in the task
						</S.ListItem>
					</S.SubList>
				</S.ListItem>
				<S.ListItem>
					<b>'See new changes' button</b> when a task is completed, showing you an overview of all the changes Cline
					made to your workspace throughout the task
				</S.ListItem>
			</S.List>
			<p style={{ margin: "8px 0" }}>
				<VSCodeLink href="https://x.com/sdrzn/status/1876378124126236949" style={{ display: "inline" }}>
					See a demo of Checkpoints here!
				</VSCodeLink>
			</p>
			<S.Divider />
			<S.FooterText>
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
