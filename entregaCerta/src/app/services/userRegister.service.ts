import { AuthService } from '../authentication/login/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { customerCreateModel } from '../models/customerCreateModel';



@Injectable({
  providedIn: 'root'
})
export class UserRegisterService implements OnInit {

  constructor(private http :HttpClient,private authService: AuthService) { 
   
  }

  userType: string;

  ngOnInit(): void {
      this.userType = this.authService.userType;
  }

  url: string = "http://localhost:3333/customers";
  register(customerToCreate: customerCreateModel){
 
    console.log(customerToCreate + "usuario?");
    this.http.post(this.url, customerToCreate)
              .subscribe(
                result => { 
                 if(result== 201){
                   console.log("criado");
                 }
                },
                error => {
                  if(error.status == 400) {
                    console.log(error);
                  }
                }
              )
    console.log(this.userType);
  }
  
}
