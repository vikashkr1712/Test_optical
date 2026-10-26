import { memo, useCallback, useEffect, useRef, useState } from 'react';
import './HomeHero.css';
import './HeroImageCampaign.css';
import slides from './HomeHero.slides.js';
import FirstHeroCampaign from './FirstHeroCampaign.jsx';
import HeroVideoCaption from './HeroVideoCaption.jsx';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

function PauseIcon({ paused }) {
  return paused ? <svg width="17" height="22" viewBox="0 0 17 22" fill="white" aria-hidden="true"><path d="M1 1v20l16-10z" /></svg> :
    <svg width="17" height="22" viewBox="0 0 17 22" fill="white" aria-hidden="true"><rect width="6" height="22" rx="1" /><rect x="11" width="6" height="22" rx="1" /></svg>;
}

function SoundIcon({ muted }) {
  return <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    {muted ? <path d="M24 17.8667L21.4667 20.4001C21.2222 20.6445 20.9111 20.7667 20.5333 20.7667C20.1556 20.7667 19.8444 20.6445 19.6 20.4001C19.3556 20.1556 19.2333 19.8445 19.2333 19.4667C19.2333 19.089 19.3556 18.7779 19.6 18.5334L22.1333 16.0001L19.6 13.4667C19.3556 13.2223 19.2333 12.9112 19.2333 12.5334C19.2333 12.1556 19.3556 11.8445 19.6 11.6001C19.8444 11.3556 20.1556 11.2334 20.5333 11.2334C20.9111 11.2334 21.2222 11.3556 21.4667 11.6001L24 14.1334L26.5333 11.6001C26.7778 11.3556 27.0889 11.2334 27.4667 11.2334C27.8444 11.2334 28.1556 11.3556 28.4 11.6001C28.6444 11.8445 28.7667 12.1556 28.7667 12.5334C28.7667 12.9112 28.6444 13.2223 28.4 13.4667L25.8667 16.0001L28.4 18.5334C28.6444 18.7779 28.7667 19.089 28.7667 19.4667C28.7667 19.8445 28.6444 20.1556 28.4 20.4001C28.1556 20.6445 27.8444 20.7667 27.4667 20.7667C27.0889 20.7667 26.7778 20.6445 26.5333 20.4001L24 17.8667ZM9.33333 20.0001H5.33333C4.95556 20.0001 4.63911 19.8721 4.384 19.6161C4.12889 19.3601 4.00089 19.0436 4 18.6667V13.3334C4 12.9556 4.128 12.6392 4.384 12.3841C4.64 12.129 4.95644 12.001 5.33333 12.0001H9.33333L13.7333 7.60008C14.1556 7.17786 14.6391 7.08319 15.184 7.31608C15.7289 7.54897 16.0009 7.96586 16 8.56675V23.4334C16 24.0334 15.728 24.4503 15.184 24.6841C14.64 24.9179 14.1564 24.8232 13.7333 24.4001L9.33333 20.0001ZM13.3333 11.8001L10.4667 14.6667H6.66667V17.3334H10.4667L13.3333 20.2001V11.8001Z" fill="white" /> : <><path d="M4 12h5l7-5v18l-7-5H4z" fill="white" /><path d="M20 11a7 7 0 010 10m4-14a12 12 0 010 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></>}
  </svg>;
}

const TRANSITION_MS = 600;
const IMAGE_DWELL_MS = 5000;

const VideoSlide = memo(function VideoSlide({ src, label, caption, reducedMotion, selected, active, warm, restartKey, onComplete, clone = false }) {
  const video = useRef(null);
  const [loadedSource, setLoadedSource] = useState(null);
  const [paused, setPaused] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!selected) return;
    video.current.currentTime = 0;
    setMuted(true);
    setUserPaused(false);
    setFailed(false);
  }, [src, selected, restartKey]);
  useEffect(() => {
    if (active || warm) setLoadedSource(src);
  }, [src, active, warm]);
  useEffect(() => {
    const player = video.current;
    if (!active || reducedMotion || userPaused || loadedSource !== src) {
      player.pause();
      return;
    }
    let cancelled = false;
    player.play().catch(() => { if (!cancelled) setPaused(true); });
    return () => { cancelled = true; player.pause(); };
  }, [src, loadedSource, active, reducedMotion, userPaused, restartKey]);
  return <>
    <div className={`hero-video-stage${caption ? ' hero-video-stage--captioned' : ''}`}>
      <video ref={video} className="home-hero__video" src={loadedSource === src ? src : undefined} muted={muted} playsInline preload={active ? 'auto' : warm ? 'metadata' : 'none'}
        aria-label={label} onEnded={() => { if (active) onComplete(); }} onError={() => setFailed(true)} onPlay={() => setPaused(false)} onPause={() => setPaused(true)} />
      {caption && <HeroVideoCaption {...caption} />}
    </div>
    {failed && <span className="home-hero__media-error" role="status">This video could not be loaded.</span>}
    <div className="home-hero__video-controls">
      <button type="button" tabIndex={active && !clone ? 0 : -1} aria-label={paused ? 'Play video' : 'Pause video'} onClick={() => {
        if (video.current.paused) {
          setUserPaused(false);
          video.current.play().catch(() => setPaused(true));
        } else {
          setUserPaused(true);
          video.current.pause();
        }
      }}><PauseIcon paused={paused} /></button>
      <button type="button" tabIndex={active && !clone ? 0 : -1} aria-label={muted ? 'Unmute video' : 'Mute video'} onClick={() => setMuted(value => !value)}><SoundIcon muted={muted} /></button>
    </div>
  </>;
});

const HeroSlide = memo(function HeroSlide({ slide, number, mobile, selected, active, warm, reducedMotion, restartKey, clone = false, onVideoComplete, campaignAudio }) {
  const [imageReady, setImageReady] = useState(active || warm);
  useEffect(() => { if (active || warm) setImageReady(true); }, [active, warm]);
  return <div className={clone ? 'home-hero__clone' : 'home-hero__slide'} data-slide={clone ? 'clone' : number} data-campaign={slide.campaign ? 'first' : undefined} data-editorial={slide.editorial || undefined} data-theme={slide.theme}
    role={clone ? 'presentation' : 'group'} aria-roledescription={clone ? undefined : 'slide'}
    aria-label={clone ? undefined : `${number + 1} of ${slides.length}: ${slide.name}`} aria-hidden={clone || !selected}>
    {slide.type === 'video' ? <>
      {slide.campaign ? <FirstHeroCampaign src={mobile ? slide.mobile : slide.desktop} selected={selected} active={active} warm={warm} restartKey={restartKey} reducedMotion={reducedMotion} clone={clone}
        PauseIcon={PauseIcon} SoundIcon={SoundIcon} onComplete={() => onVideoComplete(number)} audioPreference={campaignAudio} /> :
        <VideoSlide src={mobile ? slide.mobile : slide.desktop} label={slide.name} caption={slide.caption} selected={selected} active={active} warm={warm} restartKey={restartKey} onComplete={() => onVideoComplete(number)} reducedMotion={reducedMotion} clone={clone} />}
      <a className="home-hero__media-link" href={slide.href} tabIndex={active && !clone ? 0 : -1} aria-label={`Explore ${slide.name}`} draggable="false" />
    </> : <div className={slide.editorial ? 'hero-image-campaign' : undefined}>
      <a className="home-hero__image-link" href={slide.href} tabIndex={-1} aria-hidden="true" draggable="false">
        {imageReady && <picture>
          <source media="(max-width: 767px)" srcSet={slide.mobile} />
          <img src={slide.desktop} alt={slide.alt || slide.name} style={slide.position ? { objectPosition: slide.position } : undefined} loading={active || warm ? 'eager' : 'lazy'} fetchPriority={active || warm ? 'high' : 'low'} draggable="false" decoding="async" />
        </picture>}
      </a>
      {slide.editorial ? <div className="hero-image-campaign__copy">
        <p className="hero-image-campaign__eyebrow">{slide.eyebrow}</p>
        <h2>{slide.headline}</h2>
        <p className="hero-image-campaign__description">{slide.description}</p>
        <a className="home-hero__cta" href={slide.href} tabIndex={active && !clone ? 0 : -1}>{slide.cta}<span aria-hidden="true">↗</span></a>
      </div> : <a className="home-hero__cta" href={slide.href} tabIndex={active && !clone ? 0 : -1}>{slide.cta}</a>}
    </div>}
  </div>;
});

/** Only the homepage hero. Place below the existing header; no other sections are rendered.
 * Set --home-hero-desktop-offset / --home-hero-mobile-offset on the host if its header differs.
 * Navigation uses local paths from HomeHero.slides.js.
 */
export default function HomeHero({ className = '' }) {
  const mobile = useMediaQuery('(max-width: 767px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [inView, setInView] = useState(true);
  const [completedVideo, setCompletedVideo] = useState(null);
  const campaignAudio = useRef(undefined);
  const region = useRef(null);
  const track = useRef(null);
  const currentPosition = useRef(0);
  const handleVideoComplete = useCallback(number => {
    if (currentPosition.current % slides.length === number) setCompletedVideo(number);
  }, []);
  const gesture = useRef(null);
  const dragOffset = useRef(0);
  const dragFrame = useRef(0);
  const preventClick = useRef(false);
  const markerPress = useRef(null);
  const remaining = useRef(IMAGE_DWELL_MS);
  const goTo = useCallback((next, rewind = false) => {
    const target = rewind && next === slides.length ? slides.length : Math.max(0, Math.min(slides.length - 1, next));
    const changed = target !== currentPosition.current;
    currentPosition.current = target;
    setPosition(target);
    setIndex(target % slides.length);
    setCompletedVideo(null);
    setTransitioning(changed && !reducedMotion);
    setCycle(value => value + 1);
  }, [reducedMotion]);

  const finishTransition = useCallback(() => {
    if (currentPosition.current === slides.length) {
      // Reset behind the identical first-slide buffer, without sweeping through seven slides.
      track.current.style.transitionDuration = '0ms';
      currentPosition.current = 0;
      setPosition(0);
    }
    setTransitioning(false);
  }, []);

  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.01 });
    observer.observe(region.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    remaining.current = completedVideo === index ? 0 : IMAGE_DWELL_MS;
  }, [index, cycle, completedVideo]);

  useEffect(() => {
    if (reducedMotion || focused || hidden || !inView || dragging || transitioning || (slides[index].type === 'video' && completedVideo !== index)) return;
    const started = performance.now();
    const timer = setTimeout(() => {
      goTo(currentPosition.current + 1, true);
    }, remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [index, cycle, focused, reducedMotion, hidden, inView, dragging, transitioning, goTo, completedVideo]);

  useEffect(() => {
    if (position === slides.length && reducedMotion) finishTransition();
    if (!transitioning) return;
    const fallback = setTimeout(finishTransition, TRANSITION_MS + 100);
    return () => clearTimeout(fallback);
  }, [position, cycle, transitioning, reducedMotion, finishTransition]);

  useEffect(() => () => cancelAnimationFrame(dragFrame.current), []);

  const startDrag = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    preventClick.current = false;
    if (event.target.closest('button')) return;
    gesture.current = { x: event.clientX, y: event.clientY, started: performance.now(), id: event.pointerId, dragging: false };
  };
  const moveDrag = (event) => {
    const start = gesture.current;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dy) > Math.abs(dx) && !start.dragging) { gesture.current = null; return; }
    if (Math.abs(dx) > 5) {
      if (!start.dragging) {
        region.current.setPointerCapture(event.pointerId);
        start.dragging = true;
        setDragging(true);
        setTransitioning(false);
      }
      preventClick.current = true;
      const resistance = index === 0 && dx > 0;
      dragOffset.current = resistance ? Math.sign(dx) * Math.pow(Math.abs(dx), 0.85) : dx;
      if (!dragFrame.current) dragFrame.current = requestAnimationFrame(() => {
        dragFrame.current = 0;
        if (track.current) track.current.style.transform = `translate3d(calc(${-currentPosition.current * 100}% + ${dragOffset.current}px), 0, 0)`;
      });
    }
  };
  const endDrag = (event) => {
    const start = gesture.current;
    if (!start) return;
    gesture.current = null;
    const dx = event.clientX - start.x;
    const duration = performance.now() - start.started;
    cancelAnimationFrame(dragFrame.current);
    dragFrame.current = 0;
    dragOffset.current = 0;
    const advance = preventClick.current && (Math.abs(dx) > Math.min(72, region.current.clientWidth * .18) || (Math.abs(dx) > 24 && duration < 350));
    const target = advance ? Math.max(0, Math.min(slides.length, index + (dx < 0 ? 1 : -1))) : index;
    if (start.dragging) {
      track.current.style.transitionDuration = reducedMotion ? '0ms' : `${TRANSITION_MS}ms`;
      track.current.style.transform = `translate3d(${-target * 100}%, 0, 0)`;
      goTo(target, target === slides.length);
      setTransitioning(!reducedMotion);
    }
    setDragging(false);
    if (region.current.hasPointerCapture(event.pointerId)) region.current.releasePointerCapture(event.pointerId);
  };

  return <section ref={region} className={`home-hero${transitioning || dragging ? ' home-hero--moving' : ''} ${className}`} role="region" aria-roledescription="carousel" aria-label="candiclie featured collections"
    onFocusCapture={event => { if (event.target.matches(':focus-visible')) setFocused(true); }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={() => {
      gesture.current = null; cancelAnimationFrame(dragFrame.current); dragFrame.current = 0; dragOffset.current = 0;
      track.current.style.transitionDuration = reducedMotion ? '0ms' : `${TRANSITION_MS}ms`;
      track.current.style.transform = `translate3d(${-currentPosition.current * 100}%, 0, 0)`;
      setDragging(false); setTransitioning(!reducedMotion);
    }}
    onClickCapture={event => { if (preventClick.current) { event.preventDefault(); preventClick.current = false; } }}
    onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); goTo(index + (event.key === 'ArrowRight' ? 1 : -1)); } }}>
    <div ref={track} className="home-hero__track" onTransitionEnd={event => {
      if (event.target === event.currentTarget && event.propertyName === 'transform') finishTransition();
    }} style={{ transform: `translate3d(calc(${-position * 100}% + ${dragOffset.current}px), 0, 0)`, transitionDuration: dragging || reducedMotion || !transitioning ? '0ms' : `${TRANSITION_MS}ms` }}>
      {slides.map((slide, i) => <HeroSlide key={slide.name} slide={slide} number={i} mobile={mobile} selected={position === i} active={position === i && !hidden && inView && !transitioning}
        warm={inView && i === (index + 1) % slides.length} restartKey={cycle} reducedMotion={reducedMotion} onVideoComplete={handleVideoComplete} campaignAudio={slide.campaign ? campaignAudio : undefined} />)}
      <HeroSlide slide={slides[0]} number={0} mobile={mobile} selected={false} active={false} warm={inView && position >= slides.length - 1} restartKey={cycle} reducedMotion={reducedMotion} onVideoComplete={handleVideoComplete} campaignAudio={campaignAudio} clone />
    </div>
    <div className="home-hero__pagination" aria-label="Choose a slide" onPointerDown={event => {
      preventClick.current = false;
      markerPress.current = { id: event.pointerId, x: event.clientX, y: event.clientY, cancelled: false, handled: false };
      event.stopPropagation();
    }} onPointerMove={event => {
      const press = markerPress.current;
      if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10) press.cancelled = true;
    }} onPointerCancel={() => { markerPress.current = null; }} onClickCapture={event => {
      // Touch selects on release, even when the browser suppresses a click after a swipe.
      // Ignore its subsequent compatibility click; keyboard and mouse keep native clicks.
      if (markerPress.current?.handled && event.detail > 0) { event.preventDefault(); event.stopPropagation(); }
      markerPress.current = null;
    }}>
      {slides.map((slide, i) => <button type="button" key={slide.name} aria-label={`Go to slide ${i + 1}: ${slide.name}`} aria-current={index === i ? 'true' : undefined} className={`home-hero__bullet${i === index ? ' home-hero__bullet--active' : ''}`} onPointerUp={event => {
        const press = markerPress.current;
        const box = event.currentTarget.getBoundingClientRect();
        if (event.pointerType === 'touch' && press?.id === event.pointerId) {
          // Chrome can retarget a gap tap to a nearby button. Consume its later
          // compatibility click even when the original touch was outside the button.
          press.handled = true;
          if (!press.cancelled && event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom) goTo(i);
        }
      }} onClick={() => goTo(i)} />)}
    </div>
  </section>;
}
