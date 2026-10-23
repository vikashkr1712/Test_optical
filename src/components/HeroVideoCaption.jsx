import './HeroVideoCaption.css';

export default function HeroVideoCaption({ headline, tagline, detail, className = '', scene }) {
  return <div className={`hero-video-caption ${className}`} data-scene={scene}>
    <div className="hero-video-caption__text" key={scene}>
      <h2>{headline}</h2>
      <p className="hero-video-caption__tagline">{tagline}</p>
      <p className="hero-video-caption__detail">{detail}</p>
    </div>
  </div>;
}
