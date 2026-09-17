import { db } from '../db/database.js';

/**
 * AGENT 7: AUTHORITY ROUTING & CROSS-DEPARTMENT COORDINATION AGENT
 * Cross-references problem type, infrastructure, and ward jurisdiction against the official department registry.
 * Builds real inter-agency dependency graphs to prevent premature task sign-off.
 */
export class AuthorityRoutingAgent {
  static routeIncident(incident, clusterComplaints = []) {
    const registry = db.getDepartmentRegistry();
    const allText = clusterComplaints.map(c => `${c.title || ''} ${c.descriptionRaw || ''}`).join(' ').toLowerCase();

    // Department match scoring based on registered domain keywords
    const deptScores = registry.map(dept => {
      let score = 0;
      (dept.domains || []).forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi');
        const matches = allText.match(regex);
        if (matches) score += matches.length;
      });
      return { dept, score };
    });

    deptScores.sort((a, b) => b.score - a.score);

    // Primary Lead Department
    const lead = deptScores[0]?.score > 0 ? deptScores[0].dept : registry[0];
    
    // Secondary Participating Departments (if multi-agency impact detected)
    const secondaries = deptScores.filter(ds => ds.score > 0 && ds.dept.id !== lead.id).map(ds => ds.dept);

    const participating = [lead, ...secondaries];

    // Construct Cross-Department Interdependency Matrix & Workflow Graph
    const crossDeptMatrix = this.buildCrossDeptCoordination(lead, secondaries, allText, clusterComplaints.length);

    return {
      leadDepartment: lead.name,
      leadDepartmentId: lead.id,
      participatingDepartments: participating.map(d => d.name),
      crossDeptCoordination: crossDeptMatrix
    };
  }

  static buildCrossDeptCoordination(leadDept, secondaryDepts, allText, complaintCount = 1) {
    const departments = [];

    // 1. Lead Department Action
    if (leadDept.id === 'DJB') {
      departments.push({
        dept: leadDept.name,
        cases: Math.max(1, Math.round(complaintCount * 0.7)),
        icon: 'Droplets',
        badgeColor: '#0E5E3A',
        impactSummary: 'Potable water distribution pressure loss and pipeline integrity hazard.',
        requiredAction: 'Isolate feeder valve, locate breach with acoustic correlation, and replace defective line segment',
        dependency: 'NONE',
        status: 'IN_PROGRESS'
      });
    } else if (leadDept.id === 'PWD') {
      departments.push({
        dept: leadDept.name,
        cases: Math.max(1, Math.round(complaintCount * 0.6)),
        icon: 'Wrench',
        badgeColor: '#D97706',
        impactSummary: 'Arterial carriageway pavement depression and structural vehicular hazard.',
        requiredAction: 'Excavate failing road segment, reinforce crushed stone subgrade, and lay bituminous asphalt layer',
        dependency: 'NONE',
        status: 'IN_PROGRESS'
      });
    } else if (leadDept.id === 'MCD') {
      departments.push({
        dept: leadDept.name,
        cases: Math.max(1, Math.round(complaintCount * 0.8)),
        icon: 'Building2',
        badgeColor: '#7C3AED',
        impactSummary: 'Stormwater culvert inundation and persistent surface runoff accumulation.',
        requiredAction: 'Deploy high-velocity jetting machines, desilt silt trap chambers, and restore curb drainage gradient',
        dependency: 'NONE',
        status: 'IN_PROGRESS'
      });
    } else {
      departments.push({
        dept: leadDept.name,
        cases: complaintCount,
        icon: 'Building2',
        badgeColor: '#2563EB',
        impactSummary: 'Primary utility service disruption.',
        requiredAction: 'Deploy emergency maintenance team and restore baseline service',
        dependency: 'NONE',
        status: 'IN_PROGRESS'
      });
    }

    // 2. Secondary Interlocking Dependencies
    secondaryDepts.forEach(sec => {
      if (sec.id === 'PWD') {
        departments.push({
          dept: sec.name,
          cases: Math.max(1, Math.round(complaintCount * 0.4)),
          icon: 'Wrench',
          badgeColor: '#D97706',
          impactSummary: 'Sub-base soil erosion beneath carriageway caused by water leakage.',
          requiredAction: 'Compact gravel subgrade and repave asphalt surface only after underground pipeline certification',
          dependency: `${leadDept.name} certified pressure test & backfill sign-off required`,
          status: 'PENDING_DEPENDENCY'
        });
      } else if (sec.id === 'MCD') {
        departments.push({
          dept: sec.name,
          cases: Math.max(1, Math.round(complaintCount * 0.3)),
          icon: 'Building2',
          badgeColor: '#7C3AED',
          impactSummary: 'Sediment and drainage silt accumulation along corridor.',
          requiredAction: 'Flush roadside culvert and clear silt trap barriers',
          dependency: 'NONE',
          status: 'IN_PROGRESS'
        });
      } else if (sec.id === 'DJB') {
        departments.push({
          dept: sec.name,
          cases: Math.max(1, Math.round(complaintCount * 0.3)),
          icon: 'Droplets',
          badgeColor: '#0E5E3A',
          impactSummary: 'Utility line verification beneath road corridor.',
          requiredAction: 'Verify underground water mains before mechanical heavy roller compaction',
          dependency: 'NONE',
          status: 'IN_PROGRESS'
        });
      }
    });

    const sharedSummary = departments.length > 1
      ? `Multi-agency civic impact spanning ${departments.length} authorities: ${departments.map(d => d.dept.split(' ')[0]).join(' + ')}. Inter-department work order sequence initiated.`
      : `${leadDept.name} dedicated single-agency infrastructure work order.`;

    const recommendation = departments.length > 1
      ? `Unified Joint Action: ${departments[0].dept} executes primary intervention; dependent agencies hold mechanical operations until prerequisite work order verification is submitted.`
      : `${leadDept.name} dispatch authorized for immediate on-ground remediation.`;

    return {
      primaryDepartment: leadDept.name,
      sharedProblemSummary: sharedSummary,
      departments,
      coordinationRecommendation: recommendation
    };
  }
}
