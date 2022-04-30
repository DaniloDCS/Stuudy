import { Router } from 'express';
const routes = Router();

import { UserRoutes } from './routes/user.routes';
import { CourseRoutes } from './routes/course.routes';
import { PeriodRoutes } from './routes/period.routes';
import { DisciplineRoutes } from './routes/discipline.routes';
import { ActivityRoutes } from './routes/activity.routes';
import { ReminderRoutes } from './routes/reminder.routes';
import App from './App';
import { Auth } from './database/authenticate';

routes.get('/', Auth, (req, res) => {
  if (App.get('courses') === undefined) {
    App.set('courses', []);
  }

  const user = App.get('user');

  const courses = App.get('courses');

  return res.render('pages/dashboard', {
    courses,
    user
  });
});

routes.get('/signin', (req, res) => {
  return res.render('signin', {
    layout: false
  });
});

routes.get('/signup', (req, res) => {
  return res.render('signup', {
    layout: false
  });
});

routes.use('/user', UserRoutes);
routes.use('/course', Auth, CourseRoutes);
routes.use('/period', Auth, PeriodRoutes);
routes.use('/discipline', Auth, DisciplineRoutes);
routes.use('/activity', Auth, ActivityRoutes);
routes.use('/reminder', Auth, ReminderRoutes);

export { routes };