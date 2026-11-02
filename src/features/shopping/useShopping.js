import { useEffect, useState } from 'react';
import { shopProducts } from './shopProducts.js';

const storageKey = 'candiclie-shopping-v1';
const validId = id => shopProducts.some(product => product.id === id);
const emptyProfile = { name: '', style: 'All eyewear' };
export const profileStyles = ['All eyewear', 'Eyeglasses', 'Sunglasses', 'Junior frames'];

function readShopping() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey)) || {};
    return {
      cart: Array.isArray(data.cart) ? data.cart.filter((item, index, all) => item && validId(item.id) && Number.isInteger(item.quantity) && item.quantity > 0 && all.findIndex(other => other?.id === item.id) === index).map(item => ({ id: item.id, quantity: Math.min(10, item.quantity) })) : [],
      saved: Array.isArray(data.saved) ? [...new Set(data.saved.filter(validId))] : [],
      recent: Array.isArray(data.recent) ? [...new Set(data.recent.filter(value => typeof value === 'string' && value.trim()).map(value => value.slice(0, 80)))].slice(0, 5) : [],
      profile: { name: typeof data.profile?.name === 'string' ? data.profile.name.slice(0, 60) : '', style: profileStyles.includes(data.profile?.style) ? data.profile.style : emptyProfile.style },
    };
  } catch { return { cart: [], saved: [], recent: [], profile: emptyProfile }; }
}

export default function useShopping() {
  const [shopping, setShopping] = useState(readShopping);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(shopping)); setStorageUnavailable(false); }
    catch { setStorageUnavailable(true); }
  }, [shopping]);
  const addToBag = id => {
    if (!validId(id)) return;
    setShopping(current => ({ ...current, cart: current.cart.some(item => item.id === id) ? current.cart.map(item => item.id === id ? { ...item, quantity: Math.min(10, item.quantity + 1) } : item) : [...current.cart, { id, quantity: 1 }] }));
  };
  const setQuantity = (id, quantity) => setShopping(current => ({ ...current, cart: quantity <= 0 ? current.cart.filter(item => item.id !== id) : current.cart.map(item => item.id === id ? { ...item, quantity: Math.min(10, quantity) } : item) }));
  const toggleSaved = id => {
    if (validId(id)) setShopping(current => ({ ...current, saved: current.saved.includes(id) ? current.saved.filter(value => value !== id) : [...current.saved, id] }));
  };
  const rememberSearch = value => {
    const query = value.trim().slice(0, 80);
    if (query) setShopping(current => ({ ...current, recent: [query, ...current.recent.filter(item => item.toLowerCase() !== query.toLowerCase())].slice(0, 5) }));
  };
  return { ...shopping, storageUnavailable, addToBag, setQuantity, toggleSaved, rememberSearch,
    clearRecent: () => setShopping(current => ({ ...current, recent: [] })),
    saveProfile: profile => setShopping(current => ({ ...current, profile })),
    bagCount: shopping.cart.reduce((count, item) => count + item.quantity, 0),
  };
}
