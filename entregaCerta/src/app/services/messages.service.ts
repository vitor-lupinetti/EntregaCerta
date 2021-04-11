import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private snackBar:MatSnackBar) { }

  

  showMessageError(msg:string): void{
    let message = "";

    for(let n = 0; n < msg.length; n++){
      if(msg.length == 1 || n == 0){
        message += msg[n]; 
   
      }
      else{
        message += ", " + msg[n] ;
      }
      
    }
    this.snackBar.open(message, 'X' , {
      duration:3000,
      horizontalPosition:"center",
      verticalPosition:"top"
    })
    
  }

  showMessage(msg:string){
    this.snackBar.open(msg, 'X' , {
      duration:3000,
      horizontalPosition:"center",
      verticalPosition:"top"
    })
  }
}
