import { useState } from "react";
import { Merge, CircleX, ArrowRight, AlertTriangle } from "lucide-react";
import {
  useDataProvider,
  useRecordContext,
  useNotify,
  useRedirect,
  useRefresh,
  useGetOne,
  required,
  Form,
} from "ra-core";
import type { Identifier } from "ra-core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReferenceInput } from "@/components/admin/reference-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import type { Contact, Lead } from "../types";
import { contactOptionText } from "../misc/ContactOption";

export const LeadMergeButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        className="h-6 cursor-pointer"
        size="sm"
        onClick={() => setDialogOpen(true)}
      >
        <Merge className="w-4 h-4" />
        Merge with Contact
      </Button>
      <LeadMergeDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
};

interface LeadMergeDialogProps {
  open: boolean;
  onClose: () => void;
}

const LeadMergeDialog = ({ open, onClose }: LeadMergeDialogProps) => {
  const lead = useRecordContext<Lead>();
  const notify = useNotify();
  const redirect = useRedirect();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();
  const [contactId, setContactId] = useState<Identifier | null>(null);
  const [isMerging, setIsMerging] = useState(false);

  // Fetch selected contact details
  const { data: selectedContact } = useGetOne<Contact>(
    "contacts",
    { id: contactId! },
    { enabled: !!contactId },
  );

  if (!lead) return null;

  const handleMerge = async () => {
    if (!contactId || !selectedContact) {
      notify("Please select a contact to merge with", { type: "warning" });
      return;
    }

    try {
      setIsMerging(true);

      // Check if email already exists in contact
      const existingEmails = selectedContact.email_jsonb || [];
      const emailExists = existingEmails.some((e) => e.email === lead.email);

      // Prepare updated email list
      const updatedEmails = emailExists
        ? existingEmails
        : [...existingEmails, { email: lead.email, type: "Work" as const }];

      // Prepare updated background
      const leadInfo = [
        lead.comments,
        lead.selected_cards?.length
          ? `AI Cards: ${lead.selected_cards.map((c) => c.name).join(", ")}`
          : null,
        lead.concern_level ? `Concern Level: ${lead.concern_level}/5` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const updatedBackground = selectedContact.background
        ? `${selectedContact.background}\n\n--- From Lead ---\n${leadInfo}`
        : leadInfo;

      // Update the contact
      await dataProvider.update("contacts", {
        id: contactId,
        data: {
          email_jsonb: updatedEmails,
          background: updatedBackground || selectedContact.background,
          last_seen: new Date().toISOString(),
        },
        previousData: selectedContact,
      });

      // Update the lead status
      await dataProvider.update("leads", {
        id: lead.id,
        data: {
          status: "converted",
          converted_to_contact_id: contactId,
        },
        previousData: lead,
      });

      setIsMerging(false);
      notify("Lead merged with contact successfully", { type: "success" });
      refresh();
      redirect(`/contacts/${contactId}/show`);
      onClose();
    } catch (error) {
      setIsMerging(false);
      notify("Failed to merge lead with contact", { type: "error" });
      console.error("Merge failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:min-w-lg max-w-2xl">
        <DialogHeader>
          <DialogTitle>Merge Lead with Contact</DialogTitle>
          <DialogDescription>
            Add this lead's information to an existing contact.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="font-medium text-sm mb-2">Lead Information</p>
            <div className="text-sm">
              <div>
                <strong>{lead.name}</strong>
              </div>
              <div className="text-muted-foreground">{lead.email}</div>
              {lead.organization && (
                <div className="text-muted-foreground">{lead.organization}</div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="font-medium text-sm mb-2">
              Select Contact to Merge Into
            </p>
            <Form>
              <ReferenceInput source="contact_id" reference="contacts">
                <AutocompleteInput
                  label=""
                  optionText={contactOptionText}
                  validate={required()}
                  onChange={setContactId}
                  helperText={false}
                />
              </ReferenceInput>
            </Form>
          </div>

          {selectedContact && (
            <>
              <div className="space-y-2">
                <p className="font-medium text-sm">What will be merged:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  {lead.email &&
                    !selectedContact.email_jsonb?.some(
                      (e) => e.email === lead.email,
                    ) && <li>• Email address will be added</li>}
                  {lead.comments && (
                    <li>• Comments will be added to background</li>
                  )}
                  {lead.selected_cards?.length && (
                    <li>• AI card selections will be noted in background</li>
                  )}
                  {lead.concern_level && (
                    <li>• Concern level will be noted in background</li>
                  )}
                </ul>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Note</AlertTitle>
                <AlertDescription>
                  The lead will be marked as "converted" and linked to the
                  contact. Lead data will be appended to the contact's
                  background field.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isMerging}>
            <CircleX />
            Cancel
          </Button>
          <Button onClick={handleMerge} disabled={!contactId || isMerging}>
            <Merge />
            {isMerging ? "Merging..." : "Merge with Contact"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
