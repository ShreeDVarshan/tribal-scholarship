export type SchemeCode = 'PRE_MATRIC' | 'POST_MATRIC' | 'TOP_CLASS' | 'NFST' | 'NOS';

export type StudentType = 'SCHOOL' | 'COLLEGE' | 'RESEARCH' | 'OVERSEAS';

export type ApplicationStage =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IDENTITY_VERIFICATION'
  | 'DOCUMENT_VERIFICATION'
  | 'INSTITUTION_VERIFICATION'
  | 'DEPARTMENT_VERIFICATION'
  | 'SANCTIONED'
  | 'DBT_PROCESSING'
  | 'DISBURSED'
  | 'DEFICIENCY'
  | 'REJECTED';

export type VerificationState = 'VERIFIED' | 'PENDING' | 'MISMATCH' | 'FAILED' | 'MANUAL_REVIEW';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface SchemeMetadata {
  code: SchemeCode;
  name: string;
  shortName: string;
  description: string;
  ministry: string;
  department: string;
  targetGroup: string;
  maxAmount: number;
  fundingType: 'CENTRAL' | 'STATE_SHARED';
  portalSource: 'NSP' | 'SFMP' | 'NOS_PORTAL';
}
