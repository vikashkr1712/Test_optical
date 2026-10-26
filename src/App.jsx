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
import LensesPage from './components/LensesPage.jsx';
import { readLensesRoute } from './components/lensesCatalog.js';
import AccessoriesPage from './components/AccessoriesPage.jsx';
import { readAccessoriesRoute } from './components/accessoriesCatalog.js';
import DesignerBrandsPage from './components/DesignerBrandsPage.jsx';
import { designerBrands, readDesignerRoute } from './components/designerBrands.js';
import OurStoryPage from './components/OurStoryPage.jsx';

const readLocation = () => ({ pathname: location.pathname.replace(/\/$/, '') || '/', search: location.search });
const collectionLinks = {
  'for-him': '/eyewear/eyeglasses/men', 'for-her': '/eyewear/eyeglasses/women', 'for-kids': '/eyewear/eyeglasses/kids',
  'category-eyeglasses': '/eyewear/eyeglasses', 'category-men': '/eyewear/eyeglasses/men', 'category-women': '/eyewear/eyeglasses/women', 'category-kids': '/eyewear/eyeglasses/kids',
};

export default function App() {
  const [selection, setSelection] = useState(null);
  const [panel, setPanel] = useState(null);
  const [route, setRoute] = useState(readLocation);
  const page = route.pathname === '/cart' ? 'cart' : ['/about-us', '/our-story'].includes(route.pathname) ? 'story' : /^\/(designer-brands|brands)(\/|$)/.test(route.pathname) ? 'brands' : /^\/(accessories|care-and-accessories)(\/|$)/.test(route.pathname) ? 'accessories' : /^\/contact-lenses?(\/|$)/.test(route.pathname) ? 'lenses' : /^\/(eyewear|glasses|eyeglasses|sunglasses)(\/|$)/.test(route.pathname) ? 'glasses' : 'home';
  const designerRoute = page === 'brands' ? readDesignerRoute(route.pathname, route.search) : null;
  const [accountIntent, setAccountIntent] = useState('profile');
  const shopping = useShopping();
  const [continuePath, setContinuePath] = useState(() => shopping.cart.at(-1)?.id.startsWith('accessory-') ? '/accessories' : shopping.cart.some(item => item.id.startsWith('lens-')) ? '/contact-lenses' : '/eyewear');
  useEffect(() => { if (['glasses', 'lenses', 'accessories', 'brands'].includes(page)) setContinuePath(`${route.pathname}${route.search}`); }, [page, route.pathname, route.search]);
  useEffect(() => {
    const onPopState = () => {
      setRoute(readLocation());
      setSelection(null); setPanel(null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  useEffect(() => { document.title = page === 'cart' ? 'Your cart | CandiClie' : page === 'story' ? 'Our Story | CandiClie' : page === 'brands' ? `${readDesignerRoute(route.pathname, route.search).title} | CandiClie` : page === 'accessories' ? `${readAccessoriesRoute(route.pathname, route.search).label === 'All accessories' ? 'Care & Accessories' : readAccessoriesRoute(route.pathname, route.search).label} | CandiClie` : page === 'lenses' ? `${readLensesRoute(route.pathname, route.search).label} | CandiClie` : page === 'glasses' ? `${readGlassesRoute(route.pathname, route.search).title} | CandiClie` : 'CandiClie — A fresh point of view'; }, [page, route.pathname, route.search]);
  const navigate = (path, hash = '', { scroll = true } = {}) => {
    const hashIndex = path.indexOf('#');
    if (hashIndex !== -1) { hash = hash || path.slice(hashIndex); path = path.slice(0, hashIndex); }
    if (`${location.pathname}${location.search}${location.hash}` !== `${path}${hash}`) history.pushState(null, '', `${path}${hash}`);
    setRoute(readLocation());
    setPanel(null); setSelection(null);
    if (!scroll) return;
    requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1) || 'main');
      if (target?.tagName === 'DETAILS') target.open = true;
      target?.scrollIntoView({ block: 'start', behavior: 'instant' });
      (hash ? target : document.getElementById('main'))?.focus({ preventScroll: true });
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
    <a className="skip-link" href="#main">{page === 'cart' ? 'Skip to your cart' : page === 'story' ? 'Skip to our story' : page === 'brands' ? 'Skip to designer brands' : page === 'accessories' ? 'Skip to care and accessories' : page === 'lenses' ? 'Skip to contact lens collection' : page === 'glasses' ? 'Skip to glasses collection' : 'Skip to featured collections'}</a>
    <SiteHeader onSelect={chooseCollection} onOpenPanel={openPanel} bagCount={shopping.bagCount} />
    <main id="main" tabIndex="-1">
      {page === 'cart' ? <CartPage shopping={shopping} onContinueShopping={() => navigate(continuePath)} onCheckOrders={() => { setAccountIntent('orders'); setPanel('profile'); }} /> : page === 'story' ? <OurStoryPage onNavigate={(href, options) => navigate(href, '', options)} /> : page === 'brands' ? designerRoute.designer ? <GlassesPage route={designerRoute} shopping={shopping} onNavigate={(href, options) => navigate(href, '', options)} onView={viewProduct} /> : <DesignerBrandsPage route={designerRoute} onNavigate={(href, options) => navigate(href, '', options)} /> : page === 'accessories' ? <AccessoriesPage route={readAccessoriesRoute(route.pathname, route.search)} shopping={shopping} onNavigate={(href, options) => navigate(href, '', options)} onView={viewProduct} /> : page === 'lenses' ? <LensesPage route={readLensesRoute(route.pathname, route.search)} shopping={shopping} onNavigate={(href, options) => navigate(href, '', options)} onView={viewProduct} /> : page === 'glasses' ? <GlassesPage route={readGlassesRoute(route.pathname, route.search)} shopping={shopping} onNavigate={(href, options) => navigate(href, '', options)} onView={viewProduct} /> : <><HomeHero /><HomeCollections onSelect={chooseCollection} /></>}
    </main>
    <SiteFooter homePath={page === 'home' ? '' : '/'} />
    <PreviewDialog selection={selection} onClose={() => setSelection(null)} shopping={shopping} onOpenBag={() => openPanel('bag')} onBrowse={() => navigate(selection?.type === 'Accessories' ? '/accessories' : selection?.type === 'Contact lenses' ? '/contact-lenses' : page === 'brands' ? designerBrands.find(brand => brand.brand === selection?.brand)?.catalogHref || '/eyewear' : '/eyewear')} />
    <ShoppingPanels panel={panel === 'search' ? panel : null} onClose={() => setPanel(null)} onOpenCart={() => openPanel('bag')} shopping={shopping} onView={viewProduct} />
    <SignInDialog open={panel === 'profile'} intent={accountIntent} onClose={() => setPanel(null)} />
  </>;
}
