# CareerBridge – Student Career Portal

> **"Connecting Students to Their Future."**

**CareerBridge** is a modern, responsive, full-stack student career portal built with **React (Vite)**, **Firebase Authentication**, and **Cloud Firestore**. It unites full-time job postings, summer/winter internships, skill development tracks, placement preparation, interactive ATS resume building, and candidate application tracking into one platform.

---

## 🔥 Database & Authentication Architecture: Firebase

CareerBridge is fully migrated from MongoDB to **Firebase**:
- **Authentication:** Firebase Authentication (Email/Password registration, Login, Password Reset, and secure role-based authorization).
- **Database:** Google Cloud Firestore (Real-time NoSQL document database).
- **Security:** `firestore.rules` enforces user-scoped data protection and admin-only management.

### Firestore Collections Schema

1. **`users`**
   - `uid` (string, document ID)
   - `fullName` (string)
   - `email` (string)
   - `phone` (string)
   - `education` (`{ college, degree, branch, year, cgpa }`)
   - `skills` (array of strings)
   - `role` (`'student'` | `'admin'`)
   - `createdAt` (timestamp)

2. **`jobs`**
   - `jobTitle` (string)
   - `companyName` (string)
   - `location` (string)
   - `description` (string)
   - `eligibility` (string)
   - `requiredSkills` (array of strings)
   - `applicationLink` (string)
   - `jobType` (string)
   - `salary` (string)
   - `createdAt` (timestamp)

3. **`internships`**
   - `title` (string)
   - `company` (string)
   - `duration` (string)
   - `stipend` (string)
   - `description` (string)
   - `eligibility` (string)
   - `location` (string)
   - `requiredSkills` (array of strings)
   - `createdAt` (timestamp)

4. **`applications`**
   - `studentId` (string, Firebase UID)
   - `jobId` / `internshipId` (string)
   - `opportunityType` (`'job'` | `'internship'`)
   - `jobTitle` (string)
   - `companyName` (string)
   - `coverLetter` (string)
   - `applicationStatus` (`'Pending'` | `'Under Review'` | `'Shortlisted'` | `'Accepted'` | `'Rejected'`)
   - `appliedAt` (timestamp)

5. **`courses`**
   - `courseName` (string)
   - `category` (string: Web Development, Programming Languages, Database, Cloud/DevOps)
   - `description` (string)
   - `difficulty` (string: Beginner, Intermediate, Advanced)
   - `tutorialUrl` (string: official W3Schools link)
   - `lessons` (array of lesson topics and URLs)

6. **`studentProgress`**
   - `studentId` (string, document ID = student UID)
   - `completedCourses` (array of course IDs)
   - `learningProgress` (map of course progress percent and completed lessons)
   - `updatedAt` (timestamp)

---

## 🛠️ Firebase Setup Instructions

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/).
   - Click **Add project** and name it (e.g. `careerbridge-portal`).
2. **Enable Authentication:**
   - In Firebase Console, go to **Build ➔ Authentication**.
   - Click **Get Started**, choose **Email/Password**, and enable it.
3. **Enable Cloud Firestore:**
   - In Firebase Console, go to **Build ➔ Firestore Database**.
   - Click **Create database**, choose your preferred server location, and start in **Production mode** (or test mode).
   - In the **Rules** tab, paste the contents of `firestore.rules`.
4. **Register Web App & Copy Configuration:**
   - In Project Settings ➔ General ➔ **Your apps**, click the Web (`</>`) icon.
   - Copy the `firebaseConfig` credentials and paste them into `frontend/.env`:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=careerbridge-portal.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=careerbridge-portal
   VITE_FIREBASE_STORAGE_BUCKET=careerbridge-portal.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=1:...:web:...
   ```

---

## 🚀 Running the Project

### Frontend (React + Vite + Firebase)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Backend (Lightweight Express Health Server)
```bash
cd backend
npm install
npm start
```
Runs on [http://localhost:5050](http://localhost:5050).

---

## 🌟 Key Features

### 1. Modern Student & Placement Officer UI
- **Design Theme:** Dark Blue (`#0f172a`), Purple (`#7c3aed`), Sky Blue (`#0284c7`), and Light Gray (`#f8fafc`).
- **Typography & Icons:** Plus Jakarta Sans & Inter with Lucide React icons.
- **Responsive Layout:** Optimized for mobile phones, tablets, and desktop displays.
- **One-Click Demo Logins:** Instant test login for Student and Administrator roles.

### 2. Main Modules
- **Home Landing Page:** Hero section, recruiter showcase, featured jobs & internships, 8 skill development categories, placement prep highlights, and student testimonials.
- **Student Authentication & Profiles:** Secure JWT authentication, bcrypt password hashing, student registration with college degree, branch, year, skills, and profile completion score calculator (0–100%).
- **Personalized Student Dashboard:** Welcome hero banner, profile completion meter, personalized job & internship recommendations based on student skills, applications counters, saved bookmarks counter, upcoming campus placement events, and course progress meters.
- **Job Portal:** Search by title/company, filter by workplace mode (Remote/On-site/Hybrid), employment type, and salary. View detailed criteria and apply with attached resume & cover note.
- **Internship Module:** Filter by duration (3 months / 6 months), stipend, and remote mode.
- **Subject-Wise Learning Module (W3Schools Integration):** 17+ official tutorial subjects across 4 categories (Programming Languages, Web Development, Database Management, Other Technical Subjects). Features direct "Start Learning" buttons opening verified W3Schools tutorials in a new tab, and single-click "Mark as Completed" with persistent MongoDB tracking and live progress meters.
- **Career Guidance & Skill Gap Analyzer:** Interactive analyzer that evaluates student profile skills against top industry roles (Full Stack Web Developer, Data Scientist & AI Specialist, Cloud & DevOps, Cyber Security Analyst, Backend Architect, Mobile Specialist), calculates % match, reveals acquired vs missing skills, and provides direct W3Schools course bridges to close the gap.
- **Interactive ATS Resume Builder:** Live split-screen preview, editable personal info, career objective, education, skills, projects, internships, certifications, and achievements. Switch between **Modern**, **Classic**, and **Minimalist** templates. Download ATS-friendly vector PDF with one click.
- **Placement Preparation Hub:**
  1. **Aptitude Practice:** Quantitative Aptitude, Logical Reasoning, and Verbal Ability with step-by-step formula derivations.
  2. **Technical Interview Q&A:** Java, Python, C, Data Structures & Algorithms, DBMS, and Operating Systems with formatted code snippets.
  3. **HR Interview Guide:** Behavioral questions, STAR method frameworks, sample candidate answers, and recruiter evaluation checklists.
  4. **Diagnostic Mock Tests:** Timed assessments (e.g., 20-min countdown timer), question navigation grid, automatic submission upon timeout, celebratory confetti upon passing, accuracy breakdown, and full solution review.
- **Company Directory:** Showcase of hiring enterprises (Google, Microsoft, Amazon, Razorpay, Zomato, TCS) with open positions count, ratings, and company profiles.
- **Application Tracking System (ATS):** Track applications across 6 stages: `Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Interview Scheduled` (with video meeting link & scheduled time) ➔ `Selected` ➔ `Rejected` with historical audit timestamps.
- **Notification System:** Real-time bell counter dropdown and dedicated page for application updates, event announcements, and recruiter alerts.
- **Admin Hub & Management Dashboard:**
  - Overview metrics: registered students count, active jobs, internships, applications count, and candidate pipeline distribution.
  - Full CRUD operations for Jobs, Internships, and Companies.
  - Candidate status updater with interview scheduling and automated candidate notifications.
  - Registered students directory with search and delete options.
  - Broadcast announcement sender to all campus students.

---

### 3. Subject-Wise Learning Module (Official W3Schools Integration)
CareerBridge features a dedicated learning portal connected to official W3Schools tutorials with persistent single-click completion tracking stored in MongoDB:

| Category | Subject | Official Tutorial Link | Key Competencies |
|---|---|---|---|
| **Programming Languages** | C | [w3schools.com/c/](https://www.w3schools.com/c/) | Pointers, Memory Management, Functions |
| **Programming Languages** | C++ | [w3schools.com/cpp/](https://www.w3schools.com/cpp/) | OOP, Classes, Inheritance, STL |
| **Programming Languages** | Python | [w3schools.com/python/](https://www.w3schools.com/python/) | Collections, Lambdas, File I/O, Modules |
| **Programming Languages** | Java | [w3schools.com/java/](https://www.w3schools.com/java/) | Enterprise OOP, Collections Framework, Multithreading |
| **Programming Languages** | JavaScript | [w3schools.com/js/](https://www.w3schools.com/js/) | ES6+, DOM Manipulation, Async/Await, Fetch |
| **Programming Languages** | PHP | [w3schools.com/php/](https://www.w3schools.com/php/) | Server-Side Scripting, Forms, Sessions, MySQL |
| **Web Development** | HTML | [w3schools.com/html/](https://www.w3schools.com/html/) | Semantic HTML5, Forms, Media, Accessibility |
| **Web Development** | CSS | [w3schools.com/css/](https://www.w3schools.com/css/) | Flexbox, CSS Grid, Responsive Design, Animations |
| **Web Development** | Bootstrap | [w3schools.com/bootstrap5/](https://www.w3schools.com/bootstrap5/) | 12-Column Grid, Utility Classes, Modals, Cards |
| **Web Development** | React.js | [w3schools.com/react/](https://www.w3schools.com/react/) | JSX, Components, Hooks (`useState`, `useEffect`) |
| **Web Development** | SQL | [w3schools.com/sql/](https://www.w3schools.com/sql/) | SELECT, JOINs, GROUP BY, Aggregations, Subqueries |
| **Database Management** | MySQL | [w3schools.com/mysql/](https://www.w3schools.com/mysql/) | RDBMS, Indexing, Foreign Keys, Stored Procedures |
| **Database Management** | MongoDB | [w3schools.com/mongodb/](https://www.w3schools.com/mongodb/) | Document Storage, Aggregation Pipelines, Indexes |
| **Database Management** | PostgreSQL | [w3schools.com/postgresql/](https://www.w3schools.com/postgresql/) | Advanced SQL, JSONB, Window Functions, ACID |
| **Other Technical Subjects** | Data Structures | [w3schools.com/dsa/](https://www.w3schools.com/dsa/) | Arrays, Linked Lists, Stacks, Trees, Graphs, Big-O |
| **Other Technical Subjects** | Machine Learning | [w3schools.com/python/python_ml_getting_started.asp](https://www.w3schools.com/python/python_ml_getting_started.asp) | Regression, Decision Trees, Train/Test Split |
| **Other Technical Subjects** | Cyber Security | [w3schools.com/cybersecurity/](https://www.w3schools.com/cybersecurity/) | CIA Triad, Cryptography, Network Defense |
| **Other Technical Subjects** | Git and GitHub | [w3schools.com/git/](https://www.w3schools.com/git/) | Branching, Merge Conflicts, Remote Repos, PRs |

---

## 🛠️ Technology Stack

- **Frontend:**
  - React 18 with Vite
  - React Router DOM v6
  - Axios (configured with Authorization interceptors)
  - Lucide React (crisp SVG iconography)
  - Canvas Confetti (celebration animations)
  - Custom CSS Design System with responsive grid and print styling
- **Backend:**
  - Node.js & Express.js
  - RESTful architecture with error handling middleware
  - JWT Authentication (`jsonwebtoken`) & password hashing (`bcryptjs`)
  - Role-based access control (Student vs. Admin)
- **Database:**
  - MongoDB & Mongoose
  - Zero-configuration embedded MongoDB fallback for instant local development
  - Ready for MongoDB Atlas via `.env` connection string
  - Automated database seeder with realistic test data

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (tested on Node v24)
- npm or pnpm

---

### Step 1: Backend Setup & Startup

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Dependencies are already configured in `package.json`. If needed:
   ```bash
   npm install
   ```

3. Review or customize environment variables in `backend/.env`:
   ```env
   PORT=5050
   NODE_ENV=development
   # Optional: Paste your MongoDB Atlas URI below. If left blank, CareerBridge
   # automatically boots embedded in-memory MongoDB with pre-seeded data!
   MONGODB_URI=
   JWT_SECRET=careerbridge_super_secure_jwt_secret_key_2026_change_in_production
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm run dev
   # or: node server.js
   ```

   *The server will boot on `http://localhost:5050`, initialize database connections, and automatically seed all demo jobs, internships, questions, and accounts.*

---

### Step 2: Frontend Setup & Startup

1. Open a second terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. If needed, install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔑 Pre-Seeded Demo Credentials

You can log in manually or use the one-click autofill buttons on the login page:

| Role | Email | Password | Access |
|---|---|---|---|
| **Student** | `student@careerbridge.com` | `student123` | Student Dashboard, Applications, Saved Items, Resume Builder, Mock Tests, Profile |
| **Administrator** | `admin@careerbridge.com` | `admin123` | Admin Hub, Job CRUD, Internship CRUD, Company Management, Candidate Pipeline, Broadcasts |

---

## 📂 Project Structure

```
CareerBridge/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & MongoDB Atlas/embedded fallback
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile updates
│   │   ├── studentController.js  # Dashboard metrics & skill-based recommendations
│   │   ├── jobController.js      # Job CRUD & bookmarks
│   │   ├── internshipController.js # Internship CRUD & bookmarks
│   │   ├── applicationController.js # ATS submission & status transitions
│   │   ├── resumeController.js   # Live resume persistence & retrieval
│   │   ├── courseController.js   # Skill tracks & lesson completion
│   │   ├── prepController.js     # Aptitude, Technical, HR & Mock Tests
│   │   ├── companyController.js  # Employer directory CRUD
│   │   ├── notificationController.js # Broadcasts & student alerts
│   │   ├── guidanceController.js     # Career guidance & skill gap analyzer
│   │   └── adminController.js    # Overall statistics & student management
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role authorization
│   │   └── errorMiddleware.js    # Centralized API error handling
│   ├── models/                   # 14 Mongoose Models
│   │   ├── User.js
│   │   ├── StudentProfile.js
│   │   ├── Job.js
│   │   ├── Internship.js
│   │   ├── Application.js
│   │   ├── Company.js
│   │   ├── Resume.js
│   │   ├── Course.js             # Subjects with W3Schools URLs & progress tracking
│   │   ├── CareerRecommendation.js # Career pathways & roadmaps
│   │   ├── Skill.js              # Technical skills catalog
│   │   ├── MockTest.js
│   │   ├── AptitudeQuestion.js
│   │   ├── TechnicalQuestion.js
│   │   ├── HRQuestion.js
│   │   ├── Notification.js
│   │   └── SavedOpportunity.js
│   ├── routes/                   # Express Routers
│   │   ├── guidanceRoutes.js     # /api/guidance endpoints
│   │   └── ...                   # all resource routes
│   ├── utils/
│   │   ├── seedData.js           # Comprehensive sample data
│   │   └── seeder.js             # Database seeder utility
│   ├── .env                      # Environment variables
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Main Express server entry point
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # CareerBridge brand icon
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── InternshipCard.jsx
│   │   │   ├── CompanyCard.jsx
│   │   │   ├── ResumePreview.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── NotificationDropdown.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/                # All 28 portal views
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── Internships.jsx
│   │   │   ├── InternshipDetails.jsx
│   │   │   ├── LearnCourses.jsx      # Subject-Wise Learning & W3Schools links
│   │   │   ├── CareerGuidance.jsx    # Skill Gap Analyzer & Career Roadmaps
│   │   │   ├── ResumeBuilder.jsx
│   │   │   ├── SkillDevelopment.jsx
│   │   │   ├── CourseDetails.jsx
│   │   │   ├── PlacementPrep.jsx
│   │   │   ├── AptitudePractice.jsx
│   │   │   ├── TechnicalInterview.jsx
│   │   │   ├── HRInterview.jsx
│   │   │   ├── MockTestList.jsx
│   │   │   ├── MockTestRunner.jsx
│   │   │   ├── CompanyDirectory.jsx
│   │   │   ├── CompanyDetails.jsx
│   │   │   ├── ApplicationsTracker.jsx
│   │   │   ├── SavedOpportunities.jsx
│   │   │   ├── StudentProfile.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminJobs.jsx
│   │   │   ├── AdminInternships.jsx
│   │   │   ├── AdminCourses.jsx      # Admin Course & Subject CRUD
│   │   │   ├── AdminApplications.jsx
│   │   │   ├── AdminCompanies.jsx
│   │   │   ├── AdminStudents.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── styles/
│   │   │   └── index.css         # Modern design tokens & print styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 📄 License
ISC © CareerBridge Team
