import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebaseConfig';

// Fallback helper to guard if Firebase credentials aren't plugged in yet
const checkDb = () => {
  if (!db || !isFirebaseConfigured()) {
    throw new Error('Firebase is not configured yet. Please configure your Firebase credentials in frontend/.env');
  }
  return db;
};

// =========================================================================
// 1. USERS COLLECTION (Profile & Roles)
// =========================================================================
export const getUserProfile = async (uid) => {
  if (!db || !isFirebaseConfigured()) return null;
  const userDocRef = doc(db, 'users', uid);
  const snap = await getDoc(userDocRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
};

export const createUserProfile = async (uid, data) => {
  const firestore = checkDb();
  const userDocRef = doc(firestore, 'users', uid);
  const profile = {
    uid,
    fullName: data.fullName || data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    education: data.education || {
      college: '',
      degree: '',
      branch: '',
      year: '',
      cgpa: '',
    },
    skills: Array.isArray(data.skills) ? data.skills : [],
    role: data.role === 'admin' ? 'admin' : 'student', // strictly controlled
    avatar: data.avatar || '',
    bio: data.bio || '',
    resumeUrl: data.resumeUrl || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(userDocRef, profile, { merge: true });
  return profile;
};

export const updateUserProfile = async (uid, updateData) => {
  const firestore = checkDb();
  const userDocRef = doc(firestore, 'users', uid);

  // Ensure skills is ALWAYS a clean array of strings
  const skillsArray = Array.isArray(updateData.skills)
    ? updateData.skills
    : typeof updateData.skills === 'string'
    ? updateData.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const fullName = updateData.fullName || updateData.name || '';

  const education = updateData.education || {
    college: updateData.collegeName || updateData.college || '',
    degree: updateData.degree || 'B.Tech',
    branch: updateData.branch || '',
    year: updateData.graduationYear || updateData.year || 2026,
    cgpa: updateData.cgpa || '',
  };

  // Calculate profile completion dynamically
  let score = 20;
  if (fullName) score += 15;
  if (updateData.phone) score += 15;
  if (education.college) score += 15;
  if (education.branch) score += 15;
  if (skillsArray.length > 0) score += 20;
  const profileCompletion = Math.min(100, score);

  const payload = {
    ...updateData,
    fullName,
    name: fullName,
    skills: skillsArray,
    education,
    collegeName: education.college,
    degree: education.degree,
    branch: education.branch,
    graduationYear: education.year,
    cgpa: education.cgpa,
    profileCompletion,
    updatedAt: serverTimestamp(),
  };

  // Prevent unauthorized role modification via profile update
  delete payload.role;
  delete payload.uid;

  await setDoc(userDocRef, payload, { merge: true });
  const updated = await getDoc(userDocRef);
  return { id: updated.id, _id: updated.id, ...updated.data() };
};

export const getAllStudents = async () => {
  if (!db || !isFirebaseConfigured()) return [];
  const q = query(collection(db, 'users'), where('role', '==', 'student'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, _id: d.id, ...d.data() }));
};

export const deleteStudentAccount = async (uid) => {
  const firestore = checkDb();
  await deleteDoc(doc(firestore, 'users', uid));
  return true;
};

// =========================================================================
// 2. JOBS COLLECTION
// =========================================================================
export const getJobs = async (filters = {}) => {
  if (!db || !isFirebaseConfigured()) return [];
  let q = collection(db, 'jobs');
  const snap = await getDocs(q);
  let jobs = snap.docs.map((d) => ({ id: d.id, _id: d.id, ...d.data() }));

  // Apply in-memory client filtering for rich responsiveness
  if (filters.search) {
    const s = filters.search.toLowerCase();
    jobs = jobs.filter(
      (j) =>
        j.jobTitle?.toLowerCase().includes(s) ||
        j.companyName?.toLowerCase().includes(s) ||
        j.location?.toLowerCase().includes(s) ||
        j.description?.toLowerCase().includes(s) ||
        (Array.isArray(j.requiredSkills) && j.requiredSkills.some((sk) => sk.toLowerCase().includes(s)))
    );
  }
  if (filters.jobType && filters.jobType !== 'all') {
    jobs = jobs.filter((j) => j.jobType?.toLowerCase() === filters.jobType.toLowerCase());
  }
  if (filters.location && filters.location !== 'all') {
    jobs = jobs.filter((j) => j.location?.toLowerCase().includes(filters.location.toLowerCase()));
  }
  if (filters.limit) {
    jobs = jobs.slice(0, Number(filters.limit));
  }
  return jobs;
};

export const getJobById = async (id) => {
  const firestore = checkDb();
  const snap = await getDoc(doc(firestore, 'jobs', id));
  if (!snap.exists()) return null;
  return { id: snap.id, _id: snap.id, ...snap.data() };
};

export const createJob = async (jobData) => {
  const firestore = checkDb();
  const payload = {
    jobTitle: jobData.jobTitle || jobData.title || '',
    companyName: jobData.companyName || jobData.company || '',
    location: jobData.location || 'Remote',
    description: jobData.description || '',
    eligibility: jobData.eligibility || 'Any Graduate',
    requiredSkills: Array.isArray(jobData.requiredSkills)
      ? jobData.requiredSkills
      : (jobData.requiredSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
    applicationLink: jobData.applicationLink || '',
    jobType: jobData.jobType || 'Full-time',
    salary: jobData.salary || 'Competitive',
    experience: jobData.experience || 'Entry Level / Fresher',
    openings: Number(jobData.openings) || 1,
    status: jobData.status || 'Active',
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(firestore, 'jobs'), payload);
  return { id: docRef.id, _id: docRef.id, ...payload };
};

export const updateJob = async (id, jobData) => {
  const firestore = checkDb();
  const docRef = doc(firestore, 'jobs', id);
  const payload = { ...jobData, updatedAt: serverTimestamp() };
  delete payload.id;
  delete payload._id;
  await updateDoc(docRef, payload);
  const snap = await getDoc(docRef);
  return { id: snap.id, _id: snap.id, ...snap.data() };
};

export const deleteJob = async (id) => {
  const firestore = checkDb();
  await deleteDoc(doc(firestore, 'jobs', id));
  return true;
};

// =========================================================================
// 3. INTERNSHIPS COLLECTION
// =========================================================================
export const getInternships = async (filters = {}) => {
  if (!db || !isFirebaseConfigured()) return [];
  const snap = await getDocs(collection(db, 'internships'));
  let internships = snap.docs.map((d) => ({ id: d.id, _id: d.id, ...d.data() }));

  if (filters.search) {
    const s = filters.search.toLowerCase();
    internships = internships.filter(
      (item) =>
        item.title?.toLowerCase().includes(s) ||
        item.company?.toLowerCase().includes(s) ||
        item.location?.toLowerCase().includes(s) ||
        item.description?.toLowerCase().includes(s)
    );
  }
  if (filters.duration && filters.duration !== 'all') {
    internships = internships.filter((item) => item.duration?.toLowerCase().includes(filters.duration.toLowerCase()));
  }
  if (filters.limit) {
    internships = internships.slice(0, Number(filters.limit));
  }
  return internships;
};

export const getInternshipById = async (id) => {
  const firestore = checkDb();
  const snap = await getDoc(doc(firestore, 'internships', id));
  if (!snap.exists()) return null;
  return { id: snap.id, _id: snap.id, ...snap.data() };
};

export const createInternship = async (data) => {
  const firestore = checkDb();
  const payload = {
    title: data.title || '',
    company: data.company || '',
    duration: data.duration || '3 Months',
    stipend: data.stipend || 'Unpaid / Certificate',
    description: data.description || '',
    eligibility: data.eligibility || 'College Students',
    location: data.location || 'Remote',
    requiredSkills: Array.isArray(data.requiredSkills)
      ? data.requiredSkills
      : (data.requiredSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
    status: data.status || 'Active',
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(firestore, 'internships'), payload);
  return { id: docRef.id, _id: docRef.id, ...payload };
};

export const updateInternship = async (id, data) => {
  const firestore = checkDb();
  const docRef = doc(firestore, 'internships', id);
  const payload = { ...data, updatedAt: serverTimestamp() };
  delete payload.id;
  delete payload._id;
  await updateDoc(docRef, payload);
  const snap = await getDoc(docRef);
  return { id: snap.id, _id: snap.id, ...snap.data() };
};

export const deleteInternship = async (id) => {
  const firestore = checkDb();
  await deleteDoc(doc(firestore, 'internships', id));
  return true;
};

// =========================================================================
// 4. APPLICATIONS COLLECTION
// =========================================================================
export const submitApplication = async (appData) => {
  const firestore = checkDb();
  const payload = {
    studentId: appData.studentId || '',
    studentName: appData.studentName || '',
    studentEmail: appData.studentEmail || '',
    targetId: appData.jobId || appData.internshipId || '',
    opportunityType: appData.opportunityType || (appData.internshipId ? 'internship' : 'job'),
    jobTitle: appData.jobTitle || appData.title || '',
    companyName: appData.companyName || appData.company || '',
    coverLetter: appData.coverLetter || '',
    resumeUrl: appData.resumeUrl || '',
    applicationStatus: 'Pending',
    appliedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(firestore, 'applications'), payload);
  return { id: docRef.id, _id: docRef.id, ...payload };
};

export const getMyApplications = async (studentId) => {
  if (!db || !isFirebaseConfigured()) return [];
  const q = query(collection(db, 'applications'), where('studentId', '==', studentId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, _id: d.id, ...d.data() }));
};

export const getAllApplications = async (filters = {}) => {
  if (!db || !isFirebaseConfigured()) return [];
  const snap = await getDocs(collection(db, 'applications'));
  let apps = snap.docs.map((d) => ({ id: d.id, _id: d.id, ...d.data() }));

  if (filters.status && filters.status !== 'all') {
    apps = apps.filter((a) => a.applicationStatus?.toLowerCase() === filters.status.toLowerCase());
  }
  if (filters.opportunityType && filters.opportunityType !== 'all') {
    apps = apps.filter((a) => a.opportunityType?.toLowerCase() === filters.opportunityType.toLowerCase());
  }
  return apps;
};

export const updateApplicationStatus = async (id, status, feedback = '', extra = {}) => {
  const firestore = checkDb();
  const docRef = doc(firestore, 'applications', id);
  const payload = {
    applicationStatus: status,
    feedback: feedback || '',
    interviewDate: extra.interviewDate || null,
    interviewLink: extra.interviewLink || '',
    updatedAt: serverTimestamp(),
  };
  await updateDoc(docRef, payload);
  const snap = await getDoc(docRef);
  const appData = snap.data();

  // Automatically trigger a notification to the student in Firestore
  if (appData?.studentId) {
    try {
      await addDoc(collection(firestore, 'notifications'), {
        userId: appData.studentId,
        title: `Application Update: ${appData.jobTitle || 'Your Application'}`,
        message: `Your application status for ${appData.companyName || 'the role'} has been updated to "${status}".${
          feedback ? ` Feedback: ${feedback}` : ''
        }`,
        type: status === 'Shortlisted' || status === 'Selected' ? 'success' : status === 'Rejected' ? 'alert' : 'info',
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Could not create student notification:', e.message);
    }
  }

  return { id: snap.id, _id: snap.id, ...appData };
};

// =========================================================================
// 5. COURSES COLLECTION
// =========================================================================
export const getCourses = async (filters = {}) => {
  if (!db || !isFirebaseConfigured()) return [];
  const snap = await getDocs(collection(db, 'courses'));
  let courses = snap.docs.map((d) => ({ id: d.id, _id: d.id, ...d.data() }));

  if (filters.category && filters.category !== 'all') {
    courses = courses.filter((c) => c.category?.toLowerCase() === filters.category.toLowerCase());
  }
  if (filters.difficulty && filters.difficulty !== 'all') {
    courses = courses.filter((c) => c.difficulty?.toLowerCase() === filters.difficulty.toLowerCase());
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    courses = courses.filter(
      (c) =>
        c.courseName?.toLowerCase().includes(s) ||
        c.description?.toLowerCase().includes(s) ||
        c.category?.toLowerCase().includes(s)
    );
  }
  if (filters.limit) {
    courses = courses.slice(0, Number(filters.limit));
  }
  return courses;
};

export const getCourseById = async (id) => {
  const firestore = checkDb();
  const snap = await getDoc(doc(firestore, 'courses', id));
  if (!snap.exists()) return null;
  return { id: snap.id, _id: snap.id, ...snap.data() };
};

export const createCourse = async (data) => {
  const firestore = checkDb();
  const payload = {
    courseName: data.courseName || data.title || '',
    category: data.category || 'Web Development',
    description: data.description || '',
    difficulty: data.difficulty || 'Beginner',
    tutorialUrl: data.tutorialUrl || data.url || 'https://www.w3schools.com',
    duration: data.duration || '4 Weeks',
    topics: Array.isArray(data.topics) ? data.topics : [],
    lessons: Array.isArray(data.lessons) ? data.lessons : [],
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(firestore, 'courses'), payload);
  return { id: docRef.id, _id: docRef.id, ...payload };
};

export const updateCourse = async (id, data) => {
  const firestore = checkDb();
  const docRef = doc(firestore, 'courses', id);
  const payload = { ...data, updatedAt: serverTimestamp() };
  delete payload.id;
  delete payload._id;
  await updateDoc(docRef, payload);
  const snap = await getDoc(docRef);
  return { id: snap.id, _id: snap.id, ...snap.data() };
};

export const deleteCourse = async (id) => {
  const firestore = checkDb();
  await deleteDoc(doc(firestore, 'courses', id));
  return true;
};

// =========================================================================
// 6. STUDENT PROGRESS COLLECTION
// =========================================================================
export const getStudentProgress = async (studentId) => {
  const firestore = checkDb();
  const docRef = doc(firestore, 'studentProgress', studentId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return {
    studentId,
    completedCourses: [],
    learningProgress: {},
    updatedAt: new Date().toISOString(),
  };
};

export const toggleCourseCompletion = async (studentId, courseId) => {
  const firestore = checkDb();
  const docRef = doc(firestore, 'studentProgress', studentId);
  const snap = await getDoc(docRef);
  let completedCourses = [];
  let learningProgress = {};

  if (snap.exists()) {
    const data = snap.data();
    completedCourses = Array.isArray(data.completedCourses) ? [...data.completedCourses] : [];
    learningProgress = data.learningProgress || {};
  }

  const index = completedCourses.indexOf(courseId);
  let isCompleted = false;
  if (index > -1) {
    completedCourses.splice(index, 1);
    if (learningProgress[courseId]) {
      learningProgress[courseId].percent = 0;
    }
  } else {
    completedCourses.push(courseId);
    isCompleted = true;
    learningProgress[courseId] = { percent: 100, completedAt: new Date().toISOString() };
  }

  await setDoc(
    docRef,
    {
      studentId,
      completedCourses,
      learningProgress,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return { completedCourses, isCompleted };
};

export const toggleLessonProgress = async (studentId, courseId, lessonIndex) => {
  const firestore = checkDb();
  const docRef = doc(firestore, 'studentProgress', studentId);
  const snap = await getDoc(docRef);
  let progress = {};
  let completedCourses = [];

  if (snap.exists()) {
    const data = snap.data();
    progress = data.learningProgress || {};
    completedCourses = data.completedCourses || [];
  }

  const courseProg = progress[courseId] || { completedLessons: [], percent: 0 };
  const lessonSet = new Set(courseProg.completedLessons || []);

  if (lessonSet.has(lessonIndex)) {
    lessonSet.delete(lessonIndex);
  } else {
    lessonSet.add(lessonIndex);
  }

  const updatedLessons = Array.from(lessonSet);
  // Estimate percent (default 5 lessons)
  const percent = Math.min(100, Math.round((updatedLessons.length / 5) * 100));
  courseProg.completedLessons = updatedLessons;
  courseProg.percent = percent;

  if (percent === 100 && !completedCourses.includes(courseId)) {
    completedCourses.push(courseId);
  } else if (percent < 100 && completedCourses.includes(courseId)) {
    completedCourses = completedCourses.filter((id) => id !== courseId);
  }

  progress[courseId] = courseProg;

  await setDoc(
    docRef,
    {
      studentId,
      completedCourses,
      learningProgress: progress,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return { progress: courseProg, completedCourses };
};

// =========================================================================
// 7. SAVED OPPORTUNITIES COLLECTION
// =========================================================================
export const getSavedOpportunities = async (studentId) => {
  if (!db || !isFirebaseConfigured()) return [];
  const q = query(collection(db, 'savedOpportunities'), where('studentId', '==', studentId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, _id: d.id, ...d.data() }));
};

export const toggleSaveOpportunity = async (studentId, targetId, type) => {
  const firestore = checkDb();
  const q = query(
    collection(firestore, 'savedOpportunities'),
    where('studentId', '==', studentId),
    where('targetId', '==', targetId)
  );
  const snap = await getDocs(q);

  if (!snap.empty) {
    // Already saved, remove it
    for (const docSnap of snap.docs) {
      await deleteDoc(doc(firestore, 'savedOpportunities', docSnap.id));
    }
    return { saved: false };
  } else {
    // Add to saved
    await addDoc(collection(firestore, 'savedOpportunities'), {
      studentId,
      targetId,
      type,
      savedAt: serverTimestamp(),
    });
    return { saved: true };
  }
};

// =========================================================================
// 8. NOTIFICATIONS COLLECTION
// =========================================================================
export const getUserNotifications = async (userId) => {
  if (!db || !isFirebaseConfigured()) return [];
  const snap = await getDocs(collection(db, 'notifications'));
  return snap.docs
    .map((d) => ({ id: d.id, _id: d.id, ...d.data() }))
    .filter((n) => n.userId === userId || n.userId === 'all')
    .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
};

export const markNotificationAsRead = async (id) => {
  const firestore = checkDb();
  const docRef = doc(firestore, 'notifications', id);
  await updateDoc(docRef, { read: true });
  return true;
};

export const markAllNotificationsAsRead = async (userId) => {
  const firestore = checkDb();
  const notifs = await getUserNotifications(userId);
  for (const n of notifs) {
    if (!n.read) {
      await updateDoc(doc(firestore, 'notifications', n.id), { read: true });
    }
  }
  return true;
};

export const createNotification = async (data) => {
  const firestore = checkDb();
  const payload = {
    userId: data.userId || 'all',
    title: data.title || 'CareerBridge Update',
    message: data.message || '',
    type: data.type || 'info',
    read: false,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(firestore, 'notifications'), payload);
  return { id: docRef.id, _id: docRef.id, ...payload };
};

// =========================================================================
// 9. RESUMES COLLECTION
// =========================================================================
export const getStudentResume = async (userId) => {
  const firestore = checkDb();
  const docRef = doc(firestore, 'resumes', userId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
};

export const saveStudentResume = async (userId, resumeData) => {
  const firestore = checkDb();
  const docRef = doc(firestore, 'resumes', userId);
  const payload = {
    userId,
    ...resumeData,
    updatedAt: serverTimestamp(),
  };
  await setDoc(docRef, payload, { merge: true });
  return payload;
};

// =========================================================================
// 10. COMPANIES COLLECTION
// =========================================================================
export const getCompanies = async () => {
  if (!db || !isFirebaseConfigured()) return [];
  const snap = await getDocs(collection(db, 'companies'));
  return snap.docs.map((d) => ({ id: d.id, _id: d.id, ...d.data() }));
};

export const getCompanyById = async (id) => {
  const firestore = checkDb();
  const snap = await getDoc(doc(firestore, 'companies', id));
  if (!snap.exists()) return null;
  return { id: snap.id, _id: snap.id, ...snap.data() };
};

export const createCompany = async (data) => {
  const firestore = checkDb();
  const payload = {
    name: data.name || '',
    industry: data.industry || 'Technology',
    location: data.location || 'Multiple Locations',
    website: data.website || '',
    logo: data.logo || '',
    description: data.description || '',
    openPositions: Number(data.openPositions) || 0,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(firestore, 'companies'), payload);
  return { id: docRef.id, _id: docRef.id, ...payload };
};

export const updateCompany = async (id, data) => {
  const firestore = checkDb();
  const docRef = doc(firestore, 'companies', id);
  const payload = { ...data, updatedAt: serverTimestamp() };
  delete payload.id;
  delete payload._id;
  await updateDoc(docRef, payload);
  const snap = await getDoc(docRef);
  return { id: snap.id, _id: snap.id, ...snap.data() };
};

export const deleteCompany = async (id) => {
  const firestore = checkDb();
  await deleteDoc(doc(firestore, 'companies', id));
  return true;
};

// =========================================================================
// 11. PLACEMENT PREPARATION & MOCK TESTS
// =========================================================================
export const getMockTests = async () => {
  const firestore = checkDb();
  const snap = await getDocs(collection(firestore, 'mockTests'));
  return snap.docs.map((d) => ({ id: d.id, _id: d.id, ...d.data() }));
};

export const getMockTestById = async (id) => {
  const firestore = checkDb();
  const snap = await getDoc(doc(firestore, 'mockTests', id));
  if (!snap.exists()) return null;
  return { id: snap.id, _id: snap.id, ...snap.data() };
};

// =========================================================================
// 12. FIRESTORE AUTO-SEEDER (Default Data Population)
// =========================================================================
export const seedFirestoreDefaults = async () => {
  if (!db || !isFirebaseConfigured()) return;
  try {
    const jobsSnap = await getDocs(collection(db, 'jobs'));
    if (!jobsSnap.empty) {
      console.log('⚡ Firestore collections already contain data.');
      return;
    }

    console.log('🌱 Initializing Firestore with default portal data...');
    const batch = writeBatch(db);

    // Initial Jobs
    const defaultJobs = [
      {
        jobTitle: 'Software Engineer Graduate - 2026',
        companyName: 'Google',
        location: 'Bengaluru / Hyderabad (Hybrid)',
        description:
          'Join Google Engineering team building scalable distributed systems, cloud services, and AI-driven consumer applications.',
        eligibility: 'B.Tech/B.E./M.Tech/MCA in Computer Science, IT, or related fields. 7.0+ CGPA.',
        requiredSkills: ['Data Structures', 'Algorithms', 'Python', 'Go', 'System Design'],
        applicationLink: 'https://careers.google.com',
        jobType: 'Full-time',
        salary: '₹18,00,000 - ₹24,00,000 / year',
        experience: 'Fresher / 0-1 Year',
        openings: 15,
        status: 'Active',
      },
      {
        jobTitle: 'Associate Software Engineer',
        companyName: 'Microsoft',
        location: 'Hyderabad / Noida (Hybrid)',
        description:
          'Work on Azure cloud services, Microsoft 365, and developer tool ecosystems empowering millions globally.',
        eligibility: 'Graduating 2025/2026, Computer Science, Circuit branches. Minimum 65% aggregate.',
        requiredSkills: ['C#', 'TypeScript', 'Azure', 'Algorithms', 'OOPs'],
        applicationLink: 'https://careers.microsoft.com',
        jobType: 'Full-time',
        salary: '₹16,00,000 - ₹20,00,000 / year',
        experience: 'Fresher',
        openings: 20,
        status: 'Active',
      },
      {
        jobTitle: 'Full Stack Web Developer',
        companyName: 'Infosys',
        location: 'Bengaluru / Pune / Chennai',
        description:
          'Design and build responsive web applications using modern JavaScript frameworks, REST APIs, and Cloud microservices.',
        eligibility: 'All Engineering Graduates, MCA, M.Sc (CS/IT). No active backlogs.',
        requiredSkills: ['React.js', 'Node.js', 'JavaScript', 'HTML5/CSS3', 'Git'],
        applicationLink: 'https://www.infosys.com/careers',
        jobType: 'Full-time',
        salary: '₹6,50,000 - ₹9,00,000 / year',
        experience: 'Fresher / Entry Level',
        openings: 50,
        status: 'Active',
      },
      {
        jobTitle: 'Data Analyst Associate',
        companyName: 'Amazon',
        location: 'Bengaluru (On-site)',
        description:
          'Leverage data analytics, SQL queries, and dashboards to power customer fulfillment and global logistics decisions.',
        eligibility: 'Any STEM graduate with proficiency in SQL and Python/R.',
        requiredSkills: ['SQL', 'Python', 'Excel', 'Tableau', 'Power BI'],
        applicationLink: 'https://amazon.jobs',
        jobType: 'Full-time',
        salary: '₹10,00,000 - ₹14,00,000 / year',
        experience: 'Fresher / 0-2 Years',
        openings: 8,
        status: 'Active',
      },
    ];

    for (const job of defaultJobs) {
      const docRef = doc(collection(db, 'jobs'));
      batch.set(docRef, { ...job, createdAt: serverTimestamp() });
    }

    // Initial Internships
    const defaultInternships = [
      {
        title: 'Front-End Web Development Intern',
        company: 'Adobe',
        duration: '6 Months',
        stipend: '₹45,000 / month',
        description:
          'Build creative web applications and component systems using modern React, TypeScript, and WebGL.',
        eligibility: 'Pre-final or final year engineering students.',
        location: 'Noida / Remote',
        requiredSkills: ['React.js', 'JavaScript', 'CSS3', 'UI/UX Design'],
        status: 'Active',
      },
      {
        title: 'Cloud DevOps Engineering Intern',
        company: 'Red Hat',
        duration: '3 Months',
        stipend: '₹35,000 / month',
        description:
          'Learn CI/CD automation, Linux system internals, Kubernetes orchestration, and open-source contributions.',
        eligibility: '2nd, 3rd, or 4th year undergraduate students.',
        location: 'Pune / Remote',
        requiredSkills: ['Linux', 'Docker', 'Git', 'Shell Scripting', 'Python'],
        status: 'Active',
      },
      {
        title: 'AI / Machine Learning Research Intern',
        company: 'Intel',
        duration: '6 Months',
        stipend: '₹40,000 / month',
        description:
          'Experiment with deep learning models, computer vision pipelines, and performance optimization on edge silicon.',
        eligibility: 'Students pursuing B.Tech/M.Tech with strong linear algebra and Python foundations.',
        location: 'Bengaluru',
        requiredSkills: ['Python', 'PyTorch', 'NumPy', 'Machine Learning'],
        status: 'Active',
      },
    ];

    for (const intern of defaultInternships) {
      const docRef = doc(collection(db, 'internships'));
      batch.set(docRef, { ...intern, createdAt: serverTimestamp() });
    }

    // Initial Subject-wise W3Schools Courses
    const defaultCourses = [
      {
        courseName: 'HTML5 & Responsive Web Design',
        category: 'Web Development',
        difficulty: 'Beginner',
        description: 'Master modern semantic HTML5, accessible tags, forms, media embedding, and responsive viewports.',
        tutorialUrl: 'https://www.w3schools.com/html/',
        duration: '2 Weeks',
        lessons: [
          { title: 'HTML Introduction & Document Structure', url: 'https://www.w3schools.com/html/html_intro.asp' },
          { title: 'HTML Elements, Attributes & Headings', url: 'https://www.w3schools.com/html/html_elements.asp' },
          { title: 'HTML Semantic Elements & Accessibility', url: 'https://www.w3schools.com/html/html5_semantic_elements.asp' },
          { title: 'HTML5 Forms & Input Types', url: 'https://www.w3schools.com/html/html_forms.asp' },
          { title: 'Responsive Web Design & Viewport', url: 'https://www.w3schools.com/html/html_responsive.asp' },
        ],
      },
      {
        courseName: 'Modern CSS3 & Flexbox/Grid',
        category: 'Web Development',
        difficulty: 'Beginner',
        description: 'Style beautiful websites using CSS Box Model, Flexbox layouts, CSS Grid, variables, and animations.',
        tutorialUrl: 'https://www.w3schools.com/css/',
        duration: '3 Weeks',
        lessons: [
          { title: 'CSS Box Model & Selectors', url: 'https://www.w3schools.com/css/css_boxmodel.asp' },
          { title: 'Flexbox Architecture & Alignments', url: 'https://www.w3schools.com/css/css3_flexbox.asp' },
          { title: 'CSS Grid Layout Fundamentals', url: 'https://www.w3schools.com/css/css_grid.asp' },
          { title: 'CSS Variables & Themes', url: 'https://www.w3schools.com/css/css3_variables.asp' },
          { title: 'Transitions, Transforms & Animations', url: 'https://www.w3schools.com/css/css3_transitions.asp' },
        ],
      },
      {
        courseName: 'JavaScript ES6+ Masterclass',
        category: 'Web Development',
        difficulty: 'Intermediate',
        description: 'In-depth JavaScript guide: closures, promises, async/await, event loop, and DOM manipulation.',
        tutorialUrl: 'https://www.w3schools.com/js/',
        duration: '4 Weeks',
        lessons: [
          { title: 'JavaScript Variables, Scope & Hoisting', url: 'https://www.w3schools.com/js/js_scope.asp' },
          { title: 'ES6 Arrow Functions, Destructuring & Spread', url: 'https://www.w3schools.com/js/js_es6.asp' },
          { title: 'Asynchronous JS: Promises & Async/Await', url: 'https://www.w3schools.com/js/js_async.asp' },
          { title: 'DOM Manipulation & Event Listeners', url: 'https://www.w3schools.com/js/js_htmldom.asp' },
          { title: 'Fetch API, REST & JSON Handling', url: 'https://www.w3schools.com/js/js_api_fetch.asp' },
        ],
      },
      {
        courseName: 'Python for Beginners & Data Science',
        category: 'Programming & Data',
        difficulty: 'Beginner',
        description: 'Learn Python syntax, data structures, OOPs concepts, file handling, and NumPy/Pandas intro.',
        tutorialUrl: 'https://www.w3schools.com/python/',
        duration: '3 Weeks',
        lessons: [
          { title: 'Python Syntax, Variables & Data Types', url: 'https://www.w3schools.com/python/python_syntax.asp' },
          { title: 'Lists, Tuples, Sets & Dictionaries', url: 'https://www.w3schools.com/python/python_lists.asp' },
          { title: 'Functions, Lambdas & Modules', url: 'https://www.w3schools.com/python/python_functions.asp' },
          { title: 'Object-Oriented Programming (OOP) in Python', url: 'https://www.w3schools.com/python/python_classes.asp' },
          { title: 'File Handling & Exception Handling', url: 'https://www.w3schools.com/python/python_file_handling.asp' },
        ],
      },
      {
        courseName: 'SQL & Relational Database Design',
        category: 'Database & Cloud',
        difficulty: 'Beginner',
        description: 'Master SQL queries, JOINs, aggregations, indexing, transactions, and normalization.',
        tutorialUrl: 'https://www.w3schools.com/sql/',
        duration: '3 Weeks',
        lessons: [
          { title: 'SQL SELECT, WHERE, ORDER BY', url: 'https://www.w3schools.com/sql/sql_select.asp' },
          { title: 'INNER JOIN, LEFT JOIN, RIGHT JOIN', url: 'https://www.w3schools.com/sql/sql_join.asp' },
          { title: 'GROUP BY, HAVING & Aggregate Functions', url: 'https://www.w3schools.com/sql/sql_groupby.asp' },
          { title: 'Database Normalization & Constraints', url: 'https://www.w3schools.com/sql/sql_constraints.asp' },
          { title: 'Transactions, ACID & Indexing', url: 'https://www.w3schools.com/sql/sql_create_index.asp' },
        ],
      },
      {
        courseName: 'Git & GitHub Collaboration',
        category: 'Tools & DevOps',
        difficulty: 'Beginner',
        description: 'Version control essentials: commits, branching, merging, pull requests, and resolving conflicts.',
        tutorialUrl: 'https://www.w3schools.com/git/',
        duration: '1 Week',
        lessons: [
          { title: 'Git Initialization & Workflow', url: 'https://www.w3schools.com/git/git_intro.asp' },
          { title: 'Staging, Commits & History', url: 'https://www.w3schools.com/git/git_commit.asp' },
          { title: 'Branching, Merging & Rebase', url: 'https://www.w3schools.com/git/git_branch.asp' },
          { title: 'GitHub Remotes, Push & Pull', url: 'https://www.w3schools.com/git/git_remote_add.asp' },
          { title: 'Pull Requests & Merge Conflicts', url: 'https://www.w3schools.com/git/git_branch_merge.asp' },
        ],
      },
    ];

    for (const course of defaultCourses) {
      const docRef = doc(collection(db, 'courses'));
      batch.set(docRef, { ...course, createdAt: serverTimestamp() });
    }

    // Initial Companies
    const defaultCompanies = [
      {
        name: 'Google',
        industry: 'Internet & Cloud Technology',
        location: 'Bengaluru, Hyderabad, Mountain View',
        website: 'https://careers.google.com',
        description:
          'A global leader in technology, specializing in internet services, AI, cloud computing, and hardware.',
        openPositions: 15,
      },
      {
        name: 'Microsoft',
        industry: 'Software & Cloud Services',
        location: 'Hyderabad, Bengaluru, Noida',
        website: 'https://careers.microsoft.com',
        description:
          'Empowering every person and organization on the planet to achieve more through Azure and Microsoft 365.',
        openPositions: 20,
      },
      {
        name: 'Infosys',
        industry: 'IT Services & Consulting',
        location: 'Bengaluru, Pune, Hyderabad, Chennai',
        website: 'https://www.infosys.com',
        description:
          'A next-generation digital services consulting company enabling clients in 50+ countries to navigate their digital transformation.',
        openPositions: 50,
      },
      {
        name: 'Amazon',
        industry: 'E-Commerce & Cloud Computing (AWS)',
        location: 'Bengaluru, Hyderabad, Chennai',
        website: 'https://amazon.jobs',
        description:
          'Customer-obsessed technology pioneer transforming retail, cloud logistics, and digital streaming.',
        openPositions: 12,
      },
    ];

    for (const comp of defaultCompanies) {
      const docRef = doc(collection(db, 'companies'));
      batch.set(docRef, { ...comp, createdAt: serverTimestamp() });
    }

    // Initial Mock Tests
    const defaultMockTests = [
      {
        title: 'Full-Stack Software Engineering Mock Test',
        category: 'Full Stack',
        durationMinutes: 30,
        totalQuestions: 5,
        difficulty: 'Intermediate',
        questions: [
          {
            id: 1,
            questionText: 'What is the primary function of the Virtual DOM in React?',
            options: [
              'To directly manipulate the browser DOM for faster updates',
              'To minimize expensive real-DOM manipulations by calculating diffs in-memory',
              'To replace CSS stylesheets with JavaScript styling',
              'To run server-side code inside the client browser',
            ],
            correctAnswer: 1,
            explanation:
              'React creates a lightweight in-memory representation of the DOM and reconciles changes to update only what changed.',
          },
          {
            id: 2,
            questionText: 'Which HTTP status code signifies that a resource was successfully created?',
            options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
            correctAnswer: 1,
            explanation: 'HTTP 201 Created indicates the request succeeded and resulted in a new resource being created.',
          },
          {
            id: 3,
            questionText: 'In database systems, what does the ACID property "Isolation" guarantee?',
            options: [
              'Transactions are permanently stored on disk',
              'Concurrent transactions execute without interfering with one another',
              'All changes are rolled back on power failure',
              'Data is encrypted at rest',
            ],
            correctAnswer: 1,
            explanation:
              'Isolation ensures that transactions execute concurrently as if they were executed sequentially.',
          },
          {
            id: 4,
            questionText: 'What is the average time complexity of searching an element in a balanced Binary Search Tree?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
            correctAnswer: 1,
            explanation: 'A balanced BST divides search space in half at each step, yielding O(log n) time complexity.',
          },
          {
            id: 5,
            questionText: 'What is the purpose of Firestore Security Rules?',
            options: [
              'To build React UI templates',
              'To enforce client-side input masking',
              'To authorize and validate read/write operations securely on the database level',
              'To encrypt passwords using bcrypt in the browser',
            ],
            correctAnswer: 2,
            explanation:
              'Firestore Security Rules execute on Google servers to authorize and validate requests based on authentication context.',
          },
        ],
      },
    ];

    for (const test of defaultMockTests) {
      const docRef = doc(collection(db, 'mockTests'));
      batch.set(docRef, { ...test, createdAt: serverTimestamp() });
    }

    await batch.commit();
    console.log('✅ Firestore populated with default data successfully!');
  } catch (err) {
    console.error('Seeding Firestore warning:', err.message);
  }
};
