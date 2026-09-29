/**
 * Server data layer re-exporting canonical data sets
 */
import { INITIAL_GRIEVANCES, MOCK_CLUSTERS, SYSTEM_METRICS, INITIAL_NOTIFICATIONS } from '../src/data/mockGrievances.js';

export const defaultGrievances = INITIAL_GRIEVANCES;
export const clusters = MOCK_CLUSTERS;
export const metrics = SYSTEM_METRICS;
export const notifications = INITIAL_NOTIFICATIONS;

export const departments = [
  'Delhi Jal Board (DJB)',
  'Public Works Department (PWD)',
  'BSES Rajdhani Power Limited',
  'Municipal Corporation of Delhi (MCD)'
];
