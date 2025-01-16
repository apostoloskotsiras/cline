import styled from 'styled-components'
import { ThemeMode } from '../../../../../../utils/theme'
import getThemeColors from '../../theme'

interface Props {
  mode: ThemeMode
}

export const PreviewWrapper = styled.div`
  flex-shrink: 0;
  padding: 8px 0;
`

export const HistoryPreviewItem = styled.div<Props>`
  background: ${props => getThemeColors(props.mode).secondary};
  margin: 12px 16px;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid ${props => getThemeColors(props.mode).border};
  cursor: pointer;
  transition: all 0.2s ease-out;

  &:hover {
    background: ${props => getThemeColors(props.mode).hover};
    border-color: ${props => getThemeColors(props.mode).primary};
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: transparent;
    transition: background-color 0.2s ease-out;
  }

  &:hover::before {
    background: ${props => getThemeColors(props.mode).primary};
  }
`

export const HistoryTitle = styled.div<Props>`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${props => getThemeColors(props.mode).textPrimary};
  margin: 16px 24px 8px;

  i {
    font-size: 16px;
    opacity: 0.9;
    color: ${props => getThemeColors(props.mode).primary};
  }

  span {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
`

export const HistoryMetadata = styled.div<Props>`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85em;
  opacity: 0.85;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${props => getThemeColors(props.mode).border};
`

export const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const MetadataLabel = styled.span<Props>`
  font-weight: 500;
  color: ${props => getThemeColors(props.mode).textSecondary};
`

export const MetadataValue = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const ViewAllButton = styled.button<Props>`
  margin: 8px auto;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 400;
  border-radius: 2px;
  background: ${props => getThemeColors(props.mode).chatView.button.secondaryBackground};
  border: 1px solid ${props => getThemeColors(props.mode).chatView.button.border};
  color: ${props => getThemeColors(props.mode).textPrimary};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s ease-out;
  min-width: 120px;
  justify-content: center;
  height: 24px;
  opacity: 0.9;

  &:hover {
    background: ${props => getThemeColors(props.mode).chatView.button.secondaryHover};
    opacity: 1;
  }

  &:active {
    background: ${props => getThemeColors(props.mode).chatView.button.secondaryBackground};
  }
`

export const TimestampText = styled.span<Props>`
  color: ${props => getThemeColors(props.mode).textSecondary};
  font-size: 0.85em;
  font-weight: 600;
  opacity: 0.9;
  letter-spacing: 0.3px;
`

export const TaskText = styled.div<Props>`
  font-size: 13px;
  color: ${props => getThemeColors(props.mode).textPrimary};
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-wrap;
  opacity: 0.95;
  margin: 8px 0;
` 