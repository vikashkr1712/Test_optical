import { useEffect, useRef, useState } from 'react';
import './SiteHeader.css';
import { navigation } from './siteNavigation.js';

const announcements = [
  ['Discover CandiClie · Our story', '/about-us'],
  ['Purchase a candiclie gift card for your loved ones', '/gift-card'],
];

function Icon({ name }) {
  const paths = {
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    search: <><circle cx="10.5" cy="10.5" r="7.5" /><path d="m16 16 5 5" /></>,
    account: <><circle cx="12" cy="7.5" r="3.5" /><path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" /></>,
    bag: <><path d="M3 8h18l-2 13H5L3 8Z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></>,
    location: <><path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="3" /></>,
    left: <path d="m15 6-6 6 6 6" />,
    right: <path d="m9 6 6 6-6 6" />,
    arrow: <><path d="M5 12h14m-5-5 5 5-5 5" /></>,
  };
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function NavigationPanel({ menu, mobile = false, onSelect }) {
  const prefix = mobile ? 'mobile' : 'desktop';
  return <div className={`site-header__panel${mobile ? ' site-header__panel--mobile' : ''}`} id={`nav-panel-${prefix}-${menu.id}`} role="region" aria-labelledby={`nav-trigger-${prefix}-${menu.id}`}>
    <div className="site-header__panel-intro">
      <p className="site-header__panel-eyebrow">CANDICLIE / {menu.label}</p>
      <h2>{menu.heading}</h2>
      <p>{menu.description}</p>
      <button type="button" className="site-header__panel-explore" onClick={() => onSelect(menu.overview)}>Explore {menu.label}<span aria-hidden="true">↗</span></button>
    </div>
    <div className="site-header__panel-groups">
      {menu.groups.map(group => <div className="site-header__panel-group" key={group.title}>
        <h3>{group.title}</h3>
        <ul>{group.items.map(item => <li key={item.label}><button type="button" className="site-header__option" onClick={() => onSelect(item.preview)}><span className="site-header__option-label">{item.label}<span aria-hidden="true">↗</span></span><span className="site-header__option-description">{item.description}</span></button></li>)}</ul>
      </div>)}
    </div>
  </div>;
}

export default function SiteHeader({ onSelect, onOpenPanel, bagCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [announcement, setAnnouncement] = useState(0);
  const header = useRef(null);
  const menuToggle = useRef(null);
  const desktopTriggers = useRef({});
  const mobileTriggers = useRef({});
  const currentMenu = navigation.find(item => item.id === activeMenu);
  const closeMenus = () => { setMenuOpen(false); setActiveMenu(null); };
  const openShopping = panel => { closeMenus(); onOpenPanel(panel); };

  useEffect(() => {
    if (!menuOpen && !activeMenu) return;
    const closeOutside = event => { if (!header.current?.contains(event.target)) { setMenuOpen(false); setActiveMenu(null); } };
    const escape = event => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      const target = menuOpen ? activeMenu ? mobileTriggers.current[activeMenu] : menuToggle.current : desktopTriggers.current[activeMenu];
      setActiveMenu(null);
      if (!activeMenu) setMenuOpen(false);
      target?.focus({ preventScroll: true });
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('keydown', escape); };
  }, [menuOpen, activeMenu]);

  useEffect(() => {
    const media = matchMedia('(min-width: 1024px)');
    const reset = () => { setMenuOpen(false); setActiveMenu(null); };
    media.addEventListener('change', reset);
    return () => media.removeEventListener('change', reset);
  }, []);

  const choose = selection => {
    const returnFocus = menuOpen ? menuToggle.current : desktopTriggers.current[activeMenu];
    returnFocus?.focus({ preventScroll: true });
    closeMenus();
    onSelect(selection);
  };
  const toggleMenu = (id, mobile = false) => {
    const opening = activeMenu !== id;
    setActiveMenu(opening ? id : null);
    if (mobile && opening) requestAnimationFrame(() => {
      const list = header.current?.querySelector('#mobile-navigation');
      const trigger = mobileTriggers.current[id];
      if (list && trigger) list.scrollTop = trigger.offsetTop;
    });
  };
  const triggerKey = (event, id, mobile = false) => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    setActiveMenu(id);
    requestAnimationFrame(() => header.current?.querySelector(`#nav-panel-${mobile ? 'mobile' : 'desktop'}-${id} button`)?.focus());
  };

  return <>
  <header className="site-header" ref={header} onBlurCapture={event => {
    if (!menuOpen && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setActiveMenu(null);
  }}>
    <div className="site-header__utility">
      <a className="site-header__store" href="/store-locator"><Icon name="location" />Locate a store near you</a>
      <div className="site-header__announcement">
        <button type="button" aria-label="Previous announcement" onClick={() => setAnnouncement(value => (value + 1) % announcements.length)}><Icon name="left" /></button>
        <a href={announcements[announcement][1]}>{announcements[announcement][0]}</a>
        <button type="button" aria-label="Next announcement" onClick={() => setAnnouncement(value => (value + 1) % announcements.length)}><Icon name="right" /></button>
      </div>
      <a className="site-header__eye-link" href="/store-locator?appointment=true">Book an Eye Test<Icon name="arrow" /></a>
    </div>
    <div className="site-header__navigation">
      <div className="site-header__mobile-actions">
        <button ref={menuToggle} type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => { setMenuOpen(value => !value); setActiveMenu(null); }}><Icon name="menu" /></button>
        <button type="button" aria-label="Search" aria-haspopup="dialog" aria-controls="shopping-panel" onClick={() => openShopping('search')}><Icon name="search" /></button>
      </div>
      <a className="site-header__brand" href="/" aria-label="candiclie home">
        <span className="site-header__logo-frame"><img className="site-header__logo-image" src="/assets/candiclie/logo.png" alt="CandiClie Consultancy" width="200" height="200" fetchPriority="high" /></span>
      </a>
      <nav className="site-header__desktop-links" aria-label="Main navigation">
        {navigation.map(item => <button type="button" key={item.id} id={`nav-trigger-desktop-${item.id}`} ref={element => { desktopTriggers.current[item.id] = element; }} aria-expanded={activeMenu === item.id} aria-controls={`nav-panel-desktop-${item.id}`} className={activeMenu === item.id ? 'site-header__nav-trigger site-header__nav-trigger--active' : 'site-header__nav-trigger'} onClick={() => toggleMenu(item.id)} onKeyDown={event => triggerKey(event, item.id)}>{item.label}</button>)}
      </nav>
      <div className="site-header__actions">
        <button type="button" className="site-header__desktop-action" aria-label="Search" aria-haspopup="dialog" aria-controls="shopping-panel" onClick={() => openShopping('search')}><Icon name="search" /></button>
        <button type="button" className="site-header__profile-action" aria-label="Profile" aria-haspopup="dialog" aria-controls="account-dialog" onClick={() => openShopping('profile')}><Icon name="account" /></button>
        <a className="site-header__mobile-eye" href="/store-locator?appointment=true" aria-label="Book an eye test"><img src="/assets/header/eye-test.png" alt="" width="50" height="50" /></a>
        <a className="site-header__bag" href="/cart" aria-label={`Shopping cart, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`} onClick={event => { if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) { event.preventDefault(); openShopping('bag'); } }}><Icon name="bag" />{bagCount > 0 && <span className="site-header__bag-count" aria-hidden="true">{bagCount}</span>}</a>
      </div>
    </div>
    {currentMenu && !menuOpen && <NavigationPanel menu={currentMenu} onSelect={choose} />}
    {menuOpen && <nav id="mobile-navigation" className="site-header__mobile-menu" aria-label="Mobile navigation">
      {navigation.map(item => <div className="site-header__mobile-group" key={item.id}>
        <button type="button" id={`nav-trigger-mobile-${item.id}`} ref={element => { mobileTriggers.current[item.id] = element; }} className="site-header__mobile-trigger" aria-expanded={activeMenu === item.id} aria-controls={`nav-panel-mobile-${item.id}`} onClick={() => toggleMenu(item.id, true)} onKeyDown={event => triggerKey(event, item.id, true)}>{item.label}<span aria-hidden="true">{activeMenu === item.id ? '−' : '+'}</span></button>
        {activeMenu === item.id && <NavigationPanel menu={item} mobile onSelect={choose} />}
      </div>)}
      <a className="site-header__mobile-appointment" href="/store-locator?appointment=true"><Icon name="location" />Book an eye test</a>
    </nav>}
  </header>
  {(activeMenu || menuOpen) && <div className="site-header__backdrop" aria-hidden="true" />}
  </>;
}
