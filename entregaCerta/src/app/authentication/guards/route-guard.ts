import { UserDataService } from './../../services/userAccount/user-data.service';
import { UserSearchService } from './../../services/userAccount/user-search.service';
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
    // let type:boolean = this.validType(state)
    
    this.load();

    if(this.authService.userAuth()){
      console.log(this.authService.userAuth())
      return true;
    }
    
      this.router.navigate(['']);
      return false;
  }

  load():void{
    
  //   if(localStorage.getItem("on") != undefined && !this.authService.userAuth()){
  //     console.log("Na função load o id é " +  localStorage.getItem("on"));
  //     this.searchData.search();
  //     this.authService.setLog(true);
  //   }
    let data: ResultModel;
    
    if(localStorage.getItem("data") != undefined && !this.authService.userAuth()){
      console.log("Na função load da class guard");
      data = JSON.parse(localStorage.getItem("data"));
      console.log(data);
      this.userData.setUserData(data);
      this.authService.setLog(true);
    }
  
  }

   

  validType(state):boolean{
    let userType = this.authService.userType.toUpperCase();
    if(userType == undefined){
      return false;
    }

    console.log(userType);
     let routerUrl = state.url.toUpperCase();
     console.log(routerUrl);
    let routerType = routerUrl.includes(userType);
    
    return routerType;
  }
}
