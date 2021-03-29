import { AuthService } from './../login/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate{

  constructor( private authService: AuthService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // let type:boolean = this.validType(state)
    

    if(this.authService.userAuth()){
      return true;
    }
    this.router.navigate(['']);
    return false;
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
