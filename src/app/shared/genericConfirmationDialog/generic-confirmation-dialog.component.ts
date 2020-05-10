import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-generic-confirmation-dialog',
	templateUrl: './generic-confirmation-dialog.component.html',
	styleUrls: ['./generic-confirmation-dialog.component.scss'],
})
export class GenericConfirmationDialogComponent {
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		data.cancelText = data.cancelText || 'Wróć';
		data.confirmText = data.confirmText || 'Zapisz';
	}
}
