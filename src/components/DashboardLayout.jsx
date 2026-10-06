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
      />
    ) : activeView === 'Map' ? (
      <MapView />
    ) : (
      children
    )

  return (
    <div className="dashboard-layout">
      <SidebarMenu activeItem={activeView} onNavigate={setActiveView} />
      <main className="dashboard-layout__main">{content}</main>
    </div>
  )
}

export default DashboardLayout
