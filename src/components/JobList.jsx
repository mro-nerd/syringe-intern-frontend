import JobCard from "./JobCard";

/**
 * JobList — dashboard view showing all active/recent jobs.
 *
 * Renders a grid of JobCard components. Each card independently
 * polls for its own status updates via the useJobPolling hook.
 */
const JobList = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <section className="job-list" id="job-list">
        <div className="job-list__header">
          <h2 className="job-list__title">Recent Jobs</h2>
        </div>
        <div className="job-list__empty">
          <span className="job-list__empty-icon">📋</span>
          <p className="job-list__empty-text">No jobs yet</p>
          <p className="job-list__empty-sub">
            Select a task type above and click "Start Task" to begin
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="job-list" id="job-list">
      <div className="job-list__header">
        <h2 className="job-list__title">Recent Jobs</h2>
        <span className="job-list__count">{jobs.length} job{jobs.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="job-list__grid">
        {jobs.map((job) => (
          <JobCard
            key={job.jobId}
            jobId={job.jobId}
            taskType={job.taskType}
            initialStatus={job.status}
          />
        ))}
      </div>
    </section>
  );
};

export default JobList;
