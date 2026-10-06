const ROUTING_PROFILES = {
  driving: 'routed-car',
  walking: 'routed-foot',
}

export async function getDirections(origin, destination, travelMode, signal) {
  const profile = ROUTING_PROFILES[travelMode]
  if (!profile) {
    throw new Error('This travel mode is not supported.')
  }

  const coordinates = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`
  const parameters = new URLSearchParams({
    overview: 'false',
    steps: 'false',
  })
  const response = await fetch(
    `https://routing.openstreetmap.de/${profile}/route/v1/driving/${coordinates}?${parameters}`,
    { signal },
  )

  if (!response.ok) {
    throw new Error(`The route service returned status ${response.status}.`)
  }

  const result = await response.json()
  const route = result.routes?.[0]
  if (result.code !== 'Ok' || !Number.isFinite(route?.distance) || !Number.isFinite(route?.duration)) {
    throw new Error('A route is not available for this place and travel mode.')
  }

  return {
    distanceKm: route.distance / 1000,
    durationSeconds: route.duration,
  }
}
