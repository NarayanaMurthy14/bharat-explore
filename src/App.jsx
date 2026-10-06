import { useState } from 'react'
import './App.css'

const places = [
  {
    name: 'Amber Fort',
    location: 'Amer, Jaipur',
    category: 'Heritage',
    distance: '11 km',
    rating: '4.8',
    image:
      'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'The grand sandstone walls of Amber Fort',
    tag: 'Must visit',
  },
  {
    name: 'Hawa Mahal',
    location: 'Badi Choupad, Jaipur',
    category: 'Heritage',
    distance: '4 km',
    rating: '4.9',
    image:
      'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Historic architecture in Jaipur',
    tag: 'Local favourite',
  },
  {
    name: 'Jal Mahal',
    location: 'Amer Road, Jaipur',
    category: 'Nature',
    distance: '7 km',
    rating: '4.7',
    image:
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'A palace reflected in a quiet lake',
    tag: 'Golden hour',
  },
  {
    name: 'Galtaji Temple',
    location: 'Khania-Balaji, Jaipur',
    category: 'Spiritual',
    distance: '10 km',
    rating: '4.6',
    image:
      'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'A historic Indian temple among the hills',
    tag: 'Hidden gem',
  },
]

const categories = ['All places', 'Heritage', 'Nature', 'Spiritual']

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

function App() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All places')
  const [savedPlaces, setSavedPlaces] = useState([])

  const filteredPlaces = places
    .filter((place) => {
      const matchesCategory =
        activeCategory === 'All places' || place.category === activeCategory
      const searchText = `${place.name} ${place.location} ${place.category}`.toLowerCase()
      return matchesCategory && searchText.includes(query.trim().toLowerCase())
    })
    .sort((first, second) => Number.parseInt(first.distance, 10) - Number.parseInt(second.distance, 10))

  function toggleSaved(name) {
    setSavedPlaces((current) =>
      current.includes(name)
        ? current.filter((placeName) => placeName !== name)
        : [...current, name],
    )
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="BharatExplore home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36" fill="none">
              <path d="M18 4 4 28h28L18 4Z" fill="currentColor" opacity=".17" />
              <path d="M18 8 7 27h22L18 8Z" stroke="currentColor" strokeWidth="2" />
              <path d="M18 15v9m-4-4 4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="brand-name">bharat<span>explore</span></span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-link active" href="#discover">Discover</a>
          <a className="nav-link" href="#places">Places</a>
          <a className="nav-link" href="#about">About us</a>
        </nav>

        <button className="location-switch" type="button" aria-label="Current location Jaipur">
          <span className="location-icon"><Icon name="pin" size={16} /></span>
          <span>Jaipur, India</span>
          <Icon name="chevron" size={15} />
        </button>
      </header>

      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <img
            className="hero-image"
            src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2200&q=90"
            alt="The Taj Mahal glowing in the warm evening light"
          />
          <div className="hero-shade" />
          <div className="hero-content" id="discover">
            <span className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT STORY STARTS HERE</span>
            <h1 id="hero-title">Find your way<br />to <em>wonder.</em></h1>
            <p>Little-known lanes, landmark views, and everything in between.<br className="desktop-break" /> India is closer than you think.</p>
            <a className="hero-button" href="#places">
              Explore nearby <Icon name="arrow" size={17} />
            </a>
          </div>
          <div className="hero-caption"><span /> AGRA, UTTAR PRADESH <span className="caption-divider">/</span> INDIA</div>
          <div className="hero-pagination" aria-hidden="true"><span className="pagination-current" /><span /><span /><span /></div>
        </section>

        <section className="nearby-section" id="places" aria-labelledby="places-heading">
          <div className="section-topline">
            <div className="section-heading">
              <span className="section-kicker">MADE FOR YOUR KIND OF CURIOUS</span>
              <h2 id="places-heading">A little closer to <em>somewhere.</em></h2>
              <p className="section-description">Handpicked places worth stepping out for, right around you.</p>
            </div>
            <div className="weather-note"><span className="weather-sun">☀</span><span><strong>28°</strong><small>Perfect day to wander</small></span></div>
          </div>

          <div className="discovery-toolbar">
            <div className="search-box">
              <Icon name="search" size={19} />
              <input
                type="search"
                aria-label="Search nearby places"
                placeholder="Search places, landmarks, experiences..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <kbd>⌘ K</kbd>
            </div>
            <div className="category-filters" aria-label="Filter places by category">
              {categories.map((category) => (
                <button
                  className={`filter-chip${activeCategory === category ? ' selected' : ''}`}
                  key={category}
                  type="button"
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="places-heading-row">
            <h3>Nearby places <span>{filteredPlaces.length.toString().padStart(2, '0')}</span></h3>
            <span className="sort-label">Nearest first <Icon name="pin" size={14} /></span>
          </div>

          {filteredPlaces.length > 0 ? (
            <div className="places-grid">
              {filteredPlaces.map((place, index) => {
                const isSaved = savedPlaces.includes(place.name)
                return (
                  <article className="place-card" key={place.name}>
                    <a className="card-image-link" href="#about" aria-label={`Discover ${place.name}`}>
                      <img
                        className="card-image"
                        src={place.image}
                        alt={place.imageAlt}
                        loading="lazy"
                        style={{ objectPosition: index === 1 ? 'center 35%' : 'center' }}
                      />
                      <span className="place-tag">{place.tag}</span>
                    </a>
                    <button
                      className={`save-button${isSaved ? ' is-saved' : ''}`}
                      type="button"
                      aria-label={`${isSaved ? 'Remove' : 'Save'} ${place.name}${isSaved ? ' from' : ' to'} saved places`}
                      aria-pressed={isSaved}
                      onClick={() => toggleSaved(place.name)}
                    >
                      <Icon name="heart" size={17} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                    <div className="place-card-content">
                      <div className="place-meta">
                        <span>{place.category}</span>
                        <span className="rating"><Icon name="star" size={13} fill="currentColor" /> {place.rating}</span>
                      </div>
                      <h4>{place.name}</h4>
                      <p className="place-location"><Icon name="pin" size={14} /> {place.location}</p>
                      <div className="card-footer">
                        <span><Icon name="clock" size={14} /> Easy day trip</span>
                        <span className="distance">{place.distance} <Icon name="arrow" size={14} /></span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon"><Icon name="search" size={22} /></span>
              <h3>No places found just yet</h3>
              <p>Try another search or choose a different category.</p>
              <button type="button" onClick={() => { setQuery(''); setActiveCategory('All places') }}>Show all places</button>
            </div>
          )}

          <div className="section-bottom">
            <p>GOOD THINGS ARE NEVER TOO FAR.</p>
            <span>Showing places near <strong><Icon name="pin" size={13} /> Jaipur, Rajasthan</strong></span>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="about">
        <a className="brand footer-brand" href="#home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36" fill="none">
              <path d="M18 4 4 28h28L18 4Z" fill="currentColor" opacity=".17" />
              <path d="M18 8 7 27h22L18 8Z" stroke="currentColor" strokeWidth="2" />
              <path d="M18 15v9m-4-4 4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="brand-name">bharat<span>explore</span></span>
        </a>
        <span>Made for the road less ordinary. <span className="footer-heart">♥</span></span>
        <span className="footer-copyright">© 2025 BharatExplore</span>
      </footer>
    </div>
  )
}

export default App
