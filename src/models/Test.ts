import { v4 as uuid } from 'uuid';
import { Note } from './Note';

interface ITest {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title: string;
	questions?: Note[];
	noteTotal: number;
	noteObtained?: number;
	date: Date;
	comments?: Note[];
	link?: string;
	statusOfCorrection?: string;
}

class Test implements ITest {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title: string;
	questions?: Note[];
	noteTotal: number;
	noteObtained?: number;
	date: Date;
	comments?: Note[];
	link?: string;
	statusOfCorrection?: string;

	constructor({ id = uuid(), createdAt = new Date(), updatedAt = new Date(), title, questions = [], noteTotal, noteObtained = 0, date, comments = [], link = "/", statusOfCorrection = "Waiting" }: ITest) {
    this.id = id;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.title = title;
		this.questions = questions;
		this.noteTotal = noteTotal;
		this.noteObtained = noteObtained;
		this.date = date;
		this.comments = comments;
		this.link = link;
		this.statusOfCorrection = statusOfCorrection;
	}
}

function NOW() {
  return new Date();
}

export { Test };