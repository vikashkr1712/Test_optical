import { useEffect, useRef, useState } from 'react';
import { CollectionLink } from './GlassesPage.jsx';
import { addDays, bookingSteps, emptyBooking, exampleTimes, formatVisitDate, formatVisitTime, indiaDate, validateBookingStep, visitReasons } from './eyeTestBooking.js';
import { eyeTestStores, getEyeTestStore, storeCities } from './eyeTestStores.js';
import EyeTestStoreFinder from './EyeTestStoreFinder.jsx';
import './EyeTestPage.css';

function EyeIcon({ name, ...props }) {
  const paths = {
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 11h18m-13 5h2m4 0h2" /></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    person: <><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></>,
  };
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

const questions = [
  ['Can I book a real appointment here?', 'This is a preview of the CandiClie booking experience. Choose a store, date and example time, then review your visit. No appointment is reserved and no message is sent. Verified stores and live availability will be added before bookings open.'],
  ['How does the PIN-code search work?', 'Start typing a PIN code to see stores whose PIN begins with those digits. For example, 5 shows matching stores across cities, while 56 selects Bengaluru automatically because all matching stores are there. Add more digits to narrow the results. You can also choose a city directly from the dropdown. This search shows matching addresses; it does not calculate your distance from a store.'],
  ['How do I choose a store and book?', `Browse ${eyeTestStores.length} stores across ${storeCities.length} cities. Each card shows an illustrative address, PIN code and area-map link. Select Book appointment on your chosen store, then choose a date and example time, add your details and review the visit. All store entries are samples, not operating CandiClie branches.`],
  ['Are the times and prices confirmed?', 'The times shown are examples in Indian Standard Time (IST), not live availability. Store hours, appointment duration, services and any fee will be confirmed before real bookings open.'],
  ['What should I have ready for a visit?', 'Your current glasses and an existing prescription, if you have one, are useful starting points. Any preparation for a particular test should be confirmed with the store when you make a real appointment.'],
  ['What happens to the details I enter?', 'Your details stay in memory on this page. They are not saved in this browser, sent to a store or used for marketing. Refreshing or leaving the page clears the preview.'],
];

function FieldError({ name, errors }) {
  return errors[name] ? <p className="eye-field-error" id={`eye-${name}-error`}>{errors[name]}</p> : null;
}

function VisitSummary({ booking, step, onEdit }) {
  const store = getEyeTestStore(booking.storeId);
  return <aside className="eye-summary" aria-labelledby="eye-summary-title">
    <div className="eye-summary__heading"><EyeIcon name="eye" /><span>VISIT SUMMARY</span></div>
    <h3 id="eye-summary-title">Your appointment</h3>
    <p className="eye-summary__type">In-store eye test <span>Preview</span></p>
    <dl>
      <div><dt><EyeIcon name="pin" />Your store{step > 0 && <button type="button" onClick={() => onEdit(0)} aria-label="Change selected store">Change</button>}</dt><dd>{store ? <>{store.name}<span>{store.address}</span><span>{store.city}, {store.state} · {store.pinCode}</span><small>Illustrative address</small></> : <>Choose a store<small>Search by city, area or PIN code</small></>}</dd></div>
      <div><dt><EyeIcon name="calendar" />Date & time{step > 1 && <button type="button" onClick={() => onEdit(1)} aria-label="Edit date and time">Edit</button>}</dt><dd>{formatVisitDate(booking.date)}<span>{booking.time ? `${formatVisitTime(booking.time)} · IST` : 'Choose an example time'}</span></dd></div>
      <div><dt><EyeIcon name="person" />Visit focus{step > 2 && <button type="button" onClick={() => onEdit(2)} aria-label="Edit your details">Edit</button>}</dt><dd>{booking.reason}</dd></div>
    </dl>
    <p className="eye-summary__note"><EyeIcon name="lock" />No payment. No reservation.<br />Your details stay on this page.</p>
  </aside>;
}

function BookingForm({ onNavigate }) {
  const [booking, setBooking] = useState(emptyBooking);
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [errors, setErrors] = useState({});
  const [clock, setClock] = useState(() => new Date());
  const [storeSearch, setStoreSearch] = useState({ query: '', city: '' });
  const stepHeading = useRef(null);
  const hasInteracted = useRef(false);
  const form = useRef(null);
  const today = indiaDate(clock);
  const dates = Array.from({ length: 7 }, (_, index) => addDays(today, index));
  const times = exampleTimes(booking.date, clock);
  const selectedStore = getEyeTestStore(booking.storeId);

  useEffect(() => {
    const refresh = () => setClock(new Date());
    const interval = window.setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    return () => { window.clearInterval(interval); window.removeEventListener('focus', refresh); };
  }, []);

  useEffect(() => {
    if (!hasInteracted.current) return;
    stepHeading.current?.focus({ preventScroll: true });
    document.getElementById('eye-booking-card')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, [step, complete]);

  const update = (key, value) => {
    setBooking(current => ({ ...current, [key]: value, ...(key === 'date' ? { time: '' } : {}) }));
    setErrors(current => ({ ...current, [key]: undefined, ...(key === 'date' ? { time: undefined } : {}) }));
  };
  const goTo = target => {
    hasInteracted.current = true;
    setErrors({}); setStep(target);
  };
  const chooseStore = store => {
    setBooking(current => ({ ...current, storeId: store.id, ...(current.storeId !== store.id ? { date: '', time: '' } : {}) }));
    goTo(1);
  };
  const showErrors = issues => {
    setErrors(issues);
    requestAnimationFrame(() => {
      const first = Object.keys(issues)[0];
      const control = form.current?.querySelector(`[name="${first}"]:not(:disabled)`);
      (control || form.current?.querySelector('.eye-error-summary'))?.focus();
    });
  };
  const submit = event => {
    event.preventDefault();
    const now = new Date();
    setClock(now);
    const issues = validateBookingStep(step, booking, now);
    if (Object.keys(issues).length) { showErrors(issues); return; }
    hasInteracted.current = true;
    if (step < 3) { goTo(step + 1); return; }
    // Revalidate every step: a selected time can elapse while the review is open.
    for (let index = 0; index < 3; index++) {
      const priorIssues = validateBookingStep(index, booking, now);
      if (Object.keys(priorIssues).length) {
        setStep(index); showErrors(priorIssues); return;
      }
    }
    setComplete(true);
  };
  const errorProps = name => ({ 'aria-invalid': !!errors[name], 'aria-describedby': errors[name] ? `eye-${name}-error` : undefined });

  if (complete) return <section className="eye-complete" id="eye-booking-card" aria-labelledby="eye-complete-title">
    <span className="eye-complete__icon"><EyeIcon name="check" /></span><p className="eye-eyebrow">PREVIEW COMPLETE</p><h3 id="eye-complete-title" ref={stepHeading} tabIndex="-1">Your appointment details</h3>
    <p>Thanks, {booking.name.trim().split(/\s+/)[0]}. You’ve explored the booking experience. No appointment has been reserved and no email or SMS has been sent.</p>
    <div className="eye-complete__visit"><EyeIcon name="calendar" /><div><strong>{formatVisitDate(booking.date, { weekday: 'long' })} · {formatVisitTime(booking.time)} IST</strong><span>{selectedStore.name}</span><span>{selectedStore.address}, {selectedStore.city} · {selectedStore.pinCode}</span><span>Example visit only</span></div></div>
    <p className="eye-complete__next">Real store locations, availability and appointment confirmations will be available when bookings open.</p>
    <div className="eye-complete__actions"><button type="button" className="eye-button eye-button--light" onClick={() => { setBooking(emptyBooking()); setStoreSearch({ query: '', city: '' }); setErrors({}); setStep(0); setComplete(false); }}>Start a new preview <EyeIcon name="arrow" /></button><CollectionLink href="/eyewear/eyeglasses" onNavigate={onNavigate} className="eye-text-link">Explore eyeglasses <EyeIcon name="arrow" /></CollectionLink></div>
  </section>;

  const headings = ['Find a store', 'Choose date & time', 'Your contact details', 'Review your appointment'];
  const descriptions = ['Search by city, area or PIN code. Check the address, then select Book appointment on your chosen store.', 'Choose a date and an example time for your selected store. These preferences do not reserve a slot.', 'Add the details you would use for a visit. Nothing is sent or saved.', 'Check your store and visit details. You can edit any step before finishing the preview.'];

  return <div className={`eye-booking__layout${step === 0 ? ' eye-booking__layout--finder' : ''}`} id="eye-booking-card">
    <div className="eye-form-panel">
      <nav aria-label="Booking progress"><ol className="eye-progress">{bookingSteps.map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined}><button type="button" disabled={index > step} onClick={() => goTo(index)}><span>{index < step ? <EyeIcon name="check" /> : `0${index + 1}`}</span><span>{label}</span></button></li>)}</ol></nav>
      <form ref={form} onSubmit={submit} noValidate>
        <div className="eye-form-heading" key={step}><p className="eye-eyebrow">STEP 0{step + 1} / 04</p><h3 ref={stepHeading} tabIndex="-1">{headings[step]}</h3><p>{descriptions[step]}</p></div>
        {Object.values(errors).some(Boolean) && <p className="eye-error-summary" role="alert" tabIndex="-1">Please check the highlighted fields to continue.</p>}
        {step > 0 && step < 3 && selectedStore && <div className="eye-chosen-store"><EyeIcon name="pin" /><div><strong>{selectedStore.name}</strong><span>{selectedStore.city} · PIN {selectedStore.pinCode}</span></div><button type="button" onClick={() => goTo(0)}>Change store</button></div>}

        {step === 0 && <EyeTestStoreFinder search={storeSearch} onSearchChange={value => { setStoreSearch(value); setErrors({}); }} selectedStoreId={booking.storeId} onBook={chooseStore} error={errors.storeId} />}

        {step === 1 && <div className="eye-fields">
          <fieldset className="eye-date-options" aria-describedby={errors.date ? 'eye-date-error' : undefined}><legend>Choose a preferred date</legend><div className="eye-date-grid">{dates.map((date, index) => <label key={date} className={`eye-date${booking.date === date ? ' is-selected' : ''}`}><input type="radio" name="date" value={date} checked={booking.date === date} onChange={() => update('date', date)} /><span>{index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : formatVisitDate(date, { weekday: 'short', day: undefined, month: undefined })}</span><strong>{Number(date.slice(8))}</strong><span>{formatVisitDate(date, { weekday: undefined, day: undefined, month: 'short' })}</span></label>)}</div></fieldset>
          <div className="eye-field eye-other-date"><label htmlFor="eye-date">Or choose another date <span>Next 30 days</span></label><input id="eye-date" type="date" name="date" min={today} max={addDays(today, 30)} value={booking.date} onChange={event => update('date', event.target.value)} {...errorProps('date')} /><FieldError name="date" errors={errors} /></div>
          <fieldset className="eye-time-options" aria-describedby={`eye-time-note${errors.time ? ' eye-time-error' : ''}`}><legend>Choose an example time <span>IST · UTC +5:30</span></legend><p id="eye-time-note">Example times only. Live store availability is not connected.</p>{!booking.date ? <p className="eye-time-empty">Select a date to see example times.</p> : !times.length ? <p className="eye-time-empty">No example times remain for this date. Choose another day.</p> : <div className="eye-time-grid">{times.map(time => <label key={time} className={`eye-time${booking.time === time ? ' is-selected' : ''}`}><input type="radio" name="time" value={time} checked={booking.time === time} onChange={() => update('time', time)} /><span>{formatVisitTime(time)}</span></label>)}</div>}<FieldError name="time" errors={errors} /></fieldset>
        </div>}

        {step === 2 && <div className="eye-fields">
          <div className="eye-field"><label htmlFor="eye-name">Full name <span>Required</span></label><input id="eye-name" name="name" autoComplete="name" value={booking.name} onChange={event => update('name', event.target.value)} placeholder="Your full name" maxLength="100" required {...errorProps('name')} /><FieldError name="name" errors={errors} /></div>
          <div className="eye-field"><label htmlFor="eye-phone">Mobile number <span>Required</span></label><div className="eye-phone"><span>+91</span><input id="eye-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" value={booking.phone} onChange={event => update('phone', event.target.value)} placeholder="10-digit mobile number" maxLength="15" required {...errorProps('phone')} /></div><FieldError name="phone" errors={errors} /></div>
          <div className="eye-field"><label htmlFor="eye-email">Email address <span>Optional</span></label><input id="eye-email" name="email" type="email" autoComplete="email" value={booking.email} onChange={event => update('email', event.target.value)} placeholder="you@example.com" maxLength="150" {...errorProps('email')} /><FieldError name="email" errors={errors} /></div>
          <div className="eye-field"><label htmlFor="eye-reason">What brings you in?</label><select id="eye-reason" name="reason" value={booking.reason} onChange={event => update('reason', event.target.value)}>{visitReasons.map(reason => <option key={reason}>{reason}</option>)}</select></div>
          <div><label className="eye-consent"><input type="checkbox" name="consent" checked={booking.consent} onChange={event => update('consent', event.target.checked)} required {...errorProps('consent')} /><span>I understand this is a preview. No appointment is booked and my details are not sent or saved.</span></label><FieldError name="consent" errors={errors} /></div>
        </div>}

        {step === 3 && <div className="eye-review">
          <section><div className="eye-review__title"><h4>Selected store</h4><button type="button" onClick={() => goTo(0)}>Edit store</button></div><p>{selectedStore.name}<span>{selectedStore.address}</span><span>{selectedStore.city}, {selectedStore.state} · PIN {selectedStore.pinCode}</span><small>Illustrative address</small></p></section>
          <section><div className="eye-review__title"><h4>Preferred date & time</h4><button type="button" onClick={() => goTo(1)}>Edit date & time</button></div><p>{formatVisitDate(booking.date, { weekday: 'long', year: 'numeric' })}<span>{formatVisitTime(booking.time)} IST · Example time</span></p></section>
          <section><div className="eye-review__title"><h4>Your details</h4><button type="button" onClick={() => goTo(2)}>Edit details</button></div><p>{booking.name.trim()}<span>+91 {booking.phone.replace(/[\s-]/g, '')}</span>{booking.email.trim() && <span>{booking.email.trim()}</span>}<small>{booking.reason}</small></p></section>
          <p className="eye-review__notice"><EyeIcon name="lock" />Finishing this preview does not reserve an appointment, send a confirmation or take a payment.</p>
        </div>}

        {(step > 0 || selectedStore) && <div className="eye-form-actions">{step > 0 && <button type="button" className="eye-back" onClick={() => goTo(step - 1)}>Back</button>}<button type="submit" className="eye-button">{step === 0 ? 'Continue with selected store' : step === 1 ? 'Continue to your details' : step === 2 ? 'Review your visit' : 'Finish booking preview'}<EyeIcon name="arrow" /></button></div>}
        <p className="eye-form-privacy"><EyeIcon name="lock" />Private to this page. Refreshing clears your details.</p>
      </form>
    </div>
    <VisitSummary booking={booking} step={step} onEdit={goTo} />
  </div>;
}

export default function EyeTestPage({ onNavigate }) {
  const page = useRef(null);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const running = new Set();
    const seen = new WeakSet();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || seen.has(entry.target)) continue;
        observer.unobserve(entry.target);
        seen.add(entry.target);
        if (preference.matches || !entry.target.animate) continue;
        const animation = entry.target.animate(
          [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 360, easing: 'cubic-bezier(.2,.65,.3,1)' },
        );
        running.add(animation);
        animation.finished.then(() => running.delete(animation), () => running.delete(animation));
      }
    }, { threshold: .12 });
    const cancelMotion = () => {
      if (!preference.matches) return;
      for (const animation of running) animation.cancel();
      running.clear();
    };
    page.current?.querySelectorAll('[data-eye-reveal]').forEach(element => observer.observe(element));
    preference.addEventListener('change', cancelMotion);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', cancelMotion);
      for (const animation of running) animation.cancel();
    };
  }, []);
  useEffect(() => {
    if (!location.hash) return;
    requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start', behavior: 'instant' }));
  }, []);
  const startBooking = event => {
    event.preventDefault();
    if (location.hash !== '#book-eye-test') history.replaceState(null, '', `${location.pathname}${location.search}#book-eye-test`);
    const target = document.getElementById('book-eye-test');
    target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    target?.focus({ preventScroll: true });
  };
  return <div className="eye-page" ref={page}>
    <nav className="eye-breadcrumb" aria-label="Breadcrumb"><CollectionLink href="/" onNavigate={onNavigate}>Home</CollectionLink><span aria-hidden="true">/</span><span aria-current="page">Book an eye test</span></nav>
    <section className="eye-hero" aria-labelledby="eye-title">
      <div className="eye-hero__copy"><p className="eye-eyebrow">EYE TEST APPOINTMENTS</p><h1 id="eye-title">Book your<br />eye test.</h1><p>Choose a store, select a date and review your appointment details. Start with a city, area or PIN code.</p><a className="eye-button" href="#book-eye-test" onClick={startBooking}>Find a store <EyeIcon name="arrow" /></a><p className="eye-hero__preview"><span>BOOKING PREVIEW</span>Try the booking process. No appointment is reserved.</p></div>
      <figure className="eye-hero__visual"><img src="/assets/eye-test/vision-portrait-1200.webp" srcSet="/assets/eye-test/vision-portrait-640.webp 640w, /assets/eye-test/vision-portrait-1200.webp 1200w" sizes="(max-width: 767px) 100vw, 50vw" width="1200" height="1800" alt="A smiling man holding optical trial frames during an eye examination" fetchPriority="high" decoding="async" /><figcaption><EyeIcon name="eye" /><span>In-store eye tests<br /><strong>Choose your preferred location</strong></span></figcaption></figure>
    </section>

    <section className="eye-journey" aria-label="How the booking preview works">{[
      ['01', 'pin', 'Choose a store', 'Search by city, area or PIN code.'],
      ['02', 'calendar', 'Select a time', 'Choose your preferred date and time.'],
      ['03', 'check', 'Review your visit', 'Check your store and contact details.'],
    ].map(([number, icon, title, text]) => <div key={number}><span className="eye-journey__number">{number}</span><EyeIcon name={icon} /><div><h2>{title}</h2><p>{text}</p></div></div>)}</section>

    <section className="eye-booking" id="book-eye-test" aria-labelledby="eye-booking-title" tabIndex="-1"><div className="eye-section-heading"><div><p className="eye-eyebrow">BOOK AN EYE TEST</p><h2 id="eye-booking-title">Plan your appointment</h2></div><p>{eyeTestStores.length} stores across {storeCities.length} cities.<br />Choose a store to get started.</p></div><div className="eye-preview-banner"><span>PREVIEW</span><p>Locations and times are illustrative. These are not operating CandiClie branches; appointments cannot be reserved yet.</p></div><BookingForm onNavigate={onNavigate} /></section>

    <section className="eye-visit" data-eye-reveal aria-labelledby="eye-visit-title"><figure><div className="eye-visit__photo"><img src="/assets/eye-test/eye-examination-960.webp" srcSet="/assets/eye-test/eye-examination-640.webp 640w, /assets/eye-test/eye-examination-960.webp 960w" sizes="(max-width: 767px) 100vw, 46vw" alt="A woman at a slit-lamp eye examination" width="960" height="641" loading="lazy" decoding="async" /></div><figcaption>An eye examination</figcaption></figure><div className="eye-visit__copy"><p className="eye-eyebrow">BEFORE YOUR VISIT</p><h2 id="eye-visit-title">Preparing for your eye test</h2><p>Keep these details ready for your future appointment.</p><ol><li><span>01</span><div><h3>Current glasses and prescription</h3><p>Bring your everyday glasses and any existing prescription.</p></div></li><li><span>02</span><div><h3>Questions for your visit</h3><p>Note anything you’d like to discuss about reading, work or your lenses.</p></div></li><li><span>03</span><div><h3>Appointment information</h3><p>Confirm the store, services, preparation and any fee when real bookings open.</p></div></li></ol></div></section>

    <section className="eye-faq" data-eye-reveal id="eye-test-questions" aria-labelledby="eye-faq-title"><div><p className="eye-eyebrow">EYE TEST INFORMATION</p><h2 id="eye-faq-title">Common questions</h2><p>About store selection, appointments and the booking preview.</p><a className="eye-text-link" href="#book-eye-test" onClick={startBooking}>View store locations <EyeIcon name="arrow" /></a></div><div className="eye-faq__list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
    <section className="eye-closing" data-eye-reveal><EyeIcon name="eye" /><p>Looking for your next pair?</p><CollectionLink href="/eyewear/eyeglasses" onNavigate={onNavigate}>Browse eyeglasses <EyeIcon name="arrow" /></CollectionLink></section>
  </div>;
}
