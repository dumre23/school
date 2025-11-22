"use server";

import { revalidatePath } from "next/cache";
import {
  AssignmentSchema,
  AttendanceSchema,
  ClassSchema,
  ExamSchema,
  ResultSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
  ParentSchema,
  LessonSchema,
  EventSchema,
  AnnouncementSchema,
  assignmentSchema,
  attendanceSchema,
  examSchema,
  resultSchema,
  studentSchema,
  teacherSchema,
  parentSchema,
  lessonSchema,
  eventSchema,
  announcementSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.create({
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createTeacher = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);
    const subjects = formData.getAll("subjects");
    const dataWithSubjects = { ...rawData, subjects };
    const validatedData = teacherSchema.parse(dataWithSubjects);
    
    const user = await clerkClient.users.createUser({
      username: validatedData.username,
      password: validatedData.password,
      firstName: validatedData.name,
      lastName: validatedData.surname,
      publicMetadata:{role:"teacher"}
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: validatedData.username,
        name: validatedData.name,
        surname: validatedData.surname,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        address: validatedData.address,
        img: validatedData.img || null,
        bloodType: validatedData.bloodType,
        sex: validatedData.sex,
        birthday: validatedData.birthday,
        subjects: {
          connect: validatedData.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err: any) {
    console.error("Error creating teacher:", err);
    
    // Handle Clerk-specific errors
    if (err.clerkError && err.errors) {
      const errorMessages = err.errors.map((e: any) => e.longMessage).join(", ");
      console.error("Clerk validation errors:", errorMessages);
    }
    
    if (err instanceof Error) {
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
    }
    return { success: false, error: true };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);
    const subjects = formData.getAll("subjects");
    const dataWithSubjects = { ...rawData, subjects };
    const validatedData = teacherSchema.parse(dataWithSubjects);
    
    if (!validatedData.id) {
      return { success: false, error: true };
    }
    
    // Try to update Clerk user, but continue if user doesn't exist in Clerk
    try {
      await clerkClient.users.updateUser(validatedData.id, {
        username: validatedData.username,
        ...(validatedData.password !== "" && { password: validatedData.password }),
        firstName: validatedData.name,
        lastName: validatedData.surname,
      });
    } catch (clerkError: any) {
      // If user doesn't exist in Clerk (404), just update database
      if (clerkError?.status !== 404) {
        // If it's not a 404, it's a real error - rethrow it
        throw clerkError;
      }
      console.log(`Teacher ${validatedData.id} not found in Clerk, updating database only`);
    }

    await prisma.teacher.update({
      where: {
        id: validatedData.id,
      },
      data: {
        ...(validatedData.password !== "" && { password: validatedData.password }),
        username: validatedData.username,
        name: validatedData.name,
        surname: validatedData.surname,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        address: validatedData.address,
        img: validatedData.img || null,
        bloodType: validatedData.bloodType,
        sex: validatedData.sex,
        birthday: validatedData.birthday,
        subjects: {
          set: validatedData.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating teacher:", err);
    if (err instanceof Error) {
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
    }
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    // Try to delete from Clerk, but continue if user doesn't exist
    try {
      await clerkClient.users.deleteUser(id);
    } catch (clerkError: any) {
      if (clerkError?.status !== 404) {
        throw clerkError;
      }
      console.log(`Teacher ${id} not found in Clerk, deleting from database only`);
    }

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = studentSchema.parse(data);
    console.log(validatedData);
    
    const classItem = await prisma.class.findUnique({
      where: { id: validatedData.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }

    const user = await clerkClient.users.createUser({
      username: validatedData.username,
      password: validatedData.password,
      firstName: validatedData.name,
      lastName: validatedData.surname,
      publicMetadata:{role:"student"}
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: validatedData.username,
        name: validatedData.name,
        surname: validatedData.surname,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        address: validatedData.address,
        img: validatedData.img || null,
        bloodType: validatedData.bloodType,
        sex: validatedData.sex,
        birthday: validatedData.birthday,
        gradeId: validatedData.gradeId,
        classId: validatedData.classId,
        parentId: validatedData.parentId,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = studentSchema.parse(data);
    
    if (!validatedData.id) {
      return { success: false, error: true };
    }
    
    // Try to update Clerk user, but continue if user doesn't exist in Clerk
    try {
      await clerkClient.users.updateUser(validatedData.id, {
        username: validatedData.username,
        ...(validatedData.password !== "" && { password: validatedData.password }),
        firstName: validatedData.name,
        lastName: validatedData.surname,
      });
    } catch (clerkError: any) {
      // If user doesn't exist in Clerk (404), just update database
      if (clerkError?.status !== 404) {
        // If it's not a 404, it's a real error - rethrow it
        throw clerkError;
      }
      console.log(`Student ${validatedData.id} not found in Clerk, updating database only`);
    }

    await prisma.student.update({
      where: {
        id: validatedData.id,
      },
      data: {
        ...(validatedData.password !== "" && { password: validatedData.password }),
        username: validatedData.username,
        name: validatedData.name,
        surname: validatedData.surname,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        address: validatedData.address,
        img: validatedData.img || null,
        bloodType: validatedData.bloodType,
        sex: validatedData.sex,
        birthday: validatedData.birthday,
        gradeId: validatedData.gradeId,
        classId: validatedData.classId,
        parentId: validatedData.parentId,
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating student:", err);
    if (err instanceof Error) {
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
    }
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    // Try to delete from Clerk, but continue if user doesn't exist
    try {
      await clerkClient.users.deleteUser(id);
    } catch (clerkError: any) {
      if (clerkError?.status !== 404) {
        throw clerkError;
      }
      console.log(`Student ${id} not found in Clerk, deleting from database only`);
    }

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createExam = async (
  currentState: CurrentState,
  formData: FormData
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    const data = Object.fromEntries(formData);
    const validatedData = examSchema.parse(data);
    
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: validatedData.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.create({
      data: {
        title: validatedData.title,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        lessonId: validatedData.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  formData: FormData
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    const data = Object.fromEntries(formData);
    const validatedData = examSchema.parse(data);
    
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: validatedData.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.update({
      where: {
        id: validatedData.id,
      },
      data: {
        title: validatedData.title,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        lessonId: validatedData.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// ASSIGNMENT ACTIONS

export const createAssignment = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = assignmentSchema.parse(data);
    
    await prisma.assignment.create({
      data: {
        title: validatedData.title,
        startDate: validatedData.startDate,
        dueDate: validatedData.dueDate,
        lessonId: validatedData.lessonId,
      },
    });

    // revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAssignment = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = assignmentSchema.parse(data);
    
    await prisma.assignment.update({
      where: {
        id: validatedData.id,
      },
      data: {
        title: validatedData.title,
        startDate: validatedData.startDate,
        dueDate: validatedData.dueDate,
        lessonId: validatedData.lessonId,
      },
    });

    // revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.assignment.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// RESULT ACTIONS

export const createResult = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = resultSchema.parse(data);
    
    await prisma.result.create({
      data: {
        score: validatedData.score,
        examId: validatedData.examId || null,
        assignmentId: validatedData.assignmentId || null,
        studentId: validatedData.studentId,
      },
    });

    // revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateResult = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = resultSchema.parse(data);
    
    await prisma.result.update({
      where: {
        id: validatedData.id,
      },
      data: {
        score: validatedData.score,
        examId: validatedData.examId || null,
        assignmentId: validatedData.assignmentId || null,
        studentId: validatedData.studentId,
      },
    });

    // revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteResult = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.result.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// ATTENDANCE ACTIONS

export const createAttendance = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = attendanceSchema.parse(data);
    
    const present = validatedData.present === true || 
                   validatedData.present === "true" || 
                   String(validatedData.present).toLowerCase() === "true";
    
    await prisma.attendance.create({
      data: {
        date: validatedData.date,
        present: present,
        studentId: validatedData.studentId,
        lessonId: validatedData.lessonId,
      },
    });

    // revalidatePath("/list/attendance");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAttendance = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = attendanceSchema.parse(data);
    
    const present = validatedData.present === true || 
                   validatedData.present === "true" || 
                   String(validatedData.present).toLowerCase() === "true";
    
    await prisma.attendance.update({
      where: {
        id: validatedData.id,
      },
      data: {
        date: validatedData.date,
        present: present,
        studentId: validatedData.studentId,
        lessonId: validatedData.lessonId,
      },
    });

    // revalidatePath("/list/attendance");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAttendance = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.attendance.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/attendance");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// PARENT ACTIONS

export const createParent = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = parentSchema.parse(data);

    const user = await clerkClient.users.createUser({
      username: validatedData.username,
      password: validatedData.password,
      firstName: validatedData.name,
      lastName: validatedData.surname,
      publicMetadata: { role: "parent" },
    });

    await prisma.parent.create({
      data: {
        id: user.id,
        username: validatedData.username,
        name: validatedData.name,
        surname: validatedData.surname,
        email: validatedData.email || null,
        phone: validatedData.phone,
        address: validatedData.address,
      },
    });

    // revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating parent:", err);
    return { success: false, error: true };
  }
};

export const updateParent = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = parentSchema.parse(data);

    if (!validatedData.id) {
      return { success: false, error: true };
    }

    try {
      await clerkClient.users.updateUser(validatedData.id, {
        username: validatedData.username,
        ...(validatedData.password !== "" && {
          password: validatedData.password,
        }),
        firstName: validatedData.name,
        lastName: validatedData.surname,
      });
    } catch (clerkError: any) {
      if (clerkError?.status !== 404) {
        throw clerkError;
      }
      console.log(
        `Parent ${validatedData.id} not found in Clerk, updating database only`
      );
    }

    await prisma.parent.update({
      where: {
        id: validatedData.id,
      },
      data: {
        username: validatedData.username,
        name: validatedData.name,
        surname: validatedData.surname,
        email: validatedData.email || null,
        phone: validatedData.phone,
        address: validatedData.address,
      },
    });

    // revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating parent:", err);
    return { success: false, error: true };
  }
};

export const deleteParent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    try {
      await clerkClient.users.deleteUser(id);
    } catch (clerkError: any) {
      if (clerkError?.status !== 404) {
        throw clerkError;
      }
      console.log(
        `Parent ${id} not found in Clerk, deleting from database only`
      );
    }

    await prisma.parent.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// LESSON ACTIONS

export const createLesson = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = lessonSchema.parse(data);

    await prisma.lesson.create({
      data: {
        name: validatedData.name,
        day: validatedData.day,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        subjectId: validatedData.subjectId,
        classId: validatedData.classId,
        teacherId: validatedData.teacherId,
      },
    });

    // revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating lesson:", err);
    return { success: false, error: true };
  }
};

export const updateLesson = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = lessonSchema.parse(data);

    await prisma.lesson.update({
      where: {
        id: validatedData.id,
      },
      data: {
        name: validatedData.name,
        day: validatedData.day,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        subjectId: validatedData.subjectId,
        classId: validatedData.classId,
        teacherId: validatedData.teacherId,
      },
    });

    // revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating lesson:", err);
    return { success: false, error: true };
  }
};

export const deleteLesson = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.lesson.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// EVENT ACTIONS

export const createEvent = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = eventSchema.parse(data);

    await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        classId: validatedData.classId || null,
      },
    });

    // revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating event:", err);
    return { success: false, error: true };
  }
};

export const updateEvent = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = eventSchema.parse(data);

    await prisma.event.update({
      where: {
        id: validatedData.id,
      },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        classId: validatedData.classId || null,
      },
    });

    // revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating event:", err);
    return { success: false, error: true };
  }
};

export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.event.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// ANNOUNCEMENT ACTIONS

export const createAnnouncement = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = announcementSchema.parse(data);

    await prisma.announcement.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: validatedData.date,
        classId: validatedData.classId || null,
      },
    });

    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating announcement:", err);
    return { success: false, error: true };
  }
};

export const updateAnnouncement = async (
  currentState: CurrentState,
  formData: FormData
) => {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = announcementSchema.parse(data);

    await prisma.announcement.update({
      where: {
        id: validatedData.id,
      },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: validatedData.date,
        classId: validatedData.classId || null,
      },
    });

    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating announcement:", err);
    return { success: false, error: true };
  }
};

export const deleteAnnouncement = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.announcement.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
