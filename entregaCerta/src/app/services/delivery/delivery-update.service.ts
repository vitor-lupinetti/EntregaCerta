import { UserDataService } from './../userAccount/user-data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DeliveryModel } from 'src/app/models/deliveryModel';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeliveryUpdateModel } from 'src/app/models/deliveryUpdateModel';

@Injectable({
  providedIn: 'root'
})
export class DeliveryUpdateService {

  constructor(private http:HttpClient, private userData:UserDataService) { }

  update(delivery:DeliveryModel): Observable<DeliveryModel>{
  
    let token = this.userData.getToken();

   let url = `${environment.api_url}/delivery`;
   
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const headers = { headers: header };


    return this.http.put<DeliveryModel>(url, delivery, headers);
  }
}
