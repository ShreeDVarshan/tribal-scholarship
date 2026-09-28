import { prisma } from '../utils/prisma';

export interface VerificationInput {
  documentId: string;
  documentType: string;
  studentProfileId: string;
}

export interface VerificationResult {
  status: 'VERIFIED' | 'PENDING' | 'MISMATCH' | 'FAILED' | 'MANUAL_REVIEW';
  source: string;
  confidence: number;
  reason: string;
  timestamp: string;
}

// Simulated delay to feel realistic
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Deterministic result based on document ID (for consistent demo)
function getDeterministicResult(documentId: string): 'VERIFIED' | 'MISMATCH' {
  // Most documents verify successfully; use last char to occasionally fail
  const lastChar = documentId.slice(-1);
  return lastChar === 'f' ? 'MISMATCH' : 'VERIFIED';
}

const ADAPTER_MAP: Record<string, { name: string; source: string }> = {
  ST_CERTIFICATE: { name: 'EDISTRICT', source: 'e-District Demo Integration' },
  INCOME: { name: 'EDISTRICT', source: 'e-District Demo Integration' },
  AADHAAR: { name: 'UIDAI', source: 'UIDAI Demo Integration' },
  MARKSHEET: { name: 'APAAR', source: 'APAAR Demo Integration' },
  INSTITUTION: { name: 'UDISE', source: 'UDISE+ Demo Integration' },
  BANK: { name: 'NSP', source: 'NSP Demo Integration' },
  DOMICILE: { name: 'EDISTRICT', source: 'e-District Demo Integration' },
  RESEARCH: { name: 'UGC', source: 'UGC Demo Integration' },
  DISABILITY: { name: 'EDISTRICT', source: 'e-District Demo Integration' },
};

export async function verifyDocument(input: VerificationInput): Promise<VerificationResult> {
  const adapter = ADAPTER_MAP[input.documentType] || { name: 'DIGILOCKER', source: 'DigiLocker Demo Integration' };

  // Simulate real processing time
  await delay(700 + Math.random() * 800);

  const resultStatus = getDeterministicResult(input.documentId);
  const confidence = resultStatus === 'VERIFIED' ? 0.92 + Math.random() * 0.08 : 0.3;
  const reason = resultStatus === 'VERIFIED'
    ? 'Document successfully matched with source records'
    : 'Document details could not be fully matched. Manual review may be required.';

  const result: VerificationResult = {
    status: resultStatus === 'MISMATCH' ? 'MANUAL_REVIEW' : 'VERIFIED',
    source: adapter.source,
    confidence,
    reason,
    timestamp: new Date().toISOString(),
  };

  // Log integration call
  await prisma.integrationLog.create({
    data: {
      adapter: adapter.name,
      operation: 'VERIFY_DOCUMENT',
      status: result.status === 'VERIFIED' ? 'SUCCESS' : 'FAILED',
      requestData: JSON.stringify({ documentType: input.documentType }),
      responseData: JSON.stringify({ status: result.status, source: result.source }),
      durationMs: Math.floor(700 + Math.random() * 800),
    },
  });

  // Update document status
  await prisma.document.update({
    where: { id: input.documentId },
    data: {
      status: result.status,
      verificationSource: result.source,
      lastVerifiedAt: new Date(),
      isReusable: result.status === 'VERIFIED',
    },
  });

  // Create verification record
  await prisma.documentVerification.create({
    data: {
      documentId: input.documentId,
      status: result.status,
      source: result.source,
      confidence: result.confidence,
      reason: result.reason,
      rawResponse: JSON.stringify({ adapter: adapter.name, timestamp: result.timestamp }),
    },
  });

  return result;
}

export async function getIntegrationStatuses() {
  return [
    { adapter: 'DigiLocker', status: 'MOCK', description: 'Demo Integration', icon: '📂' },
    { adapter: 'UIDAI', status: 'MOCK', description: 'Demo Integration', icon: '🪪' },
    { adapter: 'APAAR', status: 'MOCK', description: 'Demo Integration', icon: '🎓' },
    { adapter: 'UDISE+', status: 'MOCK', description: 'Demo Integration', icon: '🏫' },
    { adapter: 'e-District', status: 'MOCK', description: 'Demo Integration', icon: '📋' },
    { adapter: 'UGC', status: 'MOCK', description: 'Demo Integration', icon: '🔬' },
    { adapter: 'NSP', status: 'MOCK', description: 'Demo Integration (NSP connector)', icon: '🌐' },
    { adapter: 'SFMP', status: 'MOCK', description: 'Demo Integration (SFMP connector)', icon: '🌐' },
    { adapter: 'NOS Portal', status: 'MOCK', description: 'Demo Integration (NOS connector)', icon: '✈️' },
  ];
}
