# GG TODO Backend

A modern, scalable Node.js backend for the GG TODO task management application. Built with Express, MongoDB, Firebase Authentication, and Socket.IO for real-time features.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🔐 **Authentication** - Firebase Auth + JWT for secure user management
- 📝 **Todo Management** - Create, update, delete, and organize tasks
- 📊 **Statistics** - Track productivity with todo stats and calendar views
- 🔄 **Real-time** - Socket.IO integration for live updates
- 🛡️ **Security** - Helmet, CORS, Rate limiting, Input validation
- 📚 **API Documentation** - Swagger/OpenAPI documentation
- 🧪 **Testing** - Jest test suite with coverage reports
- 🚀 **Production Ready** - Vercel serverless deployment support

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

# Start development server
```
npm run dev
```

For detailed setup instructions, see [SETUP.md](./SETUP.md).

```
src/
├── config/          # Configuration files
├── modules/         # API Modules
├── models/          # Response models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── services/        # External service integrations
├── utils/           # Utility functions
└── tests/           # Test files
```

## 🔌 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint  | Description               |
| ------ | --------- | ------------------------- |
| POST   | `/signup` | Register new user         |
| POST   | `/login`  | Login with email/password |
| POST   | `/social` | Google/Social login       |
| POST   | `/logout` | Logout user               |

### Users (`/api/v1/user`)

| Method | Endpoint   | Description              |
| ------ | ---------- | ------------------------ |
| GET    | `/`        | List users (admin)       |
| GET    | `/profile` | Get current user profile |
| PUT    | `/profile` | Update profile           |
| POST   | `/create`  | Create user (admin)      |
| PUT    | `/:userId` | Update user (admin)      |

Run the test suite:
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```
