import styled from "styled-components"
import { ThemeMode } from "../../../../../../utils/theme"
import { getThemeColors } from "../../theme"

export const Container = styled.div<{ mode: ThemeMode }>`
  border-radius: 3px;
  background-color: ${({ mode }) => getThemeColors(mode).background};
  overflow: hidden;
  border: 1px solid ${({ mode }) => getThemeColors(mode).border};
`

export const Header = styled.div<{ isLoading?: boolean; mode: ThemeMode }>`
  color: ${({ mode }) => getThemeColors(mode).textSecondary};
  display: flex;
  align-items: center;
  padding: 9px 10px;
  cursor: ${props => props.isLoading ? "wait" : "pointer"};
  opacity: ${props => props.isLoading ? 0.7 : 1};
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  &:hover {
    background: ${({ mode }) => getThemeColors(mode).hover};
  }
`

export const HeaderContent = styled.div<{ mode: ThemeMode }>`
  display: flex;
  align-items: center;
`

export const HeaderIcon = styled.span<{ mode: ThemeMode }>`
  margin-right: 6px;
  color: ${({ mode }) => getThemeColors(mode).textSecondary};
`

export const HeaderText = styled.span<{ mode: ThemeMode }>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
  color: ${({ mode }) => getThemeColors(mode).textPrimary};
`

export const PathText = styled.span<{ mode: ThemeMode }>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
  direction: rtl;
  text-align: left;
  color: ${({ mode }) => getThemeColors(mode).textPrimary};
`

export const Spacer = styled.div`
  flex-grow: 1;
`

export const CodeBlockContainer = styled.div<{ mode: ThemeMode }>`
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
  background: ${({ mode }) => getThemeColors(mode).background};
` 