import { useEffect, useMemo, useState } from 'react'
import { SavedPlacesContext } from './SavedPlacesContext.js'

const STORAGE_KEY = 'bharat-explore-saved-place-ids'

function readSavedPlaceIds(validPlaceIds) {
  try {
    const savedValue = window.localStorage.getItem(STORAGE_KEY)
    if (!savedValue) {
      return []
    }

    const parsedValue = JSON.parse(savedValue)
    if (!Array.isArray(parsedValue)) {
      return []
    }

    return [...new Set(parsedValue.filter(
      (placeId) => typeof placeId === 'string' && validPlaceIds.has(placeId),
    ))]
  } catch (error) {
    console.warn('Saved places could not be loaded from localStorage.', error)
    return []
  }
}

function writeSavedPlaceIds(placeIds) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(placeIds))
  } catch (error) {
    console.warn('Saved places could not be stored in localStorage.', error)
  }
}

export function SavedPlacesProvider({ children, validPlaceIds }) {
  const [savedPlaceIds, setSavedPlaceIds] = useState(() =>
    readSavedPlaceIds(validPlaceIds),
  )

  useEffect(() => {
    writeSavedPlaceIds(savedPlaceIds)
  }, [savedPlaceIds])

  useEffect(() => {
    function syncSavedPlaceIds(event) {
      if (event.key === STORAGE_KEY) {
        setSavedPlaceIds(readSavedPlaceIds(validPlaceIds))
      }
    }

    window.addEventListener('storage', syncSavedPlaceIds)
    return () => window.removeEventListener('storage', syncSavedPlaceIds)
  }, [validPlaceIds])

  const value = useMemo(() => {
    function toggleSavedPlace(placeId) {
      if (!validPlaceIds.has(placeId)) {
        return
      }

      setSavedPlaceIds((currentIds) =>
        currentIds.includes(placeId)
          ? currentIds.filter((savedId) => savedId !== placeId)
          : [...currentIds, placeId],
      )
    }

    return {
      savedPlaceIds,
      isPlaceSaved: (placeId) => savedPlaceIds.includes(placeId),
      toggleSavedPlace,
    }
  }, [savedPlaceIds, validPlaceIds])

  return (
    <SavedPlacesContext.Provider value={value}>
      {children}
    </SavedPlacesContext.Provider>
  )
}
