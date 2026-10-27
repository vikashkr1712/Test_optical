import { designerBrands, featuredDesignerBrands } from './designerBrands.js';

const photo = (name, alt, editorial = false) => {
  const small = editorial ? 480 : name.startsWith('for-') ? 480 : 320;
  const large = editorial ? 960 : name.startsWith('for-') ? 900 : 560;
  const folder = editorial ? 'editorial' : 'home';
  return { src: `/assets/${folder}/${name}-${small}.webp`, srcSet: `/assets/${folder}/${name}-${small}.webp ${small}w, /assets/${folder}/${name}-${large}.webp ${large}w`, width: large, height: editorial ? 960 : name.startsWith('for-') ? 601 : 839, alt };
};
const images = {
  eyewear: photo('category-eyeglasses', 'Everyday optical frames'),
  men: photo('for-him', 'A man wearing statement eyewear'),
  women: photo('for-her', 'A woman wearing statement eyewear'),
  kids: photo('for-kids', 'Children wearing colourful glasses'),
  fashion: photo('category-fashion', 'Expressive eyewear styles'),
};
const cta = (label = 'Explore featured frames', href = '#featured-picks') => ({ label, href });
const info = (title, eyebrow, description, options = {}) => ({ title, eyebrow, description, navigation: true, cta: cta(), ...options });
const choice = (label, description, preview) => ({ label, description, preview });
const eyewear = (title, description, media = images.eyewear, details = []) => info(title, 'THE EYEWEAR EDIT', description, { media, details, cta: cta('Explore top categories', '#top-categories') });

export const navigation = [
  {
    id: 'eyewear', label: 'Glasses', heading: 'Find your kind of frame.',
    description: 'Everyday essentials and a little more personality. Start with a style that feels like you.',
    overview: { ...eyewear('Explore eyewear', 'Discover optical frames, sunglasses and expressive shapes in our featured edits.', images.eyewear), catalogHref: '/eyewear' },
    groups: [
      { title: 'Shop by type', items: [
        choice('Eyeglasses', 'Your everyday essential', { catalogHref: '/eyewear/eyeglasses' }),
        choice('Sunglasses', 'A brighter point of view', { catalogHref: '/eyewear/sunglasses' }),
        choice('New In', 'Discover the latest edit', { catalogHref: '/eyewear/new-in' }),
      ] },
      { title: 'For everyone', items: [
        choice('For men', 'Make it your signature', { catalogHref: '/eyewear/eyeglasses/men' }),
        choice('For women', 'A look of your own', { catalogHref: '/eyewear/eyeglasses/women' }),
        choice('For kids', 'Little frames. Big character.', { catalogHref: '/eyewear/eyeglasses/kids' }),
      ] },
      { title: 'Explore shapes', items: [
        choice('Round', 'Soft curves and clean lines', { catalogHref: '/eyewear?shape=Round' }),
        choice('Rectangle', 'A sharper outline', { catalogHref: '/eyewear?shape=Rectangle' }),
        choice('Cat-eye', 'A little lift at the edges', { catalogHref: '/eyewear?shape=Cat-eye' }),
        choice('Aviator', 'An enduring silhouette', { catalogHref: '/eyewear?shape=Aviator' }),
      ] },
    ],
  },
  {
    id: 'contact-lens', label: 'Contact Lenses', heading: 'Explore your lens options.',
    description: 'Find your starting point. Explore lens families, replacement schedules and a little colour.',
    overview: { catalogHref: '/contact-lenses' },
    groups: [
      { title: 'Browse lens types', items: [
        choice('Daily lenses', 'Explore the daily collection', { catalogHref: '/contact-lenses/daily' }),
        choice('Monthly lenses', 'Find your everyday lens', { catalogHref: '/contact-lenses/monthly' }),
        choice('Fortnightly lenses', 'Explore two-week replacement options', { catalogHref: '/contact-lenses/fortnightly' }),
        choice('Coloured lenses', 'Explore a different look', { catalogHref: '/contact-lenses/coloured' }),
      ] },
      { title: 'Explore lens designs', items: [
        choice('Spherical lenses', 'Compare brands and pack sizes', { catalogHref: '/contact-lenses/spherical' }),
        choice('Toric lenses', 'Explore the toric selection', { catalogHref: '/contact-lenses/toric' }),
        choice('Multifocal lenses', 'Discover multifocal options', { catalogHref: '/contact-lenses/multifocal' }),
        choice('Clear lenses', 'A clear point of view', { catalogHref: '/contact-lenses/clear' }),
      ] },
    ],
  },
  {
    id: 'accessories', label: 'Care & Accessories', heading: 'The little things, considered.',
    description: 'Explore the finishing touches that belong alongside your favourite pair.',
    overview: { catalogHref: '/accessories' },
    groups: [
      { title: 'The essentials', items: [
        choice('Cases & storage', 'A place for your favourite pairs', { catalogHref: '/accessories/cases' }),
        choice('Cleaning cloths', 'Explore cloths and cleaning sets', { catalogHref: '/accessories/cleaning-cloths' }),
        choice('Care essentials', 'A little care for your everyday pair', { catalogHref: '/accessories/care-essentials' }),
      ] },
      { title: 'The finishing touches', items: [
        choice('Cords & straps', 'Keep your favourites close', { catalogHref: '/accessories/cords' }),
        choice('All accessories', 'Explore the full essentials collection', { catalogHref: '/accessories' }),
      ] },
    ],
  },
  {
    id: 'brands', label: 'Designer Brands', heading: 'Different identities. Your point of view.',
    description: `Discover ${designerBrands.length} eyewear brands. Find your next signature in eyeglasses, sunglasses and junior frames.`,
    overview: { catalogHref: '/designer-brands' },
    groups: [
      ...[0, 4].map((start, index) => ({ title: index === 0 ? 'Designer favourites' : 'More names to discover', items: featuredDesignerBrands.slice(start, start + 4).map(brand => choice(brand.title, `${brand.count} ${brand.count === 1 ? 'frame' : 'frames'} to explore`, { catalogHref: brand.catalogHref })) })),
      { title: 'Find your starting point', items: [
        choice('All brands A–Z', 'Find a name you love', { catalogHref: '/designer-brands' }),
        choice('Eyeglasses by brand', 'Your everyday signature', { catalogHref: '/designer-brands?type=eyeglasses' }),
        choice('Sunglasses by brand', 'A brighter point of view', { catalogHref: '/designer-brands?type=sunglasses' }),
        choice('Kids’ brands', 'Little frames. Big personality.', { catalogHref: '/designer-brands?type=kids' }),
      ] },
    ],
  },
  {
    id: 'about', label: 'Our Story', heading: 'Eyewear is personal.',
    description: 'Get to know CandiClie, our approach to eyewear and the details behind your next pair.',
    overview: { catalogHref: '/about-us' },
    groups: [
      { title: 'Meet CandiClie', items: [
        choice('Our story', 'Our perspective on everyday eyewear', { catalogHref: '/about-us#our-story' }),
        choice('Our approach', 'Shape, colour and the details', { catalogHref: '/about-us#our-approach' }),
      ] },
      { title: 'Style & support', items: [
        choice('The style edit', 'Different ways to wear a frame', { catalogHref: '/about-us#our-community' }),
        choice('Shopping & support', 'A little help, right here', { catalogHref: '/about-us#story-support' }),
      ] },
    ],
  },
  {
    id: 'offers', label: 'Special Offers', heading: 'Find your next favourite.',
    description: 'Thoughtfully priced frames and everyday essentials from the current collection.',
    overview: { catalogHref: '/special-offers' },
    groups: [
      { title: 'Explore the edits', items: [
        choice('The value edits', 'Find a good place to start', { catalogHref: '/special-offers#offers-edits' }),
        choice('Featured finds', 'Browse current favourites', { catalogHref: '/special-offers#offers-finds' }),
      ] },
      { title: 'Before you shop', items: [
        choice('Offer information', 'Clear details before checkout', { catalogHref: '/special-offers#offer-information' }),
        choice('Frames under ₹5,000', 'Browse the price edit', { catalogHref: '/eyewear?price=under-5000' }),
      ] },
    ],
  },
  {
    id: 'festive-sale', label: 'Seasonal Edit', heading: 'A little celebration. A lot of style.',
    description: 'Discover frames and gift inspiration for your next special occasion.',
    overview: { catalogHref: '/seasonal-edit' },
    groups: [
      { title: 'For the occasion', items: [
        choice('Celebration styles', 'Find your standout pair', { catalogHref: '/seasonal-edit#seasonal-favourites' }),
        choice('Everyday classics', 'A favourite beyond the occasion', { catalogHref: '/eyewear/eyeglasses' }),
      ] },
      { title: 'Gift inspiration', items: [
        choice('For him', 'A considered starting point', { catalogHref: '/eyewear/eyeglasses/men' }),
        choice('For her', 'A little personal character', { catalogHref: '/eyewear/eyeglasses/women' }),
        choice('Gift ideas', 'A thoughtful touch', { catalogHref: '/seasonal-edit#seasonal-gifting' }),
      ] },
    ],
  },
  {
    id: 'gift-card', label: 'Gift Cards', heading: 'Let them find their own look.',
    description: 'Try the gift card purchase demo and browse thoughtful gifting ideas. Payment will be connected later.',
    overview: { catalogHref: '/gift-card' },
    groups: [
      { title: 'Explore gift cards', items: [
        choice('Buy a gift card · Demo', 'Choose a design, amount and message', { catalogHref: '/gift-card#gift-preview' }),
        choice('Questions & details', 'What is available today', { catalogHref: '/gift-card#gift-questions' }),
      ] },
      { title: 'Find their kind of gift', items: [
        choice('Gift inspiration', 'Frames, extras and occasion edits', { catalogHref: '/gift-card#gift-guide' }),
        choice('Explore frames', 'Find a look that feels like them', { catalogHref: '/eyewear' }),
        choice('Explore accessories', 'The thoughtful little details', { catalogHref: '/accessories' }),
      ] },
    ],
  },
];
