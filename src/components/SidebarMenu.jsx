import { useState } from 'react'

const menuItems = [
  { label: 'Home', href: '#home', icon: 'home' },
  { label: 'Search', href: '#search', icon: 'search' },
  { label: 'Map', href: '#map', icon: 'map' },
  { label: 'Saved Places', href: '#saved', icon: 'saved' },
  { label: 'My Trips', href: '#trips', icon: 'trips' },
  { label: 'About', href: '#about', icon: 'about' },
  { label: 'Login / Sign Up', href: '#account', icon: 'account' },
]

function NavigationIcon({ name }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-7h6v7" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path d="M9 3v15m6-12v15" /></>,
    saved: <path d="M20.8 8.8c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.8 2.2Z" />,
    trips: <><rect x="3" y="5" width="18" height="15" rx="2" /><path d="M8 5V3h8v2M3 10h18m-12 0v3h6v-3" /></>,
    about: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></>,
    account: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  }

  return (
    <svg
      aria-hidden="true"
      className="dashboard-sidebar__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function SidebarMenu({ activeItem = 'Home', onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)

  function navigateTo(item) {
    onNavigate?.(item.label)
    setIsOpen(false)
  }

  return (
    <aside className="dashboard-sidebar" aria-label="Dashboard sidebar">
      <a
        className="dashboard-sidebar__brand"
        href="#home"
        onClick={() => {
          onNavigate?.('Home')
          setIsOpen(false)
        }}
      >
        <span className="dashboard-sidebar__brand-mark" aria-hidden="true">
          <svg viewBox="0 0 36 36" fill="none">
            <path d="M18 3 2 30h32L18 3Z" fill="currentColor" opacity=".16" />
            <path d="M18 8 6 28h24L18 8Z" stroke="currentColor" strokeWidth="2" />
            <path d="M18 15v8m-4-3 4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="dashboard-sidebar__brand-copy">
          <span>Bharat<span>Explore</span></span>
          <small>Discover Incredible India</small>
        </span>
      </a>

      <button
        className="dashboard-sidebar__mobile-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="dashboard-sidebar-navigation"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{activeItem}</span>
        <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>

      <nav
        className={`dashboard-sidebar__nav${isOpen ? ' is-open' : ''}`}
        id="dashboard-sidebar-navigation"
        aria-label="Dashboard navigation"
      >
        {menuItems.map((item) => (
          <a
            className={`dashboard-sidebar__link${item.label === activeItem ? ' is-active' : ''}`}
            href={item.href}
            key={item.label}
            aria-current={item.label === activeItem ? 'page' : undefined}
            onClick={() => navigateTo(item)}
          >
            <NavigationIcon name={item.icon} />
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default SidebarMenu
