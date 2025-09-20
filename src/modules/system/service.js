const mongoose = require("mongoose")

class SystemService {
  constructor() {
    this.userDao = createDao("User")
    this.sessionDao = createDao("Session")
  }

  getDatabaseHealth() {
    return new Promise((resolve, reject) => {
      const state = mongoose.connection.readyState
      const states = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
      }

      if (state === 1) {
        resolve({
          status: "healthy",
          state: states[state],
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          name: mongoose.connection.name,
        })
      } else {
        reject(new Error(`Database unhealthy: ${states[state]}`))
      }
    })
  }

  getDatabaseStats() {
    return new Promise((resolve, reject) => {
      if (mongoose.connection.readyState !== 1) {
        reject(new Error("Database not connected"))
        return
      }

      const db = mongoose.connection.db
      db.stats()
        .then((stats) => {
          resolve({
            collections: stats.collections,
            dataSize: stats.dataSize,
            storageSize: stats.storageSize,
            indexes: stats.indexes,
            indexSize: stats.indexSize,
            objects: stats.objects,
          })
        })
        .catch((error) => {
          reject(new Error(`Get database stats failed: ${error.message}`))
        })
    })
  }

  getUserCount() {
    return this.userDao
      .getMany({ isDeleted: false })
      .then((users) => users.length)
      .catch((error) => {
        throw new Error(`Get user count failed: ${error.message}`)
      })
  }

  getActiveUserCount() {
    return this.userDao
      .getMany({ isDeleted: false, status: true })
      .then((users) => users.length)
      .catch((error) => {
        throw new Error(`Get active user count failed: ${error.message}`)
      })
  }

  getActiveSessionCount() {
    return this.sessionDao
      .getMany({ isActive: true })
      .then((sessions) => sessions.length)
      .catch((error) => {
        throw new Error(`Get active session count failed: ${error.message}`)
      })
  }

  getRecentUsers(limit = 10) {
    return this.userDao
      .getManyWithSort({ isDeleted: false }, { password: 0, __v: 0, frgt_pass: 0 }, { limit }, { createdAt: -1 })
      .then((users) => users)
      .catch((error) => {
        throw new Error(`Get recent users failed: ${error.message}`)
      })
  }

  getSystemLogs(limit = 50) {
    // In a real implementation, you would have a logs collection
    // For now, we'll return mock data
    return new Promise((resolve) => {
      const mockLogs = []
      for (let i = 0; i < limit; i++) {
        mockLogs.push({
          id: i + 1,
          level: ["info", "warn", "error"][Math.floor(Math.random() * 3)],
          message: `System log entry ${i + 1}`,
          timestamp: new Date(Date.now() - i * 60000),
          source: "system",
        })
      }
      resolve(mockLogs)
    })
  }

  cleanupExpiredSessions() {
    const expiredDate = new Date()
    expiredDate.setDate(expiredDate.getDate() - 7) // 7 days ago

    return this.sessionDao
      .updateMany(
        {
          $or: [{ expiresAt: { $lt: new Date() } }, { lastAccessedAt: { $lt: expiredDate } }],
          isActive: true,
        },
        { isActive: false, deactivatedAt: new Date() },
      )
      .then((result) => result.modifiedCount || 0)
      .catch((error) => {
        throw new Error(`Cleanup expired sessions failed: ${error.message}`)
      })
  }

  getSystemMetrics() {
    return Promise.all([
      this.getUserCount(),
      this.getActiveUserCount(),
      this.getActiveSessionCount(),
      this.getDatabaseStats(),
    ])
      .then(([totalUsers, activeUsers, activeSessions, dbStats]) => ({
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
        },
        sessions: {
          active: activeSessions,
        },
        database: dbStats,
        timestamp: new Date(),
      }))
      .catch((error) => {
        throw new Error(`Get system metrics failed: ${error.message}`)
      })
  }

  performHealthCheck() {
    return this.getDatabaseHealth()
      .then((dbHealth) => ({
        status: "healthy",
        timestamp: new Date(),
        services: {
          database: dbHealth,
          api: {
            status: "healthy",
            uptime: process.uptime(),
          },
          memory: {
            used: process.memoryUsage().heapUsed,
            total: process.memoryUsage().heapTotal,
            external: process.memoryUsage().external,
          },
        },
      }))
      .catch((error) => ({
        status: "unhealthy",
        timestamp: new Date(),
        error: error.message,
        services: {
          database: { status: "unhealthy", error: error.message },
          api: {
            status: "healthy",
            uptime: process.uptime(),
          },
        },
      }))
  }
}

module.exports = new SystemService()
