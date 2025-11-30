const express = require("express");
const todosFacade = require("./facade");
const todoValidator = require("./validators");
const resHndlr = require("../../responseHandler");
const { userAuthenticateTkn } = require("../../middleware/authenticate");

const todosRouter = express.Router();

todosRouter.route("/").get([userAuthenticateTkn("all")], (req, res) => {
  todosFacade
    .todosList(req.query)
    .then((result) => resHndlr.sendSuccess(res, result, req))
    .catch((err) => resHndlr.sendError(res, err));
});

todosRouter.route("/stats").get([userAuthenticateTkn("all")], (req, res) => {
  todosFacade
    .todosStats(req.user._id)
    .then((stats) => resHndlr.sendSuccess(res, {stats}, req))
    .catch((err) => resHndlr.sendError(res, err));
});

todosRouter.route("/calendar").get([userAuthenticateTkn("all")], (req, res) => {
  const info = {
    userId: req.user._id,
  };
  todosFacade
    .todosStatsByDate(info)
    .then((result) => resHndlr.sendSuccess(res, result, req))
    .catch((err) => resHndlr.sendError(res, err));
});

todosRouter
  .route("/")
  .post([todoValidator.createTodo, userAuthenticateTkn("all")], (req, res) => {
    todosFacade
      .createTodo({
        ...req.body,
        userId: req.user._id,
        createdBy: req.user._id,
      })
      .then((result) => resHndlr.sendSuccess(res, result, req))
      .catch((err) => resHndlr.sendError(res, err));
  });

todosRouter
  .route("/:todoId")
  .put([todoValidator.updateTodo, userAuthenticateTkn("all")], (req, res) => {
    todosFacade
      .updateTodo({
        update: { ...req.body, updatedBy: req.user._id },
        ...req.params,
      })
      .then((result) => resHndlr.sendSuccess(res, result, req))
      .catch((err) => resHndlr.sendError(res, err));
  });

todosRouter
  .route("/:todoId")
  .delete([userAuthenticateTkn("all")], (req, res) => {
    todosFacade
      .deleteTodo( {...req.params, updatedby: req.user._id} )
      .then((result) => resHndlr.sendSuccess(res, result, req))
      .catch((err) => resHndlr.sendError(res, err));
  });

module.exports = todosRouter;
