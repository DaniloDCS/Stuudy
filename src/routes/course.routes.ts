import { connection } from './../database/connection';
import { Course } from '../models/Course'
import { Router } from 'express';
import App from '../App';
import { Period } from '../models/Period';
const CourseRoutes = Router();

CourseRoutes.post('/register', async(req, res) => {
  const { id, createdAt, updatedAt, name, grade, qualification, address, CRA, workloadTotal, workloadCompleted, workloadProgress, status, startedIn, finishedIn, disciplinesTotal, disciplinesConcluded, disciplinesProgress, periodsTotal, periodsCompleted, periodsProgress } = req.body;

  const _course = new Course({ id, createdAt, updatedAt, name, grade, qualification, address, CRA, workloadTotal, workloadCompleted, workloadProgress, status, startedIn, finishedIn, disciplinesTotal, disciplinesConcluded, disciplinesProgress, periodsTotal, periodsCompleted, periodsProgress });

  const courses = App.get('courses');
  courses.push(_course);
  App.set('courses', courses);

  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });
  
  return res.redirect('/course/' + _course.id);
});

CourseRoutes.get('/:id', async(req, res) => {
  const { id } = req.params;
  
  let courses = (await connection.from('History').select('history').match({ userId: App.get('user').userId })).body[0].history.courses;

  App.set('courses', courses);

  const course = courses[id];

  if (course === undefined) return res.redirect('/');

  App.set('course', course);

  return res.render('pages/course', { course, user: App.get('user') });
});

CourseRoutes.get('/:id/finish', (req, res) => {
  const { id } = req.params;

  let courses = App.get('courses');
  let course = courses.find(course => course.id === id);
  course.status = 'Finished';
  course.updatedAt = new Date();

  course.periods.forEach(period => {
    period.status = 'Finished';
    period.updatedAt = new Date();
    period.disciplines.forEach(discipline => {
      discipline.status = 'Finished';
      discipline.updatedAt = new Date();
    });
  });

  App.set('courses', courses);

  return res.redirect('/');
});

CourseRoutes.post('/:id/edit', (req, res) => {
  const { id } = req.params;
  const { name, grade, qualification, address, CRA, workloadTotal, workloadCompleted, workloadProgress, status, startedIn, finishedIn, disciplinesTotal, disciplinesConcluded, disciplinesProgress, periodsTotal, periodsCompleted, periodsProgress } = req.body;

  let courses = App.get('courses');
  let course = courses.find(course => course.id === id);
  let index = courses.indexOf(course);
  course = new Course({ name, grade, qualification, address, CRA, workloadTotal, workloadCompleted, workloadProgress, status, startedIn, finishedIn, disciplinesTotal, disciplinesConcluded, disciplinesProgress, periodsTotal, periodsCompleted, periodsProgress });
  courses[index] = course;
  App.set('courses', courses);

  return res.redirect('/course/' + course.id);
});

CourseRoutes.post('/period/create', async(req, res) => {
  const { title, status, workloadTotal, workloadCompleted, workloadProgress, disciplines, CRA, creditsTotal, startedIn, finishedIn } = req.body;

  let courses = App.get('courses');
  let course = App.get('course');
  let index = courses.indexOf(course);
  let period = new Period({ title, status, workloadTotal, workloadCompleted, workloadProgress, disciplines, CRA, creditsTotal, startedIn, finishedIn });

  if (course.periods.find(period => period.status === 'Studying')) {
    period.status = 'Waiting';
  } else {
    period.status = 'Studying';
  }

  course.periods.push(period);
  course.periodsTotal++;
  course.updatedAt = new Date();
  courses[index] = course;

  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  App.set('courses', courses);

  return res.redirect('/course/' + index);
});

export { CourseRoutes }; 
