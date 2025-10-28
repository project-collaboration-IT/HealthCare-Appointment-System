import { db } from '../firebase';
import { doc, getDoc, setDoc, runTransaction } from 'firebase/firestore';

export const formatDateId = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getAvailabilityDocRef = (date) => {
  const id = formatDateId(date);
  return doc(db, 'availability', id);
};

const normalizeTimeKey = (timeLabel) => {
  // e.g. '8:30 AM' -> '08-30-AM'
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(timeLabel);
  if (!match) return timeLabel.replace(/\s+/g, '-');
  const hour = String(parseInt(match[1], 10)).padStart(2, '0');
  const minute = match[2];
  const period = match[3].toUpperCase();
  return `${hour}-${minute}-${period}`;
};

export const ensureDayTimes = async (date, timeSlots) => {
  const ref = getAvailabilityDocRef(date);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const times = {};
    (timeSlots || []).forEach(t => { times[normalizeTimeKey(t)] = 5; });
    await setDoc(ref, { times, updatedAt: new Date().toISOString() });
    return times;
  }
  const data = snap.data() || {};
  const times = data.times || {};
  let mutated = false;
  (timeSlots || []).forEach(t => {
    const key = normalizeTimeKey(t);
    if (typeof times[key] !== 'number') { times[key] = 5; mutated = true; }
  });
  if (mutated) {
    await setDoc(ref, { ...data, times, updatedAt: new Date().toISOString() });
  }
  return times;
};

export const getTimeRemaining = async (date, timeLabel) => {
  const ref = getAvailabilityDocRef(date);
  const snap = await getDoc(ref);
  if (!snap.exists()) return 5;
  const data = snap.data() || {};
  const times = data.times || {};
  const key = normalizeTimeKey(timeLabel);
  const val = times[key];
  return typeof val === 'number' ? Math.max(0, Math.min(5, val)) : 5;
};

export const getAllTimesRemaining = async (date, timeSlots) => {
  const times = await ensureDayTimes(date, timeSlots);
  return times;
};

export const getDailyTotalRemaining = async (date, timeSlots) => {
  const times = await ensureDayTimes(date, timeSlots);
  return Object.values(times).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
};

export const decrementTimeRemaining = async (date, timeLabel) => {
  const ref = getAvailabilityDocRef(date);
  const key = normalizeTimeKey(timeLabel);
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) {
      const times = { [key]: 4 };
      transaction.set(ref, { times, updatedAt: new Date().toISOString() });
    } else {
      const data = snap.data() || {};
      const times = { ...(data.times || {}) };
      const current = typeof times[key] === 'number' ? times[key] : 5;
      times[key] = Math.max(0, current - 1);
      transaction.update(ref, { times, updatedAt: new Date().toISOString() });
    }
  });
};

export const incrementTimeRemaining = async (date, timeLabel) => {
  const ref = getAvailabilityDocRef(date);
  const key = normalizeTimeKey(timeLabel);
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) {
      const times = { [key]: 5 };
      transaction.set(ref, { times, updatedAt: new Date().toISOString() });
    } else {
      const data = snap.data() || {};
      const times = { ...(data.times || {}) };
      const current = typeof times[key] === 'number' ? times[key] : 5;
      times[key] = Math.min(5, current + 1);
      transaction.update(ref, { times, updatedAt: new Date().toISOString() });
    }
  });
};


