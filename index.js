const express = require('express');
const server = express();

server.use(express.json());

// A variável `projects` pode ser `const` pois um `array` pode receber adições
// ou exclusões meso sendo uma const.
const projects = [];

// Middleware que checa se o projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!projects) {
    return res.status(400).json({ error: 'Project not found'});
  }

  return next();
}

// Middleware que dá log no número de reqs
function logRequests(req, res, next) {
  console.count('Número de requisições');

  return next();
}

server.use(logRequests);

// Return all projects
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// POST
// req.body: id, title
// cadastra um novo projeto
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  
  return res.json(project);
});

// PUT
// Route params: id
// Req body: title
// Altera o título do projeto com o id presente nos params
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

// DELETE
// route params: id
// Deleta o project associado ao id presente nos parâmetros da rota
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

// POST: Tarefas
// route params: id
// Adiciona uma nova tarefa no project escolhido via id.
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});


server.listen(3000);
