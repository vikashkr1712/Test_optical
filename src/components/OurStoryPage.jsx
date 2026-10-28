import { useCallback, useEffect, useRef, useState } from 'react';
import { CollectionLink, Icon } from './GlassesPage.jsx';
import { shopProducts } from './shopProducts.js';
import { designerBrands } from './designerBrands.js';
import './OurStoryPage.css';

const chapters = [['our-story', 'Our perspective'], ['our-approach', 'Our approach'], ['our-community', 'The style edit'], ['story-support', 'Shopping & support']];
const frameCount = shopProducts.filter(product => ['Eyeglasses', 'Sunglasses'].includes(product.type)).length;
const lensCount = shopProducts.filter(product => product.type === 'Contact lenses').length;
const collectionFacts = [[frameCount, 'frames to find yourself in'], [designerBrands.length, 'designer names to discover'], [lensCount, 'contact lens options to explore']];
const newPhotographs = new Set(['eyewear-display', 'frame-details', 'everyday-perspective']);
const principles = [
  ['Shape & proportion', 'A fine round frame, a defined rectangle or a more expressive cat-eye. We bring different silhouettes together so you can compare what catches your eye.'],
  ['Colour & finish', 'Clear acetate, warm tortoiseshell, subtle metal and deeper colours. The small details give each pair its character.'],
  ['A choice of designers', 'Explore established names and different design identities in one collection, with product details to help you make your own shortlist.'],
];
const looks = [
  { image: 'clear-style', category: 'THE EVERYDAY PAIR', title: 'A lighter outline', text: 'Fine metal frames keep the look simple and let the rest of your style speak.', alt: 'Woman wearing fine metal optical frames and a black top outdoors', href: '/eyewear/eyeglasses', cta: 'Explore eyeglasses' },
  { image: 'modern-frames', category: 'A MODERN CLASSIC', title: 'Clear perspective', text: 'Transparent frames bring a softer edge to a structured, everyday wardrobe.', alt: 'Man wearing transparent optical frames and a tan jacket', href: '/designer-brands', cta: 'Discover the brands' },
  { image: 'everyday-edit', category: 'OUT IN THE SUN', title: 'A stronger silhouette', text: 'A bold shape adds definition. Start with sunglasses that hold their own.', alt: 'Woman wearing dark cat-eye sunglasses against a pale wall', href: '/eyewear/sunglasses', cta: 'Explore sunglasses' },
];

function StoryPhoto({ name, alt, priority = false, className = '' }) {
  if (newPhotographs.has(name)) return <picture className={`story-photo ${className}`}>
    {name === 'eyewear-display' && <source media="(max-width: 767px)" srcSet="/assets/our-story/eyewear-display-mobile.webp" />}
    <img src={`/assets/our-story/${name}-1200.webp`} srcSet={`/assets/our-story/${name}-640.webp 640w, /assets/our-story/${name}-1200.webp 1200w${name === 'eyewear-display' ? ', /assets/our-story/eyewear-display-1920.webp 1920w' : ''}`} sizes={name === 'eyewear-display' ? '100vw' : '(max-width: 767px) 100vw, 50vw'} alt={alt} width={name === 'everyday-perspective' ? 1800 : 1200} height={name === 'everyday-perspective' ? 1013 : name === 'eyewear-display' ? 804 : 800} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" />
  </picture>;
  return <picture className={`story-photo ${className}`}><source media="(max-width: 767px)" srcSet={`/assets/hero/${name}-mobile.webp`} /><img src={`/assets/hero/${name}-desktop.webp`} alt={alt} width="1400" height="2100" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" /></picture>;
}

function InspirationRail({ onNavigate }) {
  const rail = useRef(null);
  const [position, setPosition] = useState({ index: 0, visible: 1 });
  const update = useCallback(() => {
    const element = rail.current;
    if (!element?.firstElementChild) return;
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
    const step = element.firstElementChild.getBoundingClientRect().width + gap;
    const visible = Math.max(1, Math.round((element.clientWidth + gap) / step));
    const index = Math.max(0, Math.min(looks.length - visible, Math.round(element.scrollLeft / step)));
    setPosition(previous => previous.index === index && previous.visible === visible ? previous : { index, visible });
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(update);
    observer.observe(rail.current);
    return () => observer.disconnect();
  }, [update]);
  const select = index => {
    const element = rail.current;
    const step = element.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap);
    element.scrollTo({ left: index * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const positions = Math.max(1, looks.length - position.visible + 1);
  return <>
    <div className="story-inspiration__navigation"><p>Swipe to explore</p><div role="group" aria-label="Choose style inspiration">{Array.from({ length: positions }, (_, index) => <button type="button" key={index} aria-label={position.visible === 1 ? `Show look ${index + 1}` : `Show looks ${index + 1} and ${index + 2}`} aria-current={position.index === index ? 'true' : undefined} onClick={() => select(index)} />)}</div><span className="story-sr-only" role="status" aria-live="polite">{position.visible === 1 ? `Look ${position.index + 1} of ${looks.length}` : `Looks ${position.index + 1} to ${Math.min(looks.length, position.index + position.visible)} of ${looks.length}`}</span></div>
    <div className="story-inspiration__rail" ref={rail} role="region" aria-label="Style inspiration looks" tabIndex="0" onScroll={update} onKeyDown={event => {
      if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      select(event.key === 'Home' ? 0 : event.key === 'End' ? positions - 1 : Math.max(0, Math.min(positions - 1, position.index + (event.key === 'ArrowRight' ? 1 : -1))));
    }}>{looks.map(look => <article className="story-look" key={look.image}><StoryPhoto name={look.image} alt={look.alt} /><div className="story-look__copy"><span className="story-eyebrow">{look.category}</span><h3>{look.title}</h3><p>{look.text}</p><CollectionLink href={look.href} className="story-text-link" onNavigate={onNavigate}>{look.cta}<Icon name="arrow" /></CollectionLink></div></article>)}</div>
  </>;
}

export default function OurStoryPage({ onNavigate }) {
  const [activeChapter, setActiveChapter] = useState('our-story');
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActiveChapter(visible[0].target.id);
      else if (document.getElementById('our-story').getBoundingClientRect().top > innerHeight * .45) setActiveChapter('our-story');
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    chapters.forEach(([id]) => observer.observe(document.getElementById(id)));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    // A directly opened chapter URL must wait until React has mounted its target.
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(location.hash.slice(1));
      target?.scrollIntoView({ block: 'start', behavior: 'instant' });
      target?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return <div className="story-page">
    <section className="story-hero" aria-labelledby="story-title">
      <figure className="story-hero__visual"><StoryPhoto name="eyewear-display" alt="A selection of optical frames arranged on glass display shelves" priority /></figure>
      <nav className="story-breadcrumbs" aria-label="Breadcrumb"><ol><li><CollectionLink href="/" onNavigate={onNavigate}>Home</CollectionLink></li><li><span aria-current="page">Our Story</span></li></ol></nav>
      <div className="story-hero__copy">
        <p className="story-eyebrow">THE CANDICLIE PERSPECTIVE</p>
        <h1 id="story-title">Our story.<br /><em>Your point of view.</em></h1>
        <p>A world of frames. A little self-expression.<br className="story-desktop-break" /> A pair that feels like you.</p>
        <CollectionLink href="/about-us#our-story" className="story-hero__discover" onNavigate={onNavigate}>Discover our story<span><Icon name="arrow" /></span></CollectionLink>
      </div>
      <span className="story-hero__note" aria-hidden="true">A FRESH POINT OF VIEW, EVERY DAY.</span>
    </section>

    <nav className="story-chapters" aria-label="Explore our story">{chapters.map(([id, label]) => <CollectionLink href={`/about-us#${id}`} key={id} onNavigate={onNavigate} aria-current={activeChapter === id ? 'location' : undefined}>{label}<Icon name="arrow" /></CollectionLink>)}</nav>

    <section id="our-story" className="story-manifesto story-section" aria-labelledby="story-idea-title" tabIndex="-1">
      <div className="story-manifesto__heading"><p className="story-eyebrow">WHY WE SEE THINGS DIFFERENTLY</p><h2 id="story-idea-title">More than a frame.<br /><em>A part of you.</em></h2></div>
      <div className="story-manifesto__body"><span className="story-wordmark">CandiClie</span><p>Your glasses go where you go. Into the everyday, the unexpected, the moments that become your story. We believe choosing them should feel personal.</p><p>So we bring different shapes, designer perspectives and everyday essentials together, giving you the space to discover what feels like your own.</p><p className="story-manifesto__signoff">See life. Your way.</p></div>
    </section>

    <section className="story-collection story-section" aria-labelledby="story-collection-title">
      <p className="story-eyebrow">A WORLD TO EXPLORE</p><h2 id="story-collection-title">Different expressions.<br /><em>One place to find yours.</em></h2>
      <p className="story-collection__intro">From your everyday opticals to a statement in the sun, discover the possibilities in the CandiClie collection.</p>
      <dl className="story-facts">{collectionFacts.map(([count, label]) => <div key={label}><dt>{label}</dt><dd>{count}</dd></div>)}</dl>
      <CollectionLink href="/designer-brands" className="story-text-link" onNavigate={onNavigate}>Meet the designers<Icon name="arrow" /></CollectionLink>
    </section>

    <section id="our-approach" className="story-approach story-section" aria-labelledby="story-approach-title" tabIndex="-1">
      <figure className="story-approach__visual"><StoryPhoto name="frame-details" alt="Colourful optical frames displayed in rows on a softly lit wall" /><figcaption>A closer look at shape, colour and character.</figcaption></figure>
      <div className="story-approach__copy"><p className="story-eyebrow">OUR APPROACH</p><h2 id="story-approach-title">Good style.<br /><em>Thoughtful details.</em></h2><ul>{principles.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ul><CollectionLink href="/eyewear" className="story-text-link" onNavigate={onNavigate}>Find your kind of frame<Icon name="arrow" /></CollectionLink></div>
    </section>

    <section className="story-everyday story-section" aria-labelledby="story-everyday-title">
      <div className="story-everyday__copy"><p className="story-eyebrow">IN GOOD COMPANY, EVERY DAY</p><h2 id="story-everyday-title">For the big plans.<br /><em>And the little moments.</em></h2><p>A quiet chapter. A busy morning. An afternoon with nowhere in particular to be. The best pair is the one that feels at home in your life.</p><p>Explore optical frames and sunglasses, compare the details, and save the pairs you want to come back to. Take your time. This is your point of view.</p><CollectionLink href="/eyewear/eyeglasses" className="story-text-link" onNavigate={onNavigate}>Explore everyday eyeglasses<Icon name="arrow" /></CollectionLink></div>
      <figure className="story-everyday__visual"><StoryPhoto name="everyday-perspective" alt="Clear optical frames resting on a stack of notebooks in soft daylight" /><figcaption>Small details. Everyday companions.</figcaption></figure>
    </section>

    <section id="our-community" className="story-inspiration story-section" aria-labelledby="story-inspiration-title" tabIndex="-1"><div className="story-section-heading"><div><p className="story-eyebrow">LIFE, IN FRAMES</p><h2 id="story-inspiration-title">The CandiClie <em>edit.</em></h2></div><p>Three different expressions. A little inspiration for a look that’s entirely your own.</p></div><InspirationRail onNavigate={onNavigate} /></section>

    <section id="story-support" className="story-support story-section" aria-labelledby="story-support-title" tabIndex="-1"><div><p className="story-eyebrow">SHOPPING WITH CANDICLIE</p><h2 id="story-support-title">A few useful<br />details.</h2><p>How to explore the collection, save a shortlist and see what’s available today.</p><CollectionLink href="/accessories" className="story-text-link" onNavigate={onNavigate}>Care & accessories<Icon name="arrow" /></CollectionLink></div><div className="story-questions">
      <details><summary>Where should I start?<span aria-hidden="true">+</span></summary><p>Browse <CollectionLink href="/eyewear/eyeglasses" onNavigate={onNavigate}>eyeglasses</CollectionLink> and <CollectionLink href="/eyewear/sunglasses" onNavigate={onNavigate}>sunglasses</CollectionLink>, or explore the <CollectionLink href="/designer-brands" onNavigate={onNavigate}>brand directory</CollectionLink>. Search within a collection and use its filters to narrow down shape, colour and price.</p></details>
      <details><summary>Can I save the pairs I like?<span aria-hidden="true">+</span></summary><p>Tap the heart on a product to save it. Your saved items and bag stay in this browser, so you can return to your shortlist on this device. You can see your saved selection from each collection.</p></details>
      <details><summary>Can I place an order?<span aria-hidden="true">+</span></summary><p>You can explore products, save favourites and put a selection in your bag. Online checkout is not available yet. Final prices and availability will be confirmed when ordering opens.</p></details>
      <details><summary>Where can I explore contact lenses?<span aria-hidden="true">+</span></summary><p>The <CollectionLink href="/contact-lenses" onNavigate={onNavigate}>contact lens collection</CollectionLink> lets you compare brands, replacement schedules, lens designs and available pack information.</p></details>
      <details><summary>What about the finishing touches?<span aria-hidden="true">+</span></summary><p>Explore <CollectionLink href="/accessories/cases" onNavigate={onNavigate}>cases and organisers</CollectionLink>, <CollectionLink href="/accessories/cleaning" onNavigate={onNavigate}>cleaning essentials</CollectionLink> and <CollectionLink href="/accessories/cords" onNavigate={onNavigate}>eyewear cords</CollectionLink> in Care & Accessories.</p></details>
    </div></section>

    <section className="story-next" aria-labelledby="story-next-title"><div><p className="story-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2 id="story-next-title">See life. <em>Your way.</em></h2></div><CollectionLink href="/eyewear" className="story-button" onNavigate={onNavigate}>Find your next pair<Icon name="arrow" /></CollectionLink></section>
  </div>;
}
