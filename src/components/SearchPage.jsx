import { useCallback, useEffect, useRef, useState } from 'react'
import touristPlaces from '../data/touristPlaces.js'
import { getDirections } from '../services/directions.js'
import { getPlaceImages } from '../services/placeImages.js'
import { useSavedPlaces } from '../context/useSavedPlaces.js'

const categories = [
  'All',
  'Heritage',
  'Nature',
  'Spiritual',
  'Beach',
  'Landmark',
  'Entertainment',
]

function calculateDistanceKm(origin, destination) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180
  const latitudeDifference = toRadians(destination.latitude - origin.latitude)
  const longitudeDifference = toRadians(destination.longitude - origin.longitude)
  const originLatitude = toRadians(origin.latitude)
  const destinationLatitude = toRadians(destination.latitude)
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.sin(longitudeDifference / 2) ** 2

  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(haversine)))
}

function SearchPage({
  locationStatus = 'idle',
  coordinates = null,
  detectedLocation = '',
  locationError = '',
  onUseMyLocation,
  onResetLocation,
  initialPlaceId = null,
  onInitialPlaceHandled,
}) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [placeImages, setPlaceImages] = useState([])
  const [imageStatus, setImageStatus] = useState('idle')
  const [failedImageUrls, setFailedImageUrls] = useState([])
  const [routeStatus, setRouteStatus] = useState('idle')
  const [travelOptions, setTravelOptions] = useState({})
  const [routeOrigin, setRouteOrigin] = useState(null)
  const [routeError, setRouteError] = useState('')
  const routeRequest = useRef(null)
  const routeRequestId = useRef(0)
  const { isPlaceSaved, toggleSavedPlace } = useSavedPlaces()
  const normalizedQuery = query.trim().toLowerCase()
  const matchingPlaces = touristPlaces.filter((place) => {
    const matchesSearch = `${place.name} ${place.city} ${place.state}`
      .toLowerCase()
      .includes(normalizedQuery)
    const matchesCategory =
      activeCategory === 'All' || place.category === activeCategory
    return matchesSearch && matchesCategory
  })
  const placesToDisplay = coordinates
    ? matchingPlaces
        .map((place) => ({
          ...place,
          distanceKm: calculateDistanceKm(coordinates, place),
        }))
        .sort((first, second) => first.distanceKm - second.distanceKm)
        .slice(0, 5)
    : matchingPlaces
  const hasActiveFilters =
    Boolean(normalizedQuery) ||
    activeCategory !== 'All' ||
    Boolean(coordinates) ||
    locationStatus !== 'idle' ||
    Boolean(locationError)

  function resetFilters() {
    setQuery('')
    setActiveCategory('All')
    onResetLocation?.()
    selectPlace(null)
  }

  const loadTravelOptions = useCallback(async (place, request) => {
    let origin = coordinates

    if (!origin) {
      if (!navigator.geolocation) {
        setRouteStatus('error')
        setRouteError('Location is not available in this browser.')
        return
      }

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            maximumAge: 60_000,
            timeout: 15_000,
          })
        })
        origin = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      } catch (error) {
        if (request.controller.signal.aborted || request.id !== routeRequestId.current) {
          return
        }
        setRouteStatus('error')
        if (error.code === 1) {
          setRouteError('Location permission was denied. Allow access in your browser settings and try again.')
        } else if (error.code === 2) {
          setRouteError('Your location could not be determined. Please try again.')
        } else if (error.code === 3) {
          setRouteError('Finding your location took too long. Please try again.')
        } else {
          setRouteError('We could not get your location. Please try again.')
        }
        return
      }
    }

    if (request.controller.signal.aborted || request.id !== routeRequestId.current) {
      return
    }

    setRouteOrigin(origin)
    const results = await Promise.allSettled(
      ['driving', 'walking'].map((mode) =>
        getDirections(origin, place, mode, request.controller.signal),
      ),
    )

    if (request.controller.signal.aborted || request.id !== routeRequestId.current) {
      return
    }

    const options = {}
    results.forEach((result, index) => {
      const mode = index === 0 ? 'driving' : 'walking'
      options[mode] =
        result.status === 'fulfilled'
          ? { ...result.value, status: 'ready' }
          : { status: 'error' }
    })
    setTravelOptions(options)

    if (results.some((result) => result.status === 'fulfilled')) {
      setRouteStatus('ready')
    } else {
      setRouteStatus('error')
      setRouteError('Travel times are unavailable right now. You can still open Google Maps directions.')
    }
  }, [coordinates])

  const selectPlace = useCallback((place) => {
    routeRequest.current?.controller.abort()
    const request = {
      id: routeRequestId.current + 1,
      controller: new AbortController(),
    }
    routeRequestId.current = request.id
    routeRequest.current = request
    setSelectedPlace(place)
    setActiveImage(0)
    setPlaceImages([])
    setImageStatus(place ? 'loading' : 'idle')
    setFailedImageUrls([])
    setRouteStatus('loading')
    setTravelOptions({})
    setRouteOrigin(coordinates)
    setRouteError('')
    if (place) {
      getPlaceImages(place, request.controller.signal)
        .then((images) => {
          if (request.controller.signal.aborted || request.id !== routeRequestId.current) {
            return
          }
          setPlaceImages(images)
          setImageStatus(images.length > 0 ? 'ready' : 'empty')
        })
        .catch(() => {
          if (request.controller.signal.aborted || request.id !== routeRequestId.current) {
            return
          }
          setImageStatus('empty')
        })
      loadTravelOptions(place, request)
    } else {
      request.controller.abort()
      setRouteStatus('idle')
      setRouteOrigin(null)
    }
  }, [coordinates, loadTravelOptions])

  useEffect(() => {
    if (!initialPlaceId) {
      return
    }

    const requestedPlace = touristPlaces.find((place) => place.id === initialPlaceId)
    if (requestedPlace) {
      selectPlace(requestedPlace)
    }
    onInitialPlaceHandled?.()
  }, [initialPlaceId, onInitialPlaceHandled, selectPlace])

  function handleGetDirections() {
    if (!selectedPlace || !routeOrigin) {
      return
    }
    const parameters = new URLSearchParams({
      api: '1',
      origin: `${routeOrigin.latitude},${routeOrigin.longitude}`,
      destination: `${selectedPlace.latitude},${selectedPlace.longitude}`,
      travelmode: 'driving',
    })
    window.location.assign(`https://www.google.com/maps/dir/?${parameters}`)
  }

  useEffect(
    () => () => routeRequest.current?.controller.abort(),
    [],
  )

  function formatDuration(durationSeconds) {
    const durationMinutes = Math.max(1, Math.ceil(durationSeconds / 60))
    if (durationMinutes < 60) {
      return `${durationMinutes} min`
    }
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60
    return minutes === 0 ? `${hours} hr` : `${hours} hr ${minutes} min`
  }

  const availableImages = placeImages.filter(
    (image) => !failedImageUrls.includes(image.src),
  )
  const selectedImage = availableImages[activeImage] ?? availableImages[0]

  function markImageUnavailable(src) {
    setFailedImageUrls((current) =>
      current.includes(src) ? current : [...current, src],
    )
  }

  return (
    <section className="search-page" id="search" aria-labelledby="search-page-title">
      <header className="search-page__header">
        <p className="search-page__eyebrow">Explore India</p>
        <h1 id="search-page-title">Find your next destination</h1>
        <p className="search-page__intro">
          Thoughtful places, local favourites, and a little inspiration for the road ahead.
        </p>
        <div className="search-page__search-row">
          <label className="search-page__search">
            <span className="visually-hidden">Search places</span>
            <input
              type="search"
              placeholder="Search by place, city, or state"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button
            className="search-page__location-button"
            type="button"
            onClick={onUseMyLocation}
            disabled={locationStatus === 'loading'}
          >
            {locationStatus === 'loading' ? 'Detecting location…' : 'Use My Location'}
          </button>
        </div>
        {locationStatus === 'success' && coordinates && (
          <p className="search-page__location-status" role="status">
            <span className="search-page__location-dot" aria-hidden="true" />
            Showing places near {detectedLocation}
          </p>
        )}
        {locationStatus === 'error' && (
          <p className="search-page__location-error" role="alert">{locationError}</p>
        )}
        <div className="search-page__filter-row">
          <div className="search-page__filters" role="group" aria-label="Filter places by category">
            {categories.map((category) => (
              <button
                className={`search-page__filter${activeCategory === category ? ' is-active' : ''}`}
                key={category}
                type="button"
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
            <button
              className="search-page__reset"
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
            >
              Reset filters
            </button>
          </div>
        </div>
      </header>

      <section className="search-page__results" aria-label="Search results" aria-live="polite">
          <div className="search-page__results-heading">
            <div>
              <h2>Places to explore</h2>
              <p>{coordinates ? 'A little closer to where you are.' : 'Find a place that feels like your kind of somewhere.'}</p>
            </div>
            <div className="search-page__results-actions">
              <span aria-label={`${placesToDisplay.length} places shown`}>{placesToDisplay.length} places</span>
              <button
                className="search-page__add-place"
                type="button"
                disabled
                title="Adding places will be available soon"
              >
                <span aria-hidden="true">+</span> Add a Place
              </button>
            </div>
          </div>
          {selectedPlace ? (
            <section className="place-details" aria-labelledby="place-details-title">
              <button
                className="place-details__back"
                type="button"
                onClick={() => selectPlace(null)}
              >
                Back to places
              </button>
              <div className="place-details__layout">
                <div className="place-details__visuals">
                  {selectedImage ? (
                    <img
                      className="place-details__image"
                      src={selectedImage.src}
                      alt={selectedImage.alt}
                      onError={() => markImageUnavailable(selectedImage.src)}
                    />
                  ) : (
                    <div
                      className="place-details__image place-details__image--placeholder"
                      role="img"
                      aria-label={
                        imageStatus === 'loading'
                          ? `Finding verified ${selectedPlace.name} photos`
                          : `No verified photos available for ${selectedPlace.name}`
                      }
                    >
                      {imageStatus === 'loading'
                        ? 'Finding verified photos…'
                        : 'No verified photos available'}
                    </div>
                  )}
                  {availableImages.length > 1 && (
                    <div className="place-details__gallery" role="group" aria-label={`${selectedPlace.name} photos`}>
                      {availableImages.map((image, index) => (
                        <button
                          className={`place-details__thumbnail${activeImage === index ? ' is-active' : ''}`}
                          type="button"
                          key={image.canonicalUrl}
                          onClick={() => setActiveImage(index)}
                          aria-label={`Show photo ${index + 1} of ${selectedPlace.name}`}
                          aria-pressed={activeImage === index}
                        >
                          <img
                            src={image.src}
                            alt=""
                            loading="lazy"
                            onError={() => markImageUnavailable(image.src)}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedImage && (
                    <p className="place-details__photo-credit">
                      <a href={selectedImage.descriptionUrl} target="_blank" rel="noreferrer">
                        Photo: {selectedImage.credit || selectedImage.alt}
                      </a>
                      {selectedImage.license && selectedImage.licenseUrl && (
                        <>
                          {' · '}
                          <a href={selectedImage.licenseUrl} target="_blank" rel="noreferrer">
                            {selectedImage.license}
                          </a>
                        </>
                      )}
                    </p>
                  )}
                </div>
                <div className="place-details__content">
                  <span className="search-page__place-category">{selectedPlace.category}</span>
                  <div className="search-page__place-heading">
                    <h3 id="place-details-title">{selectedPlace.name}</h3>
                    <span aria-label={`Rating ${selectedPlace.rating} out of 5`}>★ {selectedPlace.rating}</span>
                  </div>
                  <p className="place-details__exact-location">
                    <span aria-hidden="true">⌖</span> {selectedPlace.location}, {selectedPlace.state}
                  </p>
                  <p className="place-details__description">{selectedPlace.detailDescription}</p>
                  <button
                    className="search-page__save-button"
                    type="button"
                    aria-pressed={isPlaceSaved(selectedPlace.id)}
                    onClick={() => toggleSavedPlace(selectedPlace.id)}
                  >
                    {isPlaceSaved(selectedPlace.id) ? 'Unsave' : 'Save'}
                  </button>

                  <div className="place-details__travel-options" aria-label="Travel options">
                    {['driving', 'walking'].map((mode) => {
                      const option = travelOptions[mode]
                      const modeLabel = mode === 'driving' ? 'Driving' : 'Walking'
                      return (
                        <div className="place-details__travel-row" key={mode}>
                          <strong>
                            <span className="place-details__travel-icon" aria-hidden="true">
                              {mode === 'driving' ? '↗' : '↟'}
                            </span>
                            {modeLabel}
                          </strong>
                          <span className="place-details__travel-value">
                            {option?.status === 'ready'
                              ? `${option.distanceKm.toFixed(1)} km · ${formatDuration(option.durationSeconds)}`
                              : routeStatus === 'loading'
                                ? 'Calculating…'
                                : 'Estimate unavailable'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <button
                    className="place-details__directions"
                    type="button"
                    onClick={handleGetDirections}
                    disabled={!routeOrigin}
                  >
                    Get Directions <span aria-hidden="true">↗</span>
                  </button>
                  {routeStatus === 'error' && (
                    <p className="search-page__location-error" role="alert">{routeError}</p>
                  )}
                </div>
              </div>
            </section>
          ) : placesToDisplay.length > 0 ? (
            <ul className="search-page__place-list">
              {placesToDisplay.map((place) => (
                <li className="search-page__place" key={place.id}>
                  <article className="search-page__place-card">
                    <button
                      className={`search-page__save-button search-page__save-button--card${isPlaceSaved(place.id) ? ' is-saved' : ''}`}
                      type="button"
                      aria-label={`${isPlaceSaved(place.id) ? 'Unsave' : 'Save'} ${place.name}`}
                      aria-pressed={isPlaceSaved(place.id)}
                      onClick={() => toggleSavedPlace(place.id)}
                    >
                      {isPlaceSaved(place.id) ? 'Unsave' : 'Save'}
                    </button>
                    <div
                      className="search-page__place-image search-page__place-image--placeholder"
                      role="img"
                      aria-label={`No verified photo loaded for ${place.name}`}
                    />
                    <div className="search-page__place-content">
                      <div className="search-page__place-heading">
                        <h3>{place.name}</h3>
                        <span aria-label={`Rating ${place.rating} out of 5`}>★ {place.rating}</span>
                      </div>
                      <p className="search-page__place-location">{place.location}, {place.state}</p>
                      <span className="search-page__place-category">{place.category}</span>
                      {coordinates && (
                        <p className="search-page__place-distance">
                          {place.distanceKm.toFixed(1)} km away
                        </p>
                      )}
                      <p className="search-page__place-description">{place.description}</p>
                      <button
                        className="search-page__details-button"
                        type="button"
                        onClick={() => selectPlace(place)}
                      >
                        View details
                      </button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="search-page__empty">
              <p>No places match your search and filters.</p>
              <button type="button" onClick={resetFilters}>Reset filters</button>
            </div>
          )}
      </section>
    </section>
  )
}

export default SearchPage
