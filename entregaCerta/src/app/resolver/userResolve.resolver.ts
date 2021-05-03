import { UserSearchService } from '../services/userAccount/user-search.service';
import { UserDataService } from '../services/userAccount/user-data.service';
import { ResultModel } from '../models/resultModel';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { StorageModel } from 'src/app/models/storageModel';

@Injectable()
export class UserResolve implements Resolve<ResultModel>{
    

    constructor(private userData:UserDataService, private userSearchService:UserSearchService){}

    resultModel = <ResultModel>{};
    obj: StorageModel ;

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ResultModel|Observable<ResultModel> | Promise<ResultModel> {
        console.log("resolver");

        // this.obj = JSON.parse(localStorage.getItem("data"));

        // this.userSearchService.search(this.obj.id, this.obj.token).subscribe( result => { 
                     
        //     if(result){
        //         console.log(result);  
        //       return result;
        //     }
        //    },
        //    error => {
        //      if(error.status == 400) {
        //        console.log(error.error);
               
        //      }
        //      console.log(error)
             
        //    }  
        //  )
       
        return this.userData.getUserData();
    }
    
}