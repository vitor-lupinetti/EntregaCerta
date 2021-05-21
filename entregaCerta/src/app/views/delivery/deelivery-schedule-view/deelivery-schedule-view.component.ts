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
  selector: 'app-deelivery-schedule-view',
  templateUrl: './deelivery-schedule-view.component.html',
  styleUrls: ['./deelivery-schedule-view.component.css'],
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class DeeliveryScheduleViewComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private scheduleService: DeliveryScheduleService,
    private message: MessagesService,
    
  ) { }
  id = '';
  scheduleModel = <ScheduleModel>{};
  date ;
  times = '';
  isCanceled = false;
  reason = ''

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.findSchedule();
  }

  findSchedule(){
    this.scheduleService.findOne(this.id).subscribe(
      result =>{
        this.scheduleModel = result;
      },
     
    )
  }

  cancel(){
    if(this.scheduleModel.reason != null){
      this.scheduleService.cancelSchedule(this.scheduleModel).subscribe(
        result =>{
          this.router.navigate(['buyer/delivery-list']);
          this.message.showMessage("Agendamento Cancelado");
        },
      )
    }
    
  }

}
