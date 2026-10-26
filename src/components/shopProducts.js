import { glassesProducts } from './glassesProducts.js';
import { lensesProducts } from './lensesProducts.js';
import { accessoriesProducts } from './accessoriesProducts.js';

export const productGroups = {
  best: [
    { id: 'product-1', brand: 'Maui Jim', model: 'MJ-H407 02', colour: 'Black · Rimless', type: 'Sunglasses', price: 14690, shape: 'Rectangle', rim: 'Rimless', audiences: ['men', 'women'] },
    { id: 'product-2', brand: 'Emporio Armani', model: '0EA4232 6106/87', colour: 'Transparent grey', type: 'Sunglasses', price: 15390, shape: 'Square', rim: 'Full rim', audiences: ['men', 'women'] },
    { id: 'product-3', brand: 'Emporio Armani', model: '0EA3038 5063', colour: 'Matt black', type: 'Eyeglasses', price: 12490, shape: 'Rectangle', rim: 'Full rim', audiences: ['men', 'women'] },
  ],
  edit: [
    { id: 'edit-1', brand: 'Burberry', model: '0BE4438U 300187', colour: 'Black', type: 'Sunglasses', price: 34290, shape: 'Cat-eye', rim: 'Full rim', audiences: ['women'], isNew: true },
    { id: 'edit-2', brand: 'Burberry', model: '0BE4403 409680', colour: 'Brown', type: 'Sunglasses', price: 22590, shape: 'Square', rim: 'Full rim', audiences: ['men', 'women'], isNew: true },
    { id: 'edit-3', brand: 'Champ', model: 'S5018 C4', colour: 'Blue · Junior', type: 'Sunglasses', price: 1500, shape: 'Rectangle', rim: 'Full rim', audiences: ['kids'], isNew: true },
  ],
};

const shapeNames = { Rounded: 'Round', 'Cat Eyes': 'Cat-eye', 'Club Master': 'Clubmaster', 'Mod. Aviator': 'Aviator', 'Warp Around': 'Wraparound', 'Single Lens': 'Shield' };
export const shopProducts = [...Object.values(productGroups).flat(), ...glassesProducts.map(product => ({ ...product, shape: shapeNames[product.shape] || product.shape })), ...lensesProducts, ...accessoriesProducts];
export const productSearchText = product => [product.brand, product.model, product.colour, product.type, product.shape, product.manufacturer, product.replacement, product.pack, product.category, product.capacity, product.detailsLabel, ...(product.designs || []), ...product.audiences, product.audiences.includes('kids') ? 'junior' : ''].filter(Boolean).join(' ').toLowerCase();
export const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
