import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KycPhonePage } from './kyc-phone';

@NgModule({
  declarations: [
    KycPhonePage,
  ],
  imports: [
    IonicPageModule.forChild(KycPhonePage),
  ],
})
export class KycPhonePageModule {}
