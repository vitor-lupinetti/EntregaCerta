import { Component, OnInit } from '@angular/core';
import { CustomerModel } from 'src/app/models/customerModel';
import { ResultModel } from './../../../models/resultModel';
import { UserModel } from './../../../models/userModel';
import { UserRegisterService } from '../../../services/userRegister.service';
import { AddressModel } from 'src/app/models/addressModel';
import { NeighborhoodModel } from 'src/app/models/neighborhoodModel';
import { UserRegister } from 'src/app/models/UserRegister';
import { registerLocaleData } from '@angular/common';
import { customerCreateModel } from 'src/app/models/customerCreateModel';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit,UserRegister {

  constructor(private account: UserRegisterService) { }
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

  handleFileInput(files: FileList) {
    this.photo = files.item(0);
  }

  ngOnInit(): void {
  }

  send():void{
    
    console.log(this.name);
    this.account.register({name: this.name, photo: this.photo, email: this.email, contactNumber: this.contactNumber,
      hasWhatsApp: this.hasWhatsApp, cep:this.cep, street:this.street, homeNumber:this.homeNumber, complement:this.complement,
      neighborhood:this.neighborhood, password:this.password, user:this.user})
   }
 
   

}
