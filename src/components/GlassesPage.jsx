import { useEffect, useRef, useState } from 'react';
import { currency } from './shopProducts.js';
import { audienceLabels, shapeOptions, priceOptions, sortOptions, colourValues, productColour, collectionPath, collectionProducts, filterProducts, followCollectionLink, productImage } from './glassesCatalog.js';
import GlassesFeed from './GlassesFeed.jsx';
import './GlassesPage.css';

function Icon({ name, ...props }) {
  const paths = {
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    filter: <><path d="M4 7h7m5 0h4M4 17h3m5 0h8" /><circle cx="13.5" cy="7" r="2.5" /><circle cx="9.5" cy="17" r="2.5" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    glasses: <><rect x="2" y="8" width="8" height="7" rx="3" /><rect x="14" y="8" width="8" height="7" rx="3" /><path d="M10 10c1-2 3-2 4 0M2 9l1-5m19 5-1-5" /></>,
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

function CollectionLink({ href, onNavigate, children, ...props }) {
  return <a href={href} onClick={event => followCollectionLink(event, href, onNavigate)} {...props}>{children}</a>;
}

function FilterDrawer({ open, onClose, route, products, resultsCount, update, reset }) {
  const dialog = useRef(null);
  const { params } = route;
  useEffect(() => {
    if (!open) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    modal.showModal();
    document.body.style.overflow = 'hidden';
    return () => { modal.close(); document.body.style.overflow = previousOverflow; };
  }, [open]);
  const options = [
    ['brand', 'Brand', [...new Set(products.map(product => product.brand))].sort()],
    ['shape', 'Frame shape', shapeOptions.filter(shape => products.some(product => product.shape === shape))],
    ['colour', 'Frame colour', [...new Set(products.map(productColour))].sort()],
    ['rim', 'Frame style', [...new Set(products.map(product => product.rim))].sort()],
  ];
  return <dialog ref={dialog} className="glasses-filters" aria-labelledby="glasses-filter-heading" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }}>
    <header className="glasses-filters__heading"><div><p className="glasses-eyebrow">MAKE IT YOUR OWN</p><h2 id="glasses-filter-heading">Sort & filter</h2></div><button className="glasses-icon-button" type="button" aria-label="Close filters" onClick={onClose}><Icon name="close" /></button></header>
    <div className="glasses-filters__body">
      <label className="glasses-filters__sort" htmlFor="glasses-sort">Sort by<select id="glasses-sort" value={params.get('sort') || 'recommended'} onChange={event => update('sort', event.target.value)}>{sortOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      {options.map(([key, title, values]) => <details key={key} className="glasses-filter-group" open><summary>{title}<span aria-hidden="true">+</span></summary><div className={key === 'colour' ? 'glasses-filter-options glasses-filter-options--colours' : 'glasses-filter-options'}>{values.map(value => <label className="glasses-filter-option" key={value}><input type="checkbox" checked={params.getAll(key).includes(value)} onChange={() => update(key, value, true)} />{key === 'colour' && <span className="glasses-colour" style={{ background: colourValues[value] }} />}<span>{value}</span></label>)}</div></details>)}
      <fieldset className="glasses-price-filter"><legend>Frame price</legend>{[{ value: '', label: 'All prices' }, ...priceOptions].map(({ value, label }) => <label className="glasses-filter-option" key={value}><input type="radio" name="frame-price" value={value} checked={(params.get('price') || '') === value} onChange={() => update('price', value)} /><span>{label}</span></label>)}</fieldset>
    </div>
    <footer className="glasses-filters__footer"><button className="glasses-text-button" type="button" onClick={reset}>Clear all</button><button className="glasses-button" type="button" onClick={onClose}>Show {resultsCount} {resultsCount === 1 ? 'frame' : 'frames'}<Icon name="arrow" /></button></footer>
  </dialog>;
}

function FrameCard({ product, shopping, onView, priority }) {
  const saved = shopping.saved.includes(product.id);
  const colour = productColour(product);
  return <article className="glasses-card">
    <div className="glasses-card__visual">
      <span className="glasses-card__tag">{product.isNew ? 'THE NEW EDIT' : product.audiences.includes('kids') ? 'JUNIOR EDIT' : product.type}</span>
      <button className="glasses-card__save glasses-icon-button" type="button" aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} ${product.brand} ${product.model}`} onClick={() => shopping.toggleSaved(product.id)}><Icon name="heart" fill={saved ? 'currentColor' : 'none'} /></button>
      <button className="glasses-card__image" type="button" onClick={() => onView(product)} aria-label={`View ${product.brand} ${product.model}`}>
        <img src={productImage(product)} srcSet={product.imageLarge ? `${product.image} 640w, ${product.imageLarge} 1000w` : undefined} sizes="(max-width: 600px) 46vw, (max-width: 1000px) 44vw, 29vw" width="640" height="400" alt={`${product.brand} ${product.model}, ${product.colour}`} loading={priority ? 'eager' : 'lazy'} decoding="async" />
        {product.imageAlt && <img className="glasses-card__alternate" src={product.imageAlt} width="640" height="400" alt="" loading="lazy" decoding="async" />}
        <span className="glasses-card__quick-view">Take a closer look<Icon name="arrow" /></span>
      </button>
    </div>
    <div className="glasses-card__copy">
      <button className="glasses-card__title" type="button" onClick={() => onView(product)}><h2>{product.brand}</h2><span>{product.model}</span></button>
      <p className="glasses-card__description">{product.shape} <span aria-hidden="true">·</span> {product.rim}</p>
      <div className="glasses-card__colour"><span className="glasses-colour" style={{ background: colourValues[colour] }} /><span>{product.colour}</span></div>
      <div className="glasses-card__bottom"><strong>{currency.format(product.price)}</strong><button type="button" onClick={() => onView(product)}>View frame<Icon name="arrow" /></button></div>
    </div>
  </article>;
}

const descriptions = {
  men: 'Clean lines. Considered details. Frames that make your everyday look your own.',
  women: 'Soft curves, bold silhouettes and a little individuality. Find your fresh perspective.',
  kids: 'Little frames. Big character. Discover colourful styles for their everyday adventures.',
  Sunglasses: 'A brighter outlook. Explore classic silhouettes and statement shades for days in the sun.',
  Eyeglasses: 'Your everyday essential, with a point of view. Discover a frame that feels like you.',
};

export default function GlassesPage({ route, shopping, onNavigate, onView }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState(route.params.get('q') || '');
  const products = collectionProducts(route);
  const results = filterProducts(products, route.params, shopping.saved);
  const { params } = route;
  useEffect(() => { setQuery(new URLSearchParams(route.search).get('q') || ''); }, [route.pathname, route.search]);
  useEffect(() => { setFiltersOpen(false); }, [route.pathname]);
  const update = (key, value, multiple = false) => {
    const next = new URLSearchParams(route.search);
    if (multiple) {
      const values = next.getAll(key);
      next.delete(key);
      (values.includes(value) ? values.filter(item => item !== value) : [...values, value]).forEach(item => next.append(key, item));
    } else {
      next.delete(key);
      if (value && !(key === 'sort' && value === 'recommended')) next.set(key, value);
    }
    onNavigate(`${route.pathname}${next.size ? `?${next}` : ''}`, { scroll: false });
  };
  const reset = () => onNavigate(`${route.pathname}${params.get('sort') ? `?sort=${encodeURIComponent(params.get('sort'))}` : ''}`, { scroll: false });
  const active = [...params.entries()].filter(([key]) => ['brand', 'shape', 'colour', 'rim', 'price', 'q'].includes(key));
  const heroDescription = descriptions[route.audience] || descriptions[route.type] || (route.isNew ? 'A new mood. A different detail. Meet the frames in our latest curated edit.' : 'Everyday essentials. Unexpected favourites. Explore eyeglasses and sunglasses for every side of you.');
  const collectionCount = products.length;

  return <div className="glasses-page">
    <section className="glasses-heading" aria-labelledby="glasses-title">
      <nav className="glasses-breadcrumbs" aria-label="Breadcrumb"><ol><li><CollectionLink href="/" onNavigate={onNavigate}>Home</CollectionLink></li><li>{route.pathname === '/eyewear' ? <span aria-current="page">Glasses</span> : <CollectionLink href="/eyewear" onNavigate={onNavigate}>Glasses</CollectionLink>}</li>{route.type && <li>{route.audience ? <CollectionLink href={collectionPath(route.type)} onNavigate={onNavigate}>{route.type}</CollectionLink> : <span aria-current="page">{route.type}</span>}</li>}{(route.audience || route.isNew) && <li><span aria-current="page">{route.label}</span></li>}</ol></nav>
      <div className="glasses-heading__main"><div><p className="glasses-eyebrow">THE CANDICLIE COLLECTION</p><h1 id="glasses-title">{route.title}</h1><p className="glasses-heading__description">{heroDescription}</p></div><span className="glasses-heading__count">{collectionCount} {collectionCount === 1 ? 'frame' : 'frames'} to make your own</span></div>
      <nav className="glasses-types" aria-label="Glasses collections">{[['', 'All glasses'], ['Eyeglasses', 'Eyeglasses'], ['Sunglasses', 'Sunglasses'], ['new', 'New in']].map(([type, label]) => {
        const href = type === 'new' ? `/eyewear/new-in${route.audience ? `/${route.audience}` : ''}` : collectionPath(type, route.audience);
        const current = type === 'new' ? route.isNew : !route.isNew && route.type === type;
        return <CollectionLink key={type} href={href} onNavigate={onNavigate} aria-current={current ? 'page' : undefined}>{label}</CollectionLink>;
      })}</nav>
    </section>

    <section className="glasses-collection" aria-label="Browse frames">
      <div className="glasses-toolbar">
        <nav className="glasses-audiences" aria-label="Shop by audience">{[['', 'Everyone'], ...Object.entries(audienceLabels)].map(([audience, label]) => <CollectionLink key={audience} href={route.isNew ? `/eyewear/new-in${audience ? `/${audience}` : ''}` : collectionPath(route.type, audience)} onNavigate={onNavigate} aria-current={route.audience === audience ? 'page' : undefined}>{label}</CollectionLink>)}</nav>
        <div className="glasses-toolbar__actions"><button type="button" className={`glasses-saved${params.get('saved') === '1' ? ' glasses-saved--active' : ''}`} aria-pressed={params.get('saved') === '1'} onClick={() => update('saved', params.get('saved') === '1' ? '' : '1')}><Icon name="heart" /><span>Saved</span></button><button className="glasses-button glasses-filter-trigger" type="button" onClick={() => setFiltersOpen(true)} aria-haspopup="dialog"><Icon name="filter" />Sort & filter{active.filter(([key]) => key !== 'q').length > 0 && <span className="glasses-filter-count">{active.filter(([key]) => key !== 'q').length}</span>}</button></div>
      </div>
      <div className="glasses-results-toolbar"><p role="status" aria-live="polite">{results.length} {results.length === 1 ? 'frame' : 'frames'}{params.get('saved') === '1' ? ' saved in this collection' : ' in your selection'}</p><form className="glasses-search" role="search" onSubmit={event => { event.preventDefault(); update('q', query.trim()); }}><label className="glasses-sr-only" htmlFor="glasses-search">Search this collection</label><input id="glasses-search" type="search" placeholder="Search this collection" maxLength={80} value={query} onChange={event => { setQuery(event.target.value); if (!event.target.value) update('q', ''); }} /><button type="submit" aria-label="Search collection"><Icon name="search" /></button></form></div>
      {active.length > 0 && <div className="glasses-active-filters" aria-label="Active filters">{active.map(([key, value]) => <button type="button" key={`${key}-${value}`} onClick={() => update(key, ['brand', 'shape', 'colour', 'rim'].includes(key) ? value : '', ['brand', 'shape', 'colour', 'rim'].includes(key))} aria-label={`Remove ${key}: ${value}`}>{key === 'price' ? priceOptions.find(option => option.value === value)?.label || value : key === 'q' ? `“${value}”` : value}<Icon name="close" /></button>)}<button type="button" className="glasses-text-button" onClick={reset}>Clear all</button></div>}
      {results.length > 0 ? <GlassesFeed key={`${route.pathname}${route.search}:${results.map(product => product.id).join(',')}`} products={results} order={params.get('sort')} repeat={params.get('saved') !== '1'} renderFrame={(product, index) => <FrameCard product={product} shopping={shopping} onView={onView} priority={index < 3} />} /> : <div className="glasses-empty"><Icon name="glasses" width="64" height="64" /><p className="glasses-eyebrow">A DIFFERENT POINT OF VIEW</p><h2>{params.get('saved') === '1' ? 'Your favourites start here.' : 'Let’s find a different frame.'}</h2><p>{params.get('saved') === '1' ? 'Tap the heart on a frame to save it, then find it here.' : 'No frames match this combination. Try fewer filters or explore another collection.'}</p><button type="button" className="glasses-button" onClick={() => onNavigate(route.pathname, { scroll: false })}>{params.get('saved') === '1' ? 'Browse this collection' : 'Clear filters'}<Icon name="arrow" /></button><CollectionLink href="/eyewear" onNavigate={onNavigate}>Explore all glasses</CollectionLink></div>}
    </section>

    <FilterDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} route={route} products={products} resultsCount={results.length} update={update} reset={reset} />
  </div>;
}
