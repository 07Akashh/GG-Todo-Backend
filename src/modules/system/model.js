const mongoose = require("mongoose")

// System logs schema
const SystemLogSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ["info", "warn", "error", "debug"],
    required: true,
    index: true,
  },
  message: {
    type: String,
    required: true,
  },
  module: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: false,
    index: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  ip: {
    type: String,
    required: false,
  },
  userAgent: {
    type: String,
    required: false,
  },
})

// System metrics schema
const SystemMetricSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  value: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: false,
  },
  tags: {
    type: Map,
    of: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
})

// System configuration schema
const SystemConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Pre-save middleware
SystemConfigSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

// System-specific methods
SystemLogSchema.methods.archive = function () {
  return new Promise((resolve, reject) => {
    // Move to archived collection or mark as archived
    this.archived = true
    this.save()
      .then((result) => resolve(result))
      .catch((error) => reject(error))
  })
}

SystemConfigSchema.methods.toggle = function () {
  return new Promise((resolve, reject) => {
    this.isActive = !this.isActive
    this.save()
      .then((result) => resolve(result))
      .catch((error) => reject(error))
  })
}

// Static methods for system operations
SystemLogSchema.statics.cleanup = function (daysOld = 30) {
  return new Promise((resolve, reject) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    this.deleteMany({ timestamp: { $lt: cutoffDate } })
      .then((result) => resolve(result))
      .catch((error) => reject(error))
  })
}

SystemMetricSchema.statics.getAverageByName = function (name, hours = 24) {
  return new Promise((resolve, reject) => {
    const cutoffDate = new Date()
    cutoffDate.setHours(cutoffDate.getHours() - hours)

    this.aggregate([
      { $match: { name: name, timestamp: { $gte: cutoffDate } } },
      { $group: { _id: null, average: { $avg: "$value" } } },
    ])
      .then((result) => resolve(result[0]?.average || 0))
      .catch((error) => reject(error))
  })
}

const SystemLog = mongoose.model("SystemLog", SystemLogSchema)
const SystemMetric = mongoose.model("SystemMetric", SystemMetricSchema)
const SystemConfig = mongoose.model("SystemConfig", SystemConfigSchema)

module.exports = {
  SystemLog,
  SystemMetric,
  SystemConfig,
  SystemLogSchema,
  SystemMetricSchema,
  SystemConfigSchema,
}
