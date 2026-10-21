import { memo, useCallback, useEffect, useRef, useState } from 'react';
import './GKBHero.css';
import slides from './GKBHero.slides.js';
import FirstHeroCampaign from './FirstHeroCampaign.jsx';

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

const VideoSlide = memo(function VideoSlide({ src, label, reducedMotion, active, warm, clone = false }) {
  const video = useRef(null);
  const [loadedSource, setLoadedSource] = useState(null);
  const [paused, setPaused] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setMuted(true);
    setUserPaused(false);
    setFailed(false);
  }, [src]);
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
  }, [src, loadedSource, active, reducedMotion, userPaused]);
  return <>
    <video ref={video} className="gkb-hero__video" src={loadedSource === src ? src : undefined} autoPlay={active && !reducedMotion && !userPaused} muted={muted} loop playsInline preload={active ? 'auto' : warm ? 'metadata' : 'none'}
      aria-label={label} onError={() => setFailed(true)} onPlay={() => setPaused(false)} onPause={() => setPaused(true)} />
    {failed && <span className="gkb-hero__media-error" role="status">This video could not be loaded.</span>}
    <div className="gkb-hero__video-controls">
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

const HeroSlide = memo(function HeroSlide({ slide, number, mobile, active, warm, reducedMotion, clone = false, onCampaignComplete, campaignAudio }) {
  return <div className={clone ? 'gkb-hero__clone' : 'gkb-hero__slide'} data-slide={clone ? 'clone' : number} data-campaign={slide.campaign ? 'first' : undefined}
    role={clone ? 'presentation' : 'group'} aria-roledescription={clone ? undefined : 'slide'}
    aria-label={clone ? undefined : `${number + 1} of ${slides.length}: ${slide.name}`} aria-hidden={clone || !active}>
    {slide.type === 'video' ? <>
      {slide.campaign ? <FirstHeroCampaign src={mobile ? slide.mobile : slide.desktop} active={active} warm={warm} reducedMotion={reducedMotion} clone={clone}
        PauseIcon={PauseIcon} SoundIcon={SoundIcon} onComplete={onCampaignComplete} audioPreference={campaignAudio} /> :
        <VideoSlide src={mobile ? slide.mobile : slide.desktop} label={slide.name} active={active} warm={warm} reducedMotion={reducedMotion} clone={clone} />}
      <a className="gkb-hero__media-link" href={slide.href} tabIndex={active && !clone ? 0 : -1} aria-label={`Explore ${slide.name}`} draggable="false" />
    </> : <>
      <a className="gkb-hero__image-link" href={slide.href} tabIndex={-1} aria-hidden="true" draggable="false">
        <picture>
          <source media="(max-width: 767px)" srcSet={slide.mobile} />
          <img src={slide.desktop} alt={slide.name} loading={active || warm ? 'eager' : 'lazy'} fetchPriority={active || warm ? 'high' : 'low'} draggable="false" decoding="async" />
        </picture>
      </a>
      <a className="gkb-hero__cta" href={slide.href} tabIndex={active && !clone ? 0 : -1}>{slide.cta}</a>
    </>}
  </div>;
});

/** Only the homepage hero. Place below the existing header; no other sections are rendered.
 * Set --gkb-hero-desktop-offset / --gkb-hero-mobile-offset on the host if its header differs.
 * Navigation uses local paths from GKBHero.slides.js.
 */
export default function GKBHero({ className = '' }) {
  const mobile = useMediaQuery('(max-width: 767px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [campaignComplete, setCampaignComplete] = useState(false);
  const campaignAudio = useRef(undefined);
  const handleCampaignComplete = useCallback(() => setCampaignComplete(true), []);
  const region = useRef(null);
  const track = useRef(null);
  const currentPosition = useRef(0);
  const gesture = useRef(null);
  const dragOffset = useRef(0);
  const dragFrame = useRef(0);
  const preventClick = useRef(false);
  const remaining = useRef(mobile ? 3000 : 5000);
  const goTo = useCallback((next, rewind = false) => {
    const target = rewind && next === slides.length ? slides.length : Math.max(0, Math.min(slides.length - 1, next));
    const changed = target !== currentPosition.current;
    currentPosition.current = target;
    setPosition(target);
    setIndex(target % slides.length);
    if (target % slides.length === 0) setCampaignComplete(false);
    setTransitioning(changed && !reducedMotion);
    setCycle(value => value + 1);
  }, [reducedMotion]);

  const finishTransition = useCallback(() => {
    if (currentPosition.current === slides.length) {
      const cloneVideo = track.current.querySelector('[data-slide="clone"] video');
      const firstVideo = track.current.querySelector('[data-slide="0"] video');
      if (firstVideo?.readyState >= 1 && cloneVideo?.readyState >= 1) firstVideo.currentTime = cloneVideo.currentTime;
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
    remaining.current = slides[index].campaign && campaignComplete ? 0 : mobile ? 3000 : 5000;
  }, [index, cycle, mobile, campaignComplete]);

  useEffect(() => {
    if (reducedMotion || focused || hidden || dragging || hovered || transitioning || (slides[index].campaign && !campaignComplete)) return;
    const started = performance.now();
    const timer = setTimeout(() => {
      goTo(currentPosition.current + 1, true);
    }, remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [index, cycle, mobile, hovered, focused, reducedMotion, hidden, dragging, transitioning, goTo, campaignComplete]);

  useEffect(() => {
    if (position === slides.length && reducedMotion) finishTransition();
    if (!transitioning) return;
    const fallback = setTimeout(finishTransition, TRANSITION_MS + 100);
    return () => clearTimeout(fallback);
  }, [position, cycle, transitioning, reducedMotion, finishTransition]);

  useEffect(() => () => cancelAnimationFrame(dragFrame.current), []);

  const startDrag = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (event.target.closest('button')) return;
    gesture.current = { x: event.clientX, y: event.clientY, started: performance.now(), id: event.pointerId, dragging: false };
    preventClick.current = false;
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
      const resistance = (index === 0 && dx > 0) || (index === slides.length - 1 && dx < 0);
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
    const advance = preventClick.current && (duration < 300 || Math.abs(dx) > region.current.clientWidth / 2);
    const target = advance ? Math.max(0, Math.min(slides.length - 1, index + (dx < 0 ? 1 : -1))) : index;
    if (start.dragging) {
      track.current.style.transitionDuration = reducedMotion ? '0ms' : `${TRANSITION_MS}ms`;
      track.current.style.transform = `translate3d(${-target * 100}%, 0, 0)`;
      goTo(target);
      setTransitioning(!reducedMotion);
    }
    setDragging(false);
    if (region.current.hasPointerCapture(event.pointerId)) region.current.releasePointerCapture(event.pointerId);
  };

  return <section ref={region} className={`gkb-hero${transitioning || dragging ? ' gkb-hero--moving' : ''} ${className}`} role="region" aria-roledescription="carousel" aria-label="GKB featured collections"
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }} onPointerLeave={event => { if (event.pointerType === 'mouse') setHovered(false); }}
    onFocusCapture={event => { if (event.target.matches(':focus-visible')) setFocused(true); }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={() => {
      gesture.current = null; cancelAnimationFrame(dragFrame.current); dragFrame.current = 0; dragOffset.current = 0;
      track.current.style.transitionDuration = reducedMotion ? '0ms' : `${TRANSITION_MS}ms`;
      track.current.style.transform = `translate3d(${-currentPosition.current * 100}%, 0, 0)`;
      setDragging(false); setTransitioning(!reducedMotion);
    }}
    onClickCapture={event => { if (preventClick.current) { event.preventDefault(); preventClick.current = false; } }}
    onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); goTo(index + (event.key === 'ArrowRight' ? 1 : -1)); } }}>
    <div ref={track} className="gkb-hero__track" onTransitionEnd={event => {
      if (event.target === event.currentTarget && event.propertyName === 'transform') finishTransition();
    }} style={{ transform: `translate3d(calc(${-position * 100}% + ${dragOffset.current}px), 0, 0)`, transitionDuration: dragging || reducedMotion || !transitioning ? '0ms' : `${TRANSITION_MS}ms` }}>
      {slides.map((slide, i) => <HeroSlide key={slide.name} slide={slide} number={i} mobile={mobile} active={position === i && !hidden}
        warm={i === (index + 1) % slides.length} reducedMotion={reducedMotion} onCampaignComplete={slide.campaign ? handleCampaignComplete : undefined} campaignAudio={slide.campaign ? campaignAudio : undefined} />)}
      <HeroSlide slide={slides[0]} number={0} mobile={mobile} active={position === slides.length && !hidden} warm={position >= slides.length - 1} reducedMotion={reducedMotion} onCampaignComplete={handleCampaignComplete} campaignAudio={campaignAudio} clone />
    </div>
    <div className="gkb-hero__pagination" aria-label="Choose a slide">
      {slides.map((slide, i) => <button type="button" key={slide.name} aria-label={`Go to slide ${i + 1}: ${slide.name}`} aria-current={index === i ? 'true' : undefined} className={`gkb-hero__bullet${i === index ? ' gkb-hero__bullet--active' : ''}`} onClick={() => goTo(i)} />)}
    </div>
  </section>;
}
