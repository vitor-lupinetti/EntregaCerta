import { ResultModel } from 'src/app/models/resultModel';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }

  private data: ResultModel;


  setUserData(data: ResultModel){
    this.data = data;
  }

  getUserData(): ResultModel{
    return this.data;
  }
}
