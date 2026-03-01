import { useState } from 'react'
import { Container, Heading, Text, Flex, Button } from '@design-system'
import { ApiKeysTab } from '../components'

type TabId = 'profile' | 'api-keys'

const TABS: { id: TabId; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'api-keys', label: 'API keys' },
]

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>('api-keys')

  return (
    <Container maxWidth="800px">
      <Heading level={1}>Profile</Heading>
      <div
        style={{
          borderBottom: '1px solid var(--color-border, #eee)',
          marginBottom: 24,
        }}
      >
        <Flex gap={4}>
          {TABS.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'secondary'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </Flex>
      </div>
      {activeTab === 'profile' && (
        <div style={{ padding: 16 }}>
          <Text>Profile settings can go here.</Text>
        </div>
      )}
      {activeTab === 'api-keys' && <ApiKeysTab />}
    </Container>
  )
}
