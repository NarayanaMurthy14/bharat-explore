import { useEffect, useRef, useState } from 'react'
import MapView from './MapView.jsx'
import touristPlaces from '../data/touristPlaces.js'
import { getDirections } from '../services/directions.js'

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
}) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [travelMode, setTravelMode] = useState('driving')
  const [routeStatus, setRouteStatus] = useState('idle')
  const [travelOptions, setTravelOptions] = useState({})
  const [routeOrigin, setRouteOrigin] = useState(null)
  const [routeError, setRouteError] = useState('')
  const routeRequest = useRef(null)
  const routeRequestId = useRef(0)
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
  }

  async function loadTravelOptions(place, request) {
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
      setRouteError('Route estimates are unavailable right now. You can still open Google Maps directions.')
    }
  }

  function selectPlace(place) {
    routeRequest.current?.controller.abort()
    const request = {
      id: routeRequestId.current + 1,
      controller: new AbortController(),
    }
    routeRequestId.current = request.id
    routeRequest.current = request
    setSelectedPlace(place)
    setTravelMode('driving')
    setRouteStatus('loading')
    setTravelOptions({})
    setRouteOrigin(coordinates)
    setRouteError('')
    if (place) {
      loadTravelOptions(place, request)
    } else {
      request.controller.abort()
      setRouteStatus('idle')
      setRouteOrigin(null)
    }
  }

  function selectTravelMode(mode) {
    setTravelMode(mode)
  }

  function handleGetDirections() {
    if (!selectedPlace || !routeOrigin) {
      return
    }
    const parameters = new URLSearchParams({
      api: '1',
      origin: `${routeOrigin.latitude},${routeOrigin.longitude}`,
      destination: `${selectedPlace.latitude},${selectedPlace.longitude}`,
      travelmode: travelMode,
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

  return (
    <section className="search-page" id="search" aria-labelledby="search-page-title">
      <header className="search-page__header">
        <p className="search-page__eyebrow">Explore India</p>
        <h1 id="search-page-title">Find your next destination</h1>
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
            {detectedLocation} ({coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)})
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

      <div className="search-page__content">
        <section className="search-page__results" aria-label="Search results" aria-live="polite">
          <div className="search-page__results-heading">
            <h2>{coordinates ? 'Nearest places' : 'Places to explore'}</h2>
            <span aria-label={`${placesToDisplay.length} places shown`}>{placesToDisplay.length}</span>
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
              <img className="place-details__image" src={selectedPlace.image} alt={selectedPlace.name} />
              <div className="place-details__content">
                <div className="search-page__place-heading">
                  <h3 id="place-details-title">{selectedPlace.name}</h3>
                  <span aria-label={`Rating ${selectedPlace.rating} out of 5`}>★ {selectedPlace.rating}</span>
                </div>
                <p className="search-page__place-location">
                  {selectedPlace.city}, {selectedPlace.state}
                </p>
                <span className="search-page__place-category">{selectedPlace.category}</span>
                <p className="search-page__place-description">{selectedPlace.description}</p>

                <div className="place-details__modes" role="group" aria-label="Travel mode">
                  {['driving', 'walking'].map((mode) => {
                    const option = travelOptions[mode]
                    const modeLabel = mode === 'driving' ? 'Driving' : 'Walking'
                    return (
                      <button
                        type="button"
                        aria-pressed={travelMode === mode}
                        className={travelMode === mode ? 'is-active' : ''}
                        key={mode}
                        onClick={() => selectTravelMode(mode)}
                        disabled={!routeOrigin}
                      >
                        <strong>{modeLabel}</strong>
                        <span>
                          {option?.status === 'ready'
                            ? `${option.distanceKm.toFixed(1)} km · ${formatDuration(option.durationSeconds)}`
                            : routeStatus === 'loading'
                              ? 'Calculating…'
                              : 'Estimate unavailable'}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {routeOrigin && (
                  <p className="place-details__routing-attribution">
                    Route estimates by <a href="https://www.fossgis.de/" target="_blank" rel="noreferrer">FOSSGIS</a>
                    {' · '}
                    <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
                      © OpenStreetMap contributors
                    </a>
                  </p>
                )}
                <button
                  className="place-details__directions"
                  type="button"
                  onClick={handleGetDirections}
                  disabled={!routeOrigin}
                >
                  Get Directions
                </button>
                {routeStatus === 'error' && (
                  <p className="search-page__location-error" role="alert">{routeError}</p>
                )}
              </div>
            </section>
          ) : placesToDisplay.length > 0 ? (
            <ul className="search-page__place-list">
              {placesToDisplay.map((place) => (
                <li className="search-page__place" key={place.id}>
                  <article className="search-page__place-card">
                    <img className="search-page__place-image" src={place.image} alt={place.name} loading="lazy" />
                    <div className="search-page__place-content">
                      <div className="search-page__place-heading">
                        <h3>{place.name}</h3>
                        <span aria-label={`Rating ${place.rating} out of 5`}>★ {place.rating}</span>
                      </div>
                      <p className="search-page__place-location">
                        {place.city}, {place.state}
                      </p>
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
            </div>
          )}
        </section>
        <MapView />
      </div>
    </section>
  )
}

export default SearchPage
