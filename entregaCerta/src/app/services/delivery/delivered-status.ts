import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserDataService } from '../userAccount/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveredStatusService {

  constructor(private http:HttpClient, private userData:UserDataService) { }

  markDelivered(id){

    let url = `${environment.api_url}/delivery-delivered/${id}`;
    let token = this.userData.getToken();

   
   
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const headers = { headers: header };
    console.log(headers);

    return this.http.put<any>(url, {}, headers);
  }
  confirmDelivered(id, response){

    let url = `${environment.api_url}/confirm-delivery-delivered`;
    let token = this.userData.getToken();

    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const headers = { headers: header };

    return this.http.put<any>(url, {id: id, wasDelivered: response}, headers);
  }
}
