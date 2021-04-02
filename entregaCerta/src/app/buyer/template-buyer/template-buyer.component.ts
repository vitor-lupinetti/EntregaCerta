import { Router } from '@angular/router';
import { AuthService } from './../../authentication/login/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-buyer',
  templateUrl: './template-buyer.component.html',
  styleUrls: ['./template-buyer.component.css']
})
export class TemplateBuyerComponent implements OnInit {

  constructor(private authService:AuthService, private routes:Router) { }

  ngOnInit(): void {
  }
  exit(){
    console.log("logout");
    this.authService.setLog(false);
    localStorage.removeItem("data");
    this.routes.navigate(['']);
  
  }

}
