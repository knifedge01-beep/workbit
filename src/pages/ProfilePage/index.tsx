import { useSearchParams } from 'react-router-dom'
import { Box } from '@thedatablitz/box'
import { Stack } from '@thedatablitz/stack'
import { Text } from '@thedatablitz/text'
import { ApiKeysTab } from '../../components'
import type { TabId } from './types'

export function ProfilePage() {
  const [searchParams] = useSearchParams()
  const activeTab: TabId =
    searchParams.get('tab') === 'profile' ? 'profile' : 'api-keys'

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Stack gap="100" padding="100">
        <Stack gap="050">
          <Text variant="heading1">Profile settings</Text>
          <Text variant="body3" color="color.text.subtle">
            Manage your personal account and developer access from the sidebar.
          </Text>
        </Stack>
        <div
          style={{
            borderTop: '1px solid var(--db-color-border-default)',
          }}
        />
        {activeTab === 'profile' && (
          <Box padding="100">
            <Text>Profile settings can go here.</Text>
          </Box>
        )}
        {activeTab === 'api-keys' && <ApiKeysTab />}
      </Stack>
    </div>
  )
}
