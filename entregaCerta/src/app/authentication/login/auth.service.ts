
import { MessagesService } from './../../services/messages.service';
import { UserDataService } from './../../services/userAccount/user-data.service';
import { ResultModel } from '../../models/resultModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Sigin } from '../../models/sigin';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private logged:boolean = false;
  userType: string;
 

  constructor(private router: Router, private http : HttpClient, private data:UserDataService, private message:MessagesService) { }

  private urlLogin: string = `${environment.api_url}/login`
 

  private customer: ResultModel 
  sendLogin(user: Sigin){

    this.http.post<ResultModel>(this.urlLogin, user)
              .subscribe(
                result => { 
                  this.customer = result;
                
                  
                   this.userType = this.customer.customer.userEntity.userTypeEntity.description;
                  

                  if(this.userType == "Buyer"){
                    this.setLog(true);
                    this.data.setUserData(this.customer);
                    this.setLocalStorage();
                  
                    this.router.navigate(['buyer/user-update']);
                    
                  }
                  else if(this.userType == "Receiver"){
                    this.setLog(true);
                    this.data.setUserData(this.customer);
                    this.setLocalStorage();
                   
                    this.router.navigate(['receiver/user-update']);
                  }
                  else{
                    console.log("Rota não encontrada")
                  }
                },
                error => {
                  if(error.status == 500) {
                    console.log(error);
                    this.message.showMessage(error.error.error);
                  }
                }
              )
  }

  userAuth() : boolean{
    return this.logged;
  }

  setLog(set){
    this.logged = set;
  }
  
  setLocalStorage(){
      
    // let objJson = JSON.stringify(this.customer)
    // localStorage.setItem("data", objJson);
    
    let objJson = JSON.stringify({ token: this.customer.token,
                                   id: this.customer.customer.id,
                                   userType: this.userType });

    localStorage.setItem("data", objJson);
    this.data.setToken(this.customer.token);
    this.data.setType(this.userType);
    this.data.setId( this.customer.customer.id);
   
  }

}
