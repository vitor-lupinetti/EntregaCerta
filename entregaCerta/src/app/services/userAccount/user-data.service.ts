import { ResultModel } from 'src/app/models/resultModel';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }

  private data: ResultModel;

  // userData(userData:ResultModel){
  //   this.data = userData;
  // }

  setUserData(data: ResultModel){
    this.data = data;
    console.log(this.data + "setUserData")
  }

  getUserData(): ResultModel{
    console.log(this.data);
    return this.data;
    
  }
}
