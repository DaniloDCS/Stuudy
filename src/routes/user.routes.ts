import { User } from '../models/User'
import { Router } from 'express';
import App from '../App';
import { connection } from '../database/connection';

const UserRoutes = Router();

UserRoutes.get('/logout', (req, res) => {
  connection.auth.signOut();
  App.set('courses', '');
  App.set('course', '');
  App.set('discipline', '');
  App.set('period', '');
  App.set('user', '');
  return res.redirect('/signin');
});

UserRoutes.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.redirect('/signin');

  const { error, body } = await connection.from('Account').select('*').match({ username });

  let email = body[0].email;

  if (error) return res.redirect('/signin');

  const user = await connection.auth.signIn({ email, password });

  const courses = await connection.from('History').select('history').match({ userId: body[0].userId });

  App.set('courses', courses.body[0].history.courses);

  if (!user) return res.redirect('/signin');

  App.set('user', body[0]);

  return res.redirect('/');
});

UserRoutes.post('/signup', async (req, res) => {
  const { email, phone, name, biography, username, password } = req.body;

  if (!username || !password || !email || !biography || !username || !phone || !name ) return res.redirect('/signin');

  const { user, error } = await connection.auth.signUp({
    email,
    password
  }, {
    data: {
      name,
      username,
      phone,
      biography
    }
  });

  if (error) return res.redirect('/signin');

  await connection.from('Account').insert({ email, username, biography, phone, name, userId: user.id });
  await connection.from('History').insert({ userId: user.id });

  return res.redirect('/');
});


export { UserRoutes }; 
