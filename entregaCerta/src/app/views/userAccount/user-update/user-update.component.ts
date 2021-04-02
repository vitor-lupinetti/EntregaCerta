import { UserDataService } from './../../../services/userAccount/user-data.service';
import { ResultModel } from 'src/app/models/resultModel';
import { AuthService } from './../../../authentication/login/auth.service';
import { Component, OnInit } from '@angular/core';
import { CustomerModel } from 'src/app/models/customerModel';
import { UserUpdateService } from 'src/app/services/userAccount/user-update.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {

  constructor(private auth: AuthService, private account: UserUpdateService, private userData: UserDataService) { }
  img;
  ngOnInit(): void {
    this.img = document.getElementById("image");
    this.setInput();
  }
   id:string;
   data: ResultModel;
   name:string;
   photo_url:string;
   email: string;
   contactNumber:string;
   hasWhatsApp:string;
   cep:string;
   street: string;
   homeNumber:string;
   complement:string;
   neighborhood:string;
   photo: File;

   handleFileInput(files: FileList) {
    this.photo = files.item(0);
  }


    setInput(){
      console.log("classe update:");
      console.log(this.userData.getUserData());
      this.data = this.userData.getUserData();
      console.log(this.data.customer.name);
      this.name = this.data.customer.name;
      this.photo_url = this.data.customer.photo_url;
      this.img.setAttribute("src",this.photo_url);
      this.email = this.data.customer.email;
      this.contactNumber = this.data.customer.contactNumber;
      this.hasWhatsApp = this.data.customer.hasWhatsApp;
      this.cep = this.data.customer.addressEntity.cep;
      this.street = this.data.customer.addressEntity.street;
      this.homeNumber = this.data.customer.homeNumber;
      this.complement = this.data.customer.complement;
      this.neighborhood = this.data.customer.addressEntity.neighborhoodEntity.name
      this.photo;
      this.id = this.data.customer.id;
    }

  send(){
      this.account.update(
        {name: this.name, photo: this.photo, email: this.email, contactNumber: this.contactNumber,
          hasWhatsApp: this.hasWhatsApp, cep:this.cep, street:this.street, homeNumber:this.homeNumber, complement:this.complement,
          neighborhood:this.neighborhood, id: this.id}
      );
      
    
  }

}
