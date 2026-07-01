import StatusBadge from "./StatusBadge";
import useJobPolling from "../hooks/useJobPolling";

/**
 * JobCard — renders a single job with live progress tracking.
 *
 * Uses the useJobPolling hook to automatically poll for status updates
 * while the job is active. Shows progress bar, status badge, timeline,
 * and result/error payloads.
 */

const TASK_LABELS = {
  photo_generation: "Photo Generation",
  video_generation: "Video Generation",
  ad_copy: "Ad Copy",
  target_audience: "Target Audience",
};

const TASK_ICONS = {
  photo_generation: "📸",
  video_generation: "🎬",
  ad_copy: "✍️",
  target_audience: "🎯",
};

const JobCard = ({ jobId, taskType, initialStatus }) => {
  const { job, loading, error } = useJobPolling(jobId);

  // Use polled data if available, otherwise fall back to initial data
  const status = job?.status || initialStatus || "PENDING";
  const progress = job?.progress || 0;
  const isTerminal = status === "COMPLETED" || status === "FAILED";

  const formatTime = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getDuration = () => {
    if (!job?.createdAt) return null;
    const start = new Date(job.createdAt).getTime();
    const end = job.completedAt
      ? new Date(job.completedAt).getTime()
      : Date.now();
    const seconds = ((end - start) / 1000).toFixed(1);
    return `${seconds}s`;
  };

  return (
    <div className={`job-card ${isTerminal ? `job-card--${status.toLowerCase()}` : ""}`} id={`job-${jobId}`}>
      <div className="job-card__header">
        <div className="job-card__info">
          <span className="job-card__icon">{TASK_ICONS[taskType] || "📋"}</span>
          <div>
            <h3 className="job-card__title">{TASK_LABELS[taskType] || taskType}</h3>
            <p className="job-card__id" title={jobId}>
              {jobId.substring(0, 8)}...
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Progress bar */}
      <div className="job-card__progress-container">
        <div className="job-card__progress-bar">
          <div
            className={`job-card__progress-fill job-card__progress-fill--${status.toLowerCase()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="job-card__progress-text">{progress}%</span>
      </div>

      {/* Timestamps */}
      <div className="job-card__meta">
        <div className="job-card__meta-item">
          <span className="job-card__meta-label">Started</span>
          <span className="job-card__meta-value">{formatTime(job?.createdAt)}</span>
        </div>
        {isTerminal && (
          <div className="job-card__meta-item">
            <span className="job-card__meta-label">Duration</span>
            <span className="job-card__meta-value">{getDuration()}</span>
          </div>
        )}
        {!isTerminal && status !== "PENDING" && (
          <div className="job-card__meta-item">
            <span className="job-card__meta-label">Elapsed</span>
            <span className="job-card__meta-value">{getDuration()}</span>
          </div>
        )}
      </div>

      {/* Result payload */}
      {status === "COMPLETED" && job?.result && (
        <div className="job-card__result">
          <h4 className="job-card__result-title">Result</h4>
          <pre className="job-card__result-code">
            {JSON.stringify(job.result, null, 2)}
          </pre>
        </div>
      )}

      {/* Error message */}
      {status === "FAILED" && job?.error && (
        <div className="job-card__error">
          <h4 className="job-card__error-title">Error</h4>
          <p className="job-card__error-msg">{job.error}</p>
        </div>
      )}

      {/* Polling indicator */}
      {!isTerminal && !error && (
        <div className="job-card__polling">
          <span className="job-card__polling-dot" />
          <span className="job-card__polling-text">Live updates</span>
        </div>
      )}

      {/* Fetch error */}
      {error && (
        <div className="job-card__fetch-error">
          <p>⚠️ Polling error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default JobCard;
