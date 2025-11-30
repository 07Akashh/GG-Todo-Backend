const appUtils = require("../../utils/appUtils");
const todosService = require("./service");
const successMsg = require("../../success_msg.json");
const custExc = require("../../customException");

//========================== Todos Service Functions =========================

const todosList = (info) => {
  return todosService
    .TodosList(info, true)
    .countDocuments()
    .then((total) => {
      this.total = total;
      let list = todosService.TodosList(info);
      return appUtils.sorting(list, info);
    })
    .then((todos) => ({ total: this.total, todos }))
    .catch((err) => {
      appUtils.logError({
        moduleName: "Todos",
        methodName: "todosList",
        err,
      });
      throw err;
    });
};

const updateTodo = (info) => {
  return todosService
    .findByIdAndUpdate({ _id: info.todoId }, info.update)
    .then((todo) => {
      if (!todo) {
        throw custExc.completeCustomException("todo_nt_found");
      }
      return successMsg.todo_update;
    })
    .catch((err) => {
      appUtils.logError({ moduleName: "Todos", methodName: "UpdateTodo", err });
      throw err;
    });
};

const deleteTodo = (info) => {
  return todosService
    .findByIdAndUpdate({ _id: info.todoId }, { isDeleted: true, updatedBy: info.updatedBy })
    .then((todo) => {
      if (!todo) {
        throw custExc.completeCustomException("todo_nt_found");
      }
      return successMsg.todo_delete;
    })
    .catch((err) => {
      appUtils.logError({ moduleName: "Todos", methodName: "deleteTodo", err });
      throw err;
    });
};
const createTodo = (todaData) => {
  return todosService
    .saveTodos(todaData)
    .then(() => successMsg.todo_create)
    .catch((err) => {
      throw err;
    });
};


const todosStats = (userId) => {
  const allPromise = todosService.TodosList({ userId }, true).countDocuments();
  const upcomingPromise = todosService.TodosList({ userId, status: 1 }, true).countDocuments();
  const completedPromise = todosService.TodosList({ userId, status: 3 }, true).countDocuments();

  return Promise.all([allPromise, upcomingPromise, completedPromise])
    .then(([all, upcoming, completed]) => {
      const stats = [
        { label: "All Todos", value: all },
        { label: "Upcoming", value: upcoming },
        { label: "Completed", value: completed },
      ];
      return stats;
    })
    .catch((err) => {
      appUtils.logError({
        moduleName: "Todos",
        methodName: "todosStats",
        err,
      });
      throw err;
    });
};

/**
 * Map status to color
 * Status: 1=pending, 2=in-progress, 3=completed, 4=archived
 * Colors: Green (completed), Yellow (in-progress), Red (pending), Dark Red (archived)
 */

const todosStatsByDate = (info) => {
  return todosService
    .TodosList(info, true)
    .countDocuments()
    .then((total) => {
      this.total = total;
      let list = todosService.TodosList(info, true);
      return appUtils.sorting(list, info);
    })
    .then((todos) => ({ total: this.total, todos }))
    .catch((err) => {
      appUtils.logError({
        moduleName: "Todos",
        methodName: "todosStatsByDate",
        err,
      });
      throw err;
    });
};

//========================== Export Module Start =======================
module.exports = {
  todosList,
  updateTodo,
  createTodo,
  deleteTodo,
  todosStats,
  todosStatsByDate,
};
//========================== Export Module End =========================
