import { UserSearchService } from './../../../services/userAccount/user-search.service';
import { UserDataService } from './../../../services/userAccount/user-data.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryModel } from 'src/app/models/deliveryModel';
import { DeliverySearchService } from 'src/app/services/delivery/delivery-search.service';
import * as _moment from "moment";
import {MomentDateAdapter,MAT_MOMENT_DATE_ADAPTER_OPTIONS} from "@angular/material-moment-adapter";
import {DateAdapter,MAT_DATE_FORMATS,MAT_DATE_LOCALE} from "@angular/material/core";
import { PhotoDeliveryModel } from 'src/app/models/photoDeliveryModel';
import { PhotosService } from 'src/app/services/delivery/photos.service';
import { MessagesService } from 'src/app/services/messages.service';
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
  selector: 'app-delivery-buyer-view',
  templateUrl: './delivery-buyer-view.component.html',
  styleUrls: ['./delivery-buyer-view.component.css'],
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class DeliveryBuyerViewComponent implements OnInit {

  constructor(
    private deliverySearch: DeliverySearchService,
    private router: Router,
    private route: ActivatedRoute,
    private photosService: PhotosService,
    private message: MessagesService,
    private markDeliveryService:DeliveredStatusService,
    private userData:UserDataService,
    private userSearchService: UserSearchService,
    private userSearch: UserSearchService,
  ) { }
  id = '';
  deliveryModel = <DeliveryModel>{};
  obj: StorageModel;
  receiptDate ;
  receptionTime = '';
  purchaseDate;
  purchaseTime;
  img;
  photos;
  buttonConfirm;
  whatsapp = false;
  showConfirm =false;
  numberContact;
  deliveryStatus;
  receiver;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.deliverySearch.search(this.id).subscribe(
      result => {
        if (result) {
          this.deliveryModel = result.delivery;
          if(this.deliveryModel.status !== "Criada"){
            this.receiptDate = moment(this.deliveryModel.receiptDate + "T00:00:00");
            this.receptionTime = this.deliveryModel.receptionTime;
          }else{
            this.receiptDate;
            this.receptionTime;
          }
          this.img = document.getElementById("image");
          this.deliveryStatus = this.deliveryModel.status;
          this.setDataPurchase(this.deliveryModel.idReceiver);
          this.setWhatsApp();
          this.photoList();

          if(this.deliveryModel.status !== "Aguardando confirmação do comprador"){
            this.showConfirm = false;
          }else if(this.deliveryModel.status =="Aguardando confirmação do comprador"){
            this.showConfirm = true;
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

  setDataPurchase(id){
    this.obj = JSON.parse(localStorage.getItem("data"));
   
    this.userSearch.search(id,this.obj.token).subscribe(
      result =>{
        if(result){
          this.receiver = result.name;
            this.purchaseDate = moment(this.deliveryModel.purchaseDate + "T00:00:00");     
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

  async statusConfirm(){

    let confirm = await this.message.dialogConfirm("status");
    this.markDeliveryService.confirmDelivered(this.id, confirm.response).subscribe(
      result => {
        
        if (result) {
          this.deliveryStatus = result.currentStatusDelivery;
          this.showConfirm = false;
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
         }  
       )
      
    }
  }

}
