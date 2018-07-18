import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KycSpousePage } from './kyc-spouse';

@NgModule({
  declarations: [
    KycSpousePage,
  ],
  imports: [
    IonicPageModule.forChild(KycSpousePage),
  ],
})
export class KycSpousePageModule {}
