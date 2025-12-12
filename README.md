# 🍴 Spark!Bytes - BU Food Finder

**Spark!Bytes** is a Next.js web application designed to connect Boston University students with local event vendors who have leftover food from campus events. Vendors can post their events and list any extra food available, while students can browse, reserve, and pick up food within designated time frames — reducing waste and building community.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Requirements & Fit](#-requirements--fit)
3. [Architecture](#-architecture)
4. [Security](#-security)
5. [Development Process](#-development-process)
6. [Tools & Technologies](#-tools--technologies)
7. [Project Structure](#-project-structure)
8. [API Documentation](#-api-documentation)
9. [Getting Started](#-getting-started)
10. [Testing Plan](#-testing-plan)
11. [Documentation Plan](#-documentation-plan)
12. [Team Organization](#-team-organization)
13. [Future Enhancements](#-future-enhancements)

---

## 🚀 Features

### 👩‍🍳 For Vendors/Organizers

- **Vendor Onboarding**: Complete application process with admin approval workflow
- **Event Management**: 
  - Create events with comprehensive details (name, location, time, category, dietary tags)
  - Add multiple food items per event with portion limits
  - Address autocomplete for accurate location input
  - Geocoding integration for map display
- **Reservation Management**: 
  - View all reservations for their events
  - Mark reservations as "picked_up" or "incomplete"
  - Close events early when food runs out
- **Event History**: View both current and past events
- **Profile Management**: Update organization information

### 🎓 For Students

- **Authentication**: Secure sign-up and login using Supabase with BU email validation
- **Event Discovery**: 
  - Browse all active and upcoming campus events with available food
  - View events in both list and interactive map views
  - Real-time filtering and search capabilities
- **Advanced Search & Filtering**:
  - Search by event name or food item
  - Filter by dietary restrictions (Vegetarian, Vegan, Halal, Gluten-Free, Dairy-Free, Nut-Free)
  - Filter by location (Central Campus, GSU, East Campus, West Campus, Fenway Campus)
  - Filter by availability status
  - Sort by newest, ending soon, or available soon
- **Interactive Map View**: 
  - Mapbox-powered 3D map with dynamic lighting
  - Visual markers for all active events
  - Popup details with event information
  - Automatic bounds fitting for multiple events
- **Food Reservations**: 
  - Reserve portions of leftover food
  - View real-time availability and capacity
  - Per-student and total portion limits enforced
  - View reservation history
- **Profile Management**: Update student profile information

### 👨‍💼 For Admins

- **Vendor Approval Workflow**: 
  - Review pending organizer applications
  - Approve or reject vendor applications
  - Revoke organizer privileges
- **Vendor Management**: 
  - View all approved organizers
  - Monitor active vendor accounts
- **Access Control**: Admin-only routes with role-based protection

### 🧭 For Everyone

- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Real-time Updates**: Automatic refresh on window focus
- **Role-based Interfaces**: Dynamic UI based on user role
- **Modern UI/UX**: Clean, intuitive design with smooth animations

---

## ✅ Requirements & Fit

### Identified Requirements

1. **Primary Goal**: Connect BU students with event vendors to reduce food waste
2. **User Roles**: Support for students, vendors/organizers, and administrators
3. **Event Management**: Vendors need to create and manage event listings
4. **Food Tracking**: Track available food items with portion limits
5. **Reservation System**: Students need to reserve food portions
6. **Location Services**: Map-based discovery of nearby events
7. **Search & Discovery**: Students need to find relevant events quickly
8. **Access Control**: Secure authentication and authorization
9. **Approval Workflow**: Admin oversight for vendor applications

### Implementation Status

| Requirement | Status | Implementation Details |
|------------|--------|----------------------|
| Student Authentication | ✅ Complete | Supabase Auth with BU email validation |
| Vendor Onboarding | ✅ Complete | Application form with admin approval |
| Event Creation | ✅ Complete | Full event creation with food items |
| Food Reservation | ✅ Complete | Capacity tracking and limits |
| Map View | ✅ Complete | Mapbox 3D map with markers |
| Search & Filtering | ✅ Complete | Multi-criteria filtering system |
| Admin Dashboard | ✅ Complete | Approval and management interface |
| Role-based Access | ✅ Complete | Middleware and API route protection |
| Real-time Updates | ✅ Complete | Auto-refresh on focus |
| Responsive Design | ✅ Complete | Mobile-friendly Tailwind CSS |

---

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **Next.js 16.0.0** (App Router)
  - Server Components for data fetching
  - Client Components for interactivity
  - API Routes for backend functionality
  - Middleware for route protection
- **React 19.2.0**: Component-based UI architecture
- **TypeScript 5**: Type safety across the application
- **Tailwind CSS 4**: Utility-first styling framework
- **Mapbox GL 3.17.0**: Interactive mapping with 3D buildings

#### Backend
- **Next.js API Routes**: RESTful API endpoints
- **Supabase**: 
  - PostgreSQL database
  - Authentication service
  - Row Level Security (RLS) policies
  - Real-time subscriptions (available but not extensively used)

#### Authentication & Authorization
- **Supabase Auth**: 
  - PKCE flow for OAuth
  - Email/password authentication
  - Session management with cookies
- **Role-based Access Control**: 
  - Roles stored in `profiles.roles` array
  - Middleware-based route protection
  - API route authorization checks

#### External Services
- **Mapbox**: Geocoding and map rendering
- **Supabase**: Database and authentication

### Architectural Patterns

#### 1. Server-Side Rendering (SSR)
- Admin pages use Server Components for secure data fetching
- Protected routes check authentication server-side
- Example: `/app/admin/page.tsx` fetches data before rendering

#### 2. Client-Side Rendering (CSR)
- Interactive pages use Client Components
- Real-time updates and user interactions
- Example: `/app/student/page.tsx` with map and filters

#### 3. API Route Pattern
- RESTful endpoints in `/app/api/`
- Consistent error handling
- Authentication checks on every route
- Example: `/app/api/events/route.ts`

#### 4. Middleware Pattern
- Route protection at the edge
- Role-based redirects
- Session refresh handling
- Example: `/middleware.ts`

#### 5. Component Composition
- Reusable UI components
- Separation of concerns
- Props-based communication
- Example: `/app/student/components/`

### Database Schema (Inferred)

**Tables:**
- `profiles`: User profiles with roles array
- `vendor_profiles`: Vendor/organizer information
- `organizer_applications`: Pending vendor applications
- `events`: Event listings
- `event_foods`: Food items per event
- `reservations`: Student food reservations
- `student_profiles`: Student-specific information

**Relationships:**
- Events belong to organizers (vendor_profiles)
- Food items belong to events
- Reservations link students to food items
- Profiles link to auth.users

### Data Flow

1. **Authentication Flow**:
   ```
   User → Supabase Auth → Session Cookie → Middleware → Role Check → Route Redirect
   ```

2. **Event Creation Flow**:
   ```
   Vendor → Form Input → API Route → Validation → Supabase Insert → Success Response
   ```

3. **Reservation Flow**:
   ```
   Student → Select Food → API Route → Capacity Check → Create Reservation → Update UI
   ```

4. **Admin Approval Flow**:
   ```
   Admin → Review Application → API Route → RPC Function → Update Roles → Notify Vendor
   ```

---

## 🔐 Security

### Implemented Security Measures

#### 1. Authentication
- ✅ **Supabase Auth**: Industry-standard authentication service
- ✅ **PKCE Flow**: Secure OAuth implementation
- ✅ **Session Management**: HTTP-only cookies for session storage
- ✅ **Email Validation**: BU domain (@bu.edu) requirement enforced
- ✅ **Password Security**: Handled by Supabase (hashing, salting)

#### 2. Authorization
- ✅ **Role-Based Access Control (RBAC)**: 
  - Roles stored in `profiles.roles` array
  - Middleware checks for route access
  - API routes verify user roles
- ✅ **Resource Ownership**: 
  - Vendors can only manage their own events
  - Students can only view/update their own reservations
  - Admins have elevated privileges
- ✅ **Route Protection**: 
  - Middleware redirects unauthorized users
  - Server-side checks on protected pages
  - API routes return 401/403 for unauthorized access

#### 3. Input Validation
- ✅ **Server-Side Validation**: All API routes validate input
- ✅ **Required Field Checks**: Missing fields return 400 errors
- ✅ **Type Validation**: TypeScript + runtime checks
- ✅ **Capacity Limits**: Reservation system enforces business rules

#### 4. Data Protection
- ✅ **Environment Variables**: Sensitive keys in `.env.local`
- ✅ **Service Role Key**: Admin operations use server-side only key
- ✅ **Row Level Security (RLS)**: Supabase RLS policies (implied)
- ✅ **SQL Injection Prevention**: Supabase client handles parameterization

#### 5. Business Logic Security
- ✅ **Event Time Validation**: Prevents reservations for ended events
- ✅ **Capacity Enforcement**: Prevents over-reservation
- ✅ **Per-Student Limits**: Enforces individual reservation limits
- ✅ **Ownership Verification**: Users can only modify their own resources

#### 6. API Security
- ✅ **Authentication Required**: All API routes check for valid session
- ✅ **Error Handling**: Generic error messages to prevent information leakage
- ✅ **HTTP Status Codes**: Proper status codes (401, 403, 404, 500)

### Security Code Examples

**Middleware Protection** (`middleware.ts`):
```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) return NextResponse.redirect(new URL("/landing", req.url));
```

**API Route Authorization** (`app/api/events/route.ts`):
```typescript
const { data: { user }, error: authError } = await supabase.auth.getUser();
if (authError || !user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**Resource Ownership Check** (`app/api/vendor/events/[id]/close/route.ts`):
```typescript
if (event.organizer_id !== user.id) {
  return NextResponse.json(
    { error: "You are not the organizer for this event" },
    { status: 403 }
  );
}
```

**BU Email Validation** (`app/student/page.tsx`):
```typescript
if (!user.email?.toLowerCase().endsWith("@bu.edu")) {
  await supabase.auth.signOut();
  router.replace("/landing?authError=Please%20use%20a%20%40bu.edu%20account");
}
```

### Additional Security Measures (If Had Access/Time)

#### Would Implement:
1. **BU Active Directory Integration**: 
   - Verify email addresses against BU's official directory
   - Single Sign-On (SSO) integration
   - Automatic role assignment for faculty/staff

2. **Rate Limiting**: 
   - Prevent API abuse
   - Limit requests per user/IP
   - Protect against DDoS attacks

3. **CSRF Protection**: 
   - Token-based CSRF protection
   - SameSite cookie attributes
   - Origin validation

4. **Input Sanitization**: 
   - XSS prevention
   - HTML sanitization for user-generated content
   - SQL injection prevention (already handled by Supabase)

5. **Audit Logging**: 
   - Log all admin actions
   - Track reservation changes
   - Monitor suspicious activity

6. **Email Verification**: 
   - Require email verification before account activation
   - Send verification links
   - Prevent fake accounts

7. **Two-Factor Authentication (2FA)**: 
   - Optional 2FA for vendors and admins
   - TOTP-based authentication
   - Backup codes

8. **Session Management**: 
   - Session timeout
   - Concurrent session limits
   - Device tracking

9. **Content Moderation**: 
   - Automated content filtering
   - Report system for inappropriate content
   - Admin review queue

10. **Data Encryption**: 
    - Encrypt sensitive data at rest
    - TLS for all communications
    - Encrypted backups

---

## 🔄 Development Process

### Agile Methodology

#### 3x3 Agile Components

1. **User Stories**:
   - Written from user perspectives
   - Acceptance criteria defined
   - Prioritized in backlog
   - Examples:
     - "As a student, I want to search for events by dietary restrictions so I can find food that meets my needs"
     - "As a vendor, I want to create events with multiple food items so I can list all available food"
     - "As an admin, I want to approve vendor applications so I can control who can post events"

2. **Sprints**:
   - Time-boxed iterations (typically 1-2 weeks)
   - Sprint planning meetings
   - Daily stand-ups
   - Sprint reviews and retrospectives

3. **Stand-ups**:
   - Daily team meetings
   - What did I do yesterday?
   - What will I do today?
   - Are there any blockers?

### Development Workflow

1. **Sprint Planning**:
   - Review backlog
   - Select user stories for sprint
   - Break down into tasks
   - Assign tasks to team members

2. **Development**:
   - Create feature branches
   - Implement features
   - Write/update tests
   - Code reviews

3. **Testing**:
   - Manual testing of features
   - Integration testing
   - User acceptance testing

4. **Deployment**:
   - Merge to main branch
   - Deploy to staging
   - Final testing
   - Deploy to production

### Notion Usage

**Notion** was used as the primary project management tool for:

1. **Project Planning**:
   - User story backlog
   - Sprint planning documents
   - Roadmap and milestones

2. **Task Management**:
   - Task boards (To Do, In Progress, Done)
   - Assignees and due dates
   - Task dependencies

3. **Documentation**:
   - Meeting notes
   - Design decisions
   - API documentation drafts
   - Database schema notes

4. **Collaboration**:
   - Team wiki
   - Shared knowledge base
   - Discussion threads

5. **Tracking**:
   - Burndown charts
   - Velocity tracking
   - Sprint retrospectives

---

## 🛠️ Tools & Technologies

### Development Tools

| Category | Tool | Purpose |
|----------|------|---------|
| **Framework** | Next.js 16.0.0 | Full-stack React framework |
| **Language** | TypeScript 5 | Type-safe JavaScript |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **Database** | Supabase (PostgreSQL) | Database and backend services |
| **Authentication** | Supabase Auth | User authentication |
| **Maps** | Mapbox GL 3.17.0 | Interactive mapping |
| **Package Manager** | npm | Dependency management |
| **Linting** | ESLint | Code quality |
| **Version Control** | Git | Source code management |
| **Deployment** | Vercel (recommended) | Hosting platform |

### Project Management

- **Notion**: Project management, documentation, task tracking
- **Git**: Version control and collaboration
- **GitHub/GitLab**: Code repository hosting

### External Services

- **Supabase**: 
  - Database hosting
  - Authentication service
  - Real-time capabilities
- **Mapbox**: 
  - Geocoding API
  - Map rendering
  - Location services
- **Vercel**: 
  - Deployment platform
  - CI/CD integration
  - Edge functions

---

## 📁 Project Structure

```
cs391-group8/
├── app/                          # Next.js App Router
│   ├── about/                    # About page
│   ├── admin/                    # Admin dashboard
│   │   ├── AdminApprovedList.tsx
│   │   ├── AdminPendingList.tsx
│   │   └── page.tsx
│   ├── api/                      # API routes
│   │   ├── admin/                # Admin endpoints
│   │   │   ├── approve-organizer/
│   │   │   ├── reject-organizer/
│   │   │   └── revoke-organizer/
│   │   ├── event-foods/          # Food item endpoints
│   │   ├── events/               # Event endpoints
│   │   ├── reservations/         # Reservation endpoints
│   │   └── vendor/               # Vendor-specific endpoints
│   ├── auth/                     # Authentication pages
│   │   ├── signup/               # Student signup
│   │   └── vendor/               # Vendor signup
│   ├── components/               # Shared components
│   │   └── animations/           # Animation components
│   ├── contact/                  # Contact page
│   ├── frq/                      # FAQ page
│   ├── landing/                  # Landing page
│   │   └── components/           # Landing page components
│   ├── profile/                  # Profile page
│   ├── student/                  # Student pages
│   │   ├── components/           # Student-specific components
│   │   ├── profile/              # Student profile
│   │   ├── reservations/         # Reservation history
│   │   └── page.tsx              # Main student page
│   ├── vendor/                   # Vendor pages
│   │   ├── components/           # Vendor-specific components
│   │   ├── create/               # Create event page
│   │   ├── onboarding/           # Vendor onboarding
│   │   ├── pending/              # Pending approval page
│   │   └── page.tsx              # Main vendor page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── mapbox-styles.tsx         # Mapbox style imports
│   └── page.tsx                  # Root page (redirects)
├── lib/                          # Utility libraries
│   ├── actions/                  # Server actions
│   │   └── upsertStudentProfile.ts
│   ├── mapbox/                   # Mapbox utilities
│   │   └── geocoding.ts
│   └── supabase/                 # Supabase clients
│       ├── client.ts             # Browser client
│       └── server.ts             # Server client
├── public/                       # Static assets
│   ├── images/                   # Image assets
│   └── *.svg                     # SVG icons
├── types/                        # TypeScript type definitions
│   ├── mapbox-sdk.d.ts
│   └── react-map-gl.d.ts
├── middleware.ts                 # Next.js middleware
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.mjs             # ESLint configuration
├── postcss.config.mjs            # PostCSS configuration
└── README.md                     # This file
```

---

## 📡 API Documentation

### Authentication
All API routes require authentication via Supabase session cookie.

### Endpoints

#### Events

**GET `/api/events`**
- **Description**: Get events for the current user (vendor view) or all active events (student view)
- **Query Parameters**: 
  - `vendorOnly=true` (optional): Return only vendor's events
- **Response**: 
  ```json
  {
    "events": [
      {
        "id": "string",
        "name": "string",
        "organizer_name": "string",
        "location": "string",
        "location_label": "string",
        "address": "string",
        "category": "string",
        "start_time": "ISO8601",
        "end_time": "ISO8601",
        "dietary_tags": ["string"],
        "description": "string",
        "availability": "string",
        "lat": number,
        "lng": number
      }
    ]
  }
  ```
- **Status Codes**: 200 (success), 401 (unauthorized), 500 (server error)

**POST `/api/events`**
- **Description**: Create a new event with food items
- **Request Body**:
  ```json
  {
    "eventName": "string",
    "location": "string",
    "locationLabel": "string",
    "address": "string",
    "category": "string",
    "dietaryTags": ["string"],
    "description": "string",
    "startTime": "ISO8601",
    "endTime": "ISO8601",
    "foodItems": [
      {
        "name": "string",
        "totalPortions": number,
        "perStudentLimit": number
      }
    ],
    "lat": number,
    "lng": number
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "eventId": "string"
  }
  ```
- **Status Codes**: 201 (created), 400 (bad request), 401 (unauthorized), 500 (server error)

#### Event Foods

**GET `/api/event-foods?eventId={id}`**
- **Description**: Get food items for an event with availability information
- **Query Parameters**: 
  - `eventId` (required): Event ID
- **Response**:
  ```json
  {
    "foods": [
      {
        "id": "string",
        "name": "string",
        "totalPortions": number,
        "perStudentLimit": number,
        "totalReserved": number,
        "userQuantity": number
      }
    ]
  }
  ```
- **Status Codes**: 200 (success), 401 (unauthorized), 500 (server error)

#### Reservations

**GET `/api/reservations`**
- **Description**: Get all reservations for the current user
- **Response**:
  ```json
  {
    "reservations": [
      {
        "id": "string",
        "quantity": number,
        "status": "in_progress" | "picked_up" | "cancelled" | "incomplete",
        "created_at": "ISO8601",
        "foodName": "string",
        "eventName": "string",
        "locationLabel": "string",
        "address": "string",
        "start_time": "ISO8601",
        "end_time": "ISO8601"
      }
    ]
  }
  ```
- **Status Codes**: 200 (success), 401 (unauthorized), 500 (server error)

**POST `/api/reservations`**
- **Description**: Create a new reservation
- **Request Body**:
  ```json
  {
    "eventFoodId": "string",
    "quantity": number
  }
  ```
- **Response**:
  ```json
  {
    "success": true
  }
  ```
- **Status Codes**: 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error)

**PATCH `/api/reservations/[id]`**
- **Description**: Update reservation status
- **Request Body**:
  ```json
  {
    "status": "in_progress" | "picked_up" | "cancelled" | "incomplete"
  }
  ```
- **Response**:
  ```json
  {
    "success": true
  }
  ```
- **Status Codes**: 200 (success), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)

#### Vendor Events

**GET `/api/vendor/events/[id]/reservations`**
- **Description**: Get all reservations for a specific event (vendor only)
- **Response**:
  ```json
  {
    "reservations": [
      {
        "id": "string",
        "student_id": "string",
        "event_food_id": "string",
        "quantity": number,
        "status": "string",
        "food_name": "string",
        "student_email": "string"
      }
    ]
  }
  ```
- **Status Codes**: 200 (success), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)

**PATCH `/api/vendor/events/[id]/close`**
- **Description**: Close an event early (vendor only)
- **Response**:
  ```json
  {
    "success": true
  }
  ```
- **Status Codes**: 200 (success), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)

#### Admin

**POST `/api/admin/approve-organizer`**
- **Description**: Approve a vendor application (admin only)
- **Request Body**:
  ```json
  {
    "userId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "ok": true
  }
  ```
- **Status Codes**: 200 (success), 400 (bad request), 500 (server error)

**POST `/api/admin/reject-organizer`**
- **Description**: Reject a vendor application (admin only)
- **Request Body**:
  ```json
  {
    "userId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "ok": true
  }
  ```
- **Status Codes**: 200 (success), 400 (bad request), 500 (server error)

**POST `/api/admin/revoke-organizer`**
- **Description**: Revoke organizer privileges (admin only)
- **Request Body**:
  ```json
  {
    "userId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "ok": true
  }
  ```
- **Status Codes**: 200 (success), 400 (bad request), 500 (server error)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Mapbox account and API key
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd cs391-group8
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   ```

4. **Set up Supabase**:
   - Create a new Supabase project
   - Set up the database schema (tables: profiles, vendor_profiles, organizer_applications, events, event_foods, reservations, student_profiles)
   - Configure Row Level Security policies
   - Set up authentication providers

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## 🧪 Testing Plan

### Testing Strategy

While automated test files are not present in the codebase, the following testing approach was used:

#### 1. Manual Testing

**Unit Testing** (Component Level):
- ✅ Individual component rendering
- ✅ Props validation
- ✅ State management
- ✅ Event handlers

**Integration Testing** (Feature Level):
- ✅ Authentication flows (signup, login, logout)
- ✅ Event creation workflow
- ✅ Reservation system
- ✅ Admin approval workflow
- ✅ Map functionality
- ✅ Search and filtering

**End-to-End Testing** (User Flows):
- ✅ Student: Sign up → Browse events → Reserve food → View reservations
- ✅ Vendor: Apply → Get approved → Create event → Manage reservations
- ✅ Admin: Review applications → Approve/reject → Monitor vendors

#### 2. Test Scenarios

**Authentication**:
- [x] Student signup with BU email
- [x] Student signup with non-BU email (should fail)
- [x] Vendor signup and application
- [x] Login/logout functionality
- [x] Session persistence
- [x] Role-based redirects

**Event Management**:
- [x] Create event with all required fields
- [x] Create event with missing fields (should fail)
- [x] Add multiple food items
- [x] Close event early
- [x] View event history

**Reservations**:
- [x] Reserve food within capacity limits
- [x] Reserve food exceeding capacity (should fail)
- [x] Reserve food exceeding per-student limit (should fail)
- [x] Reserve food for ended event (should fail)
- [x] Cancel reservation
- [x] Update reservation status (vendor)

**Search & Filtering**:
- [x] Search by event name
- [x] Filter by dietary restrictions
- [x] Filter by location
- [x] Filter by availability
- [x] Sort by different criteria
- [x] Combine multiple filters

**Map View**:
- [x] Map loads with correct center
- [x] Markers appear for active events
- [x] Popup shows event details
- [x] Map adjusts bounds for multiple events
- [x] Geocoding works for addresses

**Admin Functions**:
- [x] View pending applications
- [x] Approve vendor application
- [x] Reject vendor application
- [x] Revoke organizer privileges
- [x] Access control (non-admins cannot access)

#### 3. Browser Testing

- [x] Chrome/Chromium
- [x] Firefox
- [x] Safari
- [x] Mobile browsers (iOS Safari, Chrome Mobile)

#### 4. Performance Testing

- [x] Page load times
- [x] API response times
- [x] Map rendering performance
- [x] Large dataset handling

#### 5. Security Testing

- [x] Unauthorized access attempts
- [x] Cross-role access attempts
- [x] Input validation
- [x] SQL injection attempts (handled by Supabase)
- [x] XSS attempts

### Future Testing Improvements

If more time were available, we would implement:

1. **Automated Testing**:
   - Jest for unit tests
   - React Testing Library for component tests
   - Playwright/Cypress for E2E tests
   - API route testing with Supertest

2. **Test Coverage**:
   - Aim for 80%+ code coverage
   - Critical path coverage at 100%

3. **CI/CD Integration**:
   - Automated test runs on PR
   - Test reports and coverage reports
   - Pre-deployment test gates

---

## 📚 Documentation Plan

### Current Documentation

1. **README.md** (This file):
   - Project overview
   - Features and requirements
   - Architecture and tech stack
   - API documentation
   - Getting started guide
   - Testing plan
   - Team organization

2. **Code Comments**:
   - JSDoc-style comments on API routes
   - Inline comments for complex logic
   - Type definitions for better IDE support

3. **TypeScript Types**:
   - Type definitions serve as documentation
   - Interface definitions for data structures

### Documentation Structure

#### 1. User Documentation
- **User Guide**: Step-by-step instructions for each user role
- **FAQ**: Common questions and answers
- **Troubleshooting**: Common issues and solutions

#### 2. Developer Documentation
- **API Reference**: Complete API documentation (included in this README)
- **Architecture Guide**: Detailed system architecture
- **Database Schema**: Complete schema documentation
- **Contributing Guide**: How to contribute to the project

#### 3. Project Documentation
- **Project Plan**: Initial requirements and planning
- **Design Decisions**: Rationale behind technical choices
- **Meeting Notes**: Key decisions and discussions
- **Sprint Reports**: Progress and retrospectives

### Documentation Tools Used

- **Notion**: Primary documentation platform
  - Project wiki
  - Meeting notes
  - Design documents
  - User stories
- **README.md**: Code repository documentation
- **Code Comments**: Inline documentation
- **TypeScript**: Self-documenting code through types

### Future Documentation Improvements

1. **API Documentation**:
   - OpenAPI/Swagger specification
   - Interactive API explorer
   - Example requests/responses

2. **User Guides**:
   - Video tutorials
   - Screenshot guides
   - Interactive walkthroughs

3. **Developer Guides**:
   - Setup guides for different environments
   - Deployment guides
   - Troubleshooting guides

---

## 👥 Team Organization

### Team Structure

**Group 8** - Spark!Bytes Development Team

### Roles & Responsibilities

#### Scrum Master
- **Responsibilities**:
  - Facilitate sprint planning and retrospectives
  - Remove blockers and impediments
  - Ensure team communication
  - Track sprint progress
  - Coordinate with stakeholders
- **Key Learnings**:
  - Importance of clear communication
  - Balancing team autonomy with guidance
  - Adapting processes to team needs
  - Managing conflicting priorities
  - Facilitating productive meetings

#### Frontend Developers
- **Responsibilities**:
  - Implement UI components
  - Create responsive designs
  - Integrate with API endpoints
  - Optimize user experience
  - Ensure accessibility

#### Backend Developers
- **Responsibilities**:
  - Design and implement API routes
  - Database schema design
  - Authentication and authorization
  - Business logic implementation
  - API documentation

#### Full-Stack Developers
- **Responsibilities**:
  - Work across frontend and backend
  - Integration work
  - End-to-end feature implementation
  - Troubleshooting cross-layer issues

### Team Collaboration

#### Communication
- **Daily Stand-ups**: Quick status updates
- **Sprint Planning**: Plan upcoming work
- **Sprint Reviews**: Demo completed work
- **Retrospectives**: Improve processes
- **Notion**: Asynchronous communication and documentation

#### Code Collaboration
- **Git Workflow**: Feature branches, code reviews, merge to main
- **Code Reviews**: Peer review before merging
- **Pair Programming**: For complex features
- **Knowledge Sharing**: Regular tech talks and documentation

#### Task Management
- **Notion Boards**: Visual task tracking
- **User Stories**: Feature breakdown
- **Sprint Backlog**: Prioritized work items
- **Burndown Charts**: Progress tracking

### Teamwork Highlights

1. **Clear Role Definitions**: Each team member had clear responsibilities
2. **Regular Communication**: Daily stand-ups kept everyone aligned
3. **Collaborative Problem Solving**: Complex issues solved together
4. **Knowledge Sharing**: Team members shared expertise
5. **Adaptive Process**: Team adjusted processes based on what worked

### Challenges & Solutions

**Challenge**: Coordinating work across different features
- **Solution**: Clear user story breakdown and regular communication

**Challenge**: Managing dependencies between frontend and backend
- **Solution**: API contracts defined early, mock data for parallel development

**Challenge**: Balancing feature development with testing
- **Solution**: Test-as-you-go approach, manual testing checklists

**Challenge**: Time constraints
- **Solution**: Prioritized MVP features, deferred nice-to-haves

---

## 🔮 Future Enhancements

### Planned Features

1. **Notifications**:
   - Email notifications for reservation confirmations
   - Push notifications for new events
   - Reminders for pickup windows

2. **Analytics Dashboard**:
   - Vendor analytics (food waste reduction stats)
   - Popular event categories
   - Peak usage times
   - Student engagement metrics

3. **Rewards System**:
   - Student loyalty points
   - Badges and achievements
   - Leaderboards
   - Rewards for frequent users

4. **Enhanced Admin Features**:
   - Event moderation
   - Content filtering
   - User management
   - System analytics

5. **Social Features**:
   - Event sharing
   - Reviews and ratings
   - Comments on events
   - User profiles

6. **Mobile App**:
   - Native iOS/Android apps
   - Push notifications
   - Offline capabilities
   - Better mobile UX

7. **Advanced Search**:
   - Saved searches
   - Search history
   - Recommendations
   - Machine learning-based suggestions

8. **Payment Integration**:
   - Optional paid events
   - Donation system
   - Vendor payments

### Technical Improvements

1. **Performance**:
   - Image optimization
   - Code splitting
   - Caching strategies
   - Database query optimization

2. **Testing**:
   - Automated test suite
   - E2E testing
   - Performance testing
   - Load testing

3. **Monitoring**:
   - Error tracking (Sentry)
   - Analytics (Google Analytics, Mixpanel)
   - Performance monitoring
   - Uptime monitoring

4. **Accessibility**:
   - WCAG 2.1 AA compliance
   - Screen reader optimization
   - Keyboard navigation
   - Color contrast improvements

5. **Internationalization**:
   - Multi-language support
   - Localization
   - Timezone handling

---

## 📄 License

This project is part of CS391 - Software Engineering course work.

---

## 🙏 Acknowledgments

- **Boston University** - For providing the context and requirements
- **Supabase** - For the excellent backend platform
- **Mapbox** - For the mapping services
- **Next.js Team** - For the amazing framework
- **CS391 Instructors** - For guidance and support

---

## 📞 Contact & Support

For questions, issues, or contributions, please contact the development team through the course channels.

---

**Last Updated**: Fall 2025
**Version**: 0.1.0
**Status**: Active Development
