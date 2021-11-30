const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response
      .status(400)
      .json({ error: "Nao enconstramos nenhum usernmae" });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const checksExistsUsernameAccount = users.some(
    (user) => user.username === username
  );

  if (checksExistsUsernameAccount) {
    return response.status(400).json({ error: "Username Existente" });
  }
  users.push({ name, username, id: uuidv4(), todos: [] });

  const user = users.find((user) => user.username === username);

  return response.json(user).status(201);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  Array.isArray(user.todos);
  return response.json(user.todos).status(201);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const { title, deadline } = request.body;

  const todo = user.todos.push({
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    created_at: new Date(),
    done: false,
  });

  const formatTodo = todo - 1;

  return response.status(201).json(user.todos[formatTodo]);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const findId = user.todos.find((findId) => findId.id === id);

  if (!findId) {
    return response
      .status(404)
      .json({ error: "Nao enconstramos nenhum usernmae" });
  }

  for (var i in user.todos) {
    if (user.todos[i].id == id) {
      user.todos[i].title = title;
      user.todos[i].deadline = deadline;
      break;
    }
  }

  return response.json({ title, deadline, done: false }).status(200);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const findId = user.todos.find((findId) => findId.id === id);

  if (!findId) {
    return response
      .status(404)
      .json({ error: "Nao enconstramos nenhum usernmae" });
  }

  for (var i in user.todos) {
    if (user.todos[i].id == id) {
      user.todos[i].done = true;
      break;
    }
  }
  return response.json(user.todos[i]).status(201);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const findId = user.todos.find((findId) => findId.id === id);

  if (!findId) {
    return response
      .status(404)
      .json({ error: "Nao enconstramos nenhum usernmae" });
  }

  for (var i in user.todos) {
    if (user.todos[i].id == id) {
      user.todos.splice(i, 1);
      break;
    }
  }
  return response.status(204).send();
});

module.exports = app;
