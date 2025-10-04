const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
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

  console.log("Creating departments...");
  for (const dept of departments) {
    const department = await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept,
    });
    console.log(`Created department: ${department.name}`);
  }

  // Create sample courses
  const cseDept = await prisma.department.findFirst({
    where: { code: "CSE" },
  });

  const itDept = await prisma.department.findFirst({
    where: { code: "IT" },
  });

  if (cseDept) {
    const courses = [
      {
        name: "Introduction to Programming",
        code: "CS101",
        description:
          "Learn the fundamentals of programming using modern languages",
        credits: 4,
        departmentId: cseDept.id,
        isActive: true,
      },
      {
        name: "Database Systems",
        code: "CS201",
        description: "Database design, implementation, and management",
        credits: 3,
        departmentId: cseDept.id,
        isActive: true,
      },
      {
        name: "Web Development",
        code: "CS301",
        description: "Full-stack web development with modern frameworks",
        credits: 4,
        departmentId: cseDept.id,
        isActive: true,
      },
      {
        name: "Software Engineering",
        code: "CS401",
        description: "Software development lifecycle and project management",
        credits: 3,
        departmentId: cseDept.id,
        isActive: true,
      },
    ];

    console.log("Creating courses...");
    for (const courseData of courses) {
      const course = await prisma.course.upsert({
        where: { code: courseData.code },
        update: {},
        create: courseData,
      });
      console.log(`Created course: ${course.name}`);
    }
  }

  // Create sample users and faculty if they don't exist
  console.log("Creating sample faculty users...");

  // Create faculty users
  const facultyUsers = [
    {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@university.edu",
      phone: "1234567890",
      employeeId: "FAC001",
      role: "FACULTY",
      isActive: true,
    },
    {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@university.edu",
      phone: "1234567891",
      employeeId: "FAC002",
      role: "FACULTY",
      isActive: true,
    },
    {
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@university.edu",
      phone: "1234567892",
      employeeId: "FAC003",
      role: "FACULTY",
      isActive: true,
    },
  ];

  for (const userData of facultyUsers) {
    // Hash the default password
    const hashedPassword = await bcrypt.hash("password123", 10);

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: hashedPassword,
      },
    });

    // Create corresponding faculty record
    const facultyRecord = await prisma.faculty.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        departmentId: cseDept?.id,
        designation: "Assistant Professor",
        isActive: true,
      },
    });

    console.log(`Created faculty: ${user.firstName} ${user.lastName}`);
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
