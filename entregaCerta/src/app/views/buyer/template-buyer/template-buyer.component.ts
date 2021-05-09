import { UserDeleteService } from '../../../services/userAccount/user-delete.service';
import { MessagesService } from 'src/app/services/messages.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/userAccount/auth.service';
import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import{MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-template-buyer',
  templateUrl: './template-buyer.component.html',
  styleUrls: ['./template-buyer.component.css']
})
export class TemplateBuyerComponent implements  OnDestroy {

  mediaQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(private authService:AuthService,
              private routes:Router,
              changeDetectorRef:ChangeDetectorRef,
              media:MediaMatcher,
              private message:MessagesService,
              private userDelete:UserDeleteService) { 
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
    console.log("logout");
    this.authService.setLog(false);
    localStorage.removeItem("data");
    this.routes.navigate(['']);
  
  }

  async delete(){
    let confirm = await this.message.dialogConfirm("delete");
    console.log(confirm.response);
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
