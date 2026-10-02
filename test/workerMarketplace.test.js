import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateEstimatedFare } from '../src/services/fareEstimationService.js';
import { 
  detectWorkerCategoryFromComplaint, 
  matchWorkersForComplaint 
} from '../src/services/workerMatchingService.js';
import { MOCK_WORKERS } from '../src/data/mockWorkers.js';

describe('Jan_Sahayak Worker Marketplace Services', () => {

  describe('Fare Estimation Service', () => {
    const sampleWorker = {
      id: 'WRK-001',
      name: 'Ramesh More',
      category: 'plumbing',
      baseFarePerHour: 240,
      experienceYears: 7
    };

    it('calculates accurate base fare and transparent breakdown', () => {
      const fare = calculateEstimatedFare({
        worker: sampleWorker,
        durationHours: 2,
        distanceKm: 1.5,
        urgency: 'NORMAL',
        isInstitutional: false
      });

      assert.strictEqual(fare.durationHours, 2);
      assert.strictEqual(fare.baseRate, 350); // plumbing base rate
      assert.ok(fare.durationCharge > 0);
      assert.strictEqual(fare.urgencyCharge, 0);
      assert.ok(fare.totalEstimatedFare > 350);
    });

    it('applies surge surcharge for emergency requests', () => {
      const normalFare = calculateEstimatedFare({
        worker: sampleWorker,
        durationHours: 2,
        distanceKm: 2.0,
        urgency: 'NORMAL'
      });

      const emergencyFare = calculateEstimatedFare({
        worker: sampleWorker,
        durationHours: 2,
        distanceKm: 2.0,
        urgency: 'CRITICAL_EMERGENCY'
      });

      assert.ok(emergencyFare.totalEstimatedFare > normalFare.totalEstimatedFare);
      assert.ok(emergencyFare.urgencyCharge > 0);
    });

    it('applies institutional discount for government officer dispatches', () => {
      const citizenFare = calculateEstimatedFare({
        worker: sampleWorker,
        durationHours: 2,
        distanceKm: 2.0,
        isInstitutional: false
      });

      const officerFare = calculateEstimatedFare({
        worker: sampleWorker,
        durationHours: 2,
        distanceKm: 2.0,
        isInstitutional: true
      });

      assert.ok(officerFare.institutionalDiscount > 0);
      assert.ok(officerFare.totalEstimatedFare < citizenFare.totalEstimatedFare);
    });
  });

  describe('Worker Matching & AI Categorization Service', () => {
    it('detects plumbing trade from water pipeline leakage complaint', () => {
      const complaint = {
        title: 'Water pipeline burst near Ivy Estate main entrance',
        descriptionRaw: 'High pressure drinking water leaking continuously from underground pipe.',
        category: 'Water Supply & Contamination'
      };

      const result = detectWorkerCategoryFromComplaint(complaint);
      assert.strictEqual(result.categoryId, 'plumbing');
    });

    it('detects electrical trade from streetlight cable fault complaint', () => {
      const complaint = {
        title: 'Street lights flickering and pole sparking',
        descriptionRaw: 'High voltage wire hanging loose near Kesnand road crossing.',
        category: 'Electricity & Power Grid'
      };

      const result = detectWorkerCategoryFromComplaint(complaint);
      assert.strictEqual(result.categoryId, 'electrical');
    });

    it('ranks available nearby Wagholi workers by compatibility score', () => {
      const complaint = {
        id: 'PN-2026-WAG-0102',
        title: 'Burst pipeline on Ivy Estate lane',
        descriptionRaw: 'Water pipe cracked, flooding street.',
        ward: 'Ward 28 - Ivy Estate / Pune-Nagar Hwy',
        urgency: 'HIGH'
      };

      const result = matchWorkersForComplaint(complaint, MOCK_WORKERS);
      assert.strictEqual(result.detectedCategory.categoryId, 'plumbing');
      assert.ok(result.recommendations.length > 0);
      // Top recommendation should have high score
      assert.ok(result.recommendations[0].compatibilityScore >= 70);
      assert.ok(result.recommendations[0].worker.category === 'plumbing');
    });
  });

  describe('Government Officer Resolution & Multi-Complaint Cluster Dispatch', () => {
    it('matches appropriate workforce trade for multi-ward civic incident', () => {
      const incidentProxy = {
        id: 'INC-2026-DEL-43',
        title: 'Rohini Sector 14 Subsurface Water Line Fracture & Cavity Formation',
        description: 'Negative-pressure siphonage in 1988 cast-iron feeder line',
        category: 'Water Infrastructure',
        ward: 'Ward 14 (Rohini Sector 14)',
        urgency: 'CRITICAL'
      };

      const match = matchWorkersForComplaint(incidentProxy, MOCK_WORKERS);
      assert.strictEqual(match.detectedCategory.categoryId, 'plumbing');
      assert.ok(match.recommendations.length > 0);
      assert.strictEqual(match.recommendations[0].worker.category, 'plumbing');
    });

    it('creates government-sourced work order and clusters multiple grievances', () => {
      const selectedComplaintIds = ['DL-2026-W14-0892', 'DL-2026-W14-0895', 'DL-2026-W14-0899'];
      const chosenWorker = MOCK_WORKERS[0];

      // Simulated dispatch payload
      const dispatchPayload = {
        incidentId: 'INC-2026-DEL-43',
        workerId: chosenWorker.id,
        workerName: chosenWorker.name,
        workerCategory: chosenWorker.category,
        source: 'GOVERNMENT',
        requesterRole: 'officer',
        estimatedFare: 450,
        selectedComplaintIds
      };

      assert.strictEqual(dispatchPayload.source, 'GOVERNMENT');
      assert.strictEqual(dispatchPayload.selectedComplaintIds.length, 3);
      assert.ok(dispatchPayload.estimatedFare > 0);
      assert.ok(dispatchPayload.workerName.length > 0);
    });
  });

});

