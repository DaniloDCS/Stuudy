import { connection } from './../database/connection';
import { Router } from 'express';
import App from '../App';
import { Class } from '../models/Class';
import { Note } from '../models/Note';
import { Activity } from '../models/Activity';
import { Bulletin } from '../models/Bulletin';
import { Test } from '../models/Test';
const DisciplineRoutes = Router();

DisciplineRoutes.get('/period/:periodId/:id', (req, res) => {
  const { periodId, id } = req.params;

  if (App.get('courses') === undefined) return res.redirect('/');

  const courses = App.get('courses');
  const course = App.get('course');
  const period = course.periods[periodId];
  const discipline = period.disciplines[id];

  App.set('discipline', discipline);
  App.set('period', period);

  return res.render('pages/discipline', { discipline, course: courses.indexOf(course) || 0, user: App.get('user') });
});

DisciplineRoutes.post('/class/register', async(req, res) => {
  const { title, content, quantity, date, type, IWasPresent } = req.body;
  let { comments } = req.body;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);

  let listOfComments = [];

  if (comments) {
    Object.keys(comments).forEach(comment => {
      listOfComments.push(new Note({ content: comments[comment] }));
    });
  }

  let CLASS = new Class({ title, content, quantity, date, type, IWasPresent, comments: listOfComments });

  discipline.workloadCompleted = Number(discipline.workloadCompleted) + Number(CLASS.quantity);
  discipline.workloadProgress = ((discipline.workloadCompleted / discipline.workloadTotal) * 100).toFixed(2);
  period.workloadCompleted = Number(period.workloadCompleted) + Number(CLASS.quantity);
  period.workloadProgress = ((period.workloadCompleted / period.workloadTotal) * 100).toFixed(2);
  course.workloadCompleted = Number(course.workloadCompleted) + Number(CLASS.quantity);
  course.workloadProgress = ((course.workloadCompleted / course.workloadTotal) * 100).toFixed(2);

  discipline.updatedAt = new Date();

  discipline.classes.push(CLASS);
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('course', course);
  App.set('courses', courses);
  App.set('period', period);
  App.set('discipline', discipline);

  const { body, error } = await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  console.log(body, error)

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.post('/class/:id/edit', async(req, res) => {
  const id = req.params.id;
  const { title, content, quantity, date, type, IWasPresent, comments } = req.body;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);

  let CLASS = discipline.classes.find(classItem => classItem.id === id);
  let classIndex = discipline.classes.indexOf(CLASS);

  discipline.workloadCompleted = Number(discipline.workloadCompleted) - Number(CLASS.quantity);
  discipline.workloadProgress = ((discipline.workloadCompleted / discipline.workloadTotal) * 100).toFixed(2);
  period.workloadCompleted = Number(period.workloadCompleted) - Number(CLASS.quantity);
  period.workloadProgress = ((period.workloadCompleted / period.workloadTotal) * 100).toFixed(2);
  course.workloadCompleted = Number(course.workloadCompleted) - Number(CLASS.quantity);
  course.workloadProgress = ((course.workloadCompleted / course.workloadTotal) * 100).toFixed(2);

  CLASS.title = title;
  CLASS.content = content;
  CLASS.quantity = quantity;
  CLASS.date = date;
  CLASS.type = type;
  CLASS.IWasPresent = IWasPresent;

  let listOfComments = [];

  Object.keys(comments).forEach(comment => {
    listOfComments.push(new Note({ content: comments[comment] }));
  });

  CLASS.comments = listOfComments;
  CLASS.updatedAt = new Date();

  discipline.workloadCompleted = Number(discipline.workloadCompleted) + Number(CLASS.quantity);
  discipline.workloadProgress = ((discipline.workloadCompleted / discipline.workloadTotal) * 100).toFixed(2);
  period.workloadCompleted = Number(period.workloadCompleted) + Number(CLASS.quantity);
  period.workloadProgress = ((period.workloadCompleted / period.workloadTotal) * 100).toFixed(2);
  course.workloadCompleted = Number(course.workloadCompleted) + Number(CLASS.quantity);
  course.workloadProgress = ((course.workloadCompleted / course.workloadTotal) * 100).toFixed(2);

  discipline.updatedAt = new Date();
  course.updatedAt = new Date();

  discipline.classes[classIndex] = CLASS;
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('course', course);
  App.set('courses', courses);
  App.set('period', period);
  App.set('discipline', discipline);
  
  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.get('/class/:id/delete', async(req, res) => {
  const id = req.params.id;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);

  let CLASS = discipline.classes.find(classItem => classItem.id === id);
  let classIndex = discipline.classes.indexOf(CLASS);

  discipline.workloadCompleted = Number(discipline.workloadCompleted) - Number(CLASS.quantity);
  discipline.workloadProgress = ((discipline.workloadCompleted / discipline.workloadTotal) * 100).toFixed(2);
  period.workloadCompleted = Number(period.workloadCompleted) - Number(CLASS.quantity);
  period.workloadProgress = ((period.workloadCompleted / period.workloadTotal) * 100).toFixed(2);
  course.workloadCompleted = Number(course.workloadCompleted) - Number(CLASS.quantity);
  course.workloadProgress = ((course.workloadCompleted / course.workloadTotal) * 100).toFixed(2);

  discipline.updatedAt = new Date();
  course.updatedAt = new Date();

  discipline.classes.splice(classIndex, 1);
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('course', course);
  App.set('courses', courses);
  App.set('period', period);
  App.set('discipline', discipline);

  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.post('/:id/edit', async(req, res) => {
  const id = req.params.id;
  const { title, teacher, workloadTotal, credits, status } = req.body;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);

  period.workloadTotal = Number(period.workloadTotal) - Number(discipline.workloadTotal);
  course.workloadTotal = Number(course.workloadTotal) - Number(discipline.workloadTotal);
  period.workloadProgress = (period.workloadCompleted / period.workloadTotal) * 100;
  course.workloadProgress = (course.workloadCompleted / course.workloadTotal) * 100;

  discipline.title = title;
  discipline.teacher = teacher;
  discipline.workloadTotal = workloadTotal;
  discipline.credits = credits;
  discipline.status = status;
  discipline.updatedAt = new Date();

  period.workloadTotal = Number(period.workloadTotal) + Number(discipline.workloadTotal);
  course.workloadTotal = Number(course.workloadTotal) + Number(discipline.workloadTotal);
  period.workloadProgress = (period.workloadCompleted / period.workloadTotal) * 100;
  course.workloadProgress = (course.workloadCompleted / course.workloadTotal) * 100;

  course.updatedAt = new Date();
  period.updatedAt = new Date();

  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('courses', courses);
  App.set('course', course);
  App.set('period', period);
  App.set('discipline', discipline);

  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.get('/:id/delete', async(req, res) => {
  const id = req.params.id;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);

  period.workloadTotal = Number(period.workloadTotal) - Number(discipline.workloadTotal);
  course.workloadTotal = Number(course.workloadTotal) - Number(discipline.workloadTotal);
  period.workloadCompleted = Number(period.workloadCompleted) - Number(discipline.workloadCompleted);
  course.workloadCompleted = Number(course.workloadCompleted) - Number(discipline.workloadCompleted);
  period.workloadProgress = ((period.workloadCompleted / period.workloadTotal) * 100) || 0;
  course.workloadProgress = ((course.workloadCompleted / course.workloadTotal) * 100) || 0;
  period.creditsTotal = Number(period.creditsTotal) - Number(discipline.credits);
  course.creditsTotal = Number(course.creditsTotal) - Number(discipline.credits);

  course.updatedAt = new Date();
  period.updatedAt = new Date();

  period.disciplines.splice(disciplineIndex, 1);
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('courses', courses);
  App.set('course', course);
  App.set('period', period);
  App.set('discipline', '');

  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/course/' + courseIndex);
});

DisciplineRoutes.post('/activity/register', async(req, res) => {
  const { title, date, comments, questions } = req.body;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);

  let listOfComments = [];
  let listOfQuestions = [];

  if (comments) {
    Object.keys(comments).forEach(comment => {
      listOfComments.push(new Note({ content: comments[comment] }));
    });
  }

  if (questions) {
    Object.keys(questions).forEach(question => {
      listOfQuestions.push(new Note({ content: questions[question].content, title: questions[question].title, correct: questions[question].correct }));
    });
  }

  let activity = new Activity({ title, date, comments: listOfComments, questions: listOfQuestions });

  discipline.updatedAt = new Date();

  discipline.activities.push(activity);
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('course', course);
  App.set('courses', courses);
  App.set('period', period);
  App.set('discipline', discipline);


  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.get('/activity/:id/delete', async(req, res) => {
  const id = req.params.id;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');
  let activity = discipline.activities.find(activity => activity.id === id);

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);
  let activityIndex = discipline.activities.indexOf(activity);

  discipline.activities.splice(activityIndex, 1);
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('courses', courses);
  App.set('course', course);
  App.set('period', period);
  App.set('discipline', discipline);


  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.get('/activity/:id/complete', async(req, res) => {
  const id = req.params.id;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');
  let activity = discipline.activities.find(activity => activity.id === id);

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);
  let activityIndex = discipline.activities.indexOf(activity);

  activity.status = "Concluded";
  activity.updatedAt = new Date();

  discipline.activities[activityIndex] = activity;
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('courses', courses);
  App.set('course', course);
  App.set('period', period);
  App.set('discipline', discipline);


  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.get('/activity/:id/pending', async(req, res) => {
  const id = req.params.id;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');
  let activity = discipline.activities.find(activity => activity.id === id);

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);
  let activityIndex = discipline.activities.indexOf(activity);

  activity.status = "Pending";
  activity.updatedAt = new Date();

  discipline.activities[activityIndex] = activity;
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('courses', courses);
  App.set('course', course);
  App.set('period', period);
  App.set('discipline', discipline);


  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.post('/activity/:id/edit', async(req, res) => {
  const id = req.params.id;
  const { title, date, comments, questions } = req.body;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');
  let activity = discipline.activities.find(activity => activity.id === id);

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);
  let activityIndex = discipline.activities.indexOf(activity);

  let listOfComments = [];
  let listOfQuestions = [];

  if (comments) {
    Object.keys(comments).forEach(comment => {
      listOfComments.push(new Note({ content: comments[comment] }));
    });
  } else {
    listOfComments = activity.comments;
  }

  if (questions) {
    Object.keys(questions).forEach(question => {
      listOfQuestions.push(new Note({ content: questions[question].content, title: questions[question].title, correct: questions[question].correct }));
    });
  } else {
    listOfQuestions = activity.questions;
  }

  activity.title = title;
  activity.date = date;
  activity.comments = listOfComments;
  activity.questions = listOfQuestions;
  activity.updatedAt = new Date();

  discipline.updatedAt = new Date();

  discipline.activities[activityIndex] = activity;
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('course', course);
  App.set('courses', courses);
  App.set('period', period);
  App.set('discipline', discipline);


  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.post('/notes/save', async(req, res) => {
  const { notes } = req.body;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');
  let bulletins = []

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);

  if (notes) {
    let md = 0;
    Object.keys(notes).forEach((note, index) => {
      if (note === 'MD') {
        bulletins.push(new Bulletin({ title: 'MD', note: String((md / (Object.keys(notes).length - 2))) }));
        discipline.media = (md / (Object.keys(notes).length - 2));
      } else if (note === 'FN') {
        bulletins.push(new Bulletin({ title: 'FN', note: notes[note] }));
      } else {
        md += Number(notes[note]);
        bulletins.push(new Bulletin({ title: note, note: notes[note] }));
      }
    });
  } else {
    bulletins = discipline.bulletins;
  }

  discipline.updatedAt = new Date();

  discipline.bulletins = bulletins;
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('course', course);
  App.set('courses', courses);
  App.set('period', period);
  App.set('discipline', discipline);


  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.post('/test/register', async(req, res) => {
  const { title, questions, noteTotal, noteObtained, date, comments, link } = req.body; 

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);

  let listOfComments = [];
  let listOfQuestions = [];

  if (comments) {
    Object.keys(comments).forEach(comment => {
      listOfComments.push(new Note({ content: comments[comment] }));
    });
  }

  if (questions) {
    Object.keys(questions).forEach(question => {
      listOfQuestions.push(new Note({ content: questions[question].content, title: questions[question].title, correct: questions[question].correct, value: questions[question].value }));
    });
  }

  let test = new Test({ title, questions: listOfQuestions, noteTotal, noteObtained, date, comments: listOfComments, link });

  discipline.updatedAt = new Date();

  discipline.tests.push(test);
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('course', course);
  App.set('courses', courses);
  App.set('period', period);
  App.set('discipline', discipline);


  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.get('/test/:id/delete', async(req, res) => {
  const id = req.params.id;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');
  let test = discipline.tests.find(test => test.id === id);

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);
  let testIndex = discipline.tests.indexOf(test);

  discipline.tests.splice(testIndex, 1);
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('courses', courses);
  App.set('course', course);
  App.set('period', period);
  App.set('discipline', discipline);


  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.post('/test/:id/edit', async(req, res) => {
  const { id } = req.params;
  const { title, questions, noteTotal, noteObtained, date, comments, link } = req.body; 

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');
  let test = discipline.tests.find(test => test.id === id);

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);
  let testIndex = discipline.tests.indexOf(test);

  let listOfComments = [];
  let listOfQuestions = [];

  if (comments) {
    Object.keys(comments).forEach(comment => {
      listOfComments.push(new Note({ content: comments[comment] }));
    });
  } else {
    listOfComments = test.comments;
  }

  let noteTotalUpdate = 0;
  if (questions) {
    Object.keys(questions).forEach(question => {
      noteTotalUpdate += Number(questions[question].value);
      listOfQuestions.push(new Note({ content: questions[question].content, title: questions[question].title, correct: questions[question].correct, value: questions[question].value }));
    });
  } else {
    listOfQuestions = test.questions;
  }

  test.title = title;
  test.questions = listOfQuestions;
  test.noteTotal = noteTotalUpdate;
  test.noteObtained = noteObtained;
  test.date = date;
  test.comments = listOfComments;
  test.link = link;
  test.updatedAt = new Date();

  discipline.updatedAt = new Date();

  discipline.tests.splice(testIndex, 1, test);
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('course', course);
  App.set('courses', courses);
  App.set('period', period);
  App.set('discipline', discipline);


  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.post('/test/:id/correction', async(req, res) => {
  const { id } = req.params;
  const { questions } = req.body;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');
  let test = discipline.tests.find(test => test.id === id);
  
  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);
  let testIndex = discipline.tests.indexOf(test);

  let noteTotalUpdate = 0;
  Object.keys(questions).forEach((question, index) => {
    noteTotalUpdate += Number(questions[question].valueObtained);
    test.questions[index].noteObtained = Number(questions[question].valueObtained);
    if (questions[question].correct) {
      test.questions[index].correct = true;
    } else {
      test.questions[index].correct = false;
      test.questions[index].valueObtained = 0;
    }
  });
 
  test.noteObtained = noteTotalUpdate;
  test.statusOfCorrection = 'Concluded';
  test.updatedAt = new Date();

  discipline.updatedAt = new Date();

  discipline.tests.splice(testIndex, 1, test);
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('course', course);
  App.set('courses', courses);
  App.set('period', period);
  App.set('discipline', discipline);


  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.post('/work/register', async(req, res) => {
  const { title, questions, noteTotal, noteObtained, date, comments, link } = req.body; 

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);

  let listOfComments = [];
  let listOfQuestions = [];

  if (comments) {
    Object.keys(comments).forEach(comment => {
      listOfComments.push(new Note({ content: comments[comment] }));
    });
  }

  if (questions) {
    Object.keys(questions).forEach(question => {
      listOfQuestions.push(new Note({ content: questions[question].content, title: questions[question].title, correct: questions[question].correct, value: questions[question].value }));
    });
  }

  let work = new Test({ title, questions: listOfQuestions, noteTotal, noteObtained, date, comments: listOfComments, link });

  discipline.updatedAt = new Date();

  discipline.workers.push(work);
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('course', course);
  App.set('courses', courses);
  App.set('period', period);
  App.set('discipline', discipline);


  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.get('/work/:id/delete', async(req, res) => {
  const id = req.params.id;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');
  let work = discipline.workers.find(work => work.id === id);

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);
  let workIndex = discipline.workers.indexOf(work);

  discipline.workers.splice(workIndex, 1);
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('courses', courses);
  App.set('course', course);
  App.set('period', period);
  App.set('discipline', discipline);


  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.post('/work/:id/edit', async(req, res) => {
  const { id } = req.params;
  const { title, questions, noteTotal, noteObtained, date, comments, link } = req.body;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');
  let work = discipline.workers.find(work => work.id === id);

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);
  let workIndex = discipline.workers.indexOf(work);

  let listOfComments = [];
  let listOfQuestions = [];

  if (comments) {
    Object.keys(comments).forEach(comment => {
      listOfComments.push(new Note({ content: comments[comment] }));
    });
  } else {
    listOfComments = work.comments;
  }

  let noteTotalUpdate = 0;
  if (questions) {
    Object.keys(questions).forEach(question => {
      noteTotalUpdate += Number(questions[question].value);
      listOfQuestions.push(new Note({ content: questions[question].content, title: questions[question].title, correct: questions[question].correct, value: questions[question].value }));
    });
  } else {
    listOfQuestions = work.questions;
  }

  work.title = title;
  work.questions = listOfQuestions;
  work.noteTotal = noteTotalUpdate;
  work.noteObtained = noteObtained;
  work.date = date;
  work.comments = listOfComments;
  work.link = link;
  work.updatedAt = new Date();

  discipline.updatedAt = new Date();

  discipline.workers.splice(workIndex, 1, work);
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('course', course);
  App.set('courses', courses);
  App.set('period', period);
  App.set('discipline', discipline);


  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

DisciplineRoutes.post('/work/:id/correction', async(req, res) => {
  const { id } = req.params;
  const { questions } = req.body;

  let courses = App.get('courses');
  let course = App.get('course');
  let period = App.get('period');
  let discipline = App.get('discipline');
  let work = discipline.workers.find(work => work.id === id);

  let courseIndex = courses.indexOf(course);
  let periodIndex = course.periods.indexOf(period);
  let disciplineIndex = period.disciplines.indexOf(discipline);
  let workIndex = discipline.workers.indexOf(work);

  let noteTotalUpdate = 0;
  Object.keys(questions).forEach((question, index) => {
    noteTotalUpdate += Number(questions[question].valueObtained);
    work.questions[index].noteObtained = Number(questions[question].valueObtained);
    if (questions[question].correct) {
      work.questions[index].correct = true;
    } else {
      work.questions[index].correct = false;
      work.questions[index].valueObtained = 0;
    }
  });

  work.noteObtained = noteTotalUpdate;
  work.statusOfCorrection = 'Concluded';
  work.updatedAt = new Date();

  discipline.updatedAt = new Date();

  discipline.workers.splice(workIndex, 1, work);
  period.disciplines[disciplineIndex] = discipline;
  course.periods[periodIndex] = period;
  courses[courseIndex] = course;

  App.set('course', course);
  App.set('courses', courses);
  App.set('period', period);
  App.set('discipline', discipline);


  await connection.from('History').update({ history: { courses } }).match({ userId: App.get('user').userId });

  return res.redirect('/discipline/period/' + periodIndex + "/" + disciplineIndex);
});

export { DisciplineRoutes }; 
