// Student list for MBBS 2021 CBME Batch — Yenepoya Medical College
// Extracted from official YMC intern list (22.05.2026).
export type Student = {
  slNo: number;
  name: string;
  regNo: string;
  campusId: string; // alias of regNo for login
  phone?: string;
  email?: string;
};

// Demo / tester credentials — for QA only. Any of these resolves to the demo student.
// In production: remove this and route credentials through institutional SSO.
export const DEMO_LOGIN = {
  phones: ["9449499659"],
  emails: ["hemaraja@yenepoya.edu.in"],
};

const raw: Array<[string, string]> = [
  ["A P Devika Rajeesh", "21M001"],
  ["A Umair Ahmed", "21M002"],
  ["Aaliya Nargis N", "21M003"],
  ["Aaryank Arunkumar", "21M004"],
  ["Adhya Vinod", "21M007"],
  ["Afna A Kader", "21M009"],
  ["Aiswarya G Krishnan", "21M011"],
  ["Akash Prasad Kudlu", "21M012"],
  ["Akifa Zainab", "21M013"],
  ["Aksharatmaja A M", "21M014"],
  ["Alaina Pasha", "21M015"],
  ["Alina Safar", "21M016"],
  ["Amaan Abdul Rauf Shaikh", "21M017"],
  ["Anjali Radhakrishnan", "21M019"],
  ["Ann John", "21M020"],
  ["Anshika Singh", "21M021"],
  ["Ardra Manoharan", "21M022"],
  ["Arush UL Islam", "21M023"],
  ["Ashik N", "21M024"],
  ["Asna Ashraf K P", "21M025"],
  ["Aysha Ashiq Mohammad", "21M026"],
  ["Badhriya Hassan", "21M027"],
  ["Bharath S Kumar", "21M028"],
  ["Deepthi B N", "21M029"],
  ["Dhanyatha C S", "21M030"],
  ["Diya Fathima", "21M031"],
  ["Diya Suhail", "21M032"],
  ["Eram Fatima", "21M033"],
  ["Esha Sultana M B", "21M034"],
  ["Fairuza Haris Thangal", "21M035"],
  ["Fareeha Rahman Chemnad Lasiath", "21M036"],
  ["Farhana Basheer", "21M038"],
  ["Fathima Hanna", "21M039"],
  ["Fathima Jumana", "21M040"],
  ["Fathima Safna", "21M041"],
  ["Fathima Shezna K P", "21M042"],
  ["Fathima Sithiq", "21M043"],
  ["Fathimath Riza", "21M045"],
  ["Haneena Jabeen C", "21M049"],
  ["Helga Sudiptha", "21M051"],
  ["Henna Sideeque", "21M052"],
  ["Hiba Thalangara", "21M053"],
  ["Hrishab Hegde", "21M054"],
  ["Insha Sanover", "21M055"],
  ["Iresha Mariola Menezes", "21M056"],
  ["Ishwar V Bhargava", "21M057"],
  ["Jetty Venkata Naresh", "21M058"],
  ["Joanna Abey Kurian", "21M059"],
  ["Joseph George Kannath", "21M060"],
  ["Karthik S S", "21M062"],
  ["Keerthana R", "21M063"],
  ["Khan Arshiya Elyas", "21M064"],
  ["Khushi Aralikatti", "21M065"],
  ["Khushi Singh", "21M066"],
  ["Labeeba Raoof", "21M067"],
  ["Lamiyah Mariyam", "21M068"],
  ["M Kandharva Sanjeevan", "21M069"],
  ["Maisha Mariyam", "21M070"],
  ["Malvika S Kumar", "21M071"],
  ["Manoj G", "21M072"],
  ["Martha Joseph", "21M073"],
  ["Maryam Zubair Burud", "21M074"],
  ["Md Haji Ahmed", "21M075"],
  ["Meghana I", "21M076"],
  ["Mehnish A Latheef", "21M077"],
  ["Mohamed Hilal", "21M078"],
  ["Mohammed Aatif Sattar", "21M079"],
  ["Mohammed Azeezulla Shariff", "21M080"],
  ["Mohammed Kaif", "21M081"],
  ["Mohammed Rizwan K", "21M082"],
  ["Mohammed Sahal", "21M083"],
  ["Mohammed Uzair C M", "21M084"],
  ["Mudaseer A H", "21M085"],
  ["Muhammed Shalik C P", "21M087"],
  ["Muhuzina Noushad", "21M089"],
  ["Musthafa Noor Bin Shameem", "21M090"],
  ["Nifal Ashraf", "21M093"],
  ["Nihal Abdul Basheer", "21M094"],
  ["Nimisha Aboobacker", "21M096"],
  ["Ninsha Noor Mohammed", "21M097"],
  ["Niranjana Unnikrishnan", "21M098"],
  ["Nischitha D H", "21M099"],
  ["Nisita Pathak", "21M100"],
  ["Nithya Sharvari S D", "21M101"],
  ["Nizamuddin M Nadaf", "21M102"],
  ["Noorjahan Shahanas", "21M103"],
  ["Rachan K", "21M106"],
  ["Rawana", "21M108"],
  ["Rayan Moosa C", "21M109"],
  ["Riya Sunny", "21M111"],
  ["Ruqayya Kobatte", "21M112"],
  ["Sana Hasan Fatima Jahir Hussain", "21M114"],
  ["Sandra Sebastian", "21M116"],
  ["Saniyya Ayesha Hussain", "21M117"],
  ["Sarfaraz Muhammad", "21M119"],
  ["Sharmitha Umamagudesh", "21M128"],
  ["Shayna Tessa George", "21M129"],
  ["Shaza Hassan", "21M130"],
  ["Shiksha Shavarn", "21M132"],
  ["Shrilakshmi A Tumbagi", "21M134"],
  ["Shrutika Dhula Shendage", "21M135"],
  ["Sruthi P", "21M137"],
  ["Stanley John Sunny", "21M138"],
  ["Suhas K N", "21M139"],
  ["Sumanth M", "21M140"],
  ["Sumit Vishwakarma", "21M141"],
  ["Surya S", "21M142"],
  ["Suzan Padarshi", "21M143"],
  ["Tanisha Thaju", "21M144"],
  ["Tarun P Holla", "21M145"],
  ["Tejaswini B Surya", "21M146"],
  ["Tharun R Hegde", "21M147"],
  ["Umm E Hani", "21M148"],
];

export const STUDENTS: Student[] = raw.map(([name, regNo], i) => ({
  slNo: i + 1,
  name,
  regNo,
  campusId: regNo,
  // Demo credentials attached to the first roll number for QA login.
  // Remove or replace with real institutional contact records in production.
  phone: i === 0 ? DEMO_LOGIN.phones[0] : undefined,
  email: i === 0 ? DEMO_LOGIN.emails[0] : undefined,
}));

export function findStudent(query: string): Student | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  // Demo credentials → resolve to the first roll number so any tester can browse the portal.
  if (DEMO_LOGIN.phones.includes(q) || DEMO_LOGIN.emails.includes(q)) {
    return STUDENTS[0];
  }
  return STUDENTS.find(
    (s) =>
      s.regNo.toLowerCase() === q ||
      s.campusId.toLowerCase() === q ||
      s.name.toLowerCase() === q ||
      (s.phone && s.phone === q) ||
      (s.email && s.email.toLowerCase() === q)
  );
}
