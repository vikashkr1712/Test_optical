import { memo, useEffect, useRef, useState } from 'react';
import './FirstHeroCampaign.css';

export const campaignScenes = [
  { start: 0, end: 1.29, headline: 'Find Your Perfect Fit', tagline: 'Confidence in Every Frame', placement: 'left' },
  { start: 1.29, end: 2.63, headline: 'Crafted for Clarity', tagline: 'Designed for Everyday Comfort', placement: 'upper-left' },
  { start: 2.63, end: 3.96, headline: 'Own the Sunshine', tagline: 'Bold Looks, Clear Horizons', placement: 'right' },
  { start: 3.96, end: 5.17, headline: 'Discover Your Look', tagline: 'Find the Frame That Fits', placement: 'shop' },
  { start: 5.17, end: 6.5, headline: 'Timeless by Design', tagline: 'Confidence Never Fades', placement: 'left' },
  { start: 6.5, end: 8, headline: 'Every Detail Matters', tagline: 'Find Your Signature Frame', placement: 'upper-left' },
];

function sceneAt(time) {
  for (let i = campaignScenes.length - 1; i >= 0; i--) if (time >= campaignScenes[i].start) return i;
  return 0;
}

export default memo(function FirstHeroCampaign({ src, active, warm, reducedMotion, clone, PauseIcon, SoundIcon, onComplete, audioPreference }) {
  const video = useRef(null);
  const [loadedSource, setLoadedSource] = useState(() => active || warm ? src : null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [paused, setPaused] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [muted, setMuted] = useState(() => audioPreference.current ?? false);
  const [failed, setFailed] = useState(false);
  const previousTime = useRef(0);

  useEffect(() => { if (active || warm) setLoadedSource(src); }, [src, active, warm]);

  useEffect(() => {
    const player = video.current;
    let cancelled = false;
    if (!active || reducedMotion || userPaused || loadedSource !== src) {
      player.pause();
      return;
    }
    async function play() {
      try {
        // Try the original sound; browser policy can require a user gesture.
        const preferredMute = audioPreference.current ?? false;
        player.muted = preferredMute;
        setMuted(preferredMute);
        await player.play();
      } catch (error) {
        if (cancelled) return;
        if (error.name !== 'NotAllowedError') { setPaused(true); return; }
        player.muted = true;
        audioPreference.current = true;
        setMuted(true);
        try { await player.play(); } catch { if (!cancelled) setPaused(true); }
      }
      if (cancelled) player.pause();
    }
    play();
    return () => { cancelled = true; player.pause(); };
    // Muting is controlled directly by its button; it must not restart playback.
  }, [src, loadedSource, active, reducedMotion, userPaused, audioPreference]);

  useEffect(() => {
    const player = video.current;
    let callback;
    let cancelled = false;
    function update(time = player.currentTime, seeking = false) {
      setSceneIndex(current => {
        const next = sceneAt(time);
        return current === next ? current : next;
      });
      if (previousTime.current > 7 && time < 1 && !player.paused) onComplete?.();
      previousTime.current = time;
    }
    const timeUpdate = () => update(player.currentTime, player.seeking);
    const seeked = () => update(player.currentTime, true);
    const ended = () => { update(); onComplete?.(); };
    const reset = () => { previousTime.current = 0; setSceneIndex(0); };
    function frame(_now, metadata) {
      if (cancelled) return;
      update(player.currentTime, player.seeking);
      callback = player.requestVideoFrameCallback(frame);
    }
    player.addEventListener('timeupdate', timeUpdate);
    player.addEventListener('seeked', seeked);
    player.addEventListener('pause', timeUpdate);
    player.addEventListener('loadedmetadata', seeked);
    player.addEventListener('emptied', reset);
    player.addEventListener('ended', ended);
    update(player.currentTime, true);
    if (active && player.requestVideoFrameCallback) callback = player.requestVideoFrameCallback(frame);
    return () => {
      cancelled = true;
      if (callback !== undefined) player.cancelVideoFrameCallback?.(callback);
      player.removeEventListener('timeupdate', timeUpdate);
      player.removeEventListener('seeked', seeked);
      player.removeEventListener('pause', timeUpdate);
      player.removeEventListener('loadedmetadata', seeked);
      player.removeEventListener('emptied', reset);
      player.removeEventListener('ended', ended);
    };
  }, [src, active, onComplete]);

  const scene = campaignScenes[sceneIndex];
  return <>
    <video ref={video} className="gkb-hero__video first-campaign-video" src={loadedSource === src ? src : undefined}
      muted={muted} loop playsInline preload={active ? 'auto' : warm ? 'metadata' : 'none'} aria-label="Eyewear campaign"
      onPlay={() => setPaused(false)} onPause={() => setPaused(true)} onError={() => setFailed(true)} />
    {failed && <span className="gkb-hero__media-error" role="status">This video could not be loaded.</span>}
    <div className={`first-campaign-caption first-campaign-caption--${scene.placement}`} data-scene={sceneIndex + 1}>
      <div className="first-campaign-caption__text" key={sceneIndex}>
        <h2>{scene.headline}</h2>
        <p>{scene.tagline}</p>
      </div>
    </div>
    <div className="gkb-hero__video-controls">
      <button type="button" tabIndex={active && !clone ? 0 : -1} aria-label={paused ? 'Play video' : 'Pause video'} onClick={() => {
        if (video.current.paused) {
          setUserPaused(false);
          video.current.play().catch(() => setPaused(true));
        } else { setUserPaused(true); video.current.pause(); }
      }}><PauseIcon paused={paused} /></button>
      <button type="button" tabIndex={active && !clone ? 0 : -1} aria-label={muted ? 'Unmute video' : 'Mute video'} onClick={() => {
        const next = !video.current.muted;
        audioPreference.current = next;
        video.current.muted = next;
        setMuted(next);
      }}><SoundIcon muted={muted} /></button>
    </div>
  </>;
});
