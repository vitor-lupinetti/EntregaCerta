import { UserDataService } from './../../../services/userAccount/user-data.service';
import { DeliveryModel } from './../../../models/deliveryModel';
import { DeliveryListService } from './../../../services/delivery/delivery-list.service';
import { Component, OnInit } from '@angular/core';
import { StorageModel } from 'src/app/models/storageModel';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(private deliveryList:DeliveryListService,
              private userData:UserDataService,
              private message:MessagesService) { }

  deliveryModel: DeliveryModel[];
  
  displayedColumns;
  obj: StorageModel;

  ngOnInit(): void {

     this.obj = JSON.parse(localStorage.getItem("data"));

    if(this.obj.userType.toLowerCase() == "receiver"){
      this.displayedColumns = [ 'description', 'purchaseDate', 'action'];
    }
    else{
      this.displayedColumns = [ 'description', 'purchaseDate'];
    }

    this.deliveryModel = [];
    this.deliveryList.list().subscribe(result =>{
      if(result){
        this.deliveryModel = result;
        console.log(result);
      }
      console.log(result);
    },
    error=>{
      if(error == 404){
        console.log(error.status);
      }
      this.message.showMessage(error.error.error);
    })
  }


}
