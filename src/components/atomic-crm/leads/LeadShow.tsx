import { ShowBase, useShowContext } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { Lead } from "../types";
import { LeadAside } from "./LeadAside";

export const LeadShow = () => (
  <ShowBase>
    <LeadShowContent />
  </ShowBase>
);

const LeadShowContent = () => {
  const { record, isPending } = useShowContext<Lead>();
  if (isPending || !record) return null;

  return (
    <div className="mt-2 mb-2 flex gap-8">
      <div className="flex-1">
        <Card>
          <CardContent>
            <div className="flex">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-lg">
                {record.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="ml-4 flex-1">
                <h5 className="text-xl font-semibold">{record.name}</h5>
                <div className="text-sm text-muted-foreground">
                  {record.email}
                  {record.title && ` · ${record.title}`}
                  {record.organization && ` at ${record.organization}`}
                </div>
              </div>
            </div>

            {record.comments && (
              <div className="mt-6">
                <h6 className="text-sm font-semibold mb-2">Comments</h6>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {record.comments}
                </p>
              </div>
            )}

            {record.selected_cards && record.selected_cards.length > 0 && (
              <div className="mt-6">
                <h6 className="text-sm font-semibold mb-2">
                  AI Pathology Cards Selected ({record.selected_cards.length})
                </h6>
                <div className="flex flex-wrap gap-2">
                  {record.selected_cards.map((card) => (
                    <Badge
                      key={card.id}
                      variant="outline"
                      className="py-1 px-3"
                    >
                      {card.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <LeadAside />
    </div>
  );
};
