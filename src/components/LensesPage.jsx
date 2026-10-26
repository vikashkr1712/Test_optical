import { useEffect, useState } from 'react';
import { currency } from './shopProducts.js';
import { colourValues, catalogImageSizes } from './glassesCatalog.js';
import { Icon, CollectionLink, FilterDrawer } from './GlassesPage.jsx';
import GlassesFeed from './GlassesFeed.jsx';
import { lensCollections, lensPriceOptions, lensSortOptions, lensFilterKeys, lensCollectionProducts, filterLenses } from './lensesCatalog.js';
import './LensesPage.css';

function LensCard({ product, shopping, onView, priority }) {
  const saved = shopping.saved.includes(product.id);
  return <article className="glasses-card lens-card">
    <div className="glasses-card__visual">
      <span className="glasses-card__tag">{product.replacement ? `${product.replacement} lenses` : 'Contact lenses'}</span>
      <button className="glasses-card__save glasses-icon-button" type="button" aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} ${product.brand} ${product.model}`} onClick={() => shopping.toggleSaved(product.id)}><Icon name="heart" fill={saved ? 'currentColor' : 'none'} /></button>
      <button className="glasses-card__image" type="button" onClick={() => onView(product)} aria-label={`View ${product.brand} ${product.model}`}>
        <img src={product.image} srcSet={`${product.image} 640w, ${product.imageLarge} 1000w`} sizes={catalogImageSizes} width="640" height="400" alt={`${product.brand} ${product.model} contact lens pack`} loading={priority ? 'eager' : 'lazy'} decoding="async" />
        <span className="glasses-card__quick-view">Take a closer look<Icon name="arrow" /></span>
      </button>
    </div>
    <div className="glasses-card__copy">
      <button className="glasses-card__title" type="button" onClick={() => onView(product)}><h2>{product.brand}</h2><span>{product.model}</span></button>
      <p className="glasses-card__description">{product.designs.length ? product.designs.join(' · ') : product.coloured ? 'Coloured contact lenses' : 'Contact lenses'}{product.pack && <> <span aria-hidden="true">·</span> {product.pack}</>}</p>
      <div className="glasses-card__colour">{product.coloured && <span className="glasses-colour" style={{ background: colourValues[product.colour] || '#c3b598' }} />}<span>{product.colour === 'Clear' ? 'Clear lenses' : product.colour}</span></div>
      <div className="glasses-card__bottom"><strong>{currency.format(product.price)}</strong><button type="button" onClick={() => onView(product)}>View lenses<Icon name="arrow" /></button></div>
    </div>
  </article>;
}

export default function LensesPage({ route, shopping, onNavigate, onView }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState(route.params.get('q') || '');
  const { params } = route;
  const products = lensCollectionProducts(route);
  const results = filterLenses(products, params, shopping.saved);
  useEffect(() => { setQuery(new URLSearchParams(route.search).get('q') || ''); }, [route.pathname, route.search]);
  useEffect(() => { setFiltersOpen(false); }, [route.pathname]);
  const update = (key, value, multiple = false) => {
    const next = new URLSearchParams(route.search);
    const values = next.getAll(key);
    next.delete(key);
    if (multiple) (values.includes(value) ? values.filter(item => item !== value) : [...values, value]).forEach(item => next.append(key, item));
    else if (value && !(key === 'sort' && value === 'recommended')) next.set(key, value);
    onNavigate(`${route.pathname}${next.size ? `?${next}` : ''}`, { scroll: false });
  };
  const reset = () => onNavigate(`${route.pathname}${params.get('sort') ? `?sort=${encodeURIComponent(params.get('sort'))}` : ''}`, { scroll: false });
  const active = [...params.entries()].filter(([key]) => lensFilterKeys.includes(key));
  const options = [['brand', 'Lens brand'], ['manufacturer', 'Manufacturer'], ['replacement', 'Replacement schedule'], ['design', 'Lens design'], ['colour', 'Lens colour'], ['pack', 'Pack size']].map(([key, label]) => [key, label, [...new Set(products.flatMap(product => key === 'design' ? product.designs : [product[key]]).filter(Boolean))].sort()]).filter(([, , values]) => values.length);
  return <div className="glasses-page lenses-page">
    <section className="glasses-heading" aria-labelledby="lenses-title">
      <nav className="glasses-breadcrumbs" aria-label="Breadcrumb"><ol><li><CollectionLink href="/" onNavigate={onNavigate}>Home</CollectionLink></li><li>{route.slug ? <CollectionLink href="/contact-lenses" onNavigate={onNavigate}>Contact lenses</CollectionLink> : <span aria-current="page">Contact lenses</span>}</li>{route.slug && <li><span aria-current="page">{route.label}</span></li>}</ol></nav>
      <div className="glasses-heading__main"><div><p className="glasses-eyebrow">THE CANDICLIE LENS COLLECTION</p><h1 id="lenses-title">{route.title}</h1><p className="glasses-heading__description">{route.description}</p></div><span className="glasses-heading__count">{products.length} lens options to explore</span></div>
      <nav className="glasses-types" aria-label="Contact lens collections">{lensCollections.slice(0, 5).map(([slug, label]) => <CollectionLink key={slug} href={`/contact-lenses${slug ? `/${slug}` : ''}`} onNavigate={onNavigate} aria-current={route.slug === slug ? 'page' : undefined}>{label}</CollectionLink>)}</nav>
    </section>
    <section className="glasses-collection" aria-label="Browse contact lenses">
      <div className="glasses-toolbar">
        <nav className="glasses-audiences" aria-label="Lens types">{[['', 'All types'], ['spherical', 'Spherical'], ['toric', 'Toric'], ['multifocal', 'Multifocal']].map(([slug, label]) => <CollectionLink key={slug} href={`/contact-lenses${slug ? `/${slug}` : ''}`} onNavigate={onNavigate} aria-current={route.slug === slug ? 'page' : undefined}>{label}</CollectionLink>)}</nav>
        <div className="glasses-toolbar__actions"><button type="button" className={`glasses-saved${params.get('saved') === '1' ? ' glasses-saved--active' : ''}`} aria-label="Saved lenses" aria-pressed={params.get('saved') === '1'} onClick={() => update('saved', params.get('saved') === '1' ? '' : '1')}><Icon name="heart" /><span>Saved</span></button><button className="glasses-button glasses-filter-trigger" type="button" onClick={() => setFiltersOpen(true)} aria-haspopup="dialog"><Icon name="filter" />Sort & filter{active.filter(([key]) => key !== 'q').length > 0 && <span className="glasses-filter-count">{active.filter(([key]) => key !== 'q').length}</span>}</button></div>
      </div>
      <div className="glasses-results-toolbar"><p role="status" aria-live="polite">{results.length} {results.length === 1 ? 'product' : 'products'}{params.get('saved') === '1' ? ' saved in this collection' : ' in your selection'}</p><form className="glasses-search" role="search" onSubmit={event => { event.preventDefault(); update('q', query.trim()); }}><label className="glasses-sr-only" htmlFor="lenses-search">Search this lens collection</label><input id="lenses-search" type="search" placeholder="Search this collection" maxLength={80} value={query} onChange={event => { setQuery(event.target.value); if (!event.target.value) update('q', ''); }} /><button type="submit" aria-label="Search lens collection"><Icon name="search" /></button></form></div>
      {active.length > 0 && <div className="glasses-active-filters" aria-label="Active filters">{active.map(([key, value]) => <button type="button" key={`${key}-${value}`} onClick={() => update(key, ['price', 'q'].includes(key) ? '' : value, !['price', 'q'].includes(key))} aria-label={`Remove ${key}: ${value}`}>{key === 'price' ? lensPriceOptions.find(option => option.value === value)?.label || value : key === 'q' ? `“${value}”` : value}<Icon name="close" /></button>)}<button type="button" className="glasses-text-button" onClick={reset}>Clear all</button></div>}
      {results.length ? <GlassesFeed key={`${route.pathname}${route.search}:${results.map(product => product.id).join(',')}`} products={results} order={params.get('sort')} repeat={params.get('saved') !== '1'} loadingLabel="Loading more contact lenses" renderFrame={(product, index) => <LensCard product={product} shopping={shopping} onView={onView} priority={index < 3} />} /> : <div className="glasses-empty"><p className="glasses-eyebrow">A FRESH POINT OF VIEW</p><h2>{params.get('saved') === '1' ? 'Your favourites start here.' : 'Let’s find another lens.'}</h2><p>{params.get('saved') === '1' ? 'Tap the heart on a lens to save it, then find it here.' : 'No contact lenses match this combination. Try fewer filters or another collection.'}</p><button type="button" className="glasses-button" onClick={() => onNavigate(route.pathname, { scroll: false })}>{params.get('saved') === '1' ? 'Browse this collection' : 'Clear filters'}<Icon name="arrow" /></button><CollectionLink href="/contact-lenses" onNavigate={onNavigate}>Explore all contact lenses</CollectionLink></div>}
    </section>
    <FilterDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} route={route} products={products} resultsCount={results.length} update={update} reset={reset} filterOptions={options} priceRanges={lensPriceOptions} sortChoices={lensSortOptions} noun="product" priceLabel="Pack price" />
  </div>;
}
