import { CustomerModel } from 'src/app/models/customerModel';
import { ResultModel } from './../../models/resultModel';
import { UserDataService } from './user-data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserSearchService implements OnInit {

  constructor(private http: HttpClient, private userData: UserDataService) { }


  ngOnInit(): void {
  }

  id: string 
  url:string = "http://localhost:3333/customers/";
  data = <ResultModel>{};

  search(){
    
    this.id = localStorage.getItem("on");
    this.url += this.id;

    this.http.get<ResultModel>(this.url)
              .subscribe(
                result => { 
                  console.log(result);
                 if(result){
                   this.setSearch(result);
                   console.log("no search foi recebido" + JSON.stringify(result))
                 }
                },
                error => {
                  if(error.status == 400) {
                    console.log(error);
                  }
                }
              )
  }
  setSearch(obj:CustomerModel){
      this.data.customer = obj;
      this.userData.setUserData(this.data);
  }

}
