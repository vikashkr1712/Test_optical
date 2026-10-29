import { getEyeTestStore } from './eyeTestStores.js';

// All dates and example times belong to the Indian store timezone.
export const bookingTimeZone = 'Asia/Kolkata';
export const visitReasons = ['Routine eye test', 'First eye test', 'Review my prescription', 'Contact lens guidance'];
export const bookingSteps = ['Location', 'Date & time', 'Your details', 'Review'];

export function indiaDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: bookingTimeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  return ['year', 'month', 'day'].map(key => parts.find(part => part.type === key).value).join('-');
}

export function addDays(date, days) {
  const value = new Date(`${date}T12:00:00+05:30`);
  value.setUTCDate(value.getUTCDate() + days);
  return indiaDate(value);
}

export function formatVisitDate(date, options = {}) {
  if (!date) return 'Choose a date';
  return new Intl.DateTimeFormat('en-IN', { timeZone: bookingTimeZone, weekday: 'short', day: 'numeric', month: 'short', ...options }).format(new Date(`${date}T12:00:00+05:30`));
}

export function formatVisitTime(time) {
  const [hour, minute] = time.split(':').map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function isCalendarDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T12:00:00+05:30`);
  return !Number.isNaN(parsed.getTime()) && indiaDate(parsed) === date;
}

export function exampleTimes(date, now = new Date()) {
  const today = indiaDate(now);
  if (!isCalendarDate(date) || date < today || date > addDays(today, 30)) return [];
  return ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'].filter(time => new Date(`${date}T${time}:00+05:30`).getTime() > now.getTime() + 60 * 60 * 1000);
}

export const emptyBooking = () => ({ storeId: '', date: '', time: '', name: '', phone: '', email: '', reason: visitReasons[0], consent: false });

export function validateBookingStep(step, booking, now = new Date()) {
  const errors = {};
  if (step === 0) {
    if (!getEyeTestStore(booking.storeId)) errors.storeId = 'Choose a store using its Book appointment button.';
  }
  if (step === 1) {
    const today = indiaDate(now);
    if (!isCalendarDate(booking.date) || booking.date < today || booking.date > addDays(today, 30)) errors.date = 'Choose a date within the next 30 days.';
    else if (!exampleTimes(booking.date, now).includes(booking.time)) errors.time = 'Choose a future example time. All times are in IST.';
  }
  if (step === 2) {
    if (booking.name.trim().length < 2) errors.name = 'Enter a name with at least two characters.';
    if (!/^[6-9]\d{9}$/.test(booking.phone.replace(/[\s-]/g, ''))) errors.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (booking.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email.trim())) errors.email = 'Enter a valid email address, or leave this blank.';
    if (!booking.consent) errors.consent = 'Please acknowledge that this is a booking preview.';
  }
  return errors;
}
