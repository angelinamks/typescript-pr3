"use strict";
const professors = [];
const classrooms = [];
const courses = [];
let schedule = [];
function addProfessor(professor) {
    professors.push(professor);
}
function addLesson(lesson) {
    const conflict = validateLesson(lesson);
    if (conflict) {
        console.error(`Conflict detected: ${conflict.type}`);
        return false;
    }
    schedule.push(lesson);
    return true;
}
function validateLesson(lesson) {
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
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    return classrooms.filter(classroom => {
        return !schedule.some(lesson => lesson.classroomNumber === classroom.number && lesson.dayOfWeek === dayOfWeek && lesson.timeSlot === timeSlot);
    }).map(classroom => classroom.number);
}
function getProfessorSchedule(professorId) {
    return schedule.filter(lesson => lesson.professorId === professorId);
}
function getClassroomUtilization(classroomNumber) {
    const totalSlots = 5 * 5;
    const usedSlots = schedule.filter(lesson => lesson.classroomNumber === classroomNumber).length;
    return (usedSlots / totalSlots) * 100;
}
function getMostPopularCourseType() {
    const count = { Lecture: 0, Seminar: 0, Lab: 0, Practice: 0 };
    schedule.forEach(lesson => {
        const course = courses.find(c => c.id === lesson.courseId);
        if (course) {
            count[course.type]++;
        }
    });
    return Object.keys(count).reduce((a, b) => count[a] > count[b] ? a : b);
}
function reassignClassroom(lessonId, newClassroomNumber) {
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
function cancelLesson(lessonId) {
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
    const lesson1 = {
        courseId: 201,
        professorId: 1,
        classroomNumber: "202A",
        dayOfWeek: "Wednesday",
        timeSlot: "8:30-10:00"
    };
    const lesson2 = {
        courseId: 202,
        professorId: 2,
        classroomNumber: "203B",
        dayOfWeek: "Thursday",
        timeSlot: "10:15-11:45"
    };
    const lesson3 = {
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
    const conflictLesson = {
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
