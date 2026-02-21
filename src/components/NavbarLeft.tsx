import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Plus, Bell } from 'lucide-react'
import { IconButton, Input } from '@design-system'
import { TeamDropdown } from './TeamDropdown'
import type { Team } from '../constants'

type Props = {
  teams: Team[]
  selectedTeam: Team
}

export function NavbarLeft({ teams, selectedTeam }: Props) {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <>
      <TeamDropdown teams={teams} selectedTeam={selectedTeam} />
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <Input
              placeholder="Search..."
              style={{ width: '100%' }}
              autoFocus
              onBlur={() => setShowSearch(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <IconButton aria-label="Search" onClick={() => setShowSearch((s) => !s)}>
        <Search size={18} />
      </IconButton>
      <IconButton aria-label="Create new">
        <Plus size={18} />
      </IconButton>
    </>
  )
}

export function NavbarRight() {
  return (
    <IconButton aria-label="Notifications">
      <Bell size={18} />
    </IconButton>
  )
}
