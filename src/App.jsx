import { useState, useEffect } from "react";
import Header from "./components/Header";
import TaskSelector from "./components/TaskSelector";
import JobList from "./components/JobList";
import { createJob, getAllJobs } from "./api/jobApi";
import "./App.css";

/**
 * App — the main layout and orchestrator.
 *
 * Responsibilities:
 *  1. Mounts Header, TaskSelector, and JobList.
 *  2. Fetches the initial list of jobs on mount.
 *  3. Handles the "Start Task" action: POSTs to /api/jobs, then
 *     optimistically adds the new PENDING job to the list so it
 *     immediately starts polling.
 *  4. Manages global loading and error states for the dashboard.
 */

function App() {
  const [jobs, setJobs] = useState([]);
  const [isFetchingJobs, setIsFetchingJobs] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial list of jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();
        // The API returns them newest-first
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load dashboard. Ensure the backend is running.");
      } finally {
        setIsFetchingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  // Handle task creation
  const handleStartTask = async (taskType) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const data = await createJob(taskType);
      
      // Optimistically add the new job to the top of the list.
      // Since we render JobCards, this new card will immediately
      // start polling its own status.
      setJobs((prev) => [data.job, ...prev]);
    } catch (err) {
      console.error("Failed to start task:", err);
      setError(`Failed to start task: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app">
      <Header />
      
      <main className="app__main">
        {error && (
          <div className="app__global-error">
            <span className="app__global-error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <div className="app__content">
          <TaskSelector 
            onStartTask={handleStartTask} 
            isSubmitting={isSubmitting} 
          />
          
          {isFetchingJobs ? (
            <div className="app__loading">
              <span className="spinner" />
              <p>Loading dashboard...</p>
            </div>
          ) : (
            <JobList jobs={jobs} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
