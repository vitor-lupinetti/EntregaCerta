import { UserDataService } from './../userAccount/user-data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeliveryModel } from 'src/app/models/deliveryModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryListService {

  constructor(private http: HttpClient, private userData:UserDataService) { }

  
  list(): Observable<DeliveryModel[]>{
    let type = this.userData.getType().toLowerCase();
    let id = this.userData.getId(); 
    let token = this.userData.getToken();

   let url = `${environment.api_url}/delivery/${type}/${id}`;
 
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const headers = { headers: header };

    return this.http.get<DeliveryModel[]>(url, headers);
  }
}

