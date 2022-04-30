import { v4 as uuid } from 'uuid';
import { Period } from './Period';

interface ICourse {
	id?: string;
	name: string;
	grade: string;
	qualification: string;
	address?: string;
	CRA?: number;
	status: string;
	startedIn: Date;
	finishedIn?: Date;
	workloadTotal?: number;
	workloadCompleted?: number;
	workloadProgress?: number;
	disciplinesTotal?: number;
	disciplinesConcluded?: number;
	disciplinesProgress?: number;
	periodsTotal?: number;
	periodsCompleted?: number;
	periodsProgress?: number;
	creditsTotal?: number;
	periods?: Period[];
	createdAt?: Date;
	updatedAt?: Date;
}

class Course implements ICourse {
	id?: string;
	name: string;
	grade: string;
	qualification: string;
	address?: string;
	CRA?: number;
	status: string;
	startedIn: Date;
	finishedIn?: Date;
	workloadTotal?: number;
	workloadCompleted?: number;
	workloadProgress?: number;
	disciplinesTotal?: number;
	disciplinesConcluded?: number;
	disciplinesProgress?: number;
	periodsTotal?: number;
	periodsCompleted?: number;
	periodsProgress?: number;
	creditsTotal?: number;
	periods?: Period[];
	createdAt?: Date;
	updatedAt?: Date;

	constructor({ name, grade, qualification, address = "", status = "Studying", CRA = 0, workloadTotal = 0, workloadCompleted = 0, workloadProgress = 0, startedIn, finishedIn = new Date(), disciplinesTotal = 0, disciplinesConcluded = 0, disciplinesProgress = 0, periodsTotal = 0, periodsCompleted = 0, periodsProgress = 0, periods = [], creditsTotal = 0 }: ICourse) {
		if (!this.id) this.id = uuid();
		
		this.name = name;
		this.grade = grade;
		this.qualification = qualification;
		this.address = address;
		this.CRA = CRA;
		this.periods = periods;
		this.workloadTotal = workloadTotal;
		this.workloadCompleted = workloadCompleted;
		this.workloadProgress = workloadProgress;
		this.status = status;
		this.startedIn = startedIn;
		this.finishedIn = finishedIn;
		this.disciplinesTotal = disciplinesTotal;
		this.disciplinesConcluded = disciplinesConcluded;
		this.disciplinesProgress = disciplinesProgress;
		this.periodsTotal = periodsTotal;
		this.periodsCompleted = periodsCompleted;
		this.periodsProgress = periodsProgress;
		this.creditsTotal = creditsTotal;

		if (!this.createdAt) this.createdAt = new Date();
		this.updatedAt = new Date();
	}
}

function NOW() {
  return new Date();
}

export { Course };