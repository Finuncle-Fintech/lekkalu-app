import { useState, useCallback } from 'react'

const useToggle = (initialValue: boolean = false) => {
  const [isOpen, setIsOpen] = useState<boolean>(initialValue)

  const toggleModal = useCallback(() => {
    setIsOpen((prevValue) => !prevValue)
  }, [])

  const openModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const setModalOpen = useCallback((val: boolean) => {
    setIsOpen(val)
  }, [])

  return {
    isOpen,
    toggleModal,
    openModal,
    closeModal,
    setModalOpen,
  }
}

export default useToggle
