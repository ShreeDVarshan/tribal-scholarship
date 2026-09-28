import { prisma } from '../utils/prisma';
import { maskMobile, maskAccount, maskAadhaar } from '../utils/masking';

export async function getDashboardStats() {
  const [
    totalStudents,
    totalApplications,
    applicationsByStatus,
    totalPayments,
    verificationStats,
    coverageGapCount,
  ] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.scholarshipApplication.count(),
    prisma.scholarshipApplication.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.payment.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.document.groupBy({
      by: ['status'],
      where: { isDeleted: false },
      _count: { status: true },
    }),
    prisma.coverageGapRecord.count({ where: { status: 'PENDING_OUTREACH' } }),
  ]);

  const statusMap = applicationsByStatus.reduce((acc: Record<string, number>, item) => {
    acc[item.status] = item._count.status;
    return acc;
  }, {});

  const verificationMap = verificationStats.reduce((acc: Record<string, number>, item) => {
    acc[item.status] = item._count.status;
    return acc;
  }, {});

  return {
    students: {
      total: totalStudents,
      stCertified: await prisma.studentProfile.count({ where: { isSTCertified: true } }),
      bankVerified: await prisma.studentProfile.count({ where: { bankVerified: true } }),
    },
    applications: {
      total: totalApplications,
      draft: statusMap['DRAFT'] || 0,
      submitted: statusMap['SUBMITTED'] || 0,
      underVerification: (statusMap['IDENTITY_VERIFICATION'] || 0) + (statusMap['DOCUMENT_VERIFICATION'] || 0) + (statusMap['INSTITUTION_VERIFICATION'] || 0),
      departmentVerification: statusMap['DEPARTMENT_VERIFICATION'] || 0,
      sanctioned: statusMap['SANCTIONED'] || 0,
      disbursed: statusMap['DISBURSED'] || 0,
      rejected: statusMap['REJECTED'] || 0,
      deficiency: statusMap['DEFICIENCY'] || 0,
    },
    payments: {
      totalDisbursed: totalPayments._sum.amount || 0,
      paymentCount: totalPayments._count,
    },
    verification: {
      totalDocuments: Object.values(verificationMap).reduce((a, b) => a + b, 0),
      verified: verificationMap['VERIFIED'] || 0,
      pending: verificationMap['PENDING'] || 0,
      mismatch: verificationMap['MISMATCH'] || 0,
    },
    coverageGap: {
      pendingOutreach: coverageGapCount,
    },
    disclaimer: 'Demo analytics based on seeded data.',
  };
}

export async function getAdminApplications(filters: {
  status?: string;
  schemeCode?: string;
  state?: string;
  page?: number;
  limit?: number;
}) {
  const { status, schemeCode, page = 1, limit = 20 } = filters;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (schemeCode) {
    where.scheme = { code: schemeCode };
  }

  const [applications, total] = await Promise.all([
    prisma.scholarshipApplication.findMany({
      where,
      include: {
        scheme: { select: { name: true, shortName: true, code: true } },
        studentProfile: {
          select: {
            id: true,
            fullName: true,
            state: true,
            district: true,
            mobile: true,
          },
        },
        timeline: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.scholarshipApplication.count({ where }),
  ]);

  return {
    applications: applications.map((app) => ({
      ...app,
      studentProfile: {
        ...app.studentProfile,
        mobile: maskMobile(app.studentProfile.mobile),
      },
    })),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getAdminStudents(filters: { page?: number; limit?: number; search?: string }) {
  const { page = 1, limit = 20, search } = filters;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where.OR = [
      { fullName: { contains: search } },
      { state: { contains: search } },
    ];
  }

  const [students, total] = await Promise.all([
    prisma.studentProfile.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        state: true,
        district: true,
        studentType: true,
        isSTCertified: true,
        profileCompletion: true,
        bankVerified: true,
        mobile: true,
        createdAt: true,
        applications: { select: { status: true, scheme: { select: { shortName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.studentProfile.count({ where }),
  ]);

  return {
    students: students.map((s) => ({
      ...s,
      mobile: maskMobile(s.mobile),
    })),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getCoverageGap(filters: {
  state?: string;
  academicLevel?: string;
  potentialScheme?: string;
  page?: number;
  limit?: number;
}) {
  const { state, academicLevel, potentialScheme, page = 1, limit = 20 } = filters;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (state) where.state = state;
  if (academicLevel) where.academicLevel = academicLevel;
  if (potentialScheme) where.potentialScheme = potentialScheme;

  const [records, total] = await Promise.all([
    prisma.coverageGapRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.coverageGapRecord.count({ where }),
  ]);

  return {
    records,
    total,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    disclaimer: 'Demo data representing potential unreached beneficiaries from mock UDISE+/APAAR/OTR datasets. Not real government records.',
  };
}

export async function flagForOutreach(recordId: string, adminId: string) {
  const record = await prisma.coverageGapRecord.findUnique({ where: { id: recordId } });
  if (!record) throw Object.assign(new Error('Record not found'), { statusCode: 404 });

  await prisma.coverageGapRecord.update({
    where: { id: recordId },
    data: { status: 'FLAGGED' },
  });

  await prisma.adminAuditLog.create({
    data: {
      adminId,
      action: 'FLAG_OUTREACH',
      targetType: 'COVERAGE_GAP',
      targetId: recordId,
      description: `Flagged coverage gap record ${recordId} for outreach`,
    },
  });

  return { success: true };
}

export async function getAnalytics() {
  const [byScheme, byStatus, paymentsByMonth, stateDistribution] = await Promise.all([
    prisma.scholarshipApplication.groupBy({
      by: ['schemeId'],
      _count: { schemeId: true },
    }),
    prisma.scholarshipApplication.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.payment.findMany({
      where: { status: 'PAID' },
      select: { amount: true, paymentDate: true, scheme: { select: { shortName: true } } },
      orderBy: { paymentDate: 'desc' },
      take: 50,
    }),
    prisma.studentProfile.groupBy({
      by: ['state'],
      _count: { state: true },
      orderBy: { _count: { state: 'desc' } },
      take: 10,
    }),
  ]);

  // Enrich by-scheme with scheme names
  const schemeIds = byScheme.map((s) => s.schemeId);
  const schemes = await prisma.scholarshipScheme.findMany({
    where: { id: { in: schemeIds } },
    select: { id: true, shortName: true },
  });
  const schemeMap = schemes.reduce((acc: Record<string, string>, s) => {
    acc[s.id] = s.shortName;
    return acc;
  }, {});

  return {
    applicationsByScheme: byScheme.map((s) => ({
      scheme: schemeMap[s.schemeId] || s.schemeId,
      count: s._count.schemeId,
    })),
    applicationsByStatus: byStatus.map((s) => ({
      status: s.status,
      count: s._count.status,
    })),
    paymentsTrend: paymentsByMonth.slice(0, 12).map((p) => ({
      scheme: p.scheme.shortName,
      amount: p.amount,
      date: p.paymentDate?.toISOString().split('T')[0] || null,
    })),
    stateDistribution: stateDistribution.map((s) => ({
      state: s.state,
      count: s._count.state,
    })),
  };
}

export async function getAuditLogs(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    prisma.adminAuditLog.findMany({
      include: { admin: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.adminAuditLog.count(),
  ]);
  return { logs, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}
