import SiteHeader from './components/SiteHeader.jsx';
import HomeHero from './components/HomeHero.jsx';
import HomeCollections from './components/HomeCollections.jsx';
import SiteFooter from './components/SiteFooter.jsx';

export default function App() {
  return <>
    <a className="skip-link" href="#main">Skip to featured collections</a>
    <SiteHeader />
    <main id="main" tabIndex="-1">
      <HomeHero />
      <HomeCollections />
    </main>
    <SiteFooter />
  </>;
}
