import { Activity } from '../models/Activity'
import { Router } from 'express';
const ActivityRoutes = Router();

ActivityRoutes.get('/', (req, res) => {
  return res.render('pages/activityInit');
});

ActivityRoutes.get('/create', (req, res) => {
  return res.render('pages/activity');
});

ActivityRoutes.get('/update', (req, res) => {
  return res.render('pages/activityUpdate');
});

ActivityRoutes.post('/create', (req, res) => {
  const {id, createdAt, updatedAt, title, questions, comments, link} = req.body;

  const _activity = new Activity({ id, createdAt, updatedAt, title, questions, comments, link});

  return res.json({ Activity: "create", body: req.body, _activity });
});

ActivityRoutes.get('/:id', (req, res) => {
  const { id } = req.params;

  return res.json({ Activity: "read", id: req.params.id });
});

ActivityRoutes.put('/:id', (req, res) => {
  const {id, createdAt, updatedAt, title, questions, comments, link} = req.body;

  return res.json({ Activity: "create", body: req.body });
});

ActivityRoutes.delete('/:id', (req, res) => {
  const { id } = req.params;

  return res.json({ Activity: "delete", id: req.params.id });
});

export { ActivityRoutes }; 
