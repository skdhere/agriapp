import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LandFarmAddPage } from './land-farm-add';

@NgModule({
  declarations: [
    LandFarmAddPage,
  ],
  imports: [
    IonicPageModule.forChild(LandFarmAddPage),
  ],
})
export class LandFarmAddPageModule {}
