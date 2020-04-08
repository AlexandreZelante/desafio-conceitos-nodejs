const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0)
    return response.status(400).json({ error: 'Repositório não encontrado' });

  if (url) repositories[repositoryIndex].url = url;
  if (title) repositories[repositoryIndex].title = title;
  if (techs) repositories[repositoryIndex].techs = techs;

  return response.json(repositories[repositoryIndex]);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  let filteredRepositories = repositories.filter(
    (repository) => id !== repository.id
  );

  if (filteredRepositories.length === repositories.length) {
    return response.status(400).json({ error: 'Repositório não encontrado' });
  }

  repositories = filteredRepositories;

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository)
    return response.status(400).json({ error: 'Repositório não encontrado' });

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
