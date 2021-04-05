import { UserDataService } from './../../services/userAccount/user-data.service';
import { AuthService } from './../login/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/models/resultModel';


@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate{

  constructor( private authService: AuthService, private router: Router, private userData:UserDataService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {


    this.load();
    
    if(this.authService.userAuth()){
      return true;
    }

    
    
    this.router.navigate(['']);
    return false;

  }

  load():void{
    
    let data: ResultModel;
    
    if(localStorage.getItem("data") != undefined && !this.authService.userAuth()){
      data = JSON.parse(localStorage.getItem("data"));
      this.userData.setUserData(data);
      this.authService.setLog(true);
    }
  
  }

   

  // validType(state):boolean{
  //   let userType = this.authService.userType.toUpperCase();
  //   if(userType == undefined){
  //     return false;
  //   }

  //   console.log(userType);
  //    let routerUrl = state.url.toUpperCase();
  //    console.log(routerUrl);
  //   let routerType = routerUrl.includes(userType);
    
  //   return routerType;
  // }
}
