import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import {
  fetchTeamMembers,
  patchProject,
  type ApiProjectProperties,
  type ApiTeamMember,
} from '../../../api/client'
import { logError } from '../../../utils/errorHandling'

type UseProjectPeoplePropertiesParams = {
  teamId?: string
  setProperties: Dispatch<SetStateAction<ApiProjectProperties | null>>
}

type UseProjectPeoplePropertiesResult = {
  teamMembers: ApiTeamMember[]
  handleLeadChange: (leadId?: string) => void
  handleMemberIdsChange: (memberIds: string[]) => void
}

export function useProjectPeopleProperties({
  teamId,
  setProperties,
}: UseProjectPeoplePropertiesParams): UseProjectPeoplePropertiesResult {
  const [teamMembers, setTeamMembers] = useState<ApiTeamMember[]>([])

  useEffect(() => {
    if (!teamId) {
      setTeamMembers([])
      return
    }
    fetchTeamMembers(teamId)
      .then((members) => setTeamMembers(members))
      .catch((e) => {
        logError(e, 'TeamProjectDetail.fetchTeamMembers')
        setTeamMembers([])
      })
  }, [teamId])

  const handleLeadChange = (leadId?: string) => {
    if (!teamId) return
    setProperties((prev) => (prev ? { ...prev, leadId } : { leadId }))
    void patchProject(teamId, { leadId }).catch((e) =>
      logError(e, 'TeamProjectDetail.updateLead')
    )
  }

  const handleMemberIdsChange = (memberIds: string[]) => {
    if (!teamId) return
    setProperties((prev) => (prev ? { ...prev, memberIds } : { memberIds }))
    void patchProject(teamId, { memberIds }).catch((e) =>
      logError(e, 'TeamProjectDetail.updateMemberIds')
    )
  }

  return {
    teamMembers,
    handleLeadChange,
    handleMemberIdsChange,
  }
}
