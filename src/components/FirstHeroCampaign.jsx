import { memo, useEffect, useRef, useState } from 'react';
import './FirstHeroCampaign.css';

// The previous campaign soundtrack is looped into the supplied 20-second clip.
const HAS_AUDIO = true;

export const campaignScenes = [
  { start: 0, end: 1.25, headline: 'Your Next Look', tagline: 'Starts with CandiClie.', tone: 'ink' },
  { start: 1.25, end: 2.6, headline: 'Made for You', tagline: 'Everyday. Every occasion.', tone: 'ink' },
  { start: 2.6, end: 3.9, headline: 'Details That Matter', tagline: 'A sharper point of view.', tone: 'light' },
  { start: 3.9, end: 5.25, headline: 'Go Beyond', tagline: 'For your next adventure.', tone: 'ink' },
  { start: 5.25, end: 6.6, headline: 'Own Your Day', tagline: 'Quiet style. Clear confidence.', tone: 'ink' },
  { start: 6.6, end: 7.9, headline: 'A Beautiful View', tagline: 'For your special moments.', tone: 'ink' },
  { start: 7.9, end: 9.25, headline: 'Little Frames. Big Smiles.', tagline: 'A world to discover.', tone: 'ink' },
  { start: 9.25, end: 10.6, headline: 'Find Your People', tagline: 'Wear your own colour.', tone: 'light' },
  { start: 10.6, end: 11.9, headline: 'Simply Timeless', tagline: 'Less fuss. More you.', tone: 'ink' },
  { start: 11.9, end: 13.25, headline: 'Everyday, Elevated', tagline: 'Your new favourite frame.', tone: 'ink' },
  { start: 13.25, end: 14.6, headline: 'Follow the Sun', tagline: 'A fresh perspective.', tone: 'ink' },
  { start: 14.6, end: 15.9, headline: 'Chase the Horizon', tagline: 'Made for the outdoors.', tone: 'light' },
  { start: 15.9, end: 17.25, headline: 'Your Signature Shape', tagline: 'A little more character.', tone: 'ink' },
  { start: 17.25, end: 18.6, headline: 'Keep Moving', tagline: 'See where life takes you.', tone: 'light' },
  { start: 18.6, end: 20, headline: 'See Life. Your Way.', tagline: 'Find your frame at CandiClie.', tone: 'ink' },
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
    function update(time = player.currentTime) {
      setSceneIndex(current => {
        const next = sceneAt(time);
        return current === next ? current : next;
      });
      // Loop detection follows the actual clip length, including native loop seeks.
      if (!player.seeking) {
        if (Number.isFinite(player.duration) && previousTime.current > player.duration - .5 && time < .5 && !player.paused) onComplete?.();
        previousTime.current = time;
      }
    }
    const timeUpdate = () => {
      if (!active || !player.requestVideoFrameCallback || player.paused || player.seeking) update(player.currentTime);
    };
    const seeked = () => update(player.currentTime);
    const ended = () => { update(); onComplete?.(); };
    const reset = () => { previousTime.current = 0; setSceneIndex(0); };
    function frame(_now, metadata) {
      if (cancelled) return;
      update(metadata.mediaTime);
      callback = player.requestVideoFrameCallback(frame);
    }
    player.addEventListener('timeupdate', timeUpdate);
    player.addEventListener('seeked', seeked);
    player.addEventListener('pause', timeUpdate);
    player.addEventListener('loadedmetadata', seeked);
    player.addEventListener('emptied', reset);
    player.addEventListener('ended', ended);
    update(player.currentTime);
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
    <div className="first-campaign-stage" data-scene={sceneIndex + 1} data-tone={scene.tone}>
      <video ref={video} className="home-hero__video first-campaign-video" src={loadedSource === src ? src : undefined}
        poster="/assets/hero/first-campaign-poster.webp"
        muted={muted} loop playsInline preload={active ? 'auto' : warm ? 'metadata' : 'none'} aria-label="Eyewear campaign"
        onPlay={() => setPaused(false)} onPause={() => setPaused(true)} onError={() => setFailed(true)} />
      {failed && <span className="home-hero__media-error" role="status">This video could not be loaded.</span>}
      <div className="first-campaign-caption" data-scene={sceneIndex + 1}>
        <div className="first-campaign-caption__text" key={sceneIndex}>
          <h2>{scene.headline}</h2>
          <p>{scene.tagline}</p>
        </div>
      </div>
    </div>
    <div className="home-hero__video-controls">
      <button type="button" tabIndex={active && !clone ? 0 : -1} aria-label={paused ? 'Play video' : 'Pause video'} onClick={() => {
        if (video.current.paused) {
          setUserPaused(false);
          video.current.play().catch(() => setPaused(true));
        } else { setUserPaused(true); video.current.pause(); }
      }}><PauseIcon paused={paused} /></button>
      {HAS_AUDIO && <button type="button" tabIndex={active && !clone ? 0 : -1} aria-label={muted ? 'Unmute video' : 'Mute video'} onClick={() => {
        const next = !video.current.muted;
        audioPreference.current = next;
        video.current.muted = next;
        setMuted(next);
      }}><SoundIcon muted={muted} /></button>}
    </div>
  </>;
});
