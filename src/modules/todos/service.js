const todosDao = require("./model");
const baseDao = require("../../baseDao");
const { pagination, regexIncase } = require("../../utils/appUtils");
const appUtils = require("../../utils/appUtils");
//========================== Load Modules End =========================

/**
 * Save a new syllabus
 * @param {Object} info - Syllabus details
 */
const saveTodos = (info) => {
  const newUser = new todosDao(info);
  return newUser.save();
};

/**
 * Get a list of syllabus with optional filtering and pagination
 * @param {Object} info - Filter and pagination data
 * @param {Boolean} all - Flag to determine if pagination is required
 */
const TodosList = (info, all = false) => {
  let query = _queryFilter(info),
    project = {
      title: 1,
      description: 1,
      userId: 1,
      status: 1,
      dueDate: 1,
    },
    paginate = {};

  if (!all) {
    paginate = pagination(info);
  }
  return baseDao(todosDao).getMany(query, project, paginate);
};

/**
 * Helper function to build the query filter for searching syllabuses
 * @param {Object} info - Filter criteria
 * @returns {Object} - Query filter object
 */
const _queryFilter = (info) => {
  let filter = { isDeleted: false };
  if (info.title) filter.title = appUtils.regexIncase(info.title);
  if (info.description)
    filter.description = appUtils.regexIncase(info.description);
  if (info.userId) filter.userId = info.userId;
  if (info.status) filter.status = info.status;
  if (info.dueDate?.from || info.dueDate?.to) {
    filter.dueDate = {};
    if (info.dueDate.from) {
      filter.dueDate.$gte = new Date(info.dueDate.from);
    }
    if (info.dueDate.to) {
      filter.dueDate.$lte = new Date(info.dueDate.to);
    }
  }
  return filter;
};

//========================== Export Module Start =======================
module.exports = {
  ...baseDao(todosDao),
  saveTodos,
  TodosList,
};
//========================== Export Module End =========================
