import { AuthService } from 'src/app/authentication/login/auth.service';
import { ResultModel } from './../../models/resultModel';
import { CustomerModel } from './../../models/customerModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { UserDataService } from './user-data.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { StorageModel } from 'src/app/models/storageModel';


@Injectable({
  providedIn: 'root'
})
export class UserSearchService implements OnInit{

  

  constructor(private http: HttpClient, private userData: UserDataService, private authService:AuthService) { }
  ngOnInit(): void {
    
  }
  
  obj: StorageModel;

  test(){
    this.obj = JSON.parse(localStorage.getItem("data"));
    let httpOptions
    return httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.obj.token}`})
    } 
  }
  

  
  

  resultModel = <ResultModel>{};
  load = false;
  url = `${environment.api_url}/customers/`;
  search(id, token){
    
     console.log(this.test());
    console.log(this.userData.getToken());
    this.http.get<CustomerModel>(this.url +id, this.test())
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
