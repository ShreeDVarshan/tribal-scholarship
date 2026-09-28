import path from 'path';
import fs from 'fs';
import { prisma } from '../utils/prisma';
import { verifyDocument } from './verification.service';

export async function listDocuments(studentProfileId: string) {
  return prisma.document.findMany({
    where: { studentProfileId, isDeleted: false },
    include: {
      verifications: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getDocumentById(id: string, studentProfileId: string) {
  const doc = await prisma.document.findFirst({
    where: { id, studentProfileId, isDeleted: false },
    include: {
      verifications: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!doc) throw Object.assign(new Error('Document not found'), { statusCode: 404 });
  return doc;
}

export async function createDocument(studentProfileId: string, data: {
  documentType: string;
  documentName: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  issuedDate?: string;
  expiryDate?: string;
}) {
  return prisma.document.create({
    data: {
      studentProfileId,
      ...data,
      status: 'PENDING',
    },
  });
}

export async function triggerVerification(documentId: string, studentProfileId: string) {
  const doc = await prisma.document.findFirst({
    where: { id: documentId, studentProfileId, isDeleted: false },
  });
  if (!doc) throw Object.assign(new Error('Document not found'), { statusCode: 404 });

  // Update to verification in progress
  await prisma.document.update({
    where: { id: documentId },
    data: { status: 'PENDING' },
  });

  const result = await verifyDocument({
    documentId,
    documentType: doc.documentType,
    studentProfileId,
  });

  return result;
}

export async function softDeleteDocument(documentId: string, studentProfileId: string) {
  const doc = await prisma.document.findFirst({
    where: { id: documentId, studentProfileId, isDeleted: false },
  });
  if (!doc) throw Object.assign(new Error('Document not found'), { statusCode: 404 });

  return prisma.document.update({
    where: { id: documentId },
    data: { isDeleted: true },
  });
}

export async function getReusableDocuments(studentProfileId: string, schemeCode: string) {
  const SCHEME_REQUIRED_DOCS: Record<string, string[]> = {
    PRE_MATRIC: ['ST_CERTIFICATE', 'INCOME', 'MARKSHEET', 'AADHAAR'],
    POST_MATRIC: ['ST_CERTIFICATE', 'INCOME', 'MARKSHEET', 'AADHAAR', 'INSTITUTION'],
    TOP_CLASS: ['ST_CERTIFICATE', 'INCOME', 'MARKSHEET', 'AADHAAR', 'INSTITUTION'],
    NFST: ['ST_CERTIFICATE', 'INCOME', 'MARKSHEET', 'AADHAAR', 'RESEARCH'],
    NOS: ['ST_CERTIFICATE', 'INCOME', 'MARKSHEET', 'AADHAAR'],
  };

  const required = SCHEME_REQUIRED_DOCS[schemeCode] || [];
  const docs = await prisma.document.findMany({
    where: { studentProfileId, isDeleted: false },
  });

  return required.map((type) => {
    const doc = docs.find((d) => d.documentType === type && d.status === 'VERIFIED');
    return {
      documentType: type,
      documentName: getDocLabel(type),
      isAvailable: !!doc,
      isReusable: doc?.isReusable || false,
      status: doc?.status || 'NOT_UPLOADED',
      documentId: doc?.id || null,
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
    BANK: 'Bank Account Proof',
    DOMICILE: 'Domicile Certificate',
    RESEARCH: 'Research Enrollment Proof',
    DISABILITY: 'Disability Certificate',
  };
  return labels[type] || type;
}
