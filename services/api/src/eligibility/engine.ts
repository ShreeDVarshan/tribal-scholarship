import { StudentProfile, AcademicProfile, Document, ScholarshipApplication } from '@prisma/client';

export interface EligibilityInput {
  studentProfile: StudentProfile & {
    academicProfile: AcademicProfile | null;
  };
  documents: Document[];
  existingApplications: ScholarshipApplication[];
}

export type EligibilityStatus = 'ELIGIBLE' | 'NEEDS_REVIEW' | 'NOT_ELIGIBLE' | 'NEEDS_INFORMATION';

export interface EligibilityResult {
  schemeId: string;
  schemeCode: string;
  schemeName: string;
  status: EligibilityStatus;
  reasons: string[];
  missingRequirements: string[];
  warnings: string[];
  preliminaryNote: string;
}

// Top class approved institution keywords
const TOP_CLASS_INSTITUTIONS = [
  'iit', 'nit', 'aiims', 'iim', 'national law', 'iisc', 'tiss', 'xlri',
  'nift', 'nid', 'iiit', 'central university', 'jnu', 'bhu', 'du',
  'jamia', 'hyderabad university', 'amu', 'eflu',
];

function hasVerifiedDocument(documents: Document[], type: string): boolean {
  return documents.some((d) => d.documentType === type && d.status === 'VERIFIED' && !d.isDeleted);
}

function hasDocument(documents: Document[], type: string): boolean {
  return documents.some((d) => d.documentType === type && !d.isDeleted);
}

function hasActiveApplicationForScheme(
  applications: ScholarshipApplication[],
  schemeCode: string
): boolean {
  return applications.some(
    (a) =>
      a.status !== 'REJECTED' &&
      a.status !== 'DRAFT'
  );
}

export async function checkEligibility(
  input: EligibilityInput,
  schemes: Array<{ id: string; code: string; name: string }>
): Promise<EligibilityResult[]> {
  const { studentProfile, documents, existingApplications } = input;
  const academic = studentProfile.academicProfile;

  const results: EligibilityResult[] = [];
  const NOTE = '⚠️ This is a preliminary assessment only. Final eligibility is subject to official verification by the relevant authority.';

  for (const scheme of schemes) {
    let result: EligibilityResult;

    switch (scheme.code) {
      case 'PRE_MATRIC':
        result = checkPreMatric(studentProfile, academic, documents, existingApplications, scheme, NOTE);
        break;
      case 'POST_MATRIC':
        result = checkPostMatric(studentProfile, academic, documents, existingApplications, scheme, NOTE);
        break;
      case 'TOP_CLASS':
        result = checkTopClass(studentProfile, academic, documents, existingApplications, scheme, NOTE);
        break;
      case 'NFST':
        result = checkNFST(studentProfile, academic, documents, existingApplications, scheme, NOTE);
        break;
      case 'NOS':
        result = checkNOS(studentProfile, academic, documents, existingApplications, scheme, NOTE);
        break;
      default:
        result = {
          schemeId: scheme.id,
          schemeCode: scheme.code,
          schemeName: scheme.name,
          status: 'NEEDS_INFORMATION',
          reasons: [],
          missingRequirements: ['Scheme rules not configured'],
          warnings: [],
          preliminaryNote: NOTE,
        };
    }

    results.push(result);
  }

  return results;
}

function checkPreMatric(
  profile: StudentProfile,
  academic: AcademicProfile | null,
  documents: Document[],
  applications: ScholarshipApplication[],
  scheme: { id: string; code: string; name: string },
  note: string
): EligibilityResult {
  const reasons: string[] = [];
  const missing: string[] = [];
  const warnings: string[] = [];

  // ST status
  if (profile.isSTCertified) {
    reasons.push('ST status confirmed');
  } else {
    missing.push('ST/Caste certificate required');
  }

  // Academic level check — must be SCHOOL
  if (profile.studentType === 'SCHOOL') {
    reasons.push('Academic level matches (Class 9-10)');
  } else {
    missing.push('Pre-Matric is only for Class 9-10 students');
  }

  // Income
  if (profile.annualFamilyIncome && profile.annualFamilyIncome <= 250000) {
    reasons.push(`Annual income within limit (₹${profile.annualFamilyIncome.toLocaleString('en-IN')})`);
  } else if (!profile.annualFamilyIncome) {
    missing.push('Annual family income information required');
  } else {
    missing.push('Annual family income exceeds ₹2,50,000 limit');
  }

  // Documents
  if (hasDocument(documents, 'ST_CERTIFICATE')) {
    if (hasVerifiedDocument(documents, 'ST_CERTIFICATE')) {
      reasons.push('ST Certificate available and verified');
    } else {
      warnings.push('ST Certificate uploaded but not yet verified');
    }
  } else {
    missing.push('ST Certificate not uploaded');
  }

  if (hasDocument(documents, 'INCOME')) {
    reasons.push('Income Certificate available');
  } else {
    warnings.push('Income Certificate not uploaded');
  }

  const status: EligibilityStatus =
    missing.length === 0 ? 'ELIGIBLE' :
    missing.some((m) => m.includes('Pre-Matric is only')) ? 'NOT_ELIGIBLE' :
    'NEEDS_INFORMATION';

  return { schemeId: scheme.id, schemeCode: scheme.code, schemeName: scheme.name, status, reasons, missingRequirements: missing, warnings, preliminaryNote: note };
}

function checkPostMatric(
  profile: StudentProfile,
  academic: AcademicProfile | null,
  documents: Document[],
  applications: ScholarshipApplication[],
  scheme: { id: string; code: string; name: string },
  note: string
): EligibilityResult {
  const reasons: string[] = [];
  const missing: string[] = [];
  const warnings: string[] = [];

  // ST status
  if (profile.isSTCertified) {
    reasons.push('ST status confirmed');
  } else {
    missing.push('ST certification required');
  }

  // Academic level — must be COLLEGE or RESEARCH (not SCHOOL, not OVERSEAS)
  if (profile.studentType === 'COLLEGE' || profile.studentType === 'RESEARCH') {
    reasons.push('Academic level matches (Post-matriculation)');
  } else if (profile.studentType === 'SCHOOL') {
    missing.push('Post-Matric is for 11th class and above (not applicable to school students)');
  } else if (profile.studentType === 'OVERSEAS') {
    missing.push('Post-Matric is for domestic institutions (see National Overseas Scholarship for abroad)');
  }

  // Income
  if (profile.annualFamilyIncome && profile.annualFamilyIncome <= 250000) {
    reasons.push(`Annual income within limit (₹${profile.annualFamilyIncome.toLocaleString('en-IN')})`);
  } else if (!profile.annualFamilyIncome) {
    missing.push('Annual family income information required');
  } else {
    missing.push('Annual family income exceeds ₹2,50,000 limit');
  }

  // Institution
  if (academic) {
    reasons.push('Institution information available');
    if (academic.institutionName) {
      reasons.push(`Enrolled at ${academic.institutionName}`);
    }
  } else {
    missing.push('Academic profile (institution details) required');
  }

  // Documents
  if (hasVerifiedDocument(documents, 'ST_CERTIFICATE')) {
    reasons.push('ST Certificate verified');
  } else if (hasDocument(documents, 'ST_CERTIFICATE')) {
    warnings.push('ST Certificate uploaded but not yet verified');
  } else {
    missing.push('ST Certificate not uploaded');
  }

  if (hasVerifiedDocument(documents, 'INCOME')) {
    reasons.push('Income Certificate verified');
  } else if (hasDocument(documents, 'INCOME')) {
    warnings.push('Income Certificate uploaded but not yet verified');
  } else {
    missing.push('Income Certificate not uploaded');
  }

  if (hasVerifiedDocument(documents, 'MARKSHEET')) {
    reasons.push('Academic marksheet available');
  } else {
    warnings.push('Upload last year\'s marksheet to strengthen application');
  }

  const isBlockedByType = missing.some(
    (m) => m.includes('not applicable') || m.includes('domestic institutions')
  );

  const status: EligibilityStatus =
    isBlockedByType ? 'NOT_ELIGIBLE' :
    missing.length === 0 ? 'ELIGIBLE' :
    missing.some((m) => m.includes('exceeds')) ? 'NOT_ELIGIBLE' :
    'NEEDS_INFORMATION';

  return { schemeId: scheme.id, schemeCode: scheme.code, schemeName: scheme.name, status, reasons, missingRequirements: missing, warnings, preliminaryNote: note };
}

function checkTopClass(
  profile: StudentProfile,
  academic: AcademicProfile | null,
  documents: Document[],
  applications: ScholarshipApplication[],
  scheme: { id: string; code: string; name: string },
  note: string
): EligibilityResult {
  const reasons: string[] = [];
  const missing: string[] = [];
  const warnings: string[] = [];

  // ST status
  if (profile.isSTCertified) {
    reasons.push('ST status confirmed');
  } else {
    missing.push('ST certification required');
  }

  // Institution type
  if (academic) {
    const instLower = academic.institutionName.toLowerCase();
    const isTopInstitution = TOP_CLASS_INSTITUTIONS.some((kw) => instLower.includes(kw))
      || academic.institutionType === 'IIT_NIT'
      || academic.institutionType === 'CENTRAL_UNIV';

    if (isTopInstitution) {
      reasons.push('Institution appears to be in the approved top institutions list');
    } else {
      warnings.push('Institution must be in the approved list (IIT/NIT/AIIMS/IIM/Central Universities etc.) — verify with scheme guidelines');
    }
  } else {
    missing.push('Institution information required to verify eligibility');
  }

  // Income
  if (profile.annualFamilyIncome && profile.annualFamilyIncome <= 600000) {
    reasons.push(`Annual income within limit (₹${profile.annualFamilyIncome.toLocaleString('en-IN')})`);
  } else if (!profile.annualFamilyIncome) {
    missing.push('Annual family income information required');
  } else {
    missing.push('Annual family income exceeds ₹6,00,000 limit');
  }

  // Must be COLLEGE level
  if (profile.studentType === 'COLLEGE' || profile.studentType === 'RESEARCH') {
    reasons.push('Academic level eligible');
  } else {
    missing.push('Must be studying at UG/PG level in an approved institution');
  }

  const status: EligibilityStatus =
    missing.length > 0 ? 'NEEDS_INFORMATION' :
    warnings.length > 0 ? 'NEEDS_REVIEW' :
    'ELIGIBLE';

  return { schemeId: scheme.id, schemeCode: scheme.code, schemeName: scheme.name, status, reasons, missingRequirements: missing, warnings, preliminaryNote: note };
}

function checkNFST(
  profile: StudentProfile,
  academic: AcademicProfile | null,
  documents: Document[],
  applications: ScholarshipApplication[],
  scheme: { id: string; code: string; name: string },
  note: string
): EligibilityResult {
  const reasons: string[] = [];
  const missing: string[] = [];
  const warnings: string[] = [];

  // ST status
  if (profile.isSTCertified) {
    reasons.push('ST status confirmed');
  } else {
    missing.push('ST certification required');
  }

  // Must be research scholar
  if (profile.studentType === 'RESEARCH') {
    reasons.push('Research scholar status confirmed');
    if (academic) {
      reasons.push(`Course: ${academic.course}`);
    }
  } else {
    missing.push('NFST is for MPhil/PhD research scholars only');
  }

  // Income check
  if (profile.annualFamilyIncome && profile.annualFamilyIncome <= 600000) {
    reasons.push('Income within eligible range');
  } else if (!profile.annualFamilyIncome) {
    missing.push('Income information required');
  } else {
    warnings.push('Income above general threshold — verify with scheme guidelines');
  }

  const isResearch = profile.studentType === 'RESEARCH';
  const status: EligibilityStatus = !isResearch
    ? 'NOT_ELIGIBLE'
    : missing.length > 0
    ? 'NEEDS_INFORMATION'
    : 'ELIGIBLE';

  return { schemeId: scheme.id, schemeCode: scheme.code, schemeName: scheme.name, status, reasons, missingRequirements: missing, warnings, preliminaryNote: note };
}

function checkNOS(
  profile: StudentProfile,
  academic: AcademicProfile | null,
  documents: Document[],
  applications: ScholarshipApplication[],
  scheme: { id: string; code: string; name: string },
  note: string
): EligibilityResult {
  const reasons: string[] = [];
  const missing: string[] = [];
  const warnings: string[] = [];

  // ST status
  if (profile.isSTCertified) {
    reasons.push('ST status confirmed');
  } else {
    missing.push('ST certification required');
  }

  // Must be overseas applicant
  if (profile.studentType === 'OVERSEAS') {
    reasons.push('Overseas study applicant status confirmed');
  } else {
    missing.push('NOS is for students pursuing higher education abroad');
  }

  // Income
  if (profile.annualFamilyIncome && profile.annualFamilyIncome <= 600000) {
    reasons.push('Annual income within limit');
  } else if (!profile.annualFamilyIncome) {
    missing.push('Annual family income information required');
  } else {
    missing.push('Annual family income exceeds ₹6,00,000 limit');
  }

  const isOverseas = profile.studentType === 'OVERSEAS';
  const status: EligibilityStatus = !isOverseas
    ? 'NOT_ELIGIBLE'
    : missing.length > 0
    ? 'NEEDS_INFORMATION'
    : 'ELIGIBLE';

  return { schemeId: scheme.id, schemeCode: scheme.code, schemeName: scheme.name, status, reasons, missingRequirements: missing, warnings, preliminaryNote: note };
}
