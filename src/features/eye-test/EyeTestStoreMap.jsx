import { useEffect, useRef, useState } from 'react';
import { storeAreaMapUrl } from './eyeTestStores.js';
import 'leaflet/dist/leaflet.css';

export default function EyeTestStoreMap({ stores, focusedStoreId, onFocusStore, onViewStore }) {
  const container = useRef(null);
  const canvas = useRef(null);
  const instance = useRef(null);
  const actions = useRef({ onFocusStore, onViewStore });
  actions.current = { onFocusStore, onViewStore };
  const fitResults = useRef(() => {});
  const latest = useRef({ stores, focusedStoreId });
  latest.current = { stores, focusedStoreId };
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [tilesUnavailable, setTilesUnavailable] = useState(false);
  const storeKey = stores.map(store => store.id).join('|');
  const active = stores.find(store => store.id === focusedStoreId) || (stores.length === 1 ? stores[0] : null);

  useEffect(() => {
    let cancelled = false;
    let observer;
    let resizeObserver;
    let frame;
    const start = async () => {
      observer?.disconnect();
      try {
        const module = await import('leaflet');
        if (cancelled || !canvas.current) return;
        const L = module.default;
        const initialStores = latest.current.stores;
        const initialActive = initialStores.find(store => store.id === latest.current.focusedStoreId) || (initialStores.length === 1 ? initialStores[0] : null);
        const map = L.map(canvas.current, {
          center: (initialActive || initialStores[0]).coordinates, zoom: initialActive ? 13 : 4, minZoom: 3, maxZoom: 17,
          scrollWheelZoom: false, dragging: !matchMedia('(pointer: coarse)').matches,
          touchZoom: true, doubleClickZoom: false,
          zoomAnimation: false, fadeAnimation: false, markerZoomAnimation: false,
          inertia: false,
        });
        if (!initialActive) map.fitBounds(L.latLngBounds(initialStores.map(store => store.coordinates)), { padding: [42,42], maxZoom: 13, animate: false });
        map.attributionControl.setPrefix(false);
        map.zoomControl.setPosition('bottomleft');
        const tiles = L.tileLayer(import.meta.env.VITE_STORE_MAP_TILES || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
          maxZoom: 19,
        });
        let loadedTiles = 0;
        tiles.on('tileload', () => { loadedTiles++; if (!cancelled) setTilesUnavailable(false); });
        tiles.on('tileerror', () => { if (!cancelled && !loadedTiles) setTilesUnavailable(true); });
        tiles.addTo(map);
        instance.current = { L, map, layer: L.layerGroup().addTo(map) };
        canvas.current.setAttribute('aria-label', 'Store area map. Use plus and minus to zoom; use the store list to choose a location.');
        if ('ResizeObserver' in window) {
          resizeObserver = new ResizeObserver(() => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
              if (cancelled) return;
              map.invalidateSize({ pan: false });
              if (latest.current.focusedStoreId) {
                const store = latest.current.stores.find(item => item.id === latest.current.focusedStoreId);
                if (store) map.setView(store.coordinates, map.getZoom(), { animate: false });
              }
            });
          });
          resizeObserver.observe(canvas.current);
        }
        setReady(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) start(); }, { rootMargin: '120px' });
      observer.observe(container.current);
    } else start();
    return () => {
      cancelled = true;
      observer?.disconnect(); resizeObserver?.disconnect(); cancelAnimationFrame(frame);
      instance.current?.map.remove(); instance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready || !instance.current) return;
    const { L, map, layer } = instance.current;
    const restoreMarkerFocus = canvas.current.contains(document.activeElement) && document.activeElement.classList.contains('eye-map-marker');
    map.stop();
    layer.clearLayers();
    const markers = new Map();
    stores.forEach((store, index) => {
      const selected = active?.id === store.id;
      const icon = L.divIcon({
        className: `eye-map-marker${selected ? ' eye-map-marker--active' : ''}`,
        html: `<span>${index + 1}</span>`, iconSize: [32, 32], iconAnchor: [16, 16],
      });
      const marker = L.marker(store.coordinates, { icon, title: `View ${store.name} area`, keyboard: true, riseOnHover: true, autoPanOnFocus: false }).addTo(layer);
      marker.on('click', () => actions.current.onFocusStore(store.id));
      const element = marker.getElement();
      element?.setAttribute('aria-label', `View ${store.name} area`);
      element?.setAttribute('aria-pressed', String(selected));
      element?.addEventListener('focus', () => map.panInside(store.coordinates, { padding: [32, 32], animate: false }));
      element?.addEventListener('keydown', event => {
        if (event.key !== ' ' && event.key !== 'Enter') return;
        event.preventDefault(); event.stopPropagation();
        marker.fire('click');
      });
      markers.set(store.id, marker);
    });
    fitResults.current = () => {
      map.fitBounds(L.latLngBounds(stores.map(store => store.coordinates)), { padding: [42, 42], maxZoom: 13, animate: false });
    };
    if (active) {
      map.setView(active.coordinates, 13, { animate: false });
      if (restoreMarkerFocus) markers.get(active.id)?.getElement()?.focus({ preventScroll: true });
    } else fitResults.current();
  }, [ready, storeKey, focusedStoreId]);

  return <section className="eye-store-atlas" ref={container} id="eye-store-atlas" aria-labelledby="eye-store-map-heading">
    <div className="eye-store-atlas__heading"><div><p className="eye-eyebrow">EXPLORE THE AREA</p><h4 id="eye-store-map-heading" tabIndex="-1">Locations on the map</h4></div><button type="button" disabled={!ready} onClick={() => fitResults.current()}>Show all results</button></div>
    <div className="eye-map-frame">
      <div className="eye-map-canvas" ref={canvas} role="region" aria-label="Store area map" />
      {!ready && <p className="eye-map-status" role="status">{failed ? 'The map could not be loaded. Use Open maps on a store card.' : 'Loading area map…'}</p>}
    </div>
    {tilesUnavailable && <p className="eye-map-fallback" role="status">The map background is unavailable. Area pins and the links below are still available.</p>}
    <div className="eye-store-atlas__detail"><div role="status" aria-live="polite"><strong>{active ? active.name : `${stores.length} ${stores.length === 1 ? 'location' : 'locations'} shown`}</strong><p>{active ? `${active.address}, ${active.city} · PIN ${active.pinCode}` : 'Choose a pin to view an area and its store card.'}</p></div>{active && <div className="eye-store-atlas__actions"><button type="button" onClick={() => onViewStore(active)}>View store card</button><a href={storeAreaMapUrl(active)} target="_blank" rel="noopener noreferrer">Open area in Google Maps <span aria-hidden="true">↗</span></a></div>}</div>
    <p className="eye-map-note">Pins indicate approximate areas, not verified branch entrances. On phones, pinch to zoom; one-finger swipes scroll the page.</p>
  </section>;
}
