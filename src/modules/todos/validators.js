const Joi = require("joi");
const cusExc = require("../../customException");
const constant = require("./../../constant");

const todoValidationSchema = Joi.object({
  title: Joi.string().trim().max(200).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.max": "Title cannot exceed 200 characters",
    "any.required": "Title is required",
  }),

  description: Joi.string().trim().min(5).required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "string.min": "Description must be at least 5 characters",
    "any.required": "Description is required",
  }),

  dueDate: Joi.date().required().messages({
    "date.base": "Due date must be a valid date",
    "any.required": "Due date is required",
  }),
});

const todoUpdateValidationSchema = Joi.object({
  title: Joi.string().trim().max(200).optional().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "string.max": "Title cannot exceed 200 characters",
  }),

  description: Joi.string().trim().min(5).optional().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be at least 5 characters",
  }),

  dueDate: Joi.date().optional().messages({
    "date.base": "Due date must be a valid date",
  }),

  status: Joi.number().integer().valid(1, 2, 3, 4).optional().messages({
    "number.base": "Status must be a number",
    "number.integer": "Status must be an integer",
    "any.only": "Status must be between 1 and 4",
  }),

  priority: Joi.number().integer().valid(1, 2, 3, 4).optional().messages({
    "number.base": "Priority must be a number",
    "number.integer": "Priority must be an integer",
    "any.only": "Priority must be between 1 and 4",
  }),
})
  .min(1)
  .messages({
    "object.min": "Nothing to update",
  });

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      errObj({ msg: errorMessages.join(", ") });
    }
    req.body = value;
    next();
  };
}

const errObj = ({ key, msg = false }) => {
  let error = {
    fieldName: key,
    message: constant.MESSAGES.KEY_EMPTY_INVALID.replace("{{key}}", key),
  };
  if (msg) error.message = `${msg}`;
  throw cusExc.validationErrors(error);
};

module.exports = {
  createTodo: validate(todoValidationSchema),
  updateTodo: validate(todoUpdateValidationSchema),
};
