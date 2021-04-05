import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private snackBar:MatSnackBar) { }

  showMessage(msg:string): void{
    this.snackBar.open(msg, 'X' , {
      duration:3000,
      horizontalPosition:"center",
      verticalPosition:"top"
    })
  }
}
