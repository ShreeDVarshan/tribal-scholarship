import { prisma } from '../utils/prisma';
import { checkEligibility } from '../eligibility/engine';

export async function checkEligibilityForUser(userId: string, answers?: any) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: {
        include: {
          academicProfile: true,
          documents: { where: { isDeleted: false } },
          applications: true,
        },
      },
    },
  });

  if (!user?.studentProfile) {
    throw Object.assign(new Error('Profile not found'), { statusCode: 404 });
  }

  // Apply overrides from eligibility checker answers
  let profile = user.studentProfile;
  if (answers) {
    profile = {
      ...profile,
      studentType: answers.studentType || profile.studentType,
      annualFamilyIncome: answers.income ? parseInt(answers.income) : profile.annualFamilyIncome,
      isSTCertified: answers.stStatus !== undefined ? answers.stStatus : profile.isSTCertified,
    };
    if (answers.institutionType && profile.academicProfile) {
      profile.academicProfile = {
        ...profile.academicProfile,
        institutionType: answers.institutionType,
      };
    }
  }

  const schemes = await prisma.scholarshipScheme.findMany({ where: { isActive: true } });

  return checkEligibility(
    {
      studentProfile: profile,
      documents: profile.documents,
      existingApplications: profile.applications,
    },
    schemes
  );
}

export async function getMyEligibilityResults(userId: string) {
  return checkEligibilityForUser(userId);
}
