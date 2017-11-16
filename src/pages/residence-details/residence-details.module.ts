import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResidenceDetailsPage } from './residence-details';

@NgModule({
  declarations: [
    ResidenceDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ResidenceDetailsPage),
  ],
})
export class ResidenceDetailsPageModule {}
