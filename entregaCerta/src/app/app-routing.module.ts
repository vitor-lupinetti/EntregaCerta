import { TemplateReceiverComponent } from './receiver/template-receiver/template-receiver.component';
import { UserRegisterComponent } from './views/userAccount/user-register/user-register.component';

import { RouteGuard } from './authentication/guards/route-guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { TemplateBuyerComponent } from './buyer/template-buyer/template-buyer.component';
import { HomeBuyerComponent } from './buyer/view-buyer/home-buyer/home-buyer.component';
import { UserUpdateComponent } from './views/userAccount/user-update/user-update.component';
import { UserResolve } from './authentication/guards/userResolve.resolver';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {path: 'buyer', component: TemplateBuyerComponent , children: [
    {path: 'homeBuyer', component: HomeBuyerComponent},
    {path: 'user-update' , component: UserUpdateComponent,
      resolve:{userData : UserResolve}
  }, 
],
  canActivate:[RouteGuard]},

  {path: 'receiver', component: TemplateReceiverComponent , children: [
    {path: 'user-update' , component: UserUpdateComponent,
      resolve:{userData : UserResolve}
  }, 
],
  canActivate:[RouteGuard]},
{path: 'user-register' , component: UserRegisterComponent,
},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
