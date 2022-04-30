import { v4 as uuid } from 'uuid';

interface INote {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title?: string;
	content: string;
	correct?: boolean;
	value?: number;
	valueObtained?: number;
}

class Note implements INote {
	id?: string;
	title?: string;
	createdAt?: Date;
	updatedAt?: Date;
	content: string;
	correct?: boolean;
	value?: number;
	valueObtained?: number;

  constructor({ id = uuid(), createdAt = new Date(), updatedAt = new Date(), content, title = '', correct = false, value = 0, valueObtained = 0 }: INote) {
    this.id = id;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.content = content;
		this.title = title;
		this.correct = correct;
		this.value = value;
		this.valueObtained = valueObtained;
	}
}

export { Note };