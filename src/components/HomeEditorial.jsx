import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './HomeEditorial.css';

import { brands } from './brandCollections.js';

const stories = [
  { image: 'street-user1', title: 'The city after dark', label: '01 / AFTER HOURS', description: 'Dark frames, a sharp silhouette and a little city energy. An everyday outfit with a stronger point of view.', alt: 'Black-and-white street-style portrait of a man wearing rectangular black eyeglasses' },
  { image: 'street-user2', title: 'A softer kind of statement', label: '02 / IN COLOUR', description: 'Soft colour and expressive sunglasses. A playful reminder to make a little room for the unexpected.', alt: 'Woman in tinted aviator sunglasses and a white butterfly-print shirt' },
  { image: 'street-user3', title: 'Good company. Great frames.', label: '03 / OFF DUTY', description: 'A relaxed look, a favourite pair of sunglasses and nowhere particular to be. Find your own off-duty style.', alt: 'Man wearing dark sunglasses and resting his chin on his arm in warm sunlight' },
];

function Arrow({ left = false }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={left ? 'M20 12H4m6-6-6 6 6 6' : 'M4 12h16m-6-6 6 6-6 6'} /></svg>;
}

function mediaFor(item, street = false) {
  const sizes = street ? [400, 540] : [480, 960];
  const path = width => `/assets/editorial/${item.image}-${width}.webp`;
  return { src: path(sizes[0]), srcSet: `${path(sizes[0])} ${sizes[0]}w, ${path(sizes[1])} ${sizes[1]}w`, width: street ? 540 : 960, height: street ? 720 : 960, alt: item.alt };
}

// Repeated slides provide a buffer on both sides of the three visible stories.
const storySlides = Array.from({ length: stories.length * 3 }, (_, index) => stories[index % stories.length]);

function CommunityCarousel({ onPreview }) {
  const [slide, setSlide] = useState({ index: stories.length + 1, moving: false });
  const [dragging, setDragging] = useState(false);
  const [handheld, setHandheld] = useState(() => matchMedia('(max-width: 1199px)').matches);
  const track = useRef(null);
  const moving = useRef(false);
  const restoreFocus = useRef(false);
  const gesture = useRef(null);
  const suppressClick = useRef(false);
  const dragFrame = useRef(0);
  const current = slide.index % stories.length;
  useEffect(() => {
    const media = matchMedia('(max-width: 1199px)');
    const update = () => setHandheld(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const show = story => onPreview({ ...story, id: story.image, eyebrow: 'THE CANDICLIE JOURNAL', media: mediaFor(story, true) });
  const move = direction => {
    if (moving.current || !direction) return;
    moving.current = true;
    setSlide(previous => ({ index: previous.index + direction, moving: true }));
  };
  const selectStory = index => {
    const delta = (index - current + stories.length) % stories.length;
    move(delta === stories.length - 1 ? -1 : delta);
  };
  const clearDrag = () => {
    cancelAnimationFrame(dragFrame.current);
    dragFrame.current = 0;
    track.current?.style.removeProperty('--community-drag');
    setDragging(false);
  };
  useEffect(() => () => cancelAnimationFrame(dragFrame.current), []);
  const finish = useCallback(() => {
    if (!moving.current) return;
    moving.current = false;
    restoreFocus.current = track.current?.contains(document.activeElement);
    setSlide(previous => ({ index: stories.length + previous.index % stories.length, moving: false }));
  }, []);
  useLayoutEffect(() => {
    if (slide.moving || !restoreFocus.current) return;
    restoreFocus.current = false;
    track.current?.querySelector('.home-street--active .home-street__image')?.focus({ preventScroll: true });
  }, [slide]);
  useEffect(() => {
    if (!slide.moving) return;
    const timer = setTimeout(finish, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 550);
    return () => clearTimeout(timer);
  }, [slide, finish]);

  return <div className="home-community__carousel" role="region" aria-roledescription="carousel" aria-label="Life, in frames stories" onKeyDown={event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home' || event.key === 'End') {
      const target = event.key === 'Home' ? 0 : stories.length - 1;
      const delta = (target - current + stories.length) % stories.length;
      move(delta === stories.length - 1 ? -1 : delta);
    } else move(event.key === 'ArrowRight' ? 1 : -1);
  }}>
    <div className="home-community__navigation">
      <p className="home-community__hint" id="journal-swipe-hint">Swipe to explore</p>
      <div className="home-community__dots" role="group" aria-label="Choose a journal story">{stories.map((story, index) => <button key={story.image} type="button" className="home-community__dot" aria-label={`Show story ${index + 1}: ${story.title}`} aria-current={current === index ? 'true' : undefined} onClick={() => selectStory(index)} />)}</div>
    </div>
    <div className="home-community__viewport" aria-describedby="journal-swipe-hint" onPointerDown={event => {
      if (!event.isPrimary || moving.current) return;
      suppressClick.current = false;
      if (event.pointerType === 'mouse') return;
      gesture.current = { x: event.clientX, y: event.clientY, horizontal: false };
    }} onPointerMove={event => {
      const start = gesture.current;
      if (!start) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (!start.horizontal && Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { gesture.current = null; return; }
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
        start.horizontal = true;
        suppressClick.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
        cancelAnimationFrame(dragFrame.current);
        dragFrame.current = requestAnimationFrame(() => {
          dragFrame.current = 0;
          track.current?.style.setProperty('--community-drag', `${dx}px`);
        });
      }
    }} onPointerUp={event => {
      const start = gesture.current;
      gesture.current = null;
      clearDrag();
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        suppressClick.current = true;
        move(dx < 0 ? 1 : -1);
      } else if (Math.hypot(dx, dy) < 10) {
        // Handle touch taps on release, including browsers that omit a click after swiping.
        const button = event.target.closest('.home-street__image, .home-street__explore');
        if (button) { suppressClick.current = true; button.click(); }
      }
    }} onPointerCancel={() => { gesture.current = null; clearDrag(); }} onClickCapture={event => {
      if (suppressClick.current && event.detail > 0) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
    }}>
      <div className={`home-community__grid${slide.moving ? ' home-community__grid--moving' : ''}${dragging ? ' home-community__grid--dragging' : ''}`} ref={track}
        style={{ transform: `translateX(calc((100% - var(--community-card-width)) / 2 - ${slide.index} * (var(--community-card-width) + var(--community-gap)) + var(--community-drag, 0px)))` }}
        onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === 'transform') finish(); }}>
        {storySlides.map((story, index) => {
          const active = index === slide.index;
          const visible = handheld ? active : Math.abs(index - slide.index) <= 1;
          return <div key={index} className={`home-street${active ? ' home-street--active' : ''}`} role="group" aria-roledescription="slide" aria-label={`${index % stories.length + 1} of ${stories.length}`} aria-hidden={!visible} inert={!visible}>
            <div className="home-street__content">
              <button type="button" className="home-street__image" aria-label={`${active ? 'Explore' : 'Center'} ${story.title}`} aria-current={active ? 'true' : undefined} onClick={() => active ? show(story) : move(index - slide.index)}>
                <img {...mediaFor(story, true)} sizes="(max-width: 600px) 78vw, 32vw" loading="lazy" decoding="async" draggable="false" />
              </button>
              <span className="home-street__label">{story.label}</span>
              <button type="button" className="home-street__explore" aria-label={`Read ${story.title}`} onClick={() => show(story)}>Explore</button>
            </div>
          </div>;
        })}
      </div>
    </div>
    <div className="home-community__controls">
      <button type="button" aria-label="Previous story" aria-controls="community" aria-disabled={slide.moving} onClick={() => move(-1)}><Arrow left /></button>
      <p role="status" aria-live="polite" aria-atomic="true">{String(current + 1).padStart(2, '0')} <span aria-hidden="true">/</span> <span className="home-community__total">{String(stories.length).padStart(2, '0')}</span><span className="home-community__sr-only"> — {stories[current].title}</span></p>
      <button type="button" aria-label="Next story" aria-controls="community" aria-disabled={slide.moving} onClick={() => move(1)}><Arrow /></button>
    </div>
  </div>;
}

export default function HomeEditorial({ onPreview }) {
  const rail = useRef(null);
  const [position, setPosition] = useState({ index: 0, start: true, end: false });
  const show = item => onPreview({ ...item, id: item.image, eyebrow: 'THE CANDICLIE INDEX', media: mediaFor(item) });
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
      <div className="home-editorial__intro"><div><p className="home-eyebrow">THE CANDICLIE INDEX</p><h2 id="directory-heading">Character, <em>in focus.</em></h2></div><p>Different identities.<br /> A shared eye for style.</p></div>
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
      <div className="home-community__intro"><p className="home-eyebrow">THE CANDICLIE JOURNAL</p><h2 id="community-heading">Life, <em>in </em><strong>frames.</strong></h2></div>
      <CommunityCarousel onPreview={onPreview} />
    </section>
  </>;
}
