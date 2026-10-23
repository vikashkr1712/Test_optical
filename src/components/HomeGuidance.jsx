import './HomeGuidance.css';

const tones = ['sage', 'sand', 'blue', 'rose'];

const benefits = [
  { icon: 'authentic', title: 'Authentic Eyewear', text: 'See the brand, model and finish before making your choice.' },
  { icon: 'style', title: 'Expert Style Support', text: 'Helpful style notes for finding shapes that feel like you.' },
  { icon: 'fit', title: 'Comfortable Everyday Fit', text: 'Keep comfort and your daily routine in mind as you explore.' },
  { icon: 'bag', title: 'Easy Shopping Experience', text: 'Compare frames, save favourites and keep your picks together.' },
];

const guide = [
  { icon: 'lenses', title: 'Prescription Lenses', text: 'Explore lens options that match your prescription.', details: ['Use your current prescription when comparing lens options.', 'Lens choices and availability will be confirmed when online ordering opens.'] },
  { icon: 'screen', title: 'Blue Light Protection', text: 'Get to know optional coatings for screen-time use.', details: ['Compare the lens features and coating information supplied by the maker.', 'Ask an eye-care professional which options suit your prescription and routine.'] },
  { icon: 'sun', title: 'Sunglass Lenses', text: 'Explore tints and finishes for your everyday look.', details: ['Compare the protection information listed for a pair of sunglasses, along with tint and fit.', 'Check product specifications before choosing a lens.'] },
  { icon: 'care', title: 'Frame Care Tips', text: 'Simple tips for cleaning, storing and handling frames.', details: ['Follow the care instructions that come with your frames and lens coatings.', 'Use an appropriate lens cloth and keep your eyewear in a fitted case when you are not wearing it.'] },
];

function GuidanceIcon({ name }) {
  const paths = {
    authentic: <><path d="m16 3 10 4v8c0 7-10 13-10 13S6 22 6 15V7l10-4Z" /><path d="m11 15 3.5 3.5L22 11" /></>,
    style: <><path d="m3 16 2-7h5m19 7-2-7h-5M13 18a4 4 0 0 1 6 0" /><circle cx="8" cy="20" r="6" /><circle cx="24" cy="20" r="6" /></>,
    fit: <><path d="M8 13V9a8 8 0 0 1 16 0v4m-16 6c1 6 5 10 8 10s7-4 8-10M5 10v11m22-11v11M3 12l2-2 2 2m18 7 2 2 2-2" /><path d="M10 13h4v4h-4zm8 0h4v4h-4zm-4 1h4" /></>,
    bag: <><path d="M6 11h20l-2 17H8L6 11Zm5 0V8a5 5 0 0 1 10 0v3" /><path d="m12 20 3 3 5-6" /></>,
    lenses: <><ellipse cx="12" cy="16" rx="8" ry="11" /><ellipse cx="21" cy="16" rx="7" ry="10" /><path d="M10 10a7 7 0 0 0-2 5" /></>,
    screen: <><rect x="3" y="5" width="26" height="19" rx="2" /><path d="M11 29h10m-5-5v5M7 10h6m-6 4h3" /><path d="m20 10 5 2v4c0 3-5 5-5 5s-5-2-5-5v-4l5-2Z" /></>,
    sun: <><circle cx="16" cy="16" r="7" /><path d="M16 2v3m0 22v3M2 16h3m22 0h3M6 6l2 2m16 16 2 2M6 26l2-2M24 8l2-2" /></>,
    care: <><path d="M4 12h16l6 6v10H4V12Zm16 0v6h6" /><path d="m23 2 1.5 4.5L29 8l-4.5 1.5L23 14l-1.5-4.5L17 8l4.5-1.5L23 2ZM8 22l3 3 6-6" /></>,
  };
  return <svg className="home-guidance__icon" width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}

export default function HomeGuidance({ onPreview }) {
  const openGuide = item => onPreview({
    navigation: true,
    title: item?.title || 'Lens & Care Guide',
    eyebrow: 'THE CANDICLIE GUIDE',
    description: item?.text || 'A few useful starting points for choosing lenses and looking after the frames you wear every day.',
    details: item?.details || guide.map(topic => `${topic.title}: ${topic.text}`),
    cta: { label: 'Explore frames', href: '#featured-picks' },
  });

  return <div className="home-guidance">
    <section className="home-benefits home-section" id="why-candiclie" aria-labelledby="benefits-heading">
      <div className="home-guidance__intro">
        <div><p className="home-eyebrow home-guidance__eyebrow">THE CANDICLIE DIFFERENCE</p><h2 id="benefits-heading">Why Choose <em>CandiClie</em></h2></div>
        <p className="home-guidance__description">A little more thought in every detail.<br /> For frames that feel like you.</p>
      </div>
      <div className="home-benefits__grid">{benefits.map((item, index) => <article className="home-benefit" data-tone={tones[index]} key={item.title}>
        <div className="home-benefit__top"><span className="home-guidance__symbol"><GuidanceIcon name={item.icon} /></span><span className="home-benefit__number" aria-hidden="true">0{index + 1}</span></div><h3>{item.title}</h3><p>{item.text}</p>
      </article>)}</div>
    </section>
    <section className="home-lens-guide home-section" id="lens-care-guide" aria-labelledby="lens-guide-heading">
      <div className="home-lens-guide__intro"><div><p className="home-eyebrow home-guidance__eyebrow">A LITTLE EVERYDAY KNOW-HOW</p><h2 id="lens-guide-heading">Lens &amp; <em>Care</em> Guide</h2><p className="home-guidance__description">Good lenses. Well-loved frames. Start here.</p></div><button type="button" className="home-guide-link" onClick={() => openGuide()} aria-haspopup="dialog">Learn more<span aria-hidden="true">↗</span></button></div>
      <div className="home-lens-guide__grid">{guide.map((item, index) => <button type="button" className="home-guide-topic" data-tone={tones[index]} key={item.title} onClick={() => openGuide(item)} aria-label={`Read about ${item.title}`} aria-haspopup="dialog">
        <span className="home-guide-topic__top"><span className="home-guidance__symbol"><GuidanceIcon name={item.icon} /></span><span className="home-benefit__number" aria-hidden="true">0{index + 1}</span></span>
        <h3>{item.title}</h3><p>{item.text}</p><span className="home-guide-topic__action" aria-hidden="true">Read guide<span>↗</span></span>
      </button>)}</div>
    </section>
  </div>;
}
