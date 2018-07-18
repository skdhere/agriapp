import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FarmersPage } from './farmers';

@NgModule({
  declarations: [
    FarmersPage,
  ],
  imports: [
    IonicPageModule.forChild(FarmersPage),
  ],
  exports: [
  	FarmersPage
  ]
})
export class HomePageModule {}