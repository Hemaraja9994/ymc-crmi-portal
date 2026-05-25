// Stay-duty allocations per the YMC notice "Stay duty rooms for Medical Interns".
// Update these strings as the warden confirms actual room assignments per sub-batch.
export const STAY_DUTY: Record<
  string,
  { required: boolean; rooms?: string; note?: string }
> = {
  EMED: { required: true, rooms: "Casualty Block · Rooms C-101 to C-104", note: "Night-call on rotation." },
  OBG:  { required: true, rooms: "OBG Block · Rooms O-205 to O-208", note: "Labour-room cover by sub-batch." },
  PED:  { required: true, rooms: "Paediatrics Block · Rooms P-110 to P-112", note: "NICU on-call as per roster." },
  GSUR: { required: false, note: "On-call only — no stay-duty room allotted." },
  GMED: { required: false, note: "On-call only — no stay-duty room allotted." },
  ANAE: { required: false },
  ORTH: { required: false },
  RAD:  { required: false },
  ENT:  { required: false },
  OPH:  { required: false },
  PSY:  { required: false },
  GER:  { required: false },
  COM:  { required: false, note: "Field postings — community centre stay where applicable." },
  RES:  { required: false },
  DVL:  { required: false },
  FOR:  { required: false },
  LAB:  { required: false },
};

export function stayDutyFor(deptCode: string) {
  return STAY_DUTY[deptCode] || { required: false };
}
