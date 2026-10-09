import { useContext } from 'react'
import { SavedPlacesContext } from './SavedPlacesContext.js'

export function useSavedPlaces() {
  const context = useContext(SavedPlacesContext)
  if (!context) {
    throw new Error('useSavedPlaces must be used inside a SavedPlacesProvider.')
  }
  return context
}
