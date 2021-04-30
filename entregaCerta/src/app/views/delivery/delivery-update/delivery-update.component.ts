import { PhotoDeliveryModel } from './../../../models/photoDeliveryModel';
import { PhotosService } from './../../../services/delivery/photos.service';
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

  id = '';
  deliveryObjectModel = <DeliveryObjectModel>{};
  deliveryModel = <DeliveryModel>{};
  photo:File;
  photos;
  img;
  constructor(private deliverySearch:DeliverySearchService,
              private router:Router,
              private route:ActivatedRoute,
              private deliveryUpdate:DeliveryUpdateService,
              private message:MessagesService,
              private photosService:PhotosService) { }

  date = '';
  times = ''; 
  ngOnInit(): void {
    
    this.id = this.route.snapshot.paramMap.get('id');
    this.deliverySearch.search(this.id).subscribe(result =>{
      if(result){
        this.deliveryModel = result.delivery;
        // this.date = this.deliveryModel.receiptDate.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/, "$3/$2/$1") + "T00:00:00" ;
        this.date = this.deliveryModel.receiptDate + "T00:00:00" ;
        console.log(this.date);
        this.times = this.deliveryModel.receptionTime.replace(/\..*/,"");
        console.log(this.times);
        this.img = document.getElementById("image");
        this.photoList();
      }
      
    },
    error=>{
      if(error == 404){
        console.log(error.status);
      }
      console.log(error);
    });
    
  }

  handleFileInput(files: FileList) {
    this.photo = files.item(0);
    let reader = new FileReader();
    reader.readAsDataURL(this.photo);
    reader.onload = () => {
      this.img.setAttribute("src", reader.result);
      console.log(reader.result);
    };

    let photo:PhotoDeliveryModel;

    this.photosService.photoUpdate({idDelivery: this.id, photo: this.photo}).subscribe(result =>{
      if(result){
         photo = result;
         this.photoList();
      }
      
    },
    error=>{
      if(error == 404){
        console.log(error.status);
      }
      console.log(error.error.error)
      this.message.showMessage(error.error.error);
    });
    
  }

  photoList(){
    let photoObject:PhotoDeliveryModel[];
     this.photos = [];
    this.photosService.photoList(this.id).subscribe(result =>{
      if(result){
         photoObject = result;
        console.log(photoObject);
        for(let {photoMimeType, photo, id} of photoObject){
          
          this.photos.push({
          src:`data:${photoMimeType};base64,${photo}`,
          id: id
          });
        }
      }
      
    },
    error=>{
      if(error == 404){
        console.log(error.status);
      }
      console.log(error.error.error)
      this.message.showMessage(error.error.error);
    })
  }


  photoDelete(id){
    this.photosService.photoDelete(id).subscribe(result =>{
      if(result){
        this.photos.filter(function(image){
          return image.id != id;
        })
      }
    },
    error =>{
      console.log(error.error.error)
      this.message.showMessage(error.error.error);
    })
    console.log(id);
  }

  updateDelivery(){
    
    let dateTime = this.date;
    let newDate: moment.Moment = moment.utc(this.date).local();
    this.date= newDate.format("YYYY-MM-DD") + "T" + this.times;
    if(this.date.length == 19){
      this.date = this.date.substr(0,this.date.length -3);
    }
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


