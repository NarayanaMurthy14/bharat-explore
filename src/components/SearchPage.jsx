import { useState } from 'react'
import MapView from './MapView.jsx'
import touristPlaces from '../data/touristPlaces.js'

function SearchPage() {
  const [query, setQuery] = useState('')
  const filteredPlaces = touristPlaces.filter((place) =>
    `${place.name} ${place.location} ${place.city} ${place.state} ${place.category}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  )

  return (
    <section className="search-page" id="search" aria-labelledby="search-page-title">
      <header className="search-page__header">
        <p className="search-page__eyebrow">Explore India</p>
        <h1 id="search-page-title">Find your next destination</h1>
        <label className="search-page__search">
          <span className="visually-hidden">Search places</span>
          <input
            type="search"
            placeholder="Search places or destinations"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </header>

      <div className="search-page__content">
        <section className="search-page__results" aria-label="Search results">
          <div className="search-page__results-heading">
            <h2>Places to explore</h2>
            <span>{filteredPlaces.length}</span>
          </div>
          {filteredPlaces.length > 0 ? (
            <ul className="search-page__place-list">
              {filteredPlaces.map((place) => (
                <li className="search-page__place" key={place.id}>
                  <img className="search-page__place-image" src={place.image} alt="" loading="lazy" />
                  <div className="search-page__place-content">
                    <div className="search-page__place-heading">
                      <h3>{place.name}</h3>
                      <span aria-label={`Rating ${place.rating} out of 5`}>★ {place.rating}</span>
                    </div>
                    <p className="search-page__place-location">
                      {place.city}, {place.state} <span aria-hidden="true">·</span> {place.category}
                    </p>
                    <p className="search-page__place-description">{place.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="search-page__empty">
              No places match “{query}”. Try a different search.
            </p>
          )}
        </section>
        <MapView />
      </div>
    </section>
  )
}

export default SearchPage
