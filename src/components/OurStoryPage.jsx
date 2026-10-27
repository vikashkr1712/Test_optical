import { useCallback, useEffect, useRef, useState } from 'react';
import { CollectionLink, Icon } from './GlassesPage.jsx';
import './OurStoryPage.css';

const chapters = [['our-story', 'Our perspective'], ['our-approach', 'Our approach'], ['our-community', 'The style edit'], ['story-support', 'Shopping & support']];
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
    <nav className="story-breadcrumbs" aria-label="Breadcrumb"><ol><li><CollectionLink href="/" onNavigate={onNavigate}>Home</CollectionLink></li><li><span aria-current="page">Our Story</span></li></ol></nav>
    <section className="story-hero" aria-labelledby="story-title">
      <div className="story-hero__copy">
        <p className="story-eyebrow">ABOUT CANDICLIE</p>
        <h1 id="story-title">Eyewear is<br />personal.</h1>
        <p>The pair you wear every day should feel like it belongs to you. That’s the idea behind CandiClie.</p>
        <CollectionLink href="/eyewear" className="story-text-link" onNavigate={onNavigate}>Explore our eyewear<Icon name="arrow" /></CollectionLink>
        <span className="story-hero__signature">A fresh point of view.</span>
      </div>
      <figure className="story-hero__visual"><StoryPhoto name="outside-perspective" alt="Man wearing round black eyeglasses and a light jacket outdoors" priority /><figcaption>CANDICLIE / EVERYDAY PERSPECTIVES</figcaption></figure>
    </section>

    <nav className="story-chapters" aria-label="Explore our story">{chapters.map(([id, label]) => <CollectionLink href={`/about-us#${id}`} key={id} onNavigate={onNavigate}>{label}<Icon name="arrow" /></CollectionLink>)}</nav>

    <section id="our-story" className="story-manifesto story-section" aria-labelledby="story-idea-title" tabIndex="-1">
      <div className="story-manifesto__label"><p className="story-eyebrow">OUR PERSPECTIVE</p><span className="story-wordmark">CandiClie</span></div>
      <div><h2 id="story-idea-title">Part of your day.<br />Part of who you are.</h2><div className="story-manifesto__body"><p>Glasses are one of the few things you put on in the morning and keep with you all day. They deserve the same thought as anything else you choose to wear.</p><p>We approach eyewear through that everyday connection. Our collection brings together optical frames, sunglasses and designer labels, alongside contact lenses and the essentials that help you look after your pair.</p><p>Start with a shape you know or try something different. Our role is to give you a clear view of the choices, and room to decide what feels right.</p></div></div>
    </section>

    <section id="our-approach" className="story-approach story-section" aria-labelledby="story-approach-title" tabIndex="-1">
      <figure className="story-approach__visual"><StoryPhoto name="considered-details" alt="Transparent sunglasses resting on a stone surface with soft greenery behind them" /><figcaption>A closer look at shape, colour and finish.</figcaption></figure>
      <div className="story-approach__copy"><p className="story-eyebrow">OUR APPROACH</p><h2 id="story-approach-title">The details<br />make the pair.</h2><ul>{principles.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ul><CollectionLink href="/designer-brands" className="story-text-link" onNavigate={onNavigate}>Explore the brand directory<Icon name="arrow" /></CollectionLink></div>
    </section>

    <section id="our-community" className="story-inspiration story-section" aria-labelledby="story-inspiration-title" tabIndex="-1"><div className="story-section-heading"><div><p className="story-eyebrow">STYLE NOTES</p><h2 id="story-inspiration-title">The CandiClie edit.</h2></div><p>Different ways to wear a frame. A few starting points for a look of your own.</p></div><InspirationRail onNavigate={onNavigate} /></section>

    <section id="story-support" className="story-support story-section" aria-labelledby="story-support-title" tabIndex="-1"><div><p className="story-eyebrow">SHOPPING WITH CANDICLIE</p><h2 id="story-support-title">A few useful<br />details.</h2><p>How to explore the collection, save a shortlist and see what’s available today.</p><CollectionLink href="/accessories" className="story-text-link" onNavigate={onNavigate}>Care & accessories<Icon name="arrow" /></CollectionLink></div><div className="story-questions">
      <details><summary>Where should I start?<span aria-hidden="true">+</span></summary><p>Browse <CollectionLink href="/eyewear/eyeglasses" onNavigate={onNavigate}>eyeglasses</CollectionLink> and <CollectionLink href="/eyewear/sunglasses" onNavigate={onNavigate}>sunglasses</CollectionLink>, or explore the <CollectionLink href="/designer-brands" onNavigate={onNavigate}>brand directory</CollectionLink>. Search within a collection and use its filters to narrow down shape, colour and price.</p></details>
      <details><summary>Can I save the pairs I like?<span aria-hidden="true">+</span></summary><p>Tap the heart on a product to save it. Your saved items and bag stay in this browser, so you can return to your shortlist on this device. You can see your saved selection from each collection.</p></details>
      <details><summary>Can I place an order?<span aria-hidden="true">+</span></summary><p>You can explore products, save favourites and put a selection in your bag. Online checkout is not available yet. Final prices and availability will be confirmed when ordering opens.</p></details>
      <details><summary>Where can I explore contact lenses?<span aria-hidden="true">+</span></summary><p>The <CollectionLink href="/contact-lenses" onNavigate={onNavigate}>contact lens collection</CollectionLink> lets you compare brands, replacement schedules, lens designs and available pack information.</p></details>
      <details><summary>What about the finishing touches?<span aria-hidden="true">+</span></summary><p>Explore <CollectionLink href="/accessories/cases" onNavigate={onNavigate}>cases and organisers</CollectionLink>, <CollectionLink href="/accessories/cleaning" onNavigate={onNavigate}>cleaning essentials</CollectionLink> and <CollectionLink href="/accessories/cords" onNavigate={onNavigate}>eyewear cords</CollectionLink> in Care & Accessories.</p></details>
    </div></section>

    <section className="story-next" aria-labelledby="story-next-title"><div><p className="story-eyebrow">EXPLORE THE COLLECTION</p><h2 id="story-next-title">Find your next pair.</h2></div><CollectionLink href="/eyewear" className="story-button" onNavigate={onNavigate}>Explore glasses<Icon name="arrow" /></CollectionLink></section>
  </div>;
}
