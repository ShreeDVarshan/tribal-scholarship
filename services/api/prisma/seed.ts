import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for Janjathi Shiksha Setu...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.applicationStatusHistory.deleteMany();
  await prisma.scholarshipApplication.deleteMany();
  await prisma.eligibilityRule.deleteMany();
  await prisma.scholarshipScheme.deleteMany();
  await prisma.documentVerification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.familyMember.deleteMany();
  await prisma.academicProfile.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.adminAuditLog.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.jagoMessage.deleteMany();
  await prisma.jagoConversation.deleteMany();
  await prisma.integrationLog.deleteMany();
  await prisma.coverageGapRecord.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('Demo@1234', 10);
  const adminPasswordHash = await bcrypt.hash('Admin@Demo2024', 10);

  // 1. Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@janjathi.gov.in',
      mobile: '9876543210',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      adminProfile: {
        create: {
          name: 'Shri R. K. Soren (Director)',
        },
      },
    },
  });

  // 2. Create the 5 Schemes
  const preMatric = await prisma.scholarshipScheme.create({
    data: {
      code: 'PRE_MATRIC',
      name: 'Pre-Matric Scholarship for ST Students',
      shortName: 'Pre-Matric ST',
      description: 'Financial assistance to ST students studying in classes IX & X to minimize dropout rates.',
      ministry: 'Ministry of Tribal Affairs',
      department: 'Education Division',
      targetGroup: 'ST students in Classes 9 & 10',
      maxAmount: 7000,
      fundingType: 'CENTRAL',
      portalSource: 'NSP',
      applicationOpenDate: '2024-07-01',
      applicationCloseDate: '2024-11-30',
    },
  });

  const postMatric = await prisma.scholarshipScheme.create({
    data: {
      code: 'POST_MATRIC',
      name: 'Post-Matric Scholarship for ST Students',
      shortName: 'Post-Matric ST',
      description: 'Comprehensive financial support covering maintenance allowance and fees for ST students in post-matriculation or post-secondary stages.',
      ministry: 'Ministry of Tribal Affairs',
      department: 'Scholarship Division',
      targetGroup: 'ST students pursuing 11th, 12th, ITI, Diploma, UG, PG',
      maxAmount: 45000,
      fundingType: 'STATE_SHARED',
      portalSource: 'NSP',
      applicationOpenDate: '2024-07-15',
      applicationCloseDate: '2024-12-15',
    },
  });

  const topClass = await prisma.scholarshipScheme.create({
    data: {
      code: 'TOP_CLASS',
      name: 'National Scholarship for Higher Education / Top Class ST',
      shortName: 'Top Class Education',
      description: 'Recognizes and promotes quality education among ST students by funding studies in premier institutions like IITs, NITs, IIMs, and AIIMS.',
      ministry: 'Ministry of Tribal Affairs',
      department: 'Higher Education Division',
      targetGroup: 'ST students admitted into designated premier institutes',
      maxAmount: 200000,
      fundingType: 'CENTRAL',
      portalSource: 'SFMP',
      applicationOpenDate: '2024-08-01',
      applicationCloseDate: '2024-11-15',
    },
  });

  const nfst = await prisma.scholarshipScheme.create({
    data: {
      code: 'NFST',
      name: 'National Fellowship for ST Students (NFST)',
      shortName: 'NFST Fellowship',
      description: 'Supports meritorious ST scholars pursuing regular and full-time M.Phil. and Ph.D. degrees in Sciences, Humanities, and Social Sciences.',
      ministry: 'Ministry of Tribal Affairs',
      department: 'Research Division',
      targetGroup: 'ST Research Scholars (M.Phil / Ph.D.)',
      maxAmount: 336000,
      fundingType: 'CENTRAL',
      portalSource: 'SFMP',
      applicationOpenDate: '2024-06-01',
      applicationCloseDate: '2024-10-31',
    },
  });

  const nos = await prisma.scholarshipScheme.create({
    data: {
      code: 'NOS',
      name: 'National Overseas Scholarship for ST Students (NOS)',
      shortName: 'National Overseas',
      description: 'Provides financial assistance to selected ST candidates for pursuing Master level courses and Ph.D. abroad in accredited foreign universities.',
      ministry: 'Ministry of Tribal Affairs',
      department: 'International Cooperation Division',
      targetGroup: 'ST students pursuing Masters / Ph.D. overseas',
      maxAmount: 2000000,
      fundingType: 'CENTRAL',
      portalSource: 'NOS_PORTAL',
      applicationOpenDate: '2024-05-01',
      applicationCloseDate: '2024-09-30',
    },
  });

  // 3. Primary Demo Student: Arjun Kumar
  const arjunUser = await prisma.user.create({
    data: {
      mobile: '9999999999',
      email: 'arjun.kumar@demo.janjathi.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'STUDENT',
      studentProfile: {
        create: {
          fullName: 'Arjun Kumar',
          dateOfBirth: '2003-04-12',
          gender: 'MALE',
          mobile: '9999999999',
          email: 'arjun.kumar@demo.janjathi.gov.in',
          aadhaarMasked: 'XXXX XXXX 4821',
          state: 'Tamil Nadu',
          district: 'Coimbatore',
          address: '42, Tribal Welfare Colony, Anaikatti Post',
          pincode: '641108',
          studentType: 'COLLEGE',
          isSTCertified: true,
          isFemale: false,
          isDisabled: false,
          annualFamilyIncome: 180000,
          casteCategory: 'ST',
          profileCompletion: 92,
          readinessScore: 88,
          bankAccountMasked: 'XXXX4521',
          bankName: 'State Bank of India',
          bankVerified: true,
          dbtActive: true,
          academicProfile: {
            create: {
              institutionName: 'Government Arts and Science College, Coimbatore',
              institutionType: 'COLLEGE',
              institutionState: 'Tamil Nadu',
              aisheCode: 'C-41234',
              apaarId: 'APAAR-9821-4412',
              course: 'B.Sc. Computer Science',
              stream: 'Science',
              academicYear: '2024-2025',
              yearOfStudy: 3,
              enrollmentNo: 'CB-2022-CS-088',
              cgpa: 8.4,
              lastYearMarks: 82.5,
              isGovernmentInst: true,
            },
          },
          familyMembers: {
            create: [
              {
                name: 'Priya Kumar',
                relation: 'SIBLING',
                demoScheme: 'Pre-Matric Scholarship',
                demoStatus: 'Disbursed',
                demoAmount: 3500,
              },
              {
                name: 'Ravi Kumar',
                relation: 'SIBLING',
                demoScheme: 'None',
                demoStatus: 'No scholarship detected',
                demoAmount: 0,
              },
            ],
          },
        },
      },
    },
    include: {
      studentProfile: true,
    },
  });

  const arjunProfileId = arjunUser.studentProfile!.id;

  // Documents for Arjun
  const docST = await prisma.document.create({
    data: {
      studentProfileId: arjunProfileId,
      documentType: 'ST_CERTIFICATE',
      documentName: 'Community Certificate (ST)',
      fileName: 'st_cert_arjun_kumar.pdf',
      fileSize: 420000,
      mimeType: 'application/pdf',
      status: 'VERIFIED',
      issuedDate: '2019-06-15',
      verificationSource: 'State e-District / Demo Integration',
      lastVerifiedAt: new Date('2024-01-10'),
      isReusable: true,
      verifications: {
        create: {
          status: 'VERIFIED',
          source: 'State e-District / Demo Integration',
          confidence: 0.99,
          reason: 'Verified against Tamil Nadu e-District portal records',
        },
      },
    },
  });

  const docIncome = await prisma.document.create({
    data: {
      studentProfileId: arjunProfileId,
      documentType: 'INCOME',
      documentName: 'Income Certificate (₹1,80,000)',
      fileName: 'income_cert_2024.pdf',
      fileSize: 310000,
      mimeType: 'application/pdf',
      status: 'VERIFIED',
      issuedDate: '2024-03-01',
      expiryDate: '2024-11-15',
      verificationSource: 'State e-District / Demo Integration',
      lastVerifiedAt: new Date('2024-03-05'),
      isReusable: true,
      verifications: {
        create: {
          status: 'VERIFIED',
          source: 'Revenue Dept e-District',
          confidence: 0.98,
          reason: 'Matches official tahsildar registry',
        },
      },
    },
  });

  const docMarksheet = await prisma.document.create({
    data: {
      studentProfileId: arjunProfileId,
      documentType: 'MARKSHEET',
      documentName: 'Semester 4 Marksheet (82.5%)',
      fileName: 'marksheet_sem4.pdf',
      fileSize: 580000,
      mimeType: 'application/pdf',
      status: 'VERIFIED',
      issuedDate: '2024-05-20',
      verificationSource: 'APAAR / DigiLocker Demo Integration',
      lastVerifiedAt: new Date('2024-06-01'),
      isReusable: true,
    },
  });

  const docAadhaar = await prisma.document.create({
    data: {
      studentProfileId: arjunProfileId,
      documentType: 'AADHAAR',
      documentName: 'Aadhaar Card Copy (Masked)',
      fileName: 'aadhaar_masked.pdf',
      fileSize: 250000,
      mimeType: 'application/pdf',
      status: 'VERIFIED',
      issuedDate: '2016-08-10',
      verificationSource: 'UIDAI Demo Integration',
      lastVerifiedAt: new Date('2024-01-10'),
      isReusable: true,
    },
  });

  const docBank = await prisma.document.create({
    data: {
      studentProfileId: arjunProfileId,
      documentType: 'BANK',
      documentName: 'Bank Passbook / Mandate Form',
      fileName: 'sbi_passbook_copy.pdf',
      fileSize: 390000,
      mimeType: 'application/pdf',
      status: 'VERIFIED',
      issuedDate: '2021-02-14',
      verificationSource: 'PFMS / NPCI DBT Demo Integration',
      lastVerifiedAt: new Date('2024-01-12'),
      isReusable: true,
    },
  });

  const docDomicile = await prisma.document.create({
    data: {
      studentProfileId: arjunProfileId,
      documentType: 'DOMICILE',
      documentName: 'Nativity / Residence Certificate',
      fileName: 'domicile_coimbatore.pdf',
      fileSize: 310000,
      mimeType: 'application/pdf',
      status: 'PENDING',
      issuedDate: '2024-02-10',
      verificationSource: 'Demo Integration',
      isReusable: false,
    },
  });

  // Applications for Arjun
  const activeApp = await prisma.scholarshipApplication.create({
    data: {
      applicationNumber: 'APP-2024-91823',
      studentProfileId: arjunProfileId,
      schemeId: postMatric.id,
      status: 'DEPARTMENT_VERIFICATION',
      academicYear: '2024-2025',
      submittedAt: new Date('2024-07-20'),
      sanctionedAmount: 42000,
      timeline: {
        create: [
          {
            status: 'SUBMITTED',
            description: 'Application successfully submitted by student with 5 verified documents.',
            updatedBy: 'STUDENT',
            createdAt: new Date('2024-07-20T10:30:00Z'),
          },
          {
            status: 'IDENTITY_VERIFICATION',
            description: 'UIDAI Aadhaar OTP identity match verified.',
            updatedBy: 'SYSTEM',
            createdAt: new Date('2024-07-21T14:10:00Z'),
          },
          {
            status: 'DOCUMENT_VERIFICATION',
            description: 'ST Community & Income certificates cross-verified via State e-District repository.',
            updatedBy: 'SYSTEM',
            createdAt: new Date('2024-07-23T11:45:00Z'),
          },
          {
            status: 'INSTITUTION_VERIFICATION',
            description: 'Nodal Officer at Govt Arts College Coimbatore verified regular bonafide attendance and fees.',
            updatedBy: 'INSTITUTION_OFFICER',
            createdAt: new Date('2024-08-04T16:20:00Z'),
          },
          {
            status: 'DEPARTMENT_VERIFICATION',
            description: 'Application received at District Tribal Welfare Office, Coimbatore for final scrutiny.',
            actionRequired: 'None. Under administrative review.',
            updatedBy: 'DEPT_OFFICER',
            createdAt: new Date('2024-08-15T09:00:00Z'),
          },
        ],
      },
    },
  });

  // Payments for Arjun
  await prisma.payment.create({
    data: {
      studentProfileId: arjunProfileId,
      applicationId: activeApp.id,
      schemeId: postMatric.id,
      amount: 42000,
      installment: 'FULL',
      status: 'PAID',
      dbtReference: 'DBT-TN-2024-8841245',
      paymentDate: new Date('2024-03-15'),
      academicYear: '2023-2024',
      description: 'Post-Matric Scholarship DBT Credit (Tuition + Maintenance)',
    },
  });

  await prisma.payment.create({
    data: {
      studentProfileId: arjunProfileId,
      schemeId: preMatric.id,
      amount: 14000,
      installment: 'FULL',
      status: 'PAID',
      dbtReference: 'DBT-TN-2022-1194821',
      paymentDate: new Date('2022-11-20'),
      academicYear: '2021-2022',
      description: 'Pre-Matric Scholarship DBT Credit',
    },
  });

  // Notifications for Arjun
  await prisma.notification.createMany({
    data: [
      {
        userId: arjunUser.id,
        studentProfileId: arjunProfileId,
        type: 'ACTION_REQUIRED',
        title: 'Income Certificate Expiry Reminder',
        body: 'Your income certificate expires on 15 Nov 2024. Please apply for a renewal soon to prevent scholarship payment delays.',
        isRead: false,
      },
      {
        userId: arjunUser.id,
        studentProfileId: arjunProfileId,
        type: 'APPLICATION_UPDATE',
        title: 'Application Forwarded to Department',
        body: 'Your Post-Matric application (APP-2024-91823) has cleared Institution Verification and is now with the Tribal Welfare Department.',
        isRead: false,
      },
      {
        userId: arjunUser.id,
        studentProfileId: arjunProfileId,
        type: 'PAYMENT_UPDATE',
        title: 'Previous DBT Disbursement Confirmed',
        body: '₹42,000 was successfully disbursed to SBI account ending in ****4521 for Academic Year 2023-2024.',
        isRead: true,
      },
      {
        userId: arjunUser.id,
        studentProfileId: arjunProfileId,
        type: 'DOCUMENT_VERIFIED',
        title: 'Marksheet Verified',
        body: 'Your Semester 4 marksheet has been verified through the APAAR integration.',
        isRead: true,
      },
    ],
  });

  // Create 19 more diverse student profiles
  const sampleStates = [
    { state: 'Madhya Pradesh', district: 'Dhar', inst: 'Govt College Dhar' },
    { state: 'Odisha', district: 'Mayurbhanj', inst: 'North Orissa University' },
    { state: 'Jharkhand', district: 'Ranchi', inst: 'Ranchi University' },
    { state: 'Assam', district: 'Karbi Anglong', inst: 'Diphu Govt College' },
    { state: 'Rajasthan', district: 'Banswara', inst: 'Govt College Banswara' },
    { state: 'Maharashtra', district: 'Gadchiroli', inst: 'Gondwana University' },
    { state: 'Chhattisgarh', district: 'Bastar', inst: 'Bastar Vishwavidyalaya' },
    { state: 'Gujarat', district: 'Dahod', inst: 'Govt Arts College Dahod' },
    { state: 'Andhra Pradesh', district: 'Alluri Sitharama Raju', inst: 'Govt Degree College Paderu' },
    { state: 'Telangana', district: 'Bhadradri Kothagudem', inst: 'Kakatiya University' },
  ];

  const firstNames = ['Sunita', 'Birsa', 'Ramesh', 'Meena', 'Kavita', 'Sanjay', 'Laxmi', 'Anil', 'Pooja', 'Deepak', 'Geeta', 'Manoj', 'Sarita', 'Rajesh', 'Urmila', 'Vikram', 'Anjali', 'Kishore', 'Bhavna'];
  const lastNames = ['Munda', 'Oraon', 'Santhal', 'Gond', 'Bhil', 'Meena', 'Khasi', 'Garo', 'Bodo', 'Kol'];

  for (let i = 0; i < 19; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const loc = sampleStates[i % sampleStates.length];
    const mobile = `98000000${(i + 10).toString().padStart(2, '0')}`;
    const studentType = i % 4 === 0 ? 'SCHOOL' : i % 5 === 0 ? 'RESEARCH' : 'COLLEGE';
    const isST = true;

    const studentUser = await prisma.user.create({
      data: {
        mobile,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@demo.janjathi.gov.in`,
        passwordHash: defaultPasswordHash,
        role: 'STUDENT',
        studentProfile: {
          create: {
            fullName: `${fn} ${ln}`,
            dateOfBirth: '2004-02-18',
            gender: i % 2 === 0 ? 'FEMALE' : 'MALE',
            mobile,
            state: loc.state,
            district: loc.district,
            studentType,
            isSTCertified: isST,
            annualFamilyIncome: 120000 + (i * 10000),
            casteCategory: 'ST',
            profileCompletion: 80 + (i % 20),
            readinessScore: 75 + (i % 20),
            bankAccountMasked: `XXXX${(5000 + i)}`,
            bankVerified: true,
            dbtActive: true,
            academicProfile: {
              create: {
                institutionName: loc.inst,
                institutionType: studentType === 'RESEARCH' ? 'UNIVERSITY' : studentType === 'SCHOOL' ? 'SCHOOL' : 'COLLEGE',
                institutionState: loc.state,
                course: studentType === 'RESEARCH' ? 'Ph.D. Tribal Studies' : studentType === 'SCHOOL' ? 'Class 10' : 'B.A. Economics',
                academicYear: '2024-2025',
                yearOfStudy: studentType === 'SCHOOL' ? 10 : 2,
              },
            },
          },
        },
      },
      include: { studentProfile: true },
    });

    const sProfileId = studentUser.studentProfile!.id;

    // Add documents
    await prisma.document.create({
      data: {
        studentProfileId: sProfileId,
        documentType: 'ST_CERTIFICATE',
        documentName: 'ST Certificate',
        status: i % 6 === 0 ? 'MANUAL_REVIEW' : 'VERIFIED',
        verificationSource: 'e-District Demo Integration',
        isReusable: true,
      },
    });

    // Add Application
    const scheme = studentType === 'SCHOOL' ? preMatric : studentType === 'RESEARCH' ? nfst : postMatric;
    const statuses = ['SUBMITTED', 'DOCUMENT_VERIFICATION', 'INSTITUTION_VERIFICATION', 'SANCTIONED', 'DISBURSED'];
    const chosenStatus = statuses[i % statuses.length];

    await prisma.scholarshipApplication.create({
      data: {
        applicationNumber: `APP-2024-${(10000 + i)}`,
        studentProfileId: sProfileId,
        schemeId: scheme.id,
        status: chosenStatus,
        academicYear: '2024-2025',
        submittedAt: new Date(),
        sanctionedAmount: scheme.maxAmount,
        timeline: {
          create: {
            status: chosenStatus,
            description: `Application is currently at ${chosenStatus}`,
            updatedBy: 'SYSTEM',
          },
        },
      },
    });
  }

  // 4. Create Coverage Gap Records (Mock UDISE+ / APAAR / OTR matching)
  const coverageData = [
    { name: 'Karan Singha', state: 'Assam', district: 'Karbi Anglong', inst: 'Diphu Model School', level: 'SCHOOL', scheme: 'PRE_MATRIC' },
    { name: 'Rupali Sabar', state: 'Odisha', district: 'Koraput', inst: 'Govt Higher Secondary School Pangi', level: 'SCHOOL', scheme: 'PRE_MATRIC' },
    { name: 'Hemant Bheel', state: 'Rajasthan', district: 'Pratapgarh', inst: 'Tribal Area Dev College', level: 'COLLEGE', scheme: 'POST_MATRIC' },
    { name: 'Shanti Baiga', state: 'Madhya Pradesh', district: 'Mandla', inst: 'Mandla District Science Institute', level: 'COLLEGE', scheme: 'POST_MATRIC' },
    { name: 'Lalit Marandi', state: 'Jharkhand', district: 'Dumka', inst: 'Dumka Engineering College', level: 'COLLEGE', scheme: 'TOP_CLASS' },
    { name: 'Chitra Basumatary', state: 'Assam', district: 'Kokrajhar', inst: 'Bodoland University', level: 'RESEARCH', scheme: 'NFST' },
    { name: 'David Lalnunmawia', state: 'Mizoram', district: 'Aizawl', inst: 'Pachhunga University College', level: 'COLLEGE', scheme: 'POST_MATRIC' },
    { name: 'Megha Gamit', state: 'Gujarat', district: 'Tapi', inst: 'Tapi Science College', level: 'COLLEGE', scheme: 'POST_MATRIC' },
  ];

  for (let k = 0; k < coverageData.length; k++) {
    const item = coverageData[k];
    await prisma.coverageGapRecord.create({
      data: {
        sourceSystem: k % 2 === 0 ? 'UDISE' : 'APAAR',
        externalId: `EXT-GAP-${202400 + k}`,
        name: item.name,
        state: item.state,
        district: item.district,
        institutionName: item.inst,
        academicLevel: item.level,
        potentialScheme: item.scheme,
        status: k === 0 ? 'FLAGGED' : 'PENDING_OUTREACH',
      },
    });
  }

  console.log('✅ Database seeded successfully with realistic ST scholarship data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
