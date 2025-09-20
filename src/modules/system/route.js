const express = require("express")
const systemFacade = require("./facade")
const systemValidators = require("./validators")

const router = express.Router()

router.get("/health", (req, res) => {
  systemFacade
    .getSystemStatus()
    .then((status) => {
      const statusCode = status.overall === "healthy" ? 200 : 503
      res.status(statusCode).json({
        success: status.overall === "healthy",
        data: status,
      })
    })
    .catch((error) => {
      res.status(503).json({
        success: false,
        message: error.message,
      })
    })
})

router.get("/dashboard", (req, res) => {
  systemFacade
    .getSystemDashboard()
    .then((dashboard) => {
      res.json({
        success: true,
        data: dashboard,
      })
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    })
})

router.get("/analytics", (req, res) => {
  systemValidators
    .validateSystemAnalytics(req.query)
    .then((validatedData) => {
      return systemFacade.getSystemAnalytics(validatedData.timeRange)
    })
    .then((analytics) => {
      res.json({
        success: true,
        data: analytics,
      })
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    })
})

router.get("/logs", (req, res) => {
  systemValidators
    .validateSystemLogs(req.query)
    .then((validatedData) => {
      return systemFacade.getSystemLogs(validatedData)
    })
    .then((logs) => {
      res.json({
        success: true,
        data: logs,
      })
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    })
})

router.get("/configuration", (req, res) => {
  systemFacade
    .getSystemConfiguration()
    .then((config) => {
      res.json({
        success: true,
        data: config,
      })
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    })
})

router.put("/configuration", (req, res) => {
  systemValidators
    .validateConfigurationUpdate(req.body)
    .then((validatedData) => {
      return systemFacade.updateSystemConfiguration(validatedData)
    })
    .then((result) => {
      res.json({
        success: true,
        data: result,
      })
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    })
})

router.post("/maintenance", (req, res) => {
  systemValidators
    .validateMaintenance(req.body)
    .then((validatedData) => {
      return systemFacade.performSystemMaintenance()
    })
    .then((report) => {
      res.json({
        success: true,
        message: "System maintenance completed",
        data: report,
      })
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    })
})

router.get("/report", (req, res) => {
  systemFacade
    .generateSystemReport()
    .then((report) => {
      res.json({
        success: true,
        data: report,
      })
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    })
})

module.exports = router
