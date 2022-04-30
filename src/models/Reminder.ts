import { v4 as uuid } from 'uuid';

interface IReminder {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title: string;
	content: string;
	dateStarted: Date;
	dateFinished: Date;
	status?: string;
}

class Reminder implements IReminder {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title: string;
	content: string;
	dateStarted: Date;
	dateFinished: Date;
	status?: string;

  constructor({ id = uuid(), createdAt = new Date(), updatedAt = new Date(), title, content, dateStarted, dateFinished, status = "Pending" }: IReminder) {
    this.id = id;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.title = title;
		this.content = content;
		this.dateStarted = dateStarted;
		this.dateFinished = dateFinished;
		this.status = status;
	}
}

function NOW() {
  return new Date();
}

export { Reminder };