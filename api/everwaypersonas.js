// everway_supabase_handler.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://icztlblnuviiyybjjbjp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljenRsYmxudXZpaXl5YmpqYmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNDU0MjcsImV4cCI6MjA2NDgyMTQyN30.ANXf95ZoKu4TQWMOl46BsMu9IzvtkapWRPLIxsykEfQ';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { structure } = req.query;

  if (!structure) {
    return res.status(400).json({ error: 'Structure not specified' });
  }

  const table = structure.toLowerCase();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw error;
      res.status(200).json(data);
    } else if (req.method === 'POST') {
      const payload = Array.isArray(req.body) ? req.body : [req.body];
      const { data, error } = await supabase.from(table).insert(payload).select();
      if (error) throw error;
      res.status(201).json(data);
    } else if (req.method === 'PUT') {
      const { id, ...updateFields } = req.body;
      const { data, error } = await supabase.from(table).update(updateFields).eq('id', id).select();
      if (error) throw error;
      res.status(200).json(data[0]);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      res.status(204).end();
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
