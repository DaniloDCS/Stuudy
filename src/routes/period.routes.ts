import { connection } from './../database/connection';
import App from '../App';
import { Router } from 'express';

import { Discipline } from '../models/Discipline';

const PeriodRoutes = Router();

PeriodRoutes.post('/:id/discipline/create', async(req, res) => {
  const id = req.params.id;
  const { title, teacher, workloadTotal, credits, status } = req.body;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = course.periods.find(c => c.id === id);
 
  const periods = course.periods;
  
  let index = periods.indexOf(period);
  let courseIndex = courses.indexOf(course);
  
  let discipline = new Discipline({ title, teacher, workloadTotal, credits, status });

  period.workloadTotal = Number(period.workloadTotal || 0) + Number(workloadTotal);
  course.workloadTotal = Number(course.workloadTotal) + Number(workloadTotal);
  period.workloadProgress = (period.workloadCompleted / period.workloadTotal) * 100;
  course.workloadProgress = (course.workloadCompleted / course.workloadTotal) * 100;
  course.disciplinesTotal = Number(course.disciplinesTotal) + 1;
  period.disciplines.push(discipline);
  period.creditsTotal = Number(period.creditsTotal) + Number(credits);
  course.creditsTotal = Number(course.creditsTotal) + Number(credits);
  period.updatedAt = new Date();
  
  course.periods[index] = period;
  courses[courseIndex] = course;
 
  App.set('course', course);
  App.set('courses', courses);

  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/course/' + courseIndex);
});

PeriodRoutes.get('/:id/finish', (req, res) => {
  const { id } = req.params;

  let courses = App.get('courses');
  let course = App.get('course');
  let indexCourse = courses.indexOf(course);
  let period = App.get('period');
  let indexPeriod = course.periods.indexOf(period);

  period.status = 'Finished';
  period.updatedAt = new Date();

  period.disciplines.forEach(discipline => {
    discipline.status = 'Finished';
    discipline.updatedAt = new Date();
    course.disciplinesConcluded = Number(course.disciplinesConcluded) + 1;
    course.disciplinesProgress = (course.disciplinesConcluded / course.disciplinesTotal) * 100;
  });

  course.periodsCompleted = Number(course.periodsCompleted) + 1;
  course.periodsProgress = (course.periodsCompleted / course.periodsTotal) * 100;
  course.periods[indexPeriod] = period;
  courses[indexCourse] = course;
  App.set('courses', courses);
  App.set('course', course);
  App.set('period', period);

  return res.redirect('/course/' + course.id);
});

PeriodRoutes.get('/:id/reopen', (req, res) => {
  const { id } = req.params;

  let courses = App.get('courses');
  let course = App.get('course');
  let indexCourse = courses.indexOf(course);
  let period = App.get('period');
  let indexPeriod = course.periods.indexOf(period);

  period.status = 'Studying';
  period.updatedAt = new Date();
  
  course.periodsCompleted = Number(course.periodsCompleted) - 1;
  course.periodsProgress = (course.periodsCompleted / course.periodsTotal) * 100;
  course.periods[indexPeriod] = period;
  courses[indexCourse] = course;
  App.set('courses', courses);
  App.set('course', course);
  App.set('period', period);

  return res.redirect('/course/' + indexCourse);
});

PeriodRoutes.get('/:id/start', (req, res) => {
  const { id } = req.params;

  let courses = App.get('courses');
  let course = App.get('course');
  let indexCourse = courses.indexOf(course);
  let period = App.get('period');
  let indexPeriod = course.periods.indexOf(period);

  period.status = 'Studying';
  period.updatedAt = new Date();

  course.periods[indexPeriod] = period;
  courses[indexCourse] = course;
  App.set('courses', courses);
  App.set('course', course);
  App.set('period', period);

  return res.redirect('/course/' + indexCourse);
});

PeriodRoutes.post('/:id/edit', (req, res) => {
  const { id } = req.params;
  const { title, status, startedIn, finishedIn } = req.body;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = course.periods.find(period => period.id == id);

  let courseIndex = courses.indexOf(course);

  let periods = course.periods;
  let index = periods.indexOf(period);

  period.title = title;
  period.status = status;
  period.startedIn = startedIn;
  period.finishedIn = finishedIn;
  period.updatedAt = new Date();
  
  course.periods[index] = period;
  courses[courseIndex] = course;

  App.set('courses', courses);
  App.set('course', course);
  App.set('period', period);  
  
  return res.redirect('/course/' + courseIndex);
});

export { PeriodRoutes }; 
