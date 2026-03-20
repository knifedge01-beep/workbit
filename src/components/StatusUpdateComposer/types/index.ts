import type { ProjectStatus } from '../../../constants/projectStatus'

export type StatusUpdateComposerProps = {
  status?: ProjectStatus
  onStatusChange?: (status: ProjectStatus) => void
  placeholder?: string
  onPost?: (content: string, status: ProjectStatus) => void
  onCancel?: () => void
  onChooseFile?: () => void
  onCreateDocument?: () => void
  onAddLink?: () => void
  className?: string
}
