import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Farmerdetail } from './farmerdetail';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    Farmerdetail,
  ],
  imports: [
    IonicPageModule.forChild(Farmerdetail),
    SuperTabsModule.forRoot(),
  ]
})
export class FarmerdetailModule { }