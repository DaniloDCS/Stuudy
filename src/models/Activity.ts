import { v4 as uuid } from 'uuid';
import { Note } from './Note';

interface IActivity {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title: string;
	questions?: Note[];
	comments?: Note[];
	link?: string;
	status?: string;
	date?: Date;
	correct?: boolean;
}

class Activity implements IActivity {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title: string;
	questions?: Note[];
	comments?: Note[];
	link?: string;
	status?: string;
	date?: Date;

	constructor({ id = uuid(), createdAt = new Date(), updatedAt = new Date(), title, questions = [], comments = [], link = "/", date = new Date() }: IActivity) {
    this.id = id;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.title = title;
		this.questions = questions;
		this.comments = comments;
		this.link = link;
		this.status = "Pending";
		this.date = date;
	}
}

function NOW() {
  return new Date();
}

export { Activity };