import { useGetIdentity, useListContext } from "ra-core";
import { List } from "@/components/admin/list";
import { SortButton } from "@/components/admin/sort-button";
import { Card } from "@/components/ui/card";

import { TopToolbar } from "../layout/TopToolbar";
import { LeadListContent } from "./LeadListContent";
import { LeadListFilter } from "./LeadListFilter";

export const LeadList = () => {
  const { identity } = useGetIdentity();

  if (!identity) return null;

  return (
    <List
      title={false}
      actions={<LeadListActions />}
      perPage={25}
      sort={{ field: "created_at", order: "DESC" }}
    >
      <LeadListLayout />
    </List>
  );
};

const LeadListLayout = () => {
  const { data, isPending, filterValues } = useListContext();
  const { identity } = useGetIdentity();

  const hasFilters = filterValues && Object.keys(filterValues).length > 0;

  if (!identity || isPending) return null;

  if (!data?.length && !hasFilters) return <LeadEmpty />;

  return (
    <div className="flex flex-row gap-8">
      <LeadListFilter />
      <div className="w-full flex flex-col gap-4">
        <Card className="py-0">
          <LeadListContent />
        </Card>
      </div>
    </div>
  );
};

const LeadListActions = () => (
  <TopToolbar>
    <SortButton fields={["name", "email", "created_at", "concern_level"]} />
  </TopToolbar>
);

const LeadEmpty = () => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <h2 className="text-xl font-semibold mb-2">No leads yet</h2>
    <p className="text-muted-foreground max-w-md">
      Leads will appear here when visitors submit the AI Pathologies card request form.
    </p>
  </div>
);
