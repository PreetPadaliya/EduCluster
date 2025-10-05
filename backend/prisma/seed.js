const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create default departments
  const departments = [
    {
      name: "Computer Science and Engineering",
      code: "CSE",
      description: "Department of Computer Science and Engineering",
    },
    {
      name: "Information Technology",
      code: "IT",
      description: "Department of Information Technology",
    },
    {
      name: "Electronics and Communication",
      code: "ECE",
      description: "Department of Electronics and Communication Engineering",
    },
    {
      name: "Mechanical Engineering",
      code: "ME",
      description: "Department of Mechanical Engineering",
    },
    {
      name: "Electrical Engineering",
      code: "EE",
      description: "Department of Electrical Engineering",
    },
  ];

  console.log("📚 Creating departments...");
  const createdDepartments = {};
  for (const dept of departments) {
    const department = await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept,
    });
    createdDepartments[dept.code] = department;
    console.log(`   ✅ Created department: ${department.name}`);
  }

  const cseDept = createdDepartments["CSE"];
  const itDept = createdDepartments["IT"];
  const eceDept = createdDepartments["ECE"];

  // Create Principal user
  console.log("👑 Creating Principal...");
  const principalPassword = await bcrypt.hash("principal123", 10);
  
  let principalUser = await prisma.user.findFirst({
    where: { email: "principal@university.edu" },
  });
  
  if (!principalUser) {
    principalUser = await prisma.user.create({
      data: {
        firstName: "Dr. Robert",
        lastName: "Wilson",
        email: "principal@university.edu",
        phone: "9876543210",
        employeeId: "PRIN001",
        password: principalPassword,
        role: "PRINCIPAL",
        status: "APPROVED",
        isActive: true,
      },
    });
  }

  let principalProfile = await prisma.principal.findFirst({
    where: { userId: principalUser.id },
  });
  
  if (!principalProfile) {
    principalProfile = await prisma.principal.create({
      data: {
        userId: principalUser.id,
        institution: "University College of Engineering",
      },
    });
  }
  console.log(`   ✅ Created principal: ${principalUser.firstName} ${principalUser.lastName}`);

  // Create HOD users
  console.log("🎓 Creating HODs...");
  const hodUsers = [
    {
      firstName: "Dr. James",
      lastName: "Anderson",
      email: "hod.cse@university.edu",
      phone: "9876543211",
      employeeId: "HOD001",
      departmentCode: "CSE",
    },
    {
      firstName: "Dr. Maria",
      lastName: "Garcia",
      email: "hod.it@university.edu",
      phone: "9876543212",
      employeeId: "HOD002",
      departmentCode: "IT",
    },
  ];

  for (const hodData of hodUsers) {
    const hashedPassword = await bcrypt.hash("hod123", 10);
    const { departmentCode, ...userData } = hodData;

    let user = await prisma.user.findFirst({
      where: { email: userData.email },
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          role: "HOD",
          status: "APPROVED",
          isActive: true,
        },
      });
    }

    let hodProfile = await prisma.hOD.findFirst({
      where: { userId: user.id },
    });
    
    if (!hodProfile) {
      hodProfile = await prisma.hOD.create({
        data: {
          userId: user.id,
          departmentId: createdDepartments[departmentCode].id,
        },
      });
    }

    console.log(`   ✅ Created HOD: ${user.firstName} ${user.lastName} for ${departmentCode}`);
  }

  // Create Faculty users
  console.log("👨‍🏫 Creating Faculty...");
  const facultyUsers = [
    {
      firstName: "Dr. John",
      lastName: "Smith",
      email: "john.smith@university.edu",
      phone: "9876543213",
      employeeId: "FAC001",
      departmentCode: "CSE",
      designation: "Professor",
      qualification: "Ph.D in Computer Science",
      experience: 15,
      specialization: "Machine Learning, Data Science",
    },
    {
      firstName: "Dr. Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@university.edu",
      phone: "9876543214",
      employeeId: "FAC002",
      departmentCode: "CSE",
      designation: "Associate Professor",
      qualification: "Ph.D in Software Engineering",
      experience: 10,
      specialization: "Web Development, Software Architecture",
    },
    {
      firstName: "Dr. Michael",
      lastName: "Brown",
      email: "michael.brown@university.edu",
      phone: "9876543215",
      employeeId: "FAC003",
      departmentCode: "IT",
      designation: "Assistant Professor",
      qualification: "M.Tech in Information Technology",
      experience: 8,
      specialization: "Database Systems, Cloud Computing",
    },
    {
      firstName: "Dr. Emily",
      lastName: "Davis",
      email: "emily.davis@university.edu",
      phone: "9876543216",
      employeeId: "FAC004",
      departmentCode: "ECE",
      designation: "Professor",
      qualification: "Ph.D in Electronics",
      experience: 12,
      specialization: "Digital Signal Processing, VLSI",
    },
  ];

  const createdFaculty = [];
  for (const facultyData of facultyUsers) {
    const hashedPassword = await bcrypt.hash("faculty123", 10);
    const { departmentCode, designation, qualification, experience, specialization, ...userData } = facultyData;

    let user = await prisma.user.findFirst({
      where: { email: userData.email },
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          role: "FACULTY",
          status: "APPROVED",
          isActive: true,
        },
      });
    }

    let facultyProfile = await prisma.faculty.findFirst({
      where: { userId: user.id },
    });
    
    if (!facultyProfile) {
      facultyProfile = await prisma.faculty.create({
        data: {
          userId: user.id,
          departmentId: createdDepartments[departmentCode].id,
          designation,
          qualification,
          experience,
          specialization,
          isActive: true,
        },
      });
    }

    createdFaculty.push({ user, faculty: facultyProfile });
    console.log(`   ✅ Created faculty: ${user.firstName} ${user.lastName} - ${designation}`);
  }

  // Create Student users
  console.log("👨‍🎓 Creating Students...");
  const studentUsers = [
    {
      firstName: "Alice",
      lastName: "Cooper",
      email: "alice.cooper@student.edu",
      phone: "9876543217",
      studentId: "STU2024001",
      departmentCode: "CSE",
      semester: 6,
      academicYear: "2024-25",
      rollNumber: "CSE21001",
    },
    {
      firstName: "Bob",
      lastName: "Miller",
      email: "bob.miller@student.edu",
      phone: "9876543218",
      studentId: "STU2024002",
      departmentCode: "CSE",
      semester: 4,
      academicYear: "2024-25",
      rollNumber: "CSE22001",
    },
    {
      firstName: "Carol",
      lastName: "Wilson",
      email: "carol.wilson@student.edu",
      phone: "9876543219",
      studentId: "STU2024003",
      departmentCode: "IT",
      semester: 2,
      academicYear: "2024-25",
      rollNumber: "IT23001",
    },
    {
      firstName: "David",
      lastName: "Taylor",
      email: "david.taylor@student.edu",
      phone: "9876543220",
      studentId: "STU2024004",
      departmentCode: "ECE",
      semester: 8,
      academicYear: "2024-25",
      rollNumber: "ECE20001",
    },
  ];

  const createdStudents = [];
  for (const studentData of studentUsers) {
    const hashedPassword = await bcrypt.hash("student123", 10);
    const { departmentCode, semester, academicYear, rollNumber, ...userData } = studentData;

    let user = await prisma.user.findFirst({
      where: { email: userData.email },
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          role: "STUDENT",
          status: "APPROVED",
          isActive: true,
        },
      });
    }

    let studentProfile = await prisma.student.findFirst({
      where: { userId: user.id },
    });
    
    if (!studentProfile) {
      studentProfile = await prisma.student.create({
        data: {
          userId: user.id,
          departmentId: createdDepartments[departmentCode].id,
          semester,
          academicYear,
          rollNumber,
          admissionDate: new Date("2020-07-15"),
          isActive: true,
        },
      });
    }

    createdStudents.push({ user, student: studentProfile });
    console.log(`   ✅ Created student: ${user.firstName} ${user.lastName} - ${rollNumber}`);
  }

  // Create Courses
  console.log("📖 Creating courses...");
  const courses = [
    {
      name: "Introduction to Programming",
      code: "CS101",
      description: "Learn the fundamentals of programming using modern languages",
      credits: 4,
      semester: 1,
      departmentCode: "CSE",
      facultyIndex: 0,
    },
    {
      name: "Database Systems",
      code: "CS201",
      description: "Database design, implementation, and management",
      credits: 3,
      semester: 4,
      departmentCode: "CSE",
      facultyIndex: 1,
    },
    {
      name: "Web Development",
      code: "CS301",
      description: "Full-stack web development with modern frameworks",
      credits: 4,
      semester: 6,
      departmentCode: "CSE",
      facultyIndex: 1,
    },
    {
      name: "Data Structures and Algorithms",
      code: "CS102",
      description: "Core data structures and algorithmic problem solving",
      credits: 4,
      semester: 2,
      departmentCode: "CSE",
      facultyIndex: 0,
    },
    {
      name: "Network Security",
      code: "IT201",
      description: "Principles of network security and cryptography",
      credits: 3,
      semester: 4,
      departmentCode: "IT",
      facultyIndex: 2,
    },
  ];

  const createdCourses = [];
  for (const courseData of courses) {
    const { departmentCode, facultyIndex, ...course } = courseData;
    
    let courseRecord = await prisma.course.findFirst({
      where: { code: course.code },
    });
    
    if (!courseRecord) {
      courseRecord = await prisma.course.create({
        data: {
          ...course,
          departmentId: createdDepartments[departmentCode].id,
          facultyId: createdFaculty[facultyIndex]?.faculty.id,
          isActive: true,
        },
      });
    }
    
    createdCourses.push(courseRecord);
    console.log(`   ✅ Created course: ${courseRecord.name} (${courseRecord.code})`);
  }

  // Create Enrollments
  console.log("📝 Creating enrollments...");
  const enrollments = [
    { studentIndex: 0, courseIndex: 2 }, // Alice in Web Development
    { studentIndex: 1, courseIndex: 1 }, // Bob in Database Systems
    { studentIndex: 1, courseIndex: 3 }, // Bob in Data Structures
    { studentIndex: 2, courseIndex: 4 }, // Carol in Network Security
  ];

  for (const enrollment of enrollments) {
    const studentId = createdStudents[enrollment.studentIndex].student.id;
    const courseId = createdCourses[enrollment.courseIndex].id;
    
    let enrollmentRecord = await prisma.enrollment.findFirst({
      where: {
        studentId: studentId,
        courseId: courseId,
      },
    });
    
    if (!enrollmentRecord) {
      enrollmentRecord = await prisma.enrollment.create({
        data: {
          studentId: studentId,
          courseId: courseId,
          status: "ACTIVE",
        },
      });
    }
    console.log(`   ✅ Enrolled student in course`);
  }

  // Create Assignments
  console.log("📋 Creating assignments...");
  const assignments = [
    {
      title: "Programming Basics Assignment",
      description: "Create a simple calculator application",
      courseIndex: 0,
      facultyIndex: 0,
      dueDate: new Date("2024-11-15"),
      maxMarks: 100,
    },
    {
      title: "Database Design Project",
      description: "Design and implement a library management system database",
      courseIndex: 1,
      facultyIndex: 1,
      dueDate: new Date("2024-11-20"),
      maxMarks: 150,
    },
  ];

  const createdAssignments = [];
  for (const assignmentData of assignments) {
    const { courseIndex, facultyIndex, ...assignment } = assignmentData;
    
    const assignmentRecord = await prisma.assignment.create({
      data: {
        ...assignment,
        courseId: createdCourses[courseIndex].id,
        facultyId: createdFaculty[facultyIndex].faculty.id,
        isActive: true,
      },
    });
    
    createdAssignments.push(assignmentRecord);
    console.log(`   ✅ Created assignment: ${assignmentRecord.title}`);
  }

  // Create Schedules
  console.log("📅 Creating schedules...");
  const schedules = [
    {
      title: "CS101 Lecture",
      description: "Introduction to Programming - Theory Class",
      startTime: new Date("2024-10-07T09:00:00Z"),
      endTime: new Date("2024-10-07T10:30:00Z"),
      dayOfWeek: "MONDAY",
      type: "REGULAR_CLASS",
      courseIndex: 0,
      facultyIndex: 0,
      createdByUserId: principalUser.id,
    },
    {
      title: "CS201 Lab Session",
      description: "Database Systems - Practical Lab",
      startTime: new Date("2024-10-08T14:00:00Z"),
      endTime: new Date("2024-10-08T17:00:00Z"),
      dayOfWeek: "TUESDAY",
      type: "LAB",
      courseIndex: 1,
      facultyIndex: 1,
      createdByUserId: principalUser.id,
    },
  ];

  for (const scheduleData of schedules) {
    const { courseIndex, facultyIndex, createdByUserId, ...schedule } = scheduleData;
    
    const scheduleRecord = await prisma.schedule.create({
      data: {
        ...schedule,
        courseId: createdCourses[courseIndex].id,
        facultyId: createdFaculty[facultyIndex].user.id,
        createdById: createdByUserId,
      },
    });
    console.log(`   ✅ Created schedule: ${scheduleRecord.title}`);
  }

  // Create Announcements
  console.log("📢 Creating announcements...");
  const announcements = [
    {
      title: "Welcome to New Academic Year",
      content: "Welcome all students to the new academic year 2024-25. Classes will begin from October 7th, 2024.",
      isGlobal: true,
      facultyIndex: 0,
    },
    {
      title: "Assignment Submission Guidelines",
      content: "Please ensure all assignments are submitted before the due date. Late submissions will incur penalties.",
      courseIndex: 0,
      facultyIndex: 0,
      isGlobal: false,
    },
  ];

  for (const announcementData of announcements) {
    const { courseIndex, facultyIndex, ...announcement } = announcementData;
    
    const announcementRecord = await prisma.announcement.create({
      data: {
        ...announcement,
        courseId: courseIndex !== undefined ? createdCourses[courseIndex].id : null,
        facultyId: createdFaculty[facultyIndex].faculty.id,
        isActive: true,
      },
    });
    console.log(`   ✅ Created announcement: ${announcementRecord.title}`);
  }

  // Create Sample Notifications
  console.log("🔔 Creating notifications...");
  const notifications = [
    {
      userId: createdStudents[0].user.id,
      title: "New Assignment Posted",
      message: "A new assignment has been posted for CS101",
      type: "ASSIGNMENT",
    },
    {
      userId: createdStudents[1].user.id,
      title: "Grade Published",
      message: "Your grade for Database Systems project has been published",
      type: "GRADE",
    },
  ];

  for (const notification of notifications) {
    const notificationRecord = await prisma.notification.create({
      data: notification,
    });
    console.log(`   ✅ Created notification: ${notificationRecord.title}`);
  }

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - ${departments.length} Departments created`);
  console.log(`   - 1 Principal created`);
  console.log(`   - ${hodUsers.length} HODs created`);
  console.log(`   - ${facultyUsers.length} Faculty members created`);
  console.log(`   - ${studentUsers.length} Students created`);
  console.log(`   - ${courses.length} Courses created`);
  console.log(`   - ${enrollments.length} Enrollments created`);
  console.log(`   - ${assignments.length} Assignments created`);
  console.log(`   - ${schedules.length} Schedules created`);
  console.log(`   - ${announcements.length} Announcements created`);
  console.log(`   - ${notifications.length} Notifications created`);
  
  console.log("\n🔑 Default Login Credentials:");
  console.log("   Principal: principal@university.edu / Principal@123");
  console.log("   HOD (CSE): hod.cse@university.edu / Hod@123");
  console.log("   Faculty: john.smith@university.edu / Faculty@123");
  console.log("   Student: alice.cooper@student.edu / Student@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
