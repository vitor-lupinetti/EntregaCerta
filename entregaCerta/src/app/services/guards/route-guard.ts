
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
  
  load(state){

    if(localStorage.getItem("data") != undefined && !this.authService.userAuth()){
      
      this.obj = JSON.parse(localStorage.getItem("data"));
        
      let id = this.obj.id;
      let token = this.obj.token;
     
      if(!state.url.includes("user-update")){

        this.userSearchService.search(id, token)
        .subscribe( result => {           
          if(result){
            this.resultModel.customer = result;
            this.resultModel.token = this.obj.token;
            this.userData.setUserData(this.resultModel); 
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
        
     this.authService.setLog(true);

      this.userData.setId(id);
      this.userData.setToken(token);
      this.userData.setType(this.obj.userType);
    }
    
  }

   

  validType(state):boolean{
    
    this.obj = JSON.parse(localStorage.getItem("data"));
    
    let userType = this.obj.userType.toLowerCase();

    if(userType == undefined){
      return false;
    }
    
    let routerUrl = state.url;
     
    let routerType = routerUrl.includes(userType);
    
    return routerType;
  }
}
