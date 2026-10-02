/**
 * WORKER MATCHING SERVICE: Intelligent Civic Technician Match & Recommendation Engine
 * Connects complaints and citizen requests with qualified, nearby, verified workers.
 */

import { INITIAL_WORKERS, WORKER_CATEGORIES } from '../data/mockWorkers.js';

/**
 * Detects the most appropriate worker category for a given complaint or text description
 */
export function detectWorkerCategoryFromComplaint(complaint = {}) {
  const text = `${complaint.title || ''} ${complaint.descriptionRaw || ''} ${complaint.description || ''} ${complaint.category || ''} ${complaint.department || ''}`.toLowerCase();

  if (
    text.includes('water') || 
    text.includes('pipe') || 
    text.includes('leak') || 
    text.includes('paani') || 
    text.includes('tap') || 
    text.includes('valve') || 
    text.includes('tank') ||
    text.includes('जल')
  ) {
    return {
      categoryId: 'plumbing',
      categoryName: 'Plumbing & Water Supply',
      suggestedTrade: 'Trunkline Plumber / Pipe Technician',
      confidence: 96,
      reason: 'Detected potable water pipe fracture, valve issue or drinking water supply pressure deficit.'
    };
  }

  if (
    text.includes('electric') || 
    text.includes('power') || 
    text.includes('spark') || 
    text.includes('transformer') || 
    text.includes('bijli') || 
    text.includes('wire') || 
    text.includes('voltage') || 
    text.includes('light') ||
    text.includes('arc')
  ) {
    return {
      categoryId: 'electrical',
      categoryName: 'Electrical & Power Works',
      suggestedTrade: 'Certified High-Voltage Wireman / Electrician',
      confidence: 98,
      reason: 'Detected active electrical hazard, distribution transformer sparking or power line defect.'
    };
  }

  if (
    text.includes('garbage') || 
    text.includes('kooda') || 
    text.includes('waste') || 
    text.includes('dump') || 
    text.includes('safai') || 
    text.includes('trash') ||
    text.includes('smell') ||
    text.includes('dumper')
  ) {
    return {
      categoryId: 'sanitation',
      categoryName: 'Sanitation & Waste Clearing',
      suggestedTrade: 'Sanitation Inspector & Waste Compactor Crew',
      confidence: 97,
      reason: 'Detected uncollected solid waste accumulation, open dumping or market sanitation backlog.'
    };
  }

  if (
    text.includes('road') || 
    text.includes('pothole') || 
    text.includes('gaddha') || 
    text.includes('asphalt') || 
    text.includes('sadak') || 
    text.includes('curb') ||
    text.includes('paving') ||
    text.includes('crack')
  ) {
    return {
      categoryId: 'masonry',
      categoryName: 'Road & Masonry Repair',
      suggestedTrade: 'Road Surface Mason / Cold Mix Asphalt Specialist',
      confidence: 95,
      reason: 'Detected vehicular pavement cavity, dangerous pothole or damaged pedestrian curb.'
    };
  }

  if (
    text.includes('drain') || 
    text.includes('sewer') || 
    text.includes('manhole') || 
    text.includes('choke') || 
    text.includes('backflow') || 
    text.includes('gutter') ||
    text.includes('naali')
  ) {
    return {
      categoryId: 'drainage',
      categoryName: 'Drainage & Suction Jetting',
      suggestedTrade: 'High-Pressure Suction Jetting & Desilting Operator',
      confidence: 96,
      reason: 'Detected underground sewer blockage, overflowing manhole or stormwater culvert siltation.'
    };
  }

  return {
    categoryId: 'carpentry',
    categoryName: 'Carpentry & Metal Fabrication',
    suggestedTrade: 'Civic Infrastructure Technician & Welder',
    confidence: 88,
    reason: 'Detected structural civic fixture repair or general maintenance requirement.'
  };
}

/**
 * Recommends and ranks workers for a specific complaint or citizen booking requirement
 */
export function matchWorkersForComplaint(complaint = {}, allWorkers = INITIAL_WORKERS) {
  const detected = detectWorkerCategoryFromComplaint(complaint);
  const complaintWard = (complaint.location?.ward || '').toLowerCase();

  const scoredWorkers = allWorkers.map(worker => {
    let score = 50; // base score

    // 1. Category match (weight: 35 pts)
    const isExactCategory = worker.category === detected.categoryId;
    if (isExactCategory) {
      score += 35;
    } else {
      score += 5;
    }

    // 2. Proximity & Ward alignment (weight: 25 pts)
    const workerWard = (worker.ward || '').toLowerCase();
    const isSameWard = complaintWard && (
      workerWard.includes(complaintWard.split(' ')[0]) || 
      complaintWard.includes(workerWard.split(' ')[0])
    );
    if (isSameWard) {
      score += 25;
    } else if (worker.distanceKm <= 1.5) {
      score += 20;
    } else if (worker.distanceKm <= 3.0) {
      score += 10;
    }

    // 3. Availability (weight: 20 pts)
    if (worker.availability === 'AVAILABLE') {
      score += 20;
    } else if (worker.availability === 'BUSY') {
      score += 5;
    } else {
      score -= 10;
    }

    // 4. Rating & Experience (weight: 15 pts)
    if (worker.rating >= 4.8) score += 10;
    else if (worker.rating >= 4.5) score += 7;

    if (worker.experienceYears >= 8) score += 5;
    else if (worker.experienceYears >= 5) score += 3;

    if (worker.verificationStatus === 'VERIFIED_GOV_SKILL') score += 5;

    return {
      ...worker,
      matchScore: Math.min(99, Math.round(score)),
      isExactCategory,
      isPrimaryRecommendation: isExactCategory && worker.availability === 'AVAILABLE'
    };
  });

  // Sort descending by matchScore
  scoredWorkers.sort((a, b) => b.matchScore - a.matchScore);

  const catConfig = WORKER_CATEGORIES.find(c => c.id === detected.categoryId) || WORKER_CATEGORIES[0];
  const recommendations = scoredWorkers.map(w => ({
    worker: w,
    compatibilityScore: w.matchScore,
    distanceKm: w.distanceKm || 1.2,
    isAvailable: w.availability === 'AVAILABLE',
    estimatedFare: Math.round((w.baseFare || 300) * 0.9)
  }));

  return {
    detectedCategory: detected,
    categoryConfig: catConfig,
    rationale: detected.reason,
    recommendations,
    suggestedWorkers: scoredWorkers
  };
}
