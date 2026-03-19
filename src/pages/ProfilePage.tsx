import { Container, Heading, Text } from '@design-system'
import { useSearchParams } from 'react-router-dom'
import { ApiKeysTab } from '../components'

type TabId = 'profile' | 'api-keys'

export function ProfilePage() {
  const [searchParams] = useSearchParams()
  const activeTab: TabId =
    searchParams.get('tab') === 'profile' ? 'profile' : 'api-keys'

  return (
    <Container maxWidth="800px">
      <div style={{ marginBottom: 12 }}>
        <Heading level={1}>Profile settings</Heading>
        <Text muted>
          Manage your personal account and developer access from the sidebar.
        </Text>
      </div>
      <div
        style={{
          marginBottom: 12,
          borderTop: '1px solid var(--color-border, #eee)',
        }}
      />
      {activeTab === 'profile' && (
        <div style={{ padding: 16 }}>
          <Text>Profile settings can go here.</Text>
        </div>
      )}
      {activeTab === 'api-keys' && <ApiKeysTab />}
    </Container>
  )
}
