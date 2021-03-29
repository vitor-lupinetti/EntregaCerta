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


  url: string = "http://localhost:3333/customers";
  register(customerToCreate: customerCreateModel){
 
    console.log(customerToCreate);

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
      formData.append('photo', customerToCreate.photo, customerToCreate.photo.name);

    this.http.post(this.url, formData)
              .subscribe(
                result => { 
                  console.log(result);
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
  }
  
}
