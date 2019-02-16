import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root',
})

export class NotificationService {

  constructor(public snackBar: MatSnackBar) {
  }

  showmessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
    });
  }

}
