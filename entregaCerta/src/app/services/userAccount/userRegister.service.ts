import { UserDataService } from './user-data.service';
import { Router } from '@angular/router';
import { MessagesService } from './../messages.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { customerCreateModel } from 'src/app/models/customerCreateModel';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/userAccount/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserRegisterService implements OnInit {

  constructor(private http :HttpClient, private message:MessagesService, private authService:AuthService) {}

  ngOnInit(): void {}
  

  url = `${environment.api_url}/customers`;
  register(customerToCreate: customerCreateModel){
 

      const formData: FormData = new FormData();
      formData.append('name', customerToCreate.name);
      formData.append('email', customerToCreate.email);
      formData.append('contactNumber', customerToCreate.contactNumber);
      formData.append('hasWhatsApp', customerToCreate.hasWhatsApp);
      formData.append('cep', customerToCreate.cep);
      formData.append('street', customerToCreate.street);
      formData.append('homeNumber', customerToCreate.homeNumber);
      formData.append('complement', customerToCreate.complement);
      formData.append('neighborhood', customerToCreate.neighborhood);
      formData.append('password', customerToCreate.password);
      formData.append('user', customerToCreate.user);
      if(customerToCreate.photo){
        formData.append('photo', customerToCreate.photo, customerToCreate.photo.name);
      }
      

    this.http.post(this.url, formData)
              .subscribe(
                result => { 
                 if(result){
                   this.message.showMessage("Usuário criado");
                   this.authService.sendLogin({user: customerToCreate.user , password: customerToCreate.password});
                 }
                },
                error => {
                  if (error !== 500) {
                    this.message.showMessage(error.error.error);
                  } else {
                    console.log(error);
                  }
                }
              )
  }
  
}
