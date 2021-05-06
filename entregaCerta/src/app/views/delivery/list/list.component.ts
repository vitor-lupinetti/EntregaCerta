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

  constructor(
    private deliveryList: DeliveryListService,
    private message: MessagesService
  ) { }

  deliveryModel: DeliveryModel[];

  displayedColumns;
  obj: StorageModel;

  ngOnInit(): void {
    this.obj = JSON.parse(localStorage.getItem("data"));

    if (this.obj.userType.toLowerCase() == "receiver") {
      this.displayedColumns = ['description', 'purchaseDate', 'action'];
    }
    else {
      this.displayedColumns = ['description', 'purchaseDate', 'view'];
    }

    this.deliveryModel = [];
    this.deliveryList.list().subscribe(
      result => {
        if (result) {
          this.deliveryModel = result
            .map((delivery: DeliveryModel) => {
              delivery.purchaseDate = delivery.purchaseDate.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$3/$2/$1");

              return delivery
            });
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
