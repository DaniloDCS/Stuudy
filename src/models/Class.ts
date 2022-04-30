import { v4 as uuid } from 'uuid';
import { Note } from './Note';

interface IClass {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title: string;
	content: string;
	quantity: number;
	date: Date;
	comments?: Note[];
	IWasPresent?: boolean;
	type?: string;
}

class Class implements IClass {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title: string;
	content: string;
	quantity: number;
	date: Date;
	comments?: Note[];
	IWasPresent?: boolean;
	type?: string;

	constructor({ id = uuid(), createdAt = new Date(), updatedAt = new Date(), title, content, quantity, date, comments = [], type = "class", IWasPresent = true }: IClass) {
    this.id = id;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.title = title;
		this.content = content;
		this.quantity = quantity;
		this.date = date;
		this.comments = comments;
		this.type = type;
		this.IWasPresent = IWasPresent;
	}
}

function NOW() {
  return new Date();
}

export { Class };