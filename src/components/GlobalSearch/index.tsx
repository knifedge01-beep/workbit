import { Box } from '@thedatablitz/box'
import { TextInput } from '@thedatablitz/text-input'

interface GlobalSearchProps {
  sidebarCollapsed: boolean
  profileRoute: boolean
}

export const GlobalSearch = ({
  sidebarCollapsed,
  profileRoute,
}: GlobalSearchProps) => {
  if (sidebarCollapsed && profileRoute) {
    return null
  }

  return (
    <Box padding="100">
      <TextInput
        placeholder="Search issues, projects, members..."
        variant="default"
        size="small"
        onChange={(e) => {
          console.log(e.target.value)
        }}
      />
    </Box>
  )
}
