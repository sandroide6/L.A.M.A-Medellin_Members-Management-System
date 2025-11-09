# L.A.M.A Medellín - Members Management System

## Overview

L.A.M.A Medellín is a comprehensive web-based member management system for a motorcycle club. The application enables complete administration of member data including personal information, motorcycle details, documentation tracking, and advanced statistics with reporting capabilities.

**Tech Stack:**
- Frontend: React 19.2 with TypeScript
- Backend: ASP.NET Core 9.0 (C#)
- Database: Google Cloud Firestore (NoSQL)
- Authentication: Firebase Authentication
- Hosting: Firebase Hosting (Frontend), Render (Backend API)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Single Page Application (SPA)**
- Built with Create React App and React 19.2
- TypeScript for type safety and improved developer experience
- Component-based architecture with functional components and React hooks

**State Management**
- Local component state using `useState` and `useEffect` hooks
- No external state management library (Redux, MobX) - state is managed at the HomePage component level and passed down as props
- Authentication state managed through Firebase `onAuthStateChanged` observer

**Navigation Pattern**
- Tab-based navigation system without routing library
- Five main tabs: Inicio (Home), Registro (Registration), Listado (List), Estadísticas (Statistics), Reportes (Reports)
- Conditional rendering based on `tabActiva` state variable

**Component Structure**
- `App.tsx`: Root component handling authentication state and routing between LoginPage and HomePage
- `LoginPage.tsx`: Google OAuth authentication interface
- `HomePage.tsx`: Main application container managing tabs, member data, and CRUD operations
- `Inicio.tsx`: Landing page with feature highlights
- `MiembroForm.tsx`: Member registration/editing form with validation
- `MiembrosList.tsx`: Member listing with filtering and CSV export
- `Estadisticas.tsx`: Statistics dashboard with charts and metrics
- `Reportes.tsx`: Advanced reporting with multiple filter options and PDF generation

**Data Validation**
- Only 5 required fields: nombre, apellido, cedula, celular, correoElectronico
- Input validation for specific field types (letters-only, numbers-only)
- Date inputs for birthdate, document expiration dates

**Styling Approach**
- Custom CSS with dark theme and gradient backgrounds
- No CSS framework (Bootstrap, Material-UI) - fully custom styles
- Responsive design using CSS media queries and flexbox/grid layouts
- Modern glassmorphism effects with backdrop-filter blur

### Backend Architecture

**RESTful API Design**
- ASP.NET Core 9.0 Web API
- CORS enabled for cross-origin requests from Firebase Hosting
- JWT token authentication using Firebase Admin SDK

**Authentication & Authorization**
- Firebase Authentication integration on frontend
- Backend validates Firebase ID tokens sent in Authorization header
- User-scoped data access - members are filtered by authenticated user's ID

**API Endpoints Pattern**
- Base URL: `/api/miembros`
- GET `/api/miembros` - Retrieve all members for authenticated user
- POST `/api/miembros` - Create new member
- PUT `/api/miembros/{id}` - Update existing member
- DELETE `/api/miembros/{id}` - Delete member
- Private test endpoint: `/api/private/test` for authentication verification

**Request/Response Flow**
1. Frontend obtains Firebase ID token from authenticated user
2. Axios interceptor automatically adds token to Authorization header
3. Backend validates token using Firebase Admin SDK
4. User ID extracted from token claims
5. Database operations scoped to user's documents

### Data Storage

**Firestore Database (NoSQL)**
- Document-based database structure
- Collection: `miembros` (members)
- Each document contains complete member information
- Documents include `UserId` field for user-scoped queries
- No explicit schema enforcement - flexibility for field additions

**Member Data Model**
- Personal data: name, surname, ID number, birthdate, blood type, health insurance, city, address
- Contact information: phone, email, emergency contact
- Club data: join date, member number, position, rank, status, sponsor, photo URL
- Motorcycle data: model, brand, year, engine displacement (CC), license plate
- Document dates: driver's license issue date, SOAT (insurance) issue date

**Data Access Layer**
- FirebaseAdmin SDK for .NET (v3.4.0)
- Direct Firestore queries from backend controllers
- No ORM or abstraction layer - direct SDK usage
- Entity Framework Core installed but not actively used for Firestore

### External Dependencies

**Firebase Services**
- Firebase Authentication: Google OAuth provider for user login
- Cloud Firestore: Primary database for member data storage
- Firebase Hosting: Production deployment for frontend SPA

**Third-Party Libraries**
- **Frontend:**
  - `axios` (v1.13.1): HTTP client with request interceptors for authentication
  - `jspdf` (v3.0.3): PDF generation for reports
  - `jspdf-autotable` (v5.0.2): Table formatting in PDF exports
  - `firebase` (v12.5.0): Firebase client SDK

- **Backend:**
  - `FirebaseAdmin` (v3.4.0): Server-side Firebase authentication validation
  - `Google.Cloud.Firestore` (v3.11.0): Firestore database access
  - `Microsoft.AspNetCore.OpenApi` (v9.0.8): API documentation
  - `Swashbuckle.AspNetCore` (v9.0.6): Swagger UI for API testing

**Deployment Platforms**
- Frontend: Firebase Hosting (https://lama-medellin.web.app)
- Backend: Render.com (https://l-a-m-a-medell-n-members-management.onrender.com)
- Development: Replit workspace support with dynamic domain detection

**Environment Configuration**
- Frontend uses environment variables for Firebase config (REACT_APP_FIREBASE_*)
- Backend requires Firebase service account credentials
- Dynamic API URL detection for Replit development environment

**Export/Reporting Capabilities**
- CSV export: Client-side generation from filtered member data
- PDF generation: jsPDF library for formatted reports with statistics and member listings
- Custom filters: City, rank, status, expiring documents