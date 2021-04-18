import { DeliverySearchService } from './services/delivery/delivery-search.service';
import { UserSearchService } from './services/userAccount/user-search.service';
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
import { UserResolve } from './authentication/guards/userResolve.resolver';
import { TemplateReceiverComponent } from './receiver/template-receiver/template-receiver.component';
import { UpdateDeliveryComponent } from './buyer/view-buyer/update-delivery/update-delivery.component';
import { ListComponent } from './views/delivery/list/list.component';
import { DeliveryListService } from './services/delivery/delivery-list.service';
import { MatTableModule } from '@angular/material/table';
import { DeliveryUpdateComponent } from './views/delivery/delivery-update/delivery-update.component';
import { DeliveryUpdateService } from './services/delivery/delivery-update.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, 
    TemplateBuyerComponent, 
    HomeBuyerComponent,  
    UserUpdateComponent,
    UserRegisterComponent,
    TemplateReceiverComponent,
    UpdateDeliveryComponent,
    ListComponent,
    DeliveryUpdateComponent,
    
    
    
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
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
  

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
              MessagesService,
              UserSearchService,
              UserResolve,
              DeliveryListService,
              DeliverySearchService,
              DeliveryUpdateService],

  bootstrap: [AppComponent]
})
export class AppModule { }
