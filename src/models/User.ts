import { v4 as uuid } from 'uuid';

interface IUser {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	name: string;
	username: string;
	email: string;
	phone: string;
	biography?: string;
	password: string;
}

class User implements IUser {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	name: string;
	username: string;
	email: string;
	phone: string;
	biography?: string;
	password: string;

  constructor({ id = uuid(), createdAt = new Date(), updatedAt = new Date(), name, username, email, phone, biography = "Hello, i am a new user!", password }: IUser) {
    this.id = id;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.name = name;
		this.username = username;
		this.email = email;
		this.phone = phone;
		this.biography = biography;
		this.password = password;
	}
}

function NOW() {
  return new Date();
}

export { User };