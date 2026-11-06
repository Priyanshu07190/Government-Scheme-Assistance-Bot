import { ApplicationTrackRecord } from '../types';

export interface UserSavedApplication {
  applicationId: string;
  schemeName: string;
  schemeFullName: string;
  applicantName: string;
  submissionDate: string;
  state?: string;
  currentStageNumber?: number;
  overallStatus?: string;
}

/**
 * Searches the national database for an official welfare application record.
 * Returns null if the reference ID does not exist in the database (strictly NO dummy fallback).
 */
export async function lookupApplicationFromDb(queryId: string): Promise<ApplicationTrackRecord | null> {
  const cleanId = queryId.trim().toUpperCase();
  if (!cleanId) return null;

  try {
    const res = await fetch(`/api/applications/${encodeURIComponent(cleanId)}`);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    if (data.success && data.application) {
      return data.application as ApplicationTrackRecord;
    }
    return null;
  } catch (error) {
    console.error('Failed to lookup application from DB:', error);
    return null;
  }
}

/**
 * Fetches applications from the national database for the logged-in citizen.
 */
export async function fetchUserApplicationsFromDb(
  aadhaarNumber?: string | null, 
  applicantName?: string | null
): Promise<UserSavedApplication[]> {
  try {
    const params = new URLSearchParams();
    if (aadhaarNumber && aadhaarNumber !== 'guest') {
      params.append('aadhaar', aadhaarNumber);
    } else if (applicantName && applicantName !== 'Guest Citizen' && applicantName !== 'Citizen Applicant') {
      params.append('applicantName', applicantName);
    }

    const res = await fetch(`/api/applications?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.success && Array.isArray(data.applications)) {
      return data.applications;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch user applications from DB:', error);
    return [];
  }
}

/**
 * Advances or refreshes the milestone stage in the database.
 */
export async function progressApplicationInDb(applicationId: string): Promise<ApplicationTrackRecord | null> {
  const cleanId = applicationId.trim().toUpperCase();
  try {
    const res = await fetch(`/api/applications/${encodeURIComponent(cleanId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ advanceStage: true })
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.application) {
      return data.application as ApplicationTrackRecord;
    }
    return null;
  } catch (error) {
    console.error('Failed to advance application stage in DB:', error);
    return null;
  }
}

/**
 * Withdraws and permanently deletes an application from the database.
 */
export async function deleteApplicationFromDb(applicationId: string): Promise<boolean> {
  const cleanId = applicationId.trim().toUpperCase();
  try {
    const res = await fetch(`/api/applications/${encodeURIComponent(cleanId)}`, {
      method: 'DELETE'
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.success;
  } catch (error) {
    console.error('Failed to delete application from DB:', error);
    return false;
  }
}
