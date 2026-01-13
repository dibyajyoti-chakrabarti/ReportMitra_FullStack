# ReportMitra

## Overview

ReportMitra is a full-stack, AI-enabled civic issue reporting and resolution platform aimed at bridging the gap between citizens and municipal authorities. The platform enables authenticated citizens to report real-world civic issues, track their resolution status, and observe tangible community impact through a publicly visible resolution feed.

The system is built with a strong emphasis on:
- Identity verification and trust
- Transparency and accountability
- Automation and scalability
- Cost-efficient cloud deployment
- Clean software architecture and data normalization

---

## High-Level System Flow

1. A citizen authenticates and verifies their identity using Aadhaar
2. The citizen submits a civic issue with contextual data
3. AI analyzes the issue image to classify the responsible department
4. The issue is routed, tracked, and managed by administrators
5. Resolution progress is visible to both the reporter and the community
6. Resolved issues are showcased publicly to demonstrate impact

---

## Application Features & Functional Breakdown

---

## 1. Logged-Out Experience

When users initially visit **ReportMitra.in**, they are not authenticated. The logged-out experience is intentionally designed to be informative yet limited, ensuring security while still demonstrating platform value.

### Available Capabilities
- **Track an existing report** using a valid tracking ID
- **View resolved issues** via the Community Impact page
- Access the landing page describing the platform’s purpose

### UI Components
- **Header**
  - Login
  - Sign Up
- **Footer**
  - Contact information
  - Support and communication channels

This approach allows non-authenticated users to verify that the platform is functional and impactful without exposing sensitive data.

---

## 2. Authentication & Identity Management

Authentication is a core security pillar of ReportMitra.

### Supported Login Methods
- Google OAuth (secure, third-party identity provider)
- Username and password authentication
- Email-based OTP login for flexibility and accessibility

### Authentication Strategy
- JWT-based stateless authentication using **SimpleJWT**
- Access and refresh tokens for secure session management
- Token validation across all protected API endpoints

This hybrid authentication model balances ease of access with robust security.

---

## 3. Logged-In Navigation & User Dashboard

Once authenticated, the application dynamically updates the navigation header to expose all user-level features.

### Header Options
1. Report a new issue  
2. Track an issue  
3. Issue history  
4. Profile (Aadhaar verification)  
5. Community (resolved issues)  
6. Logout  

Each section is permission-aware and backed by authenticated REST APIs.

---

## 4. Profile & Aadhaar Verification Module

The **Profile section** is mandatory and acts as the identity backbone of the system.

### Aadhaar Verification Flow
1. User enters Aadhaar number
2. Aadhaar is validated against a sandbox environment
3. On success, verified demographic data is fetched automatically

### Stored & Displayed Attributes
- Full Name
- Date of Birth
- Address
- Aadhaar Verification Status
- Age
- Phone Number
- Last Updated Timestamp

### Design Rationale
- Prevents anonymous or fake reporting
- Ensures traceability and accountability
- Enables auto-filling of issue reports
- Reduces redundant user input

---

## 5. Issue Reporting Workflow

The **Report Issue** feature is the primary user interaction point.

### Data Pre-Fill
- Citizen identity details are auto-fetched from the Profile module

### Required Inputs
- Issue title (concise summary)
- Detailed issue description
- Issue image upload (evidence)
- Geographic location selection via interactive map

### Validation & Constraints
- Mandatory field validation
- File type and size checks for images
- Location bounds validation

### Submission Outcome
- Issue is persisted in a normalized relational schema
- A unique tracking ID is generated
- User is prompted to:
  - Copy the tracking ID
  - File another report immediately

This flow minimizes friction while maintaining data integrity.

---

## 6. AI-Based Issue Classification

To reduce manual administrative overhead, ReportMitra integrates AI-powered automation.

### OpenAI GPT Integration
- Uploaded issue images are sent to the GPT API
- Prompt engineering is used to:
  - Interpret the visual issue context
  - Infer the most appropriate municipal department

### Benefits
- Faster routing of issues
- Reduced manual misclassification
- Scalable triage mechanism

This makes the platform intelligent, not just reactive.

---

## 7. Issue Tracking System

The **Tracking Page** allows any user (logged in or logged out) to track an issue using its tracking ID.

### Displayed Sections

#### A. Issue Details
- Reporter metadata
- Issue title and description
- Original issue image
- Completion image (uploaded by admin upon resolution)

#### B. Issue Actions & Status Timeline
- Pending
- In Progress
- Resolved
- Escalated (auto-triggered after SLA breach)

This transparency builds trust and discourages administrative negligence.

---

## 8. Issue History (User-Centric View)

The **History section** is a personalized dashboard tied to the authenticated user.

### Characteristics
- Displays all issues reported by the user
- No need to remember or store tracking IDs
- Read-only access (view-only)

### Design Advantage
- Clear audit trail for the citizen
- Simplified long-term tracking
- Better UX compared to manual ID tracking

---

## 9. Community Impact Module

The **Community section** acts as a public success dashboard.

### Inclusion Criteria
- Only issues marked as **Resolved** by administrators

### Visibility Rules
- Reporter identity is irrelevant
- All resolved issues are visible to all users

### Purpose
- Demonstrates real-world impact
- Encourages citizen participation
- Reinforces platform credibility

---

## 10. Logout & Session Termination

The logout mechanism:
- Invalidates the user session
- Clears authentication tokens
- Redirects the user to the login screen

This ensures session safety, especially on shared devices.

---

## Technology Stack

---

## Backend Architecture

- **Framework:** Django 5.0
- **API Layer:** Django REST Framework
- **Architecture Style:** RESTful, modular, service-oriented
- **Authentication:** Google OAuth + SimpleJWT
- **Database:** MySQL (AWS RDS)
- **Data Design:** Fully normalized (3NF)

The backend emphasizes maintainability, scalability, and security.

---

## Frontend Architecture

- **Framework:** Vite + React
- **Language:** JavaScript
- **Styling:** Tailwind CSS
- **State Handling:** Component-based state management
- **Hosting:** AWS S3 (static hosting)

The frontend is optimized for performance, responsiveness, and clean UX.

---

## Cloud Infrastructure & Deployment

- **AWS EC2:** Backend hosting within a secured VPC
- **AWS S3:** Frontend hosting + image storage
- **CloudFront:** Global CDN distribution
- **Route 53:** DNS management
- **AWS Certificate Manager:** SSL/TLS
- **IAM:** Fine-grained access control

All components follow cloud best practices.

---

## CI/CD & DevOps Automation

### GitHub Actions
- Fully automated CI/CD pipelines
- Separate workflows for frontend and backend

### CI (Continuous Integration)
- Triggered on every push to `main`
- Code validation and deployment preparation

### CD (Continuous Deployment)
- Automatic EC2 updates
- Environment sync
- Zero manual deployment steps

### Cron-Based Cost Optimization
- Deployments allowed **only between 11 AM – 1 PM (IFC)**
- Prevents unnecessary AWS runtime costs
- Ensures controlled infrastructure usage

---

## Conclusion

ReportMitra is a production-ready, cloud-native civic platform that combines:
- Verified citizen identity
- AI-driven automation
- Scalable backend design
- Secure cloud infrastructure
- Robust DevOps practices

The system is designed not just as a project, but as a deployable real-world solution.

---
