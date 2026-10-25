# GEMINI.md — Office Attendance Management System

## 1. Project Overview

**Project Name:** Office Attendance Management System

**Purpose:** Develop a web-based office attendance application where employees check in and check out by scanning QR codes. The application records attendance timestamps, validates employee location against the configured office location, and provides administration, employee management, attendance tracking, permissions, and reporting features.

### Core Requirements

- QR-based employee check-in and check-out.
- Office location and permitted-distance validation.
- Centralized authentication and user permissions.
- Role-based access for administrators, managers, and employees.
- Employee and user management.
- Attendance history, monitoring, and reporting.
- Consistent, reusable, and maintainable frontend and backend architecture.

Follow the approved project scope. Do not implement additional modules without authorization.

---

## 2. Mandatory Instructions Before Every Task

Before starting any task:

1. Read this entire `GEMINI.md` file.
2. Inspect the existing project structure and relevant source files.
3. Understand the existing implementation, component patterns, API calls, authentication flow, permissions, and database relationships.
4. Identify which files need to be created or modified.
5. Reuse existing components, functions, hooks, utilities, and API services wherever possible.
6. Follow the existing architecture and naming conventions.
7. Make the smallest complete change necessary to satisfy the request.
8. Test the changes and report the results accurately.

Never assume that a file, component, API endpoint, database table, or function exists without checking.

If a requirement is ambiguous or could cause destructive changes, ask for clarification before proceeding.

---

## 3. Technology Stack

### Frontend

- React.js
- Vite
- JavaScript and JSX
- React Router for routing
- SCSS/CSS for styling
- Axios for API communication
- React Context API for centralized authentication state

Use existing libraries already installed in the project. Do not introduce new dependencies without a clear requirement.

### Backend

- Node.js
- Express.js
- REST APIs
- A database selected for the project
- Authentication and authorization middleware

Inspect the actual project configuration before assuming a database, authentication library, or other dependency.

---

## 4. Mandatory Frontend Folder Structure

Follow this structure for the frontend:

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── forms/
│   │   ├── data-display/
│   │   └── protected/
│   │
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── employee/
│   │   ├── attendance/
│   │   ├── qr-code/
│   │   ├── office/
│   │   ├── leave/
│   │   ├── reports/
│   │   ├── user-management/
│   │   ├── settings/
│   │   └── audit-logs/
│   │
│   ├── context/
│   │   └── auth.js
│   │
│   ├── app-navigation/
│   │   ├── app-routes.js
│   │   ├── app-navigation.js
│   │   └── route-permissions.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── auth-api.js
│   │   ├── employee-api.js
│   │   ├── attendance-api.js
│   │   └── report-api.js
│   │
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── package.json
└── vite.config.js
```

This is the target organization, not permission to move or rename existing files unnecessarily. Inspect the current repository first and preserve working code.

### 4.1 Components

The `src/components/` directory contains reusable components shared across multiple modules.

Examples:

- Header
- Sidebar
- MainLayout
- AuthLayout
- PageTitle
- Loading indicators
- Confirmation dialogs
- Reusable forms
- Tables and data grids
- ProtectedRoute
- PermissionGuard

Rules:

- Create shared components only when reuse is justified.
- Keep module-specific components inside their respective page module.
- Avoid duplicate components with the same responsibility.
- Do not place all application logic inside shared UI components.

### 4.2 Pages and Module Organization

The `src/pages/` directory must contain feature-based modules.

Each module should organize its pages and related files together.

Example:

```text
pages/
└── employee/
    ├── EmployeeList/
    │   ├── EmployeeList.jsx
    │   ├── EmployeeList.scss
    │   ├── employeeList.js
    │   └── components/
    │       ├── EmployeeGrid.jsx
    │       └── EmployeeFilter.jsx
    │
    ├── EmployeeForm/
    │   ├── EmployeeForm.jsx
    │   ├── EmployeeForm.scss
    │   └── employeeForm.js
    │
    └── EmployeeDetails/
        ├── EmployeeDetails.jsx
        └── employeeDetails.js
```

Apply this pattern to other modules when appropriate.

Responsibilities:

- `.jsx`: UI and component composition.
- `.scss` or `.css`: styles specific to the page or component.
- `.js`: page-specific logic, event handlers, data loading, and helper functions, following existing conventions.
- `components/`: components used exclusively by that page.

If a module becomes complex, separate its API functions, custom hooks, validation schemas, and utilities into dedicated files or subdirectories.

Do not create empty folders or unnecessary files just to match the template.

### 4.3 Authentication Context — `src/context/auth.js`

The authentication context is the central frontend source of truth for the current authenticated session.

It should expose, as appropriate:

- Authenticated user information.
- User ID and profile details.
- User role.
- Normalized module permissions and action permissions.
- Authentication status.
- Initial loading status.
- Login function.
- Logout function.
- Authenticated user refresh function.
- Permission-checking helpers, if not better placed in a shared permission utility.

Example conceptual structure:

```javascript
{
  user: null,
  permissions: [],
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {}
}
```

This is an illustrative interface, not production implementation. Match the actual user and permission models used by the backend.

Rules:

1. Load user and permission data through the established authentication mechanism.
2. Normalize permission data consistently.
3. Avoid duplicate sources of truth for the logged-in user.
4. Handle loading, expired sessions, failed requests, and logout correctly.
5. Do not store passwords or sensitive credentials in React context.
6. Do not assume that local storage is secure or that frontend permissions enforce security.
7. Do not fetch the same user and permission data independently in every component.
8. The backend must independently authorize all protected operations.

### 4.4 Application Navigation

Keep navigation and route definitions in `src/app-navigation/`.

#### `app-routes.js`

Responsibilities:

- Define application route paths.
- Associate routes with page components.
- Define public and protected routes.
- Attach required permission metadata where appropriate.
- Support nested layouts if required.

#### `app-navigation.js`

Responsibilities:

- Define sidebar menu items.
- Organize menus and submenus.
- Associate navigation entries with route paths.
- Define the permission metadata needed to display each menu item.

#### `route-permissions.js`

Responsibilities:

- Centralize route-to-permission mappings where useful.
- Define consistent permission identifiers.
- Avoid repeating permission strings throughout unrelated components.

Rules:

- Do not duplicate route definitions across multiple files.
- Keep route registration separate from sidebar rendering.
- Ensure that every protected route is actually guarded.
- Use a consistent permission naming convention.
- Filter navigation using authenticated user permissions.
- A hidden menu item must not be treated as sufficient security.
- Do not grant access by default when permissions are missing or fail to load.

---

## 5. Frontend Coding Standards

### React Components

- Use functional React components and hooks.
- Keep components focused on a clear responsibility.
- Use descriptive component, variable, and function names.
- Follow the established import and export conventions.
- Avoid unnecessary re-renders and duplicated state.
- Keep JSX readable and avoid unnecessarily large components.
- Extract complex reusable logic into custom hooks when appropriate.

### API Integration

- Use the centralized Axios configuration in `services/api.js`.
- Keep endpoint-specific functions in the appropriate API service.
- Do not duplicate Axios configuration in individual components.
- Follow the established request and response formats.
- Handle loading states, API errors, and failed requests.
- Prevent duplicate submissions where appropriate.
- Do not hardcode production URLs or credentials.

### Styling

- Follow the existing styling framework and naming conventions.
- Reuse common layout and form styles.
- Keep page-specific styling near the corresponding page.
- Build responsive interfaces for desktop, tablet, and mobile.
- Avoid unrelated UI redesigns.
- Maintain consistent spacing, typography, colors, and interaction states.

### Forms and Data Grids

- Reuse existing form controls, validators, filters, tables, and pagination components.
- Validate inputs before submission and handle backend validation errors.
- Provide appropriate loading, empty, success, and error states.
- Keep filtering, sorting, and pagination behavior consistent across modules.

---

## 6. Mandatory Backend Folder Structure

Follow a modular, layered backend architecture.

```text
backend/
├── src/
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeds/
│   ├── middleware/
│   ├── modules/
│   │   ├── auth/
│   │   ├── employees/
│   │   ├── attendance/
│   │   ├── qr-codes/
│   │   ├── offices/
│   │   ├── reports/
│   │   ├── leave/
│   │   ├── users/
│   │   ├── audit-logs/
│   │   └── settings/
│   ├── jobs/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── .env.example
└── package.json
```

Each module should contain only the files it requires.

Example:

```text
modules/attendance/
├── attendance.routes.js
├── attendance.controller.js
├── attendance.service.js
├── attendance.repository.js
├── attendance.validation.js
└── attendance.constants.js
```

Responsibilities:

- Routes: define endpoints and middleware.
- Controllers: process HTTP requests and responses.
- Services: implement business rules.
- Repositories: handle database access.
- Validation: validate request data.
- Constants: maintain module-specific statuses and constants.

Keep controllers thin. Do not put complex business logic or large database queries directly into controllers.

Use the established database access pattern. Do not introduce a repository abstraction where the existing project does not need one without a clear benefit.

### Backend Security

- Authenticate protected requests.
- Enforce role and action permissions on the server.
- Validate and sanitize incoming data.
- Use parameterized queries or safe ORM operations.
- Keep secrets in environment variables.
- Apply appropriate rate limits to sensitive endpoints.
- Handle errors without exposing internal stack traces to clients.
- Use transactions when multiple database operations must succeed together.
- Add audit logging for important administrative and attendance actions.
- Avoid exposing sensitive employee data unnecessarily.

---

## 7. Attendance Business Rules

These are baseline design constraints. Exact operational policies must be confirmed in the approved business requirements.

### Check-In and Check-Out

- Associate attendance with the authenticated employee.
- Use server-generated timestamps as the authoritative record of event time.
- Prevent duplicate or invalid attendance transitions.
- Handle missed check-outs according to the configured policy.
- Record attendance events consistently.
- Maintain an auditable history of corrections.

### QR Code Validation

- Validate QR codes on the backend.
- Do not trust a QR value solely because it was scanned by the frontend.
- Consider expiry, revocation, replay prevention, and duplicate submissions.
- Do not assume that scanning a static QR code proves the employee is physically present.
- Use additional verification where required by the approved security design.

### Office Location

- Keep office coordinates and permitted distance limits configurable.
- Calculate geographical distance on the backend.
- Validate coordinates and handle unavailable or inaccurate location data.
- Do not treat browser-provided GPS coordinates as inherently trustworthy.
- Request location permission where necessary.
- Apply a consistent configured timezone for attendance display and reporting.

### Attendance Permissions

- Employees should access their own attendance records by default.
- Managers and administrators should only access data permitted by their assigned roles and permissions.
- All sensitive operations must be authorized on the backend.

---

## 8. Database and Configuration Rules

- Inspect the current database and schema before changes.
- Use the project's existing database and query technology.
- Keep database connection configuration in `config/`.
- Use migrations or the established schema-management process.
- Preserve existing data and relationships.
- Avoid destructive migrations without explicit approval.
- Use `.env.example` for placeholder configuration names only.
- Never commit actual passwords, tokens, database credentials, or secret keys.
- Keep frontend environment variables free of secrets because frontend variables may be exposed in the browser.

---

## 9. Naming Conventions

Follow existing repository conventions wherever they differ from these defaults.

Recommended defaults:

- React components: `PascalCase.jsx`
- Component styles: `ComponentName.scss`
- Page-specific logic: `camelCase.js`
- Hooks: `useFeatureName.js`
- Context: `auth.js`
- API service files: `feature-api.js`
- Route definitions: `app-routes.js`
- Navigation definitions: `app-navigation.js`
- Backend modules: descriptive module names.
- Backend functions and variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE` where appropriate.

Use consistent names for permission identifiers, API endpoints, statuses, and database fields.

---

## 10. Rules for Modifying Existing Code

- Inspect the target file and its dependencies before editing.
- Follow the established implementation patterns.
- Prefer small, focused changes.
- Preserve existing behavior unless a requirement explicitly changes it.
- Avoid duplicating components, API functions, hooks, and utilities.
- Do not modify unrelated modules.
- Do not delete files or overwrite user changes without approval.
- Do not introduce mock data into production flows unless explicitly requested.
- Do not create unnecessary abstractions or overly complicated folder structures.
- Update imports, route definitions, permission mappings, and tests when affected.
- If the existing architecture conflicts with these guidelines, explain the conflict and propose the smallest safe adjustment.

---

## 11. Testing and Verification

After implementation:

1. Check the changed files and their imports.
2. Run the available linting and type checks.
3. Run relevant frontend or backend build commands.
4. Run relevant unit and integration tests.
5. Verify affected API contracts and authorization paths where practical.
6. Check important validation and failure scenarios.
7. Fix implementation-related issues before reporting completion.
8. Clearly report any checks that could not be run.

Never claim a build or test passed unless it was actually executed successfully.

---

## 12. Required Final Response

After every coding task, provide a concise report containing:

### Changes Made
Summarize the completed functionality.

### Files Created or Modified
List the files and explain the reason for each change.

### Business Logic
Explain any important validation, permission, or behavior changes.

### Testing
List the checks actually executed and their results.

### Pending Items
Mention unresolved issues, assumptions, configuration requirements, or follow-up work.

Do not claim that incomplete work is complete.

---

## 13. Priority Rules

When instructions conflict, prioritize:

1. Explicit requirements in the current task.
2. Security, data integrity, and approved business rules.
3. Existing project conventions and compatibility.
4. The architectural standards defined in this file.
5. Maintainability and code quality.

Do not silently override business rules or make destructive changes to resolve conflicts.

**Mandatory workflow: Read → Inspect → Plan → Implement → Verify → Report.**

Follow this workflow for every task throughout the project.