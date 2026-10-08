const touristPlaces = [
  {
    id: 'charminar',
    name: 'Charminar',
    location: 'Old City, Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    category: 'Heritage',
    description: 'Visit Hyderabad’s iconic four-minaret monument and lively bazaars.',
    detailDescription:
      'At the heart of Hyderabad’s Old City, Charminar rises above lively lanes and historic bazaars. Admire its four graceful minarets, explore the surrounding market streets, and take in the city’s rich Deccani heritage.',
    latitude: 17.3616,
    longitude: 78.4747,
    rating: 4.5,
    image:
      'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=900&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1200&q=85', alt: 'Historic architecture in Hyderabad' },
      { src: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80', alt: 'Ornate Indian monument details' },
      { src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80', alt: 'A grand landmark framed by gardens' },
      { src: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80', alt: 'A historic city landmark' },
    ],
  },
  {
    id: 'golconda-fort',
    name: 'Golconda Fort',
    location: 'Ibrahim Bagh, Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    category: 'Heritage',
    description: 'Explore the hilltop fort known for its grand gates and panoramic views.',
    detailDescription:
      'Walk through massive gateways, quiet courtyards, and the rugged stone walls of Golconda Fort. Its hilltop setting rewards the climb with sweeping views across Hyderabad and a glimpse into the region’s royal past.',
    latitude: 17.3833,
    longitude: 78.4011,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=85', alt: 'Stone fort architecture' },
      { src: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=900&q=80', alt: 'Historic architecture in the Deccan' },
      { src: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80', alt: 'A hilltop view across the landscape' },
      { src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80', alt: 'A historic landmark and its gardens' },
    ],
  },
  {
    id: 'ramoji-film-city',
    name: 'Ramoji Film City',
    location: 'Anaspur, Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    category: 'Entertainment',
    description: 'Discover film sets, gardens, and attractions at a sprawling studio complex.',
    detailDescription:
      'Step into a world of cinema at this expansive studio and entertainment destination. Themed sets, landscaped gardens, and live experiences make it easy to spend a full day discovering something new around every corner.',
    latitude: 17.2543,
    longitude: 78.6808,
    rating: 4.3,
    image:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85', alt: 'A cinematic scene on a film set' },
      { src: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80', alt: 'Green gardens and scenic pathways' },
      { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', alt: 'A colourful outdoor destination' },
      { src: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80', alt: 'A lively entertainment experience' },
    ],
  },
  {
    id: 'tirumala-temple',
    name: 'Tirumala Temple',
    location: 'Tirumala, Tirupati',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    category: 'Spiritual',
    description: 'Visit the revered hilltop Sri Venkateswara Temple in the Eastern Ghats.',
    detailDescription:
      'Set among the forested hills of Tirumala, this revered temple draws visitors to a peaceful mountain setting. Discover its rich traditions, intricate temple architecture, and the vibrant pilgrimage town surrounding the shrine.',
    latitude: 13.6833,
    longitude: 79.3472,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=900&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1200&q=85', alt: 'Temple architecture in southern India' },
      { src: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80', alt: 'An ornate historic place of worship' },
      { src: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80', alt: 'Forested hills around a pilgrimage town' },
      { src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80', alt: 'A serene temple destination' },
    ],
  },
  {
    id: 'araku-valley',
    name: 'Araku Valley',
    location: 'Alluri Sitharama Raju district',
    city: 'Araku Valley',
    state: 'Andhra Pradesh',
    category: 'Nature',
    description: 'Enjoy forested hills, coffee plantations, and scenic valley views.',
    detailDescription:
      'Take the scenic route into Araku Valley, where forested Eastern Ghats meet coffee estates and quiet villages. Slow down for viewpoints, local flavours, and refreshing walks through a landscape shaped by hills and greenery.',
    latitude: 18.3273,
    longitude: 82.8775,
    rating: 4.5,
    image:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=85', alt: 'Green hills in a scenic valley' },
      { src: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80', alt: 'A winding route through the hills' },
      { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', alt: 'A quiet green landscape' },
      { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80', alt: 'A mountain lake and forested slopes' },
    ],
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    location: 'Dharmapuri, Agra',
    city: 'Agra',
    state: 'Uttar Pradesh',
    category: 'Landmark',
    description: 'See the white-marble mausoleum and its gardens beside the Yamuna River.',
    detailDescription:
      'Experience the Taj Mahal at a gentle pace, from its formal gardens to the intricate marble work of the mausoleum. Set beside the Yamuna River, this celebrated landmark reveals new details in every arch and changing light.',
    latitude: 27.1751,
    longitude: 78.0421,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=85', alt: 'The Taj Mahal framed by its gardens' },
      { src: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80', alt: 'Detailed stonework at an Indian landmark' },
      { src: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=900&q=80', alt: 'Historic architecture in India' },
      { src: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80', alt: 'A monumental city landmark' },
    ],
  },
  {
    id: 'gateway-of-india',
    name: 'Gateway of India',
    location: 'Apollo Bunder, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'Landmark',
    description: 'See Mumbai’s waterfront arch overlooking the Arabian Sea.',
    detailDescription:
      'Meet Mumbai at the water’s edge beneath the grand Gateway of India. Watch boats cross the harbour, enjoy the lively Apollo Bunder promenade, and take in the mix of sea air and landmark architecture.',
    latitude: 18.922,
    longitude: 72.8347,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=85', alt: 'A monumental landmark in Mumbai' },
      { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', alt: 'The Arabian Sea along the coast' },
      { src: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=900&q=80', alt: 'Historic Indian architecture' },
      { src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80', alt: 'A celebrated landmark and open grounds' },
    ],
  },
  {
    id: 'hawa-mahal',
    name: 'Hawa Mahal',
    location: 'Badi Choupad, Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'Heritage',
    description: 'Admire the pink sandstone Palace of Winds in Jaipur’s old city.',
    detailDescription:
      'Look up at the honeycomb façade of Hawa Mahal, built to catch breezes above Jaipur’s old streets. Explore the surrounding bazaars and discover the delicate windows and pink sandstone details up close.',
    latitude: 26.9239,
    longitude: 75.8267,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=85', alt: 'Pink sandstone architecture in Jaipur' },
      { src: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=900&q=80', alt: 'An intricate historic Indian façade' },
      { src: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80', alt: 'A view across Jaipur’s historic quarter' },
      { src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80', alt: 'A grand landmark in warm evening light' },
    ],
  },
  {
    id: 'mysore-palace',
    name: 'Mysore Palace',
    location: 'Agrahara, Mysuru',
    city: 'Mysuru',
    state: 'Karnataka',
    category: 'Heritage',
    description: 'Explore the ornate former royal residence at the heart of Mysuru.',
    detailDescription:
      'Discover a royal residence filled with carved details, colourful interiors, and grand halls. Mysore Palace sits at the heart of the city, where its Indo-Saracenic architecture offers a striking window into the Wadiyar dynasty.',
    latitude: 12.3052,
    longitude: 76.6552,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=85', alt: 'Ornate royal palace architecture' },
      { src: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=900&q=80', alt: 'Historic architecture in southern India' },
      { src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80', alt: 'A royal landmark surrounded by gardens' },
      { src: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80', alt: 'A landmark in a historic Indian city' },
    ],
  },
  {
    id: 'marina-beach',
    name: 'Marina Beach',
    location: 'Triplicane, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    category: 'Beach',
    description: 'Take a walk along one of India’s best-known urban beaches.',
    detailDescription:
      'Stretch your legs along Chennai’s long Bay of Bengal shoreline, where the city meets the sea. Marina Beach is known for its wide sands, lively promenade, and colourful sunrise views over the water.',
    latitude: 13.0500,
    longitude: 80.2824,
    rating: 4.3,
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85', alt: 'The shoreline along the Bay of Bengal' },
      { src: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=900&q=80', alt: 'Waves rolling onto a broad sandy beach' },
      { src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80', alt: 'Open sea and a calm coastal view' },
      { src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80', alt: 'A quiet walk beside the ocean' },
    ],
  },
]

export default touristPlaces
