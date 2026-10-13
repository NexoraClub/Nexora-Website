// Prisma schema recommendation for Nexora website learning and academic resources.
// Keep database changes isolated. When you wish to persist learning resources to PostgreSQL/Supabase,
// run: npx prisma migrate dev --name init_learning_models

/*
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

model LearningResource {
  id          String   @id @default(cuid())
  title       String
  subject     String
  semester    Int?
  category    String   @default("notes") // notes, question_papers, tutorials, syllabus
  description String
  fileType    String?  @default("PDF")
  fileUrl     String?
  uploadedAt  DateTime @default(now())
  tags        String[]
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([subject])
  @@index([semester])
  @@index([category])
}

model ExamSchedule {
  id          String   @id @default(cuid())
  title       String
  subject     String
  subjectCode String
  semester    Int
  examType    String   // Internal Assessment, Semester End Exam, Lab Examination
  examDate    DateTime
  timeSlot    String
  venue       String?
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([semester])
  @@index([examDate])
}

model AcademicAnnouncement {
  id          String   @id @default(cuid())
  title       String
  description String
  details     String?
  category    String   @default("Academic")
  priority    String   @default("normal") // normal, high, urgent
  linkUrl     String?
  publishedAt DateTime @default(now())
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
*/

export const SCHEMA_NOTE = "Schema blueprint ready for optional Prisma migrations.";
