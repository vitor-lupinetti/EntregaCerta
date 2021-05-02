import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDeleteComponent } from '../views/userAccount/user-delete/user-delete.component';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog) { }

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

  dialogConfirm(): any{
    return new Promise((resolve,reject) =>{
      const confirm = this.dialog.open(UserDeleteComponent);
      confirm.afterClosed().subscribe(result =>{
        if(result){
          resolve({
            success:true
          });
        }
        // else{
        //   reject({
        //     success:false,
        //     msg:'error delete'
        //   });
        // }
      
    })
    })
    
  }
}

