import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KycAppliancesPage } from './kyc-appliances';

@NgModule({
  declarations: [
    KycAppliancesPage,
  ],
  imports: [
    IonicPageModule.forChild(KycAppliancesPage),
  ],
})
export class KycAppliancesPageModule {}
