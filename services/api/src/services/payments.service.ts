import { prisma } from '../utils/prisma';
import { maskAccount, maskDbtReference } from '../utils/masking';

export async function listPayments(studentProfileId: string) {
  const payments = await prisma.payment.findMany({
    where: { studentProfileId },
    include: {
      scheme: { select: { name: true, shortName: true, code: true } },
    },
    orderBy: { paymentDate: 'desc' },
  });

  const masked = payments.map((p) => ({
    ...p,
    dbtReference: p.dbtReference ? maskDbtReference(p.dbtReference) : null,
  }));

  const total = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  const pending = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);

  const lastPayment = masked.find((p) => p.status === 'PAID');

  return {
    payments: masked,
    summary: {
      totalReceived: total,
      pending,
      lastPaymentAmount: lastPayment?.amount || 0,
      lastPaymentDate: lastPayment?.paymentDate || null,
      disclaimer: 'Demo transaction data. Not real government records.',
    },
  };
}

export async function getPaymentById(id: string, studentProfileId: string) {
  const payment = await prisma.payment.findFirst({
    where: { id, studentProfileId },
    include: {
      scheme: true,
      application: { select: { applicationNumber: true } },
    },
  });
  if (!payment) throw Object.assign(new Error('Payment not found'), { statusCode: 404 });

  return {
    ...payment,
    dbtReference: payment.dbtReference ? maskDbtReference(payment.dbtReference) : null,
    disclaimer: 'Demo transaction. Not a real government record.',
  };
}
