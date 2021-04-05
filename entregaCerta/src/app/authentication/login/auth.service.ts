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
                  console.log(this.customer );
                  
                  this.userType = this.customer.customer.userEntity.userTypeEntity.description;
                  
                  if(this.userType == "Buyer"){
                    this.setLog(true);
                    this.data.setUserData(this.customer);
                    this.setLocalStorage();
          
                    this.router.navigate(['buyer/user-update']);
                    
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

  setLog(on){
    this.logged = on;
  }

  setLocalStorage(){
    let objJson = JSON.stringify(this.customer)
    localStorage.setItem("data", objJson);
  }

}
