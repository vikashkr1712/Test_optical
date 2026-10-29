import { useRef, useState } from 'react';
import { eyeTestStores, filterEyeTestStores, storeAreaMapUrl, storeCities, updateEyeTestStoreSearch } from './eyeTestStores.js';
import EyeTestStoreMap from './EyeTestStoreMap.jsx';

const pageSize = 4;

export default function EyeTestStoreFinder({ search, onSearchChange, selectedStoreId, onBook, error }) {
  const [page, setPage] = useState(() => Math.max(0, Math.floor(filterEyeTestStores(search).findIndex(store => store.id === selectedStoreId) / pageSize)));
  const [focusedStoreId, setFocusedStoreId] = useState(selectedStoreId);
  const resultHeading = useRef(null);
  const stores = filterEyeTestStores(search);
  const pageCount = Math.max(1, Math.ceil(stores.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const start = currentPage * pageSize;
  const visibleStores = stores.slice(start, start + pageSize);
  const pinQuery = /^\d+$/.test(search.query.trim());
  const updateSearch = changes => { setPage(0); setFocusedStoreId(''); onSearchChange(updateEyeTestStoreSearch(search, changes)); };
  const showOnMap = store => {
    setFocusedStoreId(store.id);
    requestAnimationFrame(() => {
      document.getElementById('eye-store-atlas')?.scrollIntoView({ block: 'center', behavior: 'instant' });
      document.getElementById('eye-store-map-heading')?.focus({ preventScroll: true });
    });
  };
  const viewStoreCard = store => {
    const index = stores.findIndex(item => item.id === store.id);
    if (index < 0) return;
    setPage(Math.floor(index / pageSize));
    requestAnimationFrame(() => {
      const heading = document.getElementById(`eye-store-${store.id}`);
      heading?.scrollIntoView({ block: 'center', behavior: 'instant' });
      heading?.focus({ preventScroll: true });
    });
  };
  const turnPage = target => {
    setPage(target);
    requestAnimationFrame(() => {
      resultHeading.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
      resultHeading.current?.focus({ preventScroll: true });
    });
  };

  return <div className="eye-store-finder">
    <div className="eye-store-search">
      <div className="eye-field"><label htmlFor="eye-store-city">Choose city</label><select id="eye-store-city" value={search.city} onChange={event => updateSearch({ city: event.target.value })} aria-describedby="eye-store-city-help"><option value="">All {storeCities.length} cities</option>{storeCities.map(city => <option key={city}>{city}</option>)}</select><p id="eye-store-city-help">{search.cityFromPin ? `${search.city} selected from PIN${search.query.trim().length < 6 ? ' prefix' : ''} ${search.query.trim()}.` : 'Choose a city directly, or start typing a PIN code.'}</p></div>
      <div className="eye-field"><label htmlFor="eye-store-search">Search city, area or PIN code</label><input id="eye-store-search" name="storeId" type="search" maxLength="100" placeholder="e.g. 5, 56, 560001 or Indiranagar" value={search.query} onChange={event => updateSearch({ query: event.target.value })} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); resultHeading.current?.focus(); } }} aria-describedby={`eye-store-search-help${error ? ' eye-storeId-error' : ''}`} aria-invalid={!!error} /><p id="eye-store-search-help">Results update as you type. Enter 56 to see matching PINs and select Bengaluru automatically.</p></div>
    </div>
    <div className="eye-city-shortcuts" role="group" aria-label="Store city shortcuts">{['Bengaluru', 'Mumbai', 'Delhi NCR', 'Kolkata'].map(city => <button type="button" key={city} aria-pressed={search.city === city} onClick={() => updateSearch({ city: search.city === city ? '' : city, query: '' })}>{city}</button>)}</div>
    <div className="eye-store-results-heading" ref={resultHeading} tabIndex="-1"><p role="status" aria-live="polite" aria-atomic="true"><strong>{stores.length} {stores.length === 1 ? 'store' : 'stores'}</strong>{search.query.trim() && <span>{pinQuery && search.query.trim().length < 6 ? ' with PINs starting with' : ' matching'} “{search.query.trim()}”</span>}{search.city && <span> in {search.city}</span>}</p>{(search.query || search.city) && <button type="button" onClick={() => updateSearch({ query: '', city: '' })}>Clear filters</button>}</div>
    {error && <p className="eye-field-error" id="eye-storeId-error">{error}</p>}
    {stores.length ? <>
      <div className="eye-store-grid" key={currentPage}>{visibleStores.map(store => <article className={`eye-store-card${selectedStoreId === store.id ? ' eye-store-card--selected' : ''}`} key={store.id} aria-labelledby={`eye-store-${store.id}`}>
        <figure className="eye-store-card__photo"><img src={store.photo.src} srcSet={store.photo.srcSet} sizes="(max-width: 639px) calc(100vw - 90px), (max-width: 959px) 42vw, (max-width: 1199px) 50vw, 26vw" alt={store.photo.alt} width="640" height="428" loading="lazy" decoding="async" /><figcaption>Representative store interior</figcaption></figure>
        <div className="eye-store-card__top"><span>EYE TEST</span>{selectedStoreId === store.id && <strong>Selected</strong>}<span>{store.city}</span></div>
        <h4 id={`eye-store-${store.id}`} tabIndex="-1">{store.name}</h4>
        <address>{store.address}<br />{store.city}, {store.state}<br /><strong>PIN {store.pinCode}</strong></address>
        <p className="eye-store-card__service">In-store eye test</p>
        <div className="eye-store-card__map-actions"><button type="button" className="eye-store-map" onClick={() => showOnMap(store)} aria-label={`Show ${store.name} on the map`}>Show on map <span aria-hidden="true">↘</span></button><a href={storeAreaMapUrl(store)} target="_blank" rel="noopener noreferrer" aria-label={`View ${store.area} area in Google Maps (opens in a new tab)`}>Open maps <span aria-hidden="true">↗</span></a></div>
        <button type="button" className="eye-button" onClick={() => onBook(store)} aria-label={`Book appointment at ${store.name}`}>Book appointment <span aria-hidden="true">→</span></button>
      </article>)}</div>
      <nav className="eye-store-pagination" aria-label="Store results pages"><p>Showing {start + 1}–{Math.min(start + pageSize, stores.length)} of {stores.length}</p><div><button type="button" disabled={currentPage === 0} onClick={() => turnPage(currentPage - 1)} aria-label="Previous stores">←</button><span aria-live="polite">Page {currentPage + 1} of {pageCount}</span><button type="button" disabled={currentPage >= pageCount - 1} onClick={() => turnPage(currentPage + 1)} aria-label="Next stores">→</button></div></nav>
      <EyeTestStoreMap stores={stores} focusedStoreId={focusedStoreId} onFocusStore={setFocusedStoreId} onViewStore={viewStoreCard} />
    </> : <div className="eye-store-empty"><h4>No stores match this search.</h4><p>Try a shorter PIN prefix, another city or area, or clear the filters to see all locations.</p><p>Try <button type="button" onClick={() => updateSearch({ query: '400050' })}>400050 · Bandra West</button> or <button type="button" onClick={() => updateSearch({ query: '560038' })}>560038 · Indiranagar</button>.</p><button type="button" className="eye-text-link" onClick={() => updateSearch({ query: '', city: '' })}>Show all {eyeTestStores.length} stores <span aria-hidden="true">→</span></button></div>}
  </div>;
}
