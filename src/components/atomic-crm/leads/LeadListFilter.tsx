import {
  endOfYesterday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { Calendar, TrendingUp, Megaphone } from "lucide-react";
import { FilterLiveForm } from "ra-core";
import { ToggleFilterButton } from "@/components/admin/toggle-filter-button";
import { SearchInput } from "@/components/admin/search-input";

import { FilterCategory } from "../filters/FilterCategory";
import { LeadStatusBadge, LEAD_STATUS_LIST } from "./LeadStatusBadge";

export const LeadListFilter = () => {
  return (
    <div className="w-52 min-w-52 order-first pt-0.75 flex flex-col gap-4">
      <FilterLiveForm>
        <SearchInput source="q" placeholder="Search name, email, campaign..." />
      </FilterLiveForm>

      <FilterCategory label="Status" icon={<TrendingUp />}>
        {LEAD_STATUS_LIST.map((status) => (
          <ToggleFilterButton
            key={status.value}
            className="w-full justify-between"
            label={
              <LeadStatusBadge
                status={status.value as "new" | "contacted" | "qualified" | "converted" | "archived"}
              />
            }
            value={{ status: status.value }}
          />
        ))}
      </FilterCategory>

      <FilterCategory label="Campaign" icon={<Megaphone />}>
        <FilterLiveForm>
          <SearchInput source="campaign" placeholder="Filter by campaign..." />
        </FilterLiveForm>
      </FilterCategory>

      <FilterCategory label="Date Added" icon={<Calendar />}>
        <ToggleFilterButton
          className="w-full justify-between"
          label="Today"
          value={{
            "created_at@gte": endOfYesterday().toISOString(),
            "created_at@lte": undefined,
          }}
        />
        <ToggleFilterButton
          className="w-full justify-between"
          label="This week"
          value={{
            "created_at@gte": startOfWeek(new Date()).toISOString(),
            "created_at@lte": undefined,
          }}
        />
        <ToggleFilterButton
          className="w-full justify-between"
          label="This month"
          value={{
            "created_at@gte": startOfMonth(new Date()).toISOString(),
            "created_at@lte": undefined,
          }}
        />
        <ToggleFilterButton
          className="w-full justify-between"
          label="Before this month"
          value={{
            "created_at@gte": undefined,
            "created_at@lte": startOfMonth(new Date()).toISOString(),
          }}
        />
        <ToggleFilterButton
          className="w-full justify-between"
          label="Before last month"
          value={{
            "created_at@gte": undefined,
            "created_at@lte": subMonths(
              startOfMonth(new Date()),
              1,
            ).toISOString(),
          }}
        />
      </FilterCategory>
    </div>
  );
};
