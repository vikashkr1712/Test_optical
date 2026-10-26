import { useCallback, useEffect, useRef, useState } from 'react';
import { CollectionLink, Icon } from './GlassesPage.jsx';
import './OurStoryPage.css';

const chapters = [['our-story', 'Our story'], ['our-approach', 'Our approach'], ['our-community', 'Style inspiration'], ['story-support', 'Shopping & support']];
const principles = [
  ['Room for your own style.', 'A familiar shape or a different direction. Explore optical frames, sunglasses and names you love, with space to find your own favourite.'],
  ['The details, up close.', 'Look at the shape, colour and frame style. Open a preview, compare the available views and spend a little time with the details.'],
  ['Favourites worth coming back to.', 'Save the pairs that catch your eye. Keep a shortlist in this browser and bring your choices together in your bag.'],
];
const looks = [
  { image: 'clear-style', title: 'Quiet confidence.', text: 'Fine lines. An easy kind of expression.', alt: 'Woman wearing fine metal optical frames and a black top outdoors', href: '/eyewear/eyeglasses', cta: 'Explore eyeglasses' },
  { image: 'modern-frames', title: 'Everyday, your way.', text: 'A familiar favourite. A fresh perspective.', alt: 'Man wearing transparent optical frames and a tan jacket', href: '/designer-brands', cta: 'Discover the brands' },
  { image: 'everyday-edit', title: 'A brighter outlook.', text: 'A little sunshine. A little more character.', alt: 'Woman wearing dark cat-eye sunglasses against a pale wall', href: '/eyewear/sunglasses', cta: 'Explore sunglasses' },
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
    }}>{looks.map((look, index) => <article className="story-look" key={look.image}><StoryPhoto name={look.image} alt={look.alt} /><div className="story-look__copy"><span className="story-eyebrow">0{index + 1} / A POINT OF VIEW</span><h3>{look.title}</h3><p>{look.text}</p><CollectionLink href={look.href} className="story-text-link" onNavigate={onNavigate}>{look.cta}<Icon name="arrow" /></CollectionLink></div></article>)}</div>
  </>;
}

export default function OurStoryPage({ onNavigate }) {
  useEffect(() => {
    // A directly opened chapter URL must wait until React has mounted its target.
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(location.hash.slice(1));
      target?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return <div className="story-page">
    <nav className="story-breadcrumbs" aria-label="Breadcrumb"><ol><li><CollectionLink href="/" onNavigate={onNavigate}>Home</CollectionLink></li><li><span aria-current="page">Our Story</span></li></ol></nav>
    <section className="story-hero" aria-labelledby="story-title"><div className="story-hero__copy"><p className="story-eyebrow">OUR STORY / CANDICLIE</p><h1 id="story-title">See life.<br /><em>Your way.</em></h1><p>A frame is part of your everyday. A small detail that can feel unmistakably like you.</p><p>We bring eyewear, personal style and a little inspiration together, so you can find your own point of view.</p><CollectionLink href="/eyewear" className="story-button" onNavigate={onNavigate}>Find your next frame<Icon name="arrow" /></CollectionLink></div><div className="story-hero__visual"><StoryPhoto name="outside-perspective" alt="Man wearing round black eyeglasses and a light jacket outdoors" priority /><span>EVERYDAY FRAMES. INDIVIDUAL PERSPECTIVES.</span></div></section>

    <nav className="story-chapters" aria-label="Explore our story">{chapters.map(([id, label], index) => <CollectionLink href={`/about-us#${id}`} key={id} onNavigate={onNavigate}><span>0{index + 1}</span>{label}</CollectionLink>)}</nav>

    <section id="our-story" className="story-manifesto story-section" aria-labelledby="story-idea-title" tabIndex="-1"><p className="story-eyebrow">01 / WHY WE’RE HERE</p><div><h2 id="story-idea-title">A small detail.<br /><em>A personal difference.</em></h2><div className="story-manifesto__body"><p>The pair you reach for on a busy morning. The sunglasses that finish a favourite outfit. The shape you try when you feel like a change. Eyewear becomes part of how you move through the world.</p><p>At CandiClie, we believe finding a frame should leave room for that individuality. Our collections bring together different shapes, colours and brand identities, with clear details to help you explore.</p></div><p className="story-manifesto__statement">Good style starts with feeling like yourself.</p></div></section>

    <section id="our-approach" className="story-approach story-section" aria-labelledby="story-approach-title" tabIndex="-1"><div className="story-approach__visual"><StoryPhoto name="considered-details" alt="Transparent sunglasses resting on a stone surface with soft greenery behind them" /><span>TAKE A MOMENT. LOOK A LITTLE CLOSER.</span></div><div className="story-approach__copy"><p className="story-eyebrow">02 / OUR APPROACH</p><h2 id="story-approach-title">Considered choices.<br /><em>Your character.</em></h2><ol>{principles.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol><CollectionLink href="/designer-brands" className="story-text-link" onNavigate={onNavigate}>Meet the brands<Icon name="arrow" /></CollectionLink></div></section>

    <section id="our-community" className="story-inspiration story-section" aria-labelledby="story-inspiration-title" tabIndex="-1"><div className="story-section-heading"><div><p className="story-eyebrow">03 / STYLE INSPIRATION</p><h2 id="story-inspiration-title">Different looks.<br /><em>A shared eye for style.</em></h2></div><p>Quiet, expressive, familiar or unexpected. These editorial looks are a little inspiration for finding your own.</p></div><InspirationRail onNavigate={onNavigate} /></section>

    <section id="story-support" className="story-support story-section" aria-labelledby="story-support-title" tabIndex="-1"><div><p className="story-eyebrow">04 / A LITTLE HELP</p><h2 id="story-support-title">Make yourself<br /><em>at home.</em></h2><p>Get to know the collections, keep your favourites close and explore at your own pace.</p><CollectionLink href="/accessories" className="story-text-link" onNavigate={onNavigate}>Explore care & accessories<Icon name="arrow" /></CollectionLink></div><div className="story-questions">
      <details><summary>Where should I start?<span aria-hidden="true">+</span></summary><p>Browse <CollectionLink href="/eyewear/eyeglasses" onNavigate={onNavigate}>eyeglasses</CollectionLink> and <CollectionLink href="/eyewear/sunglasses" onNavigate={onNavigate}>sunglasses</CollectionLink>, or explore the <CollectionLink href="/designer-brands" onNavigate={onNavigate}>brand directory</CollectionLink>. Search within a collection and use its filters to narrow down shape, colour and price.</p></details>
      <details><summary>Can I save the pairs I like?<span aria-hidden="true">+</span></summary><p>Tap the heart on a product to save it. Your saved items and bag stay in this browser, so you can return to your shortlist on this device. You can see your saved selection from each collection.</p></details>
      <details><summary>Can I place an order?<span aria-hidden="true">+</span></summary><p>You can explore products, save favourites and put a selection in your bag. Online checkout is not available yet. Final prices and availability will be confirmed when ordering opens.</p></details>
      <details><summary>Where can I explore contact lenses?<span aria-hidden="true">+</span></summary><p>The <CollectionLink href="/contact-lenses" onNavigate={onNavigate}>contact lens collection</CollectionLink> lets you compare brands, replacement schedules, lens designs and available pack information.</p></details>
      <details><summary>What about the finishing touches?<span aria-hidden="true">+</span></summary><p>Explore <CollectionLink href="/accessories/cases" onNavigate={onNavigate}>cases and organisers</CollectionLink>, <CollectionLink href="/accessories/cleaning" onNavigate={onNavigate}>cleaning essentials</CollectionLink> and <CollectionLink href="/accessories/cords" onNavigate={onNavigate}>eyewear cords</CollectionLink> in Care & Accessories.</p></details>
    </div></section>

    <section className="story-next" aria-labelledby="story-next-title"><p className="story-eyebrow">YOUR NEXT CHAPTER</p><h2 id="story-next-title">Find a frame.<br /><em>Make it your own.</em></h2><div><CollectionLink href="/eyewear" className="story-button" onNavigate={onNavigate}>Explore glasses<Icon name="arrow" /></CollectionLink><CollectionLink href="/designer-brands" className="story-text-link" onNavigate={onNavigate}>Discover the brands<Icon name="arrow" /></CollectionLink></div></section>
  </div>;
}
