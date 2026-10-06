function MapView() {
  return (
    <section className="map-view" id="map" aria-label="Map">
      <div className="map-view__placeholder">
        <span className="map-view__marker" aria-hidden="true" />
      </div>
      <a
        className="map-view__attribution"
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
      >
        © OpenStreetMap contributors
      </a>
    </section>
  )
}

export default MapView
