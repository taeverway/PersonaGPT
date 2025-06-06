
// everway-api/api/everway.js

export default async function handler(req, res) {
  const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH'];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Simulated in-memory store (replace with DB or file write in production)
  let store = global.everwayData || {
    personas: [],
    problems: [],
    solutions: [],
    environments: [],
    products: [],
    relationships: []
  };

  if (req.method === 'GET') {
    return res.status(200).json(store);
  }

  const { type, data } = req.body;
  if (!type || !store[type]) {
    return res.status(400).json({ error: 'Invalid or missing type' });
  }

  if (req.method === 'POST') {
    store[type].push(data);
    global.everwayData = store;
    return res.status(201).json({ success: true, added: data });
  }

  if (req.method === 'PUT') {
    const index = store[type].findIndex(item => item.id === data.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    store[type][index] = data;
    global.everwayData = store;
    return res.status(200).json({ success: true, updated: data });
  }

  if (req.method === 'PATCH') {
    if (req.body.newStructure) {
      // Dangerous operation: Replace entire structure
      store = req.body.newStructure;
      global.everwayData = store;
      return res.status(200).json({ success: true, structureUpdated: true });
    }
    return res.status(400).json({ error: 'Missing newStructure payload' });
  }
}
