function MapView() {
  return (
    <section className="map-view" id="map" aria-label="Map">
      <div className="map-view__placeholder">
        <span className="map-view__marker" aria-hidden="true" />
        <p>Map preview</p>
      </div>
    </section>
  )
}

export default MapView
