const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectID(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    //use return here so that if it comes to this point, it gives an error and does not run anything after this
    return response.status(400).json({ error: "Invalid project ID" });
  }

  return next();
}

app.use("/repositories/:id", validateProjectID);

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter((project) => project.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const projectIndex = repositories.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Id not found" });
  }

  const project = {
    id,
    url,
    title,
    techs,
    likes: repositories[projectIndex].likes,
  };

  repositories[projectIndex] = project;

  return response.json(repositories[projectIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Id not found" });
  }

  repositories.splice(projectIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Id not found" });
  }
  repositories[projectIndex].likes += 1;

  console.log(repositories[projectIndex].likes);

  return response.json(repositories[projectIndex]);
});

module.exports = app;
