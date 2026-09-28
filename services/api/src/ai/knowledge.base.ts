export const scholarshipKnowledgeBase = {
  PRE_MATRIC: {
    name: 'Pre-Matric Scholarship for ST Students',
    description: 'A centrally sponsored scheme to support ST students studying in classes 9 and 10.',
    targetGroup: 'Scheduled Tribe students in Class 9 and 10',
    generalEligibility: [
      'Must belong to Scheduled Tribe (ST) community',
      'Enrolled in Class 9 or Class 10',
      'Annual family income must not exceed ₹2,50,000',
      'Must be studying in a government-recognized school',
      'Should not be availing any other scholarship for the same purpose',
    ],
    documents: [
      'ST/Caste Certificate from competent authority',
      'Income Certificate from competent authority',
      'Previous year marksheet',
      'Aadhaar card',
      'Bank account details (student/guardian)',
      'Institution verification form',
    ],
    process: [
      'Register on National Scholarship Portal (NSP)',
      'Complete student profile and academic details',
      'Upload required documents',
      'Institution verifies application',
      'State authority reviews and sanctions',
      'Amount disbursed via DBT to bank account',
    ],
    faq: [
      { q: 'What is the amount for Pre-Matric?', a: 'Up to ₹3,500 per year for day scholars and ₹7,000 per year for hostellers.' },
      { q: 'When does the application open?', a: 'Applications typically open between July and October (Demo: exact dates vary by state). Check NSP for current dates.' },
      { q: 'Can I apply if I failed last year?', a: 'You must have passed the previous class to be eligible.' },
    ],
    warnings: ['This is prototype information. Always verify with official NSP or state authorities.'],
  },
  POST_MATRIC: {
    name: 'Post-Matric Scholarship for ST Students',
    description: 'A major scholarship scheme supporting ST students in post-matriculation courses including 11th, 12th, UG, PG, and professional courses.',
    targetGroup: 'Scheduled Tribe students studying at post-matriculation level',
    generalEligibility: [
      'Must belong to Scheduled Tribe (ST) community',
      'Studying in 11th class or above (including UG, PG, professional courses)',
      'Annual family income must not exceed ₹2,50,000',
      'Enrolled in a government-recognized institution',
      'Not receiving full scholarship from any other source',
    ],
    documents: [
      'ST/Caste Certificate',
      'Income Certificate',
      'Previous year marksheet/admit card',
      'Institution enrollment proof/bonafide certificate',
      'Aadhaar card',
      'Bank account details in student\'s name',
      'Fee receipts if applicable',
    ],
    process: [
      'Apply through National Scholarship Portal (NSP)',
      'Institution verifies enrollment and fee details',
      'State/Central verification',
      'Sanction by competent authority',
      'DBT disbursement to bank account',
    ],
    faq: [
      { q: 'What does Post-Matric cover?', a: 'Maintenance allowance and reimbursement of non-refundable fees. Amounts vary by course level and residential status.' },
      { q: 'Is income limit for parents or self?', a: 'It is the annual income of the student\'s parents/guardians, not the student\'s own income.' },
      { q: 'Can I apply for both Pre-Matric and Post-Matric?', a: 'No. You can only apply for one — whichever matches your current class level.' },
    ],
    warnings: ['This is prototype information. Verify with official NSP or Ministry of Tribal Affairs.'],
  },
  TOP_CLASS: {
    name: 'Top Class Education Scheme for ST Students',
    description: 'Provides quality higher education to meritorious ST students by supporting them in top-ranked institutions.',
    targetGroup: 'Meritorious ST students admitted to top-ranked colleges/universities',
    generalEligibility: [
      'Must belong to Scheduled Tribe (ST) community',
      'Admitted to one of the approved top institutions (IITs, NITs, AIIMS, Central Universities, IIMs, etc.)',
      'Annual family income must not exceed ₹6,00,000',
      'Must be pursuing an approved course at UG or PG level',
    ],
    documents: [
      'ST Certificate',
      'Income Certificate',
      'Admission letter from approved institution',
      'Fee structure from institution',
      'Marksheet of qualifying examination',
      'Aadhaar card',
      'Bank account details',
    ],
    faq: [
      { q: 'What institutions are covered?', a: 'IITs, NITs, AIIMS, IIMs, Central Universities, National Law Schools, and other government-approved premier institutions.' },
      { q: 'What is the maximum scholarship?', a: 'Up to ₹2,00,000 per year for tuition fees plus additional support for hostel, books, and other expenses.' },
    ],
    warnings: ['This is prototype information. Verify with SFMP or Ministry of Tribal Affairs.'],
  },
  NFST: {
    name: 'National Fellowship for ST Students (NFST)',
    description: 'Provides financial assistance to ST students pursuing MPhil and PhD degrees.',
    targetGroup: 'Scheduled Tribe research scholars pursuing MPhil/PhD',
    generalEligibility: [
      'Must belong to Scheduled Tribe (ST) community',
      'Pursuing MPhil or PhD in a recognized university',
      'Admitted through a regular selection process or qualified NET/JRF',
      'Age generally below 35 years (relaxable)',
      'Not receiving any other fellowship from UGC or other sources',
    ],
    documents: [
      'ST Certificate',
      'Admission letter/enrollment certificate',
      'NET/JRF certificate if applicable',
      'Research proposal/topic',
      'Supervisor\'s details',
      'Income Certificate',
      'Aadhaar card',
      'Bank account details',
    ],
    faq: [
      { q: 'What is the fellowship amount?', a: 'JRF: ₹25,000/month for first 2 years, then ₹28,000/month (SRF). Plus HRA and contingency grants.' },
      { q: 'For how long is the fellowship given?', a: 'Up to 5 years for PhD (2 years JRF + 3 years SRF).' },
    ],
    warnings: ['This is prototype information. Verify with SFMP portal or UGC guidelines.'],
  },
  NOS: {
    name: 'National Overseas Scholarship (NOS)',
    description: 'Supports meritorious ST students for pursuing Masters and PhD programmes at foreign universities.',
    targetGroup: 'Meritorious ST students pursuing higher education abroad',
    generalEligibility: [
      'Must belong to Scheduled Tribe (ST) community',
      'Age below 35 years',
      'Annual family income must not exceed ₹6,00,000',
      'Must have admission from a foreign university',
      'Should have valid IELTS/TOEFL or equivalent',
      'Bachelor\'s degree with minimum 55% marks',
    ],
    documents: [
      'ST Certificate',
      'Income Certificate',
      'Admission letter from overseas university',
      'Degree certificates with marksheets',
      'Passport',
      'IELTS/TOEFL/GRE scores',
      'Aadhaar card',
      'Bank account details',
    ],
    faq: [
      { q: 'What does NOS cover?', a: 'Tuition fees, maintenance allowance, airfare, visa charges, and other study-related expenses up to specified limits.' },
      { q: 'Which countries are eligible?', a: 'Most developed countries with recognized universities are eligible. The final list is approved by the Ministry.' },
    ],
    warnings: ['This is prototype information. Verify with the National Overseas Scholarship Portal.'],
  },
};

export type SchemeCode = keyof typeof scholarshipKnowledgeBase;

export function getSchemeInfo(code: SchemeCode) {
  return scholarshipKnowledgeBase[code];
}

export function getAllSchemes() {
  return Object.entries(scholarshipKnowledgeBase).map(([code, info]) => ({
    code,
    ...info,
  }));
}
