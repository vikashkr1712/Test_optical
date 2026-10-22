import { useCallback, useEffect, useRef, useState } from 'react';
import './HomeEditorial.css';

import { brands } from './brandCollections.js';

const stories = [
  { image: 'street-user1', title: 'The city after dark', label: 'OFFSCRIPT / CITY EDIT', description: 'Dark frames, a sharp silhouette and a little city energy. An everyday outfit with a stronger point of view.', alt: 'Black-and-white street-style portrait of a man wearing rectangular black eyeglasses' },
  { image: 'street-user2', title: 'A softer kind of statement', label: 'SOLSTICE / OUT IN THE OPEN', description: 'Soft colour and expressive sunglasses. A playful reminder to make a little room for the unexpected.', alt: 'Woman in tinted aviator sunglasses and a white butterfly-print shirt' },
  { image: 'street-user3', title: 'Good company. Great frames.', label: 'NORTHLINE / SOCIAL CLUB', description: 'A relaxed look, a favourite pair of sunglasses and nowhere particular to be. Find your own off-duty style.', alt: 'Man wearing dark sunglasses and resting his chin on his arm in warm sunlight' },
];

function Arrow({ left = false }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={left ? 'M20 12H4m6-6-6 6 6 6' : 'M4 12h16m-6-6 6 6-6 6'} /></svg>;
}

function mediaFor(item, street = false) {
  const sizes = street ? [400, 540] : [480, 960];
  const path = width => `/assets/editorial/${item.image}-${width}.webp`;
  return { src: path(sizes[0]), srcSet: `${path(sizes[0])} ${sizes[0]}w, ${path(sizes[1])} ${sizes[1]}w`, width: street ? 540 : 960, height: street ? 720 : 960, alt: item.alt };
}

export default function HomeEditorial({ onPreview }) {
  const rail = useRef(null);
  const [position, setPosition] = useState({ index: 0, start: true, end: false });
  const show = (item, street = false) => onPreview({ ...item, id: item.image, eyebrow: street ? 'COMMUNITY / STYLE NOTES' : 'HOUSE OF BRANDS', media: mediaFor(item, street) });
  const scroll = direction => {
    const item = rail.current?.firstElementChild;
    if (!item) return;
    const step = item.getBoundingClientRect().width + parseFloat(getComputedStyle(rail.current).columnGap);
    rail.current.scrollBy({ left: direction * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const updatePosition = useCallback(element => {
    const step = element.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap);
    const edge = parseFloat(getComputedStyle(element).paddingLeft) + 4;
    const next = { index: Math.round(element.scrollLeft / step), start: element.scrollLeft <= edge, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - edge };
    setPosition(current => current.index === next.index && current.start === next.start && current.end === next.end ? current : next);
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(() => updatePosition(rail.current));
    observer.observe(rail.current);
    return () => observer.disconnect();
  }, [updatePosition]);

  return <>
    <section className="home-directory home-section" id="house-of-brands" aria-labelledby="directory-heading">
      <div className="home-editorial__intro"><div><p className="home-eyebrow">THE DIRECTORY</p><h2 id="directory-heading">House of <em>Brands</em></h2></div><p>Different identities.<br /> A shared eye for style.</p></div>
      <div className="home-directory__rail" ref={rail} onScroll={event => updatePosition(event.currentTarget)} role="region" aria-label="Browse brand collections" tabIndex="0" onKeyDown={event => {
        if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'Home' || event.key === 'End') rail.current.scrollTo({left:event.key === 'Home' ? 0 : rail.current.scrollWidth,behavior:'instant'});
        else scroll(event.key === 'ArrowRight' ? 1 : -1);
      }}>
        {brands.map((brand, i) => <button type="button" className={`home-label home-label--${brand.style}`} key={brand.image} aria-label={`Explore ${brand.title}`} onClick={() => show(brand)}>
          <img {...mediaFor(brand)} sizes="(max-width: 600px) 82vw, (max-width: 1000px) 66vw, 42vw" loading="lazy" decoding="async" />
          <span className="home-label__shade" aria-hidden="true" />
          <span className="home-label__index">THE COLLECTION / 0{i + 1}</span>
          <span className="home-label__name">{brand.title}</span>
          <span className="home-label__footer"><span>{brand.line}</span><Arrow /></span>
        </button>)}
      </div>
      <div className="home-directory__controls"><span>CURATED PERSPECTIVES <span aria-hidden="true">/</span> {String(position.index + 1).padStart(2, '0')} — {String(brands.length).padStart(2, '0')}</span><div><button type="button" aria-label="Previous brand" disabled={position.start} onClick={() => scroll(-1)}><Arrow left /></button><button type="button" aria-label="Next brand" disabled={position.end} onClick={() => scroll(1)}><Arrow /></button></div></div>
    </section>

    <section className="home-community home-section" id="community" aria-labelledby="community-heading">
      <div className="home-community__intro"><p className="home-eyebrow">COMMUNITY</p><h2 id="community-heading">Seen <em>on the </em><strong>Streets</strong></h2></div>
      <div className="home-community__grid">{stories.map(story => <button type="button" key={story.image} className="home-street" aria-label={`Explore ${story.title}`} onClick={() => show(story, true)}>
        <span className="home-street__content">
          <span className="home-street__image"><img {...mediaFor(story, true)} sizes="(max-width: 600px) 260px, 29vw" loading="lazy" decoding="async" /></span>
          <span className="home-street__label">{story.label}</span><span className="home-street__explore">Explore</span>
        </span>
      </button>)}</div>
    </section>
  </>;
}
