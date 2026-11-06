import { auth } from '../firebase/firebaseConfig';
import * as firestoreService from '../firebase/firestoreService';

// Helper to get current Firebase user UID
const getCurrentUid = () => {
  return auth?.currentUser?.uid || 'guest';
};

// Parse query params string into an object
const parseQueryParams = (url) => {
  const [_, queryString] = url.split('?');
  if (!queryString) return {};
  const params = {};
  for (const pair of queryString.split('&')) {
    const [key, value] = pair.split('=');
    if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  }
  return params;
};

// Standard response wrapper to match expected Axios format: { data: { success: true, ... } }
const wrapSuccess = (data = {}) => ({
  data: {
    success: true,
    ...data,
  },
  status: 200,
});

/**
 * CareerBridge Firestore API Adapter
 * Routes standard client HTTP calls directly to Firebase Cloud Firestore and Firebase Auth,
 * preserving full UI functionality with 100% reactive cloud database operations.
 */
const API = {
  get: async (url) => {
    const cleanUrl = url.split('?')[0];
    const params = parseQueryParams(url);
    const uid = getCurrentUid();

    // 1. Jobs
    if (cleanUrl === '/jobs') {
      const jobs = await firestoreService.getJobs(params);
      return wrapSuccess({ jobs, count: jobs.length });
    }
    const jobMatch = cleanUrl.match(/^\/jobs\/([a-zA-Z0-9_-]+)$/);
    if (jobMatch) {
      const job = await firestoreService.getJobById(jobMatch[1]);
      return wrapSuccess({ job });
    }

    // 2. Internships
    if (cleanUrl === '/internships') {
      const internships = await firestoreService.getInternships(params);
      return wrapSuccess({ internships, count: internships.length });
    }
    const internMatch = cleanUrl.match(/^\/internships\/([a-zA-Z0-9_-]+)$/);
    if (internMatch) {
      const internship = await firestoreService.getInternshipById(internMatch[1]);
      return wrapSuccess({ internship });
    }

    // 3. Applications
    if (cleanUrl === '/applications/my') {
      const applications = await firestoreService.getMyApplications(uid);
      return wrapSuccess({ applications, count: applications.length });
    }
    if (cleanUrl === '/applications') {
      const applications = await firestoreService.getAllApplications(params);
      return wrapSuccess({ applications, count: applications.length });
    }

    // 4. Courses
    if (cleanUrl === '/courses') {
      const courses = await firestoreService.getCourses(params);
      const progress = await firestoreService.getStudentProgress(uid);
      return wrapSuccess({
        courses,
        completedCourses: progress.completedCourses || [],
        learningProgress: progress.learningProgress || {},
      });
    }
    const courseMatch = cleanUrl.match(/^\/courses\/([a-zA-Z0-9_-]+)$/);
    if (courseMatch) {
      const course = await firestoreService.getCourseById(courseMatch[1]);
      const progress = await firestoreService.getStudentProgress(uid);
      return wrapSuccess({
        course,
        userProgress: progress.learningProgress?.[courseMatch[1]] || { percent: 0, completedLessons: [] },
      });
    }

    // 5. Companies
    if (cleanUrl === '/companies') {
      const companies = await firestoreService.getCompanies();
      return wrapSuccess({ companies, count: companies.length });
    }
    const compMatch = cleanUrl.match(/^\/companies\/([a-zA-Z0-9_-]+)$/);
    if (compMatch) {
      const company = await firestoreService.getCompanyById(compMatch[1]);
      return wrapSuccess({ company });
    }

    // 6. Student Dashboard & Saved
    if (cleanUrl === '/student/dashboard') {
      const [applications, saved, progress, profile, jobs] = await Promise.all([
        firestoreService.getMyApplications(uid),
        firestoreService.getSavedOpportunities(uid),
        firestoreService.getStudentProgress(uid),
        firestoreService.getUserProfile(uid),
        firestoreService.getJobs({ limit: 4 }),
      ]);
      return wrapSuccess({
        stats: {
          totalApplications: applications.length,
          savedCount: saved.length,
          completedCourses: (progress.completedCourses || []).length,
          profileCompleted: Boolean(profile?.fullName && profile?.skills?.length),
        },
        recentApplications: applications.slice(0, 5),
        recommendedJobs: jobs,
        userProgress: progress,
      });
    }

    if (cleanUrl === '/student/saved') {
      const saved = await firestoreService.getSavedOpportunities(uid);
      const allJobs = await firestoreService.getJobs();
      const allInternships = await firestoreService.getInternships();

      const savedJobs = allJobs.filter((j) => saved.some((s) => s.targetId === j.id && s.type === 'job'));
      const savedInternships = allInternships.filter(
        (i) => saved.some((s) => s.targetId === i.id && s.type === 'internship')
      );

      return wrapSuccess({
        savedJobs,
        savedInternships,
      });
    }

    // 7. Admin endpoints
    if (cleanUrl === '/admin/stats') {
      const [jobs, internships, apps, courses, students] = await Promise.all([
        firestoreService.getJobs(),
        firestoreService.getInternships(),
        firestoreService.getAllApplications(),
        firestoreService.getCourses(),
        firestoreService.getAllStudents(),
      ]);
      return wrapSuccess({
        stats: {
          totalStudents: students.length,
          totalJobs: jobs.length,
          totalInternships: internships.length,
          totalApplications: apps.length,
          totalCourses: courses.length,
          pendingApplications: apps.filter((a) => a.applicationStatus === 'Pending').length,
        },
        recentApplications: apps.slice(0, 5),
        recentStudents: students.slice(0, 5),
      });
    }

    if (cleanUrl === '/admin/students') {
      const students = await firestoreService.getAllStudents();
      return wrapSuccess({ students, count: students.length });
    }

    // 8. Notifications
    if (cleanUrl === '/notifications') {
      const notifications = await firestoreService.getUserNotifications(uid);
      const unreadCount = notifications.filter((n) => !n.read).length;
      return wrapSuccess({ notifications, unreadCount });
    }

    // 9. Resumes
    if (cleanUrl === '/resumes/my') {
      const resume = await firestoreService.getStudentResume(uid);
      return wrapSuccess({ resume });
    }

    // 10. Placement Prep & Mock Tests
    if (cleanUrl === '/prep/aptitude') {
      const aptitudeBank = [
        {
          _id: 'apt-1',
          question: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
          category: 'Quantitative',
          options: ['65 seconds', '89 seconds', '100 seconds', '150 seconds'],
          correctOption: 1,
          explanation: 'Speed = 240/24 = 10 m/s. Total distance to cross platform = 240 + 650 = 890 m. Time = 890/10 = 89 seconds.',
        },
        {
          _id: 'apt-2',
          question: 'In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written in that code?',
          category: 'Logical',
          options: ['EOJDJEFM', 'MFEDJJOE', 'MFEJDJOE', 'EOJDEJFM'],
          correctOption: 0,
          explanation: 'The first and last letters are swapped, and the intermediate letters are shifted forward by 1 in reverse order.',
        },
        {
          _id: 'apt-3',
          question: 'Choose the antonym for the word: CANDID',
          category: 'Verbal',
          options: ['Deceptive', 'Frank', 'Outspoken', 'Sincere'],
          correctOption: 0,
          explanation: 'Candid means honest and straightforward. The opposite is deceptive or misleading.',
        },
        {
          _id: 'apt-4',
          question: 'A can do a piece of work in 12 days and B in 15 days. Working together, in how many days can they complete the work?',
          category: 'Quantitative',
          options: ['6.67 days', '7 days', '8 days', '10 days'],
          correctOption: 0,
          explanation: 'Combined 1-day work = 1/12 + 1/15 = 9/60 = 3/20. Total days = 20/3 = 6.67 days.',
        },
        {
          _id: 'apt-5',
          question: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?',
          category: 'Logical',
          options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'],
          correctOption: 1,
          explanation: 'This is a division series where each number is half of the previous number: (1/4) / 2 = 1/8.',
        },
      ];
      let questions = aptitudeBank;
      if (params.category && params.category !== 'All') {
        questions = questions.filter((q) => q.category === params.category);
      }
      if (params.search) {
        questions = questions.filter((q) => q.question.toLowerCase().includes(params.search.toLowerCase()));
      }
      return wrapSuccess({ questions, count: questions.length });
    }

    if (cleanUrl === '/prep/technical') {
      const techBank = [
        {
          _id: 'tech-1',
          question: 'Explain the difference between SQL and NoSQL databases.',
          topic: 'DBMS',
          difficulty: 'Intermediate',
          shortAnswer: 'SQL is relational, table-based with fixed schemas and ACID compliance. NoSQL is document, key-value, or graph-based with dynamic schemas and high scalability.',
          detailedAnswer: 'SQL databases (like PostgreSQL, MySQL) are best for structured transactional data requiring relational integrity and ACID guarantees. NoSQL databases (like MongoDB, Firebase Firestore) store unstructured or semi-structured data, offer flexible schemas, and scale horizontally across distributed clusters effortlessly.',
          keyPoints: ['Schema: Fixed (SQL) vs Dynamic (NoSQL)', 'Scaling: Vertical (SQL) vs Horizontal (NoSQL)', 'Data Model: Tables/Rows vs JSON Documents/Key-Values'],
        },
        {
          _id: 'tech-2',
          question: 'What is the Event Loop in Node.js and JavaScript?',
          topic: 'Node.js',
          difficulty: 'Advanced',
          shortAnswer: 'The Event Loop offloads asynchronous operations to the system kernel and picks up completed callbacks from queues to execute on the single thread.',
          detailedAnswer: 'JavaScript executes code on a single thread. The Event Loop continuously checks the call stack. When the call stack is empty, it processes microtasks (Promises, process.nextTick) followed by macrotasks (setTimeout, I/O events, setInterval) across 6 distinct phases.',
          keyPoints: ['Call Stack executes synchronous code', 'Libuv thread pool handles blocking OS calls', 'Microtasks execute before regular macrotask queues'],
        },
        {
          _id: 'tech-3',
          question: 'Explain React state reconciliation and the Virtual DOM diffing algorithm.',
          topic: 'React',
          difficulty: 'Intermediate',
          shortAnswer: 'React maintains a Virtual DOM in memory. On state updates, it runs a heuristic O(n) diffing algorithm to update only the modified real DOM nodes.',
          detailedAnswer: 'React compares two Virtual DOM trees using two heuristics: (1) Elements of different types produce different trees, and (2) Keys are used to match children across renders stably. This avoids re-rendering unaffected tree branches and prevents expensive layout reflows.',
          keyPoints: ['Avoids direct full DOM tree repainting', 'Batch updates state changes in React 18', 'Keys enable efficient list item reordering'],
        },
        {
          _id: 'tech-4',
          question: 'What is the difference between TCP and UDP protocols?',
          topic: 'Computer Networks',
          difficulty: 'Beginner',
          shortAnswer: 'TCP is connection-oriented, reliable, and guarantees packet order. UDP is connectionless, fast, and does not guarantee delivery.',
          detailedAnswer: 'TCP uses a 3-way handshake (SYN, SYN-ACK, ACK) and checksum verification for guaranteed, ordered packet delivery (used by HTTP, HTTPS, FTP). UDP sends packets immediately without handshakes or retransmission, minimizing latency for live streaming and online gaming.',
          keyPoints: ['TCP: Reliable, ordered, slower (3-way handshake)', 'UDP: Unreliable, unordered, ultra-fast (datagrams)', 'Use Cases: Web browsing (TCP) vs Video streaming/Gaming (UDP)'],
        },
      ];
      let questions = techBank;
      if (params.topic && params.topic !== 'All') {
        questions = questions.filter((q) => q.topic === params.topic);
      }
      if (params.search) {
        questions = questions.filter((q) => q.question.toLowerCase().includes(params.search.toLowerCase()));
      }
      return wrapSuccess({ questions, count: questions.length });
    }

    if (cleanUrl === '/prep/hr') {
      const hrBank = [
        {
          _id: 'hr-1',
          question: 'Tell me about yourself and your background.',
          category: 'Introduction',
          tips: 'Use the Present-Past-Future formula. Highlight education, core tech stack, and why CareerBridge/this company aligns with your ambition.',
          sampleAnswer: 'I am a final-year Computer Science student passionate about full-stack web development and scalable cloud architectures. During my college coursework, I developed several full-stack applications with React and Firebase. I am excited to apply my problem-solving skills to real-world software engineering challenges here.',
          starModel: {
            situation: 'Academic journey and technical projects in university.',
            task: 'Aiming to kickstart professional software engineering career.',
            action: 'Mastered full-stack engineering, algorithms, and collaborative projects.',
            result: 'Built impactful projects and ready to contribute from day one.',
          },
        },
        {
          _id: 'hr-2',
          question: 'Describe a time when you faced a difficult challenge in a project and how you resolved it.',
          category: 'STAR Method',
          tips: 'Follow STAR strictly: Situation, Task, Action, Result. Focus heavily on YOUR individual actions and learnings.',
          sampleAnswer: 'During our college final-year capstone project, our database faced severe latency under concurrent testing. I took the lead in profiling our queries, identified unindexed collection scans, migrated slow joins to efficient cached documents, and reduced query latency by 78%.',
          starModel: {
            situation: 'Capstone project backend suffered performance bottlenecks with multiple users.',
            task: 'Diagnose and optimize database response times within a 48-hour deadline.',
            action: 'Profiled slow queries, implemented efficient compound indexes, and refactored schemas.',
            result: 'Achieved 78% latency reduction and successfully delivered a 100% stable presentation.',
          },
        },
        {
          _id: 'hr-3',
          question: 'Why should we hire you as a fresher over other candidates?',
          category: 'Behavioral',
          tips: 'Emphasize strong fundamentals, rapid learning ability, adaptability, and high genuine enthusiasm.',
          sampleAnswer: 'What sets me apart is my disciplined curiosity and hands-on grit. Beyond my curriculum, I independently build and deploy applications, stay current with modern tech stacks, and thrive in collaborative problem-solving environments.',
          starModel: {
            situation: 'Competitive fresher campus placement drive.',
            task: 'Demonstrate differentiated value beyond standard marks.',
            action: 'Demonstrated live deployed web apps, Git portfolio, and problem-solving certifications.',
            result: 'Proved continuous self-driven initiative and rapid onboarding capability.',
          },
        },
      ];
      let questions = hrBank;
      if (params.search) {
        questions = questions.filter((q) => q.question.toLowerCase().includes(params.search.toLowerCase()));
      }
      return wrapSuccess({ questions, count: questions.length });
    }

    if (cleanUrl === '/prep/mock-tests') {
      const mockTests = await firestoreService.getMockTests();
      return wrapSuccess({ mockTests });
    }
    const mockMatch = cleanUrl.match(/^\/prep\/mock-tests\/([a-zA-Z0-9_-]+)$/);
    if (mockMatch) {
      const mockTest = await firestoreService.getMockTestById(mockMatch[1]);
      return wrapSuccess({ mockTest });
    }

    // 11. Career Guidance Recommendations
    if (cleanUrl === '/guidance/recommendations') {
      const profile = await firestoreService.getUserProfile(uid);
      const jobs = await firestoreService.getJobs({ limit: 6 });
      const courses = await firestoreService.getCourses({ limit: 4 });
      return wrapSuccess({
        recommendations: [
          {
            title: 'Full Stack Web Development Career Path',
            matchedSkills: ['JavaScript', 'React', 'HTML/CSS'],
            missingSkills: ['Node.js', 'System Design'],
            targetRole: 'Full Stack Software Engineer',
            marketDemand: 'High (85,000+ Openings)',
            averageSalary: '₹8 - ₹18 LPA',
          },
          {
            title: 'Cloud DevOps & Infrastructure Track',
            matchedSkills: ['Git', 'Linux Basics'],
            missingSkills: ['Docker', 'Kubernetes', 'CI/CD Pipelines'],
            targetRole: 'DevOps & Site Reliability Engineer',
            marketDemand: 'Very High (60,000+ Openings)',
            averageSalary: '₹10 - ₹22 LPA',
          },
        ],
        suggestedJobs: jobs,
        suggestedCourses: courses,
      });
    }

    // Default fallback
    return wrapSuccess({});
  },

  post: async (url, body = {}) => {
    const cleanUrl = url.split('?')[0];
    const uid = getCurrentUid();

    // 1. Applications
    const jobAppMatch = cleanUrl.match(/^\/applications\/job\/([a-zA-Z0-9_-]+)$/);
    if (jobAppMatch) {
      const jobId = jobAppMatch[1];
      const job = await firestoreService.getJobById(jobId);
      const profile = await firestoreService.getUserProfile(uid);
      const app = await firestoreService.submitApplication({
        studentId: uid,
        studentName: profile?.fullName || auth?.currentUser?.displayName || 'Student',
        studentEmail: profile?.email || auth?.currentUser?.email || '',
        jobId,
        opportunityType: 'job',
        jobTitle: job?.jobTitle || 'Job Application',
        companyName: job?.companyName || '',
        coverLetter: body.coverLetter || '',
        resumeUrl: profile?.resumeUrl || '',
      });
      return wrapSuccess({ application: app, message: 'Application submitted successfully to Firestore!' });
    }

    const internAppMatch = cleanUrl.match(/^\/applications\/internship\/([a-zA-Z0-9_-]+)$/);
    if (internAppMatch) {
      const internshipId = internAppMatch[1];
      const intern = await firestoreService.getInternshipById(internshipId);
      const profile = await firestoreService.getUserProfile(uid);
      const app = await firestoreService.submitApplication({
        studentId: uid,
        studentName: profile?.fullName || auth?.currentUser?.displayName || 'Student',
        studentEmail: profile?.email || auth?.currentUser?.email || '',
        internshipId,
        opportunityType: 'internship',
        jobTitle: intern?.title || 'Internship Application',
        companyName: intern?.company || '',
        coverLetter: body.coverLetter || '',
        resumeUrl: profile?.resumeUrl || '',
      });
      return wrapSuccess({ application: app, message: 'Internship application submitted successfully to Firestore!' });
    }

    // 2. Save Opportunity
    const saveJobMatch = cleanUrl.match(/^\/jobs\/([a-zA-Z0-9_-]+)\/save$/);
    if (saveJobMatch) {
      const res = await firestoreService.toggleSaveOpportunity(uid, saveJobMatch[1], 'job');
      return wrapSuccess(res);
    }
    const saveInternMatch = cleanUrl.match(/^\/internships\/([a-zA-Z0-9_-]+)\/save$/);
    if (saveInternMatch) {
      const res = await firestoreService.toggleSaveOpportunity(uid, saveInternMatch[1], 'internship');
      return wrapSuccess(res);
    }

    // 3. Admin Job / Internship / Course / Company Creation
    if (cleanUrl === '/jobs') {
      const job = await firestoreService.createJob(body);
      return wrapSuccess({ job, message: 'Job created successfully in Firestore' });
    }
    if (cleanUrl === '/internships') {
      const internship = await firestoreService.createInternship(body);
      return wrapSuccess({ internship, message: 'Internship created successfully in Firestore' });
    }
    if (cleanUrl === '/courses') {
      const course = await firestoreService.createCourse(body);
      return wrapSuccess({ course, message: 'Course created successfully in Firestore' });
    }
    if (cleanUrl === '/companies') {
      const company = await firestoreService.createCompany(body);
      return wrapSuccess({ company, message: 'Company created successfully in Firestore' });
    }
    if (cleanUrl === '/notifications') {
      const notif = await firestoreService.createNotification(body);
      return wrapSuccess({ notification: notif });
    }

    // 4. Learning Progress Toggles
    const toggleCourseMatch = cleanUrl.match(/^\/courses\/([a-zA-Z0-9_-]+)\/toggle-completion$/);
    if (toggleCourseMatch) {
      const res = await firestoreService.toggleCourseCompletion(uid, toggleCourseMatch[1]);
      return wrapSuccess(res);
    }
    const toggleLessonMatch = cleanUrl.match(/^\/courses\/([a-zA-Z0-9_-]+)\/lessons\/([0-9]+)\/toggle$/);
    if (toggleLessonMatch) {
      const res = await firestoreService.toggleLessonProgress(
        uid,
        toggleLessonMatch[1],
        parseInt(toggleLessonMatch[2], 10)
      );
      return wrapSuccess(res);
    }

    // 5. Resume Builder
    if (cleanUrl === '/resumes/my') {
      const resume = await firestoreService.saveStudentResume(uid, body);
      return wrapSuccess({ resume, message: 'Resume saved to Firestore!' });
    }

    // 6. Skill Gap Analysis
    if (cleanUrl === '/guidance/skill-gap') {
      const { targetRole, currentSkills = [] } = body;
      const targetSkillsMap = {
        'Frontend Developer': ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Redux', 'Responsive Design', 'Git'],
        'Backend Developer': ['Node.js', 'Express.js', 'Database Design', 'REST APIs', 'Authentication', 'SQL'],
        'Full Stack Developer': ['React.js', 'Node.js', 'SQL/NoSQL', 'Git', 'Cloud Deployment', 'REST APIs'],
        'Data Scientist': ['Python', 'SQL', 'Pandas', 'NumPy', 'Machine Learning', 'Data Visualization'],
      };
      const required = targetSkillsMap[targetRole] || ['JavaScript', 'React.js', 'Node.js', 'Git', 'SQL'];
      const acquired = currentSkills;
      const missing = required.filter(
        (req) => !acquired.some((acq) => acq.toLowerCase().includes(req.toLowerCase()))
      );
      const matchPercentage = Math.round(((required.length - missing.length) / required.length) * 100);

      return wrapSuccess({
        analysis: {
          targetRole,
          matchPercentage,
          matchingSkills: acquired,
          missingSkills: missing,
          learningPathRecommendation: `Focus on mastering: ${missing.join(', ')} via W3Schools courses.`,
        },
      });
    }

    // 7. Mock test submission
    const mockSubmitMatch = cleanUrl.match(/^\/prep\/mock-tests\/([a-zA-Z0-9_-]+)\/submit$/);
    if (mockSubmitMatch) {
      const { answers = {} } = body;
      const test = await firestoreService.getMockTestById(mockSubmitMatch[1]);
      let score = 0;
      const total = test?.questions?.length || 5;
      if (test?.questions) {
        test.questions.forEach((q, idx) => {
          if (answers[q.id || idx] === q.correctAnswer) {
            score++;
          }
        });
      }
      return wrapSuccess({
        score,
        total,
        percentage: Math.round((score / total) * 100),
        feedback: score / total >= 0.7 ? 'Great job! You passed!' : 'Review the topics and try again!',
      });
    }

    return wrapSuccess({});
  },

  put: async (url, body = {}) => {
    const cleanUrl = url.split('?')[0];
    const uid = getCurrentUid();

    // 1. Applications Status Update (Admin)
    const appStatusMatch = cleanUrl.match(/^\/applications\/([a-zA-Z0-9_-]+)\/status$/);
    if (appStatusMatch) {
      const updated = await firestoreService.updateApplicationStatus(
        appStatusMatch[1],
        body.applicationStatus || body.status,
        body.notes || body.feedback,
        body
      );
      return wrapSuccess({ application: updated, message: 'Status updated in Firestore' });
    }

    // 2. Admin Job / Internship / Course / Company Updates
    const jobMatch = cleanUrl.match(/^\/jobs\/([a-zA-Z0-9_-]+)$/);
    if (jobMatch) {
      const updated = await firestoreService.updateJob(jobMatch[1], body);
      return wrapSuccess({ job: updated, message: 'Job updated in Firestore' });
    }

    const internMatch = cleanUrl.match(/^\/internships\/([a-zA-Z0-9_-]+)$/);
    if (internMatch) {
      const updated = await firestoreService.updateInternship(internMatch[1], body);
      return wrapSuccess({ internship: updated, message: 'Internship updated in Firestore' });
    }

    const courseMatch = cleanUrl.match(/^\/courses\/([a-zA-Z0-9_-]+)$/);
    if (courseMatch) {
      const updated = await firestoreService.updateCourse(courseMatch[1], body);
      return wrapSuccess({ course: updated, message: 'Course updated in Firestore' });
    }

    const compMatch = cleanUrl.match(/^\/companies\/([a-zA-Z0-9_-]+)$/);
    if (compMatch) {
      const updated = await firestoreService.updateCompany(compMatch[1], body);
      return wrapSuccess({ company: updated, message: 'Company updated in Firestore' });
    }

    // 3. Notifications read
    const notifMatch = cleanUrl.match(/^\/notifications\/([a-zA-Z0-9_-]+)\/read$/);
    if (notifMatch) {
      await firestoreService.markNotificationAsRead(notifMatch[1]);
      return wrapSuccess({});
    }
    if (cleanUrl === '/notifications/read-all') {
      await firestoreService.markAllNotificationsAsRead(uid);
      return wrapSuccess({});
    }

    // 4. Profile update
    if (cleanUrl === '/auth/profile') {
      const profile = await firestoreService.updateUserProfile(uid, body);
      return wrapSuccess({ profile, user: profile });
    }

    return wrapSuccess({});
  },

  delete: async (url) => {
    const cleanUrl = url.split('?')[0];

    const jobMatch = cleanUrl.match(/^\/jobs\/([a-zA-Z0-9_-]+)$/);
    if (jobMatch) {
      await firestoreService.deleteJob(jobMatch[1]);
      return wrapSuccess({ message: 'Job deleted from Firestore' });
    }

    const internMatch = cleanUrl.match(/^\/internships\/([a-zA-Z0-9_-]+)$/);
    if (internMatch) {
      await firestoreService.deleteInternship(internMatch[1]);
      return wrapSuccess({ message: 'Internship deleted from Firestore' });
    }

    const courseMatch = cleanUrl.match(/^\/courses\/([a-zA-Z0-9_-]+)$/);
    if (courseMatch) {
      await firestoreService.deleteCourse(courseMatch[1]);
      return wrapSuccess({ message: 'Course deleted from Firestore' });
    }

    const compMatch = cleanUrl.match(/^\/companies\/([a-zA-Z0-9_-]+)$/);
    if (compMatch) {
      await firestoreService.deleteCompany(compMatch[1]);
      return wrapSuccess({ message: 'Company deleted from Firestore' });
    }

    const studentMatch = cleanUrl.match(/^\/admin\/students\/([a-zA-Z0-9_-]+)$/);
    if (studentMatch) {
      await firestoreService.deleteStudentAccount(studentMatch[1]);
      return wrapSuccess({ message: 'Student account deleted from Firestore' });
    }

    return wrapSuccess({});
  },
};

export default API;
