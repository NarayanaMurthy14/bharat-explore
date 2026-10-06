import { useState } from 'react'
import MapView from './MapView.jsx'
import touristPlaces from '../data/touristPlaces.js'

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
}) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
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
  const hasActiveFilters = Boolean(normalizedQuery) || activeCategory !== 'All'

  function resetFilters() {
    setQuery('')
    setActiveCategory('All')
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
            {' · '}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
              © OpenStreetMap contributors
            </a>
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
          </div>
          <button
            className="search-page__reset"
            type="button"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
          >
            Reset filters
          </button>
        </div>
      </header>

      <div className="search-page__content">
        <section className="search-page__results" aria-label="Search results" aria-live="polite">
          <div className="search-page__results-heading">
            <h2>{coordinates ? 'Nearest places' : 'Places to explore'}</h2>
            <span aria-label={`${placesToDisplay.length} places shown`}>{placesToDisplay.length}</span>
          </div>
          {placesToDisplay.length > 0 ? (
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
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="search-page__empty">
              <p>No places match your search and filters.</p>
              <button type="button" onClick={resetFilters}>Clear filters</button>
            </div>
          )}
        </section>
        <MapView />
      </div>
    </section>
  )
}

export default SearchPage
