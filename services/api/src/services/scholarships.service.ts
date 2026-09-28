import { prisma } from '../utils/prisma';

export async function getAllSchemes() {
  return prisma.scholarshipScheme.findMany({
    where: { isActive: true },
    include: { eligibilityRules: true },
    orderBy: { name: 'asc' },
  });
}

export async function getSchemeById(id: string) {
  const scheme = await prisma.scholarshipScheme.findUnique({
    where: { id },
    include: { eligibilityRules: true },
  });
  if (!scheme) throw Object.assign(new Error('Scheme not found'), { statusCode: 404 });
  return scheme;
}

export async function getSchemeByCode(code: string) {
  const scheme = await prisma.scholarshipScheme.findUnique({
    where: { code },
    include: { eligibilityRules: true },
  });
  if (!scheme) throw Object.assign(new Error('Scheme not found'), { statusCode: 404 });
  return scheme;
}
