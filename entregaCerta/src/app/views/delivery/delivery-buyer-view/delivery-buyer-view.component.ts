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
    
  ) { }
  id = '';
  deliveryModel = <DeliveryModel>{};
  date ;
  times = '';
  img;
  photos;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.deliverySearch.search(this.id).subscribe(
      result => {
        if (result) {
          this.deliveryModel = result.delivery;

          this.date = moment(this.deliveryModel.receiptDate + "T00:00:00");
          this.times = this.deliveryModel.receptionTime;
          this.img = document.getElementById("image");

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

}
