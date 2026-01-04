# Workout Tracker Application

A full-stack web application for tracking workout plans, logging daily progress, and monitoring fitness metrics for a household of two users (Anthony and Sakshee).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Seeding Sample Data](#seeding-sample-data)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Usage Guide](#usage-guide)

## Features

### Core Features (MVP)

- **User Authentication**: JWT-based authentication for Anthony and Sakshee
- **Workout Plans**: Structured plans organized by phases, weeks, and day templates
- **Daily Logging**: Quick workout logging (under 30 seconds) with status tracking
- **Progress Dashboard**: At-a-glance summaries with progress bars and streak counter
- **Calendar Heatmap**: Visual representation of workout adherence
- **Custom Routines**: Create and reuse custom routine templates with attachments
- **History & Export**: Searchable workout history with CSV export functionality
- **Metrics Tracking**: Optional tracking of body weight, energy, sleep, and RPE
- **Mobile Responsive**: Optimized for desktops, tablets, and phones

## Tech Stack

### Backend
- **Node.js** with **Express.js** - API server
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **date-fns** - Date formatting

## Project Structure

```
rvwebsite/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── exportController.js
│   │   ├── logController.js
│   │   ├── planController.js
│   │   └── routineController.js
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── Attachment.js
│   │   ├── DayTemplate.js
│   │   ├── Phase.js
│   │   ├── Plan.js
│   │   ├── RoutineTemplate.js
│   │   ├── User.js
│   │   ├── Week.js
│   │   └── WorkoutLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── export.js
│   │   ├── logs.js
│   │   ├── plans.js
│   │   └── routines.js
│   ├── scripts/
│   │   └── seed.js            # Database seeding script
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Calendar.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Plan.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Routines.jsx
│   │   │   └── Today.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── WORKOUT_TRACKER_README.md
```

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance like MongoDB Atlas)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd rvwebsite
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Configuration

### Backend Configuration

1. Copy the example environment file:

```bash
cd backend
cp .env.example .env
```

2. Edit `.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/workout-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=30m
NODE_ENV=development
UPLOAD_DIR=./uploads
```

**Important:**
- Change `JWT_SECRET` to a strong, unique secret key
- Update `MONGODB_URI` to point to your MongoDB instance
- For MongoDB Atlas, use: `mongodb+srv://<username>:<password>@cluster.mongodb.net/workout-tracker`

### Frontend Configuration (Optional)

Create `frontend/.env` if you need to configure the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

#### 1. Start MongoDB

If running MongoDB locally:

```bash
# macOS/Linux
mongod

# Windows
# MongoDB usually runs as a service
```

#### 2. Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

#### 3. Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### Production Mode

#### Backend

```bash
cd backend
npm start
```

#### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Seeding Sample Data

To populate the database with sample workout plans for Anthony and Sakshee:

```bash
cd backend
npm run seed
```

This will create:
- Two users: `anthony` and `sakshee` (password: `password123`)
- Sample workout plans with phases, weeks, and day templates
- Anthony's strength-focused plan
- Sakshee's balanced fitness plan

**Login Credentials:**
- Username: `anthony` | Password: `password123`
- Username: `sakshee` | Password: `password123`

## API Documentation

### Authentication

#### POST `/api/auth/login`
Login user and receive JWT token

**Request:**
```json
{
  "username": "anthony",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "username": "anthony",
    "activePlan": "plan-id"
  }
}
```

### Dashboard

#### GET `/api/dashboard`
Get dashboard summary with progress, streak, and metrics

### Plans

#### GET `/api/plans`
Get all plans for authenticated user

#### GET `/api/plans/:id`
Get single plan with phases, weeks, and days

#### PUT `/api/plans/:id/activate`
Set plan as active for user

### Workout Logs

#### POST `/api/logs`
Create a new workout log

**Request:**
```json
{
  "date": "2024-01-15",
  "dayTemplateId": "template-id",
  "status": "completed",
  "weight": 175.5,
  "energy": 8,
  "sleep": 7.5,
  "rpe": 7,
  "notes": "Great workout!"
}
```

#### GET `/api/logs`
Get workout logs with optional filters

**Query Params:**
- `startDate` - Filter by start date
- `endDate` - Filter by end date
- `status` - Filter by status (completed, partial, skipped, rescheduled)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

#### GET `/api/logs/today`
Get today's workout log (if exists)

#### PUT `/api/logs/:id`
Update workout log (within 24 hours only)

### Routines

#### GET `/api/routines`
Get all routine templates for user

#### POST `/api/routines`
Create new routine template (with file upload)

**Form Data:**
- `name` - Routine name (required)
- `description` - Routine description
- `attachment` - File upload (image or PDF, max 10MB)

#### DELETE `/api/routines/:id`
Delete routine template

### Calendar & Export

#### GET `/api/export/calendar`
Get calendar heatmap data

**Query Params:**
- `year` - Year (default: current year)
- `month` - Month (1-12, default: current month)

#### GET `/api/export`
Export workout logs to CSV

**Query Params:**
- `startDate` - Filter by start date
- `endDate` - Filter by end date
- `status` - Filter by status

## Deployment

### Backend Deployment (Heroku Example)

1. Create a Heroku app:

```bash
heroku create workout-tracker-api
```

2. Add MongoDB add-on or use MongoDB Atlas:

```bash
heroku addons:create mongolab:sandbox
```

3. Set environment variables:

```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
```

4. Deploy:

```bash
git subtree push --prefix backend heroku main
```

### Frontend Deployment (Vercel Example)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy from frontend directory:

```bash
cd frontend
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` = your backend API URL

### Alternative: Docker Deployment

Create `docker-compose.yml` for easy deployment:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/workout-tracker
      - JWT_SECRET=your-secret-key
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

Run with: `docker-compose up`

## Usage Guide

### First Time Setup

1. **Login**: Use the demo credentials (anthony/password123 or sakshee/password123)
2. **View Dashboard**: See your current plan progress and stats
3. **Check Plan**: Navigate to "Plan" to see your workout structure
4. **Log Workout**: Click "Today" to log your daily workout

### Daily Workflow

1. Navigate to **Today** page
2. View today's workout template
3. Select workout status (completed/partial/skipped)
4. Optionally add metrics (weight, energy, sleep, RPE)
5. Add notes if needed
6. Submit in under 30 seconds

### Creating Custom Routines

1. Go to **Routines** page
2. Click "Create New"
3. Enter routine name and description
4. Upload an attachment (image or PDF) if needed
5. Save to library for future use

### Viewing Progress

- **Dashboard**: See streak, phase progress, weekly completion
- **Calendar**: Visual heatmap of workout adherence
- **History**: Detailed log table with filters and export

### Exporting Data

1. Navigate to **History** page
2. Apply filters if desired (date range, status)
3. Click "Export CSV"
4. Download file for offline analysis

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod --version`
- Check connection string in `.env`
- For Atlas, whitelist your IP address

### Port Already in Use

```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port in .env
PORT=5001
```

### JWT Token Expired

- Tokens expire after 30 minutes (configurable in `.env`)
- Simply log in again to get a new token

### File Upload Errors

- Ensure `UPLOAD_DIR` exists or will be created
- Check file size (max 10MB)
- Verify file types (images and PDFs only)

## Future Enhancements (v2)

- Email reminders for missed workouts
- Advanced analytics and charts
- Plan cloning and versioning
- Admin view for both users
- PWA support for offline functionality
- Integration with fitness wearables
- Mobile native apps (React Native)

## License

MIT License - feel free to use this project for personal use.

## Support

For issues or questions, please create an issue in the repository.
