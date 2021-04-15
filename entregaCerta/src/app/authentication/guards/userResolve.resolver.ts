import { UserDataService } from './../../services/userAccount/user-data.service';
import { ResultModel } from './../../models/resultModel';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';

@Injectable()
export class UserResolve implements Resolve<ResultModel>{

    constructor(private userData:UserDataService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<any> | Promise<any>|any {
        console.log("resolver");
        console.log(this.userData.getUserData());
        return this.userData.getUserData();
    }
    
}