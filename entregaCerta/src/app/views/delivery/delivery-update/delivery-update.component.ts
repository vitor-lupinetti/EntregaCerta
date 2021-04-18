import { DeliveryUpdateService } from './../../../services/delivery/delivery-update.service';
import { DeliveryModel } from 'src/app/models/deliveryModel';
import { DeliverySearchService } from './../../../services/delivery/delivery-search.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';
import * as moment from 'moment';
import { DeliveryObjectModel } from 'src/app/models/deliveryObjectModel';

@Component({
  selector: 'app-delivery-update',
  templateUrl: './delivery-update.component.html',
  styleUrls: ['./delivery-update.component.css']
})
export class DeliveryUpdateComponent implements OnInit {

  deliveryObjectModel = <DeliveryObjectModel>{};
  deliveryModel = <DeliveryModel>{};
  constructor(private deliverySearch:DeliverySearchService,
              private router:Router,
              private route:ActivatedRoute,
              private deliveryUpdate:DeliveryUpdateService,
              private message:MessagesService) { }

  date = '';
  times = ''; 
  ngOnInit(): void {
    
    const id = this.route.snapshot.paramMap.get('id');
    this.deliverySearch.search(id).subscribe(result =>{
      if(result){
        this.deliveryModel = result.delivery;
        this.date = this.deliveryModel.receiptDate;
        this.times = this.deliveryModel.receptionTime;
        
      }
      
    },
    error=>{
      if(error == 404){
        console.log(error.status);
      }
      console.log(error);
    });
    
    
  }

  

  updateDelivery(){

    let dateTime = this.date;
    let newDate: moment.Moment = moment.utc(this.date).local();
    this.date= newDate.format("YYYY-MM-DD") + "T" + this.times;
    console.log(this.date);
    this.deliveryUpdate.update({amountPackaging: this.deliveryModel.amountPackaging , id: this.deliveryModel.id, date: this.date}).subscribe(result =>{
      if(result){
        this.message.showMessage("Entrega atualizada");

        this.router.navigate(['receiver/delivery-list']);
      }
      
    },
    error=>{
      if(error == 404){
        console.log(error.status);
        
      }
      console.log(error);
      this.message.showMessage(error.error.error);
    })
    this.date = dateTime;
  }

  cancel(){
    this.router.navigate(['receiver/delivery-list']);
  }

}
