import GKBHeader from './components/GKBHeader.jsx';
import GKBHero from './components/GKBHero.jsx';

export default function App() {
  return <>
    <a className="skip-link" href="#main">Skip to featured collections</a>
    <GKBHeader />
    <main id="main">
      <GKBHero />
    </main>
  </>;
}
