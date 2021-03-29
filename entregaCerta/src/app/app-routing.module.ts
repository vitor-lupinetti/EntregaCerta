import { UserRegisterComponent } from './views/userAccount/user-register/user-register.component';

import { RouteGuard } from './authentication/guards/route-guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { TemplateBuyerComponent } from './buyer/template-buyer/template-buyer.component';
import { HomeBuyerComponent } from './buyer/view-buyer/home-buyer/home-buyer.component';
import { TestComponent } from './buyer/view-buyer/test/test.component';
import { UserUpdateComponent } from './views/userAccount/user-update/user-update.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {path: 'buyer', component: TemplateBuyerComponent , children: [
    {path: 'homeBuyer', component: HomeBuyerComponent},
    {path: 'teste' , component: TestComponent},
    {path: 'user-update' , component: UserUpdateComponent},
    
],
  canActivate:[RouteGuard]},
{path: 'user-register' , component: UserRegisterComponent,
},
{path: 'user-update' , component: UserUpdateComponent,
canActivate:[RouteGuard]
},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
