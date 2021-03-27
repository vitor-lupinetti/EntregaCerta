import { AuthService } from './authentication/login/auth.service';
import { BuyerModule } from './buyer/buyer.module';

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




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    
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
    BuyerModule,
    HttpClientModule,
  
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
