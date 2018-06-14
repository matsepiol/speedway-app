import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';

interface Notification {
  message: string;
  type?: NotificationType;
}

enum NotificationType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

@Injectable()
export class SnackBarService {
  private notification = new Subject<Notification>();

  constructor(private snackBar: MatSnackBar) {
    this.start();
  }

  public messageSuccess(message: string) {
    this.notification.next({ message, type: NotificationType.SUCCESS });
  }

  public messageWarning(message: string) {
    this.notification.next({ message, type: NotificationType.WARNING });
  }

  public messageError(message: string) {
    this.notification.next({ message, type: NotificationType.ERROR });
  }

  private start() {
    this.notification.subscribe((status) => {
      window.setTimeout(() => {
        this.snackBar.open(status.message, null, {
          duration: 4000,
          panelClass: status.type ? [status.type] : [],
        });
      });
    });
  }
}
