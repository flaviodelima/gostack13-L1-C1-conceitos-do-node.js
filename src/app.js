const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  // TODO
  const {title, url, techs} = request.body;
  const id = uuid();

  const repository = {
    id,
    title,
    techs,
    url,
    likes: 0
  }

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const {title, techs, url} = request.body;
  const receivedRepo = {title, techs, url};
  
  const repoIndex = repositories.findIndex(repository => repository.id==id);
  if(repoIndex<0){
    return response.status(400).send({error: "Repository not found"});
  }
  const updatedRepo = {...repositories[repoIndex],...receivedRepo }
  
  repositories[repoIndex] = updatedRepo;
  return response.json(updatedRepo); 
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository =>
    repository.id===id);
  if(repositoryIndex>=0){
    repositories.splice(repositoryIndex, 1);
    return response.status(204).send();  
  }
  return response.status(400).send({error: "Repository not found"});
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => repository.id==id);
  if(repoIndex<0){
    return response.status(400).send({error: "Repository not found"});
  }
  const repository = repositories[repoIndex];
  repository.likes += 1;
  
  return response.json(repository); 
});

module.exports = app;
