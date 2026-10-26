import { useEffect, useState } from 'react';
import SiteHeader from './components/SiteHeader.jsx';
import HomeHero from './components/HomeHero.jsx';
import HomeCollections, { PreviewDialog } from './components/HomeCollections.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import ShoppingPanels from './components/ShoppingPanels.jsx';
import useShopping from './components/useShopping.js';
import CartPage from './components/CartPage.jsx';
import SignInDialog from './components/SignInDialog.jsx';
import GlassesPage from './components/GlassesPage.jsx';
import { readGlassesRoute } from './components/glassesCatalog.js';

const readLocation = () => ({ pathname: location.pathname.replace(/\/$/, '') || '/', search: location.search });
const collectionLinks = {
  'for-him': '/eyewear/eyeglasses/men', 'for-her': '/eyewear/eyeglasses/women', 'for-kids': '/eyewear/eyeglasses/kids',
  'category-eyeglasses': '/eyewear/eyeglasses', 'category-men': '/eyewear/eyeglasses/men', 'category-women': '/eyewear/eyeglasses/women', 'category-kids': '/eyewear/eyeglasses/kids',
};

export default function App() {
  const [selection, setSelection] = useState(null);
  const [panel, setPanel] = useState(null);
  const [route, setRoute] = useState(readLocation);
  const page = route.pathname === '/cart' ? 'cart' : /^\/(eyewear|glasses|eyeglasses|sunglasses)(\/|$)/.test(route.pathname) ? 'glasses' : 'home';
  const [accountIntent, setAccountIntent] = useState('profile');
  const shopping = useShopping();
  useEffect(() => {
    const onPopState = () => {
      setRoute(readLocation());
      setSelection(null); setPanel(null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  useEffect(() => { document.title = page === 'cart' ? 'Your cart | CandiClie' : page === 'glasses' ? `${readGlassesRoute(route.pathname, route.search).title} | CandiClie` : 'CandiClie — A fresh point of view'; }, [page, route.pathname, route.search]);
  const navigate = (path, hash = '', { scroll = true } = {}) => {
    if (`${location.pathname}${location.search}${location.hash}` !== `${path}${hash}`) history.pushState(null, '', `${path}${hash}`);
    setRoute(readLocation());
    setPanel(null); setSelection(null);
    if (!scroll) return;
    requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1) || 'main');
      if (target?.tagName === 'DETAILS') target.open = true;
      target?.scrollIntoView({ block: 'start', behavior: 'instant' });
      document.getElementById('main')?.focus({ preventScroll: true });
    });
  };
  const openPanel = value => {
    setSelection(null);
    if (value === 'bag') { navigate('/cart'); return; }
    setAccountIntent('profile'); setPanel(value);
  };
  const chooseCollection = value => {
    const path = value.catalogHref || collectionLinks[value.id];
    if (path) { navigate(path); return; }
    setSelection(value);
  };
  const viewProduct = product => { setPanel(null); setSelection(product); };
  return <>
    <a className="skip-link" href="#main">{page === 'cart' ? 'Skip to your cart' : page === 'glasses' ? 'Skip to glasses collection' : 'Skip to featured collections'}</a>
    <SiteHeader onSelect={chooseCollection} onOpenPanel={openPanel} bagCount={shopping.bagCount} />
    <main id="main" tabIndex="-1">
      {page === 'cart' ? <CartPage shopping={shopping} onContinueShopping={() => navigate('/eyewear')} onCheckOrders={() => { setAccountIntent('orders'); setPanel('profile'); }} /> : page === 'glasses' ? <GlassesPage route={readGlassesRoute(route.pathname, route.search)} shopping={shopping} onNavigate={(href, options) => navigate(href, '', options)} onView={viewProduct} /> : <><HomeHero /><HomeCollections onSelect={chooseCollection} /></>}
    </main>
    <SiteFooter homePath={page === 'home' ? '' : '/'} />
    <PreviewDialog selection={selection} onClose={() => setSelection(null)} shopping={shopping} onOpenBag={() => openPanel('bag')} onBrowse={() => navigate('/eyewear')} />
    <ShoppingPanels panel={panel === 'search' ? panel : null} onClose={() => setPanel(null)} onOpenCart={() => openPanel('bag')} shopping={shopping} onView={viewProduct} />
    <SignInDialog open={panel === 'profile'} intent={accountIntent} onClose={() => setPanel(null)} />
  </>;
}
