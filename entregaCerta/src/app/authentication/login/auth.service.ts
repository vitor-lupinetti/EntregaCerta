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

  constructor(private router: Router, private http : HttpClient) { }

  private urlLogin: string = "http://localhost:3333/login"

  private customer: ResultModel 
  sendLogin(user: User){

    this.http.post<ResultModel>(this.urlLogin, user)
              .subscribe(
                result => { 
                  this.customer = result;
                  console.log(JSON.stringify(this.customer) + "resultModel" );
                  
                  this.userType = this.customer.customer.userEntity.userTypeEntity.description;
                  if(this.customer.customer.userEntity.userTypeEntity.description == "Buyer"){
                    this.logged = true;
                    this.router.navigate(['buyer/homeBuyer']);
                    
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

  userData(): CustomerModel{
    return this.customer.customer
  }
  userAuth() : boolean{
    return this.logged;
  }

  
  
}
