import { shopProducts } from './shopProducts.js';

export const audienceLabels = { men: 'Men', women: 'Women', kids: 'Kids' };
export const shapeOptions = ['Round', 'Rectangle', 'Square', 'Cat-eye', 'Aviator', 'Oval', 'Butterfly', 'Pilot', 'Wayfarer', 'Clubmaster', 'Geometric', 'Pillow', 'Phantos', 'Irregular', 'Wraparound', 'Shield'];
export const priceOptions = [
  { value: 'under-5000', label: 'Under ₹5,000', min: 0, max: 5000 },
  { value: '5000-15000', label: '₹5,000 – ₹15,000', min: 5000, max: 15000 },
  { value: '15000-30000', label: '₹15,000 – ₹30,000', min: 15000, max: 30000 },
  { value: 'over-30000', label: '₹30,000 and above', min: 30000, max: Infinity },
];
export const sortOptions = [
  ['recommended', 'Recommended'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['newest', 'New arrivals'], ['brand', 'Brand: A–Z'],
];
export const colourValues = { Black: '#252525', Blue: '#446381', Brown: '#866345', Grey: '#9b9d9d', Gold: '#c8aa62', Silver: '#b8bdc1', Maroon: '#79464c', Ivory: '#e4dcc6', Yellow: '#dfca53', Red: '#bb4c48', Purple: '#9982ad', Green: '#6e8164', Pink: '#d4a0b0', Orange: '#c98b51', White: '#f5f4ec', Transparent: '#e3e8e4', Multicolour: 'linear-gradient(135deg, #516a94, #cf8c9c, #d0b36d)' };
export const productColour = product => {
  const colour = product.colour.toLowerCase();
  if (/havana|tortoise/.test(colour)) return 'Brown';
  if (/violet/.test(colour)) return 'Purple';
  if (/cherry/.test(colour)) return 'Red';
  if (/olive/.test(colour)) return 'Green';
  if (/misc|multi/.test(colour)) return 'Multicolour';
  return Object.keys(colourValues).find(value => colour.includes(value.toLowerCase())) || product.colour;
};

export function readGlassesRoute(pathname, search = '') {
  const parts = pathname.replace(/\/$/, '').split('/').filter(Boolean);
  const type = parts.includes('sunglasses') ? 'Sunglasses' : parts.includes('eyeglasses') ? 'Eyeglasses' : '';
  const audience = parts.find(part => audienceLabels[part]) || '';
  const isNew = parts.includes('new-in');
  const params = new URLSearchParams(search);
  const shape = params.get('shape') || '';
  const title = audience ? `${audienceLabels[audience]}’${audience === 'kids' ? '' : 's'} ${type.toLowerCase() || 'glasses'}` : isNew ? 'A fresh point of view.' : type || 'Find your kind of frame.';
  return { pathname, search, type, audience, isNew, params, shape, title,
    label: audience ? audienceLabels[audience] : isNew ? 'New in' : type || 'All glasses',
  };
}

export function collectionPath(type = '', audience = '') {
  return `/eyewear${type ? `/${type.toLowerCase()}` : ''}${audience ? `/${audience}` : ''}`;
}

export function collectionProducts(route) {
  return shopProducts.filter(product => (!route.type || product.type === route.type) && (!route.audience || product.audiences.includes(route.audience)) && (!route.isNew || product.isNew));
}

export function filterProducts(products, params, saved = []) {
  const terms = (params.get('q') || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  const price = priceOptions.find(option => option.value === params.get('price'));
  const filtered = products.filter(product => {
    const text = `${product.brand} ${product.model} ${product.colour} ${product.type} ${product.shape} ${product.audiences.join(' ')} ${product.audiences.includes('kids') ? 'junior' : ''}`.toLowerCase();
    return terms.every(term => text.includes(term)) &&
      ['brand', 'shape', 'colour', 'rim'].every(key => !params.getAll(key).length || params.getAll(key).includes(key === 'colour' ? productColour(product) : product[key])) &&
      (!price || (product.price >= price.min && product.price < price.max)) &&
      (params.get('saved') !== '1' || saved.includes(product.id));
  });
  switch (params.get('sort')) {
    case 'price-asc': return filtered.sort((a, b) => a.price - b.price);
    case 'price-desc': return filtered.sort((a, b) => b.price - a.price);
    case 'newest': return filtered.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case 'brand': return filtered.sort((a, b) => a.brand.localeCompare(b.brand));
    default: return filtered;
  }
}

export function followCollectionLink(event, href, onNavigate) {
  if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    onNavigate(href);
  }
}

export function productImage(product, large = false) {
  return (large ? product.imageLarge : product.image) || `/assets/home/${product.id}-${large ? 720 : 400}.webp`;
}
