import { useState } from "react";

/**
 * TaskSelector — lets the user pick a task type and trigger job creation.
 *
 * Displays a card for each AI task type. Clicking "Start Task" fires
 * the onStartTask callback, which the parent uses to POST /api/jobs.
 */

const TASK_TYPES = [
  {
    id: "photo_generation",
    label: "Photo Generation",
    description: "Generate AI-powered marketing photos using Stable Diffusion XL",
    icon: "📸",
    duration: "~8s",
    color: "#6C63FF",
  },
  {
    id: "video_generation",
    label: "Video Generation",
    description: "Create short-form video content with Runway Gen-3 models",
    icon: "🎬",
    duration: "~15s",
    color: "#A855F7",
  },
  {
    id: "ad_copy",
    label: "Ad Copy",
    description: "Write compelling ad headlines and CTAs using GPT-4o",
    icon: "✍️",
    duration: "~5s",
    color: "#EC4899",
  },
  {
    id: "target_audience",
    label: "Target Audience",
    description: "Identify high-value audience segments with Audience AI v2",
    icon: "🎯",
    duration: "~10s",
    color: "#14B8A6",
  },
];

const TaskSelector = ({ onStartTask, isSubmitting }) => {
  const [selected, setSelected] = useState(null);

  const handleStart = () => {
    if (!selected || isSubmitting) return;
    onStartTask(selected);
    setSelected(null);
  };

  return (
    <section className="task-selector" id="task-selector">
      <div className="task-selector__header">
        <h2 className="task-selector__title">Launch a Task</h2>
        <p className="task-selector__desc">
          Select an AI generation task to queue for processing
        </p>
      </div>

      <div className="task-selector__grid">
        {TASK_TYPES.map((task) => (
          <button
            key={task.id}
            id={`task-${task.id}`}
            className={`task-card ${selected === task.id ? "task-card--selected" : ""}`}
            onClick={() => setSelected(task.id)}
            style={{ "--task-accent": task.color }}
            disabled={isSubmitting}
          >
            <span className="task-card__icon">{task.icon}</span>
            <h3 className="task-card__label">{task.label}</h3>
            <p className="task-card__description">{task.description}</p>
            <span className="task-card__duration">{task.duration}</span>
          </button>
        ))}
      </div>

      <button
        id="start-task-btn"
        className="task-selector__start-btn"
        onClick={handleStart}
        disabled={!selected || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner" />
            Queueing...
          </>
        ) : (
          <>
            <span className="start-icon">🚀</span>
            Start Task
          </>
        )}
      </button>
    </section>
  );
};

export default TaskSelector;
