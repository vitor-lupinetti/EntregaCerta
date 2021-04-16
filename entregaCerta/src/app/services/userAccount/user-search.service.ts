import { AuthService } from 'src/app/authentication/login/auth.service';
import { ResultModel } from './../../models/resultModel';
import { CustomerModel } from './../../models/customerModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDataService } from './user-data.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserSearchService {

  

  constructor(private http: HttpClient, private userData: UserDataService, private authService:AuthService) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json',
    'Authorization': 'Bearer ' +  this.userData.getToken()})
  } 

  resultModel = <ResultModel>{};
  load = false;
  url = `${environment.api_url}/customers/`;
  search(id, token){
    
    this.http.get<CustomerModel>(this.url +id, this.httpOptions)
              .subscribe(
                result => { 
                  
                 if(result){
                   this.resultModel.customer = result;
                   this.resultModel.token = token;
                   
                   this.userData.setUserData(this.resultModel);
                   console.log(this.userData.getUserData()); 
                  
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
}
