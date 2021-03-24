import { TestComponent } from './view-buyer/test/test.component';
import { HomeBuyerComponent } from './view-buyer/home-buyer/home-buyer.component';
import { TemplateBuyerComponent } from './template-buyer/template-buyer.component';
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

const buyerRoutes = [
    {path: 'buyer', component: TemplateBuyerComponent , children: [
        {path: 'homeBuyer', component: HomeBuyerComponent},
        {path: 'teste' , component: TestComponent}
    ]}
];

@NgModule({

    imports: [RouterModule.forChild(buyerRoutes)],
    exports: [RouterModule]

})
export class BuyerRoutingModule {}