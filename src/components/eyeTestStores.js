// Illustrative locations for the booking preview; these are not trading stores.
// Real street/area names and PINs are used as search examples, not verified addresses.
const locations = [
  ['bengaluru-mg-road', 'MG Road', 'Bengaluru', 'Karnataka', '560001', 'MG Road', 'Bangalore'],
  ['bengaluru-indiranagar', 'Indiranagar', 'Bengaluru', 'Karnataka', '560038', '100 Feet Road, Indiranagar', 'Bangalore'],
  ['bengaluru-koramangala', 'Koramangala', 'Bengaluru', 'Karnataka', '560034', '80 Feet Road, Koramangala', 'Bangalore'],
  ['mumbai-bandra', 'Bandra West', 'Mumbai', 'Maharashtra', '400050', 'Linking Road, Bandra West', 'Bombay'],
  ['mumbai-andheri', 'Andheri West', 'Mumbai', 'Maharashtra', '400053', 'Lokhandwala, Andheri West', 'Bombay'],
  ['mumbai-powai', 'Powai', 'Mumbai', 'Maharashtra', '400076', 'Central Avenue, Powai', 'Bombay'],
  ['delhi-connaught-place', 'Connaught Place', 'Delhi NCR', 'Delhi', '110001', 'Connaught Place, New Delhi', 'New Delhi CP'],
  ['delhi-saket', 'Saket', 'Delhi NCR', 'Delhi', '110017', 'District Centre, Saket, New Delhi', 'New Delhi'],
  ['gurugram-dlf-phase-2', 'DLF Phase II', 'Delhi NCR', 'Haryana', '122002', 'DLF Phase II, Gurugram', 'Gurgaon DLF Phase 2'],
  ['kolkata-park-street', 'Park Street', 'Kolkata', 'West Bengal', '700016', 'Park Street', 'Calcutta'],
  ['kolkata-salt-lake', 'Salt Lake', 'Kolkata', 'West Bengal', '700064', 'Sector I, Salt Lake', 'Calcutta Bidhannagar'],
  ['kolkata-gariahat', 'Gariahat', 'Kolkata', 'West Bengal', '700019', 'Gariahat Road', 'Calcutta Ballygunge'],
  ['chennai-t-nagar', 'T. Nagar', 'Chennai', 'Tamil Nadu', '600017', 'Pondy Bazaar, T. Nagar', 'Madras T Nagar Thyagaraya'],
  ['chennai-anna-nagar', 'Anna Nagar', 'Chennai', 'Tamil Nadu', '600040', '2nd Avenue, Anna Nagar', 'Madras'],
  ['hyderabad-banjara-hills', 'Banjara Hills', 'Hyderabad', 'Telangana', '500034', 'Road No. 1, Banjara Hills', ''],
  ['hyderabad-himayatnagar', 'Himayatnagar', 'Hyderabad', 'Telangana', '500029', 'Main Road, Himayatnagar', 'Himayathnagar'],
  ['pune-koregaon-park', 'Koregaon Park', 'Pune', 'Maharashtra', '411001', 'North Main Road, Koregaon Park', 'Poona'],
  ['pune-aundh', 'Aundh', 'Pune', 'Maharashtra', '411007', 'ITI Road, Aundh', 'Poona'],
  ['ahmedabad-navrangpura', 'Navrangpura', 'Ahmedabad', 'Gujarat', '380009', 'C. G. Road, Navrangpura', 'CG Road'],
  ['jaipur-mi-road', 'MI Road', 'Jaipur', 'Rajasthan', '302001', 'Mirza Ismail Road', 'M I Road'],
  ['lucknow-hazratganj', 'Hazratganj', 'Lucknow', 'Uttar Pradesh', '226001', 'Mahatma Gandhi Marg, Hazratganj', ''],
];

// Approximate area centres, not branch entrances. Source: OpenStreetMap area lookups.
// Attribution and source records are documented in README and retained under reference/eye-test/map-data.
const areaCoordinates = {
  'bengaluru-mg-road': [12.975526, 77.606790],
  'bengaluru-indiranagar': [12.973291, 77.640467],
  'bengaluru-koramangala': [12.935737, 77.624081],
  'mumbai-bandra': [19.058336, 72.830267],
  'mumbai-andheri': [19.117249, 72.833968],
  'mumbai-powai': [19.118720, 72.907348],
  'delhi-connaught-place': [28.631770, 77.219380],
  'delhi-saket': [28.523490, 77.209631],
  'gurugram-dlf-phase-2': [28.483901, 77.084610],
  'kolkata-park-street': [22.555159, 88.350117],
  'kolkata-salt-lake': [22.590425, 88.416920],
  'kolkata-gariahat': [22.519638, 88.365624],
  'chennai-t-nagar': [13.038595, 80.233579],
  'chennai-anna-nagar': [13.088249, 80.207340],
  'hyderabad-banjara-hills': [17.417746, 78.439901],
  'hyderabad-himayatnagar': [17.403982, 78.488194],
  'pune-koregaon-park': [18.536623, 73.893274],
  'pune-aundh': [18.561883, 73.810196],
  'ahmedabad-navrangpura': [23.036000, 72.564343],
  'jaipur-mi-road': [26.916604, 75.806991],
  'lucknow-hazratganj': [26.847528, 80.943200],
};

const storePhotos = [
  { src: '/assets/our-story/eyewear-display-640.webp', srcSet: '/assets/eye-test/store-display-320.webp 320w, /assets/our-story/eyewear-display-640.webp 640w', alt: 'Optical frames arranged on glass shelves in an eyewear store' },
  { src: '/assets/our-story/frame-details-640.webp', srcSet: '/assets/eye-test/store-interior-320.webp 320w, /assets/our-story/frame-details-640.webp 640w', alt: 'Eyewear display and interior of an optical store' },
];
const storePhotoIndex = id => [...id].reduce((sum, character) => sum + character.charCodeAt(0), 0) % storePhotos.length;

export const eyeTestStores = locations.map(([id, area, city, state, pinCode, street, aliases]) => ({
  id, area, city, state, pinCode, aliases,
  name: `CandiClie · ${area}`,
  address: street,
  coordinates: areaCoordinates[id],
  photo: storePhotos[storePhotoIndex(id)],
  mapQuery: `${street}, ${city === 'Delhi NCR' ? '' : city + ', '}${state} ${pinCode}, India`,
}));

export const storeCities = [...new Set(eyeTestStores.map(store => store.city))].sort();
export const getEyeTestStore = id => eyeTestStores.find(store => store.id === id);
const normalize = value => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export function filterEyeTestStores({ query = '', city = '' } = {}) {
  const normalizedQuery = normalize(query);
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  return eyeTestStores.filter(store => {
    if (city && store.city !== city) return false;
    const searchable = normalize([store.name, store.address, store.city, store.state, store.pinCode, store.aliases].join(' '));
    if (/^\d+$/.test(normalizedQuery)) return store.pinCode.startsWith(normalizedQuery);
    return tokens.every(token => searchable.includes(token));
  });
}

export function updateEyeTestStoreSearch(search, changes) {
  const next = { ...search, ...changes };
  if (Object.hasOwn(changes, 'city')) {
    next.cityFromPin = false;
    // A direct city choice should show that city's stores, even after a search
    // for an incompatible PIN or neighbourhood.
    if (next.city && next.query.trim() && !filterEyeTestStores(next).length) next.query = '';
  } else if (Object.hasOwn(changes, 'query')) {
    if (/^\d+$/.test(next.query.trim())) {
      // Infer from every matching store so a previous city cannot hide matches.
      const cities = [...new Set(filterEyeTestStores({ query: next.query }).map(store => store.city))];
      next.city = cities.length === 1 ? cities[0] : '';
      next.cityFromPin = !!next.city;
    } else if (search.cityFromPin) {
      next.city = '';
      next.cityFromPin = false;
    }
  }
  return next;
}

export const storeAreaMapUrl = store => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapQuery)}`;
