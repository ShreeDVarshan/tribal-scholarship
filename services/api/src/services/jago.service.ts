import { prisma } from '../utils/prisma';
import { getAIProvider } from '../ai/factory';
import { detectIntent } from '../ai/intent.detector';
import { maskAadhaar, maskAccount, maskMobile } from '../utils/masking';
import { AIMessage } from '../ai/provider.interface';

const JAGO_SYSTEM_PROMPT = `You are JAGO (जागो), a helpful scholarship guidance assistant for Janjathi Shiksha Setu — a unified scholarship platform for Scheduled Tribe students in India.

Your role:
- Help students understand the 5 scholarship schemes: Pre-Matric, Post-Matric, Top Class, NFST, and NOS
- Explain their application status in simple, human language
- Guide them on document requirements
- Clarify eligibility criteria
- Assist with app navigation

Important rules:
- NEVER make final eligibility decisions — always say this is preliminary information
- NEVER invent scholarship rules, deadlines, or government decisions
- NEVER hallucinate payment amounts or application outcomes
- Use information provided in the context about the student's actual data
- Keep responses concise, clear, and in simple English
- Be warm, supportive, and accessible
- Always end your response with a brief disclaimer about official verification

You are NOT a government officer and cannot approve or reject applications.`;

export async function chat(
  userId: string,
  message: string,
  conversationId?: string,
  language: string = 'en'
) {
  const ai = getAIProvider();
  const intent = detectIntent(message);

  // Get or create conversation
  let conversation;
  if (conversationId) {
    conversation = await prisma.jagoConversation.findFirst({
      where: { id: conversationId, userId },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } },
    });
  }

  if (!conversation) {
    conversation = await prisma.jagoConversation.create({
      data: { userId, language, title: message.slice(0, 50) },
      include: { messages: true },
    });
  }

  // Save user message
  await prisma.jagoMessage.create({
    data: {
      conversationId: conversation.id,
      role: 'user',
      content: message,
      intent,
    },
  });

  // Build context from student data (masked)
  const context = await buildStudentContext(userId, intent);

  // Build message history for AI
  const messages: AIMessage[] = [
    ...(conversation.messages || []).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: message },
  ];

  // Generate response
  const systemContext = `${JAGO_SYSTEM_PROMPT}\n\n## Student Context\n${context}`;
  const response = await ai.generateResponse(messages, systemContext);

  // Save assistant message
  const assistantMessage = await prisma.jagoMessage.create({
    data: {
      conversationId: conversation.id,
      role: 'assistant',
      content: response,
      intent,
    },
  });

  // Update conversation title if new
  if (!conversation.title || conversation.messages.length === 0) {
    await prisma.jagoConversation.update({
      where: { id: conversation.id },
      data: { title: message.slice(0, 50) },
    });
  }

  return {
    conversationId: conversation.id,
    message: assistantMessage,
    intent,
    aiProvider: ai.providerName,
  };
}

async function buildStudentContext(userId: string, intent: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: {
        include: {
          academicProfile: true,
          documents: { where: { isDeleted: false } },
          applications: {
            include: { scheme: true, timeline: { orderBy: { createdAt: 'desc' }, take: 1 } },
            orderBy: { updatedAt: 'desc' },
            take: 3,
          },
          payments: { orderBy: { paymentDate: 'desc' }, take: 3 },
        },
      },
    },
  });

  if (!user?.studentProfile) return 'No student profile found.';
  const p = user.studentProfile;

  let ctx = `Student: ${p.fullName}\n`;
  ctx += `State: ${p.state}, ${p.district}\n`;
  ctx += `Student Type: ${p.studentType}\n`;
  ctx += `ST Certified: ${p.isSTCertified ? 'Yes' : 'No'}\n`;
  ctx += `Profile Completion: ${p.profileCompletion}%\n`;
  ctx += `Readiness Score: ${p.readinessScore}%\n\n`;

  if (p.academicProfile) {
    ctx += `Institution: ${p.academicProfile.institutionName}\n`;
    ctx += `Course: ${p.academicProfile.course}, Year ${p.academicProfile.yearOfStudy}\n\n`;
  }

  if (intent === 'APPLICATION_STATUS' || intent === 'GENERAL_FAQ') {
    ctx += `Applications:\n`;
    for (const app of p.applications) {
      ctx += `- ${app.scheme.shortName}: ${app.status} (${app.applicationNumber})\n`;
    }
    ctx += '\n';
  }

  if (intent === 'DOCUMENTS') {
    ctx += `Documents:\n`;
    for (const doc of p.documents) {
      ctx += `- ${doc.documentName}: ${doc.status}\n`;
    }
    ctx += '\n';
  }

  if (intent === 'PAYMENT') {
    ctx += `Payments:\n`;
    for (const pay of p.payments) {
      ctx += `- Amount: ₹${pay.amount}, Status: ${pay.status}, Date: ${pay.paymentDate?.toISOString().split('T')[0] || 'N/A'}\n`;
    }
    ctx += '\n';
  }

  return ctx;
}

export async function listConversations(userId: string) {
  return prisma.jagoConversation.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      language: true,
      updatedAt: true,
      messages: { orderBy: { createdAt: 'desc' }, take: 1, select: { content: true } },
    },
  });
}

export async function getConversation(id: string, userId: string) {
  const conv = await prisma.jagoConversation.findFirst({
    where: { id, userId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  if (!conv) throw Object.assign(new Error('Conversation not found'), { statusCode: 404 });
  return conv;
}
