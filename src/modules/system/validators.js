const Joi = require("joi")

class SystemValidators {
  static get systemLogsSchema() {
    return Joi.object({
      limit: Joi.number().integer().min(1).max(1000).optional().default(50).messages({
        "number.min": "Limit must be at least 1",
        "number.max": "Limit cannot exceed 1000",
      }),
      level: Joi.string().valid("all", "info", "warn", "error").optional().default("all").messages({
        "any.only": "Level must be one of: all, info, warn, error",
      }),
    })
  }

  static get systemAnalyticsSchema() {
    return Joi.object({
      timeRange: Joi.string().valid("24h", "7d", "30d").optional().default("24h").messages({
        "any.only": "Time range must be one of: 24h, 7d, 30d",
      }),
    })
  }

  static get configurationUpdateSchema() {
    return Joi.object({
      rateLimitEnabled: Joi.boolean().optional(),
      maintenanceMode: Joi.boolean().optional(),
      debugMode: Joi.boolean().optional(),
    })
      .min(1)
      .messages({
        "object.min": "At least one configuration field must be provided",
      })
  }

  static get maintenanceSchema() {
    return Joi.object({
      actions: Joi.array()
        .items(Joi.string().valid("cleanup_sessions", "cleanup_logs", "optimize_database"))
        .optional()
        .default(["cleanup_sessions"]),
    })
  }

  static validate(schema, data) {
    return new Promise((resolve, reject) => {
      const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      })

      if (error) {
        const errorMessages = error.details.map((detail) => detail.message)
        reject(new Error(`Validation failed: ${errorMessages.join(", ")}`))
      } else {
        resolve(value)
      }
    })
  }

  static validateSystemLogs(data) {
    return this.validate(this.systemLogsSchema, data)
  }

  static validateSystemAnalytics(data) {
    return this.validate(this.systemAnalyticsSchema, data)
  }

  static validateConfigurationUpdate(data) {
    return this.validate(this.configurationUpdateSchema, data)
  }

  static validateMaintenance(data) {
    return this.validate(this.maintenanceSchema, data)
  }
}

module.exports = SystemValidators
