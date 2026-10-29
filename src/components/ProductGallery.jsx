import { useEffect, useId, useRef, useState } from 'react';
import { productImage } from './glassesCatalog.js';
import useSwipe from './useSwipe.js';
import './ProductGallery.css';

function GalleryIcon({ name }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'close' ? <path d="m6 6 12 12M6 18 18 6" /> : name === 'left' ? <path d="m14 5-7 7 7 7" /> : name === 'right' ? <path d="m10 5 7 7-7 7" /> : <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5M7.5 10.5h6" />{name === 'zoom-in' && <path d="M10.5 7.5v6" />}</>}
  </svg>;
}

export default function ProductGallery({ product }) {
  const viewer = useRef(null);
  const canvas = useRef(null);
  const closeButton = useRef(null);
  const drag = useRef(null);
  const titleId = useId();
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const isFrame = ['Eyeglasses', 'Sunglasses'].includes(product.type);
  const mainSource = productImage(product, true);
  const images = [{ src: mainSource, label: isFrame ? 'Front view' : 'Main view' }];
  if (product.imageAlt && product.imageAlt !== mainSource) images.push({ src: product.imageAlt, label: isFrame ? 'Side view' : 'Alternate view' });
  const current = images[index];
  const title = `${product.brand} ${product.model}`;
  const choose = next => { setIndex((next + images.length) % images.length); setZoomed(false); };
  const swipe = useSwipe({ enabled: images.length > 1, onSwipe: direction => choose(index + direction) });
  const viewerSwipe = useSwipe({ enabled: !zoomed && images.length > 1, onSwipe: direction => choose(index + direction) });

  useEffect(() => {
    if (!expanded) return;
    const modal = viewer.current;
    modal.showModal();
    closeButton.current.focus();
    return () => { if (modal.open) modal.close(); };
  }, [expanded]);

  useEffect(() => { drag.current = null; if (canvas.current) canvas.current.scrollTo(0, 0); }, [index, zoomed]);

  return <>
    <div className="home-preview__product-visual product-gallery">
      <div className="product-gallery__heading"><span>{product.type}</span><span>{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span></div>
      <div className="product-gallery__stage" {...swipe}>
        <button type="button" className="product-gallery__enlarge" aria-label={`Enlarge ${title} image`} onClick={() => { setZoomed(false); setExpanded(true); }}>
          <img src={current.src} width="640" height="400" alt={`${title}${product.colour ? `, ${product.colour}` : ''}, ${current.label.toLowerCase()}`} draggable="false" />
          <span className="product-gallery__enlarge-label"><GalleryIcon name="zoom-in" />Enlarge</span>
        </button>
      </div>
      <div className="product-gallery__caption"><span>{current.label}</span><span>Click image for a closer look</span></div>
      {images.length > 1 && <div className="home-preview__angles product-gallery__thumbnails" role="group" aria-label="Product image views" data-no-swipe>
        {images.map((image, position) => <button type="button" key={image.src} aria-label={image.label} aria-pressed={position === index} onClick={() => choose(position)}><img src={image.src} alt="" width="96" height="60" draggable="false" /><span>{image.label}</span></button>)}
      </div>}
    </div>
    <dialog ref={viewer} className="product-viewer" aria-labelledby={titleId} onCancel={event => event.stopPropagation()} onClose={event => { event.stopPropagation(); setExpanded(false); setZoomed(false); }} onKeyDown={event => {
      event.stopPropagation();
      if (['ArrowLeft', 'ArrowRight'].includes(event.key) && images.length > 1) { event.preventDefault(); choose(index + (event.key === 'ArrowLeft' ? -1 : 1)); }
      if (['+', '=', '-', '0'].includes(event.key)) { event.preventDefault(); setZoomed(event.key === '+' || event.key === '='); }
    }}>
      <div className="product-viewer__header">
        <div><p>THE CLOSER LOOK</p><h2 id={titleId}>{product.brand}<span>{product.model}</span></h2></div>
        <div className="product-viewer__actions"><button type="button" aria-label={zoomed ? 'Zoom out' : 'Zoom in'} aria-pressed={zoomed} onClick={() => setZoomed(value => !value)}><GalleryIcon name={zoomed ? 'zoom-out' : 'zoom-in'} /><span>{zoomed ? '200%' : '100%'}</span></button><button type="button" ref={closeButton} aria-label="Close image viewer" onClick={() => viewer.current.close()}><GalleryIcon name="close" /></button></div>
      </div>
      <div className={`product-viewer__canvas${zoomed ? ' product-viewer__canvas--zoomed' : ''}`} ref={canvas} tabIndex="0" aria-label={zoomed ? 'Enlarged image. Drag or scroll to see details.' : 'Product image'} {...viewerSwipe}
        onPointerDown={event => {
          viewerSwipe.onPointerDown(event);
          if (!zoomed || event.pointerType !== 'mouse' || event.button !== 0) return;
          drag.current = { x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, top: event.currentTarget.scrollTop };
          event.currentTarget.setPointerCapture(event.pointerId);
        }} onPointerMove={event => {
          viewerSwipe.onPointerMove(event);
          if (drag.current) { event.currentTarget.scrollLeft = drag.current.left + drag.current.x - event.clientX; event.currentTarget.scrollTop = drag.current.top + drag.current.y - event.clientY; }
        }} onPointerUp={event => {
          viewerSwipe.onPointerUp(event);
          drag.current = null;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }} onLostPointerCapture={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; viewerSwipe.onPointerCancel(); }}>
        <div className="product-viewer__image-wrap"><img src={current.src} alt={`${title}, ${current.label.toLowerCase()}`} draggable="false" /></div>
      </div>
      <div className="product-viewer__footer">
        <div aria-live="polite"><strong>{current.label}</strong><span>{index + 1} of {images.length}{zoomed ? ' · Drag or scroll to explore' : ''}</span></div>
        {images.length > 1 && <div className="product-viewer__navigation"><button type="button" aria-label="Previous image" onClick={() => choose(index - 1)}><GalleryIcon name="left" /></button><button type="button" aria-label="Next image" onClick={() => choose(index + 1)}><GalleryIcon name="right" /></button></div>}
        <button type="button" className="product-viewer__return" onClick={() => viewer.current.close()}>Back to product <span aria-hidden="true">↗</span></button>
      </div>
    </dialog>
  </>;
}
