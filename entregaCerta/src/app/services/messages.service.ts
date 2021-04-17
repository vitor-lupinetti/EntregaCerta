import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  constructor(private snackBar: MatSnackBar) { }

  showMessageError(msg: string | string[]): void {
    let message = "";

    if (typeof msg === "string") {
      message = msg;
    } else {
      message = msg.join(", ");
    }

    this.snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: "center",
      verticalPosition: "top"
    })
  }

  showMessage(msg: string) {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: "center",
      verticalPosition: "top"
    })
  }
}
