import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 
  name: string = '';
  password:string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  login():void{
    console.log("Usuário " + this.name);
    this.router.navigate(['buyer/homeBuyer']);
  }

  create(): void{
    

  }

}
