
import { ResultModel } from './../../models/resultModel';
import { CustomerModel } from './../../models/customerModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { UserDataService } from './user-data.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { StorageModel } from 'src/app/models/storageModel';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserSearchService implements OnInit{

  

  constructor(private http: HttpClient, private userData: UserDataService, private authService:AuthService) { }
  ngOnInit(): void {
    
  }
  
  obj: StorageModel;

  
  resultModel = <ResultModel>{};
  
  url = `${environment.api_url}/customers/`;
  search(id, token): Observable<CustomerModel>{
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const headers = { headers: header };
 
   console.log(this.userData);
    return this.http.get<CustomerModel>(this.url +id, headers);     
  }
}
