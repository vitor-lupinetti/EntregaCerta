import { UserSearchService } from './../../services/userAccount/user-search.service';
import { UserDataService } from './../../services/userAccount/user-data.service';
import { AuthService } from './../login/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/models/resultModel';
import { StorageModel } from 'src/app/models/storageModel';


@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate{
  
  constructor( private authService: AuthService, private router: Router, private userData:UserDataService, private userSearchService: UserSearchService) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    this.load();
    if(this.authService.userAuth()){

      if(this.validType(state)){     
        return true;
      }
      
      
    }
    
    
    
    this.router.navigate(['']);
    return false;

  }
  obj: StorageModel ;
  load():void{
    
 
    if(localStorage.getItem("data") != undefined && !this.authService.userAuth()){
     
      this.authService.setLog(true);
      this.obj = JSON.parse(localStorage.getItem("data"));
      
    
      this.userSearchService.search(this.obj.id, this.obj.token);
      this.userData.setId(this.obj.id);
      this.userData.setToken(this.obj.token);
      this.userData.setType(this.obj.userType);
    }
  
  }

   

  validType(state):boolean{
    
    this.obj = JSON.parse(localStorage.getItem("data"));
    
    
    let userType = this.obj.userType.toUpperCase();
    if(userType == undefined){
      return false;
    }

     let routerUrl = state.url.toUpperCase();
     
    let routerType = routerUrl.includes(userType);
    
    return routerType;
  }
}
