import { useState } from 'react'
import MapView from './MapView.jsx'
import SearchPage from './SearchPage.jsx'
import SidebarMenu from './SidebarMenu.jsx'
import './DashboardLayout.css'

function DashboardLayout({ children }) {
  const [activeView, setActiveView] = useState('Discover')

  const content =
    activeView === 'Search' ? (
      <SearchPage />
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
