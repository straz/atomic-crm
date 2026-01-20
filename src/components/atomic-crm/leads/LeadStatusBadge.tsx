import { Badge } from "@/components/ui/badge";

const LEAD_STATUSES = {
  new: { label: "New", color: "#2196f3" },
  contacted: { label: "Contacted", color: "#ff9800" },
  qualified: { label: "Qualified", color: "#4caf50" },
  converted: { label: "Converted", color: "#9c27b0" },
  archived: { label: "Archived", color: "#9e9e9e" },
} as const;

export const LeadStatusBadge = ({
  status,
}: {
  status: keyof typeof LEAD_STATUSES;
}) => {
  const statusConfig = LEAD_STATUSES[status] ?? LEAD_STATUSES.new;
  return (
    <Badge
      variant="secondary"
      className="text-white text-xs font-normal"
      style={{ backgroundColor: statusConfig.color }}
    >
      {statusConfig.label}
    </Badge>
  );
};

export const LEAD_STATUS_LIST = Object.entries(LEAD_STATUSES).map(
  ([value, config]) => ({
    value,
    label: config.label,
    color: config.color,
  }),
);
