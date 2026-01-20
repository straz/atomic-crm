import { useState } from "react";
import { UserPlus, CircleX, ArrowRight } from "lucide-react";
import {
  useDataProvider,
  useRecordContext,
  useNotify,
  useRedirect,
  useGetIdentity,
  useRefresh,
} from "ra-core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { Lead } from "../types";

export const LeadConvertButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <Button
        variant="default"
        className="h-6 cursor-pointer"
        size="sm"
        onClick={() => setDialogOpen(true)}
      >
        <UserPlus className="w-4 h-4" />
        Convert to Contact
      </Button>
      <LeadConvertDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

interface LeadConvertDialogProps {
  open: boolean;
  onClose: () => void;
}

const LeadConvertDialog = ({ open, onClose }: LeadConvertDialogProps) => {
  const lead = useRecordContext<Lead>();
  const notify = useNotify();
  const redirect = useRedirect();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();
  const { identity } = useGetIdentity();
  const [isConverting, setIsConverting] = useState(false);

  if (!lead) return null;

  // Parse name into first and last
  const nameParts = lead.name.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const handleConvert = async () => {
    try {
      setIsConverting(true);

      // Create the contact
      const { data: newContact } = await dataProvider.create("contacts", {
        data: {
          first_name: firstName,
          last_name: lastName,
          title: lead.title || "",
          email_jsonb: lead.email ? [{ email: lead.email, type: "Work" }] : [],
          phone_jsonb: [],
          background: lead.comments || "",
          first_seen: new Date().toISOString(),
          last_seen: new Date().toISOString(),
          has_newsletter: false,
          tags: [],
          sales_id: identity?.id,
          status: "cold",
        },
      });

      // Update the lead status
      await dataProvider.update("leads", {
        id: lead.id,
        data: {
          status: "converted",
          converted_to_contact_id: newContact.id,
        },
        previousData: lead,
      });

      setIsConverting(false);
      notify("Lead converted to contact successfully", { type: "success" });
      refresh();
      redirect(`/contacts/${newContact.id}/show`);
      onClose();
    } catch (error) {
      setIsConverting(false);
      notify("Failed to convert lead", { type: "error" });
      console.error("Convert failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:min-w-lg max-w-xl">
        <DialogHeader>
          <DialogTitle>Convert Lead to Contact</DialogTitle>
          <DialogDescription>
            Create a new contact from this lead's information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="font-medium text-sm mb-3">Lead Information</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Name:</div>
              <div>{lead.name}</div>
              <div className="text-muted-foreground">Email:</div>
              <div>{lead.email}</div>
              {lead.title && (
                <>
                  <div className="text-muted-foreground">Title:</div>
                  <div>{lead.title}</div>
                </>
              )}
              {lead.organization && (
                <>
                  <div className="text-muted-foreground">Organization:</div>
                  <div>{lead.organization}</div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="font-medium text-sm mb-3">New Contact Preview</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">First Name:</div>
              <div>{firstName || "(empty)"}</div>
              <div className="text-muted-foreground">Last Name:</div>
              <div>{lastName || "(empty)"}</div>
              <div className="text-muted-foreground">Email:</div>
              <div>{lead.email} (Work)</div>
              {lead.title && (
                <>
                  <div className="text-muted-foreground">Title:</div>
                  <div>{lead.title}</div>
                </>
              )}
              {lead.comments && (
                <>
                  <div className="text-muted-foreground">Background:</div>
                  <div className="truncate" title={lead.comments}>
                    {lead.comments.slice(0, 50)}
                    {lead.comments.length > 50 ? "..." : ""}
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            The lead will be marked as "converted" and linked to the new
            contact.
          </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isConverting}>
            <CircleX />
            Cancel
          </Button>
          <Button onClick={handleConvert} disabled={isConverting}>
            <UserPlus />
            {isConverting ? "Converting..." : "Convert to Contact"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
