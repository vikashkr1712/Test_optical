import { useEffect, useState } from 'react';
import { currency } from './shopProducts.js';
import { colourValues, catalogImageSizes } from './glassesCatalog.js';
import { Icon, CollectionLink, FilterDrawer } from './GlassesPage.jsx';
import GlassesFeed from './GlassesFeed.jsx';
import { accessoryCollections, accessoryPriceOptions, accessorySortOptions, accessoryFilterKeys, accessoryCollectionProducts, filterAccessories } from './accessoriesCatalog.js';
import './AccessoriesPage.css';
import useSwipe from './useSwipe.js';

function AccessoryCard({ product, shopping, onView, priority }) {
  const [alternate, setAlternate] = useState(false);
  const imageSwipe = useSwipe({ enabled: Boolean(product.imageAlt), onSwipe: () => setAlternate(value => !value) });
  const saved = shopping.saved.includes(product.id);
  const name = `${product.model}${product.colour ? `, ${product.colour}` : ''}`;
  return <article className="glasses-card accessories-card">
    <div className="glasses-card__visual">
      <span className="glasses-card__tag">{product.category}</span>
      <button className="glasses-card__save glasses-icon-button" type="button" aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} ${name}`} onClick={() => shopping.toggleSaved(product.id)}><Icon name="heart" fill={saved ? 'currentColor' : 'none'} /></button>
      <button className="glasses-card__image" type="button" onClick={() => onView(product)} aria-label={`View ${name}`} data-alternate={alternate} {...imageSwipe}>
        <img src={product.image} srcSet={`${product.image} 640w, ${product.imageLarge} 1000w`} sizes={catalogImageSizes} width="640" height="400" alt={name} loading={priority ? 'eager' : 'lazy'} decoding="async" draggable="false" />
        {product.imageAlt && <img className="glasses-card__alternate" src={product.imageAlt} width="640" height="400" alt="" loading="lazy" decoding="async" />}
        <span className="glasses-card__quick-view">Take a closer look<Icon name="arrow" /></span>
      </button>
    </div>
    <div className="glasses-card__copy">
      <button className="glasses-card__title" type="button" onClick={() => onView(product)}><h2>{product.model}</h2><span>{product.category}</span></button>
      <p className="glasses-card__description">{product.capacity || product.detailsLabel}</p>
      {product.colour && <div className="glasses-card__colour"><span className="glasses-colour" style={{ background: colourValues[product.colour] }} /><span>{product.colour}</span></div>}
      <div className="glasses-card__bottom"><strong>{currency.format(product.price)}</strong><button type="button" onClick={() => onView(product)}>View item<Icon name="arrow" /></button></div>
    </div>
  </article>;
}

export default function AccessoriesPage({ route, shopping, onNavigate, onView }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState(route.params.get('q') || '');
  const { params } = route;
  const products = accessoryCollectionProducts(route);
  const results = filterAccessories(products, params, shopping.saved);
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
  const active = [...params.entries()].filter(([key]) => accessoryFilterKeys.includes(key));
  const options = [['category', 'Product type'], ['colour', 'Colour'], ['capacity', 'Storage capacity']].map(([key, label]) => [key, label, [...new Set(products.map(product => product[key]).filter(Boolean))].sort()]).filter(([, , values]) => values.length);
  return <div className="glasses-page accessories-page">
    <section className="glasses-heading" aria-labelledby="accessories-title">
      <nav className="glasses-breadcrumbs" aria-label="Breadcrumb"><ol><li><CollectionLink href="/" onNavigate={onNavigate}>Home</CollectionLink></li><li>{route.slug ? <CollectionLink href="/accessories" onNavigate={onNavigate}>Care & Accessories</CollectionLink> : <span aria-current="page">Care & Accessories</span>}</li>{route.slug && <li><span aria-current="page">{route.label}</span></li>}</ol></nav>
      <div className="glasses-heading__main"><div><p className="glasses-eyebrow">THE CANDICLIE ESSENTIALS</p><h1 id="accessories-title">{route.title}</h1><p className="glasses-heading__description">{route.description}</p></div><span className="glasses-heading__count">{products.length} {products.length === 1 ? 'essential' : 'essentials'} to explore</span></div>
      <nav className="glasses-types" aria-label="Accessory collections">{accessoryCollections.map(([slug, label]) => <CollectionLink key={slug} href={`/accessories${slug ? `/${slug}` : ''}`} onNavigate={onNavigate} aria-current={route.slug === slug ? 'page' : undefined}>{label}</CollectionLink>)}</nav>
    </section>
    <section className="glasses-collection" aria-label="Browse care and accessories">
      <div className="glasses-toolbar">
        <nav className="glasses-audiences" aria-label="Accessory colours">{[['', 'All colours'], ...[...new Set(products.map(product => product.colour).filter(Boolean))].sort().map(colour => [colour, colour])].map(([colour, label]) => <button key={colour} type="button" aria-pressed={colour ? params.getAll('colour').length === 1 && params.get('colour') === colour : !params.getAll('colour').length} onClick={() => update('colour', colour)}>{label}</button>)}</nav>
        <div className="glasses-toolbar__actions"><button type="button" className={`glasses-saved${params.get('saved') === '1' ? ' glasses-saved--active' : ''}`} aria-label="Saved accessories" aria-pressed={params.get('saved') === '1'} onClick={() => update('saved', params.get('saved') === '1' ? '' : '1')}><Icon name="heart" /><span>Saved</span></button><button className="glasses-button glasses-filter-trigger" type="button" onClick={() => setFiltersOpen(true)} aria-haspopup="dialog"><Icon name="filter" />Sort & filter{active.filter(([key]) => key !== 'q').length > 0 && <span className="glasses-filter-count">{active.filter(([key]) => key !== 'q').length}</span>}</button></div>
      </div>
      <div className="glasses-results-toolbar"><p role="status" aria-live="polite">{results.length} {results.length === 1 ? 'item' : 'items'}{params.get('saved') === '1' ? ' saved in this collection' : ' in your selection'}</p><form className="glasses-search" role="search" onSubmit={event => { event.preventDefault(); update('q', query.trim()); }}><label className="glasses-sr-only" htmlFor="accessories-search">Search this accessory collection</label><input id="accessories-search" type="search" placeholder="Search this collection" maxLength={80} value={query} onChange={event => { setQuery(event.target.value); if (!event.target.value) update('q', ''); }} /><button type="submit" aria-label="Search accessory collection"><Icon name="search" /></button></form></div>
      {active.length > 0 && <div className="glasses-active-filters" aria-label="Active filters">{active.map(([key, value]) => <button type="button" key={`${key}-${value}`} onClick={() => update(key, ['price', 'q'].includes(key) ? '' : value, !['price', 'q'].includes(key))} aria-label={`Remove ${key}: ${value}`}>{key === 'price' ? accessoryPriceOptions.find(option => option.value === value)?.label || value : key === 'q' ? `“${value}”` : value}<Icon name="close" /></button>)}<button type="button" className="glasses-text-button" onClick={reset}>Clear all</button></div>}
      {results.length ? <GlassesFeed key={`${route.pathname}${route.search}:${results.map(product => product.id).join(',')}`} products={results} order={params.get('sort')} repeat={params.get('saved') !== '1'} loadingLabel="Loading more accessories" renderFrame={(product, index) => <AccessoryCard product={product} shopping={shopping} onView={onView} priority={index < 3} />} /> : <div className="glasses-empty"><p className="glasses-eyebrow">THE EVERYDAY DETAILS</p><h2>{params.get('saved') === '1' ? 'Your favourites start here.' : 'Let’s find another essential.'}</h2><p>{params.get('saved') === '1' ? 'Tap the heart on an accessory to save it, then find it here.' : 'No accessories match this combination. Try fewer filters or explore another collection.'}</p><button type="button" className="glasses-button" onClick={() => onNavigate(route.pathname, { scroll: false })}>{params.get('saved') === '1' ? 'Browse this collection' : 'Clear filters'}<Icon name="arrow" /></button><CollectionLink href="/accessories" onNavigate={onNavigate}>Explore all accessories</CollectionLink></div>}
    </section>
    <FilterDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} route={route} products={products} resultsCount={results.length} update={update} reset={reset} filterOptions={options} priceRanges={accessoryPriceOptions} sortChoices={accessorySortOptions} noun="item" priceLabel="Item price" />
  </div>;
}
