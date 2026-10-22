import { useEffect, useRef, useState } from 'react';
import './HomeCollections.css';
import HomeEditorial from './HomeEditorial.jsx';

const asset = (name, size) => `/assets/home/${name}-${size}.webp`;
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const products = {
  best: [
    { id: 'product-1', brand: 'Maui Jim', model: 'MJ-H407 02', colour: 'Black · Rimless', type: 'Sunglasses', price: 14690 },
    { id: 'product-2', brand: 'Emporio Armani', model: '0EA4232 6106/87', colour: 'Transparent grey', type: 'Sunglasses', price: 15390 },
    { id: 'product-3', brand: 'Emporio Armani', model: '0EA3038 5063', colour: 'Matt black', type: 'Eyeglasses', price: 12490 },
  ],
  edit: [
    { id: 'edit-1', brand: 'Burberry', model: '0BE4438U 300187', colour: 'Black', type: 'Sunglasses', price: 34290 },
    { id: 'edit-2', brand: 'Burberry', model: '0BE4403 409680', colour: 'Brown', type: 'Sunglasses', price: 22590 },
    { id: 'edit-3', brand: 'Champ', model: 'S5018 C4', colour: 'Blue · Junior', type: 'Sunglasses', price: 1500 },
  ],
};

const audiences = [
  { id: 'for-him', title: 'Shop for him', eyebrow: 'EFFORTLESS. EVERY DAY.', description: 'From clean optical frames to statement sunglasses, find a look that feels like you.', collection: 'The men’s edit' },
  { id: 'for-her', title: 'Shop for her', eyebrow: 'A LITTLE MAIN-CHARACTER ENERGY.', description: 'Explore soft shapes, expressive silhouettes and everyday favourites with a different point of view.', collection: 'The women’s edit' },
  { id: 'for-kids', title: 'Shop for kids', eyebrow: 'SMALL FRAMES. BIG PERSONALITY.', description: 'Colourful frames and playful shapes for their everyday adventures. A comfortable fit comes first.', collection: 'The junior edit' },
];

const categories = [
  { id: 'category-eyeglasses', title: 'Eyeglasses', subtitle: 'Your everyday essential', description: 'Discover clean lines, classic silhouettes and expressive optical frames. Start with a shape you love, then find the right fit.' },
  { id: 'category-men', title: 'Men', subtitle: 'Make it your signature', description: 'From understated opticals to bold sunglasses, explore a fresh perspective on your personal style.' },
  { id: 'category-women', title: 'Women', subtitle: 'Made for your point of view', description: 'Soft curves, sculptural shapes and a touch of colour. Explore eyewear that makes an everyday outfit feel like your own.' },
  { id: 'category-kids', title: 'Kids', subtitle: 'Little looks, big character', description: 'Bright colours and playful shapes for growing personalities. Look for a comfortable fit and choose with an eye-care professional.' },
  { id: 'category-fashion', title: 'Fashion', subtitle: 'Go a little off-script', description: 'Experiment with statement shapes, unexpected colours and bold proportions. A small change can create a whole new look.' },
];

function Arrow({ direction = 'right' }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {direction === 'left' ? <path d="M20 12H4m6-6-6 6 6 6" /> : <path d="M4 12h16m-6-6 6 6-6 6" />}
  </svg>;
}

function Photo({ name, alt, kind = 'category', className = '' }) {
  const sizes = kind === 'product' ? [400, 720] : kind === 'audience' ? [480, 900] : [320, 560];
  return <img className={className} src={asset(name, sizes[0])} srcSet={`${asset(name, sizes[0])} ${sizes[0]}w, ${asset(name, sizes[1])} ${sizes[1]}w`}
    sizes={kind === 'product' ? '(max-width: 600px) 76vw, (max-width: 900px) 42vw, 30vw' : kind === 'audience' ? '(max-width: 600px) 85vw, 33vw' : '(max-width: 600px) 44vw, (max-width: 1100px) 24vw, 19vw'}
    width={kind === 'product' ? 720 : kind === 'audience' ? 900 : 560} height={kind === 'product' ? 460 : kind === 'audience' ? 601 : 839}
    alt={alt} loading="lazy" decoding="async" />;
}

function PreviewDialog({ selection, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    if (!selection) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    modal.showModal();
    document.body.style.overflow = 'hidden';
    return () => { modal.close(); document.body.style.overflow = previousOverflow; };
  }, [selection]);
  const product = selection?.brand;
  return <dialog ref={dialog} className="home-preview" aria-labelledby="preview-title" onClose={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    {selection && <div className="home-preview__content">
      <button type="button" className="home-preview__close" aria-label="Close preview" onClick={onClose} autoFocus>×</button>
      {selection.media ? <img {...selection.media} sizes="(max-width: 600px) 85vw, 430px" decoding="async" /> : <Photo name={selection.id} kind={product ? 'product' : selection.id.startsWith('for-') ? 'audience' : 'category'} alt={product ? `${selection.brand} ${selection.model}` : selection.title} />}
      <div className="home-preview__copy">
        <p className="home-eyebrow">{product ? selection.type : selection.eyebrow || 'THE CANDICLIE EDIT'}</p>
        <h2 id="preview-title">{product ? selection.brand : selection.collection || selection.title}</h2>
        {product ? <><p>{selection.model}</p><p className="home-muted">{selection.colour}</p><p className="home-preview__price">{currency.format(selection.price)}</p><p className="home-preview__note">A preview of our featured selection. Online ordering is not available yet; prices and availability will be confirmed when shopping launches.</p></> : <p>{selection.description}</p>}
        <a className="home-text-link" href={product || selection.media ? '#top-categories' : '#featured-picks'} onClick={onClose}>{product || selection.media ? 'Discover more styles' : 'Explore featured frames'}<Arrow /></a>
      </div>
    </div>}
  </dialog>;
}

export default function HomeCollections() {
  const [tab, setTab] = useState('best');
  const [selection, setSelection] = useState(null);
  const productRail = useRef(null);
  const categoryRail = useRef(null);
  const scrollRail = (ref, direction) => ref.current?.scrollBy({ left: direction * ref.current.clientWidth * .8, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  const selectTab = (value) => { setTab(value); if (productRail.current) productRail.current.scrollLeft = 0; };
  const moveTab = event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 'best' : event.key === 'End' ? 'edit' : tab === 'best' ? 'edit' : 'best';
    selectTab(next);
    document.getElementById(`tab-${next}`).focus();
  };

  return <div className="home-collections">
    <section className="home-featured home-section" id="featured-picks" aria-labelledby="featured-heading">
      <div className="home-section__intro">
        <div><p className="home-eyebrow">THE CANDICLIE SELECTION</p><h1 id="featured-heading">A world of frames.<br /><span>A look that’s yours.</span></h1></div>
        <p className="home-section__description">Considered design. Distinctive details.<br /> Find your next everyday favourite.</p>
      </div>
      <div className="home-featured__toolbar">
        <div className="home-tabs" role="tablist" aria-label="Featured frame selections" onKeyDown={moveTab}>
          {[['best', 'Best sellers'], ['edit', 'Fresh perspectives']].map(([id, label]) => <button type="button" key={id} id={`tab-${id}`} role="tab" aria-selected={tab === id} aria-controls="featured-products" tabIndex={tab === id ? 0 : -1} onClick={() => selectTab(id)}>{label}</button>)}
        </div>
        <a className="home-text-link home-featured__explore" href="#top-categories">Explore categories<Arrow /></a>
      </div>
      <div id="featured-products" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex="0" className="home-products" ref={productRail}>
        {products[tab].map((product, index) => <article className="home-product" key={product.id}>
          <button className="home-product__open" type="button" onClick={() => setSelection(product)} aria-label={`View ${product.brand} ${product.model}`}>
            <div className="home-product__image"><span className="home-product__type">{product.type}</span><Photo name={product.id} kind="product" alt={`${product.brand} ${product.model} in ${product.colour.toLowerCase()}`} /><span className="home-product__number">0{index + 1}</span></div>
            <div className="home-product__info"><p className="home-product__brand">{product.brand}</p><h2>{product.model}</h2><p className="home-muted">{product.colour}</p><div className="home-product__bottom"><span>{currency.format(product.price)}</span><span className="home-product__view">View frame<Arrow /></span></div></div>
          </button>
        </article>)}
      </div>
      <div className="home-rail-controls"><span>Find a fresh point of view</span><div><button type="button" onClick={() => scrollRail(productRail, -1)} aria-label="Previous featured frames"><Arrow direction="left" /></button><button type="button" onClick={() => scrollRail(productRail, 1)} aria-label="Next featured frames"><Arrow /></button></div></div>
    </section>

    <section className="home-audiences home-section" id="collection-edits" aria-labelledby="audience-heading">
      <div className="home-audiences__intro"><p className="home-eyebrow">GOOD STYLE HAS NO SINGLE LOOK</p><h2 id="audience-heading">Find your kind of frame.</h2></div>
      <div className="home-audiences__grid">{audiences.map(item => <button type="button" key={item.id} className="home-audience" onClick={() => setSelection(item)}>
        <div className="home-audience__photo"><Photo name={item.id} kind="audience" alt={item.title === 'Shop for kids' ? 'Children wearing colourful glasses' : item.title === 'Shop for him' ? 'A man wearing statement eyewear' : 'A woman wearing statement eyewear'} /><span className="home-audience__arrow"><Arrow /></span></div>
        <div className="home-audience__copy"><span className="home-eyebrow">{item.eyebrow}</span><h3>{item.title}</h3><span className="home-audience__link">Discover the edit</span></div>
      </button>)}</div>
    </section>

    <section className="home-brand" id="icon-edit" aria-label="The Ray-Ban icon edit">
      <picture><source media="(max-width: 800px)" srcSet={asset('brand-banner', 800)} /><img src={asset('brand-banner', 1512)} width="1512" height="410" alt="Ray-Ban Aviator: iconic by design. A campaign portrait with amber aviator sunglasses." loading="lazy" decoding="async" /></picture>
      <div className="home-brand__caption"><div><p className="home-eyebrow">THE ICON EDIT</p><p>Some styles never need an introduction.</p></div><a className="home-text-link" href="#top-categories">Find your signature<Arrow /></a></div>
    </section>

    <section className="home-categories home-section" id="top-categories" aria-labelledby="categories-heading">
      <div className="home-section__intro"><div><p className="home-eyebrow">A GOOD PLACE TO START</p><h2 id="categories-heading">Shop from our top categories</h2></div><span className="home-categories__hint">Different styles. Same you.</span></div>
      <div className="home-categories__rail" ref={categoryRail}>{categories.map((item, i) => <button type="button" key={item.id} className="home-category" onClick={() => setSelection(item)} aria-label={`Explore ${item.title}`}>
        <div className="home-category__photo"><Photo name={item.id} alt={`${item.title} eyewear collection`} /><span>0{i + 1}</span></div>
        <div className="home-category__title"><h3>{item.title}</h3><Arrow /></div><p>{item.subtitle}</p>
      </button>)}</div>
      <div className="home-rail-controls home-rail-controls--categories"><span>Swipe to find your style</span><div><button type="button" onClick={() => scrollRail(categoryRail, -1)} aria-label="Previous categories"><Arrow direction="left" /></button><button type="button" onClick={() => scrollRail(categoryRail, 1)} aria-label="Next categories"><Arrow /></button></div></div>
    </section>
    <HomeEditorial onPreview={setSelection} />
    <PreviewDialog selection={selection} onClose={() => setSelection(null)} />
  </div>;
}
