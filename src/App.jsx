import { useEffect, useState } from 'react';
import SiteHeader from './components/SiteHeader.jsx';
import HomeHero from './components/HomeHero.jsx';
import HomeCollections, { PreviewDialog } from './components/HomeCollections.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import ShoppingPanels from './components/ShoppingPanels.jsx';
import useShopping from './components/useShopping.js';
import CartPage from './components/CartPage.jsx';
import SignInDialog from './components/SignInDialog.jsx';

export default function App() {
  const [selection, setSelection] = useState(null);
  const [panel, setPanel] = useState(null);
  const [page, setPage] = useState(() => location.pathname.replace(/\/$/, '') === '/cart' ? 'cart' : 'home');
  const [accountIntent, setAccountIntent] = useState('profile');
  const shopping = useShopping();
  useEffect(() => {
    const onPopState = () => {
      setPage(location.pathname.replace(/\/$/, '') === '/cart' ? 'cart' : 'home');
      setSelection(null); setPanel(null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  useEffect(() => { document.title = page === 'cart' ? 'Your cart | CandiClie' : 'CandiClie — A fresh point of view'; }, [page]);
  const navigate = (path, hash = '') => {
    if (`${location.pathname}${location.hash}` !== `${path}${hash}`) history.pushState(null, '', `${path}${hash}`);
    setPage(path === '/cart' ? 'cart' : 'home');
    setPanel(null); setSelection(null);
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
  const chooseCollection = value => { if (page === 'cart') navigate('/'); setSelection(value); };
  const viewProduct = product => { if (page === 'cart') navigate('/'); setPanel(null); setSelection(product); };
  return <>
    <a className="skip-link" href="#main">{page === 'cart' ? 'Skip to your cart' : 'Skip to featured collections'}</a>
    <SiteHeader onSelect={chooseCollection} onOpenPanel={openPanel} bagCount={shopping.bagCount} />
    <main id="main" tabIndex="-1">
      {page === 'cart' ? <CartPage shopping={shopping} onContinueShopping={() => navigate('/', '#featured-picks')} onCheckOrders={() => { setAccountIntent('orders'); setPanel('profile'); }} /> : <><HomeHero /><HomeCollections onSelect={setSelection} /></>}
    </main>
    <SiteFooter homePath={page === 'cart' ? '/' : ''} />
    <PreviewDialog selection={selection} onClose={() => setSelection(null)} shopping={shopping} onOpenBag={() => openPanel('bag')} />
    <ShoppingPanels panel={panel === 'search' ? panel : null} onClose={() => setPanel(null)} onOpenCart={() => openPanel('bag')} shopping={shopping} onView={viewProduct} />
    <SignInDialog open={panel === 'profile'} intent={accountIntent} onClose={() => setPanel(null)} />
  </>;
}
