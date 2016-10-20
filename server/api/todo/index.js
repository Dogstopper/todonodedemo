'use strict';

var express = require('express');
var controller = require('./todo.controller.js');
var auth = require('../../auth/auth.service');

var router = express.Router();

// GET Todos
router.get('/', auth.hasRole('user'), controller.getAllTodos);
router.get('/:id', auth.hasRole('user'), controller.getTodo);

// POST Todo
router.post('/', auth.hasRole('user'), controller.createTodo);

// Remove Todo
router.delete('/:id', auth.hasRole('user'), controller.deleteTodo);

module.exports = router;
