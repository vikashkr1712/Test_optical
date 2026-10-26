import { shopProducts } from './shopProducts.js';
import { productImage, readGlassesRoute } from './glassesCatalog.js';

const frames = shopProducts.filter(product => ['Eyeglasses', 'Sunglasses'].includes(product.type));
const displayNames = { Tomford: 'Tom Ford', 'Rayban Junior': 'Ray-Ban Junior' };
const slugify = value => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const highlights = {
  Tomford: 'Your signature, in focus.', Prada: 'A different perspective.', 'Miu Miu': 'A little more expression.',
  Burberry: 'Make the everyday your own.', 'Dolce & Gabbana': 'Room for a statement.',
  'Emporio Armani': 'Consider your next classic.', Silhouette: 'Find your lighter side.', 'Rayban Junior': 'Little frames. Big personality.',
};

export const designerBrands = [...new Set(frames.map(product => product.brand))].map(brand => {
  const products = frames.filter(product => product.brand === brand);
  const title = displayNames[brand] || brand;
  const product = products.find(item => item.type === 'Sunglasses') || products[0];
  const types = ['Eyeglasses', 'Sunglasses'].filter(type => products.some(item => item.type === type));
  return {
    brand, title, slug: slugify(title), products, types, count: products.length,
    audiences: [...new Set(products.flatMap(item => item.audiences))],
    line: highlights[brand] || 'Find a frame with your point of view.',
    description: `Explore ${title} ${types.map(type => type.toLowerCase()).join(' and ')}. Compare shapes, colours and the details that make a pair feel like you.`,
    catalogHref: `/designer-brands/${slugify(title)}`, style: 'catalogue',
    media: { src: productImage(product), srcSet: product.imageLarge ? `${product.image} 640w, ${product.imageLarge} 1000w` : undefined, width: 640, height: 400, alt: `${title} ${product.model}, ${product.colour}` },
  };
}).sort((a, b) => a.title.localeCompare(b.title));

export const featuredDesignerBrands = ['Tomford', 'Prada', 'Miu Miu', 'Burberry', 'Dolce & Gabbana', 'Emporio Armani', 'Silhouette', 'Rayban Junior'].map(name => designerBrands.find(item => item.brand === name));
export const designerTypes = [['', 'All brands'], ['eyeglasses', 'Eyeglasses'], ['sunglasses', 'Sunglasses'], ['kids', 'For kids']];

export function designerPath(designer, type = '', audience = '', isNew = false) {
  return `${designer.catalogHref}${isNew ? '/new-in' : type ? `/${type.toLowerCase()}` : ''}${audience ? `/${audience}` : ''}`;
}

export function readDesignerRoute(pathname, search = '') {
  const slug = pathname.split('/').filter(Boolean)[1];
  const designer = designerBrands.find(item => item.slug === slug || slugify(item.brand) === slug);
  return { ...readGlassesRoute(pathname, search), designer, unknown: Boolean(slug && !designer), title: designer ? designer.title : 'Designer Brands' };
}

export function brandMatchesType(brand, type) {
  return type === 'kids' ? brand.audiences.includes('kids') : !type || brand.types.some(value => value.toLowerCase() === type);
}

export function filterDesignerBrands(params) {
  const query = slugify(params.get('q') || '').replaceAll('-', '');
  const letter = params.get('letter') || '';
  return designerBrands.filter(item => brandMatchesType(item, params.get('type')) && (!letter || item.title[0].toUpperCase() === letter) && (!query || [item.title, item.brand].some(value => slugify(value).replaceAll('-', '').includes(query))));
}
