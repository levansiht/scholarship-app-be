/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean database (in development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaning database...');
    await prisma.applicationReview.deleteMany();
    await prisma.applicationDocument.deleteMany();
    await prisma.applicationTimeline.deleteMany();
    await prisma.application.deleteMany();
    await prisma.savedScholarship.deleteMany();
    await prisma.scholarshipDocument.deleteMany();
    await prisma.eligibilityCriteria.deleteMany();
    await prisma.scholarshipRequirement.deleteMany();
    await prisma.scholarshipCategory.deleteMany();
    await prisma.scholarship.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.emailVerification.deleteMany();
    await prisma.passwordReset.deleteMany();
    await prisma.sponsorProfile.deleteMany();
    await prisma.studentProfile.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.user.deleteMany();
  }

  // Hash password
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // ===================================
  // CREATE USERS
  // ===================================

  // Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@scholarship.com',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'System',
          fullName: 'Admin System',
          phoneNumber: '+84901234567',
          gender: 'MALE',
          city: 'Ho Chi Minh',
          country: 'Vietnam',
          bio: 'System Administrator',
        },
      },
    },
  });
  console.log('✅ Created admin user');

  // Sponsor Users
  const sponsor1 = await prisma.user.create({
    data: {
      email: 'vingroup@sponsor.com',
      password: hashedPassword,
      role: 'SPONSOR',
      status: 'ACTIVE',
      profile: {
        create: {
          firstName: 'Vingroup',
          lastName: 'Foundation',
          fullName: 'Vingroup Foundation',
          phoneNumber: '+84902345678',
          city: 'Hanoi',
          country: 'Vietnam',
        },
      },
      sponsorProfile: {
        create: {
          organizationName: 'Vingroup Foundation',
          organizationType: 'Company',
          website: 'https://vingroup.net',
          description:
            'Leading Vietnamese conglomerate committed to education and innovation',
          verified: true,
          verifiedAt: new Date(),
        },
      },
    },
  });

  const sponsor2 = await prisma.user.create({
    data: {
      email: 'viettel@sponsor.com',
      password: hashedPassword,
      role: 'SPONSOR',
      status: 'ACTIVE',
      profile: {
        create: {
          firstName: 'Viettel',
          lastName: 'Group',
          fullName: 'Viettel Group',
          phoneNumber: '+84903456789',
          city: 'Hanoi',
          country: 'Vietnam',
        },
      },
      sponsorProfile: {
        create: {
          organizationName: 'Viettel Group',
          organizationType: 'Company',
          website: 'https://viettel.com.vn',
          description:
            'Largest telecommunications company in Vietnam supporting technology education',
          verified: true,
          verifiedAt: new Date(),
        },
      },
    },
  });
  console.log('✅ Created sponsor users');

  // Student Users
  const student1 = await prisma.user.create({
    data: {
      email: 'student1@gmail.com',
      password: hashedPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      profile: {
        create: {
          firstName: 'Nguyen',
          lastName: 'Van An',
          fullName: 'Nguyen Van An',
          phoneNumber: '+84904567890',
          dateOfBirth: new Date('2003-05-15'),
          gender: 'MALE',
          city: 'Ho Chi Minh',
          country: 'Vietnam',
          bio: 'Computer Science student passionate about AI and Machine Learning',
        },
      },
      studentProfile: {
        create: {
          studentId: 'CS2021001',
          university: 'Ho Chi Minh University of Technology',
          major: 'Computer Science',
          yearOfStudy: 3,
          expectedGradYear: 2025,
          gpa: 3.8,
          skills: [
            'JavaScript',
            'Python',
            'React',
            'Node.js',
            'Machine Learning',
          ],
          interests: ['AI', 'Web Development', 'Data Science'],
          achievements: [
            { title: 'First Prize - Hackathon 2023', year: 2023 },
            { title: "Dean's List", year: 2022 },
          ],
        },
      },
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'student2@gmail.com',
      password: hashedPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      profile: {
        create: {
          firstName: 'Tran',
          lastName: 'Thi Bich',
          fullName: 'Tran Thi Bich',
          phoneNumber: '+84905678901',
          dateOfBirth: new Date('2004-08-20'),
          gender: 'FEMALE',
          city: 'Hanoi',
          country: 'Vietnam',
          bio: 'Business Administration student with interest in entrepreneurship',
        },
      },
      studentProfile: {
        create: {
          studentId: 'BA2021002',
          university: 'Foreign Trade University',
          major: 'Business Administration',
          yearOfStudy: 2,
          expectedGradYear: 2026,
          gpa: 3.9,
          skills: ['Business Analysis', 'Marketing', 'Financial Management'],
          interests: ['Entrepreneurship', 'Marketing', 'E-commerce'],
          achievements: [{ title: 'Outstanding Student Award', year: 2023 }],
        },
      },
    },
  });

  const student3 = await prisma.user.create({
    data: {
      email: 'student3@gmail.com',
      password: hashedPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      profile: {
        create: {
          firstName: 'Le',
          lastName: 'Minh Quan',
          fullName: 'Le Minh Quan',
          phoneNumber: '+84906789012',
          dateOfBirth: new Date('2003-12-10'),
          gender: 'MALE',
          city: 'Da Nang',
          country: 'Vietnam',
          bio: 'Engineering student focused on renewable energy',
        },
      },
      studentProfile: {
        create: {
          studentId: 'EE2021003',
          university: 'Da Nang University of Technology',
          major: 'Electrical Engineering',
          yearOfStudy: 4,
          expectedGradYear: 2024,
          gpa: 3.7,
          skills: ['Circuit Design', 'Renewable Energy', 'AutoCAD', 'MATLAB'],
          interests: ['Green Energy', 'Sustainability', 'Innovation'],
        },
      },
    },
  });
  console.log('✅ Created student users');

  // ===================================
  // CREATE SCHOLARSHIPS
  // ===================================

  const scholarship1 = await prisma.scholarship.create({
    data: {
      createdBy: sponsor1.id,
      title: 'Vingroup Innovation Scholarship 2024',
      slug: 'vingroup-innovation-scholarship-2024',
      description: `The Vingroup Innovation Scholarship is designed to support outstanding Vietnamese students pursuing careers in technology and innovation.

**Benefits:**
- Full tuition coverage for one academic year
- Monthly stipend of 5,000,000 VND
- Internship opportunity at Vingroup
- Mentorship from industry leaders

**Requirements:**
- GPA of 3.5 or higher
- Demonstrated passion for technology and innovation
- Active participation in tech communities`,
      amount: 100000000, // 100 million VND
      currency: 'VND',
      numberOfSlots: 10,
      availableSlots: 10,
      deadline: new Date('2024-12-31'),
      status: 'OPEN',
      featured: true,
      tags: ['Technology', 'Innovation', 'Full Scholarship'],
      publishedAt: new Date(),
      categories: {
        create: [
          { name: 'Technology' },
          { name: 'Engineering' },
          { name: 'Innovation' },
        ],
      },
      requirements: {
        create: [
          {
            title: 'Academic Transcript',
            description: 'Official transcript showing GPA of 3.5 or higher',
            isRequired: true,
            displayOrder: 1,
          },
          {
            title: 'Personal Statement',
            description:
              'Essay (500-1000 words) describing your passion for technology',
            isRequired: true,
            displayOrder: 2,
          },
          {
            title: 'Recommendation Letter',
            description: 'Letter from a professor or industry professional',
            isRequired: true,
            displayOrder: 3,
          },
        ],
      },
      eligibility: {
        create: {
          minGPA: 3.5,
          allowedMajors: [
            'Computer Science',
            'Information Technology',
            'Software Engineering',
            'Data Science',
          ],
          allowedYears: [2, 3, 4],
          nationality: ['Vietnam'],
        },
      },
    },
  });

  const scholarship2 = await prisma.scholarship.create({
    data: {
      createdBy: sponsor2.id,
      title: 'Viettel Future Leaders Scholarship',
      slug: 'viettel-future-leaders-scholarship',
      description: `Viettel Future Leaders Scholarship supports talented students in telecommunications and business fields.

**Benefits:**
- 50 million VND per year
- Summer internship at Viettel
- Professional development workshops
- Networking opportunities

**Target:**
Students demonstrating leadership potential and academic excellence`,
      amount: 50000000, // 50 million VND
      currency: 'VND',
      numberOfSlots: 15,
      availableSlots: 15,
      deadline: new Date('2024-11-30'),
      status: 'OPEN',
      featured: true,
      tags: ['Telecommunications', 'Leadership', 'Business'],
      publishedAt: new Date(),
      categories: {
        create: [
          { name: 'Telecommunications' },
          { name: 'Business' },
          { name: 'Leadership' },
        ],
      },
      requirements: {
        create: [
          {
            title: 'Academic Records',
            description: 'Transcript with minimum GPA of 3.0',
            isRequired: true,
            displayOrder: 1,
          },
          {
            title: 'Leadership Experience',
            description:
              'Documentation of leadership roles in student organizations',
            isRequired: true,
            displayOrder: 2,
          },
        ],
      },
      eligibility: {
        create: {
          minGPA: 3.0,
          allowedMajors: [
            'Telecommunications',
            'Business Administration',
            'Marketing',
            'Computer Science',
          ],
          allowedYears: [2, 3],
          nationality: ['Vietnam'],
        },
      },
    },
  });

  const scholarship3 = await prisma.scholarship.create({
    data: {
      createdBy: sponsor1.id,
      title: 'Women in Tech Scholarship',
      slug: 'women-in-tech-scholarship',
      description: `Supporting women pursuing careers in technology fields.

**Benefits:**
- 30 million VND
- Mentorship program with female tech leaders
- Access to exclusive tech workshops`,
      amount: 30000000,
      currency: 'VND',
      numberOfSlots: 20,
      availableSlots: 20,
      deadline: new Date('2024-10-31'),
      status: 'OPEN',
      featured: false,
      tags: ['Women in Tech', 'Diversity', 'Technology'],
      publishedAt: new Date(),
      categories: {
        create: [{ name: 'Technology' }, { name: 'Diversity' }],
      },
      requirements: {
        create: [
          {
            title: 'Academic Transcript',
            description: 'Official transcript',
            isRequired: true,
            displayOrder: 1,
          },
        ],
      },
      eligibility: {
        create: {
          minGPA: 2.8,
          allowedMajors: [
            'Computer Science',
            'Information Technology',
            'Software Engineering',
          ],
          gender: 'FEMALE',
          nationality: ['Vietnam'],
        },
      },
    },
  });
  console.log('✅ Created scholarships');

  // ===================================
  // CREATE APPLICATIONS
  // ===================================

  const application1 = await prisma.application.create({
    data: {
      scholarshipId: scholarship1.id,
      applicantId: student1.id,
      status: 'SUBMITTED',
      coverLetter:
        'I am passionate about technology and innovation. This scholarship would help me achieve my dreams...',
      submittedAt: new Date(),
      timeline: {
        create: [
          {
            status: 'DRAFT',
            description: 'Application created',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          },
          {
            status: 'SUBMITTED',
            description: 'Application submitted',
            createdAt: new Date(),
          },
        ],
      },
    },
  });

  const application2 = await prisma.application.create({
    data: {
      scholarshipId: scholarship2.id,
      applicantId: student2.id,
      status: 'UNDER_REVIEW',
      coverLetter:
        'As a business student with leadership experience, I believe I am a strong candidate...',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      timeline: {
        create: [
          {
            status: 'SUBMITTED',
            description: 'Application submitted',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            status: 'UNDER_REVIEW',
            description: 'Application is being reviewed',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
        ],
      },
    },
  });

  const application3 = await prisma.application.create({
    data: {
      scholarshipId: scholarship1.id,
      applicantId: student3.id,
      status: 'DRAFT',
      coverLetter: 'Draft application...',
    },
  });
  console.log('✅ Created applications');

  // ===================================
  // CREATE SAVED SCHOLARSHIPS
  // ===================================

  await prisma.savedScholarship.createMany({
    data: [
      {
        userId: student1.id,
        scholarshipId: scholarship2.id,
        note: 'Interested in leadership program',
      },
      {
        userId: student2.id,
        scholarshipId: scholarship1.id,
        note: 'High GPA required - need to improve',
      },
    ],
  });
  console.log('✅ Created saved scholarships');

  // ===================================
  // CREATE NOTIFICATIONS
  // ===================================

  await prisma.notification.createMany({
    data: [
      {
        userId: student1.id,
        type: 'APPLICATION_STATUS_CHANGE',
        title: 'Application Submitted',
        message:
          'Your application for Vingroup Innovation Scholarship has been submitted successfully',
      },
      {
        userId: student1.id,
        type: 'NEW_SCHOLARSHIP',
        title: 'New Scholarship Available',
        message: 'Check out the new Women in Tech Scholarship',
      },
      {
        userId: student2.id,
        type: 'DEADLINE_REMINDER',
        title: 'Deadline Approaching',
        message: 'Viettel Future Leaders Scholarship deadline is in 7 days',
      },
    ],
  });
  console.log('✅ Created notifications');

  console.log('🎉 Database seeding completed!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${await prisma.user.count()}`);
  console.log(`- Scholarships: ${await prisma.scholarship.count()}`);
  console.log(`- Applications: ${await prisma.application.count()}`);
  console.log(`\n🔐 Login Credentials:`);
  console.log('Admin: admin@scholarship.com / Password123!');
  console.log('Sponsor: vingroup@sponsor.com / Password123!');
  console.log('Student: student1@gmail.com / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
