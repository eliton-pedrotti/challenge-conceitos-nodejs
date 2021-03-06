const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];


function checksExistsUserAccount(req, res, next) {
  const { username } = req.headers;
  const user = users.find(todos => todos.username === username);

  if (!user) {
    return res.status(400).json({ error: "User not found!" });
  }

  req.user = user;

  return next();


}

app.post('/users', (req, res) => {
  const { name, username } = req.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return res.status(400).json({ error: "Customer already exists!" });
  }

  const user = {
    name,
    username,
    id: uuidv4(),
    todos: []
  }

  users.push(user);


  return res.status(201).json(user);

});

app.use(checksExistsUserAccount);

app.get('/todos', (req, res) => {

  const { user } = req;

  return res.status(201).json(user.todos);

});

app.post('/todos', (req, res) => {
  const { title, deadline } = req.body;
  const { user } = req;

  const todoOperation = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(todoOperation);

  return res.status(201).json(todoOperation);
});

app.put('/todos/:id', (req, res) => {

  const { user } = req;

  const { title, deadline } = req.body;

  const { id } = req.params


  const todo = user.todos.find((todo) => {
    return todo.id === id
  });

  if (!todo) {
    return res.status(404).json({ error: 'Todo inexistente!' })
  }

  todo.title = title;
  todo.deadline = deadline;

  return res.status(201).json(todo);

});

app.patch('/todos/:id/done', (req, res) => {
  const { user } = req;

  const { id } = req.params

  const todo = user.todos.find((todo) => {
    return todo.id === id
  });

  if (!todo) {
    return res.status(404).json({ error: 'Todo inexistente!' })
  }

  todo.done = true;

  return res.status(201).json(todo);

});

app.delete('/todos/:id', (req, res) => {
  const { user } = req;

  const { id } = req.params

  const todo = user.todos.find((todo) => {
    return todo.id === id
  });

  if (!todo) {
    return res.status(404).json({ error: 'Todo inexistente!' })
  }

  user.todos.splice(todo, 1)

  return res.status(204).json({ message: "Todo deletado com sucesso!" });
});

module.exports = app;