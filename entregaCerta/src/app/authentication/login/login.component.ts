import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 userModel:User = new User();

  
  user: string = '';
  password:string = '';

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    
  }

  login():void{
    this.userModel.user = this.user;
    this.userModel.password = this.password;
    this.authService.sendLogin(this.userModel);
    
    
  }

  create(): void{
    this.router.navigate(['user-register']);

  }

}
