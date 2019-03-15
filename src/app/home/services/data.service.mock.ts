import { BehaviorSubject, of } from 'rxjs';

export class MockDataService {
	public ksmSumSubject: BehaviorSubject<number> = new BehaviorSubject(0);

	public setSelection() {
		return;
	}

	public getData() {
		return of([{ name: 'Zmarzlik', type: 'Senior', ksm: [8] }, { name: 'Dudek', type: 'Senior', ksm: [8] }]);
	}

	public getSelection() {
		return of([]);
	}

	public selectPlayer() {
		return true;
	}

	public getOptions() {
		return of({ currentRound: 1 });
	}

	public unselectPlayer() {
		return;
	}

	public getRoundSquads() {
		return of(['Zmarzlik']);
	}

	public getKsmValue() {
		return 10;
	}

	public getKsmSum() {
		return of(10);
	}

	public getKsmLeft() {
		return of(40);
	}
}
