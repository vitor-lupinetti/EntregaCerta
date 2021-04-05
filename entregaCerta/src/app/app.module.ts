import { UserDataService } from './services/userAccount/user-data.service';
import { UserRegisterService} from './services/userAccount/userRegister.service';
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
import { TemplateBuyerComponent } from './buyer/template-buyer/template-buyer.component';
import { HomeBuyerComponent } from './buyer/view-buyer/home-buyer/home-buyer.component';
import { RouteGuard } from './authentication/guards/route-guard';
import { UserUpdateComponent } from './views/userAccount/user-update/user-update.component';
import { UserRegisterComponent } from './views/userAccount/user-register/user-register.component';
import { UserUpdateService } from './services/userAccount/user-update.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MessagesService } from './services/messages.service';






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, 
    TemplateBuyerComponent, 
    HomeBuyerComponent,  
    UserUpdateComponent,
    UserRegisterComponent,
    
    
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
    MatSnackBarModule,

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
  providers: [AuthService,
              UserRegisterService, 
              RouteGuard, UserUpdateService,
              UserDataService,
              MessagesService,],

  bootstrap: [AppComponent]
})
export class AppModule { }