import { Component, OnInit } from '@angular/core';
import { UserRegisterService } from '../../../services/userAccount/userRegister.service';
import { UserRegister } from 'src/app/models/UserRegister';


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit,UserRegister {
  img;
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
    let reader = new FileReader();
    reader.readAsDataURL(this.photo);
      reader.onload = () => {
        this.img.setAttribute("src",reader.result);
      };
  }

  ngOnInit(): void {
    this.img = document.getElementById("image");
  }

  send():void{
    
    this.account.register({name: this.name, photo: this.photo, email: this.email, contactNumber: this.contactNumber,
      hasWhatsApp: this.hasWhatsApp, cep:this.cep, street:this.street, homeNumber:this.homeNumber, complement:this.complement,
      neighborhood:this.neighborhood, password:this.password, user:this.user})
   }
 
   

}
