import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KycFamilyPage } from './kyc-family';

@NgModule({
  declarations: [
    KycFamilyPage,
  ],
  imports: [
    IonicPageModule.forChild(KycFamilyPage),
  ],
})
export class KycFamilyPageModule {}
