import { PhotoDeliveryModel } from './../../../models/photoDeliveryModel';
import { PhotosService } from './../../../services/delivery/photos.service';
import { DeliveryUpdateService } from './../../../services/delivery/delivery-update.service';
import { DeliveryModel } from 'src/app/models/deliveryModel';
import { DeliverySearchService } from './../../../services/delivery/delivery-search.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';
// import * as moment from 'moment';
import {MomentDateAdapter,MAT_MOMENT_DATE_ADAPTER_OPTIONS} from "@angular/material-moment-adapter";
import {DateAdapter,MAT_DATE_FORMATS,MAT_DATE_LOCALE} from "@angular/material/core";
import * as _moment from "moment";
import { DeliveryObjectModel } from 'src/app/models/deliveryObjectModel';
// import { default as _rollupMoment } from "moment";

// const moment = _rollupMoment || _moment;
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
  deliveryModel = <DeliveryModel>{};
  photo: File;
  photos;
  img;
  constructor(
    private deliverySearch: DeliverySearchService,
    private router: Router,
    private route: ActivatedRoute,
    private deliveryUpdate: DeliveryUpdateService,
    private message: MessagesService,
    private photosService: PhotosService
  ) { }

  date ;
  times = '';

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

    // photoObject = this.deliveryModel.photos;
    // for (let { photoMimeType, photo, id } of photoObject) {
    //   this.photos.push({
    //     src: `data:${photoMimeType};base64,${photo}`,
    //     id: id
    //   });
    // }
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
