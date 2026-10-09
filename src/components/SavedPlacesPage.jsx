import { useEffect, useState } from 'react'
import { useSavedPlaces } from '../context/useSavedPlaces.js'
import { getPlaceImages } from '../services/placeImages.js'

function SavedPlacesPage({ places, onViewDetails }) {
  const { savedPlaceIds, toggleSavedPlace } = useSavedPlaces()
  const savedPlaces = savedPlaceIds
    .map((placeId) => places.find((place) => place.id === placeId))
    .filter(Boolean)
  const [placeImages, setPlaceImages] = useState({})
  const [expandedPlaceId, setExpandedPlaceId] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const placesWithoutImages = savedPlaces.filter(
      (place) => !place.image && placeImages[place.id] === undefined,
    )

    if (placesWithoutImages.length > 0) {
      Promise.all(
        placesWithoutImages.map(async (place) => {
          try {
            const images = await getPlaceImages(place, controller.signal)
            return [place.id, images[0]?.src ?? false]
          } catch (error) {
            if (!controller.signal.aborted) {
              console.warn(`Images could not be loaded for ${place.name}.`, error)
            }
            return [place.id, false]
          }
        }),
      ).then((loadedImages) => {
        if (!controller.signal.aborted) {
          setPlaceImages((currentImages) => ({
            ...currentImages,
            ...Object.fromEntries(loadedImages),
          }))
        }
      })
    }

    return () => controller.abort()
  }, [savedPlaces, placeImages])

  return (
    <section className="saved-places-page" aria-labelledby="saved-places-title">
      <p className="search-page__eyebrow">BharatExplore</p>
      <h1 id="saved-places-title">Saved Places</h1>
      <p className="saved-places-page__intro">Your favourite places, all in one place.</p>

      {savedPlaces.length > 0 ? (
        <ul className="saved-places-page__list">
          {savedPlaces.map((place) => {
            const image = place.image ?? placeImages[place.id]
            return (
              <li className="saved-places-page__item" key={place.id}>
                <article className="saved-place-card">
                  {typeof image === 'string' ? (
                    <img
                      className="saved-place-card__image"
                      src={image}
                      alt={place.imageAlt || place.name}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="saved-place-card__image saved-place-card__image--placeholder"
                      role="img"
                      aria-label={`No verified photo available for ${place.name}`}
                    >
                      Photo unavailable
                    </div>
                  )}
                  <div className="saved-place-card__content">
                    <div className="saved-place-card__heading">
                      <h2>{place.name}</h2>
                      <span aria-label={`Rating ${place.rating} out of 5`}>★ {place.rating}</span>
                    </div>
                    <p className="saved-place-card__location">{place.location}</p>
                    <div className="saved-place-card__actions">
                      {place.detailsPlaceId ? (
                        <button
                          className="search-page__details-button"
                          type="button"
                          onClick={() => onViewDetails(place.detailsPlaceId)}
                        >
                          View Details
                        </button>
                      ) : (
                        <button
                          className="search-page__details-button"
                          type="button"
                          aria-expanded={expandedPlaceId === place.id}
                          onClick={() => setExpandedPlaceId(
                            expandedPlaceId === place.id ? null : place.id,
                          )}
                        >
                          {expandedPlaceId === place.id ? 'Hide Details' : 'View Details'}
                        </button>
                      )}
                      <button
                        className="saved-place-card__unsave"
                        type="button"
                        onClick={() => toggleSavedPlace(place.id)}
                      >
                        Unsave
                      </button>
                    </div>
                    {expandedPlaceId === place.id && (
                      <p className="saved-place-card__description">{place.description}</p>
                    )}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="saved-places-page__empty" role="status">
          <span aria-hidden="true">♡</span>
          <h2>No saved places yet</h2>
          <p>Save a place while exploring and it will appear here.</p>
        </div>
      )}
    </section>
  )
}

export default SavedPlacesPage
