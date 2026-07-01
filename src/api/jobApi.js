/**
 * Job API Client — all HTTP calls to the Express backend.
 *
 * Centralised here so components never contain raw fetch() calls.
 * BASE_URL comes from the Vite env variable VITE_API_URL,
 * defaulting to localhost:4000 for local development.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/**
 * Create a new job.
 * POST /api/jobs  { taskType }
 *
 * @param {string} taskType - e.g. "photo_generation"
 * @returns {Object} { success, message, job: { jobId, taskType, status, ... } }
 */
export const createJob = async (taskType) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskType }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
};

/**
 * Poll a specific job's status.
 * GET /api/jobs/:jobId/status
 *
 * @param {string} jobId
 * @returns {Object} { success, job: { jobId, status, progress, result, ... } }
 */
export const getJobStatus = async (jobId) => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}/status`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
};

/**
 * Fetch all jobs (dashboard view).
 * GET /api/jobs
 *
 * @returns {Object} { success, count, jobs: [...] }
 */
export const getAllJobs = async () => {
  const res = await fetch(`${BASE_URL}/jobs`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
};
