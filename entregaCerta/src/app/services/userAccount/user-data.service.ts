import { ResultModel } from 'src/app/models/resultModel';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }

   data: ResultModel;
   reload;
  private type: string;
  private id: string;
  private token:string;

  setUserData(data: ResultModel){
    console.log("set data");
    this.data = data;
  }

  getUserData(): ResultModel{
    console.log("get data");
    return this.data;
    
  }

  setId( id:string ){
    this.id = id;
    
  }

  getId(){
    
    return this.id;
  }

  setType(user){
    this.type = user;
  }

  getType(){
    return this.type;
  }

  setToken(token){
    this.token = token;
  }

  getToken(){
    return this.token;
  }

}
