import { Router } from '@angular/router';
import { MessagesService } from './../messages.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { customerCreateModel } from 'src/app/models/customerCreateModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRegisterService implements OnInit {

  constructor(private http :HttpClient, private router:Router, private message:MessagesService) {}

  ngOnInit(): void {}
  
  name: string;
  photo: File;
  email: string;
  contactNumber: string;
  hasWhatsApp: string;
  cep: string;
  street: string;
  homeNumber: string;
  complement: string;
  neighborhood: string;
  password: string;
  user: string;


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
                   console.log(result);
                   this.message.showMessage("Usuário criado");
                  this.router.navigate(['']);

                 }
                },
                error => {
                  if(error.status == 400) {
                    console.log(error.error);
                    this.message.showMessage(error.error.error[0]);
                  }
                }
              )
  }
  
}
