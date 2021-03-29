import { Component, OnInit } from '@angular/core';
import { AddressModel } from 'src/app/models/addressModel';
import { CustomerModel } from 'src/app/models/customerModel';
import { ResultModel } from 'src/app/models/resultModel';
import { UserModel } from 'src/app/models/userModel';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor() { }
  customer: CustomerModel;
  

  ngOnInit(): void {
    console.log(this.customer.userEntity.userTypeEntity.description);
  }



}
