import { Mail, Building2, Briefcase, Calendar, AlertTriangle, Megaphone } from "lucide-react";
import { useRecordContext } from "ra-core";
import { DateField } from "@/components/admin/date-field";
import { Badge } from "@/components/ui/badge";

import { AsideSection } from "../misc/AsideSection";
import type { Lead } from "../types";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { LeadConvertButton } from "./LeadConvertButton";
import { LeadMergeButton } from "./LeadMergeButton";

export const LeadAside = () => {
  const record = useRecordContext<Lead>();

  if (!record) return null;

  return (
    <div className="hidden sm:block w-72 min-w-72 text-sm">
      <AsideSection title="Status">
        <LeadStatusBadge status={record.status} />
      </AsideSection>

      <AsideSection title="Contact Info">
        <div className="flex items-center gap-2 py-1">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <a href={`mailto:${record.email}`} className="underline hover:no-underline">
            {record.email}
          </a>
        </div>
        {record.title && (
          <div className="flex items-center gap-2 py-1">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span>{record.title}</span>
          </div>
        )}
        {record.organization && (
          <div className="flex items-center gap-2 py-1">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span>{record.organization}</span>
          </div>
        )}
      </AsideSection>

      {record.campaign && (
        <AsideSection title="Campaign">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{record.campaign}</span>
          </div>
        </AsideSection>
      )}

      {record.concern_level && (
        <AsideSection title="Concern Level">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{record.concern_level}/5</span>
            <span className="text-muted-foreground">
              {record.concern_level <= 2
                ? "(Low)"
                : record.concern_level === 3
                  ? "(Medium)"
                  : "(High)"}
            </span>
          </div>
        </AsideSection>
      )}

      {record.who_concerned && record.who_concerned.length > 0 && (
        <AsideSection title="Who's Concerned">
          <div className="flex flex-wrap gap-1">
            {record.who_concerned.map((who) => (
              <Badge key={who} variant="outline" className="text-xs">
                {who}
              </Badge>
            ))}
            {record.who_concerned_other && (
              <Badge variant="outline" className="text-xs">
                {record.who_concerned_other}
              </Badge>
            )}
          </div>
        </AsideSection>
      )}

      {record.ai_characteristics && record.ai_characteristics.length > 0 && (
        <AsideSection title="AI Characteristics">
          <div className="flex flex-wrap gap-1">
            {record.ai_characteristics.map((char) => (
              <Badge key={char} variant="secondary" className="text-xs">
                {char}
              </Badge>
            ))}
            {record.ai_characteristics_other && (
              <Badge variant="secondary" className="text-xs">
                {record.ai_characteristics_other}
              </Badge>
            )}
          </div>
        </AsideSection>
      )}

      {record.ai_providers && record.ai_providers.length > 0 && (
        <AsideSection title="AI Providers">
          <div className="flex flex-wrap gap-1">
            {record.ai_providers.map((provider) => (
              <Badge key={provider} variant="secondary" className="text-xs">
                {provider}
              </Badge>
            ))}
            {record.ai_providers_other && (
              <Badge variant="secondary" className="text-xs">
                {record.ai_providers_other}
              </Badge>
            )}
          </div>
        </AsideSection>
      )}

      <AsideSection title="Timeline">
        <div className="flex items-center gap-2 py-1 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Added on </span>
          <DateField
            source="created_at"
            options={{ year: "numeric", month: "long", day: "numeric" }}
          />
        </div>
      </AsideSection>

      {record.status !== "converted" && (
        <div className="mt-6 pt-6 border-t flex flex-col gap-2 items-start">
          <LeadConvertButton />
          <LeadMergeButton />
        </div>
      )}

      {record.converted_to_contact_id && (
        <AsideSection title="Converted">
          <a
            href={`#/contacts/${record.converted_to_contact_id}/show`}
            className="text-primary underline hover:no-underline"
          >
            View Contact →
          </a>
        </AsideSection>
      )}
    </div>
  );
};
