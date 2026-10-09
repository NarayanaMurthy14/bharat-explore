import { useRef, useState } from 'react'
import './App.css'
import DashboardLayout from './components/DashboardLayout.jsx'
import MapView from './components/MapView.jsx'
import touristPlaces from './data/touristPlaces.js'
import { SavedPlacesProvider } from './context/SavedPlacesContext.jsx'
import { useSavedPlaces } from './context/useSavedPlaces.js'
import { reverseGeocode } from './services/reverseGeocode.js'

const places = [
  {
    id: 'ramoji-film-city',
    name: 'Ramoji Film City',
    location: 'Anaspur, Hyderabad',
    category: 'Entertainment',
    distance: 30,
    rating: '4.4',
    reviews: '12K',
    description: 'World’s largest film city with fun rides, shows, and film sets.',
    image:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'A cinematic attraction with studio sets',
  },
  {
    id: 'bhuvanagiri-fort',
    name: 'Bhuvanagiri Fort',
    location: 'Bhongir, Hyderabad',
    category: 'Forts',
    distance: 55,
    rating: '4.2',
    reviews: '3K',
    description: 'Ancient fort with panoramic views and a rewarding hilltop trek.',
    image:
      'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Historic fort architecture on a rocky hill',
  },
  {
    id: 'ananthagiri-hills',
    name: 'Ananthagiri Hills',
    location: 'Vikarabad, Hyderabad',
    category: 'Nature',
    distance: 80,
    rating: '4.3',
    reviews: '5K',
    description: 'Beautiful forest, trekking trails, and a peaceful getaway.',
    image:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'A lush forest and green hills',
  },
  {
    id: 'yadagirigutta-temple',
    name: 'Yadagirigutta Temple',
    location: 'Yadadri, Hyderabad',
    category: 'Temples',
    distance: 100,
    rating: '4.6',
    reviews: '8K',
    description: 'A revered hilltop temple with striking architecture and calm views.',
    image:
      'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'A historic temple among the hills',
  },
  {
    id: 'nagarjuna-sagar',
    name: 'Nagarjuna Sagar',
    location: 'Nalgonda, Hyderabad',
    category: 'Lakes',
    distance: 150,
    rating: '4.4',
    reviews: '6K',
    description: 'Scenic dam, reservoir, and beautiful viewpoints over the water.',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'A wide reservoir surrounded by green hills',
  },
  {
    id: 'warangal-fort',
    name: 'Warangal Fort',
    location: 'Warangal, Telangana',
    category: 'Forts',
    distance: 150,
    rating: '4.3',
    reviews: '4K',
    description: 'Iconic Kakatiya-era fort with impressive stone gateways.',
    image:
      'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Stone gateways at a historic Indian fort',
  },
]

const dashboardPlaces = places.map((place) => ({
  ...place,
  detailsPlaceId: touristPlaces.some((touristPlace) => touristPlace.id === place.id)
    ? place.id
    : null,
}))
const placeCatalog = [
  ...dashboardPlaces,
  ...touristPlaces
    .filter((place) => !places.some((dashboardPlace) => dashboardPlace.id === place.id))
    .map((place) => ({ ...place, detailsPlaceId: place.id })),
]
const validPlaceIds = new Set(placeCatalog.map((place) => place.id))

const categories = [
  { label: 'All', icon: '🏠' },
  { label: 'Temples', icon: '🛕' },
  { label: 'Nature', icon: '🌲' },
  { label: 'Waterfalls', icon: '💧' },
  { label: 'Forts', icon: '🏰' },
  { label: 'Beaches', icon: '🏝️' },
  { label: 'Historical Places', icon: '🏛️' },
  { label: 'Lakes', icon: '🌊' },
  { label: 'Wildlife', icon: '🦌' },
  { label: 'Hill Stations', icon: '⛰️' },
  { label: 'Adventure', icon: '🧭' },
]

const popularLocations = ['Hyderabad', 'Tirupati', 'Ooty', 'Lonavala', 'Jaipur', 'Varanasi', 'Goa']

function Icon({ name, size = 18, fill = 'none' }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill,
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  if (name === 'pin') {
    return (
      <svg {...common}>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    )
  }

  if (name === 'search') {
    return (
      <svg {...common}>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.2 4.2" />
      </svg>
    )
  }

  if (name === 'heart') {
    return (
      <svg {...common}>
        <path d="M20.8 8.8c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.8 2.2Z" />
      </svg>
    )
  }

  if (name === 'star') {
    return (
      <svg {...common}>
        <path d="m12 3 2.7 5.5 6 .9-4.4 4.3 1 6.1-5.3-2.9-5.3 2.9 1-6.1L3.3 9.4l6-.9L12 3Z" />
      </svg>
    )
  }

  if (name === 'arrow') {
    return (
      <svg {...common}>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    )
  }

  if (name === 'chevron') {
    return (
      <svg {...common}>
        <path d="m7 10 5 5 5-5" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function DashboardApp() {
  const [query, setQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('Hyderabad')
  const [activeCategory, setActiveCategory] = useState('All')
  const [distanceLimit, setDistanceLimit] = useState(300)
  const [sortBy, setSortBy] = useState('nearest')
  const [locationStatus, setLocationStatus] = useState('idle')
  const [coordinates, setCoordinates] = useState(null)
  const [detectedLocation, setDetectedLocation] = useState('')
  const [locationError, setLocationError] = useState('')
  const [initialPlaceId, setInitialPlaceId] = useState(null)
  const locationRequestId = useRef(0)
  const { isPlaceSaved, toggleSavedPlace } = useSavedPlaces()

  const filteredPlaces = places
    .filter((place) => {
      const matchesCategory = activeCategory === 'All' || place.category === activeCategory
      const searchText = `${place.name} ${place.location} ${place.category}`.toLowerCase()
      const matchesSearch = searchText.includes(query.trim().toLowerCase())
      const matchesDistance = place.distance <= distanceLimit
      return matchesCategory && matchesSearch && matchesDistance
    })
    .sort((first, second) =>
      sortBy === 'rating'
        ? Number(second.rating) - Number(first.rating)
        : first.distance - second.distance,
    )

  function clearFilters() {
    setQuery('')
    setLocationQuery('Hyderabad')
    setActiveCategory('All')
    setDistanceLimit(300)
    setSortBy('nearest')
    resetLocation()
  }

  function searchPlaces() {
    setQuery(locationQuery.trim().toLowerCase() === 'hyderabad' ? '' : locationQuery.trim())
    document.getElementById('places-list')?.scrollIntoView({ behavior: 'smooth' })
  }

  function viewPlaceDetails(placeId) {
    setInitialPlaceId(placeId)
  }

  async function useMyLocation() {
    const requestId = locationRequestId.current + 1
    locationRequestId.current = requestId

    if (!navigator.geolocation) {
      setLocationStatus('error')
      setLocationError('Location is not available in this browser.')
      return
    }

    setLocationStatus('loading')
    setLocationError('')

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          maximumAge: 60_000,
          timeout: 15_000,
        })
      })
      if (requestId !== locationRequestId.current) {
        return
      }

      const currentCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
      setCoordinates(currentCoordinates)
      setDetectedLocation(
        `${currentCoordinates.latitude.toFixed(5)}, ${currentCoordinates.longitude.toFixed(5)}`,
      )

      try {
        const readableLocation = await reverseGeocode(currentCoordinates)
        if (requestId !== locationRequestId.current) {
          return
        }
        setDetectedLocation(readableLocation)
        setLocationStatus('success')
      } catch {
        if (requestId !== locationRequestId.current) {
          return
        }
        setLocationStatus('success')
        setLocationError(
          'Your coordinates were detected, but the readable address could not be loaded.',
        )
      }
    } catch (error) {
      if (requestId !== locationRequestId.current) {
        return
      }
      setLocationStatus('error')
      switch (error.code) {
        case 1:
          setLocationError(
            'Location permission was denied. Allow access in your browser settings and try again.',
          )
          break
        case 2:
          setLocationError('Your location could not be determined. Please try again.')
          break
        case 3:
          setLocationError('Finding your location took too long. Please try again.')
          break
        default:
          setLocationError('We could not get your location. Please try again.')
      }
    }
  }

  function resetLocation() {
    locationRequestId.current += 1
    setCoordinates(null)
    setDetectedLocation('')
    setLocationError('')
    setLocationStatus('idle')
  }

  return (
    <DashboardLayout
      places={placeCatalog}
      initialPlaceId={initialPlaceId}
      onInitialPlaceHandled={() => setInitialPlaceId(null)}
      onViewDetails={viewPlaceDetails}
      locationStatus={locationStatus}
      coordinates={coordinates}
      detectedLocation={detectedLocation}
      locationError={locationError}
      onUseMyLocation={useMyLocation}
      onResetLocation={resetLocation}
    >
      {({ onNavigate }) => (
        <div className="app-shell dashboard-home">
          <main>
            <section className="hero" id="home" aria-labelledby="hero-title">
              <img
                className="hero-image"
                src="https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=2200&q=90"
                alt="A historic fort in India at sunset"
              />
              <div className="hero-shade" />
              <div className="hero-content">
                <span className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT STORY STARTS HERE</span>
                <h1 id="hero-title">Discover Amazing<br />Places in India</h1>
                <p>Explore treasured destinations, hidden gems, temples, waterfalls,<br className="desktop-break" /> forts and more across India.</p>
                <div className="hero-search">
                  <label className="hero-search__location">
                    <Icon name="pin" size={17} />
                    <span className="visually-hidden">Search destination</span>
                    <input
                      type="search"
                      value={locationQuery}
                      onChange={(event) => setLocationQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') searchPlaces()
                      }}
                      aria-label="Search destination"
                    />
                    {locationQuery && (
                      <button type="button" aria-label="Clear destination" onClick={() => setLocationQuery('')}>×</button>
                    )}
                  </label>
                  <button className="hero-search__submit" type="button" onClick={searchPlaces}>Search Places</button>
                  <button
                    className="hero-search__location"
                    type="button"
                    onClick={useMyLocation}
                    disabled={locationStatus === 'loading'}
                  >
                    <Icon name="pin" size={15} />
                    {locationStatus === 'loading' ? 'Finding you…' : 'Use My Location'}
                  </button>
                </div>
                {locationError && <p className="hero-location-error" role="alert">{locationError}</p>}
                <div className="popular-locations" aria-label="Popular locations">
                  <span>Popular:</span>
                  {popularLocations.map((location) => (
                    <button
                      className={locationQuery === location ? 'is-selected' : ''}
                      key={location}
                      type="button"
                      onClick={() => setLocationQuery(location)}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
              <aside className="hero-location-card" aria-label="Featured destination">
                <strong><Icon name="pin" size={16} /> {detectedLocation || 'Hyderabad'}</strong>
                <span>{coordinates ? 'YOUR CURRENT LOCATION' : 'TELANGANA'}</span>
                <p>A vibrant blend of history, culture and modern attractions.</p>
                <div className="hero-location-card__photos" aria-hidden="true">
                  {places.slice(0, 4).map((place) => <img key={place.name} src={place.image} alt="" />)}
                </div>
                <button type="button" onClick={() => onNavigate('Search')}>View Gallery <Icon name="arrow" size={13} /></button>
              </aside>
            </section>

            <nav className="dashboard-categories" aria-label="Place categories">
              {categories.map((category) => (
                <button
                  className={`dashboard-category${activeCategory === category.label ? ' is-active' : ''}`}
                  key={category.label}
                  type="button"
                  aria-pressed={activeCategory === category.label}
                  onClick={() => setActiveCategory(category.label)}
                >
                  <span>{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </nav>

            <section className="dashboard-content" id="places-list" aria-label="Explore nearby places">
              <aside className="filter-panel" aria-label="Place filters">
                <div className="filter-panel__heading">
                  <Icon name="pin" size={15} />
                  <strong>Location</strong>
                </div>
                <div className="filter-location">
                  <Icon name="pin" size={14} />
                  <span>{detectedLocation || locationQuery || 'Hyderabad'}</span>
                </div>

                <div className="filter-panel__heading filter-panel__heading--distance">
                  <span aria-hidden="true">⌁</span>
                  <strong>Distance</strong>
                  <span className="filter-panel__value">{distanceLimit} km</span>
                </div>
                <input
                  className="distance-slider"
                  type="range"
                  min="0"
                  max="300"
                  step="5"
                  value={distanceLimit}
                  aria-label="Maximum distance in kilometres"
                  onChange={(event) => setDistanceLimit(Number(event.target.value))}
                />
                <div className="distance-range"><span>0 km</span><span>300 km</span></div>

                <div className="filter-panel__heading filter-panel__heading--categories">
                  <span aria-hidden="true">▦</span>
                  <strong>Category</strong>
                </div>
                <div className="filter-checkboxes">
                  {['Temples', 'Nature', 'Forts', 'Waterfalls', 'Historical Places', 'Lakes', 'Adventure', 'Wildlife'].map((category) => (
                    <label key={category}>
                      <input
                        type="radio"
                        name="dashboard-category"
                        checked={activeCategory === category}
                        onChange={() => setActiveCategory(category)}
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
                <button
                  className="apply-filters"
                  type="button"
                  onClick={() => document.getElementById('places-list')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Apply Filters
                </button>
                <button className="clear-filters" type="button" onClick={clearFilters}>Reset filters</button>
              </aside>

              <section className="dashboard-places" aria-labelledby="places-heading">
                <div className="dashboard-places__heading">
                  <div>
                    <h2 id="places-heading">Best Places to Visit Near Hyderabad</h2>
                    <p>Showing popular tourist places around Hyderabad with distance, photos and details.</p>
                  </div>
                  <label className="sort-select">
                    <span aria-hidden="true">↕</span> Sort by
                    <select
                      aria-label="Sort places"
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                    >
                      <option value="nearest">Distance (Nearest)</option>
                      <option value="rating">Rating</option>
                    </select>
                  </label>
                </div>

                {filteredPlaces.length > 0 ? (
                  <div className="places-grid">
                    {filteredPlaces.map((place) => {
                      const isSaved = isPlaceSaved(place.id)
                      return (
                        <article className="place-card" key={place.id}>
                          <div className="card-image-link">
                            <img className="card-image" src={place.image} alt={place.imageAlt} loading="lazy" />
                            <span className="place-distance"><Icon name="pin" size={13} /> {place.distance} km</span>
                          </div>
                          <button
                            className={`save-button${isSaved ? ' is-saved' : ''}`}
                            type="button"
                            aria-label={`${isSaved ? 'Unsave' : 'Save'} ${place.name}${isSaved ? ' from' : ' to'} saved places`}
                            aria-pressed={isSaved}
                            onClick={() => toggleSavedPlace(place.id)}
                          >
                            <Icon name="heart" size={16} fill={isSaved ? 'currentColor' : 'none'} />
                          </button>
                          <div className="place-card-content">
                            <div className="place-meta">
                              <span className="rating"><Icon name="star" size={13} fill="currentColor" /> {place.rating} <small>({place.reviews})</small></span>
                              <span className={`place-category place-category--${place.category.toLowerCase().replaceAll(' ', '-')}`}>{place.category}</span>
                            </div>
                            <h3>{place.name}</h3>
                            <p className="place-location"><Icon name="pin" size={13} /> {place.location}</p>
                            <p className="place-description">{place.description}</p>
                            <button
                              className="view-details"
                              type="button"
                              onClick={() => {
                                if (placeCatalog.find((item) => item.id === place.id)?.detailsPlaceId) {
                                  viewPlaceDetails(place.id)
                                }
                                onNavigate('Search')
                              }}
                            >
                              View Details <Icon name="arrow" size={14} />
                            </button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <span className="empty-state-icon"><Icon name="search" size={22} /></span>
                    <h3>No places found just yet</h3>
                    <p>Try a different search or reset your filters.</p>
                    <button type="button" onClick={clearFilters}>Reset filters</button>
                  </div>
                )}
              </section>

              <aside className="dashboard-aside">
                <section className="dashboard-aside__panel dashboard-map" aria-labelledby="map-heading">
                  <div className="dashboard-aside__heading">
                    <h2 id="map-heading"><Icon name="pin" size={14} /> Locations on Map</h2>
                    <button type="button" onClick={() => onNavigate('Map')}>View Full Map ↗</button>
                  </div>
                  <div className="dashboard-map__canvas">
                    <MapView />
                    <span className="map-label map-label--north">Bhuvanagiri Fort</span>
                    <span className="map-label map-label--west">Ananthagiri Hills</span>
                    <span className="map-label map-label--east">Warangal Fort</span>
                    <span className="map-label map-label--center">Hyderabad</span>
                    <span className="map-label map-label--south">Yadagirigutta Temple</span>
                  </div>
                </section>
                <section className="dashboard-aside__panel nearby-panel" aria-labelledby="nearby-heading">
                  <div className="dashboard-aside__heading">
                    <h2 id="nearby-heading"><Icon name="pin" size={14} /> Nearby Places (Sorted)</h2>
                    <button type="button" onClick={() => document.getElementById('places-list')?.scrollIntoView({ behavior: 'smooth' })}>View All</button>
                  </div>
                  <ol className="nearby-list">
                    {filteredPlaces.slice(0, 5).map((place, index) => (
                      <li key={place.name}>
                        <span className="nearby-rank">{index + 1}</span>
                        <img src={place.image} alt="" loading="lazy" />
                        <span>{place.name}</span>
                        <small>{place.distance} km</small>
                      </li>
                    ))}
                  </ol>
                </section>
              </aside>
            </section>
          </main>

          <footer className="site-footer" id="about">
            <span>Made for the road less ordinary. <span className="footer-heart">♥</span></span>
            <span className="footer-copyright">© 2025 BharatExplore</span>
          </footer>
        </div>
      )}
    </DashboardLayout>
  )
}

function App() {
  return (
    <SavedPlacesProvider validPlaceIds={validPlaceIds}>
      <DashboardApp />
    </SavedPlacesProvider>
  )
}

export default App
