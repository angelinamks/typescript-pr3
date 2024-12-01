type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

type Professor = {
    id: number;
    name: string;
    department: string;
};

type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

type Course = {
    id: number;
    name: string;
    type: CourseType;
};

type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

const professors: Professor[] = [];
const classrooms: Classroom[] = [];
const courses: Course[] = [];
let schedule: Lesson[] = [];

function addProfessor(professor: Professor): void {
  professors.push(professor);
}

function addLesson(lesson: Lesson): boolean {
  const conflict = validateLesson(lesson);
  if (conflict) {
      console.error(`Conflict detected: ${conflict.type}`);
      return false;
  }
  schedule.push(lesson);
  return true;
}

function validateLesson(lesson: Lesson): ScheduleConflict | null {
  for (const existingLesson of schedule) {
      if (existingLesson.professorId === lesson.professorId && existingLesson.dayOfWeek === lesson.dayOfWeek && existingLesson.timeSlot === lesson.timeSlot) {
          return { type: "ProfessorConflict", lessonDetails: existingLesson };
      }
      if (existingLesson.classroomNumber === lesson.classroomNumber && existingLesson.dayOfWeek === lesson.dayOfWeek && existingLesson.timeSlot === lesson.timeSlot) {
          return { type: "ClassroomConflict", lessonDetails: existingLesson };
      }
  }
  return null;
}


function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
  return classrooms.filter(classroom => {
      return !schedule.some(lesson => lesson.classroomNumber === classroom.number && lesson.dayOfWeek === dayOfWeek && lesson.timeSlot === timeSlot);
  }).map(classroom => classroom.number);
}

function getProfessorSchedule(professorId: number): Lesson[] {
  return schedule.filter(lesson => lesson.professorId === professorId);
}


function getClassroomUtilization(classroomNumber: string): number {
  const totalSlots = 5 * 5;
  const usedSlots = schedule.filter(lesson => lesson.classroomNumber === classroomNumber).length;
  return (usedSlots / totalSlots) * 100;
}

function getMostPopularCourseType(): CourseType {
  const count: Record<CourseType, number> = { Lecture: 0, Seminar: 0, Lab: 0, Practice: 0 };
  schedule.forEach(lesson => {
      const course = courses.find(c => c.id === lesson.courseId);
      if (course) {
          count[course.type]++;
      }
  });
  return (Object.keys(count) as CourseType[]).reduce((a, b) => count[a] > count[b] ? a : b) as CourseType;
}

function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
  const lesson = schedule.find(l => l.courseId === lessonId);
  if (!lesson) {
      return false;
  }
  if (classrooms.some(c => c.number === newClassroomNumber)) {
      lesson.classroomNumber = newClassroomNumber;
      return true;
  }
  return false;
}

function cancelLesson(lessonId: number): void {
  schedule = schedule.filter(lesson => lesson.courseId !== lessonId);
}


function main() {
  // Ініціалізація деяких професорів
  addProfessor({ id: 1, name: "Dr. Brown", department: "Computer Science" });
  addProfessor({ id: 2, name: "Dr. White", department: "Chemistry" });

  // Ініціалізація класних кімнат
  classrooms.push({ number: "202A", capacity: 50, hasProjector: true });
  classrooms.push({ number: "203B", capacity: 35, hasProjector: true });
  classrooms.push({ number: "204C", capacity: 20, hasProjector: false });

  // Ініціалізація курсів
  courses.push({ id: 201, name: "Data Structures", type: "Lecture" });
  courses.push({ id: 202, name: "Organic Chemistry", type: "Lab" });
  courses.push({ id: 203, name: "Algorithms", type: "Practice" });

  // Спроба додати заняття
  const lesson1: Lesson = {
      courseId: 201,
      professorId: 1,
      classroomNumber: "202A",
      dayOfWeek: "Wednesday",
      timeSlot: "8:30-10:00"
  };

  const lesson2: Lesson = {
      courseId: 202,
      professorId: 2,
      classroomNumber: "203B",
      dayOfWeek: "Thursday",
      timeSlot: "10:15-11:45"
  };

  const lesson3: Lesson = {
      courseId: 203,
      professorId: 1,
      classroomNumber: "204C",
      dayOfWeek: "Friday",
      timeSlot: "12:15-13:45"
  };

  console.log("Adding lesson 1:", addLesson(lesson1) ? "Success" : "Failed");
  console.log("Adding lesson 2:", addLesson(lesson2) ? "Success" : "Failed");
  console.log("Adding lesson 3:", addLesson(lesson3) ? "Success" : "Failed");

  // Додавання конфліктного заняття
  const conflictLesson: Lesson = {
      courseId: 201,
      professorId: 1,
      classroomNumber: "202A",
      dayOfWeek: "Wednesday",
      timeSlot: "8:30-10:00"
  };
  console.log("Adding conflicting lesson:", addLesson(conflictLesson) ? "Success" : "Failed");

  // Відображення розкладу професора
  console.log("Schedule for Professor 1:", getProfessorSchedule(1));

  // Пошук доступних аудиторій
  console.log("Available classrooms for Thursday, 10:15-11:45:", findAvailableClassrooms("10:15-11:45", "Thursday"));

  // Використання аудиторії
  console.log("Classroom 202A utilization:", getClassroomUtilization("202A"), "%");

  // Найпопулярніший тип курсу
  console.log("Most popular course type:", getMostPopularCourseType());
}

main();
