# GG TODO Backend - Setup Guide

Complete guide to set up the GG TODO Backend for local development and production deployment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (v6.0 or higher) or MongoDB Atlas account
- **Redis** (optional, for caching)
- **Git**

### Verify Installation

```bash
node --version   # Should be >= 18.0.0
npm --version    # Should be >= 9.0.0
```

---

## 🚀 Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ggtodo-backend.git
cd ggtodo-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#-environment-variables) section below).

### 4. Start the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:4200` by default.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

### Server Configuration

```env
# Server
PORT=4200
NODE_ENV=development
```

### Database Configuration

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ggtodo

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/ggtodo?retryWrites=true&w=majority
```

### Firebase Configuration

You need a Firebase project for authentication. Get these from the Firebase Console:

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789012345678901
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

### JWT Configuration

```env
# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
```

### AWS S3 Configuration (Optional)

For file uploads:

```env
# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=ggtodo-files
```

### Email Configuration (Optional)

For sending emails:

```env
# Email (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
APP_URL=https://your-frontend-url.com
```

> **Note:** For Gmail, you need to create an [App Password](https://support.google.com/accounts/answer/185833)

### Redis Configuration (Optional)

```env
# Redis
REDIS_URL=redis://localhost:6379
```

### Rate Limiting

```env
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Basic Auth (API Access)

```env
# Basic Auth for API access
BASIC_AUTH_USERNAME=admin
BASIC_AUTH_PASSWORD=your-basic-auth-password
```

---

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "ggtodo")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable the following providers:
   - Email/Password
   - Google (for social login)

### 3. Generate Service Account Key

1. Go to **Project Settings** (gear icon)
2. Navigate to **Service Accounts** tab
3. Click **Generate new private key**
4. Download the JSON file
5. Copy values to your `.env` file

Alternatively, place the JSON file as `my-project-firebase-adminsdk.json` in the project root.

---

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB

```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Click **Connect** → **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Add to `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/ggtodo?retryWrites=true&w=majority
```

---

## 📦 Redis Setup (Optional)

Redis is used for caching and session management.

### Local Installation

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
```

### Verify Redis

```bash
redis-cli ping
# Should return: PONG
```

---

## ✅ Verify Setup

### 1. Start the Server

```bash
npm run dev
```

You should see:

```
//************************* Nodejs App **************************//

Connected to DB
redis connected
Express server listening on 4200, in development mode
```

### 2. Test the API

```bash
# Health check
curl http://localhost:4200/

# Test API (replace with your basic auth credentials)
curl -u admin:password http://localhost:4200/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 3. Access Swagger Documentation

Open in browser: `http://localhost:4200/api-docs`

---

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test types
npm run test:unit
npm run test:integration
```

---

## 🚀 Production Deployment

### Vercel Deployment

The project includes `vercel.json` for serverless deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4200
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t ggtodo-backend .
docker run -p 4200:4200 --env-file .env ggtodo-backend
```

---

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port
lsof -i :4200

# Kill the process
kill -9 <PID>
```

#### MongoDB Connection Failed

- Verify MongoDB is running: `mongosh`
- Check connection string in `.env`
- Ensure IP is whitelisted (for Atlas)

#### Firebase Auth Errors

- Verify service account JSON is correct
- Check `FIREBASE_PRIVATE_KEY` has proper newlines
- Ensure Firebase project ID matches

#### Redis Connection Failed

- Verify Redis is running: `redis-cli ping`
- Check `REDIS_URL` in `.env`

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Socket.IO Documentation](https://socket.io/docs/)

---

## 🆘 Need Help?

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing issues on GitHub
3. Open a new issue with detailed error logs
