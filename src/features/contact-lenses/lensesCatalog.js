import { lensesProducts } from './lensesProducts.js';

export const lensCollections = [
  ['', 'All lenses', 'Find your everyday lens.', 'Explore contact lenses by replacement schedule, lens type and colour. Take a closer look at the details that matter to you.'],
  ['daily', 'Daily lenses', 'A fresh start, every day.', 'Explore our daily contact lens selection, with clear and coloured options in a range of pack sizes.'],
  ['monthly', 'Monthly lenses', 'Make it your everyday.', 'Discover monthly contact lenses, from clear lenses to colours and specialist designs.'],
  ['fortnightly', 'Fortnightly lenses', 'Your fortnightly favourites.', 'Take a closer look at the fortnightly contact lens collection.'],
  ['coloured', 'Coloured lenses', 'A different shade of you.', 'Explore blues, browns, greys and more. Find the colour details alongside each lens.'],
  ['spherical', 'Spherical lenses', 'Keep your options in focus.', 'Browse spherical contact lenses and compare replacement schedules and pack sizes.'],
  ['toric', 'Toric lenses', 'The details make a difference.', 'Explore the toric contact lens collection and compare the available product details.'],
  ['multifocal', 'Multifocal lenses', 'Explore a wider perspective.', 'Discover multifocal contact lenses from a selection of lens families and manufacturers.'],
  ['clear', 'Clear lenses', 'A clear point of view.', 'Browse clear contact lenses by brand, replacement schedule and lens design.'],
];
export const lensPriceOptions = [
  { value: 'under-1000', label: 'Under ₹1,000', min: 0, max: 1000 },
  { value: '1000-2000', label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { value: '2000-3500', label: '₹2,000 – ₹3,500', min: 2000, max: 3500 },
  { value: 'over-3500', label: '₹3,500 and above', min: 3500, max: Infinity },
];
export const lensSortOptions = [['recommended', 'Recommended'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['brand', 'Brand: A–Z']];
export const lensFilterKeys = ['brand', 'manufacturer', 'replacement', 'design', 'colour', 'pack', 'price', 'q'];
export function readLensesRoute(pathname, search = '') {
  const slug = pathname.split('/')[2] || '';
  const collection = lensCollections.find(([key]) => key === (slug === 'bi-weekly' ? 'fortnightly' : slug)) || lensCollections[0];
  return { pathname, search, params: new URLSearchParams(search), slug: collection[0], label: collection[1], title: collection[2], description: collection[3] };
}
export function lensMatchesCollection(product, slug) {
  if (slug === 'coloured') return product.coloured;
  if (slug === 'clear') return !product.coloured;
  if (['spherical', 'toric', 'multifocal'].includes(slug)) return product.designs.some(design => design.toLowerCase() === slug);
  return !slug || product.replacement === ({ daily: 'Daily', monthly: 'Monthly', fortnightly: 'Fortnightly' })[slug];
}
export const lensCollectionProducts = route => lensesProducts.filter(product => lensMatchesCollection(product, route.slug));
export function filterLenses(products, params, saved = []) {
  const terms = (params.get('q') || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  const price = lensPriceOptions.find(option => option.value === params.get('price'));
  const filtered = products.filter(product => {
    const text = [product.brand, product.model, product.manufacturer, product.replacement, product.colour, product.pack, ...product.designs].join(' ').toLowerCase();
    return terms.every(term => text.includes(term)) &&
      ['brand', 'manufacturer', 'replacement', 'colour', 'pack'].every(key => !params.getAll(key).length || params.getAll(key).includes(product[key])) &&
      (!params.getAll('design').length || product.designs.some(design => params.getAll('design').includes(design))) &&
      (!price || (product.price >= price.min && product.price < price.max)) &&
      (params.get('saved') !== '1' || saved.includes(product.id));
  });
  switch (params.get('sort')) {
    case 'price-asc': return filtered.sort((a, b) => a.price - b.price);
    case 'price-desc': return filtered.sort((a, b) => b.price - a.price);
    case 'brand': return filtered.sort((a, b) => a.brand.localeCompare(b.brand));
    default: return filtered;
  }
}
