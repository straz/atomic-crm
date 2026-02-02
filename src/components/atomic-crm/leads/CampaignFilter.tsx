import { useEffect, useState } from "react";
import { useListFilterContext, useDataProvider } from "ra-core";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CrmDataProvider } from "../providers/supabase/dataProvider";

export const CampaignFilter = () => {
  const [campaigns, setCampaigns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const dataProvider = useDataProvider<CrmDataProvider>();
  const { filterValues, setFilters } = useListFilterContext();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await dataProvider.getDistinctCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [dataProvider]);

  const handleChange = (value: string) => {
    if (value === "__all__") {
      // Remove campaign filter
      const { campaign, ...rest } = filterValues;
      setFilters(rest, undefined);
    } else {
      setFilters({ ...filterValues, campaign: value }, undefined);
    }
  };

  const currentValue = filterValues.campaign || "__all__";

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger className="w-full" size="sm">
        <SelectValue placeholder={loading ? "Loading..." : "All campaigns"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__">All campaigns</SelectItem>
        {campaigns.map((campaign) => (
          <SelectItem key={campaign} value={campaign}>
            {campaign}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
