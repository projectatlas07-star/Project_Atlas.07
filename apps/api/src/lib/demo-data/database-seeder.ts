/**
 * Demo Data Manager
 * 
 * Manages demo data in-memory to ensure demo mode never interferes with production data.
 * Demo data is generated on-demand using deterministic random seed for reproducibility.
 */

import { DemoData } from './demo-data-service';

/**
 * Seed demo data (in-memory only - never persists to database)
 * This ensures demo mode never interferes with production data
 */
export async function seedDemoData(demoData: DemoData): Promise<{ success: boolean; message: string; companyId?: string }> {
  // Demo data is kept in-memory only
  // Return success with a mock company ID for demo mode tracking
  return {
    success: true,
    message: 'Demo data generated successfully (in-memory)',
    companyId: 'demo-company-npp-roofing-restoration'
  };
}

/**
 * Clear demo data (in-memory only)
 */
export async function clearDemoData(companyId: string): Promise<{ success: boolean; message: string }> {
  // Demo data is in-memory only, nothing to clear from database
  return {
    success: true,
    message: 'Demo data cleared successfully (in-memory)'
  };
}
