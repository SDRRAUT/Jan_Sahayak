/**
 * FARE ESTIMATION SERVICE: Dynamic, Intelligent Civic Technician & Worker Fare Engine
 * Calculates fair, transparent estimates based on category, duration, travel distance, urgency and experience.
 */

import { WORKER_CATEGORIES } from '../data/mockWorkers.js';

export const WAGHOLI_WARD_DISTANCES = {
  'Ward 28 - Ivy Estate / Pune-Nagar Hwy': {
    'Ward 28 - Ivy Estate / Pune-Nagar Hwy': 0.8,
    'Ward 29 - Wagholi Gaothan': 1.6,
    'Ward 30 - Bakori Road & Forest Area': 2.4,
    'Ward 31 - Kesnand Phata & Industrial Area': 3.1
  },
  'Ward 29 - Wagholi Gaothan': {
    'Ward 28 - Ivy Estate / Pune-Nagar Hwy': 1.6,
    'Ward 29 - Wagholi Gaothan': 0.6,
    'Ward 30 - Bakori Road & Forest Area': 2.0,
    'Ward 31 - Kesnand Phata & Industrial Area': 2.2
  },
  'Ward 30 - Bakori Road & Forest Area': {
    'Ward 28 - Ivy Estate / Pune-Nagar Hwy': 2.4,
    'Ward 29 - Wagholi Gaothan': 2.0,
    'Ward 30 - Bakori Road & Forest Area': 0.7,
    'Ward 31 - Kesnand Phata & Industrial Area': 3.5
  },
  'Ward 31 - Kesnand Phata & Industrial Area': {
    'Ward 28 - Ivy Estate / Pune-Nagar Hwy': 3.1,
    'Ward 29 - Wagholi Gaothan': 2.2,
    'Ward 30 - Bakori Road & Forest Area': 3.5,
    'Ward 31 - Kesnand Phata & Industrial Area': 0.9
  }
};

export function calculateEstimatedFare(options = {}) {
  const {
    worker,
    categoryId = worker?.category || 'plumbing',
    durationHours = 2,
    distanceKm = 1.0,
    urgency = 'MEDIUM', // 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'CRITICAL_EMERGENCY' | 'URGENT' | 'NORMAL'
    experienceYears = worker?.experienceYears || 5,
    isGovtRequest = options.isInstitutional || false,
    dayOfWeek = new Date().getDay(), // 0 = Sunday
    hourOfDay = new Date().getHours()
  } = options;

  const normalizedUrgency = urgency === 'CRITICAL_EMERGENCY' ? 'CRITICAL' : (urgency === 'URGENT' ? 'HIGH' : (urgency === 'NORMAL' ? 'MEDIUM' : urgency));

  // 1. Base category pricing
  const cat = WORKER_CATEGORIES.find(c => c.id === categoryId) || WORKER_CATEGORIES[0];
  const baseRate = cat.baseRate || 300;
  const hourlyRate = cat.hourlyRate || 140;

  // 2. Duration factor (first hour covered by base rate, additional hours at hourly rate)
  const duration = Math.max(1, Number(durationHours) || 1);
  const additionalHours = Math.max(0, duration - 1);
  const durationCharge = Math.round(additionalHours * hourlyRate);

  // 3. Distance & Travel Logistics (First 2 km free; +₹25 per km beyond)
  const dist = Math.max(0, Number(distanceKm) || 0);
  const excessKm = Math.max(0, dist - 2.0);
  const travelCharge = Math.round(excessKm * 25);

  // 4. Urgency Surcharge
  let urgencyMultiplier = 0;
  if (normalizedUrgency === 'CRITICAL') {
    urgencyMultiplier = 0.25; // +25% Emergency Response
  } else if (normalizedUrgency === 'HIGH') {
    urgencyMultiplier = 0.15; // +15% Priority Dispatch
  } else if (normalizedUrgency === 'LOW') {
    urgencyMultiplier = -0.05; // -5% Off-peak / Flexible
  }
  const subtotalBeforeSurge = baseRate + durationCharge + travelCharge;
  const urgencyCharge = Math.round(subtotalBeforeSurge * urgencyMultiplier);

  // 5. Senior Craftsman / Experience Surcharge (+10% for 8+ years)
  let experienceCharge = 0;
  if (experienceYears >= 8) {
    experienceCharge = Math.round(subtotalBeforeSurge * 0.10);
  } else if (experienceYears >= 5) {
    experienceCharge = Math.round(subtotalBeforeSurge * 0.05);
  }

  // 6. Time of Day / Weekend Surge (+10% for late night or Sunday)
  let timeSurge = 0;
  const isNight = hourOfDay >= 20 || hourOfDay < 7;
  const isSunday = dayOfWeek === 0;
  if (isNight || isSunday) {
    timeSurge = Math.round(subtotalBeforeSurge * 0.10);
  }

  // 7. Municipal Institutional Discount for Government Dispatches (-10% negotiated bulk rate)
  let institutionalDiscount = 0;
  if (isGovtRequest) {
    institutionalDiscount = Math.round(subtotalBeforeSurge * 0.10);
  }

  // Total calculation
  const total = Math.max(
    baseRate,
    Math.round(subtotalBeforeSurge + urgencyCharge + experienceCharge + timeSurge - institutionalDiscount)
  );

  return {
    categoryName: cat.name,
    baseRate,
    durationHours: duration,
    durationCharge,
    distanceKm: dist,
    travelCharge,
    urgency,
    urgencyCharge,
    experienceYears,
    experienceCharge,
    timeSurge,
    institutionalDiscount,
    isGovtRequest,
    totalEstimatedFare: total,
    currency: '₹',
    breakdownText: [
      `Base Inspection & First Hour: ₹${baseRate}`,
      additionalHours > 0 ? `Additional ${additionalHours} hr(s) @ ₹${hourlyRate}/hr: ₹${durationCharge}` : null,
      travelCharge > 0 ? `Travel Logistics (${excessKm.toFixed(1)} km excess): ₹${travelCharge}` : 'Standard Local Travel: Included',
      urgencyCharge !== 0 ? `${urgency} Urgency Dispatch: ${urgencyCharge > 0 ? '+' : ''}₹${urgencyCharge}` : null,
      experienceCharge > 0 ? `Master Technician (${experienceYears} yrs): +₹${experienceCharge}` : null,
      institutionalDiscount > 0 ? `PMC Municipal Contract Rate (-10%): -₹${institutionalDiscount}` : null
    ].filter(Boolean)
  };
}
