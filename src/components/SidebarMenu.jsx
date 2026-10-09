const menuItems = [
  { label: 'Discover', href: '#home' },
  { label: 'Search', href: '#search' },
  { label: 'Map', href: '#map' },
  { label: 'Saved Places', href: '#saved' },
  { label: 'My Trips', href: '#trips' },
]

function SidebarMenu({ activeItem = 'Discover', onNavigate }) {
  return (
    <aside className="dashboard-sidebar" aria-label="Dashboard sidebar">
      <a className="dashboard-sidebar__brand" href="#home">
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

      <nav className="dashboard-sidebar__nav" aria-label="Dashboard navigation">
        {menuItems.map((item) => (
          <a
            className={`dashboard-sidebar__link${item.label === activeItem ? ' is-active' : ''}`}
            href={item.href}
            key={item.label}
            aria-current={item.label === activeItem ? 'page' : undefined}
            onClick={() => onNavigate?.(item.label)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default SidebarMenu
