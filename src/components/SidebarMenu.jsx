const menuItems = [
  { label: 'Discover', href: '#home' },
  { label: 'Search', href: '#search' },
  { label: 'Map', href: '#map' },
  { label: 'Saved places', href: '#saved' },
  { label: 'My trips', href: '#trips' },
]

function SidebarMenu({ activeItem = 'Discover', onNavigate }) {
  return (
    <aside className="dashboard-sidebar" aria-label="Dashboard sidebar">
      <a className="dashboard-sidebar__brand" href="#home">
        BharatExplore
      </a>

      <nav className="dashboard-sidebar__nav" aria-label="Dashboard navigation">
        {menuItems.map((item) => (
          <a
            className={`dashboard-sidebar__link${item.label === activeItem ? ' is-active' : ''}`}
            href={item.href}
            key={item.label}
            aria-current={item.label === activeItem ? 'page' : undefined}
            onClick={() => {
              if (item.label === 'Discover' || item.label === 'Search' || item.label === 'Map') {
                onNavigate?.(item.label)
              }
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default SidebarMenu
