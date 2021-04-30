import { UserUpdateComponent } from './../../views/userAccount/user-update/user-update.component';
import { UserSearchService } from './../../services/userAccount/user-search.service';
import { UserDataService } from './../../services/userAccount/user-data.service';
import { AuthService } from './../login/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/models/resultModel';
import { StorageModel } from 'src/app/models/storageModel';
import { constructorParametersDownlevelTransform } from '@angular/compiler-cli';


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
  load(state):void{
    
    if(localStorage.getItem("data") != undefined && !this.authService.userAuth()){
      

      this.userData.reload = true;
      if(!state.url.includes("update")){

        this.obj = JSON.parse(localStorage.getItem("data"));
        
        this.userSearchService.search(this.obj.id, this.obj.token).subscribe( result => { 
          console.log("reaload");           
          if(result){
            this.resultModel.customer = result;
            
            this.resultModel.token = this.obj.token;
            
            this.userData.setUserData(this.resultModel);
            console.log( this.resultModel.customer); 
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
      
      
     console.log("set auth guard");
     this.authService.setLog(true);

     
      this.userData.setId(this.obj.id);
      this.userData.setToken(this.obj.token);
      this.userData.setType(this.obj.userType);
    }
    this.userData.reload = false;
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
