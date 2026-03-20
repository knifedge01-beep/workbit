import { useCallback, useMemo, useState } from 'react'
import { Check, Copy, Plus, ShieldAlert, Trash2 } from 'lucide-react'

import {
  Alert,
  Badge,
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  Skeleton,
  Text,
} from '@design-system'

import { useApiKeys, type CreateKeyResponse } from '../../hooks/useApiKeys'
import { logError } from '../../utils/errorHandling'
import { formatDateTime, formatRelativeTime } from '../../utils/format'
import {
  ActionsWrap,
  ActiveHeader,
  ControlsRow,
  CreateControls,
  CreateInputWrap,
  DangerButton,
  Divider,
  HeaderBlock,
  KeyItem,
  KeyItemGrid,
  KeyMetaGrid,
  KeyRevealPanel,
  KeysList,
  MonospaceKey,
  SearchWrap,
  Section,
  SecurityHint,
} from './styles'
import type { KeyRow } from './types'
import {
  badgeColorForEnvironment,
  copyLabel,
  filterKeyRows,
  maskForPreview,
  toKeyRows,
} from './utils/helpers'

export function ApiKeysTab() {
  const { keys, loading, error, createKey, deleteKey } = useApiKeys()
  const [nameInput, setNameInput] = useState('')
  const [createdKey, setCreatedKey] = useState<CreateKeyResponse | null>(null)
  const [creating, setCreating] = useState(false)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [revokeCandidate, setRevokeCandidate] = useState<KeyRow | null>(null)
  const [query, setQuery] = useState('')
  const [revealCreatedKey, setRevealCreatedKey] = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)

  const clearCopiedState = useCallback(() => {
    window.setTimeout(() => {
      setCopiedToken(null)
    }, 1400)
  }, [])

  const handleCreate = useCallback(async () => {
    if (creating) return
    setCreating(true)
    setCreatedKey(null)
    setMutationError(null)
    setSuccessMessage(null)
    try {
      const created = await createKey(nameInput.trim() || undefined)
      setCreatedKey(created)
      setRevealCreatedKey(false)
      setNameInput('')
      setSuccessMessage(
        'New API key created. Copy it now because it will not be shown again.'
      )
    } catch (e) {
      logError(e, 'ApiKeysTab.createKey')
      setMutationError((e as Error).message)
    } finally {
      setCreating(false)
    }
  }, [createKey, creating, nameInput])

  const handleCopy = useCallback(
    async (text: string, token: string, label: string) => {
      setMutationError(null)
      setSuccessMessage(null)
      try {
        await navigator.clipboard.writeText(text)
        setCopiedToken(token)
        setSuccessMessage(`${label} copied to clipboard.`)
        clearCopiedState()
      } catch (e) {
        logError(e, 'ApiKeysTab.copyKey')
        setMutationError('Could not copy to clipboard. Please copy manually.')
      }
    },
    [clearCopiedState]
  )

  const handleOpenRevoke = useCallback((row: KeyRow) => {
    setRevokeCandidate(row)
    setMutationError(null)
    setSuccessMessage(null)
  }, [])

  const handleCloseRevoke = useCallback(() => {
    if (revokingId != null) return
    setRevokeCandidate(null)
  }, [revokingId])

  const handleConfirmRevoke = useCallback(async () => {
    if (!revokeCandidate || revokingId != null) return
    setRevokingId(revokeCandidate.id)
    setMutationError(null)
    setSuccessMessage(null)
    try {
      await deleteKey(revokeCandidate.id)
      setSuccessMessage('API key revoked successfully.')
      setRevokeCandidate(null)
    } catch (e) {
      logError(e, 'ApiKeysTab.revokeKey')
      setMutationError((e as Error).message)
    } finally {
      setRevokingId(null)
    }
  }, [deleteKey, revokeCandidate, revokingId])

  const keyRows: KeyRow[] = useMemo(
    () => toKeyRows(keys, revokingId),
    [keys, revokingId]
  )

  const filteredRows = useMemo(
    () => filterKeyRows(keyRows, query),
    [keyRows, query]
  )

  return (
    <>
      <Section>
        <HeaderBlock>
          <div>
            <Heading level={3}>API access keys</Heading>
            <Text size="sm" muted>
              Manage machine credentials for Workbit APIs. Treat these keys like
              passwords.
            </Text>
          </div>
        </HeaderBlock>

        <ControlsRow>
          <CreateControls>
            <CreateInputWrap>
              <Input
                value={nameInput}
                placeholder="Optional name, e.g. CI deploy key"
                onChange={(e) => setNameInput(e.target.value)}
                aria-label="API key name"
              />
            </CreateInputWrap>
            <Button
              onClick={handleCreate}
              disabled={creating}
              aria-label="Create API key"
            >
              <Plus size={15} />
              {creating ? 'Creating key...' : 'Create API key'}
            </Button>
          </CreateControls>

          <SearchWrap>
            <Input
              type="search"
              placeholder="Search by name or key prefix"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search API keys"
            />
          </SearchWrap>
        </ControlsRow>

        <SecurityHint>
          <Flex gap={2} align="center">
            <ShieldAlert size={16} />
            <Text size="sm">
              For security, full keys are visible only once when created.
            </Text>
          </Flex>
        </SecurityHint>

        {(error || mutationError) && (
          <div style={{ marginTop: 8 }}>
            <Alert variant="error">{error ?? mutationError}</Alert>
          </div>
        )}

        {successMessage && (
          <div style={{ marginTop: 8 }}>
            <Alert variant="success">{successMessage}</Alert>
          </div>
        )}

        {createdKey && (
          <KeyRevealPanel>
            <Text as="div" size="sm">
              <strong>New key ready.</strong> Copy it now. You will not be able
              to see it again.
            </Text>
            <MonospaceKey>
              {revealCreatedKey
                ? createdKey.key
                : maskForPreview(createdKey.key)}
            </MonospaceKey>
            <Flex gap={2} wrap>
              <Button
                size="sm"
                onClick={() =>
                  handleCopy(createdKey.key, `full:${createdKey.id}`, 'API key')
                }
              >
                {copiedToken === `full:${createdKey.id}` ? (
                  <Check size={14} />
                ) : (
                  <Copy size={14} />
                )}
                {copyLabel(copiedToken, `full:${createdKey.id}`, 'Copy key')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setRevealCreatedKey((v) => !v)}
              >
                {revealCreatedKey ? 'Hide key' : 'Show key'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCreatedKey(null)}
              >
                Dismiss
              </Button>
            </Flex>
          </KeyRevealPanel>
        )}

        <Divider />

        <ActiveHeader>
          <div>
            <Heading level={4}>Active keys</Heading>
            <Text size="sm" muted>
              {filteredRows.length} {filteredRows.length === 1 ? 'key' : 'keys'}
            </Text>
          </div>
        </ActiveHeader>

        {loading ? (
          <KeysList>
            <Skeleton height="72px" />
            <Skeleton height="72px" />
            <Skeleton height="72px" />
          </KeysList>
        ) : filteredRows.length === 0 ? (
          <KeyItem>
            <Text>
              No API keys found. Create one to start authenticating your
              integrations.
            </Text>
          </KeyItem>
        ) : (
          <KeysList>
            {filteredRows.map((row) => {
              const lastUsed = row.last_used_at
                ? `${formatRelativeTime(row.last_used_at)} (${formatDateTime(row.last_used_at)})`
                : 'Never used'
              const permissions =
                row.permissions && row.permissions.length > 0
                  ? row.permissions
                  : ['Full access']
              const environment = row.environment ?? 'Live'

              return (
                <KeyItem
                  key={row.id}
                  aria-label={`API key ${row.name ?? row.id}`}
                >
                  <KeyItemGrid>
                    <div>
                      <Text as="div" size="sm" muted>
                        Key name
                      </Text>
                      <Text as="div" size="md">
                        {row.name?.trim() || 'Untitled key'}
                      </Text>
                    </div>

                    <div>
                      <Text as="div" size="sm" muted>
                        Key preview
                      </Text>
                      <MonospaceKey
                        style={{ margin: '4px 0 0', padding: '8px 10px' }}
                      >
                        {row.masked_key}
                      </MonospaceKey>
                    </div>

                    <div>
                      <Text as="div" size="sm" muted>
                        Created on
                      </Text>
                      <Text as="div" size="sm">
                        {formatDateTime(row.created_at)}
                      </Text>
                      <Text as="div" size="sm" muted>
                        Last used: {lastUsed}
                      </Text>
                    </div>

                    <ActionsWrap>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleCopy(
                            row.masked_key,
                            `masked:${row.id}`,
                            'Masked key preview'
                          )
                        }
                        aria-label={`Copy masked key for ${row.name ?? row.id}`}
                      >
                        {copiedToken === `masked:${row.id}` ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                        {copyLabel(
                          copiedToken,
                          `masked:${row.id}`,
                          'Copy preview'
                        )}
                      </Button>
                      <DangerButton
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenRevoke(row)}
                        disabled={row.revoking}
                        aria-label={`Revoke key ${row.name ?? row.id}`}
                      >
                        <Trash2 size={14} />
                        {row.revoking ? 'Revoking...' : 'Revoke key'}
                      </DangerButton>
                    </ActionsWrap>
                  </KeyItemGrid>

                  <KeyMetaGrid>
                    <Badge
                      variant="light"
                      color={badgeColorForEnvironment(environment)}
                      size="small"
                    >
                      {environment}
                    </Badge>
                    {permissions.map((permission) => (
                      <Badge
                        key={`${row.id}-${permission}`}
                        variant="light"
                        color="grey"
                        size="small"
                      >
                        {permission}
                      </Badge>
                    ))}
                  </KeyMetaGrid>
                </KeyItem>
              )
            })}
          </KeysList>
        )}
      </Section>

      <Modal
        open={revokeCandidate != null}
        onClose={handleCloseRevoke}
        title="Revoke API key"
        variant="destructive"
        primaryLabel={revokingId ? 'Revoking...' : 'Revoke key'}
        onPrimary={handleConfirmRevoke}
        secondaryLabel="Cancel"
        onSecondary={handleCloseRevoke}
      >
        <Text>
          This action cannot be undone. Any integration using this key will lose
          access immediately.
        </Text>
        <div style={{ marginTop: 10 }}>
          <Text as="div" size="sm" muted>
            Key name
          </Text>
          <Text as="div">
            {revokeCandidate?.name?.trim() || 'Untitled key'}
          </Text>
          <Text as="div" size="sm" muted>
            Key preview
          </Text>
          <MonospaceKey style={{ marginTop: 4, marginBottom: 0 }}>
            {revokeCandidate?.masked_key ?? ''}
          </MonospaceKey>
        </div>
      </Modal>
    </>
  )
}
