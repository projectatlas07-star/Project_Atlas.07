/**
 * Demo Company Profile
 * 
 * NPP Roofing & Restoration - The demo company for Project Atlas
 */

import { demoRandom } from '../deterministic-random';
import { createUserSeed } from './seed-factories';

export interface DemoCompany {
  id: string;
  name: string;
  legalName: string;
  logo: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  email: string;
  website: string;
  licenseNumber: string;
  insuranceNumber: string;
  establishedYear: number;
  description: string;
  services: string[];
  serviceAreas: string[];
  createdAt: Date;
}

export interface DemoTeam {
  id: string;
  name: string;
  description: string;
  leadId: string;
  memberIds: string[];
  createdAt: Date;
}

/**
 * Create the NPP Roofing & Restoration company profile
 */
export function createDemoCompany(): DemoCompany {
  return {
    id: demoRandom.nextUuid(),
    name: 'NPP Roofing & Restoration',
    legalName: 'NPP Roofing & Restoration, LLC',
    logo: '/brand/logo-horizontal.svg',
    address: {
      street: '2500 Dallas Parkway',
      city: 'Plano',
      state: 'TX',
      zip: '75093'
    },
    phone: '(469) 555-0100',
    email: 'info@npproofing.com',
    website: 'https://www.npproofing.com',
    licenseNumber: 'RCL-123456',
    insuranceNumber: 'INS-789012',
    establishedYear: 2015,
    description: 'Premier roofing and restoration contractor serving Texas and Florida. Specializing in residential and commercial storm damage restoration with over 500 successful claims processed.',
    services: [
      'Residential Roof Replacement',
      'Commercial Roofing',
      'Storm Damage Restoration',
      'Water Damage Mitigation',
      'Fire Damage Restoration',
      'Insurance Claim Assistance',
      'Free Roof Inspections',
      'Emergency Repairs'
    ],
    serviceAreas: [
      'Plano, TX',
      'Dallas, TX',
      'Fort Worth, TX',
      'Austin, TX',
      'Houston, TX',
      'Orlando, FL',
      'Jacksonville, FL',
      'Miami, FL',
      'Tampa, FL'
    ],
    createdAt: new Date('2015-01-15')
  };
}

/**
 * Create demo teams for NPP Roofing
 */
export function createDemoTeams(users: any[]): DemoTeam[] {
  const salesUsers = users.filter(u => u.role === 'Sales Representative');
  const inspectionUsers = users.filter(u => u.role === 'Roof Inspector');
  const estimatingUsers = users.filter(u => u.role === 'Estimator');
  const projectUsers = users.filter(u => u.role === 'Project Manager');
  const officeUsers = users.filter(u => u.role === 'Office Staff');

  return [
    {
      id: demoRandom.nextUuid(),
      name: 'Sales Team',
      description: 'Lead generation and customer acquisition',
      leadId: salesUsers[0]?.id || users[0].id,
      memberIds: salesUsers.map(u => u.id),
      createdAt: new Date('2023-01-01')
    },
    {
      id: demoRandom.nextUuid(),
      name: 'Inspection Team',
      description: 'Roof inspections and damage assessment',
      leadId: inspectionUsers[0]?.id || users[1].id,
      memberIds: inspectionUsers.map(u => u.id),
      createdAt: new Date('2023-01-01')
    },
    {
      id: demoRandom.nextUuid(),
      name: 'Estimating Team',
      description: 'Insurance estimates and supplement preparation',
      leadId: estimatingUsers[0]?.id || users[2].id,
      memberIds: estimatingUsers.map(u => u.id),
      createdAt: new Date('2023-01-01')
    },
    {
      id: demoRandom.nextUuid(),
      name: 'Project Management',
      description: 'Project coordination and execution',
      leadId: projectUsers[0]?.id || users[3].id,
      memberIds: projectUsers.map(u => u.id),
      createdAt: new Date('2023-01-01')
    },
    {
      id: demoRandom.nextUuid(),
      name: 'Office Staff',
      description: 'Administrative support and customer service',
      leadId: officeUsers[0]?.id || users[4].id,
      memberIds: officeUsers.map(u => u.id),
      createdAt: new Date('2023-01-01')
    }
  ];
}

/**
 * Create demo users for NPP Roofing
 */
export function createDemoUsers(count: number = 12): any[] {
  const roleDistribution = [
    { role: 'Sales Representative', count: 2 },
    { role: 'Roof Inspector', count: 3 },
    { role: 'Estimator', count: 2 },
    { role: 'Project Manager', count: 2 },
    { role: 'Office Staff', count: 2 },
    { role: 'Administrator', count: 1 }
  ];

  const users: any[] = [];
  let userIndex = 0;

  roleDistribution.forEach(({ role, count: roleCount }) => {
    for (let i = 0; i < roleCount; i++) {
      users.push({
        ...createUserSeed(userIndex, role),
        password: 'demo123', // Demo password
        isActive: true
      });
      userIndex++;
    }
  });

  return users;
}
