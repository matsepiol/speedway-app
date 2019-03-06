import { BehaviorSubject, of } from 'rxjs';

export class MockDataService {
	public ksmSumSubject: BehaviorSubject<number> = new BehaviorSubject(0);

	public setSelection() {
		return;
	}

	public getData() {
		return of([{ name: 'Zmarzlik', type: 'Senior' }, { name: 'Dudek', type: 'Senior' }]);
	}

	public getSelection() {
		return of([]);
	}

	public selectPlayer() {
		return true;
	}

	public unselectPlayer() {
		return;
	}

	public getRoundSquads() {
		return of(['Zmarzlik']);
	}

	public getKsmSum() {
		return of(10);
	}

	public getKsmLeft() {
		return of(40);
	}
}
