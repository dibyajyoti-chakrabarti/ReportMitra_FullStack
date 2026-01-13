# ReportMitra

## Overview

ReportMitra is a web-based, AI-driven civic issue reporting platform designed to enable citizens to report, track, and view the resolution of municipal issues in a transparent and efficient manner. The platform integrates Aadhaar-based verification, automated issue classification using AI, and a community-driven visibility model to demonstrate real-world impact.

The system supports end-to-end issue lifecycle management—from reporting and tracking to resolution and public visibility.

---

## Application Flow & Features

### 1. Logged-Out Experience
When a user initially visits **ReportMitra.in**, they are logged out by default. In this state, users can:
- Track an existing issue using a valid tracking ID
- View previously resolved issues via the **Community Impact** page
- Explore the landing page content

**Header**
- Login
- Sign Up

**Footer**
- Contact and communication details

---

### 2. Authentication & Login
Users must log in to access full platform functionality. Supported authentication methods include:
- Google OAuth
- Username and password authentication
- Email-based login using a verification code

---

### 3. Logged-In Navigation
After successful authentication, the header expands to include the following six sections:

1. Report a new issue  
2. Track an existing issue  
3. View issue history  
4. Profile (Aadhaar verification)  
5. Community (resolved issues)  
6. Logout  

---

### 4. Profile & Aadhaar Verification
The **Profile** section is the first mandatory interaction after login.

- Users are prompted to enter their Aadhaar number
- Aadhaar is verified against an Aadhaar sandbox
- Upon successful verification, the following details are automatically fetched and displayed:
  - Full Name
  - Date of Birth
  - Address
  - Aadhaar Status
  - Age
  - Phone Number
  - Last Updated Timestamp

This profile data is later reused while reporting issues.

---

### 5. Reporting a New Issue
The **Report Issue** feature enables users to file new civic complaints.

**Data Sources**
- Citizen details are fetched automatically from the Profile section

**User Inputs**
- Issue title
- Issue description
- Issue image upload
- Issue location selection via an interactive map

**Validation**
- All fields are validated for completeness and constraints

**Submission Flow**
- On successful submission, a unique tracking ID is generated
- The user is prompted to:
  - Copy the tracking ID to monitor progress
  - Continue and submit another issue

---

### 6. Issue Tracking
The **Tracking Page** allows users to track any report using a valid tracking ID (not limited to their own reports).

Upon successful lookup, two sections are displayed:

#### a. Issue Details
- Reporter information
- Issue title and description
- Uploaded issue image
- Completion image (initially blank)
  - Populated once the admin resolves the issue

#### b. Issue Actions & Status
- Current status of the issue:
  - Pending
  - In Progress
  - Resolved
  - Escalated (automatically if unresolved beyond a defined time threshold)

---

### 7. Issue History
The **History** section is a profile-linked static page that displays:
- All issues reported by the logged-in user

This eliminates the need for users to manually store tracking IDs.  
Unlike the tracking page, this section only displays issues filed by the current user.

---

### 8. Community Section
The **Community** section showcases:
- All issues marked as **Resolved** in the backend
- Issues are displayed regardless of which user reported them

This section highlights:
- Platform transparency
- Real-world civic impact
- Administrative accountability

---

### 9. Logout
The **Logout** option:
- Ends the user session
- Redirects the user back to the login screen

---

## Technology Stack

### Backend
- **Framework:** Django 5.0
- **API Layer:** Django REST Framework (RESTful APIs)
- **Authentication:**
  - Google OAuth
  - SimpleJWT (JWT-based authentication)
- **Database:**
  - MySQL hosted on AWS RDS
  - Fully normalized to **Third Normal Form (3NF)**

---

### Frontend
- **Framework:** Vite + React
- **Language:** JavaScript
- **Styling:** Tailwind CSS
- **Hosting:**  
  - Entire frontend is hosted on an **AWS S3 bucket**
  - Served globally using CloudFront

---

### AI Integration
- **OpenAI GPT API**
  - Issue images are sent to the GPT API
  - Prompt engineering is used to classify issues and automatically determine the responsible department

---

## Cloud Infrastructure & Deployment

- **Cloud Provider:** AWS
- **Compute:** EC2 instance running inside a secured VPC
- **Storage:**
  - User-uploaded issue images
  - Admin completion images
  - Stored in AWS S3 buckets
- **Networking & Distribution:**
  - CloudFront for CDN
  - Route 53 for DNS management
- **Security:**
  - IAM for access control
  - AWS Certificate Manager for SSL certificates
  - HTTPS and WWW enforcement across the platform

---

## CI/CD & Automation

### GitHub Actions & Workflows
The project uses automated CI/CD pipelines configured via **GitHub Actions** for both frontend and backend.

#### Continuous Integration (CI)
- Triggered automatically on every push to the `main` branch
- Separate pipelines for frontend and backend
- Ensures code consistency and deployment readiness

#### Continuous Deployment (CD)
- Automated deployment to AWS infrastructure
- EC2 configurations, environment updates, and application restarts are handled automatically by workflows
- No manual intervention required after code push

#### Cost-Optimized Cron Deployment
- A **Cron-based deployment pipeline** is configured
- Deployments are allowed **only between 11:00 AM and 1:00 PM (IFC)** daily
- This strategy significantly reduces AWS operational costs by restricting deployment runtime

---

## Summary

ReportMitra is a full-stack, production-grade civic engagement platform that combines:
- Secure identity verification
- Scalable cloud infrastructure
- AI-powered automation
- Robust CI/CD pipelines
- Transparent community impact tracking

The system is designed with scalability, security, and real-world usability at its core.

---
