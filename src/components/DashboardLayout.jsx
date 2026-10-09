import { useState } from 'react'
import MapView from './MapView.jsx'
import SearchPage from './SearchPage.jsx'
import SavedPlacesPage from './SavedPlacesPage.jsx'
import SidebarMenu from './SidebarMenu.jsx'
import './DashboardLayout.css'

function DashboardLayout({
  children,
  locationStatus,
  coordinates,
  detectedLocation,
  locationError,
  onUseMyLocation,
  onResetLocation,
  places,
  initialPlaceId,
  onInitialPlaceHandled,
  onViewDetails,
}) {
  const [activeView, setActiveView] = useState('Home')

  const content =
    activeView === 'Search' ? (
      <SearchPage
        initialPlaceId={initialPlaceId}
        onInitialPlaceHandled={onInitialPlaceHandled}
        locationStatus={locationStatus}
        coordinates={coordinates}
        detectedLocation={detectedLocation}
        locationError={locationError}
        onUseMyLocation={onUseMyLocation}
        onResetLocation={onResetLocation}
      />
    ) : activeView === 'Map' ? (
      <MapView />
    ) : activeView === 'Saved Places' ? (
      <SavedPlacesPage
        places={places}
        onViewDetails={(placeId) => {
          onViewDetails?.(placeId)
          setActiveView('Search')
        }}
      />
    ) : activeView === 'My Trips' ? (
      <section className="dashboard-placeholder" aria-labelledby="dashboard-placeholder-title">
        <p className="search-page__eyebrow">BharatExplore</p>
        <h1 id="dashboard-placeholder-title">{activeView}</h1>
        <p>This section is ready for a future update.</p>
      </section>
    ) : activeView === 'About' ? (
      <section className="dashboard-placeholder" aria-labelledby="dashboard-placeholder-title">
        <p className="search-page__eyebrow">Discover Incredible India</p>
        <h1 id="dashboard-placeholder-title">About BharatExplore</h1>
        <p>
          BharatExplore helps travellers discover remarkable places across India,
          find destinations by location and category, and plan visits with maps and
          directions.
        </p>
      </section>
    ) : activeView === 'Login / Sign Up' ? (
      <section className="dashboard-placeholder" aria-labelledby="dashboard-placeholder-title">
        <p className="search-page__eyebrow">BharatExplore</p>
        <h1 id="dashboard-placeholder-title">Login / Sign Up</h1>
        <p>Account sign-in is not configured in this version of BharatExplore.</p>
      </section>
    ) : (
      typeof children === 'function' ? children({ onNavigate: setActiveView }) : children
    )

  return (
    <div className="dashboard-layout">
      <SidebarMenu activeItem={activeView} onNavigate={setActiveView} />
      <main className="dashboard-layout__main">{content}</main>
    </div>
  )
}

export default DashboardLayout
