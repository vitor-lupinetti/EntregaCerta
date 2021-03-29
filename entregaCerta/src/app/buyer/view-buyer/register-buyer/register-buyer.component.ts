import { CustomerModel } from 'src/app/models/customerModel';
import { ResultModel } from './../../../models/resultModel';
import { UserModel } from './../../../models/userModel';
import { UserRegisterService } from '../../../services/userRegister.service';
import { Component, OnInit } from '@angular/core';
import { AddressModel } from 'src/app/models/addressModel';
import { NeighborhoodModel } from 'src/app/models/neighborhoodModel';
import { UserRegister } from 'src/app/models/UserRegister';
import { registerLocaleData } from '@angular/common';




@Component({
  selector: 'app-register-buyer',
  templateUrl: './register-buyer.component.html',
  styleUrls: ['./register-buyer.component.css']
})
export class RegisterBuyerComponent implements OnInit, UserRegister {

  constructor(private account: UserRegisterService) { }
  name: string;
  photo: string;
  email: string;
  contactNumber: string;
  hasWhatsApp: string;
  cep: string;
  street: string;
  homeNumber: string;
  complement: string;
  neighborhood: string;
  password: string;
  user:string;
  
  ngOnInit(): void {
    
  }

 
  send():void{
    
   this.account.register({name, photo, this.email,this.contactNumber,
    this.hasWhatsApp, this.cep, this.street, this.homeNumber, this.complement,
    this.neighborhood, this.password, this.user})
  }

  cancel():void{
    
  }

}
