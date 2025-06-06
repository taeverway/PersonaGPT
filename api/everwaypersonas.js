// everway_api_handler.js

const dataStore = {
  personas: [],
  problems: [],
  solutions: [],
  environments: [],
  products: [],
  jobstobedone: [],
  solutionpemd: [],
  behaviors: [],
  years: [],
  quarters: [],
  months: [],
  motivators: [],
  insights: [],
  relationships: []
};

let idCounter = 1;

function getNextId() {
  return idCounter++;
}

function createHandler(type) {
  return (req, res) => {
    if (req.method === 'GET') {
      res.status(200).json(dataStore[type]);
    } else if (req.method === 'POST') {
      const item = req.body;
      item.id = getNextId();
      if (type === 'insights' && !item.name && item.description) {
        item.name = item.description.split(' ').slice(0, 5).join(' ');
      }
      dataStore[type].push(item);
      res.status(201).json(item);
    } else if (req.method === 'PUT') {
      const item = req.body;
      const index = dataStore[type].findIndex(i => i.id === item.id);
      if (index !== -1) {
        dataStore[type][index] = item;
        res.status(200).json(item);
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      const index = dataStore[type].findIndex(i => i.id == id);
      if (index !== -1) {
        dataStore[type].splice(index, 1);
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  };
}

module.exports = createHandler;
