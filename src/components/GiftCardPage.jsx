import { useEffect, useRef, useState } from 'react';
import { CollectionLink, Icon } from './GlassesPage.jsx';
import './GiftCardPage.css';

const amounts = [1000, 2500, 5000, 10000];
const designs = [
  { id: 'black', label: 'Black' },
  { id: 'cream', label: 'Cream' },
  { id: 'graphite', label: 'Graphite' },
];
const formatAmount = amount => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export default function GiftCardPage({ onNavigate }) {
  const [amount, setAmount] = useState(2500);
  const [design, setDesign] = useState('black');
  const [recipient, setRecipient] = useState('Someone special');
  const [message, setMessage] = useState('For every new way you see the world.');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [checkout, setCheckout] = useState('edit');
  const checkoutHeading = useRef(null);
  const updateDetail = (setter, value) => { setter(value); setCheckout('edit'); };
  useEffect(() => { if (checkout !== 'edit') checkoutHeading.current?.focus({ preventScroll: true }); }, [checkout]);
  const reviewOrder = event => {
    event.preventDefault();
    if (!recipient.trim()) {
      const input = event.currentTarget.querySelector('#gift-recipient');
      input.setCustomValidity('Enter a recipient name.');
      input.reportValidity();
      return;
    }
    setCheckout('review');
    requestAnimationFrame(() => document.getElementById('gift-checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  const startAnotherDemo = () => {
    setAmount(2500); setDesign('black'); setRecipient('Someone special'); setRecipientEmail('');
    setMessage('For every new way you see the world.'); setCheckout('edit');
    document.getElementById('gift-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return <div className="gift-page">
    <nav className="gift-breadcrumb" aria-label="Breadcrumb"><CollectionLink href="/" onNavigate={onNavigate}>Home</CollectionLink><span aria-hidden="true">/</span><span aria-current="page">Gift Cards</span></nav>

    <section className="gift-hero" aria-labelledby="gift-title">
      <div className="gift-hero__copy"><p className="gift-eyebrow">A GIFT WITH THEIR NAME ON IT</p><h1 id="gift-title">Give them room<br />to <em>see differently.</em></h1><p>Great style is personal. Choose a design, amount and message, then try the gift card purchase flow.</p><a className="gift-button" href="#gift-preview">Buy a gift card · Demo <Icon name="arrow" /></a><p className="gift-hero__status">Demo only. No payment will be taken or gift card issued.</p></div>
      <div className="gift-hero__visual" aria-hidden="true"><div className="gift-hero__card"><span>CandiClie</span><span>See life.<br /><em>Your way.</em></span><span>A little something for you</span></div></div>
    </section>

    <section className="gift-preview" id="gift-preview" aria-labelledby="gift-preview-title"><div className="gift-section-heading"><p className="gift-eyebrow">MAKE IT PERSONAL</p><h2 id="gift-preview-title">Picture the perfect surprise.</h2><p>Choose the details you would use to buy a card. This demo lets you review the purchase without collecting payment or sending an email.</p></div>
      <div className="gift-preview__layout">
        <form className="gift-preview__controls" onSubmit={reviewOrder}>
          <fieldset><legend>Choose a look</legend><div className="gift-designs">{designs.map(item => <button key={item.id} type="button" className={`gift-design gift-design--${item.id}`} aria-pressed={design === item.id} onClick={() => updateDetail(setDesign, item.id)}><span aria-hidden="true" />{item.label}</button>)}</div></fieldset>
          <fieldset><legend>Choose an amount</legend><div className="gift-amounts">{amounts.map(value => <button key={value} type="button" aria-pressed={amount === value} onClick={() => updateDetail(setAmount, value)}>{formatAmount(value)}</button>)}</div><p>Demo amounts only. Final denominations will be set when gift cards launch.</p></fieldset>
          <label htmlFor="gift-recipient">Recipient name</label><input id="gift-recipient" type="text" maxLength="28" value={recipient} onChange={event => { event.target.setCustomValidity(''); updateDetail(setRecipient, event.target.value); }} placeholder="Recipient name" autoComplete="off" required />
          <label htmlFor="gift-recipient-email">Recipient email</label><input id="gift-recipient-email" type="email" maxLength="120" value={recipientEmail} onChange={event => updateDetail(setRecipientEmail, event.target.value)} placeholder="name@example.com" autoComplete="off" required /><p className="gift-preview__field-note">Used only for this on-screen demo. No email is sent or stored.</p>
          <label htmlFor="gift-message">Add a short message</label><textarea id="gift-message" maxLength="100" rows="3" value={message} onChange={event => updateDetail(setMessage, event.target.value)} placeholder="Write a personal note" />
          <button className="gift-checkout__continue" type="submit">Review demo order <Icon name="arrow" /></button><p className="gift-preview__field-note">No payment information is requested.</p>
        </form>
        <div className="gift-preview__result"><div className={`gift-card gift-card--${design}`} aria-label={`Gift card design preview for ${recipient || 'your recipient'}, suggested amount ${formatAmount(amount)}`}><div className="gift-card__top"><span>CandiClie</span><span>GIFT CARD PREVIEW</span></div><div className="gift-card__mark" aria-hidden="true">C</div><div className="gift-card__bottom"><span>For {recipient.trim() || 'someone special'}</span><strong>{formatAmount(amount)}</strong></div></div><div className="gift-preview__message"><span>Your message</span><p>{message.trim() || 'Your personal note will appear here.'}</p></div><p className="gift-preview__notice">Preview only · No card number, balance or redemption value is created.</p></div>
      </div>
      {checkout !== 'edit' && <section className="gift-checkout" id="gift-checkout" aria-labelledby="gift-checkout-title"><div className="gift-checkout__intro"><p className="gift-eyebrow">{checkout === 'complete' ? 'DEMO COMPLETE' : 'REVIEW YOUR GIFT'}</p><h3 id="gift-checkout-title" ref={checkoutHeading} tabIndex="-1">{checkout === 'complete' ? 'Your demo purchase is complete.' : 'Your demo checkout.'}</h3><p>{checkout === 'complete' ? 'You have seen the full purchase flow. Nothing was charged, no card or balance was issued, and no email was sent.' : 'Check the details before completing the demo. No payment information will be collected.'}</p></div><div className="gift-checkout__summary"><dl><div><dt>Design</dt><dd>{designs.find(item => item.id === design)?.label}</dd></div><div><dt>Recipient</dt><dd>{recipient.trim()}</dd></div><div><dt>Email</dt><dd>{recipientEmail.trim()}</dd></div><div><dt>Message</dt><dd>{message.trim() || 'No message'}</dd></div><div className="gift-checkout__total"><dt>Demo total</dt><dd>{formatAmount(amount)}</dd></div></dl>{checkout === 'review' ? <div className="gift-checkout__actions"><button type="button" className="gift-checkout__complete" onClick={() => setCheckout('complete')}>Complete demo purchase</button><button type="button" className="gift-checkout__edit" onClick={() => { setCheckout('edit'); document.getElementById('gift-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>Edit details</button></div> : <button type="button" className="gift-checkout__edit" onClick={startAnotherDemo}>Start another demo</button>}</div></section>}
    </section>

    <section className="gift-guide" id="gift-guide" aria-labelledby="gift-guide-title"><div className="gift-section-heading"><p className="gift-eyebrow">GOOD THINGS TO SHARE</p><h2 id="gift-guide-title">A little inspiration while you wait.</h2></div><div className="gift-guide__grid">
      <CollectionLink href="/eyewear" onNavigate={onNavigate}><span>01 / FRAMES</span><h3>A look that feels like them.</h3><p>Start with eyeglasses and sunglasses in a style they would choose for themselves.</p><strong>Explore frames <Icon name="arrow" /></strong></CollectionLink>
      <CollectionLink href="/accessories" onNavigate={onNavigate}><span>02 / THE EXTRAS</span><h3>Thoughtful little details.</h3><p>Cases, care essentials and finishing touches for their favourite pair.</p><strong>Explore accessories <Icon name="arrow" /></strong></CollectionLink>
      <CollectionLink href="/seasonal-edit" onNavigate={onNavigate}><span>03 / OCCASIONS</span><h3>Find their moment.</h3><p>Browse the Seasonal Edit for pieces with a little more presence.</p><strong>Explore seasonal styles <Icon name="arrow" /></strong></CollectionLink>
    </div></section>

    <section className="gift-questions" id="gift-questions" aria-labelledby="gift-questions-title"><div><p className="gift-eyebrow">THE DETAILS</p><h2 id="gift-questions-title">Good to know.</h2><p>You can try a gift card purchase here. Payment and redemption will be connected later.</p></div><div className="gift-questions__list"><details><summary>Can I buy a real gift card now?<span aria-hidden="true">+</span></summary><p>Not yet. The checkout above is a demo. It does not charge you, create a card balance or send a gift card.</p></details><details><summary>Can a demo card be redeemed?<span aria-hidden="true">+</span></summary><p>No. The selected amount has no redemption value until a real payment and gift card service is connected.</p></details><details><summary>Will the recipient receive an email?<span aria-hidden="true">+</span></summary><p>No. Recipient details stay on this page during the demo and are not sent or saved.</p></details></div></section>
  </div>;
}
