import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDatabase(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword || adminPassword.length < 12) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) are required to seed the database.',
    );
  }

  const passwordHash = await hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });

  await prisma.profile.upsert({
    where: { key: 'primary' },
    update: {},
    create: {
      key: 'primary',
      name: 'Ockyo',
      headline: 'Full-stack developer building dependable digital products.',
      shortBio: 'I turn complex product ideas into clear, fast, and maintainable software.',
      bio: 'I am a full-stack developer focused on thoughtful product engineering. I enjoy shaping systems from their data model through to the final interaction, with an emphasis on clarity, performance, and long-term maintainability.',
      philosophy:
        'Make the difficult parts understandable, then build the simplest thing that lasts.',
      currentFocus:
        'Production-ready TypeScript systems, developer experience, and polished web interfaces.',
      location: 'Bangkok, Thailand',
      email: adminEmail,
      availabilityStatus: 'AVAILABLE',
    },
  });

  const projects = [
    {
      title: 'whoisockyo',
      slug: 'whoisockyo',
      shortDescription: 'A premium developer portfolio with a secure content dashboard.',
      description:
        'A full-stack portfolio platform designed as a real product: structured content management, secure administrator authentication, responsive public pages, and a clear TypeScript architecture.',
      technologies: ['React', 'TypeScript', 'Express', 'PostgreSQL', 'Prisma'],
      status: 'IN_PROGRESS' as const,
      featured: true,
      published: true,
      displayOrder: 0,
    },
    {
      title: 'System Design Notes',
      slug: 'system-design-notes',
      shortDescription: 'An evolving knowledge base for practical software architecture decisions.',
      description:
        'A focused collection of architectural patterns, trade-off analyses, and production lessons from building web applications and internal platforms.',
      technologies: ['TypeScript', 'Node.js', 'PostgreSQL'],
      status: 'PLANNED' as const,
      featured: true,
      published: true,
      displayOrder: 1,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }

  await prisma.experience.upsert({
    where: {
      company_position_startDate: {
        company: 'Independent',
        position: 'Full-stack Developer',
        startDate: new Date('2023-01-01T00:00:00.000Z'),
      },
    },
    update: {},
    create: {
      company: 'Independent',
      position: 'Full-stack Developer',
      location: 'Remote',
      startDate: new Date('2023-01-01T00:00:00.000Z'),
      endDate: null,
      isCurrent: true,
      description:
        'Designing and delivering full-stack products with a focus on reliable systems, clear user experiences, and maintainable code.',
      technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      displayOrder: 0,
    },
  });

  const skills = [
    ['TypeScript', 'LANGUAGE', 90, 0],
    ['JavaScript', 'LANGUAGE', 90, 1],
    ['React', 'FRONTEND', 88, 0],
    ['Tailwind CSS', 'FRONTEND', 85, 1],
    ['Node.js', 'BACKEND', 88, 0],
    ['Express', 'BACKEND', 85, 1],
    ['PostgreSQL', 'DATABASE', 82, 0],
    ['Prisma', 'DATABASE', 85, 1],
    ['Docker', 'DEVOPS', 75, 0],
    ['Git', 'TOOL', 90, 0],
  ] as const;

  for (const [name, category, proficiency, displayOrder] of skills) {
    await prisma.skill.upsert({
      where: { name_category: { name, category } },
      update: {},
      create: { name, category, proficiency, displayOrder },
    });
  }

  const socialLinks = [
    { platform: 'GitHub', url: 'https://github.com/', icon: 'github', displayOrder: 0 },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/', icon: 'linkedin', displayOrder: 1 },
  ];

  for (const socialLink of socialLinks) {
    await prisma.socialLink.upsert({
      where: { platform: socialLink.platform },
      update: {},
      create: socialLink,
    });
  }

  await prisma.siteSettings.upsert({
    where: { key: 'primary' },
    update: {},
    create: {
      key: 'primary',
      siteTitle: 'whoisockyo',
      siteDescription: 'Full-stack developer portfolio and selected work.',
      seoTitle: 'Ockyo — Full-stack Developer',
      seoDescription:
        'Portfolio of Ockyo, a full-stack developer building dependable and polished digital products.',
      isContactFormEnabled: true,
    },
  });
}

seedDatabase()
  .then(() => {
    console.info('Database seeded successfully.');
  })
  .catch((error: unknown) => {
    console.error('Database seeding failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
