const NOMINATIM_REVERSE_URL =
  'https://nominatim.openstreetmap.org/reverse'
const MIN_REQUEST_INTERVAL_MS = 1100
const REQUEST_TIMEOUT_MS = 10_000
const addressCache = new Map()
let lastRequestStartedAt = 0

function firstAddressValue(address, keys) {
  for (const key of keys) {
    const value = address[key]
    if (value) {
      return value
    }
  }
  return ''
}

export async function reverseGeocode({ latitude, longitude }) {
  const cacheKey = `${latitude.toFixed(5)},${longitude.toFixed(5)}`
  const cachedAddress = addressCache.get(cacheKey)
  if (cachedAddress) {
    return cachedAddress
  }

  const waitTime = MIN_REQUEST_INTERVAL_MS - (Date.now() - lastRequestStartedAt)
  if (waitTime > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitTime))
  }
  lastRequestStartedAt = Date.now()

  const parameters = new URLSearchParams({
    format: 'jsonv2',
    lat: String(latitude),
    lon: String(longitude),
    zoom: '18',
    addressdetails: '1',
  })
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  let response

  try {
    response = await fetch(`${NOMINATIM_REVERSE_URL}?${parameters}`, {
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) {
    throw new Error(`Reverse geocoding failed with status ${response.status}.`)
  }

  const result = await response.json()
  const address = result.address

  if (!address || typeof address !== 'object') {
    throw new Error('Reverse geocoding returned no address details.')
  }

  const locality = firstAddressValue(address, [
    'neighbourhood',
    'suburb',
    'quarter',
    'residential',
    'hamlet',
    'locality',
  ])
  const city = firstAddressValue(address, [
    'city',
    'town',
    'village',
    'municipality',
    'city_district',
    'county',
  ])
  const state = address.state || ''
  const country = address.country || ''
  const parts = [locality, city, state, country].filter(
    (part, index, values) =>
      part && values.findIndex((value) => value.toLowerCase() === part.toLowerCase()) === index,
  )

  if (parts.length === 0) {
    throw new Error('Reverse geocoding returned no readable location.')
  }

  const readableLocation = parts.join(', ')
  addressCache.set(cacheKey, readableLocation)
  return readableLocation
}
