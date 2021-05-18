import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDeleteComponent } from '../views/userAccount/user-delete/user-delete.component';
import { DeliveryConfirmComponent } from '../views/delivery/delivery-confirm/delivery-confirm.component';


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
  typeMessage;
  dialogConfirm(type): any{
    
    return new Promise((resolve,reject) =>{
      
      if(type == "delete"){
        this.typeMessage = UserDeleteComponent;
      }else if(type = "status"){
        this.typeMessage = DeliveryConfirmComponent;
      }
      const confirm = this.dialog.open(this.typeMessage);
      
      confirm.afterClosed().subscribe(result =>{
        console.log(result);
        if(result){
          
          resolve({
            response:1,
            success:true,
          });
        }else if (result == false){
          resolve({
            response:0,
            success:true,
          });
        }
    })
    })
    
  }
}

