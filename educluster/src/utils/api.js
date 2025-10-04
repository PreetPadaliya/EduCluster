// API utility functions for EduCluster
const API_BASE_URL = "http://localhost:3001/api";

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API call failed");
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  // Login user
  login: (credentials) =>
    apiCall("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  // Student signup
  signupStudent: (userData) =>
    apiCall("/signup/student", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // Non-student signup request
  signupRequest: (userData) =>
    apiCall("/signup/request", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // Check request status
  checkRequestStatus: (email) => apiCall(`/request-status/${email}`),
};

// Admin APIs
export const adminAPI = {
  // Admin login
  login: (credentials) =>
    apiCall("/admin/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  // Get pending requests
  getPendingRequests: () => apiCall("/admin/pending-requests"),

  // Approve user request
  approveRequest: (requestId) =>
    apiCall(`/admin/approve/${requestId}`, {
      method: "POST",
    }),

  // Reject user request
  rejectRequest: (requestId, reason) =>
    apiCall(`/admin/reject/${requestId}`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  // Get all approved users
  getUsers: () => apiCall("/admin/users"),
};

// Course APIs
export const courseAPI = {
  // Get courses (role-based)
  getCourses: (userId, role) =>
    apiCall(`/courses?userId=${userId}&role=${role}`),

  // Create course (HOD/Principal only)
  createCourse: (courseData) =>
    apiCall("/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    }),

  // Get departments
  getDepartments: () => apiCall("/departments"),

  // Enroll in course
  enrollInCourse: (userId, courseId) =>
    apiCall("/enrollments", {
      method: "POST",
      body: JSON.stringify({ userId, courseId }),
    }),
};

// Assignment APIs
export const assignmentAPI = {
  // Get assignments (role-based)
  getAssignments: (userId, role) =>
    apiCall(`/assignments?userId=${userId}&role=${role}`),

  // Create assignment (Faculty only)
  createAssignment: (assignmentData) =>
    apiCall("/assignments", {
      method: "POST",
      body: JSON.stringify(assignmentData),
    }),

  // Submit assignment (Student only)
  submitAssignment: (assignmentId, submissionData) =>
    apiCall(`/assignments/${assignmentId}/submit`, {
      method: "POST",
      body: JSON.stringify(submissionData),
    }),

  // Get submissions for assignment (Faculty only)
  getSubmissions: (assignmentId, userId) =>
    apiCall(`/assignments/${assignmentId}/submissions?userId=${userId}`),

  // Grade submission (Faculty only)
  gradeSubmission: (submissionId, gradeData) =>
    apiCall(`/submissions/${submissionId}/grade`, {
      method: "POST",
      body: JSON.stringify(gradeData),
    }),
};

// Grade APIs
export const gradeAPI = {
  // Get student grades
  getGrades: (userId, courseId = null) => {
    const params = courseId
      ? `?userId=${userId}&courseId=${courseId}`
      : `?userId=${userId}`;
    return apiCall(`/grades${params}`);
  },
};

// Faculty APIs
export const facultyAPI = {
  // Get faculty members
  getFaculty: (departmentId = null) => {
    const params = departmentId ? `?departmentId=${departmentId}` : "";
    return apiCall(`/faculty${params}`);
  },
};

// Classmates API
export const classmatesAPI = {
  // Get classmates
  getClassmates: (userId) => apiCall(`/classmates?userId=${userId}`),
};

// Schedule APIs
export const scheduleAPI = {
  // Get schedules with filters
  getSchedules: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append("date", params.date);
    if (params.userId) queryParams.append("userId", params.userId);
    if (params.courseId) queryParams.append("courseId", params.courseId);
    if (params.type) queryParams.append("type", params.type);

    const queryString = queryParams.toString();
    return apiCall(`/schedules${queryString ? `?${queryString}` : ""}`);
  },

  // Get schedule by ID
  getScheduleById: (scheduleId) => apiCall(`/schedules/${scheduleId}`),

  // Create new schedule
  createSchedule: (scheduleData) =>
    apiCall("/schedules", {
      method: "POST",
      body: JSON.stringify(scheduleData),
    }),

  // Update schedule
  updateSchedule: (scheduleId, scheduleData) =>
    apiCall(`/schedules/${scheduleId}`, {
      method: "PUT",
      body: JSON.stringify(scheduleData),
    }),

  // Delete schedule
  deleteSchedule: (scheduleId, userId) =>
    apiCall(`/schedules/${scheduleId}`, {
      method: "DELETE",
      body: JSON.stringify({ userId }),
    }),

  // Legacy method for compatibility
  getSchedule: (userId, role) =>
    apiCall(`/schedules?userId=${userId}&role=${role}`),
};

// Announcement APIs
export const announcementAPI = {
  // Get announcements
  getAnnouncements: (userId, role) =>
    apiCall(`/announcements?userId=${userId}&role=${role}`),

  // Create announcement (Faculty/HOD/Principal only)
  createAnnouncement: (announcementData) =>
    apiCall("/announcements", {
      method: "POST",
      body: JSON.stringify(announcementData),
    }),
};

// Reports APIs
export const reportsAPI = {
  // Get reports/analytics
  getReports: (userId, role, type = null) => {
    const params = type
      ? `?userId=${userId}&role=${role}&type=${type}`
      : `?userId=${userId}&role=${role}`;
    return apiCall(`/reports${params}`);
  },
};

// Health check
export const healthAPI = {
  // Check server health
  checkHealth: () => apiCall("/health", { baseURL: "http://localhost:3001" }),
};

// Export all APIs as a single object
export const API = {
  auth: authAPI,
  admin: adminAPI,
  courses: courseAPI,
  departments: { getDepartments: () => apiCall("/departments") },
  assignments: assignmentAPI,
  grades: gradeAPI,
  faculty: facultyAPI,
  classmates: classmatesAPI,
  schedule: scheduleAPI,
  announcements: announcementAPI,
  reports: reportsAPI,
  health: healthAPI,
};

export default API;
