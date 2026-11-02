import './SiteFooter.css';

const groups = [
  { title: 'Explore', links: [['Featured frames', '#featured-picks'], ['Top categories', '#top-categories'], ['For him, her & kids', '#collection-edits']] },
  { title: 'Discover', links: [['Our story', '/about-us'], ['Designer brands', '/designer-brands'], ['Special offers', '/special-offers'], ['Gift cards', '/gift-card'], ['The icon edit', '#icon-edit'], ['Seen on the Streets', '#community']] },
  { title: 'Here to help', links: [['Book an eye test', '/book-eye-test'], ['Shopping & ordering', '#footer-shopping'], ['Finding your style', '#footer-style'], ['Privacy on this page', '#footer-privacy']] },
];

function FooterLink({ href, children }) {
  const openHelp = event => {
    if (!href.startsWith('#footer-')) return;
    const panel = document.getElementById(href.slice(1));
    if (panel) {
      event.preventDefault();
      panel.open = true;
      if (location.hash !== href) history.pushState(null, '', href);
      panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      panel.querySelector('summary').focus({ preventScroll: true });
    }
  };
  return <a href={href} onClick={openHelp}>{children}</a>;
}

export default function SiteFooter({ homePath = '' }) {
  const backToTop = () => {
    document.getElementById('main').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return <footer className="site-footer" aria-label="CandiClie footer">
    <div className="site-footer__inner">
      <div className="site-footer__intro">
        <div><p className="site-footer__eyebrow">A FRESH POINT OF VIEW</p><h2>See life.<br /><span>Your way.</span></h2></div>
        <div className="site-footer__intro-copy"><p>Everyday essentials. Unexpected favourites.<br /> Find the frames that feel like you.</p><a className="site-footer__cta" href={`${homePath}#top-categories`}>Find your next frame<span aria-hidden="true">↗</span></a></div>
      </div>

      <div className="site-footer__directory">
        <div className="site-footer__brand"><a href={homePath || '#main'} aria-label="CandiClie home">CandiClie</a><p>A different look.<br /> The same unmistakable you.</p></div>
        {groups.map(group => <nav className="site-footer__group" key={group.title} aria-label={`Footer ${group.title}`}><h3>{group.title}</h3><ul>{group.links.map(([label, href]) => <li key={href}><FooterLink href={href.startsWith('#footer-') || href.startsWith('/') ? href : `${homePath}${href}`}>{label}</FooterLink></li>)}</ul></nav>)}
      </div>

      <section className="site-footer__help" aria-labelledby="footer-help-heading">
        <h3 id="footer-help-heading">A little help, right here.</h3>
        <div className="site-footer__help-grid">
          <details id="footer-shopping"><summary>Shopping & ordering<span aria-hidden="true">+</span></summary><p>Browse our featured frames, explore the collections, and open any card for a closer look. This is a preview of our selection; online ordering is not open yet. Prices and availability will be confirmed when shopping launches.</p></details>
          <details id="footer-style"><summary>Finding your style<span aria-hidden="true">+</span></summary><p>Start with <a href={`${homePath}#top-categories`}>our top categories</a> or explore <a href="/designer-brands">our brand directory</a>. Compare shapes, colours, and details in the frame previews. Our <a href={`${homePath}#community`}>street-style edit</a> offers a little inspiration along the way.</p></details>
          <details id="footer-privacy"><summary>Privacy on this page<span aria-hidden="true">+</span></summary><p>Your cart, saved items and recent searches are stored in this browser. The account form is a preview: it does not send or store your name, email address or phone number. Photographs and fonts are hosted directly, and this site does not embed social media widgets.</p></details>
        </div>
      </section>

      <div className="site-footer__bottom"><p>© 2026 CandiClie. All rights reserved.</p><FooterLink href="#footer-privacy">Privacy on this page</FooterLink><button type="button" onClick={backToTop}>Back to top<span aria-hidden="true">↑</span></button></div>
    </div>
  </footer>;
}
