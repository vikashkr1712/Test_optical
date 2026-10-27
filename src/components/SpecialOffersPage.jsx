import { useState } from 'react';
import { CollectionLink, Icon } from './GlassesPage.jsx';
import { currency, shopProducts } from './shopProducts.js';
import './SpecialOffersPage.css';

const featuredIds = [
  'frame-bs331bl48',
  'frame-ss6mb46',
  'frame-gvo216vl46',
  'lens-2209722',
  'accessory-cleaning-set',
  'accessory-case-two-black',
];
const featured = featuredIds.map(id => shopProducts.find(product => product.id === id)).filter(Boolean);
const edits = [
  { label: 'Frames under ₹5,000', detail: 'Everyday shapes with room to play.', href: '/eyewear?price=under-5000', image: '/assets/glasses/frame-bs331bl48-640.webp', alt: 'Black optical frame', number: '01' },
  { label: 'Sunglasses under ₹5,000', detail: 'Find your sunny-day favourite.', href: '/eyewear/sunglasses?price=under-5000', image: '/assets/glasses/frame-ss6mb46-640.webp', alt: 'Black sunglasses', number: '02' },
  { label: 'Little extras', detail: 'Care and storage for the frames you love.', href: '/accessories', image: '/assets/accessories/accessory-cleaning-set-640.webp', alt: 'Lens cleaner and cloth set', number: '03' },
];
const tabs = [['all', 'All finds'], ['Eyeglasses', 'Eyeglasses'], ['Sunglasses', 'Sunglasses'], ['Contact lenses', 'Lenses'], ['Accessories', 'Accessories']];

export default function SpecialOffersPage({ shopping, onNavigate, onView }) {
  const [tab, setTab] = useState('all');
  const visible = tab === 'all' ? featured : featured.filter(product => product.type === tab);
  return <div className="offers-page">
    <section className="offers-hero" aria-labelledby="offers-title">
      <div className="offers-hero__copy">
        <nav aria-label="Breadcrumb" className="offers-breadcrumb"><CollectionLink href="/" onNavigate={onNavigate}>Home</CollectionLink><span aria-hidden="true">/</span><span aria-current="page">Special Offers</span></nav>
        <p className="offers-eyebrow">THE CANDICLIE VALUE EDIT</p>
        <h1 id="offers-title">A good find<br />looks good on <em>you.</em></h1>
        <p>Discover thoughtfully priced frames and everyday essentials from the current collection. Find your next favourite, whatever your budget.</p>
        <a href="#offers-edits" className="offers-hero__cta">Explore the edits <Icon name="arrow" /></a>
        <p className="offers-hero__note">Catalogue prices shown. No live discount or coupon code is active.</p>
      </div>
      <div className="offers-hero__visual" aria-hidden="true"><div className="offers-hero__card offers-hero__card--one"><img src="/assets/glasses/frame-bs331bl48-640.webp" alt="" /></div><div className="offers-hero__card offers-hero__card--two"><img src="/assets/glasses/frame-ss6mb46-640.webp" alt="" /></div><span>Considered style.<br />Everyday value.</span></div>
    </section>

    <section className="offers-edits" id="offers-edits" aria-labelledby="offers-edits-title">
      <div className="offers-section-heading"><div><p className="offers-eyebrow">A PLACE TO START</p><h2 id="offers-edits-title">The value edits.</h2></div><p>Browse the styles and essentials that fit your day and your budget.</p></div>
      <div className="offers-edits__grid">{edits.map(edit => <CollectionLink href={edit.href} onNavigate={onNavigate} className="offers-edit" key={edit.number}><div className="offers-edit__photo"><img src={edit.image} alt={edit.alt} loading="lazy" decoding="async" /><span>{edit.number}</span></div><div className="offers-edit__text"><div><h3>{edit.label}</h3><p>{edit.detail}</p></div><Icon name="arrow" /></div></CollectionLink>)}</div>
    </section>

    <section className="offers-finds" id="offers-finds" aria-labelledby="offers-finds-title">
      <div className="offers-section-heading"><div><p className="offers-eyebrow">CURRENT FAVOURITES</p><h2 id="offers-finds-title">A little something for everyone.</h2></div><p>Real pieces from the catalogue, ready to preview and save.</p></div>
      <div className="offers-tabs" role="tablist" aria-label="Filter featured finds">{tabs.map(([value, label]) => <button type="button" key={value} role="tab" aria-controls="offers-products" aria-selected={tab === value} tabIndex={tab === value ? 0 : -1} onClick={() => setTab(value)} onKeyDown={event => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const current = tabs.findIndex(([id]) => id === tab); const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length; setTab(tabs[next][0]); event.currentTarget.parentElement.children[next].focus(); }}>{label}</button>)}</div>
      <div className="offers-products" id="offers-products" role="tabpanel" tabIndex="0" aria-label={`${tabs.find(([value]) => value === tab)[1]} products`}>{visible.map(product => <article className="offers-product" key={product.id}><div className="offers-product__photo"><button type="button" onClick={() => onView(product)} aria-label={`View ${product.brand} ${product.model}`}><img src={product.image} alt={`${product.brand} ${product.model}`} loading="lazy" decoding="async" /></button><button type="button" className="offers-product__save" aria-label={shopping.saved.includes(product.id) ? `Remove ${product.model} from saved items` : `Save ${product.model}`} aria-pressed={shopping.saved.includes(product.id)} onClick={() => shopping.toggleSaved(product.id)}><Icon name="heart" /></button></div><div className="offers-product__copy"><span>{product.type}</span><h3>{product.brand} {product.model}</h3><p>{product.colour}</p><div><strong>{currency.format(product.price)}</strong><button type="button" onClick={() => onView(product)}>Quick view <Icon name="arrow" /></button></div></div></article>)}</div>
      <CollectionLink href="/eyewear" onNavigate={onNavigate} className="offers-all-link">Explore all glasses <Icon name="arrow" /></CollectionLink>
    </section>

    <section className="offers-information" id="offer-information" aria-labelledby="offer-information-title"><div><p className="offers-eyebrow">GOOD TO KNOW</p><h2 id="offer-information-title">Clarity looks good, too.</h2></div><div><p>The prices shown here are catalogue reference prices, not discounted prices. There are no active coupon codes, time-limited offers or online checkout at the moment. You can still explore details and save your favourites in this browser.</p><CollectionLink href="/about-us#story-support" onNavigate={onNavigate}>More about shopping <Icon name="arrow" /></CollectionLink></div></section>
  </div>;
}
