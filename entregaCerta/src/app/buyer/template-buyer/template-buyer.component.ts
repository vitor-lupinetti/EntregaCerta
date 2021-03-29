import { AuthService } from './../../authentication/login/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-buyer',
  templateUrl: './template-buyer.component.html',
  styleUrls: ['./template-buyer.component.css']
})
export class TemplateBuyerComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
  }
  exit(){
   
  }

}
