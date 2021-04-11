import { MessagesService } from './../messages.service';
import { UserUpdateComponent } from './../../views/userAccount/user-update/user-update.component';
import { UserDataService } from './user-data.service';
import { ResultModel } from 'src/app/models/resultModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { customerCreateModel } from 'src/app/models/customerCreateModel';
import { CustomerModel } from 'src/app/models/customerModel';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserUpdateService {

  constructor(private http: HttpClient, private userData: UserDataService, private route:Router, private message:MessagesService) { }

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

  url = `${environment.api_url}/customers`;
 
  data = <ResultModel>{};

  customer: CustomerModel;
    update(customerToCreate: customerCreateModel){
      const formData: FormData = new FormData();
      formData.append('name', customerToCreate.name);
      formData.append('email', customerToCreate.email);
      formData.append('contactNumber', customerToCreate.contactNumber);
      formData.append('hasWhatsApp', customerToCreate.hasWhatsApp);
      formData.append('cep', customerToCreate.cep);
      formData.append('id', customerToCreate.id);
      formData.append('street', customerToCreate.street);
      formData.append('homeNumber', customerToCreate.homeNumber);
      formData.append('complement', customerToCreate.complement);
      formData.append('neighborhood', customerToCreate.neighborhood);
      if(customerToCreate.photo){
        formData.append('photo', customerToCreate.photo, customerToCreate.photo.name);
      }
      

      this.http.put<CustomerModel>(this.url, formData)
              .subscribe(
                result => { 
                  this.customer = result;
                 if(result){
                   this.setUpdate(this.customer);
                   console.log(result);
                   this.message.showMessage("Usuário atualizado");
                  //  this.route.navigate(['buyer/homeBuyer']);
                 }
                },
                error => {
                  if(error.status == 400) {
                    console.log(error.error);
                    this.message.showMessageError(error.error.error);
                  }
                  console.log(error)
                }
              )
  }

  setUpdate(obj: CustomerModel){
    this.data.customer = obj;
    let token = this.userData.getUserData();
    this.data.token = token.token
    this.userData.setUserData(this.data); 
    let updateObj = JSON.stringify(this.data);
    localStorage.setItem("data",updateObj);
  }
}
