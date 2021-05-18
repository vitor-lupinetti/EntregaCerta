import { AuthService } from '../../../services/userAccount/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 
  user: string = '';
  password:string = '';

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    
  }

  login():void{
    
    this.authService.sendLogin({user:this.user, password: this.password});
    
  }

  create(): void{
    this.router.navigate(['user-register']);

  }

}
