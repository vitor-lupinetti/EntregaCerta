
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

  constructor(private authService:AuthService, private routes:Router, changeDetectorRef:ChangeDetectorRef, media:MediaMatcher) { 
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
}
