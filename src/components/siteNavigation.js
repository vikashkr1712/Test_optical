import { brands } from './brandCollections.js';

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
const lens = (title, description, details) => info(title, 'CONTACT LENS OPTIONS', description, { details, note: 'Contact lens shopping is not available on this homepage yet. Your lens type and prescription should be confirmed with an eye-care professional.', cta: cta('View shopping information', '#footer-help-heading') });
const accessory = (title, description, details) => info(title, 'THE FINISHING TOUCH', description, { details, note: 'This is a guide to the accessory categories. Accessory ordering is not open yet.', cta: cta('Browse frame inspiration', '#community') });
const gifting = (title, description, details) => info(title, 'A LITTLE SOMETHING FOR THEM', description, { details, note: 'Gift cards are not available to buy or redeem yet. Explore frame inspiration below.', cta: cta('Explore gift inspiration', '#collection-edits') });

export const navigation = [
  {
    id: 'eyewear', label: 'Eyewear', heading: 'Find your kind of frame.',
    description: 'Everyday essentials and a little more personality. Start with a style that feels like you.',
    overview: eyewear('Explore eyewear', 'Discover optical frames, sunglasses and expressive shapes in our featured edits.', images.eyewear, ['Explore frames for him, her and kids.', 'Compare classic and statement silhouettes.']),
    groups: [
      { title: 'Shop by type', items: [
        choice('Eyeglasses', 'Your everyday essential', eyewear('Eyeglasses', 'Clean optical frames, classic silhouettes and a fresh point of view. Browse our everyday eyewear edit.')),
        choice('Sunglasses', 'A brighter point of view', eyewear('Sunglasses', 'From understated shapes to bold proportions, discover sunglasses that complement your personal style.', images.fashion)),
        choice('Fresh perspectives', 'Discover the latest edit', eyewear('Fresh perspectives', 'Explore the second featured-frame edit for different colours, expressive silhouettes and a fresh look.', images.fashion)),
      ] },
      { title: 'For everyone', items: [
        choice('For men', 'Make it your signature', eyewear('The men’s edit', 'Explore clean opticals, distinctive details and statement sunglasses for your everyday rotation.', images.men)),
        choice('For women', 'A look of your own', eyewear('The women’s edit', 'Discover soft curves, sculptural shapes and expressive frames with a personal point of view.', images.women)),
        choice('For kids', 'Little frames. Big character.', eyewear('The junior edit', 'Colourful shapes and playful details for growing personalities. Explore the junior collection with fit in mind.', images.kids)),
      ] },
      { title: 'Explore shapes', items: [
        choice('Round', 'Soft curves and clean lines', eyewear('Round frames', 'Circular and softly rounded silhouettes bring a relaxed, distinctive finish to your look.')),
        choice('Rectangle', 'A sharper outline', eyewear('Rectangle frames', 'Straight lines and defined corners make an easy starting point for a clean, structured look.', images.men)),
        choice('Cat-eye', 'A little lift at the edges', eyewear('Cat-eye frames', 'Upswept corners and expressive curves add character to an everyday outfit.', images.women)),
        choice('Aviator', 'An enduring silhouette', eyewear('Aviator frames', 'Explore the familiar teardrop-inspired silhouette and make this classic shape your own.', images.fashion)),
      ] },
    ],
  },
  {
    id: 'contact-lens', label: 'Contact Lens', heading: 'Explore your lens options.',
    description: 'A simple introduction to the categories, with a clear place to start.',
    overview: lens('Contact lenses', 'Explore the lens categories below before discussing the right option with an eye-care professional.', ['Daily lenses', 'Monthly lenses', 'Coloured lenses']),
    groups: [
      { title: 'Browse lens types', items: [
        choice('Daily lenses', 'Explore the daily category', lens('Daily contact lenses', 'A starting point for exploring the daily lens category.', ['Compare available daily-lens options when shopping launches.', 'Confirm the appropriate lens and prescription with an eye-care professional.'])),
        choice('Monthly lenses', 'Explore the monthly category', lens('Monthly contact lenses', 'A starting point for exploring the monthly lens category.', ['Review product-specific information when the catalogue is available.', 'Ask an eye-care professional about the right option for you.'])),
        choice('Coloured lenses', 'Explore a different look', lens('Coloured contact lenses', 'Explore colour as another part of your personal style.', ['Colour options will be shown with the future lens catalogue.', 'Coloured lenses also require suitable professional guidance.'])),
      ] },
      { title: 'Before you browse', items: [
        choice('Prescription information', 'Know what to have ready', lens('Your contact lens prescription', 'Use the contact lens prescription provided by your eye-care professional when a contact lens catalogue becomes available.', ['This homepage does not collect or validate prescriptions.', 'No contact lenses can be ordered here yet.'])),
        choice('Shopping information', 'How this homepage works', lens('Contact lens shopping', 'The contact lens menu currently offers category information.', ['No lens checkout or prescription upload is open.', 'Browse the frame collections and style inspiration while shopping is being prepared.'])),
      ] },
    ],
  },
  {
    id: 'accessories', label: 'Accessories', heading: 'The little things, considered.',
    description: 'Explore the finishing touches that belong alongside your favourite pair.',
    overview: accessory('Eyewear accessories', 'Discover the categories for storing, carrying and caring for your frames.', ['Cases and pouches', 'Cleaning cloths', 'Everyday care essentials']),
    groups: [
      { title: 'The essentials', items: [
        choice('Cases & pouches', 'A place for your favourite pair', accessory('Cases & pouches', 'Explore storage options for the frames you take with you.', ['Browse case and pouch styles when the accessories catalogue is available.', 'Check dimensions against your frame before choosing.'])),
        choice('Cleaning cloths', 'Small essentials for your routine', accessory('Cleaning cloths', 'Explore cloths designed for an eyewear care routine.', ['Product information will accompany the accessories catalogue.', 'Follow the care guidance supplied with your own frame and lenses.'])),
        choice('Care essentials', 'Keep the details in mind', accessory('Eyewear care essentials', 'A place to discover the accessories that complement your everyday pair.', ['Explore storage and care categories.', 'Check the manufacturer’s instructions for your own eyewear.'])),
      ] },
      { title: 'Find inspiration', items: [
        choice('Everyday pairings', 'Frames that fit your style', eyewear('Everyday pairings', 'Start with the frame, then consider the small details that make it feel like your own.', images.fashion)),
        choice('Style notes', 'See how others wear theirs', info('Style notes', 'SEEN ON THE STREETS', 'Discover everyday outfit ideas and expressive frames in our community edit.', { media: images.fashion, cta: cta('Visit the community edit', '#community') })),
      ] },
    ],
  },
  {
    id: 'brands', label: 'Brands', heading: 'Different identities. Your point of view.',
    description: 'Explore the eight style identities in our House of Brands.',
    overview: info('House of Brands', 'THE DIRECTORY', 'Discover eight distinct style identities, from considered classics to expressive everyday frames.', { media: images.fashion, cta: cta('Explore House of Brands', '#house-of-brands') }),
    groups: [0, 4].map((start, index) => ({ title: index === 0 ? 'Considered classics' : 'Expressive perspectives', items: brands.slice(start, start + 4).map(brand => choice(brand.title, brand.line, info(brand.title, 'HOUSE OF BRANDS', brand.description, { media: photo(brand.image, brand.alt, true), cta: cta('Explore House of Brands', '#house-of-brands') }))) })),
  },
  {
    id: 'about', label: 'About', heading: 'A fresh point of view.',
    description: 'Get to know CandiClie through our frames, style edits and community.',
    overview: info('About CandiClie', 'SEE LIFE. YOUR WAY.', 'CandiClie brings eyewear discovery, considered style edits and everyday inspiration together in one place.', { details: ['Explore a selection of optical frames and sunglasses.', 'Find different points of view in our brand and community edits.'], cta: cta('Discover our collections', '#collection-edits') }),
    groups: [
      { title: 'Meet CandiClie', items: [
        choice('Our story', 'An eye for personal style', info('Our story', 'CANDICLIE', 'We believe a frame is part of your everyday expression. This homepage brings together distinctive shapes, thoughtful details and the inspiration to find a look of your own.', { media: images.women, cta: cta('Discover our edits', '#collection-edits') })),
        choice('Our approach', 'Considered choices. Your character.', info('Our approach', 'A FRESH POINT OF VIEW', 'Start with what feels like you. Explore shapes, compare colours and take a closer look at the details.', { details: ['Personal expression through different silhouettes.', 'Clear frame previews and easy collection browsing.', 'Style inspiration from everyday looks.'], cta: cta('Explore top categories', '#top-categories') })),
      ] },
      { title: 'Around the homepage', items: [
        choice('Our community', 'Seen on the Streets', info('Our community', 'SEEN ON THE STREETS', 'Explore three different everyday looks in our street-style edit, then find your own point of view.', { media: images.fashion, cta: cta('See the community edit', '#community') })),
        choice('Shopping & support', 'A little help, right here', info('Shopping & support', 'HERE TO HELP', 'Open a frame card for a closer look, browse the collections, or visit the homepage help section.', { details: ['Online ordering is not open yet.', 'Prices and availability will be confirmed when shopping launches.'], cta: cta('Read homepage help', '#footer-help-heading') })),
      ] },
    ],
  },
  {
    id: 'offers', label: 'Offers', heading: 'Find your next favourite.',
    description: 'Explore the featured edits and learn how offers will be shown when shopping opens.',
    overview: info('Offers & featured edits', 'THE CANDICLIE SELECTION', 'Browse the featured selection for frame inspiration. No discount or promotional code is active on this preview homepage.', { media: images.eyewear, cta: cta('Browse featured frames') }),
    groups: [
      { title: 'Explore the edits', items: [
        choice('Featured frames', 'Start with the current selection', eyewear('Featured frames', 'Explore our three best-seller previews and the Fresh perspectives tab for a different look.')),
        choice('Sunglasses edit', 'A little more character', eyewear('The sunglasses edit', 'Discover expressive sunglasses among our featured frames and fashion categories.', images.fashion)),
      ] },
      { title: 'Before you shop', items: [
        choice('Offer information', 'Clear details before checkout', info('Offer information', 'SHOPPING INFORMATION', 'There are no live discounts, coupon codes or checkout offers on this homepage.', { details: ['Browse the current featured frames and style edits.', 'Visit homepage help for shopping information.'], cta: cta('Read homepage help', '#footer-help-heading') })),
        choice('Explore all categories', 'Find a different point of view', eyewear('Explore all categories', 'Browse eyeglasses, men’s, women’s, kids’ and fashion edits to find your starting point.', images.fashion)),
      ] },
    ],
  },
  {
    id: 'festive-sale', label: 'Festive Sale', heading: 'A little celebration. A lot of style.',
    description: 'Discover frames and gift inspiration for your next special occasion.',
    overview: info('The festive edit', 'STYLE FOR EVERY CELEBRATION', 'Explore expressive frames and considered gift inspiration. This edit does not currently include a live sale discount.', { media: images.fashion, cta: cta('Explore the featured selection') }),
    groups: [
      { title: 'For the occasion', items: [
        choice('Celebration styles', 'Find your standout pair', eyewear('Celebration styles', 'Explore bold shapes, expressive colours and a fresh frame for your next special occasion.', images.fashion)),
        choice('Everyday classics', 'A favourite beyond the occasion', eyewear('Everyday classics', 'Start with clean optical frames and familiar shapes you can make your own.')),
      ] },
      { title: 'Gift inspiration', items: [
        choice('For him', 'A considered starting point', eyewear('Gift inspiration for him', 'Explore the men’s edit for distinctive frame shapes and a fresh perspective.', images.men)),
        choice('For her', 'A little personal character', eyewear('Gift inspiration for her', 'Explore the women’s edit for expressive curves, colour and standout details.', images.women)),
      ] },
    ],
  },
  {
    id: 'gift-card', label: 'Gift Card', heading: 'Let them find their own look.',
    description: 'Explore gifting information and frame inspiration before gift card shopping opens.',
    overview: gifting('Gift cards', 'A gift card could give someone room to choose a frame that feels like them. Gift card shopping is not open on this homepage.', ['Explore frame inspiration for the people you have in mind.', 'Purchasing and redemption details will be provided if gift cards launch.']),
    groups: [
      { title: 'Gifting information', items: [
        choice('Gift card overview', 'How gifting will be introduced', gifting('Gift card overview', 'This menu is an introduction to gifting; it does not issue or sell a gift card.', ['No gift card balance is created on this page.', 'Purchase and redemption terms are not available yet.'])),
        choice('Choosing an amount', 'Plan a thoughtful gift', gifting('Choosing a gift amount', 'Browse the frame previews for inspiration while planning a gift.', ['No denominations or gift card prices are currently offered.', 'Reference frame prices do not set a gift card value.'])),
      ] },
      { title: 'Find their kind of frame', items: [
        choice('Frames for him', 'Explore the men’s edit', eyewear('Frames for him', 'Discover the men’s collection as a starting point for thoughtful frame inspiration.', images.men)),
        choice('Frames for her', 'Explore the women’s edit', eyewear('Frames for her', 'Explore the women’s collection and find a shape that reflects her personal style.', images.women)),
      ] },
    ],
  },
];
