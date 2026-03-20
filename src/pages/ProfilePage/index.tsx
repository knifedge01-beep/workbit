import { useSearchParams } from 'react-router-dom'
import { Avatar } from '@thedatablitz/avatar'
import { Box } from '@thedatablitz/box'
import { Inline } from '@thedatablitz/inline'
import { Stack } from '@thedatablitz/stack'
import { Text } from '@thedatablitz/text'
import { ApiKeysTab } from '../../components'
import type { TabId } from './types'

export function ProfilePage() {
  const [searchParams] = useSearchParams()
  const activeTab: TabId =
    searchParams.get('tab') === 'profile' ? 'profile' : 'api-keys'

  return (
    <Box fullWidth>
      <Stack gap="200" padding="200" fullWidth>
        <Stack gap="100" padding="200" fullWidth>
          <Inline align="center" gap="100">
            <Avatar name="WB" size="large" variant="brand" />
            <Stack gap="025" fullWidth>
              <Text variant="heading2">Profile settings</Text>
              <Text variant="body3" color="color.text.subtle">
                Manage your personal account and developer access from the
                sidebar.
              </Text>
            </Stack>
          </Inline>
        </Stack>

        {activeTab === 'api-keys' && <ApiKeysTab />}
      </Stack>
    </Box>
  )
}
