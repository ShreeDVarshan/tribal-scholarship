import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../utils/prisma';
import { createNotification } from './notifications.service';

function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `APP-${year}-${random}`;
}

export async function createApplication(studentProfileId: string, schemeId: string, academicYear: string) {
  const scheme = await prisma.scholarshipScheme.findUnique({ where: { id: schemeId } });
  if (!scheme) throw Object.assign(new Error('Scheme not found'), { statusCode: 404 });

  // Check for existing active application for same scheme
  const existing = await prisma.scholarshipApplication.findFirst({
    where: {
      studentProfileId,
      schemeId,
      status: { notIn: ['REJECTED', 'DISBURSED'] },
    },
  });

  if (existing) {
    throw Object.assign(
      new Error('An active application already exists for this scheme'),
      { code: 'DUPLICATE', statusCode: 409 }
    );
  }

  const app = await prisma.scholarshipApplication.create({
    data: {
      applicationNumber: generateApplicationNumber(),
      studentProfileId,
      schemeId,
      academicYear,
      status: 'DRAFT',
      timeline: {
        create: {
          status: 'DRAFT',
          description: 'Application created. Review your profile and documents before submitting.',
          updatedBy: 'STUDENT',
        },
      },
    },
    include: { scheme: true, timeline: true },
  });

  return app;
}

export async function submitApplication(applicationId: string, studentProfileId: string) {
  const app = await prisma.scholarshipApplication.findFirst({
    where: { id: applicationId, studentProfileId },
    include: { scheme: true },
  });

  if (!app) throw Object.assign(new Error('Application not found'), { statusCode: 404 });
  if (app.status !== 'DRAFT') {
    throw Object.assign(new Error('Application has already been submitted'), { statusCode: 400 });
  }

  const updated = await prisma.scholarshipApplication.update({
    where: { id: applicationId },
    data: {
      status: 'SUBMITTED',
      submittedAt: new Date(),
      timeline: {
        create: {
          status: 'SUBMITTED',
          description: 'Application submitted successfully. Your application is now under review.',
          updatedBy: 'STUDENT',
        },
      },
    },
    include: { scheme: true, timeline: { orderBy: { createdAt: 'asc' } } },
  });

  // Add next stage entries (simulated flow)
  await prisma.applicationStatusHistory.create({
    data: {
      applicationId,
      status: 'IDENTITY_VERIFICATION',
      description: 'Identity verification initiated with UIDAI.',
      updatedBy: 'SYSTEM',
    },
  });

  // Notify student
  const student = await prisma.studentProfile.findUnique({ where: { id: studentProfileId } });
  if (student) {
    await createNotification({
      userId: student.userId,
      studentProfileId,
      type: 'APPLICATION_UPDATE',
      title: 'Application Submitted',
      body: `Your ${app.scheme.shortName} application (${app.applicationNumber}) has been submitted successfully.`,
    });
  }

  return updated;
}

export async function listApplications(studentProfileId: string) {
  return prisma.scholarshipApplication.findMany({
    where: { studentProfileId },
    include: {
      scheme: {
        select: { id: true, code: true, name: true, shortName: true },
      },
      timeline: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getApplicationById(id: string, studentProfileId: string) {
  const app = await prisma.scholarshipApplication.findFirst({
    where: { id, studentProfileId },
    include: {
      scheme: true,
      timeline: { orderBy: { createdAt: 'asc' } },
      payments: { orderBy: { paymentDate: 'desc' } },
    },
  });
  if (!app) throw Object.assign(new Error('Application not found'), { statusCode: 404 });
  return app;
}

export async function getApplicationTimeline(applicationId: string, studentProfileId: string) {
  const app = await prisma.scholarshipApplication.findFirst({
    where: { id: applicationId, studentProfileId },
    include: {
      scheme: { select: { name: true, shortName: true } },
      timeline: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!app) throw Object.assign(new Error('Application not found'), { statusCode: 404 });

  // Build a complete stage list with statuses
  const stages = [
    'SUBMITTED', 'IDENTITY_VERIFICATION', 'DOCUMENT_VERIFICATION',
    'INSTITUTION_VERIFICATION', 'DEPARTMENT_VERIFICATION',
    'SANCTIONED', 'DBT_PROCESSING', 'DISBURSED',
  ];

  const completedStatuses = app.timeline.map((t) => t.status);
  const currentStatus = app.status;

  const stageData = stages.map((stage) => {
    const historyEntry = app.timeline.find((t) => t.status === stage);
    const isCompleted = completedStatuses.includes(stage);
    const isCurrent = currentStatus === stage;

    return {
      stage,
      label: getStageLabel(stage),
      description: historyEntry?.description || getStagePlaceholder(stage),
      status: isCompleted ? 'COMPLETED' : isCurrent ? 'CURRENT' : 'UPCOMING',
      completedAt: historyEntry?.createdAt || null,
      actionRequired: historyEntry?.actionRequired || null,
    };
  });

  return {
    applicationId: app.id,
    applicationNumber: app.applicationNumber,
    scheme: app.scheme,
    currentStatus: app.status,
    stages: stageData,
    whatHappensNext: getNextActionMessage(currentStatus),
  };
}

function getStageLabel(stage: string): string {
  const labels: Record<string, string> = {
    SUBMITTED: 'Application Submitted',
    IDENTITY_VERIFICATION: 'Identity Verification',
    DOCUMENT_VERIFICATION: 'Document Verification',
    INSTITUTION_VERIFICATION: 'Institution Verification',
    DEPARTMENT_VERIFICATION: 'Department Verification',
    SANCTIONED: 'Sanctioned',
    DBT_PROCESSING: 'DBT Processing',
    DISBURSED: 'Disbursed',
  };
  return labels[stage] || stage;
}

function getStagePlaceholder(stage: string): string {
  const desc: Record<string, string> = {
    SUBMITTED: 'Awaiting processing',
    IDENTITY_VERIFICATION: 'Aadhaar and identity verification',
    DOCUMENT_VERIFICATION: 'Certificate and document verification',
    INSTITUTION_VERIFICATION: 'Institution confirms enrollment and fee details',
    DEPARTMENT_VERIFICATION: 'Ministry of Tribal Affairs reviews application',
    SANCTIONED: 'Scholarship amount sanctioned',
    DBT_PROCESSING: 'Direct Benefit Transfer initiated',
    DISBURSED: 'Amount credited to bank account',
  };
  return desc[stage] || '';
}

function getNextActionMessage(status: string): string {
  const messages: Record<string, string> = {
    DRAFT: 'Review your profile and documents, then submit your application.',
    SUBMITTED: 'Your application is being reviewed. Identity verification is in progress.',
    IDENTITY_VERIFICATION: 'Your identity is being verified. Document review will follow.',
    DOCUMENT_VERIFICATION: 'Your documents are being verified with source authorities.',
    INSTITUTION_VERIFICATION: 'Your institution is confirming your enrollment details.',
    DEPARTMENT_VERIFICATION: 'The department is conducting a final review of your application.',
    SANCTIONED: 'Your scholarship has been sanctioned. DBT payment is being processed.',
    DBT_PROCESSING: 'The payment is being transferred to your bank account.',
    DISBURSED: 'The scholarship amount has been credited to your account.',
    DEFICIENCY: 'Please address the deficiency noted in your application and resubmit the required document.',
    REJECTED: 'Your application was not approved. You may re-apply in the next academic year.',
  };
  return messages[status] || 'Please check back later for updates.';
}
