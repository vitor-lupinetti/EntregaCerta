import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleModel } from 'src/app/models/ScheduleModel';
import * as _moment from "moment";
import {MomentDateAdapter,MAT_MOMENT_DATE_ADAPTER_OPTIONS} from "@angular/material-moment-adapter";
import {DateAdapter,MAT_DATE_FORMATS,MAT_DATE_LOCALE} from "@angular/material/core";
import { DeliveryScheduleService } from 'src/app/services/delivery/delivery-schedule.service';
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
  selector: 'app-delivery-schedule',
  templateUrl: './delivery-schedule.component.html',
  styleUrls: ['./delivery-schedule.component.css'],
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class DeliveryScheduleComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private deliveryScheduleService: DeliveryScheduleService,
    private message: MessagesService
  ) { }
  id = '';
  scheduleModel = <ScheduleModel>{};
  date ;
  times = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  scheduleDelivery(){
    let dateTimeToSend = this.date;

    dateTimeToSend = moment.utc(dateTimeToSend).local(true).toISOString();
    dateTimeToSend = dateTimeToSend.replace(/T.*/, ` `);
    console.log(dateTimeToSend)
    this.deliveryScheduleService
      .schedule({
        idDelivery:this.id,
        place: this.scheduleModel.place,
        time: this.times,
        date: dateTimeToSend
      })
      .subscribe(
        result => {
          if (result) {
            this.message.showMessage("Entrega agendada");

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
}
