import { useState } from 'react'
import MapView from './MapView.jsx'
import SearchPage from './SearchPage.jsx'
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
}) {
  const [activeView, setActiveView] = useState('Discover')

  const content =
    activeView === 'Search' ? (
      <SearchPage
        locationStatus={locationStatus}
        coordinates={coordinates}
        detectedLocation={detectedLocation}
        locationError={locationError}
        onUseMyLocation={onUseMyLocation}
        onResetLocation={onResetLocation}
      />
    ) : activeView === 'Map' ? (
      <MapView />
    ) : activeView === 'Saved Places' || activeView === 'My Trips' ? (
      <section className="dashboard-placeholder" aria-labelledby="dashboard-placeholder-title">
        <p className="search-page__eyebrow">BharatExplore</p>
        <h1 id="dashboard-placeholder-title">{activeView}</h1>
        <p>This section is ready for a future update.</p>
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
