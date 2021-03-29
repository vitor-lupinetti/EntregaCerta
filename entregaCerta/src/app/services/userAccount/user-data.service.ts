import { ResultModel } from 'src/app/models/resultModel';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }

  data: ResultModel;

  userData(userData:ResultModel){
    this.data = userData;
  }

  setUserData(dataUpdate: ResultModel){
    this.data = dataUpdate;
    console.log(this.data)
  }

  getUserData(): ResultModel{
    console.log(this.data);
    return this.data;
    
  }
}
