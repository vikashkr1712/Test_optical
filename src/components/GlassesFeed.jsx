import { useCallback, useEffect, useRef, useState } from 'react';
import { productImage } from './glassesCatalog.js';

const batchSize = 24;

function shuffled(products, previousId) {
  const deck = [...products];
  for (let index = deck.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[other]] = [deck[other], deck[index]];
  }
  if (deck.length > 1 && deck[0].id === previousId) [deck[0], deck[1]] = [deck[1], deck[0]];
  return deck;
}

function nextBatch(source, cursor, repeat, ordered) {
  let { deck, offset, lastId } = cursor;
  const batch = [];
  while (batch.length < batchSize) {
    if (offset === deck.length) {
      if (!repeat) break;
      deck = ordered ? source : shuffled(source, lastId);
      offset = 0;
    }
    const product = deck[offset++];
    batch.push(product);
    lastId = product.id;
  }
  return { batch, cursor: { deck, offset, lastId } };
}

function prepareImage(product) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Image unavailable'));
    const columns = innerWidth < 960 ? 2 : innerWidth >= 1900 ? 4 : 3;
    const displayedWidth = document.querySelector('.glasses-card__image')?.clientWidth || innerWidth * .9 / columns;
    image.src = productImage(product, displayedWidth * devicePixelRatio > 640);
  });
}

export default function GlassesFeed({ products, order, repeat, renderFrame, loadingLabel = 'Loading more frames' }) {
  const source = useRef(products);
  const [frames, setFrames] = useState(() => products.slice(0, batchSize));
  const [loading, setLoading] = useState(false);
  const cursor = useRef({ deck: products, offset: Math.min(batchSize, products.length), lastId: products[Math.min(batchSize, products.length) - 1]?.id });
  const busy = useRef(false);
  const requestVersion = useRef(0);
  const mounted = useRef(false);
  const sentinel = useRef(null);
  const nearEnd = useRef(false);
  const scrolled = useRef(false);
  const retryAfter = useRef(0);
  const hasMore = repeat || frames.length < products.length;

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; requestVersion.current++; };
  }, []);

  const loadMore = useCallback(async () => {
    if (busy.current || !source.current.length || Date.now() < retryAfter.current) return;
    if (!repeat && cursor.current.offset === source.current.length) return;
    busy.current = true;
    setLoading(true);
    const version = ++requestVersion.current;
    const next = nextBatch(source.current, cursor.current, repeat, Boolean(order && order !== 'recommended'));
    try {
      await Promise.all([...new Map(next.batch.map(product => [product.id, product])).values()].map(prepareImage));
      if (!mounted.current || requestVersion.current !== version) return;
      cursor.current = next.cursor;
      setFrames(current => [...current, ...next.batch]);
      busy.current = false;
      retryAfter.current = 0;
      setLoading(false);
    } catch {
      if (!mounted.current || requestVersion.current !== version) return;
      busy.current = false;
      setLoading(false);
      retryAfter.current = Date.now() + 1500;
    }
  }, [order, repeat]);

  useEffect(() => {
    if (!hasMore) return;
    const tryLoad = () => {
      if (scrolled.current && nearEnd.current && !document.querySelector('dialog[open]')) loadMore();
    };
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(([entry]) => {
      nearEnd.current = entry.isIntersecting;
      tryLoad();
    }, { rootMargin: '240px 0px' }) : null;
    if (sentinel.current) observer?.observe(sentinel.current);
    let previousY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (!observer && sentinel.current) {
        const bounds = sentinel.current.getBoundingClientRect();
        nearEnd.current = bounds.top <= innerHeight + 240 && bounds.bottom >= 0;
      }
      if (currentY > previousY + 1) {
        scrolled.current = true;
        tryLoad();
      }
      previousY = currentY;
    };
    const onOnline = () => { retryAfter.current = 0; tryLoad(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('online', onOnline);
    return () => { observer?.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('online', onOnline); };
  }, [hasMore, loadMore]);

  return <>
    <div className="glasses-grid" aria-busy={loading}>{frames.map((product, index) => <div className="glasses-feed__frame" key={`${product.id}-${index}`} data-frame-id={product.id}>{renderFrame(product, index)}</div>)}</div>
    <div className={`glasses-feed__loader${loading ? ' glasses-feed__loader--active' : ''}`} ref={sentinel}>
      {loading && <div className="glasses-feed__status" role="status" aria-live="polite" aria-label={loadingLabel}><span className="glasses-feed__spinner" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index} style={{ '--spoke': index }} />)}</span><span>Loading…</span></div>}
    </div>
  </>;
}
