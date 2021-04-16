import { ResultModel } from './../../../models/resultModel';
import { UserDataService } from './../../../services/userAccount/user-data.service';
import { Component, OnInit } from '@angular/core';
import { UserUpdateService } from 'src/app/services/userAccount/user-update.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {

  constructor(private account: UserUpdateService, private userData: UserDataService,private route:ActivatedRoute) { }
  img;
  data: ResultModel;
  subscription:Subscription;

  ngOnInit(): void {

    this.subscription = this.route.data.subscribe(
      (info:{userData: ResultModel}) => {
        this.data = info.userData;
      }
    );

    this.img = document.getElementById("image");
    this.setInput();
  }

   id:string;
   name:string;
   photo_url:string;
   email: string;
   contactNumber:string;
   hasWhatsAppBoolean:boolean;
   hasWhatsApp: string;
   cep:string;
   street: string;
   homeNumber:string;
   complement:string;
   neighborhood:string;
   photo: File;

   handleFileInput(files: FileList) {
    // this.photo = files.item(0);
    this.photo = files.item(0);
    let reader = new FileReader();
    reader.readAsDataURL(this.photo);
      reader.onload = () => {
        this.img.setAttribute("src",reader.result);
      };
  }


    setInput(){
      
      this.name = this.data.customer.name;
      this.photo_url = this.data.customer.photo_url;
      this.img.setAttribute("src",`data:${this.data.customer.photoMimeType};base64,${this.data.customer.photo}`);
      this.email = this.data.customer.email;
      this.contactNumber = this.data.customer.contactNumber;
      this.setHasWhatsAppBoolean();
      this.cep = this.data.customer.addressEntity.cep;
      this.street = this.data.customer.addressEntity.street;
      this.homeNumber = this.data.customer.homeNumber;
      this.complement = this.data.customer.complement;
      this.neighborhood = this.data.customer.addressEntity.neighborhoodEntity.name
      this.photo;
      this.id = this.data.customer.id;
    }

    setHasWhatsAppBoolean(){
       if(this.data.customer.hasWhatsApp == "1"){
          this.hasWhatsAppBoolean = true;
       }
       else{
        this.hasWhatsAppBoolean = false;
       }
    }

    setHasWhatsApp(){
      if(this.hasWhatsAppBoolean){
        this.hasWhatsApp = "1"
      }
      else{
        this.hasWhatsApp = "0";
      }
    }

  send(){

    this.setHasWhatsApp();
      this.account.update(
        {name: this.name || "",
         photo: this.photo,
         email: this.email || "",
         contactNumber: this.contactNumber,
         hasWhatsApp: this.hasWhatsApp || "",
         cep:this.cep ,
         street:this.street || "",
         homeNumber:this.homeNumber || "",
         complement:this.complement || "",
         neighborhood:this.neighborhood || "",
         id: this.id || ""}
      );
      
    
  }

}
