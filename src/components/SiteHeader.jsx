import { useState } from 'react';
import './SiteHeader.css';

const navigation = [
  ['Eyewear', '/eyewear/eyeglasses'],
  ['Contact Lens', '/contact-lens/lens-brands'],
  ['Accessories', '/accessories'],
  ['Brands', '/brands'],
  ['About', '/about-us'],
  ['Offers', '/offers'],
  ['Festive Sale', '/festive-sale'],
  ['Gift Card', '/gift-card'],
];
const announcements = [
  ['Discover candiclie | About us', '/about-us'],
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
  };
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(0);
  return <header className="site-header">
    <div className="site-header__utility">
      <a className="site-header__store" href="/store-locator"><Icon name="location" />Locate a store near you</a>
      <div className="site-header__announcement">
        <button type="button" aria-label="Previous announcement" onClick={() => setAnnouncement(value => (value + 1) % announcements.length)}><Icon name="left" /></button>
        <a href={announcements[announcement][1]}>{announcements[announcement][0]}</a>
        <button type="button" aria-label="Next announcement" onClick={() => setAnnouncement(value => (value + 1) % announcements.length)}><Icon name="right" /></button>
      </div>
      <a className="site-header__eye-link" href="/store-locator?appointment=true">Book an Eye Test</a>
    </div>
    <div className="site-header__navigation">
      <div className="site-header__mobile-actions">
        <button type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(value => !value)}><Icon name="menu" /></button>
        <a href="/search" aria-label="Search"><Icon name="search" /></a>
      </div>
      <a className="site-header__brand" href="/" aria-label="candiclie home">
        <span className="site-header__logo-frame"><img className="site-header__logo-image" src="/assets/candiclie/logo.png" alt="CandiClie Consultancy" width="200" height="200" fetchPriority="high" /></span>
      </a>
      <nav className="site-header__desktop-links" aria-label="Main navigation">
        {navigation.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
      </nav>
      <div className="site-header__actions">
        <a className="site-header__desktop-action" href="/search" aria-label="Search"><Icon name="search" /></a>
        <a className="site-header__desktop-action" href="/login" aria-label="Account"><Icon name="account" /></a>
        <a className="site-header__mobile-eye" href="/store-locator?appointment=true" aria-label="Book an eye test"><img src="/assets/header/eye-test.png" alt="" width="50" height="50" /></a>
        <a href="/cart" aria-label="Shopping bag"><Icon name="bag" /></a>
      </div>
    </div>
    {menuOpen && <nav id="mobile-navigation" className="site-header__mobile-menu" aria-label="Mobile navigation">
      {navigation.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
    </nav>}
  </header>;
}
