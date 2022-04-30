import { v4 as uuid } from 'uuid';
import { Activity } from './Activity';
import { Bulletin } from './Bulletin';
import { Class } from './Class';
import { Test } from './Test';
import { Work } from './Work';

interface IDiscipline {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title: string;
	teacher: string;
	workloadTotal: number;
	workloadCompleted?: number;
	workloadProgress?: number;
	media?: number;
	activities?: Activity[];
	tests?: Test[];
	workers?: Work[];
	classes?: Class[];
	bulletins?: Bulletin[];
	credits: number;
	status?: string;
}

class Discipline implements IDiscipline {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title: string;
	teacher: string;
	workloadTotal: number;
	workloadCompleted?: number;
	workloadProgress?: number;
	media?: number
	activities?: Activity[];
	tests?: Test[];
	workers?: Work[];
	classes?: Class[];
	bulletins?: Bulletin[];
	credits: number;
	status?: string;

	constructor({ id = uuid(), createdAt = new Date(), title, teacher, workloadTotal, workloadCompleted = 0, workloadProgress = 0, media = 0, activities = [], tests = [], workers = [], classes = [], bulletins = [], credits, status = 'In progress' }: IDiscipline) {
    this.id = id;
		this.createdAt = createdAt;
		this.updatedAt = new Date();
		this.title = title;
		this.teacher = teacher;
		this.workloadTotal = workloadTotal;
		this.workloadCompleted = workloadCompleted;
		this.workloadProgress = workloadProgress;
		this.media = media;
		this.activities = activities;
		this.tests = tests;
		this.workers = workers;
		this.classes = classes;
		this.credits = credits;
		this.status = status;
		this.bulletins = [
			new Bulletin({
				title: 'N1',
				note: '0'
			}),
			new Bulletin({
				title: 'N2',
				note: '0'
			}),
			new Bulletin({
				title: 'FN',
				note: '0'
			}),
			new Bulletin({
				title: 'MD',
				note: '0'
			})
		];
	}
}

export { Discipline };