import { ResultModel } from 'src/app/models/resultModel';
import { AuthService } from './../../../authentication/login/auth.service';
import { Component, OnInit } from '@angular/core';
import { CustomerModel } from 'src/app/models/customerModel';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

   data: CustomerModel;
   name:string;
   photo:string;
   email: string;
   contactNumber:string;
   hasWhatsApp:string;
   cep:string;
   street: string;
   homeNumber:string;
   complement:string;
   neighborhood:string;

  update(){
      
      this.data = this.auth.userData();
      this.name = this.data.name;
      
     console.log(this.data.name);
  }

}
