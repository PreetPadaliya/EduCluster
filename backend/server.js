const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Admin credentials (hardcoded as requested)
const ADMIN_CREDENTIALS = {
  id: "admin123",
  password: "admin@123",
};

// Routes

// Student direct registration (no approval needed)
app.post("/api/signup/student", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, id, password, role } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [{ status: "APPROVED" }, { OR: [{ email: email }, { studentId: id }] }],
      },
    });``

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or ID already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with student profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          studentId: id,
          password: hashedPassword,
          role: "STUDENT",
          status: "APPROVED", // Students are approved immediately
        },
      });

      // Create student profile
      const studentProfile = await tx.student.create({
        data: {
          userId: newUser.id,
          rollNumber: id,
          semester: 1,
          academicYear: new Date().getFullYear().toString(),
          admissionDate: new Date(),
        },
      });

      return { user: newUser, profile: studentProfile };
    });

    res.status(201).json({
      success: true,
      message: "Student account created successfully",
      user: {
        id: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error) {
    console.error("Student registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
});

// Non-student registration (requires approval)
app.post("/api/signup/request", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, id, password, role } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        AND:[{OR: [
          { email: email },
          { employeeId: id },
          { studentId: id },
          { phone: phone },
        ]},{status:"APPROVED"}]
      },
    });

    if (existingUser) {
      let message = "User already exists or has a pending request";
      if (existingUser.email === email) {
        message = "Email address is already registered";
      } else if (existingUser.phone === phone) {
        message = "Phone number is already registered";
      } else if (
        existingUser.employeeId === id ||
        existingUser.studentId === id
      ) {
        message = "ID is already registered";
      }

      return res.status(400).json({
        success: false,
        message,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with PENDING status
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        employeeId: id,
        password: hashedPassword,
        role: role.toUpperCase(),
        status: "PENDING",
      },
    });

    res.status(201).json({
      success: true,
      message: `Your ${role} account request has been submitted. Please wait for admin approval.`,
      requestId: newUser.id,
    });
  } catch (error) {
    console.error("Registration request error:", error);
    res.status(500).json({
      success: false,
      message: "Request submission failed. Please try again.",
    });
  }
});

// Admin login
app.post("/api/admin/login", (req, res) => {
  try {
    const { id, password } = req.body;

    if (
      id === ADMIN_CREDENTIALS.id &&
      password === ADMIN_CREDENTIALS.password
    ) {
      res.json({
        success: true,
        message: "Admin login successful",
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

// Get pending requests (admin only)
app.get("/api/admin/pending-requests", async (req, res) => {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: {
        status: "PENDING",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        employeeId: true,
        role: true,
        createdAt: true,
      },
    });

    const requests = pendingUsers.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      userId: user.employeeId,
      role: user.role.toLowerCase(),
      createdAt: user.createdAt,
    }));

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
    });
  }
});

// Approve user request (admin only)
app.post("/api/admin/approve/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: requestId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (user.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    // Update user status and create appropriate profile
    const result = await prisma.$transaction(async (tx) => {
      // Update user status
      const updatedUser = await tx.user.update({
        where: { id: requestId },
        data: {
          status: "APPROVED",
          lastLogin: new Date(),
        },
      });

      // Create role-specific profile
      let profile = null;
      switch (user.role) {
        case "FACULTY":
          profile = await tx.faculty.create({
            data: {
              userId: user.id,
              designation: "Assistant Professor",
            },
          });
          break;
        case "HOD":
          // Find a department that doesn't already have an HOD
          const availableDepartment = await tx.department.findFirst({
            where: {
              isActive: true,
              hod: {
                is: null, // Department with no existing HOD
              },
            },
            select: {
              id: true,
              name: true,
              hod: true,
            },
          });

          if (!availableDepartment) {
            throw new Error(
              "No available departments for HOD assignment. All departments already have HODs."
            );
          }

          console.log(
            `Assigning HOD to department: ${availableDepartment.name} (${availableDepartment.id})`
          );

          profile = await tx.hOD.create({
            data: {
              userId: user.id,
              departmentId: availableDepartment.id,
            },
          });
          break;
        case "PRINCIPAL":
          profile = await tx.principal.create({
            data: {
              userId: user.id,
              institution: "Educational Institution",
            },
          });
          break;
      }

      return { user: updatedUser, profile };
    });

    res.json({
      success: true,
      message: `${user.role.toLowerCase()} account approved successfully`,
    });
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
});

// Reject user request (admin only)
app.post("/api/admin/reject/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    const { reason } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: requestId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (user.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    // Update user status to rejected
    await prisma.user.update({
      where: { id: requestId },
      data: {
        status: "REJECTED",
        rejectionReason: reason || "No reason provided",
      },
    });

    res.json({
      success: true,
      message: `${user.role.toLowerCase()} account request rejected`,
    });
  } catch (error) {
    console.error("Rejection error:", error);
    res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
});

// Regular user login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { studentId: email }, { employeeId: email }],
        status: "APPROVED",
      },
      include: {
        studentProfile: true,
        facultyProfile: true,
        hodProfile: true,
        principalProfile: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or account not approved",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profile:
          user.studentProfile ||
          user.facultyProfile ||
          user.hodProfile ||
          user.principalProfile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

// Get all approved users (admin only)
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        status: "APPROVED",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        studentId: true,
        employeeId: true,
        role: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      userId: user.studentId || user.employeeId,
      role: user.role.toLowerCase(),
      createdAt: user.createdAt,
      approvedAt: user.lastLogin,
    }));

    res.json({
      success: true,
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

// Check request status
app.get("/api/request-status/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { studentId: email }, { employeeId: email }],
      },
      select: {
        status: true,
        rejectionReason: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No request found for this email",
      });
    }

    let message;
    switch (user.status) {
      case "PENDING":
        message = "Your request is still pending approval";
        break;
      case "APPROVED":
        message = "Your account has been approved";
        break;
      case "REJECTED":
        message = user.rejectionReason || "Your request was rejected";
        break;
      default:
        message = "Unknown status";
    }

    res.json({
      success: true,
      status: user.status.toLowerCase(),
      message,
    });
  } catch (error) {
    console.error("Error checking status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check status",
    });
  }
});

// Additional APIs for the educational system

// Get all departments
app.get("/api/departments", async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
      },
    });

    res.json({
      success: true,
      departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
    });
  }
});

// Get courses (role-based)
app.get("/api/courses", async (req, res) => {
  try {
    const { userId, role } = req.query;

    let courses;

    if (role === "STUDENT") {
      // Get enrolled courses for student
      const student = await prisma.student.findFirst({
        where: { userId },
        include: {
          enrollments: {
            include: {
              course: {
                include: {
                  faculty: {
                    include: { user: true },
                  },
                  department: true,
                },
              },
            },
          },
        },
      });

      courses =
        student?.enrollments.map((enrollment) => enrollment.course) || [];
    } else if (role === "FACULTY") {
      // Get courses taught by faculty
      const faculty = await prisma.faculty.findFirst({
        where: { userId },
        include: {
          courses: {
            include: {
              department: true,
              enrollments: {
                include: {
                  student: {
                    include: { user: true },
                  },
                },
              },
            },
          },
        },
      });

      courses = faculty?.courses || [];
    } else {
      // HOD/Principal can see all courses
      courses = await prisma.course.findMany({
        include: {
          faculty: {
            include: { user: true },
          },
          department: true,
          enrollments: {
            include: {
              student: {
                include: { user: true },
              },
            },
          },
        },
      });
    }

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
});

// Create course (HOD/Principal only)
app.post("/api/courses", async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      credits,
      semester,
      departmentId,
      facultyId,
      createdBy,
    } = req.body;

    // Verify user has permission to create courses
    const user = await prisma.user.findUnique({
      where: { id: createdBy },
      select: { role: true },
    });

    if (!user || !["HOD", "PRINCIPAL"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions to create courses",
      });
    }

    // Validate that the faculty exists
    let faculty = await prisma.faculty.findUnique({
      where: { id: facultyId },
      include: { user: true },
    });

    // If not found by faculty ID, try to find by user ID (backward compatibility)
    if (!faculty) {
      faculty = await prisma.faculty.findUnique({
        where: { userId: facultyId },
        include: { user: true },
      });
    }

    if (!faculty) {
      return res.status(400).json({
        success: false,
        message: `Invalid faculty ID: ${facultyId}. Faculty not found.`,
      });
    }

    // Validate that the department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID. Department not found.",
      });
    }

    console.log(`Creating course: ${name} (${code})`);
    console.log(`Faculty: ${faculty.user.firstName} ${faculty.user.lastName}`);
    console.log(`Department: ${department.name}`);

    const course = await prisma.course.create({
      data: {
        name,
        code,
        description,
        credits,
        semester,
        departmentId,
        facultyId: faculty.id, // Use the actual faculty ID
      },
      include: {
        faculty: {
          include: { user: true },
        },
        department: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
});

// Get assignments
app.get("/api/assignments", async (req, res) => {
  try {
    const { userId, role } = req.query;

    let assignments;

    if (role === "STUDENT") {
      // Get assignments for enrolled courses
      const student = await prisma.student.findFirst({
        where: { userId },
        include: {
          enrollments: {
            include: {
              course: {
                include: {
                  assignments: {
                    include: {
                      course: true,
                      faculty: {
                        include: { user: true },
                      },
                      submissions: {
                        where: { studentId: { not: undefined } },
                        include: {
                          student: {
                            where: { userId },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      assignments =
        student?.enrollments.flatMap(
          (enrollment) => enrollment.course.assignments
        ) || [];
    } else if (role === "FACULTY") {
      // Get assignments created by faculty
      const faculty = await prisma.faculty.findFirst({
        where: { userId },
        include: {
          assignments: {
            include: {
              course: true,
              submissions: {
                include: {
                  student: {
                    include: { user: true },
                  },
                },
              },
            },
          },
        },
      });

      assignments = faculty?.assignments || [];
    }

    res.json({
      success: true,
      assignments,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch assignments",
    });
  }
});

// Create assignment (Faculty only)
app.post("/api/assignments", async (req, res) => {
  try {
    const {
      title,
      description,
      courseId,
      dueDate,
      maxMarks,
      createdBy,
      createSchedule = false, // Optional: create schedule entry
      scheduleDescription,
    } = req.body;

    // Verify faculty exists
    const faculty = await prisma.faculty.findFirst({
      where: { userId: createdBy },
    });

    if (!faculty) {
      return res.status(403).json({
        success: false,
        message: "Only faculty can create assignments",
      });
    }

    // Create assignment
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        courseId,
        facultyId: faculty.id,
        dueDate: new Date(dueDate),
        maxMarks,
      },
      include: {
        course: true,
        faculty: {
          include: { user: true },
        },
      },
    });

    // Optionally create a schedule entry for the assignment due date
    let scheduleEntry = null;
    if (createSchedule) {
      const dueDateObj = new Date(dueDate);
      const dayOfWeek = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ][dueDateObj.getDay()];

      scheduleEntry = await prisma.schedule.create({
        data: {
          title: `Assignment Due: ${title}`,
          description:
            scheduleDescription ||
            `Assignment "${title}" is due for ${assignment.course.name}`,
          startTime: dueDateObj,
          endTime: new Date(dueDateObj.getTime() + 60 * 60 * 1000), // 1 hour duration
          dayOfWeek: dayOfWeek,
          type: "ASSIGNMENT_DUE",
          courseId: courseId,
          facultyId: createdBy,
          createdById: createdBy,
        },
        include: {
          course: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment,
      schedule: scheduleEntry
        ? {
            id: scheduleEntry.id,
            title: scheduleEntry.title,
            description: scheduleEntry.description,
            startTime: scheduleEntry.startTime,
            endTime: scheduleEntry.endTime,
            dayOfWeek: scheduleEntry.dayOfWeek,
            type: scheduleEntry.type,
            course: scheduleEntry.course,
          }
        : null,
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create assignment",
    });
  }
});

// Submit assignment (Student only)
app.post("/api/assignments/:assignmentId/submit", async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { userId, submissionText, submissionFiles } = req.body;

    // Verify student exists
    const student = await prisma.student.findFirst({
      where: { userId },
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Only students can submit assignments",
      });
    }

    // Check if assignment exists
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Check for existing submission
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        assignmentId,
        studentId: student.id,
      },
    });

    let submission;
    if (existingSubmission) {
      // Update existing submission
      submission = await prisma.submission.update({
        where: { id: existingSubmission.id },
        data: {
          submissionText,
          submissionFiles,
          submittedAt: new Date(),
          status: "SUBMITTED",
        },
        include: {
          student: {
            include: { user: true },
          },
          assignment: true,
        },
      });
    } else {
      // Create new submission
      submission = await prisma.submission.create({
        data: {
          assignmentId,
          studentId: student.id,
          submissionText,
          submissionFiles,
          submittedAt: new Date(),
          status: "SUBMITTED",
        },
        include: {
          student: {
            include: { user: true },
          },
          assignment: true,
        },
      });
    }

    res.json({
      success: true,
      message: "Assignment submitted successfully",
      submission,
    });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit assignment",
    });
  }
});

// Grade assignment submission (Faculty only)
app.post("/api/submissions/:submissionId/grade", async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { userId, marks, feedback } = req.body;

    // Verify faculty exists
    const faculty = await prisma.faculty.findFirst({
      where: { userId },
    });

    if (!faculty) {
      return res.status(403).json({
        success: false,
        message: "Only faculty can grade submissions",
      });
    }

    // Update submission with grade
    const submission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        marks,
        feedback,
        gradedAt: new Date(),
        status: "GRADED",
      },
      include: {
        student: {
          include: { user: true },
        },
        assignment: {
          include: {
            course: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Assignment graded successfully",
      submission,
    });
  } catch (error) {
    console.error("Error grading submission:", error);
    res.status(500).json({
      success: false,
      message: "Failed to grade submission",
    });
  }
});

// Get submissions for an assignment (Faculty only)
app.get("/api/assignments/:assignmentId/submissions", async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { userId } = req.query;

    // Verify faculty exists
    const faculty = await prisma.faculty.findFirst({
      where: { userId },
    });

    if (!faculty) {
      return res.status(403).json({
        success: false,
        message: "Only faculty can view submissions",
      });
    }

    const submissions = await prisma.submission.findMany({
      where: { assignmentId },
      include: {
        student: {
          include: { user: true },
        },
        assignment: {
          include: {
            course: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    res.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch submissions",
    });
  }
});

// Get student's grades
app.get("/api/grades", async (req, res) => {
  try {
    const { userId, courseId } = req.query;

    // Verify student exists
    const student = await prisma.student.findFirst({
      where: { userId },
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Only students can view grades",
      });
    }

    const whereClause = {
      studentId: student.id,
      status: "GRADED",
    };

    if (courseId) {
      whereClause.assignment = {
        courseId: courseId,
      };
    }

    const submissions = await prisma.submission.findMany({
      where: whereClause,
      include: {
        assignment: {
          include: {
            course: true,
            faculty: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { gradedAt: "desc" },
    });

    res.json({
      success: true,
      grades: submissions,
    });
  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch grades",
    });
  }
});

// Get faculty members
app.get("/api/faculty", async (req, res) => {
  try {
    const { departmentId } = req.query;

    const whereClause = {};
    if (departmentId) {
      whereClause.departmentId = departmentId;
    }

    const faculty = await prisma.faculty.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            employeeId: true,
          },
        },
        department: true,
        courses: {
          include: {
            department: true,
          },
        },
      },
    });

    res.json({
      success: true,
      faculty,
    });
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch faculty",
    });
  }
});

// Get classmates (students in same courses)
app.get("/api/classmates", async (req, res) => {
  try {
    const { userId } = req.query;

    // Get current student
    const student = await prisma.student.findFirst({
      where: { userId },
      include: {
        enrollments: {
          select: { courseId: true },
        },
      },
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Only students can view classmates",
      });
    }

    const courseIds = student.enrollments.map((e) => e.courseId);

    // Get classmates from same courses
    const classmates = await prisma.student.findMany({
      where: {
        id: { not: student.id },
        enrollments: {
          some: {
            courseId: { in: courseIds },
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            studentId: true,
          },
        },
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      classmates,
    });
  } catch (error) {
    console.error("Error fetching classmates:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch classmates",
    });
  }
});

// Get class schedule
app.get("/api/schedule", async (req, res) => {
  try {
    const { userId, role } = req.query;

    let schedule = [];

    if (role === "STUDENT") {
      // Get student's enrolled courses
      const student = await prisma.student.findFirst({
        where: { userId },
        include: {
          enrollments: {
            include: {
              course: {
                include: {
                  faculty: {
                    include: { user: true },
                  },
                  department: true,
                },
              },
            },
          },
        },
      });

      if (student) {
        schedule = student.enrollments.map((enrollment) => ({
          id: enrollment.course.id,
          title: enrollment.course.name,
          subject: enrollment.course.code,
          instructor: `${enrollment.course.faculty.user.firstName} ${enrollment.course.faculty.user.lastName}`,
          department: enrollment.course.department.name,
          credits: enrollment.course.credits,
          semester: enrollment.course.semester,
          // Mock schedule data - you can enhance this with actual schedule table
          time: "10:00 AM - 11:30 AM",
          days: ["Mon", "Wed", "Fri"],
          room: `Room ${Math.floor(Math.random() * 100) + 100}`,
        }));
      }
    } else if (role === "FACULTY") {
      // Get faculty's assigned courses
      const faculty = await prisma.faculty.findFirst({
        where: { userId },
        include: {
          courses: {
            include: {
              department: true,
              enrollments: {
                include: {
                  student: {
                    include: { user: true },
                  },
                },
              },
            },
          },
        },
      });

      if (faculty) {
        schedule = faculty.courses.map((course) => ({
          id: course.id,
          title: course.name,
          subject: course.code,
          department: course.department.name,
          credits: course.credits,
          semester: course.semester,
          enrolledStudents: course.enrollments.length,
          // Mock schedule data
          time: "10:00 AM - 11:30 AM",
          days: ["Mon", "Wed", "Fri"],
          room: `Room ${Math.floor(Math.random() * 100) + 100}`,
        }));
      }
    }

    res.json({
      success: true,
      schedule,
    });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch schedule",
    });
  }
});

// Get announcements
app.get("/api/announcements", async (req, res) => {
  try {
    const { userId, role } = req.query;

    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        OR: [{ targetRole: role }, { targetRole: "ALL" }],
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    res.json({
      success: true,
      announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
    });
  }
});

// Create announcement (Faculty/HOD/Principal only)
app.post("/api/announcements", async (req, res) => {
  try {
    const { title, content, targetRole, priority, createdBy } = req.body;

    // Verify user has permission to create announcements
    const user = await prisma.user.findUnique({
      where: { id: createdBy },
      select: { role: true },
    });

    if (!user || !["FACULTY", "HOD", "PRINCIPAL"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions to create announcements",
      });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        targetRole: targetRole || "ALL",
        priority: priority || "MEDIUM",
        createdById: createdBy,
        isActive: true,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create announcement",
    });
  }
});

// Get analytics/reports
app.get("/api/reports", async (req, res) => {
  try {
    const { userId, role, type } = req.query;

    let reports = {};

    if (role === "STUDENT") {
      const student = await prisma.student.findFirst({
        where: { userId },
        include: {
          enrollments: true,
          submissions: {
            where: { status: "GRADED" },
            include: { assignment: true },
          },
        },
      });

      if (student) {
        const totalMarks = student.submissions.reduce(
          (sum, sub) => sum + (sub.marks || 0),
          0
        );
        const totalMaxMarks = student.submissions.reduce(
          (sum, sub) => sum + sub.assignment.maxMarks,
          0
        );
        const averageGrade =
          totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;

        reports = {
          enrolledCourses: student.enrollments.length,
          submittedAssignments: student.submissions.length,
          averageGrade: Math.round(averageGrade * 100) / 100,
          gradeDistribution: {
            A: student.submissions.filter(
              (s) => s.marks / s.assignment.maxMarks >= 0.9
            ).length,
            B: student.submissions.filter(
              (s) =>
                s.marks / s.assignment.maxMarks >= 0.8 &&
                s.marks / s.assignment.maxMarks < 0.9
            ).length,
            C: student.submissions.filter(
              (s) =>
                s.marks / s.assignment.maxMarks >= 0.7 &&
                s.marks / s.assignment.maxMarks < 0.8
            ).length,
            D: student.submissions.filter(
              (s) => s.marks / s.assignment.maxMarks < 0.7
            ).length,
          },
        };
      }
    } else if (role === "FACULTY") {
      const faculty = await prisma.faculty.findFirst({
        where: { userId },
        include: {
          courses: {
            include: {
              enrollments: true,
              assignments: {
                include: {
                  submissions: true,
                },
              },
            },
          },
        },
      });

      if (faculty) {
        const totalStudents = faculty.courses.reduce(
          (sum, course) => sum + course.enrollments.length,
          0
        );
        const totalAssignments = faculty.courses.reduce(
          (sum, course) => sum + course.assignments.length,
          0
        );
        const totalSubmissions = faculty.courses.reduce(
          (sum, course) =>
            sum +
            course.assignments.reduce(
              (subSum, assignment) => subSum + assignment.submissions.length,
              0
            ),
          0
        );

        reports = {
          coursesTeaching: faculty.courses.length,
          totalStudents,
          totalAssignments,
          totalSubmissions,
          pendingGrading: faculty.courses.reduce(
            (sum, course) =>
              sum +
              course.assignments.reduce(
                (subSum, assignment) =>
                  subSum +
                  assignment.submissions.filter((s) => s.status === "SUBMITTED")
                    .length,
                0
              ),
            0
          ),
        };
      }
    }

    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
    });
  }
});

// Enroll student in course
app.post("/api/enrollments", async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Verify student exists
    const student = await prisma.student.findFirst({
      where: { userId },
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Only students can enroll in courses",
      });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        courseId,
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this course",
      });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: student.id,
        courseId,
        enrolledAt: new Date(),
        status: "ENROLLED",
      },
      include: {
        course: {
          include: {
            faculty: {
              include: { user: true },
            },
            department: true,
          },
        },
        student: {
          include: { user: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in course",
      enrollment,
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to enroll in course",
    });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: "Connected",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// =============================================================================
// SCHEDULE MANAGEMENT APIs
// =============================================================================

// Get schedules by date
app.get("/api/schedules", async (req, res) => {
  try {
    const { date, userId, courseId, type } = req.query;

    let whereClause = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      whereClause.startTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (courseId) {
      whereClause.courseId = courseId;
    }

    if (type) {
      whereClause.type = type;
    }

    // Filter by user access
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          facultyProfile: true,
          studentProfile: {
            include: {
              enrollments: {
                where: { status: "ACTIVE" },
                select: { courseId: true },
              },
            },
          },
        },
      });

      if (user?.role === "STUDENT") {
        // Students can only see schedules for their enrolled courses
        const enrolledCourseIds =
          user.studentProfile?.enrollments.map((e) => e.courseId) || [];
        whereClause.OR = [
          { courseId: { in: enrolledCourseIds } },
          { type: "HOLIDAY" },
          { type: "SPECIAL_EVENT" },
        ];
      } else if (user?.role === "FACULTY") {
        // Faculty can see schedules for their courses or created by them
        whereClause.OR = [
          { facultyId: user.facultyProfile?.userId },
          { createdById: userId },
        ];
      }
    }

    const schedules = await prisma.schedule.findMany({
      where: whereClause,
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        faculty: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    const formattedSchedules = schedules.map((schedule) => ({
      id: schedule.id,
      title: schedule.title,
      description: schedule.description,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      dayOfWeek: schedule.dayOfWeek,
      type: schedule.type,
      course: schedule.course,
      faculty: schedule.faculty
        ? {
            name: `${schedule.faculty.user.firstName} ${schedule.faculty.user.lastName}`,
          }
        : null,
      createdBy: `${schedule.createdBy.firstName} ${schedule.createdBy.lastName}`,
      createdAt: schedule.createdAt,
    }));

    res.json({
      success: true,
      schedules: formattedSchedules,
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch schedules",
    });
  }
});

// Create new schedule
app.post("/api/schedules", async (req, res) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      dayOfWeek,
      type,
      courseId,
      facultyId,
      createdById,
    } = req.body;

    if (
      !title ||
      !startTime ||
      !endTime ||
      !dayOfWeek ||
      !type ||
      !createdById
    ) {
      console.log("Validation failed. Missing fields:", {
        title: !!title,
        startTime: !!startTime,
        endTime: !!endTime,
        dayOfWeek: !!dayOfWeek,
        type: !!type,
        createdById: !!createdById,
      });
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: " +
          [
            !title && "title",
            !startTime && "startTime",
            !endTime && "endTime",
            !dayOfWeek && "dayOfWeek",
            !type && "type",
            !createdById && "createdById",
          ]
            .filter(Boolean)
            .join(", "),
      });
    }

    // Validate creator exists and has permission
    const creator = await prisma.user.findUnique({
      where: { id: createdById },
      include: { facultyProfile: true },
    });

    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "Student cannot create schedules",
      });
    }

    // Only faculty, HOD, and principal can create schedules
    if (!["FACULTY", "HOD", "PRINCIPAL"].includes(creator.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions to create schedule",
      });
    }

    // Validate course exists if provided
    if (courseId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
    }

    // Validate faculty exists if provided
    if (facultyId) {
      const faculty = await prisma.faculty.findUnique({
        where: { userId: facultyId },
      });

      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: "Faculty not found",
        });
      }
    }

    // Create schedule
    const schedule = await prisma.schedule.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        dayOfWeek,
        type,
        courseId: courseId || null,
        facultyId: facultyId || null,
        createdById,
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        faculty: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      schedule: {
        id: schedule.id,
        title: schedule.title,
        description: schedule.description,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        dayOfWeek: schedule.dayOfWeek,
        type: schedule.type,
        course: schedule.course,
        faculty: schedule.faculty
          ? {
              name: `${schedule.faculty.user.firstName} ${schedule.faculty.user.lastName}`,
            }
          : null,
        createdBy: `${schedule.createdBy.firstName} ${schedule.createdBy.lastName}`,
        createdAt: schedule.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create schedule",
    });
  }
});

// Update schedule
app.put("/api/schedules/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      startTime,
      endTime,
      dayOfWeek,
      type,
      courseId,
      facultyId,
      userId, // User making the update
    } = req.body;

    // Validate schedule exists
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id },
      include: { createdBy: true },
    });

    if (!existingSchedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    // Validate user has permission to update
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Only creator or admin roles can update schedule
      if (
        existingSchedule.createdById !== userId &&
        !["HOD", "PRINCIPAL"].includes(user.role)
      ) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions to update schedule",
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startTime !== undefined) updateData.startTime = new Date(startTime);
    if (endTime !== undefined) updateData.endTime = new Date(endTime);
    if (dayOfWeek !== undefined) updateData.dayOfWeek = dayOfWeek;
    if (type !== undefined) updateData.type = type;
    if (courseId !== undefined) updateData.courseId = courseId || null;
    if (facultyId !== undefined) updateData.facultyId = facultyId || null;

    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: updateData,
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        faculty: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.json({
      success: true,
      schedule: {
        id: updatedSchedule.id,
        title: updatedSchedule.title,
        description: updatedSchedule.description,
        startTime: updatedSchedule.startTime,
        endTime: updatedSchedule.endTime,
        dayOfWeek: updatedSchedule.dayOfWeek,
        type: updatedSchedule.type,
        course: updatedSchedule.course,
        faculty: updatedSchedule.faculty
          ? {
              name: `${updatedSchedule.faculty.user.firstName} ${updatedSchedule.faculty.user.lastName}`,
            }
          : null,
        createdBy: `${updatedSchedule.createdBy.firstName} ${updatedSchedule.createdBy.lastName}`,
        updatedAt: updatedSchedule.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update schedule",
    });
  }
});

// Delete schedule
app.delete("/api/schedules/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Validate schedule exists
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id },
    });

    if (!existingSchedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    // Validate user has permission to delete
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Only creator or admin roles can delete schedule
      if (
        existingSchedule.createdById !== userId &&
        !["HOD", "PRINCIPAL"].includes(user.role)
      ) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions to delete schedule",
        });
      }
    }

    await prisma.schedule.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete schedule",
    });
  }
});

// Get schedule by ID
app.get("/api/schedules/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        faculty: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    res.json({
      success: true,
      schedule: {
        id: schedule.id,
        title: schedule.title,
        description: schedule.description,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        dayOfWeek: schedule.dayOfWeek,
        type: schedule.type,
        course: schedule.course,
        faculty: schedule.faculty
          ? {
              name: `${schedule.faculty.user.firstName} ${schedule.faculty.user.lastName}`,
            }
          : null,
        createdBy: `${schedule.createdBy.firstName} ${schedule.createdBy.lastName}`,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch schedule",
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Admin credentials:");
  console.log("ID:", ADMIN_CREDENTIALS.id);
  console.log("Password:", ADMIN_CREDENTIALS.password);
  console.log("Database: PostgreSQL with Prisma ORM");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
