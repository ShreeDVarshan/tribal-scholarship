import { AIProvider, AIMessage } from './provider.interface';
import { detectIntent, JagoIntent } from './intent.detector';
import { scholarshipKnowledgeBase } from './knowledge.base';

const DISCLAIMER = '\n\n---\n⚠️ *JAGO provides informational assistance. Final eligibility and decisions are made by the relevant authority.*';

export class MockAIProvider implements AIProvider {
  providerName = 'MockAIProvider (Demo)';

  isAvailable(): boolean {
    return true;
  }

  async generateResponse(messages: AIMessage[], systemContext: string): Promise<string> {
    // Simulate network latency
    await delay(600 + Math.random() * 800);

    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMessage) return 'Hello! I\'m JAGO, your scholarship guide. How can I help you today?' + DISCLAIMER;

    const intent = detectIntent(lastUserMessage.content);
    return this.buildResponse(intent, lastUserMessage.content, systemContext) + DISCLAIMER;
  }

  private buildResponse(intent: JagoIntent, message: string, context: string): string {
    switch (intent) {
      case 'GREETING':
        return `Hello! I'm JAGO, your scholarship guide for Janjathi Shiksha Setu. 👋\n\nI can help you with:\n• **Application status** — check where your application stands\n• **Document queries** — understand what's needed\n• **Eligibility** — see what you may qualify for\n• **Payments** — track your DBT disbursements\n• **Scholarship information** — details about all 5 schemes\n\nWhat would you like to know?`;

      case 'APPLICATION_STATUS':
        return this.buildApplicationStatusResponse(context);

      case 'DOCUMENTS':
        return this.buildDocumentResponse(context);

      case 'ELIGIBILITY':
        return this.buildEligibilityResponse(context, message);

      case 'PAYMENT':
        return this.buildPaymentResponse(context);

      case 'PROFILE':
        return this.buildProfileResponse(context);

      case 'GENERAL_FAQ':
        return this.buildFAQResponse(message);

      case 'HELP':
        return `Here's how to navigate Janjathi Setu:\n\n📱 **Bottom Navigation**\n• **Home** — Overview of your scholarship journey\n• **Scholarships** — Browse all 5 schemes\n• **Applications** — Track your active applications\n• **Payments** — View DBT payment history\n• **Profile** — Manage your verified profile\n\n🤖 **JAGO Button**\nTap the floating JAGO button anytime to chat with me.\n\n📂 **Documents**\nFind the Documents section in your Profile to manage and verify your documents.\n\n🔔 **Notifications**\nCheck the bell icon for updates on your applications and documents.`;

      default:
        return this.buildFAQResponse(message);
    }
  }

  private buildApplicationStatusResponse(context: string): string {
    if (context.includes('DEPARTMENT_VERIFICATION')) {
      return `📋 **Your Application Status**\n\nYour **Post-Matric Scholarship** application is currently at the **Department Verification** stage.\n\nHere's where things stand:\n✅ Application submitted\n✅ Identity verified\n✅ Documents verified\n✅ Institution verified\n🔄 **Department Verification** *(current stage)*\n⏳ Sanction pending\n⏳ DBT processing pending\n\n**What happens next?**\nThe department reviews your complete application file. This typically takes 2–4 weeks. You'll receive a notification when the status changes.\n\n**What you can do now:**\nNo action is required from you at this stage. Ensure your bank account is active and linked to DBT.`;
    }
    return `📋 **Application Status**\n\nBased on your profile, your latest application is being processed through the standard verification pipeline.\n\nIf you have a specific application in mind, tap **My Applications** from the bottom navigation to see real-time status for each application.\n\nCommon stages:\n1. **Submitted** — Application received\n2. **Identity Verification** — Aadhaar/UIDAI check\n3. **Document Verification** — Certificate checks\n4. **Institution Verification** — Institution confirms enrollment\n5. **Department Verification** — Final review\n6. **Sanctioned** — Amount approved\n7. **DBT Processing** — Bank transfer initiated\n8. **Disbursed** — Amount credited to your account`;
  }

  private buildDocumentResponse(context: string): string {
    return `📄 **Document Status**\n\nBased on your profile, here's a summary of your key documents:\n\n✅ **ST Certificate** — Verified (DigiLocker Demo)\n✅ **Income Certificate** — Verified (e-District Demo)\n✅ **Academic Marksheet** — Verified\n✅ **Aadhaar** — Verified (UIDAI Demo)\n✅ **Bank Account** — Verified\n⚠️ **Domicile Certificate** — Pending verification\n\n**Tips for documents:**\n• Documents verified in your profile are automatically reused when you apply — no need to upload again\n• If a document shows 'Needs Update', download a fresh copy and replace it\n• Domicile certificates expire — keep them current\n\nGo to **My Documents** in the app to view and update each document.`;
  }

  private buildEligibilityResponse(context: string, message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes('post-matric') || lower.includes('post matric')) {
      return `📊 **Post-Matric Scholarship — Eligibility Assessment**\n\nBased on your profile information:\n\n✅ **ST status** — Available and verified\n✅ **Academic level** — College (UG) — matches scheme\n✅ **Institution** — Government college, recognized\n✅ **Family income** — ₹1,80,000 (within ₹2,50,000 limit)\n✅ **No conflicting scholarship** — Not found\n\n🟢 **Preliminary assessment: Likely Eligible**\n\nTo confirm and apply:\n1. Go to **Scholarships** → **Post-Matric Scholarship**\n2. Tap **Check Eligibility** for a detailed assessment\n3. If confirmed, tap **Apply Now**\n\n*Final eligibility is determined by the official verification process.*`;
    }
    return `📊 **Scholarship Eligibility**\n\nTo check your eligibility accurately:\n\n1. Tap **Scholarships** in the bottom navigation\n2. Select any scheme to see its eligibility criteria\n3. Tap **Check My Eligibility** to run a personalized assessment\n\n**General eligibility factors:**\n• ST community membership\n• Academic level (school vs. college vs. research)\n• Annual family income\n• Institution type\n• Existing scholarships\n\nI can also tell you about specific schemes. Just ask me: *"Tell me about Post-Matric"* or *"Am I eligible for Top Class?"*`;
  }

  private buildPaymentResponse(context: string): string {
    return `💰 **Payment Summary**\n\nBased on your DBT records:\n\n**Most recent payment:**\n📅 15 March 2024\n💵 **₹42,000**\nScheme: Post-Matric Scholarship (2023-24)\nStatus: ✅ Paid\nAccount: SBI ****4521\n\n**Previous payment:**\n📅 20 November 2022\n💵 **₹14,000**\nScheme: Pre-Matric Scholarship (2021-22)\nStatus: ✅ Paid\n\n**Total received:** ₹56,000\n\nAll payments are processed through Direct Benefit Transfer (DBT) to your verified bank account.\n\nFor detailed payment records, go to **Payments** in the bottom navigation.`;
  }

  private buildProfileResponse(context: string): string {
    return `👤 **Your Profile Summary**\n\nYour profile is **92% complete**.\n\n✅ Personal information complete\n✅ Academic details complete\n✅ ST certificate verified\n✅ Bank account linked and verified\n✅ DBT active\n⚠️ Domicile certificate pending\n\n**Application Readiness: 88%**\n\nTo improve readiness:\n• Upload your Domicile Certificate\n• Ensure all documents are current and not expired\n\nA complete, verified profile means your documents are automatically reused when applying — no repeated uploads needed.\n\nTap **Profile** in the bottom navigation to view and edit your details.`;
  }

  private buildFAQResponse(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes('top class')) {
      const info = scholarshipKnowledgeBase.TOP_CLASS;
      return `🎓 **${info.name}**\n\n${info.description}\n\n**Who can apply:**\n${info.generalEligibility.map((e) => `• ${e}`).join('\n')}\n\n*${info.warnings[0]}*`;
    }
    if (lower.includes('nfst') || lower.includes('fellowship') || lower.includes('research')) {
      const info = scholarshipKnowledgeBase.NFST;
      return `🎓 **${info.name}**\n\n${info.description}\n\n**Who can apply:**\n${info.generalEligibility.map((e) => `• ${e}`).join('\n')}\n\n*${info.warnings[0]}*`;
    }
    if (lower.includes('nos') || lower.includes('overseas')) {
      const info = scholarshipKnowledgeBase.NOS;
      return `🌏 **${info.name}**\n\n${info.description}\n\n**Who can apply:**\n${info.generalEligibility.map((e) => `• ${e}`).join('\n')}\n\n*${info.warnings[0]}*`;
    }
    if (lower.includes('post-matric') || lower.includes('post matric')) {
      const info = scholarshipKnowledgeBase.POST_MATRIC;
      return `🎓 **${info.name}**\n\n${info.description}\n\n**Who can apply:**\n${info.generalEligibility.map((e) => `• ${e}`).join('\n')}\n\n*${info.warnings[0]}*`;
    }
    if (lower.includes('pre-matric') || lower.includes('pre matric')) {
      const info = scholarshipKnowledgeBase.PRE_MATRIC;
      return `🎓 **${info.name}**\n\n${info.description}\n\n**Who can apply:**\n${info.generalEligibility.map((e) => `• ${e}`).join('\n')}\n\n*${info.warnings[0]}*`;
    }

    return `I'm JAGO, your Janjathi Shiksha Setu scholarship guide. I can help you with:\n\n📋 **Application queries** — "Why is my application pending?"\n📄 **Document queries** — "What documents do I need?"\n🎓 **Eligibility** — "Am I eligible for Post-Matric?"\n💰 **Payments** — "When was my last payment?"\n👤 **Profile** — "How do I improve my readiness score?"\n\nFor detailed information about any scheme, ask me:\n• *"Tell me about Post-Matric Scholarship"*\n• *"What is Top Class Scholarship?"*\n• *"How do I apply for NOS?"*`;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
