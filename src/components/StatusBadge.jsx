/**
 * StatusBadge — renders a colored pill showing the job's current state.
 *
 * Uses CSS custom properties for color mapping so the badge
 * adapts to the theme without prop-drilling colors.
 */

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    className: "status-badge--pending",
    icon: "⏳",
  },
  PROCESSING: {
    label: "Processing",
    className: "status-badge--processing",
    icon: "⚙️",
  },
  COMPLETED: {
    label: "Completed",
    className: "status-badge--completed",
    icon: "✅",
  },
  FAILED: {
    label: "Failed",
    className: "status-badge--failed",
    icon: "❌",
  },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

  return (
    <span className={`status-badge ${config.className}`}>
      <span className="status-badge__icon">{config.icon}</span>
      <span className="status-badge__label">{config.label}</span>
    </span>
  );
};

export default StatusBadge;
