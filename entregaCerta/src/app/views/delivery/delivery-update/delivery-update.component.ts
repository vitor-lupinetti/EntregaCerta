
import { UserSearchService } from './../../../services/userAccount/user-search.service';
import { UserDataService } from './../../../services/userAccount/user-data.service';
import { PhotoDeliveryModel } from './../../../models/photoDeliveryModel';
import { PhotosService } from './../../../services/delivery/photos.service';
import { DeliveryUpdateService } from './../../../services/delivery/delivery-update.service';
import { DeliveryModel } from 'src/app/models/deliveryModel';
import { DeliverySearchService } from './../../../services/delivery/delivery-search.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';
import {MomentDateAdapter,MAT_MOMENT_DATE_ADAPTER_OPTIONS} from "@angular/material-moment-adapter";
import {DateAdapter,MAT_DATE_FORMATS,MAT_DATE_LOCALE} from "@angular/material/core";
import * as _moment from "moment";
import { DeliveryObjectModel } from 'src/app/models/deliveryObjectModel';
import { DeliveredStatusService } from 'src/app/services/delivery/delivered-status';
import { StorageModel } from 'src/app/models/storageModel';

const moment = _moment;
export  const MY_FORMATS = {
  parse : {
    dateInput : 'L' ,
 },
 display : {
    dateInput : 'D/MM/YYYY' ,
    monthYearLabel : 'MMM YYYY' ,
    dateA11yLabel : 'L' ,
    monthYearA11yLabel : 'MMMM YYYY' ,
 },
};

@Component({
  selector: 'app-delivery-update',
  templateUrl: './delivery-update.component.html',
  styleUrls: ['./delivery-update.component.css'],
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class DeliveryUpdateComponent implements OnInit {

  id = '';
  deliveryObjectModel = <DeliveryObjectModel>{};
  obj: StorageModel;
  deliveryModel = <DeliveryModel>{};
  photo: File;
  photos;
  img;
  whatsapp = false;
  statusDelivery;
  numberContact;
  confirmDelivery;
  checkbox;
  buyer;
  street;
  number;
  cep;
  complement;
  neighborhood;

  constructor(
    private deliverySearch: DeliverySearchService,
    private router: Router,
    private route: ActivatedRoute,
    private deliveryUpdate: DeliveryUpdateService,
    private message: MessagesService,
    private photosService: PhotosService,
    private userData:UserDataService,
    private userSearchService:UserSearchService,
    private markDeliveryService:DeliveredStatusService,
    private userSearch: UserSearchService,
  ) { }

  date ;
  times = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    

    this.deliverySearch.search(this.id).subscribe(
      result => {
        if (result) {
          this.deliveryModel = result.delivery;
        
          if(this.deliveryModel.status !== "Criada"){
            this.date = moment(this.deliveryModel.receiptDate + "T00:00:00");
            this.times = this.deliveryModel.receptionTime;
          }else{
            this.date;
            this.times;
          }
          this.searchBuyer(this.deliveryModel.idBuyer);
          this.img = document.getElementById("image");
          this.setWhatsApp();
          this.photoList();
          this.statusDelivery = this.deliveryModel.status;
          if(this.statusDelivery !== "Recebedor recebeu" && this.statusDelivery !== "Criada"){
            this.checkbox = document.getElementById("markDelivered");
            this.checkbox.setAttribute("disabled","disabled");
            this.checkbox.checked = true;
          }else if (this.statusDelivery =="Criada"){
            this.checkbox = document.getElementById("markDelivered");
            this.checkbox.setAttribute("disabled","disabled");
          }
        }
      },

      error => {
        if (error !== 500) {
          this.message.showMessage(error.error.error);
        } else {
          console.log(error);
        }
      }
    );
    
  }

  searchBuyer(id){
    this.obj = JSON.parse(localStorage.getItem("data"));
   
    this.userSearch.search(id,this.obj.token).subscribe(
      result =>{
        if(result){
       
          this.buyer = result.name;
          this.street = result.addressEntity.street;
          this.neighborhood = result.addressEntity.neighborhoodEntity.name;
          this.number = result.homeNumber;
          this.cep = result.addressEntity.cep;
          this.complement = result.complement;
        }
      },
      error=>{
        if(error.status == 400) {
          console.log(error.error);
          
        }
        console.log(error)
      }
    )
  }

  handleFileInput(files: FileList) {
    this.photo = files.item(0);
    let reader = new FileReader();
    reader.readAsDataURL(this.photo);
    reader.onload = () => {
      this.img.setAttribute("src", reader.result);
    };

    let photoModel: PhotoDeliveryModel;

    this.photosService
      .photoUpdate({
        idDelivery: this.id,
        photo: this.photo
      })
      .subscribe(
        result => {
          if (result) {
            photoModel = result;
            this.photoList();
          }
        },

        error => {
          if (error !== 500) {
            this.message.showMessage(error.error.error);
          } else {
            console.log(error);
          }
        }
      );
  }

  photoList() {
    let photoObject: PhotoDeliveryModel[];
    this.photos = [];
    
    this.photosService.photoList(this.id).subscribe(
      result => {
        if (result) {
          photoObject = result;

          for (let { photoMimeType, photo, id } of photoObject) {
            this.photos.push({
              src: `data:${photoMimeType};base64,${photo}`,
              id: id
            });
          }
        }
      },

      error => {
        if (error !== 500) {
          this.message.showMessage(error.error.error);
        } else {
          console.log(error);
        }
      }
    );

  }

  setWhatsApp(){
    
    if(this.userData.getUserData().customer.hasWhatsApp == "1"){
      this.userSearchService.search(this.deliveryModel.idBuyer, this.userData.getToken())
        .subscribe( result => { 
                    
          if(result){
            
            if(result.hasWhatsApp == "1"){
              this.numberContact = "55" + result.contactNumber;
              this.whatsapp = true;  
            }
            
          }
         },
         error => {
           if(error !== 500) {
             console.log(error.error);
             
           }
           console.log(error)
           
         }  
       )
      
    }
  }

  photoDelete(id: string) {

    this.photosService.photoDelete(id).subscribe(
      result => {
        if (result) {
          
          this.photos.filter(function (image) {
            return image.id != id;
          });

          this.photoList();
        }
      },

      error => {
        if (error !== 500) {
          this.message.showMessage(error.error.error);
        } else {
          console.log(error);
        }
        console.log(error);
      }
    );
  }

  delivered(){

    if(this.deliveryModel.status == "Recebedor recebeu"){

      this.markDeliveryService.markDelivered(this.id)
      .subscribe(
        result => {
          if (result) {
            this.message.showMessage("Entrega ao comprador marcada");
            this.statusDelivery = result.currentStatusDelivery;
            this.checkbox = document.getElementById("markDelivered");
            this.checkbox.setAttribute("disabled","disabled");
            this.checkbox.checked = true;
          }
        },

        error => {
          if (error !== 500) {
            this.message.showMessage(error.error.error);
            console.log(error);
          } else {
            console.log(error);
          }
        }
      );
    }
  }

  updateDelivery() {
    let dateTimeToSend = this.date;

    dateTimeToSend = moment.utc(dateTimeToSend).local(true).toISOString();
    dateTimeToSend = dateTimeToSend.replace(/T.*/, `T${this.times}`);
    console.log(dateTimeToSend);
    this.deliveryUpdate
      .update({
        id: this.deliveryModel.id,
        amountPackaging: this.deliveryModel.amountPackaging,
        date: dateTimeToSend
      })
      .subscribe(
        result => {
          if (result) {
            this.message.showMessage("Entrega atualizada");

            this.router.navigate(['receiver/delivery-list']);
          }
        },

        error => {
          if (error !== 500) {
            this.message.showMessage(error.error.error);
          } else {
            console.log(error);
          }
        }
      );
  }

  cancel() {
    this.router.navigate(['receiver/delivery-list']);
  }
}
