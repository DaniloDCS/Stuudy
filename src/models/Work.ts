import { v4 as uuid } from 'uuid';

interface IWork {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title: string;
	description: string;
	content: string;
	link?: string;
	noteTotal: number;
	noteObtained?: number;
	dateStarted: Date;
	dateFinished?: Date;
	status?: string;
}

class Work implements IWork {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title: string;
	description: string;
	content: string;
	link?: string;
	noteTotal: number;
	noteObtained?: number;
	dateStarted: Date;
	dateFinished?: Date;
	status?: string;

  constructor({ id = uuid(), createdAt = new Date(), updatedAt = new Date(), title, description, content, link = "/", noteTotal, noteObtained = 0.0, dateStarted, dateFinished = new Date(), status = "Waiting for start" }: IWork) {
    this.id = id;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.title = title;
		this.description = description;
		this.content = content;
		this.link = link;
		this.noteTotal = noteTotal;
		this.noteObtained = noteObtained;
		this.dateStarted = dateStarted;
		this.dateFinished = dateFinished;
		this.status = status;
	}
}

function NOW() {
  return new Date();
}

export { Work };