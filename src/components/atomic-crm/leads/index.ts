import type { Lead } from "../types";
import { LeadList } from "./LeadList";
import { LeadShow } from "./LeadShow";

export default {
  list: LeadList,
  show: LeadShow,
  recordRepresentation: (record: Lead) => record?.name,
};
