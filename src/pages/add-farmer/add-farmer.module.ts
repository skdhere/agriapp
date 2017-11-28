import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFarmerPage } from './add-farmer';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    AddFarmerPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFarmerPage),
    DirectivesModule,
  ],
})
export class AddFarmerPageModule {}
