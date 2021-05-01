import { UserDataService } from './../userAccount/user-data.service';
import { PhotoDeliveryModel } from './../../models/photoDeliveryModel';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  constructor(private userData:UserDataService,
              private http:HttpClient) { }

  photoUpdate(photo:PhotoDeliveryModel){

    let url = `${environment.api_url}/delivery-photos`;
    let token = this.userData.getToken();

    const formData: FormData = new FormData();
    formData.append('idDelivery',photo.idDelivery);
    if(photo.photo){
      formData.append('photo', photo.photo, photo.photo.name);
    }

    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const headers = { headers: header };

    

    return this.http.post<PhotoDeliveryModel>(url ,formData, headers);
  }

  photoList(idDelivery){
    let url = `${environment.api_url}/delivery-photos/${idDelivery}`;
    let token = this.userData.getToken();

    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const headers = { headers: header };
    return this.http.get<PhotoDeliveryModel[]>(url , headers);
  }

  photoDelete(id){
    let url = `${environment.api_url}/delivery-photos/${id}`;
    let token = this.userData.getToken();

    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const headers = { headers: header };
    return this.http.delete(url, headers);
  }
}


