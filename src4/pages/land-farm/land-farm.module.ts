import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LandFarmPage } from './land-farm';

@NgModule({
  declarations: [
    LandFarmPage,
  ],
  imports: [
    IonicPageModule.forChild(LandFarmPage),
  ],
})
export class LandFarmPageModule {}
