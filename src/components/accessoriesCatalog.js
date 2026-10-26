import { accessoriesProducts } from './accessoriesProducts.js';

export const accessoryCollections = [
  ['', 'All accessories', 'The little things, considered.', 'Storage for your favourite frames, a little care for your lenses, and the details that make them part of your everyday.'],
  ['cases', 'Cases & storage', 'A place for every pair.', 'Explore two-frame and four-frame organisers. Keep your favourite pairs together, at home or on the move.'],
  ['cleaning', 'Cleaning & care', 'A little care, every day.', 'Discover a lens cleaner and cloth set for your eyewear routine. Follow the care instructions supplied with your own frames and lenses.'],
  ['cords', 'Cords & straps', 'Keep your favourites close.', 'Explore the small finishing touches that go with your everyday pair.'],
];
export const accessoryPriceOptions = [
  { value: 'under-500', label: 'Under ₹500', min: 0, max: 500 },
  { value: '500-5000', label: '₹500 – ₹5,000', min: 500, max: 5000 },
  { value: 'over-5000', label: '₹5,000 and above', min: 5000, max: Infinity },
];
export const accessorySortOptions = [['recommended', 'Recommended'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['name', 'Name: A–Z']];
export const accessoryFilterKeys = ['category', 'colour', 'capacity', 'price', 'q'];
export function readAccessoriesRoute(pathname, search = '') {
  const requested = pathname.split('/')[2] || '';
  const slug = ({ 'cases-and-pouches': 'cases', 'cases-pouches': 'cases', 'cleaning-cloths': 'cleaning', 'care-essentials': 'cleaning', 'cords-straps': 'cords' })[requested] || requested;
  const collection = accessoryCollections.find(([key]) => key === slug) || accessoryCollections[0];
  return { pathname, search, params: new URLSearchParams(search), slug: collection[0], label: collection[1], title: collection[2], description: collection[3] };
}
export const accessoryCollectionProducts = route => accessoriesProducts.filter(product => !route.slug || product.category === ({ cases: 'Cases & storage', cleaning: 'Cleaning & care', cords: 'Cords & straps' })[route.slug]);
export function filterAccessories(products, params, saved = []) {
  const terms = (params.get('q') || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  const price = accessoryPriceOptions.find(option => option.value === params.get('price'));
  const filtered = products.filter(product => {
    const text = [product.brand, product.model, product.category, product.colour, product.capacity, product.detailsLabel].join(' ').toLowerCase();
    return terms.every(term => text.includes(term)) &&
      ['category', 'colour', 'capacity'].every(key => !params.getAll(key).length || params.getAll(key).includes(product[key])) &&
      (!price || (product.price >= price.min && product.price < price.max)) &&
      (params.get('saved') !== '1' || saved.includes(product.id));
  });
  switch (params.get('sort')) {
    case 'price-asc': return filtered.sort((a, b) => a.price - b.price);
    case 'price-desc': return filtered.sort((a, b) => b.price - a.price);
    case 'name': return filtered.sort((a, b) => a.model.localeCompare(b.model) || a.colour.localeCompare(b.colour));
    default: return filtered;
  }
}
