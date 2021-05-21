import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduleModel } from 'src/app/models/ScheduleModel';
import { environment } from 'src/environments/environment';
import { UserDataService } from '../userAccount/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryScheduleService {

  constructor(private http:HttpClient, private userData:UserDataService) { }

  token;

  schedule(model:ScheduleModel): Observable<ScheduleModel>{
  
    let token = this.userData.getToken();

   let url = `${environment.api_url}/schedules`;
   
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const headers = { headers: header };
    console.log(headers);

    return this.http.post<ScheduleModel>(url, model, headers);
  }

  findOne(idDelivery: string){
    let token = this.userData.getToken();

    let url = `${environment.api_url}/schedules/${idDelivery}`;
   
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const headers = { headers: header };
    console.log(headers);

    return this.http.get<ScheduleModel>(url, headers);
  }

  cancelSchedule(model:ScheduleModel){
    let token = this.userData.getToken();

    let url = `${environment.api_url}/schedules`;
   
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const headers = { headers: header };

    let obj = {
      id: model.id,
      reason: model.reason
    }

    return this.http.put<ScheduleModel>(url, obj, headers);
  }
}
