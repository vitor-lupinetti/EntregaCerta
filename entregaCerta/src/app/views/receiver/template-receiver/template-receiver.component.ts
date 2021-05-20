import { UserDeleteService } from './../../../services/userAccount/user-delete.service';
import { MessagesService } from './../../../services/messages.service';

import { Router } from '@angular/router';
import { AuthService } from '../../../services/userAccount/auth.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import{MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-template-receiver',
  templateUrl: './template-receiver.component.html',
  styleUrls: ['./template-receiver.component.css']
})
export class TemplateReceiverComponent implements OnDestroy {

  mediaQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
              private authService:AuthService,
              private routes:Router,
              private message:MessagesService,
              private userDelete: UserDeleteService,
              changeDetectorRef:ChangeDetectorRef, media:MediaMatcher) { 
                
    this.mediaQuery = media.matchMedia('(max-width:500px)');
    this._mobileQueryListener = () =>
    changeDetectorRef.detectChanges();
    this.mediaQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mediaQuery.removeListener(this._mobileQueryListener);
  }
  
  opened = false;
 
  exit(){
   
    this.authService.setLog(false);
    localStorage.removeItem("data");
    this.routes.navigate(['']);
  
  }

  async delete(){
    
    let confirm = await this.message.dialogConfirm("delete");
    if(confirm.response == 1){
      
      this.userDelete.delete().subscribe(
        result => {
          
          if (result) {
            
            this.exit();
          }
        },
  
        error => {
          
          if (error !== 500) {
            this.message.showMessage(error.error.error);
          } else {
            console.log(error);
          }
        }
      );
    }
  }
}
