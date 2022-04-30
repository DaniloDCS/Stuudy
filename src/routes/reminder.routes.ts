import { Reminder } from '../models/Reminder'
import { Router } from 'express';
const ReminderRoutes = Router();

ReminderRoutes.get('/', (req, res) => {
  return res.render('pages/reminderInit');
});

ReminderRoutes.get('/create', (req, res) => {
  return res.render('pages/reminder');
});

ReminderRoutes.get('/update', (req, res) => {
  return res.render('pages/reminderUpdate');
});

ReminderRoutes.post('/create', (req, res) => {
  const {id, createdAt, updatedAt, title, content, dateStarted, dateFinished, status} = req.body;

  const _reminder = new Reminder({ id, createdAt, updatedAt, title, content, dateStarted, dateFinished, status});

  return res.json({ Reminder: "create", body: req.body, _reminder });
});

ReminderRoutes.get('/:id', (req, res) => {
  const { id } = req.params;

  return res.json({ Reminder: "read", id: req.params.id });
});

ReminderRoutes.put('/:id', (req, res) => {
  const {id, createdAt, updatedAt, title, content, dateStarted, dateFinished, status} = req.body;

  return res.json({ Reminder: "create", body: req.body });
});

ReminderRoutes.delete('/:id', (req, res) => {
  const { id } = req.params;

  return res.json({ Reminder: "delete", id: req.params.id });
});

export { ReminderRoutes }; 
