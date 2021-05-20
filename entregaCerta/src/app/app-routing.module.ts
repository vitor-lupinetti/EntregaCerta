import { DeliveryUpdateComponent } from './views/delivery/delivery-update/delivery-update.component';
import { ListComponent } from './views/delivery/list/list.component';
import { TemplateReceiverComponent } from './views/receiver/template-receiver/template-receiver.component';
import { UserRegisterComponent } from './views/userAccount/user-register/user-register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/userAccount/login/login.component';
import { TemplateBuyerComponent } from './views/buyer/template-buyer/template-buyer.component';
import { UserUpdateComponent } from './views/userAccount/user-update/user-update.component';
import { RouteGuard } from './services/guards/route-guard';
import { DeliveryBuyerViewComponent } from './views/delivery/delivery-buyer-view/delivery-buyer-view.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'buyer', component: TemplateBuyerComponent , children: [
    {path: 'user-update' , component: UserUpdateComponent
    }, 
    {path: 'delivery-list', component: ListComponent},
    {
      path: 'delivery-list/delivery-view/:id', component: DeliveryBuyerViewComponent
    }
  
  ],
  canActivate:[RouteGuard]},
  {
    path: 'receiver', component: TemplateReceiverComponent , children: [
    {
      path: 'user-update' , component: UserUpdateComponent
    }, 
    {path: 'delivery-list', component: ListComponent},
    {path: 'delivery-list/delivery-update/:id', component: DeliveryUpdateComponent},
  ],
  canActivate:[RouteGuard]},
  {
    path: 'user-register' , component: UserRegisterComponent,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
