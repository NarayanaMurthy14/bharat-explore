const COMMONS_API_URL = 'https://commons.wikimedia.org/w/api.php'
const MAX_IMAGES = 5
const MAX_DISTANCE_KM = 3
const AI_IMAGE_MARKERS =
  /\b((ai|artificial intelligence)[ -]?(generated|created)|generated (with|using|by) ai|midjourney|dall[ -]?e|stable diffusion|firefly|comfyui)\b/i

function normalizeText(value) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#0*39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase()
}

function metadataValue(metadata, key) {
  return metadata?.[key]?.value ?? ''
}

function distanceKm(firstLatitude, firstLongitude, secondLatitude, secondLongitude) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180
  const latitudeDifference = toRadians(secondLatitude - firstLatitude)
  const longitudeDifference = toRadians(secondLongitude - firstLongitude)
  const firstLatitudeRadians = toRadians(firstLatitude)
  const secondLatitudeRadians = toRadians(secondLatitude)
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(firstLatitudeRadians) *
      Math.cos(secondLatitudeRadians) *
      Math.sin(longitudeDifference / 2) ** 2

  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(haversine)))
}

function hasRequiredPhrase(value, phrase) {
  return normalizeText(value).includes(normalizeText(phrase))
}

function isNearPlace(metadata, place) {
  const latitude = Number.parseFloat(metadataValue(metadata, 'GPSLatitude'))
  const longitude = Number.parseFloat(metadataValue(metadata, 'GPSLongitude'))

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return false
  }

  return distanceKm(latitude, longitude, place.latitude, place.longitude) <= MAX_DISTANCE_KM
}

function normalizeImageUrl(value) {
  const url = new URL(value)
  url.search = ''
  url.hash = ''
  return `${url.origin}${url.pathname}`.toLowerCase()
}

function toPlaceImage(page, place) {
  const imageInfo = page.imageinfo?.[0]
  const metadata = imageInfo?.extmetadata
  const categories = (page.categories ?? []).map((category) =>
    category.title.replace(/^Category:/, ''),
  )
  const title = page.title.replace(/^File:/, '')
  const identifyingText = [title, ...categories].join(' ')
  const metadataText = [
    identifyingText,
    metadataValue(metadata, 'ImageDescription'),
    metadataValue(metadata, 'Artist'),
    metadataValue(metadata, 'ObjectName'),
  ].join(' ')
  const hasPlaceName = hasRequiredPhrase(identifyingText, place.name)
  const hasCity = hasRequiredPhrase(identifyingText, place.city)
  const hasNearbyCoordinates = isNearPlace(metadata, place)

  if (
    !imageInfo?.thumburl ||
    !imageInfo.url ||
    !imageInfo.descriptionurl ||
    !imageInfo.mime?.startsWith('image/') ||
    !hasPlaceName ||
    (!hasCity && !hasNearbyCoordinates) ||
    (metadata?.GPSLatitude && metadata?.GPSLongitude && !hasNearbyCoordinates) ||
    AI_IMAGE_MARKERS.test(metadataText)
  ) {
    return null
  }

  return {
    src: imageInfo.thumburl,
    canonicalUrl: normalizeImageUrl(imageInfo.url),
    alt: metadataValue(metadata, 'ObjectName') || title,
    descriptionUrl: imageInfo.descriptionurl,
    credit: metadataValue(metadata, 'Artist').replace(/<[^>]*>/g, '').trim(),
    license: metadataValue(metadata, 'LicenseShortName'),
    licenseUrl: metadataValue(metadata, 'LicenseUrl'),
  }
}

export async function getPlaceImages(place, signal) {
  const parameters = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `${place.name} ${place.city}`,
    gsrnamespace: '6',
    gsrlimit: '50',
    prop: 'imageinfo|categories',
    iiprop: 'url|extmetadata|mime',
    iiurlwidth: '1200',
    cllimit: '30',
    format: 'json',
    origin: '*',
  })
  const response = await fetch(`${COMMONS_API_URL}?${parameters}`, { signal })

  if (!response.ok) {
    throw new Error(`Commons image search failed with status ${response.status}.`)
  }

  const result = await response.json()
  const pages = Object.values(result.query?.pages ?? {})
  const images = []
  const seenUrls = new Set()

  for (const page of pages) {
    const image = toPlaceImage(page, place)
    if (!image || seenUrls.has(image.canonicalUrl)) {
      continue
    }
    seenUrls.add(image.canonicalUrl)
    images.push(image)
    if (images.length === MAX_IMAGES) {
      break
    }
  }

  return images
}
