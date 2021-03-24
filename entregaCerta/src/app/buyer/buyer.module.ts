import { BuyerComponent } from './buyer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateBuyerComponent } from './template-buyer/template-buyer.component';
import { HomeBuyerComponent } from './view-buyer/home-buyer/home-buyer.component';
import { BuyerRoutingModule } from './buyer.routing.module';
import{ MatToolbarModule } from '@angular/material/toolbar';
import{ MatIconModule } from '@angular/material/icon';
import{ MatSidenavModule } from '@angular/material/sidenav';
import {MatListModule}  from '@angular/material/list';
import {MatCardModule}  from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {  MatInputModule } from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import { TestComponent } from './view-buyer/test/test.component';

@NgModule({
    imports: [
        CommonModule,
        BuyerRoutingModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule
    ],
    exports: [],
    declarations: [BuyerComponent, TemplateBuyerComponent, HomeBuyerComponent, TestComponent],
    providers: [],
})

export class BuyerModule {}