import { prisma } from '../utils/prisma';
import { maskAccount, maskAadhaar } from '../utils/masking';

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: {
        include: {
          academicProfile: true,
          documents: {
            where: { isDeleted: false },
            orderBy: { createdAt: 'desc' },
          },
          applications: {
            include: { scheme: true },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          payments: {
            include: { scheme: true },
            orderBy: { paymentDate: 'desc' },
            take: 5,
          },
        },
      },
    },
  });

  if (!user?.studentProfile) throw Object.assign(new Error('Profile not found'), { statusCode: 404 });

  const profile = user.studentProfile;
  return {
    ...profile,
    aadhaarMasked: profile.aadhaarMasked,
    bankAccountMasked: profile.bankAccountMasked ? maskAccount(profile.bankAccountMasked) : null,
    documents: profile.documents.map((d) => ({
      id: d.id,
      documentType: d.documentType,
      documentName: d.documentName,
      status: d.status,
      isReusable: d.isReusable,
      issuedDate: d.issuedDate,
      expiryDate: d.expiryDate,
      verificationSource: d.verificationSource,
      lastVerifiedAt: d.lastVerifiedAt,
    })),
    verificationSummary: buildVerificationSummary(profile.documents),
    documentsStats: {
      total: profile.documents.length,
      verified: profile.documents.filter((d) => d.status === 'VERIFIED').length,
      pending: profile.documents.filter((d) => d.status === 'PENDING').length,
      reusable: profile.documents.filter((d) => d.isReusable).length,
    },
  };
}

function buildVerificationSummary(documents: any[]) {
  const types = ['ST_CERTIFICATE', 'INCOME', 'AADHAAR', 'MARKSHEET', 'INSTITUTION', 'BANK', 'DOMICILE'];
  return types.map((type) => {
    const doc = documents.find((d) => d.documentType === type && !d.isDeleted);
    return {
      type,
      label: getDocLabel(type),
      status: doc ? doc.status : 'NOT_UPLOADED',
      lastVerifiedAt: doc?.lastVerifiedAt || null,
    };
  });
}

function getDocLabel(type: string): string {
  const labels: Record<string, string> = {
    ST_CERTIFICATE: 'ST Certificate',
    INCOME: 'Income Certificate',
    AADHAAR: 'Aadhaar',
    MARKSHEET: 'Academic Marksheet',
    INSTITUTION: 'Institution Proof',
    BANK: 'Bank Account',
    DOMICILE: 'Domicile Certificate',
  };
  return labels[type] || type;
}

export async function updateProfile(userId: string, data: any) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { studentProfile: true },
  });

  if (!user?.studentProfile) throw Object.assign(new Error('Profile not found'), { statusCode: 404 });

  const { academicProfile, ...profileData } = data;

  // Update main profile
  const updated = await prisma.studentProfile.update({
    where: { userId },
    data: {
      ...profileData,
      profileCompletion: calculateCompletion({ ...user.studentProfile, ...profileData }),
    },
  });

  // Update academic profile if provided
  if (academicProfile) {
    await prisma.academicProfile.upsert({
      where: { studentProfileId: updated.id },
      create: { studentProfileId: updated.id, ...academicProfile },
      update: academicProfile,
    });
  }

  return getProfile(userId);
}

function calculateCompletion(profile: any): number {
  const fields = [
    profile.fullName, profile.dateOfBirth, profile.gender, profile.mobile,
    profile.state, profile.district, profile.studentType, profile.annualFamilyIncome,
    profile.bankAccountMasked, profile.aadhaarMasked,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

export async function getReadiness(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: {
        include: {
          documents: { where: { isDeleted: false } },
          academicProfile: true,
        },
      },
    },
  });

  if (!user?.studentProfile) throw Object.assign(new Error('Profile not found'), { statusCode: 404 });

  const profile = user.studentProfile;
  const docs = profile.documents;

  const profileScore = profile.profileCompletion;
  const verifiedDocs = docs.filter((d) => d.status === 'VERIFIED').length;
  const docScore = Math.min(100, (verifiedDocs / 5) * 100);
  const academicScore = profile.academicProfile ? 100 : 0;
  const bankScore = profile.bankVerified ? 100 : 0;

  const overall = Math.round((profileScore * 0.3) + (docScore * 0.3) + (academicScore * 0.2) + (bankScore * 0.2));

  const actions: string[] = [];
  if (profileScore < 100) actions.push('Complete your personal profile');
  if (!profile.academicProfile) actions.push('Add academic details');
  if (!profile.bankVerified) actions.push('Verify your bank account for DBT');
  const expiringDocs = docs.filter((d) => {
    if (!d.expiryDate) return false;
    const expiry = new Date(d.expiryDate);
    const daysLeft = (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysLeft < 60 && daysLeft > 0;
  });
  if (expiringDocs.length > 0) {
    actions.push(`${expiringDocs.length} document(s) expiring soon — renew them`);
  }

  const items = [
    { label: 'Profile completeness', score: profileScore, status: profileScore === 100 ? 'COMPLETE' : 'INCOMPLETE' },
    { label: 'Verified documents', score: docScore, status: verifiedDocs >= 4 ? 'COMPLETE' : 'INCOMPLETE' },
    { label: 'Academic information', score: academicScore, status: profile.academicProfile ? 'COMPLETE' : 'MISSING' },
    { label: 'Bank / DBT readiness', score: bankScore, status: profile.bankVerified ? 'COMPLETE' : 'MISSING' },
  ];

  // Update stored readiness score
  await prisma.studentProfile.update({
    where: { userId },
    data: { readinessScore: overall },
  });

  return { score: overall, items, actions, disclaimer: 'This is not an official score. It reflects application preparedness based on available information.' };
}
