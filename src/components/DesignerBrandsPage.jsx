import { useEffect, useState } from 'react';
import { CollectionLink, Icon } from './GlassesPage.jsx';
import { brandMatchesType, designerBrands, designerTypes, featuredDesignerBrands, filterDesignerBrands } from './designerBrands.js';
import './DesignerBrandsPage.css';

export default function DesignerBrandsPage({ route, onNavigate }) {
  const { params } = route;
  const [query, setQuery] = useState(params.get('q') || '');
  useEffect(() => { setQuery(new URLSearchParams(route.search).get('q') || ''); }, [route.search]);
  const results = filterDesignerBrands(params);
  const letters = new Set(designerBrands.filter(brand => brandMatchesType(brand, params.get('type'))).map(brand => brand.title[0].toUpperCase()));
  const update = (key, value) => {
    const next = new URLSearchParams(route.search);
    next.delete(key);
    if (value) next.set(key, value);
    if (key !== 'letter') next.delete('letter');
    onNavigate(`/designer-brands${next.size ? `?${next}` : ''}`, { scroll: false });
  };
  const linkFor = brand => `${brand.catalogHref}${params.get('type') === 'kids' ? '/kids' : ['eyeglasses', 'sunglasses'].includes(params.get('type')) ? `/${params.get('type')}` : ''}`;

  if (route.unknown) return <div className="glasses-page designers-page"><section className="glasses-empty"><p className="glasses-eyebrow">FIND A FRESH PERSPECTIVE</p><h1>Let’s find your brand.</h1><p>This brand collection is not in our directory. Browse the full selection to find your next frame.</p><CollectionLink href="/designer-brands" className="glasses-button" onNavigate={onNavigate}>Explore all brands<Icon name="arrow" /></CollectionLink></section></div>;

  return <div className="glasses-page designers-page">
    <section className="designers-intro" aria-labelledby="designers-title">
      <nav className="glasses-breadcrumbs" aria-label="Breadcrumb"><ol><li><CollectionLink href="/" onNavigate={onNavigate}>Home</CollectionLink></li><li><span aria-current="page">Designer Brands</span></li></ol></nav>
      <div className="designers-intro__layout">
        <div className="designers-intro__copy"><p className="glasses-eyebrow">THE CANDICLIE BRAND DIRECTORY</p><h1 id="designers-title">A name.<br /><em>Your point of view.</em></h1><p>From distinctive designer frames to everyday favourites. Find a name you love, then make the look your own.</p><a href="#brand-directory" className="designers-intro__cta">Explore all {designerBrands.length} brands<Icon name="arrow" /></a><div className="designers-intro__numbers"><span><strong>{designerBrands.length}</strong> brands to discover</span><span><strong>{designerBrands.reduce((total, brand) => total + brand.count, 0)}</strong> frames to explore</span></div></div>
        <div className="designers-intro__portraits">{[featuredDesignerBrands[0], featuredDesignerBrands[2]].map((brand, index) => <CollectionLink key={brand.slug} href={brand.catalogHref} onNavigate={onNavigate} className={`designers-portrait designers-portrait--${index + 1}`} aria-label={`Explore ${brand.title}`}><span className="designers-portrait__name">{brand.title}</span><img {...brand.media} sizes="(max-width: 767px) 45vw, 25vw" fetchPriority="high" /><span className="designers-portrait__caption">A CLOSER LOOK<Icon name="arrow" /></span></CollectionLink>)}</div>
      </div>
    </section>

    <section className="designers-featured" aria-labelledby="designers-featured-title"><div className="designers-section-heading"><div><p className="glasses-eyebrow">A FEW NAMES TO KNOW</p><h2 id="designers-featured-title">Find your signature.</h2></div><p className="designers-swipe-hint">Swipe to discover</p></div>
      <div className="designers-featured__rail" role="region" aria-label="Featured designer brands" tabIndex="0">{featuredDesignerBrands.slice(0, 4).map(brand => <CollectionLink className="designers-featured-card" key={brand.slug} href={brand.catalogHref} onNavigate={onNavigate}><div className="designers-featured-card__image"><img {...brand.media} sizes="(max-width: 767px) 85vw, (max-width: 1199px) 44vw, 23vw" loading="lazy" decoding="async" /></div><div className="designers-featured-card__copy"><h3>{brand.title}</h3><span>{brand.count} {brand.count === 1 ? 'frame' : 'frames'}<Icon name="arrow" /></span></div><p>{brand.line}</p></CollectionLink>)}</div>
    </section>

    <section id="brand-directory" className="designers-directory" aria-labelledby="brand-directory-title">
      <div className="designers-section-heading"><div><p className="glasses-eyebrow">DESIGNERS & EVERYDAY LABELS</p><h2 id="brand-directory-title">Your brand, A to Z.</h2></div><form role="search" className="glasses-search" onSubmit={event => { event.preventDefault(); update('q', query.trim()); }}><label htmlFor="designer-search" className="glasses-sr-only">Search brands</label><input id="designer-search" type="search" placeholder="Find a brand" maxLength={80} value={query} onChange={event => { setQuery(event.target.value); if (!event.target.value) update('q', ''); }} /><button type="submit" aria-label="Search brands"><Icon name="search" /></button></form></div>
      <nav className="designers-type-tabs" aria-label="Browse brands by frame type">{designerTypes.map(([value, label]) => <button type="button" key={value} aria-pressed={(params.get('type') || '') === value} onClick={() => update('type', value)}>{label}</button>)}</nav>
      <div className="designers-alphabet" role="group" aria-label="Filter brands by first letter"><button type="button" aria-pressed={!params.get('letter')} onClick={() => update('letter', '')}>All</button>{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => <button type="button" key={letter} aria-label={`Brands starting with ${letter}`} aria-pressed={params.get('letter') === letter} disabled={!letters.has(letter)} onClick={() => update('letter', letter)}>{letter}</button>)}</div>
      <div className="designers-results"><p role="status" aria-live="polite">{results.length} {results.length === 1 ? 'brand' : 'brands'}{params.get('q') ? ` matching “${params.get('q')}”` : ' to explore'}</p>{['q', 'type', 'letter'].some(key => params.has(key)) && <button type="button" className="glasses-text-button" onClick={() => onNavigate('/designer-brands', { scroll: false })}>Clear all</button>}</div>
      {results.length ? <div className="designers-brand-grid">{results.map(brand => {
        const count = brand.products.filter(product => params.get('type') === 'kids' ? product.audiences.includes('kids') : !params.get('type') || product.type.toLowerCase() === params.get('type')).length;
        return <CollectionLink href={linkFor(brand)} key={brand.slug} className="designers-brand" onNavigate={onNavigate}><h3>{brand.title}</h3><p>{brand.types.join(' · ')}</p><span>{count} {count === 1 ? 'frame' : 'frames'}<Icon name="arrow" /></span></CollectionLink>;
      })}</div> : <div className="glasses-empty"><Icon name="glasses" width="56" height="56" /><h3>No brands found.</h3><p>Try another name or clear your selection to explore the full directory.</p><button type="button" className="glasses-button" onClick={() => onNavigate('/designer-brands', { scroll: false })}>Explore all brands<Icon name="arrow" /></button></div>}
    </section>
  </div>;
}
