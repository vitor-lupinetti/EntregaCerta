import { UserDataService } from './../userAccount/user-data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeliveryObjectModel } from 'src/app/models/deliveryObjectModel';

@Injectable({
  providedIn: 'root'
})
export class DeliverySearchService {

  constructor(private http:HttpClient, private userData:UserDataService) { }

  search(id:string): Observable<DeliveryObjectModel>{
  
    let token = this.userData.getToken();

   let url = `${environment.api_url}/delivery/${id}`;

    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const headers = { headers: header };


    return this.http.get<DeliveryObjectModel>(url, headers);
  }
}
