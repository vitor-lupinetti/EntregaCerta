import { UserUpdateComponent } from '../../views/userAccount/user-update/user-update.component';
import { UserSearchService } from '../userAccount/user-search.service';
import { UserDataService } from '../userAccount/user-data.service';
import { AuthService } from '../userAccount/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/models/resultModel';
import { StorageModel } from 'src/app/models/storageModel';



@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate{
  
  constructor( private authService: AuthService,
               private router: Router,
               private userData:UserDataService,
               private userSearchService: UserSearchService,
              ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.userData.reload = false;
    this.load(state);
    if(this.authService.userAuth()){

      if(this.validType(state)){     
        return true;
      }
    }
    
    this.router.navigate(['']);
    return false;

  }
  obj: StorageModel ;
  resultModel = <ResultModel>{};
  reload = false;
  loaded = false;
  load(state){

    if(localStorage.getItem("data") != undefined && !this.authService.userAuth()){
      
      this.obj = JSON.parse(localStorage.getItem("data"));
        
      
     
      if(!state.url.includes("user-update")){

        this.userSearchService.search(this.obj.id, this.obj.token)
        .subscribe( result => { 
          console.log("reaload");           
          if(result){
            this.resultModel.customer = result;
            this.resultModel.token = this.obj.token;
            this.userData.setUserData(this.resultModel); 
            this.loaded = true;
          }
         },
         error => {
           if(error.status == 400) {
             console.log(error.error);
             
           }
           console.log(error)
           
         }  
       )
      }
      
      this.obj = JSON.parse(localStorage.getItem("data"));
      
     this.authService.setLog(true);

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
