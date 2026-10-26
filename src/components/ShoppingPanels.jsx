import { useEffect, useRef, useState } from 'react';
import { currency, shopProducts, productSearchText } from './shopProducts.js';
import { productImage } from './glassesCatalog.js';
import './ShoppingPanels.css';

function FrameImage({ product }) {
  return <img src={productImage(product)} width="400" height="256" alt={`${product.brand} ${product.model}, ${product.colour}`} loading="lazy" decoding="async" />;
}

function FrameResult({ product, shopping, onView }) {
  const saved = shopping.saved.includes(product.id);
  return <article className="shop-result">
    <button type="button" className="shop-result__view" onClick={() => onView(product)} aria-label={`View ${product.brand} ${product.model}`}><FrameImage product={product} /></button>
    <div className="shop-result__copy"><p className="shop-eyebrow">{product.type}</p><button type="button" className="shop-result__title" onClick={() => onView(product)}>{product.brand}<span>{product.model}</span></button><p className="shop-muted">{product.colour}</p><strong>{currency.format(product.price)}</strong>
      <div className="shop-result__actions"><button type="button" className="shop-link" onClick={() => shopping.addToBag(product.id)} disabled={shopping.cart.some(item => item.id === product.id && item.quantity >= 10)}>{shopping.cart.some(item => item.id === product.id) ? 'Add another' : 'Add to bag'}</button><button type="button" className="shop-save" aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} ${product.brand} ${product.model}`} onClick={() => shopping.toggleSaved(product.id)}>{saved ? '♥' : '♡'}</button></div>
    </div>
  </article>;
}

function SearchPanel({ shopping, onView }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const search = useRef(null);
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = shopProducts.filter(product => (type === 'All' || product.type === type) && terms.every(term => productSearchText(product).includes(term)));
  useEffect(() => { search.current?.focus(); }, []);
  const selectQuery = value => { setQuery(value); shopping.rememberSearch(value); search.current?.focus(); };
  const view = product => { shopping.rememberSearch(query); onView(product); };
  return <>
    <p className="shop-intro">A new point of view starts here. Search glasses, contact lenses and accessories.</p>
    <form className="shop-search" role="search" onSubmit={event => { event.preventDefault(); shopping.rememberSearch(query); }}>
      <label className="shop-sr-only" htmlFor="frame-search">Search by brand, model, colour or type</label>
      <input ref={search} id="frame-search" type="search" value={query} maxLength={80} onChange={event => setQuery(event.target.value)} placeholder="Try Burberry, black or sunglasses" autoComplete="off" />
      <button type="submit" className="shop-primary">Search</button>
    </form>
    <div className="shop-chips" role="group" aria-label="Filter product type">{['All', 'Eyeglasses', 'Sunglasses', 'Contact lenses', 'Accessories'].map(value => <button key={value} type="button" aria-pressed={type === value} onClick={() => setType(value)}>{value}</button>)}</div>
    {!query && <div className="shop-suggestions"><div className="shop-section-label"><h3>{shopping.recent.length ? 'Recent searches' : 'Try a search'}</h3>{shopping.recent.length > 0 && <button type="button" className="shop-link" onClick={shopping.clearRecent}>Clear history</button>}</div><div className="shop-chips">{(shopping.recent.length ? shopping.recent : ['Burberry', 'Black', 'Junior']).map(value => <button type="button" key={value} onClick={() => selectQuery(value)}>{value}<span aria-hidden="true"> ↗</span></button>)}</div></div>}
    <div className="shop-section-label"><h3>{query ? 'Your search results' : 'Explore the collection'}</h3><span role="status" aria-live="polite">{results.length} {results.length === 1 ? 'product' : 'products'}</span></div>
    {results.length ? <div className="shop-results">{results.map(product => <FrameResult key={product.id} product={product} shopping={shopping} onView={view} />)}</div> : <div className="shop-empty"><span aria-hidden="true">↗</span><h3>No products found</h3><p>Try a brand, colour or model, or browse the full selection.</p><button type="button" className="shop-primary" onClick={() => { setQuery(''); setType('All'); search.current?.focus(); }}>Show all products</button></div>}
  </>;
}

export default function ShoppingPanels({ panel, onClose, onOpenCart, shopping, onView }) {
  const dialog = useRef(null);
  const isOpen = Boolean(panel);
  useEffect(() => {
    if (!isOpen) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    modal.showModal();
    modal.querySelector('input[type="search"]')?.focus();
    document.body.style.overflow = 'hidden';
    return () => { modal.close(); document.body.style.overflow = previousOverflow; };
  }, [isOpen]);
  return <dialog id="shopping-panel" ref={dialog} className={`shop-panel${panel === 'search' ? ' shop-panel--search' : ''}`} aria-labelledby="shop-panel-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.target === event.currentTarget && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) onClose();
  }}>
    {panel && <><header className="shop-panel__header"><div><p className="shop-eyebrow">CANDICLIE / YOUR EVERYDAY</p><h2 id="shop-panel-title">Find your next favourite.</h2></div><button type="button" className="shop-close" aria-label="Close search" onClick={onClose}>×</button></header>
      <div className="shop-panel__body"><SearchPanel shopping={shopping} onView={onView} /></div>
      <footer className="shop-panel__footer"><span role="status" aria-live="polite">{shopping.storageUnavailable ? 'Browser storage is unavailable. Changes last for this visit.' : 'Your bag, saved items and preferences stay in this browser.'}</span><button type="button" className="shop-link" onClick={onOpenCart}>View bag ({shopping.bagCount}) ↗</button></footer>
    </>}
  </dialog>;
}
