import { DeliverySearchService } from './services/delivery/delivery-search.service';
import { UserSearchService } from './services/userAccount/user-search.service';
import { UserDataService } from './services/userAccount/user-data.service';
import { UserRegisterService} from './services/userAccount/userRegister.service';
import { AuthService } from './services/userAccount/auth.service';
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
import { LoginComponent } from './views/userAccount/login/login.component';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TemplateBuyerComponent } from './views/buyer/template-buyer/template-buyer.component';
import { UserUpdateComponent } from './views/userAccount/user-update/user-update.component';
import { UserRegisterComponent } from './views/userAccount/user-register/user-register.component';
import { UserUpdateService } from './services/userAccount/user-update.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MessagesService } from './services/messages.service';
import { UserResolve } from './resolver/userResolve.resolver';
import { TemplateReceiverComponent } from './views/receiver/template-receiver/template-receiver.component';
import { ListComponent } from './views/delivery/list/list.component';
import { DeliveryListService } from './services/delivery/delivery-list.service';
import { MatTableModule } from '@angular/material/table';
import { DeliveryUpdateComponent, MY_FORMATS } from './views/delivery/delivery-update/delivery-update.component';
import { DeliveryUpdateService } from './services/delivery/delivery-update.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatNativeDateModule, MAT_DATE_FORMATS, NativeDateModule} from '@angular/material/core';
import { PhotosService } from './services/delivery/photos.service';
import { UserDeleteComponent } from './views/userAccount/user-delete/user-delete.component';
import { UserDeleteService } from './services/userAccount/user-delete.service';
import { RouteGuard } from './services/guards/route-guard';
import { DeliveryBuyerViewComponent } from './views/delivery/delivery-buyer-view/delivery-buyer-view.component';
import { DeliveryConfirmComponent } from './views/delivery/delivery-confirm/delivery-confirm.component';
import { DeliveredStatusService } from './services/delivery/delivered-status';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, 
    TemplateBuyerComponent, 
    UserUpdateComponent,
    UserRegisterComponent,
    TemplateReceiverComponent,
    ListComponent,
    DeliveryUpdateComponent,
    UserDeleteComponent,
    DeliveryBuyerViewComponent,
    DeliveryConfirmComponent,  
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
    MatDialogModule,
    MatDatepickerModule,
    NativeDateModule,
    MatCheckboxModule,
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
              DeliveryUpdateService,
              PhotosService,
              DeliveredStatusService,
              UserDeleteService,
              {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
            ],

  bootstrap: [AppComponent]
})
export class AppModule { } 
