const systemService = require("./service")

class SystemFacade {
  getSystemStatus() {
    return systemService
      .performHealthCheck()
      .then((healthCheck) => {
        const status = {
          overall: healthCheck.status,
          timestamp: healthCheck.timestamp,
          services: healthCheck.services,
          uptime: process.uptime(),
          version: process.version,
          environment: process.env.NODE_ENV || "development",
        }

        return status
      })
      .catch((error) => {
        throw new Error(`Get system status failed: ${error.message}`)
      })
  }

  getSystemDashboard() {
    return Promise.all([systemService.getSystemMetrics(), systemService.getRecentUsers(5)])
      .then(([metrics, recentUsers]) => ({
        metrics,
        recentUsers,
        systemInfo: {
          nodeVersion: process.version,
          platform: process.platform,
          uptime: process.uptime(),
          environment: process.env.NODE_ENV || "development",
          memoryUsage: process.memoryUsage(),
        },
        timestamp: new Date(),
      }))
      .catch((error) => {
        throw new Error(`Get system dashboard failed: ${error.message}`)
      })
  }

  getSystemAnalytics(timeRange = "24h") {
    return systemService
      .getSystemMetrics()
      .then((metrics) => {
        // In a real implementation, you would query historical data
        // For now, we'll return current metrics with mock historical data
        const analytics = {
          current: metrics,
          trends: {
            userGrowth: this.generateMockTrend("users", timeRange),
            sessionActivity: this.generateMockTrend("sessions", timeRange),
            systemLoad: this.generateMockTrend("load", timeRange),
          },
          timeRange,
          generatedAt: new Date(),
        }

        return analytics
      })
      .catch((error) => {
        throw new Error(`Get system analytics failed: ${error.message}`)
      })
  }

  performSystemMaintenance() {
    return systemService
      .cleanupExpiredSessions()
      .then((cleanedSessions) => {
        const maintenanceReport = {
          timestamp: new Date(),
          actions: [
            {
              action: "cleanup_expired_sessions",
              result: `Cleaned up ${cleanedSessions} expired sessions`,
              success: true,
            },
          ],
          summary: {
            totalActions: 1,
            successfulActions: 1,
            failedActions: 0,
          },
        }

        return maintenanceReport
      })
      .catch((error) => {
        throw new Error(`System maintenance failed: ${error.message}`)
      })
  }

  getSystemLogs(options = {}) {
    const limit = options.limit || 50
    const level = options.level || "all"

    return systemService
      .getSystemLogs(limit)
      .then((logs) => {
        let filteredLogs = logs

        if (level !== "all") {
          filteredLogs = logs.filter((log) => log.level === level)
        }

        return {
          logs: filteredLogs,
          total: filteredLogs.length,
          filters: {
            level,
            limit,
          },
          timestamp: new Date(),
        }
      })
      .catch((error) => {
        throw new Error(`Get system logs failed: ${error.message}`)
      })
  }

  getSystemConfiguration() {
    return new Promise((resolve) => {
      const config = {
        environment: process.env.NODE_ENV || "development",
        port: process.env.PORT || 3000,
        database: {
          connected: require("mongoose").connection.readyState === 1,
          name: require("mongoose").connection.name || "unknown",
        },
        features: {
          authentication: true,
          userManagement: true,
          sessionManagement: true,
          systemMonitoring: true,
        },
        security: {
          jwtEnabled: !!process.env.JWT_SECRET,
          firebaseEnabled: !!process.env.FIREBASE_PROJECT_ID,
          rateLimitEnabled: true,
        },
        timestamp: new Date(),
      }

      resolve(config)
    })
  }

  updateSystemConfiguration(configUpdates) {
    return new Promise((resolve, reject) => {
      // In a real implementation, you would validate and apply configuration changes
      // For now, we'll just return a success message
      const allowedUpdates = ["rateLimitEnabled", "maintenanceMode", "debugMode"]
      const validUpdates = {}

      for (const [key, value] of Object.entries(configUpdates)) {
        if (allowedUpdates.includes(key)) {
          validUpdates[key] = value
        }
      }

      if (Object.keys(validUpdates).length === 0) {
        reject(new Error("No valid configuration updates provided"))
      } else {
        resolve({
          success: true,
          message: "Configuration updated successfully",
          updates: validUpdates,
          timestamp: new Date(),
        })
      }
    })
  }

  generateSystemReport() {
    return Promise.all([
      this.getSystemStatus(),
      this.getSystemMetrics(),
      this.getSystemConfiguration(),
      this.getSystemLogs({ limit: 10 }),
    ])
      .then(([status, metrics, config, logs]) => ({
        report: {
          status,
          metrics,
          configuration: config,
          recentLogs: logs.logs,
        },
        generatedAt: new Date(),
        reportId: this.generateReportId(),
      }))
      .catch((error) => {
        throw new Error(`Generate system report failed: ${error.message}`)
      })
  }

  // Helper methods
  generateMockTrend(type, timeRange) {
    const dataPoints = timeRange === "24h" ? 24 : timeRange === "7d" ? 7 : 30
    const trend = []

    for (let i = 0; i < dataPoints; i++) {
      trend.push({
        timestamp: new Date(Date.now() - i * (timeRange === "24h" ? 3600000 : 86400000)),
        value: Math.floor(Math.random() * 100) + 50,
      })
    }

    return trend.reverse()
  }

  generateReportId() {
    return `SYS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

module.exports = new SystemFacade()
