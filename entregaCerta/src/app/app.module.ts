
import { UserTypeModel } from './models/userTypeModel';
import { UserModel } from 'src/app/models/userModel';
import { ResultModel } from 'src/app/models/resultModel';
import { NeighborhoodModel } from './models/neighborhoodModel';
import { CustomerModel } from 'src/app/models/customerModel';
import { AddressModel } from 'src/app/models/addressModel';
import { UserRegisterService} from './services/userRegister.service';
import { AuthService } from './authentication/login/auth.service';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import{ MatToolbarModule } from '@angular/material/toolbar';
import{ MatIconModule } from '@angular/material/icon';
import{ MatSidenavModule } from '@angular/material/sidenav';

import {MatListModule}  from '@angular/material/list';
import {MatCardModule}  from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {  MatInputModule } from '@angular/material/input';
import { LoginComponent } from './authentication/login/login.component';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BuyerComponent } from './buyer/buyer.component';
import { TemplateBuyerComponent } from './buyer/template-buyer/template-buyer.component';
import { HomeBuyerComponent } from './buyer/view-buyer/home-buyer/home-buyer.component';
import { TestComponent } from './buyer/view-buyer/test/test.component';
import { RouteGuard } from './authentication/guards/route-guard';
import { UserUpdateComponent } from './views/userAccount/user-update/user-update.component';
import { UserRegisterComponent } from './views/userAccount/user-register/user-register.component';






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, 
    BuyerComponent, 
    TemplateBuyerComponent, 
    HomeBuyerComponent, 
    TestComponent,  
    UserUpdateComponent, UserRegisterComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,

    // MatToolbarModule,
    //     MatIconModule,
    //     MatSidenavModule,
    //     MatListModule,
    //     MatCardModule,
    //     MatButtonModule,
    //     MatFormFieldModule,
    //     MatInputModule,
    //     FormsModule,
  
  ],
  providers: [AuthService,UserRegisterService, RouteGuard],

  bootstrap: [AppComponent]
})
export class AppModule { }
