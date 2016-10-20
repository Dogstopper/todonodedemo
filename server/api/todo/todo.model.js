'use strict';

var mongoose = require('mongoose');

var todoSchema = mongoose.Schema({
  user: { type: String, ref: 'User'},
  todo: String,
  date: String
});

todoSchema.statics.createTodo = function(user_id, item, date, callback) {
  var todo = new Todo();
  todo.user = user_id;
  todo.todo = item;
  todo.date = date;
  todo.save(callback);
};

todoSchema.statics.getTodos = function(user_id, callback) {
  Todo.find({ user: user_id}, callback);
};

todoSchema.statics.getTodo = function (user_id, todo_id, callback) {
  // want to make sure the requesting user owns the todo item,
  // so we're not simply doing findById
  Todo.find({ user: user_id, _id: todo_id }, callback)
};

todoSchema.statics.removeTodo = function(user_id, todo_id, callback) {
  Todo.findOneAndRemove({ user: user_id, _id: todo_id}, callback)
};

var Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
