// Intent types for JAGO's structured fallback
export type JagoIntent =
  | 'APPLICATION_STATUS'
  | 'DOCUMENTS'
  | 'ELIGIBILITY'
  | 'PAYMENT'
  | 'PROFILE'
  | 'GENERAL_FAQ'
  | 'HELP'
  | 'GREETING';

const intentKeywords: Record<JagoIntent, string[]> = {
  APPLICATION_STATUS: [
    'application', 'status', 'pending', 'submitted', 'approved', 'rejected',
    'deficiency', 'sanctioned', 'disbursed', 'verification', 'apply', 'applied',
    'when will', 'how long', 'delay', 'process', 'stage',
  ],
  DOCUMENTS: [
    'document', 'certificate', 'upload', 'file', 'income', 'marksheet',
    'aadhaar', 'bank', 'domicile', 'missing', 'expired', 'verify document',
    'st certificate', 'institution proof',
  ],
  ELIGIBILITY: [
    'eligible', 'eligibility', 'qualify', 'qualified', 'criteria', 'requirement',
    'can i apply', 'am i', 'who can', 'income limit', 'scholarship for me',
  ],
  PAYMENT: [
    'payment', 'paid', 'money', 'amount', 'rupees', 'dbt', 'credit', 'credited',
    'disbursed', 'when', 'transfer', 'bank', 'receive',
  ],
  PROFILE: [
    'profile', 'update', 'edit', 'personal', 'information', 'complete',
    'readiness', 'score', 'percentage', 'details', 'name', 'address',
  ],
  GENERAL_FAQ: [
    'what is', 'how does', 'explain', 'tell me about', 'pre-matric', 'post-matric',
    'top class', 'nfst', 'nos', 'fellowship', 'overseas', 'scholarship',
    'ministry', 'tribal affairs', 'scheme', 'difference between',
  ],
  HELP: [
    'help', 'how to', 'where', 'navigate', 'find', 'use', 'app', 'guide', 'tutorial',
  ],
  GREETING: [
    'hello', 'hi', 'hey', 'good morning', 'good evening', 'namaste', 'vanakkam',
  ],
};

export function detectIntent(message: string): JagoIntent {
  const lower = message.toLowerCase();
  const scores: Record<JagoIntent, number> = {
    APPLICATION_STATUS: 0,
    DOCUMENTS: 0,
    ELIGIBILITY: 0,
    PAYMENT: 0,
    PROFILE: 0,
    GENERAL_FAQ: 0,
    HELP: 0,
    GREETING: 0,
  };

  for (const [intent, keywords] of Object.entries(intentKeywords) as [JagoIntent, string[]][]) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        scores[intent] += 1;
      }
    }
  }

  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'GENERAL_FAQ';

  return (Object.entries(scores) as [JagoIntent, number][])
    .find(([, score]) => score === maxScore)![0];
}
