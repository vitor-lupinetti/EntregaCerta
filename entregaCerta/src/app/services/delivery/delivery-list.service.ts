import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeliveryModel } from 'src/app/models/deliveryModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryListService {

  constructor(private http: HttpClient) { }

  url = `${environment.api_url}/customers`;
  list(): Observable<DeliveryModel>{
    return this.http.get<DeliveryModel>(this.url)
  }
}

