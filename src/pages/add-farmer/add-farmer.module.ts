import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFarmerPage } from './add-farmer';

@NgModule({
  declarations: [
    AddFarmerPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFarmerPage),
  ],
})
export class AddFarmerPageModule {}
