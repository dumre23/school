import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  await prisma.admin.create({
    data: {
      id: "user_35m57KI3Kwi0uPRWX7hrQBScJ8L",
      username: "admin1",
    },
  });

  // GRADE
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({
      data: {
        level: i,
      },
    });
  }

  // CLASS
  for (let i = 1; i <= 6; i++) {
    await prisma.class.create({
      data: {
        name: `${i}A`, 
        gradeId: i, 
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
  }

  // SUBJECT
  const subjectData = [
    { name: "Mathematics" },
    { name: "Science" },
    { name: "English" },
    { name: "History" },
    { name: "Geography" },
    { name: "Physics" },
    { name: "Chemistry" },
    { name: "Biology" },
    { name: "Computer Science" },
    { name: "Art" },
  ];

  for (const subject of subjectData) {
    await prisma.subject.create({ data: subject });
  }

  // TEACHER
  // First teacher with real Clerk ID
  await prisma.teacher.create({
    data: {
      id: "user_35mnIp16jsEvxb8MCJrDzak5asY",
      username: "teacher1",
      name: "John",
      surname: "Doe",
      email: "teacher1@example.com",
      phone: "123-456-7891",
      address: "Address1",
      bloodType: "A+",
      sex: UserSex.MALE,
      subjects: { connect: [{ id: 1 }, { id: 2 }] }, 
      classes: { connect: [{ id: 1 }, { id: 2 }] }, 
      birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
    },
  });
  
  // Additional dummy teachers with assigned classes
  for (let i = 2; i <= 15; i++) {
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`,
        username: `teacher${i}`,
        name: `TName${i}`,
        surname: `TSurname${i}`,
        email: `teacher${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        subjects: { connect: [{ id: (i % 10) + 1 }] }, 
        classes: { 
          connect: [
            { id: (i % 6) + 1 },
            { id: ((i + 1) % 6) + 1 }
          ] 
        }, 
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      },
    });
  }

  // UPDATE CLASSES WITH SUPERVISORS
  await prisma.class.update({
    where: { id: 1 },
    data: { supervisorId: "user_35mnIp16jsEvxb8MCJrDzak5asY" },
  });
  await prisma.class.update({
    where: { id: 2 },
    data: { supervisorId: "user_35mnIp16jsEvxb8MCJrDzak5asY" },
  });
  await prisma.class.update({
    where: { id: 3 },
    data: { supervisorId: "teacher2" },
  });
  await prisma.class.update({
    where: { id: 4 },
    data: { supervisorId: "teacher3" },
  });
  await prisma.class.update({
    where: { id: 5 },
    data: { supervisorId: "teacher4" },
  });
  await prisma.class.update({
    where: { id: 6 },
    data: { supervisorId: "teacher5" },
  });

  // LESSON
  // Teacher1 schedule with proper time slots (Monday-Friday)
  // November 17-21, 2025 (Monday to Friday)
  const teacher1Lessons = [
    // Monday (Nov 17)
    { name: "Math 1A", day: Day.MONDAY, startTime: new Date(2024, 10, 18, 9, 0), endTime: new Date(2024, 10, 18, 10, 0), subjectId: 1, classId: 1 },
    { name: "Math 2A", day: Day.MONDAY, startTime: new Date(2024, 10, 18, 10, 30), endTime: new Date(2024, 10, 18, 11, 30), subjectId: 1, classId: 2 },
    { name: "Science 1A", day: Day.MONDAY, startTime: new Date(2024, 10, 18, 13, 0), endTime: new Date(2024, 10, 18, 14, 0), subjectId: 2, classId: 1 },
    // Tuesday (Nov 19)
    { name: "Math 1A", day: Day.TUESDAY, startTime: new Date(2024, 10, 19, 8, 30), endTime: new Date(2024, 10, 19, 9, 30), subjectId: 1, classId: 1 },
    { name: "Science 2A", day: Day.TUESDAY, startTime: new Date(2024, 10, 19, 11, 0), endTime: new Date(2024, 10, 19, 12, 0), subjectId: 2, classId: 2 },
    { name: "Math 2A", day: Day.TUESDAY, startTime: new Date(2024, 10, 19, 14, 0), endTime: new Date(2024, 10, 19, 15, 0), subjectId: 1, classId: 2 },
    // Wednesday (Nov 20)
    { name: "Science 1A", day: Day.WEDNESDAY, startTime: new Date(2024, 10, 20, 9, 0), endTime: new Date(2024, 10, 20, 10, 0), subjectId: 2, classId: 1 },
    { name: "Math 1A", day: Day.WEDNESDAY, startTime: new Date(2024, 10, 20, 10, 30), endTime: new Date(2024, 10, 20, 11, 30), subjectId: 1, classId: 1 },
    { name: "Science 2A", day: Day.WEDNESDAY, startTime: new Date(2024, 10, 20, 13, 30), endTime: new Date(2024, 10, 20, 14, 30), subjectId: 2, classId: 2 },
    // Thursday (Nov 21)
    { name: "Math 2A", day: Day.THURSDAY, startTime: new Date(2024, 10, 21, 9, 30), endTime: new Date(2024, 10, 21, 10, 30), subjectId: 1, classId: 2 },
    { name: "Science 1A", day: Day.THURSDAY, startTime: new Date(2024, 10, 21, 11, 0), endTime: new Date(2024, 10, 21, 12, 0), subjectId: 2, classId: 1 },
    { name: "Math 1A", day: Day.THURSDAY, startTime: new Date(2024, 10, 21, 14, 30), endTime: new Date(2024, 10, 21, 15, 30), subjectId: 1, classId: 1 },
    // Friday (Nov 22)
    { name: "Science 2A", day: Day.FRIDAY, startTime: new Date(2024, 10, 22, 8, 30), endTime: new Date(2024, 10, 22, 9, 30), subjectId: 2, classId: 2 },
    { name: "Math 2A", day: Day.FRIDAY, startTime: new Date(2024, 10, 22, 10, 0), endTime: new Date(2024, 10, 22, 11, 0), subjectId: 1, classId: 2 },
    { name: "Science 1A", day: Day.FRIDAY, startTime: new Date(2024, 10, 22, 13, 0), endTime: new Date(2024, 10, 22, 14, 0), subjectId: 2, classId: 1 },
  ];

  for (const lesson of teacher1Lessons) {
    await prisma.lesson.create({
      data: {
        ...lesson,
        teacherId: "user_35mnIp16jsEvxb8MCJrDzak5asY",
      },
    });
  }

  // Additional lessons for other teachers
  for (let i = 16; i <= 30; i++) {
    await prisma.lesson.create({
      data: {
        name: `Lesson${i}`, 
        day: Day[
          Object.keys(Day)[
            Math.floor(Math.random() * Object.keys(Day).length)
          ] as keyof typeof Day
        ], 
        startTime: new Date(2025, 0, 1, 9 + (i % 6), 0), 
        endTime: new Date(2025, 0, 1, 10 + (i % 6), 0), 
        subjectId: (i % 10) + 1, 
        classId: (i % 6) + 1, 
        teacherId: `teacher${((i - 15) % 14) + 2}`, 
      },
    });
  }

  // PARENT
  for (let i = 1; i <= 25; i++) {
    await prisma.parent.create({
      data: {
        id: `parentId${i}`,
        username: `parentId${i}`,
        name: `PName ${i}`,
        surname: `PSurname ${i}`,
        email: `parent${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
      },
    });
  }

  // STUDENT
  for (let i = 1; i <= 50; i++) {
    await prisma.student.create({
      data: {
        id: `student${i}`, 
        username: `student${i}`, 
        name: `SName${i}`,
        surname: `SSurname ${i}`,
        email: `student${i}@example.com`,
        phone: `987-654-321${i}`,
        address: `Address${i}`,
        bloodType: "O-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`, 
        gradeId: (i % 6) + 1, 
        classId: (i % 6) + 1, 
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
      },
    });
  }

  // EXAM
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.create({
      data: {
        title: `Exam ${i}`, 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // ASSIGNMENT
  for (let i = 1; i <= 10; i++) {
    await prisma.assignment.create({
      data: {
        title: `Assignment ${i}`, 
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)), 
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // RESULT
  for (let i = 1; i <= 10; i++) {
    await prisma.result.create({
      data: {
        score: 90, 
        studentId: `student${i}`, 
        ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }), 
      },
    });
  }

  // ATTENDANCE
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(), 
        present: true, 
        studentId: `student${i}`, 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // EVENT
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i}`, 
        description: `Description for Event ${i}`, 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
        classId: (i % 5) + 1, 
      },
    });
  }

  // ANNOUNCEMENT
  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `Announcement ${i}`, 
        description: `Description for Announcement ${i}`, 
        date: new Date(), 
        classId: (i % 5) + 1, 
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
