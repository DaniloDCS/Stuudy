import { v4 as uuid } from 'uuid';

interface IBulletin {
	id?: string;
	title: string;
	description?: string;
	note?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

class Bulletin implements IBulletin {
	id?: string;
	title: string;
	description?: string;
	note?: string;
	createdAt?: Date;
	updatedAt?: Date;

  constructor({ id = uuid(), createdAt = new Date(), updatedAt = new Date(), title, description = "Evaluation", note = '-' }: IBulletin) {
    this.id = id;
		this.title = title;
		this.description = description;
		this.note = note;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}

function NOW() {
  return new Date();
}

export { Bulletin };