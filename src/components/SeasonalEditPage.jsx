import { useState } from 'react';
import { CollectionLink, Icon } from './GlassesPage.jsx';
import { productImage } from './glassesCatalog.js';
import { currency, shopProducts } from './shopProducts.js';
import './SeasonalEditPage.css';

// Editorial photos: Pexels photo IDs 24389634 and 33527944, under
// https://www.pexels.com/license/.
const seasonalIds = ['edit-1', 'edit-2', 'frame-tm104mn53-h', 'frame-mt70rd44-f', 'frame-ss6mb46', 'edit-3'];
const seasonalProducts = seasonalIds.map(id => shopProducts.find(product => product.id === id)).filter(Boolean);
const tabs = [['all', 'All styles'], ['Eyeglasses', 'Eyeglasses'], ['Sunglasses', 'Sunglasses']];

export default function SeasonalEditPage({ shopping, onNavigate, onView }) {
  const [tab, setTab] = useState('all');
  const visible = tab === 'all' ? seasonalProducts : seasonalProducts.filter(product => product.type === tab);
  return <div className="seasonal-page">
    <section className="seasonal-hero" aria-labelledby="seasonal-title">
      <nav className="seasonal-breadcrumb" aria-label="Breadcrumb"><CollectionLink href="/" onNavigate={onNavigate}>Home</CollectionLink><span aria-hidden="true">/</span><span aria-current="page">Seasonal Edit</span></nav>
      <div className="seasonal-hero__layout">
        <div className="seasonal-hero__copy"><p className="seasonal-eyebrow">THE SEASONAL EDIT</p><h1 id="seasonal-title">Dress the moment.<br /><em>See it your way.</em></h1><p>For gatherings, getaways and all the little occasions in between. Find a frame that feels right for this moment and the next.</p><a href="#seasonal-favourites" className="seasonal-button">Explore the edit <Icon name="arrow" /></a></div>
        <img className="seasonal-hero__photo" src="/assets/seasonal/couple-indoor.jpg" alt="Two people wearing sunglasses in warm indoor light" width="1400" height="2100" fetchPriority="high" decoding="async" />
      </div>
    </section>

    <section className="seasonal-moments" aria-labelledby="seasonal-moments-title"><div className="seasonal-heading"><p className="seasonal-eyebrow">A LOOK FOR THE OCCASION</p><h2 id="seasonal-moments-title">Make every moment yours.</h2></div><div className="seasonal-moments__grid">
      <CollectionLink href="/eyewear/sunglasses" onNavigate={onNavigate} className="seasonal-moment seasonal-moment--sun"><span>01 / A LITTLE SUNSHINE</span><h3>Out in the light.</h3><p>Statement sunglasses for a brighter outlook.</p><span className="seasonal-moment__link">Explore sunglasses <Icon name="arrow" /></span></CollectionLink>
      <CollectionLink href="/eyewear/eyeglasses" onNavigate={onNavigate} className="seasonal-moment seasonal-moment--everyday"><span>02 / EVERYDAY CHARACTER</span><h3>The familiar, refreshed.</h3><p>Optical frames that feel like your own.</p><span className="seasonal-moment__link">Explore eyeglasses <Icon name="arrow" /></span></CollectionLink>
      <CollectionLink href="#seasonal-gifting" onNavigate={onNavigate} className="seasonal-moment seasonal-moment--gift"><span>03 / THOUGHTFUL EXTRAS</span><h3>Something for them.</h3><p>Find inspiration for the people on your list.</p><span className="seasonal-moment__link">See gift ideas <Icon name="arrow" /></span></CollectionLink>
    </div></section>

    <section className="seasonal-favourites" id="seasonal-favourites" aria-labelledby="seasonal-favourites-title"><div className="seasonal-heading seasonal-heading--split"><div><p className="seasonal-eyebrow">THE FRAME EDIT</p><h2 id="seasonal-favourites-title">Pieces with presence.</h2></div><p>Expressive shapes, considered details and favourites that stay with you after the occasion.</p></div>
      <div className="seasonal-tabs" role="tablist" aria-label="Filter seasonal frames">{tabs.map(([value, label], index) => <button type="button" key={value} role="tab" aria-controls="seasonal-products" aria-selected={tab === value} tabIndex={tab === value ? 0 : -1} onClick={() => setTab(value)} onKeyDown={event => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length; setTab(tabs[next][0]); event.currentTarget.parentElement.children[next].focus(); }}>{label}</button>)}</div>
      <div className="seasonal-products" id="seasonal-products" role="tabpanel" tabIndex="0" aria-label={`${tabs.find(([value]) => value === tab)[1]} in the seasonal edit`}>{visible.map(product => <article className="seasonal-product" key={product.id}><div className="seasonal-product__image"><button type="button" onClick={() => onView(product)} aria-label={`View ${product.brand} ${product.model}`}><img src={productImage(product)} alt={`${product.brand} ${product.model}, ${product.colour}`} loading="lazy" decoding="async" /></button><button type="button" className="seasonal-product__save" aria-label={shopping.saved.includes(product.id) ? `Remove ${product.model} from saved items` : `Save ${product.model}`} aria-pressed={shopping.saved.includes(product.id)} onClick={() => shopping.toggleSaved(product.id)}><Icon name="heart" /></button></div><div className="seasonal-product__copy"><span>{product.type}</span><h3>{product.brand}</h3><p>{product.model} · {product.colour}</p><div><strong>{currency.format(product.price)}</strong><button type="button" onClick={() => onView(product)}>View frame <Icon name="arrow" /></button></div></div></article>)}</div>
      <CollectionLink href="/eyewear" onNavigate={onNavigate} className="seasonal-text-link">Explore all frames <Icon name="arrow" /></CollectionLink>
    </section>

    <section className="seasonal-gifting" id="seasonal-gifting" aria-labelledby="seasonal-gifting-title"><img src="/assets/seasonal/couple-outdoor.jpg" alt="Two people in sunglasses enjoying a sunny day outdoors" width="1400" height="2100" loading="lazy" decoding="async" /><div><p className="seasonal-eyebrow">A THOUGHTFUL TOUCH</p><h2 id="seasonal-gifting-title">For the people who make the season.</h2><p>Help them discover a look that feels personal, or add a useful extra to a pair they already love. Explore the collections together and save the favourites that catch their eye.</p><div className="seasonal-gifting__links"><CollectionLink href="/eyewear" onNavigate={onNavigate}>Explore frames <Icon name="arrow" /></CollectionLink><CollectionLink href="/accessories" onNavigate={onNavigate}>Explore accessories <Icon name="arrow" /></CollectionLink></div><small>Catalogue prices are shown for reference. Online checkout and gift cards are not available yet.</small></div></section>
  </div>;
}
