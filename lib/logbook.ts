// CRMI Logbook scaffold — per-department learning objectives.
//
// Source: NMC Compulsory Rotating Medical Internship Programme regulations
// (UGMEB/NMC/RULES & REGULATIONS/2021 dated 18.11.2021), Annexure entries
// for each clinical posting, supplemented by Yenepoya Medical College
// internship logbook entries.
//
// ⚠️ The objectives below are a STARTER SET sourced from publicly available
// NMC guidance. Before going live, the CRMI Coordination Cell should review
// each list against the official Yenepoya logbook and add any
// institution-specific procedures, OPD coverage requirements, mandatory
// case-presentations, etc. Mark each item's `verified` flag once reviewed
// by the respective HOD.

export type LogbookObjective = {
  id: string;
  title: string;
  kind: "skill" | "procedure" | "case" | "knowledge" | "log-entry";
  mandatory: boolean;
  verified: boolean;     // HOD has signed off on the wording
  notes?: string;
};

export type DeptLogbook = {
  deptCode: string;
  deptName: string;
  introduction: string;
  weeks: number;
  objectives: LogbookObjective[];
  recommendedReading?: string[];
  externalLinks?: { label: string; url: string }[];
};

// Helper to keep entry construction terse.
const o = (id: string, title: string, kind: LogbookObjective["kind"], mandatory = true): LogbookObjective => ({
  id, title, kind, mandatory, verified: false,
});

export const LOGBOOKS: Record<string, DeptLogbook> = {
  // ── Block I ───────────────────────────────────────────────────────────────
  GMED: {
    deptCode: "GMED",
    deptName: "General Medicine",
    weeks: 6,
    introduction: "Bedside clinical examination, OPD case work-up, ward rounds, emergency triage, and prescription writing under supervision.",
    objectives: [
      o("gmed-1", "Detailed history taking and complete physical examination of 30+ in-patients", "skill"),
      o("gmed-2", "Present at least 5 long cases and 10 short cases during ward rounds", "case"),
      o("gmed-3", "Interpret ECGs covering common arrhythmias, ischaemia and conduction blocks", "skill"),
      o("gmed-4", "Interpret chest X-rays and routine biochemistry / haematology reports", "skill"),
      o("gmed-5", "Perform venepuncture, IV cannulation, NG tube insertion under supervision", "procedure"),
      o("gmed-6", "Manage acute presentations: AMI, stroke, DKA, anaphylaxis, status epilepticus", "knowledge"),
      o("gmed-7", "Counsel patients on hypertension, diabetes, anticoagulation and lifestyle", "skill"),
      o("gmed-8", "Maintain daily SOAP notes for assigned patients", "log-entry"),
    ],
    recommendedReading: [
      "Harrison's Principles of Internal Medicine (latest edition)",
      "API Textbook of Medicine",
      "NMC Internship Logbook — General Medicine chapter",
    ],
  },
  ENT: {
    deptCode: "ENT",
    deptName: "Otorhinolaryngology (ENT)",
    weeks: 2,
    introduction: "ENT examination skills, otoscopy, indirect laryngoscopy, audiometry interpretation, and management of common ENT emergencies.",
    objectives: [
      o("ent-1", "Perform otoscopic examination on 20+ patients", "skill"),
      o("ent-2", "Perform anterior rhinoscopy and posterior rhinoscopy", "skill"),
      o("ent-3", "Indirect laryngoscopy under supervision", "procedure"),
      o("ent-4", "Manage epistaxis: anterior nasal packing", "procedure"),
      o("ent-5", "Foreign-body removal — ear, nose under supervision", "procedure"),
      o("ent-6", "Interpret pure tone audiogram and tympanogram", "skill"),
    ],
  },
  OPH: {
    deptCode: "OPH",
    deptName: "Ophthalmology",
    weeks: 2,
    introduction: "Visual acuity testing, refraction basics, slit-lamp examination, fundus examination, and management of red eye, glaucoma, and refractive errors.",
    objectives: [
      o("oph-1", "Visual acuity testing using Snellen / E-chart", "skill"),
      o("oph-2", "Perform direct ophthalmoscopy and identify normal fundus", "skill"),
      o("oph-3", "Slit-lamp examination under supervision", "skill"),
      o("oph-4", "Measure intraocular pressure (Schiotz/applanation)", "procedure"),
      o("oph-5", "Identify and manage red eye, conjunctivitis, corneal ulcer", "knowledge"),
      o("oph-6", "Refraction basics — recognise myopia/hyperopia/astigmatism", "knowledge"),
    ],
  },
  PSY: {
    deptCode: "PSY",
    deptName: "Psychiatry",
    weeks: 2,
    introduction: "Mental status examination, common psychiatric disorders, suicide risk assessment, psychopharmacology basics, counselling skills.",
    objectives: [
      o("psy-1", "Perform complete Mental Status Examination on 10+ patients", "skill"),
      o("psy-2", "Take focused psychiatric history including substance use", "skill"),
      o("psy-3", "Suicide risk assessment and acute crisis intervention", "knowledge"),
      o("psy-4", "Recognise depression, anxiety, psychosis, mania presentations", "knowledge"),
      o("psy-5", "Basic counselling and psychoeducation", "skill"),
    ],
  },
  GER: {
    deptCode: "GER",
    deptName: "Geriatric Medicine",
    weeks: 1,
    introduction: "Comprehensive geriatric assessment, polypharmacy review, falls assessment, dementia screening.",
    objectives: [
      o("ger-1", "Comprehensive Geriatric Assessment on 3+ patients", "skill"),
      o("ger-2", "Mini-Mental State Examination (MMSE) administration", "skill"),
      o("ger-3", "Polypharmacy review and Beers-criteria awareness", "knowledge"),
      o("ger-4", "Falls risk assessment and prevention counselling", "skill"),
    ],
  },

  // ── Block II ──────────────────────────────────────────────────────────────
  GSUR: {
    deptCode: "GSUR",
    deptName: "General Surgery",
    weeks: 6,
    introduction: "Surgical case work-up, scrub procedures, suturing, wound care, peri-operative management.",
    objectives: [
      o("gsur-1", "Pre-operative work-up and consent counselling for 10+ cases", "skill"),
      o("gsur-2", "Scrub and assist in 15+ surgeries (open or laparoscopic)", "procedure"),
      o("gsur-3", "Perform suturing — simple interrupted, subcuticular under supervision", "procedure"),
      o("gsur-4", "Wound dressing and surgical site care", "procedure"),
      o("gsur-5", "Examination of acute abdomen, hernia, breast lump, thyroid", "skill"),
      o("gsur-6", "Post-op orders writing and ICU hand-over", "skill"),
    ],
  },
  ANA: {
    deptCode: "ANA",
    deptName: "Anaesthesiology & Critical Care",
    weeks: 2,
    introduction: "Pre-anaesthetic check-up, airway management, IV access, basic life support, ICU patient monitoring.",
    objectives: [
      o("ana-1", "Pre-anaesthetic check on 10+ elective patients", "skill"),
      o("ana-2", "Bag-mask ventilation and supraglottic airway placement (mannequin + supervised)", "procedure"),
      o("ana-3", "Endotracheal intubation under direct supervision", "procedure"),
      o("ana-4", "Peripheral IV cannulation in difficult access", "procedure"),
      o("ana-5", "Interpret ABG and ICU monitor data", "skill"),
      o("ana-6", "Certified Basic Life Support (BLS) — refresher", "skill"),
    ],
  },
  ORT: {
    deptCode: "ORT",
    deptName: "Orthopaedics incl. PMR",
    weeks: 2,
    introduction: "Fracture assessment, splint and POP application, joint examination, rehabilitation principles.",
    objectives: [
      o("ort-1", "Examine major joints — shoulder, knee, hip, spine", "skill"),
      o("ort-2", "POP / splint application — below-knee, above-elbow", "procedure"),
      o("ort-3", "Interpret musculoskeletal X-rays", "skill"),
      o("ort-4", "Assist in closed reduction under supervision", "procedure"),
    ],
  },
  EMG: {
    deptCode: "EMG",
    deptName: "Emergency / Trauma / Casualty",
    weeks: 2,
    introduction: "Triage, primary and secondary survey in trauma, ATLS basics, mass casualty preparedness. Mandatory in-house stay-duty.",
    objectives: [
      o("emg-1", "Triage 20+ patients using START or hospital triage protocol", "skill"),
      o("emg-2", "Primary + secondary survey on trauma patients", "skill"),
      o("emg-3", "Cervical collar, log-roll, splint application", "procedure"),
      o("emg-4", "Manage acute presentations: chest pain, shortness of breath, AMS, seizures", "knowledge"),
      o("emg-5", "ACLS-style team participation during code blue (observed)", "skill"),
    ],
  },
  RAD: {
    deptCode: "RAD",
    deptName: "Radiodiagnosis",
    weeks: 1,
    introduction: "X-ray, ultrasound, CT, MRI interpretation basics. Radiation safety.",
    objectives: [
      o("rad-1", "Systematic chest X-ray interpretation", "skill"),
      o("rad-2", "Observe FAST scan in trauma setting", "skill"),
      o("rad-3", "Recognise common CT brain emergencies (haemorrhage, infarct, mass)", "knowledge"),
    ],
  },

  // ── Block III ─────────────────────────────────────────────────────────────
  COM: {
    deptCode: "COM",
    deptName: "Community Medicine",
    weeks: 7,
    introduction: "Field posting at Primary Health Centres (PHCs) and outreach health centres. National Health Programmes, immunisation, school health, antenatal/postnatal home visits.",
    objectives: [
      o("com-1", "Complete 2 weeks of PHC posting with daily attendance log", "log-entry"),
      o("com-2", "Conduct 5+ antenatal home visits and document", "case"),
      o("com-3", "Participate in immunisation session and Vitamin A campaign", "procedure"),
      o("com-4", "School health screening — 1 school visit, weight/height/vision", "skill"),
      o("com-5", "Family health study — one assigned family across the posting", "case"),
      o("com-6", "Familiarity with RBSK, RKSK, JSY, RNTCP, NLEP and other national programmes", "knowledge"),
      o("com-7", "Compute IMR, MMR, U5MR, CDR for assigned PHC area", "knowledge"),
      o("com-8", "Participate in outreach camps (eye/dental/general)", "skill"),
    ],
    notes: "Specific PHC and outreach centre deputation roster is maintained by the Community Medicine HOD's office. Refer to the rotational sub-batch deputation chart issued separately.",
  } as DeptLogbook,
  RES: {
    deptCode: "RES",
    deptName: "Respiratory Medicine",
    weeks: 1,
    introduction: "Respiratory examination, sputum sampling, peak-flow / spirometry interpretation, RNTCP/National TB programme.",
    objectives: [
      o("res-1", "Complete respiratory examination on 5+ patients", "skill"),
      o("res-2", "Sputum collection and AFB smear request", "procedure"),
      o("res-3", "Interpret PEFR / spirometry basics", "skill"),
      o("res-4", "RNTCP DOTS regimen — drug, dose, side effects", "knowledge"),
    ],
  },

  // ── Block IV ──────────────────────────────────────────────────────────────
  OBG: {
    deptCode: "OBG",
    deptName: "Obstetrics & Gynaecology",
    weeks: 6,
    introduction: "Antenatal care, conduct of normal labour, family planning, gynae OPD work-up. Mandatory in-house stay-duty.",
    objectives: [
      o("obg-1", "Conduct 5+ normal vaginal deliveries under supervision", "procedure"),
      o("obg-2", "Antenatal check-up on 15+ patients across all trimesters", "skill"),
      o("obg-3", "Per-vaginum examination — supervised", "procedure"),
      o("obg-4", "PAP smear and HPV counselling", "procedure"),
      o("obg-5", "Family planning counselling — all methods including IUCD insertion (observed)", "skill"),
      o("obg-6", "Recognise and manage PPH, eclampsia, sepsis", "knowledge"),
    ],
  },
  PAE: {
    deptCode: "PAE",
    deptName: "Paediatrics",
    weeks: 3,
    introduction: "Newborn examination, growth and development monitoring, immunisation schedule, common paediatric emergencies. Mandatory stay-duty.",
    objectives: [
      o("pae-1", "Examine 10+ neonates including new-born resuscitation observation", "skill"),
      o("pae-2", "Plot and interpret growth charts", "skill"),
      o("pae-3", "National Immunisation Schedule — administer 1 session under supervision", "procedure"),
      o("pae-4", "Recognise/manage paediatric emergencies: severe dehydration, seizures, severe pneumonia", "knowledge"),
      o("pae-5", "Conduct 5 paediatric OPD case write-ups", "case"),
    ],
  },
  DVL: {
    deptCode: "DVL",
    deptName: "Dermatology, Venereology & Leprosy",
    weeks: 1,
    introduction: "Skin examination, common dermatoses, STI counselling, leprosy diagnosis and DOTS.",
    objectives: [
      o("dvl-1", "Examine 10+ patients with common skin conditions", "skill"),
      o("dvl-2", "STI history-taking and counselling", "skill"),
      o("dvl-3", "Identify hypopigmented patches and perform sensation testing", "skill"),
    ],
  },
  FOR: {
    deptCode: "FOR",
    deptName: "Forensic Medicine",
    weeks: 1,
    introduction: "Medico-legal case (MLC) handling, post-mortem observation, certifications, court summons handling.",
    objectives: [
      o("for-1", "Observe 2+ post-mortem examinations", "case"),
      o("for-2", "MLC report writing under supervision", "skill"),
      o("for-3", "Wound certificate, age estimation report drafting", "skill"),
      o("for-4", "Drunkenness certification protocol", "knowledge"),
    ],
  },
  LAB: {
    deptCode: "LAB",
    deptName: "Lab Medicine",
    weeks: 1,
    introduction: "Specimen handling, basic haematology, microbiology, biochemistry interpretation.",
    objectives: [
      o("lab-1", "Perform peripheral smear preparation and identify common findings", "skill"),
      o("lab-2", "Urine routine and microscopy", "procedure"),
      o("lab-3", "Gram stain and AFB stain interpretation", "skill"),
      o("lab-4", "Pre-analytical / analytical / post-analytical error awareness", "knowledge"),
    ],
  },
};

// Public utility — fetch logbook for a dept (returns null if not yet entered).
export function getLogbook(deptCode: string): DeptLogbook | undefined {
  return LOGBOOKS[deptCode];
}

// Universally-applicable learning resources surfaced to the student.
export const LEARNING_RESOURCES = [
  {
    title: "NMC Internship Regulations 2021 (Gazette)",
    description: "Full text of UGMEB/NMC/RULES & REGULATIONS/2021 dated 18.11.2021 — the canonical reference for all CRMI postings.",
    url: "https://www.nmc.org.in/",
    tag: "Regulation",
  },
  {
    title: "WHO Patient Safety Curriculum Guide",
    description: "Multi-professional patient safety modules — strongly recommended for all clinical postings.",
    url: "https://www.who.int/teams/integrated-health-services/patient-safety",
    tag: "Patient Safety",
  },
  {
    title: "BLS / ACLS Practice — Indian Resuscitation Council",
    description: "Refresher modules and rhythm-recognition drills before Emergency, Anaesthesia and Casualty postings.",
    url: "https://www.indianresuscitationcouncil.org/",
    tag: "Emergency",
  },
  {
    title: "Operational Guidelines — National Health Programmes (NHM)",
    description: "RBSK, RKSK, JSY, RNTCP, NLEP and other programmes for Community Medicine.",
    url: "https://nhm.gov.in/",
    tag: "Public Health",
  },
  {
    title: "Yenepoya Hospital Internship Logbook (PDF)",
    description: "Institution-specific procedure log — kindly carry the physical book to every posting for HOD sign-off.",
    url: "#",
    tag: "Yenepoya",
  },
];
