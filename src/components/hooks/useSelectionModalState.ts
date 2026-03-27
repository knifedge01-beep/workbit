import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

type UseSelectionModalStateResult<T> = {
  open: boolean
  draftValue: T
  setDraftValue: Dispatch<SetStateAction<T>>
  openPicker: () => void
  closePicker: () => void
  savePicker: () => void
}

export function useSelectionModalState<T>(
  value: T,
  onSave: (nextValue: T) => void
): UseSelectionModalStateResult<T> {
  const [open, setOpen] = useState(false)
  const [draftValue, setDraftValue] = useState<T>(value)

  useEffect(() => {
    if (!open) setDraftValue(value)
  }, [value, open])

  const openPicker = () => {
    setDraftValue(value)
    setOpen(true)
  }

  const closePicker = () => setOpen(false)

  const savePicker = () => {
    onSave(draftValue)
    setOpen(false)
  }

  return {
    open,
    draftValue,
    setDraftValue,
    openPicker,
    closePicker,
    savePicker,
  }
}
