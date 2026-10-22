import { useEffect, useRef, useState } from 'react';
import './SignInDialog.css';

export default function SignInDialog({ open, onClose, intent = 'profile' }) {
  const dialog = useRef(null);
  const [mode, setMode] = useState('signin');
  const [contact, setContact] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (!open) return;
    const modal = dialog.current;
    setMode('signin'); setContact(''); setName(''); setMessage(''); setError('');
    const previousOverflow = document.body.style.overflow;
    modal.showModal();
    document.body.style.overflow = 'hidden';
    return () => { modal.close(); document.body.style.overflow = previousOverflow; };
  }, [open]);
  const switchMode = () => { setMode(value => value === 'signin' ? 'create' : 'signin'); setError(''); setMessage(''); };
  const requestCode = event => {
    event.preventDefault();
    const value = contact.trim();
    const digits = value.replace(/[\s()+-]/g, '');
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{10,15}$/.test(digits);
    setMessage('');
    if (!valid) { setError('Enter a valid email address or a mobile number with 10–15 digits.'); dialog.current.querySelector('#account-contact')?.focus(); return; }
    setError('');
    setMessage('Account verification is not available yet. No code has been sent. Please try again when sign-in launches.');
  };
  return <dialog id="account-dialog" className="account-dialog" ref={dialog} aria-labelledby="account-title" onKeyDown={event => {
    if (event.key !== 'Tab') return;
    const controls = [...event.currentTarget.querySelectorAll('button:not(:disabled), input:not(:disabled)')];
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.target === event.currentTarget && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) onClose();
  }}>
    {open && <div className="account-dialog__content">
      <button type="button" className="account-dialog__close" aria-label="Close sign in" onClick={onClose} autoFocus>×</button>
      <div className="account-dialog__logo"><img src="/assets/candiclie/logo.png" width="200" height="200" alt="CandiClie" /></div>
      <p className="account-dialog__eyebrow">YOUR CANDICLIE</p>
      <h2 id="account-title">{mode === 'create' ? 'A fresh start. A new perspective.' : 'Good to see you again.'}</h2>
      <p className="account-dialog__intro">{mode === 'create' ? 'Create your space for favourite frames and future orders.' : intent === 'orders' ? 'Sign in to find your orders, all in one place.' : 'Sign in for your favourites, your orders and a little more you.'}</p>
      <p className="account-dialog__switch">{mode === 'create' ? 'Already part of CandiClie?' : 'New to CandiClie?'} <button type="button" onClick={switchMode}>{mode === 'create' ? 'Sign in' : 'Create an account'} <span aria-hidden="true">↗</span></button></p>
      <form className="account-form" onSubmit={requestCode}>
        {mode === 'create' && <div className="account-form__field"><label htmlFor="account-name">Your name</label><input id="account-name" value={name} onChange={event => setName(event.target.value)} autoComplete="name" maxLength={80} placeholder="First and last name" required /></div>}
        <div className="account-form__field"><label htmlFor="account-contact">Email address or mobile number</label><input id="account-contact" type="text" value={contact} onChange={event => { setContact(event.target.value); setError(''); setMessage(''); }} autoComplete="username" maxLength={254} placeholder="Enter your email or mobile number" required aria-invalid={Boolean(error)} aria-describedby={error ? 'account-error' : 'account-availability'} />{error && <p id="account-error" className="account-form__error" role="alert">{error}</p>}</div>
        <button className="account-form__submit" type="submit">Request a sign-in code <span aria-hidden="true">→</span></button>
        <p id="account-availability" className="account-form__availability">Account sign-in is coming soon.</p>
        {message && <p className="account-form__message" role="status">{message}</p>}
      </form>
      <p className="account-dialog__footnote">A clearer view starts with you.</p>
    </div>}
  </dialog>;
}
