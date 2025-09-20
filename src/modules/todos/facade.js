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

//========================== Export Module Start =======================
module.exports = {
  todosList,
  updateTodo,
  createTodo,
  deleteTodo,
};
//========================== Export Module End =========================
