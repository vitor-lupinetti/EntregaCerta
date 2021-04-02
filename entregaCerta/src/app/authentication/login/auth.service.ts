import { UserDataService } from './../../services/userAccount/user-data.service';
import { ResultModel } from '../../models/resultModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user';
import { CustomerModel } from 'src/app/models/customerModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private logged:boolean = false;
  userType: string;

  constructor(private router: Router, private http : HttpClient, private data:UserDataService) { }

  private urlLogin: string = "http://localhost:3333/login"

  private customer: ResultModel 
  sendLogin(user: User){

    this.http.post<ResultModel>(this.urlLogin, user)
              .subscribe(
                result => { 
                  this.customer = result;
                  console.log(this.customer );
                  
                  this.userType = this.customer.customer.userEntity.userTypeEntity.description;
                  
                  if(this.userType == "Buyer"){
                    this.logged = true;
                    this.router.navigate(['buyer/homeBuyer']);
                    this.data.setUserData(this.customer);
                    this.setLocalStorage();
                    
                  }
                  else{
                    console.log("Rota não encontrada")
                  }
                },
                error => {
                  if(error.status == 500) {
                    console.log(error);
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
    // localStorage.setItem("on",this.customer.customer.id);
    let objJson = JSON.stringify(this.customer)
    localStorage.setItem("data", objJson);
    console.log( "Na classe auth o objeto é armazenado " + localStorage.getItem("data"));
  }

}
