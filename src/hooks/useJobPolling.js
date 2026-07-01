import { useState, useEffect, useRef, useCallback } from "react";
import { getJobStatus } from "../api/jobApi";

/**
 * useJobPolling — custom hook for real-time job status polling.
 *
 * How it works:
 *  1. When a jobId is provided, starts polling GET /api/jobs/:jobId/status
 *     every `interval` milliseconds (default 2000ms).
 *  2. Automatically stops polling when the job reaches a terminal state
 *     (COMPLETED or FAILED) — no wasted network requests.
 *  3. Tracks loading and error states for the UI to react to.
 *  4. Uses useRef for the interval ID to avoid stale closure issues.
 *  5. Cleans up the interval on unmount to prevent memory leaks.
 *
 * @param {string|null} jobId - The job to poll (null = don't poll)
 * @param {number} interval - Polling interval in ms (default 2000)
 * @returns {{ job, loading, error, stopPolling }}
 */
const useJobPolling = (jobId, interval = 2000) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const fetchStatus = useCallback(async () => {
    if (!jobId) return;

    try {
      const data = await getJobStatus(jobId);

      // Guard against state updates after unmount
      if (!isMountedRef.current) return;

      setJob(data.job);
      setError(null);

      // Stop polling when job reaches a terminal state
      if (data.job.status === "COMPLETED" || data.job.status === "FAILED") {
        stopPolling();
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(err.message);
    }
  }, [jobId, stopPolling]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!jobId) {
      setJob(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Initial fetch
    setLoading(true);
    fetchStatus().finally(() => {
      if (isMountedRef.current) setLoading(false);
    });

    // Start polling interval
    intervalRef.current = setInterval(fetchStatus, interval);

    // Cleanup on unmount or jobId change
    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [jobId, interval, fetchStatus, stopPolling]);

  return { job, loading, error, stopPolling };
};

export default useJobPolling;
