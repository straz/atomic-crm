import { formatRelative } from "date-fns";
import { RecordContextProvider, useListContext } from "ra-core";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";

import type { Lead } from "../types";
import { LeadStatusBadge } from "./LeadStatusBadge";

export const LeadListContent = () => {
  const {
    data: leads,
    error,
    isPending,
  } = useListContext<Lead>();

  if (isPending) {
    return <Skeleton className="w-full h-9" />;
  }

  if (error) {
    return null;
  }

  const now = Date.now();

  return (
    <div className="divide-y">
      {leads.map((lead) => (
        <RecordContextProvider key={lead.id} value={lead}>
          <Link
            to={`/leads/${lead.id}/show`}
            className="flex flex-row gap-4 items-center px-4 py-3 hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium">{lead.name}</div>
              <div className="text-sm text-muted-foreground">
                {lead.email}
                {lead.title && ` · ${lead.title}`}
                {lead.organization && ` at ${lead.organization}`}
              </div>
              {lead.selected_cards && lead.selected_cards.length > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {lead.selected_cards.length} card
                  {lead.selected_cards.length > 1 ? "s" : ""} selected
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <LeadStatusBadge status={lead.status} />
              {lead.concern_level && (
                <div className="text-xs text-muted-foreground">
                  Concern: {lead.concern_level}/5
                </div>
              )}
            </div>
            <div className="text-right ml-4 min-w-24">
              <div
                className="text-sm text-muted-foreground"
                title={lead.created_at}
              >
                {formatRelative(lead.created_at, now)}
              </div>
            </div>
          </Link>
        </RecordContextProvider>
      ))}

      {leads.length === 0 && (
        <div className="p-4">
          <div className="text-muted-foreground">No leads found</div>
        </div>
      )}
    </div>
  );
};
