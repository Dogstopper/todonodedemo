'use strict';

var Todo = require('./todo.model.js');

exports.getAllTodos = function(req, res) { 
  Todo.getTodos(req.user._id, function(err, todos) {
    if (err) return res.statusCode(500).json(err);
    return res.status(200).json(todos);
  })
};

exports.getTodo = function(req, res) {
  Todo.getTodo(req.user._id, req.param('id'), function(err, todo) {
    if (err) return res.status(500).json(err);
    return res.status(200).json(todo);
  })
};

exports.createTodo = function(req, res) {
  var item = String(req.body.todo);
  var date = String(req.body.date);
  Todo.createTodo(req.user._id, item, date, function(err, todo) {
    if (err) return res.status(500).json(err);
    return res.status(200).json(todo);
  })
};

exports.deleteTodo = function(req, res) {
  Todo.removeTodo(req.user._id, req.param('id'), function(err, results) {
    if (err) return res.status(500).json(err);
    return res.status(200).json(results);
  })
};