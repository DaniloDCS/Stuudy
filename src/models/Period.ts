import { v4 as uuid } from 'uuid';
import { Discipline } from './Discipline';

interface IPeriod {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title: string;
	status: string;
	CRA?: number;
	disciplines?: Discipline[];
	disciplinesConcluded?: number;
	workloadTotal?: number;
	workloadCompleted?: number;
	workloadProgress?: number;
	creditsTotal?: number;
	startedIn?: Date;
	finishedIn?: Date;
}

class Period implements IPeriod {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title: string;
	status: string;
	CRA?: number;
	disciplines?: Discipline[];
	disciplinesConcluded?: number;
	workloadTotal?: number;
	workloadCompleted?: number;
	workloadProgress?: number;
	creditsTotal?: number;
	startedIn?: Date;
	finishedIn?: Date;

	constructor({ title, status, workloadTotal = 0, workloadCompleted = 0, workloadProgress = 0, disciplines = [], CRA = 0, creditsTotal = 0, startedIn, finishedIn, disciplinesConcluded = 0 }: IPeriod) {
		if (!this.id) this.id = uuid();
	
		this.title = title;
		this.status = status;
		this.workloadTotal = workloadTotal;
		this.workloadCompleted = workloadCompleted;
		this.workloadProgress = workloadProgress;
		this.disciplines = disciplines;
		this.CRA = CRA;
		this.creditsTotal = creditsTotal;
		this.startedIn = startedIn;
		this.finishedIn = finishedIn;
		this.disciplinesConcluded = disciplinesConcluded;

		if (!this.createdAt) this.createdAt = new Date();
		this.updatedAt = new Date();
	}
}

function NOW() {
  return new Date();
}

export { Period };