import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserDeleteService {

  constructor(private http: HttpClient,
              private userData: UserDataService) { }

  delete(){
    let id = this.userData.getId();
    let url = `${environment.api_url}/customers/${id}`;
    let token = this.userData.getToken();
    

    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const headers = { headers: header };
    console.log("delete service");
    return this.http.delete(url, headers);
  }
}
