import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssetsDetailsPage } from './assets-details';

@NgModule({
  declarations: [
    AssetsDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(AssetsDetailsPage),
  ],
})
export class AssetsDetailsPageModule {}
