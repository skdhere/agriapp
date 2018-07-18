import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KycKnowledgePage } from './kyc-knowledge';

@NgModule({
  declarations: [
    KycKnowledgePage,
  ],
  imports: [
    IonicPageModule.forChild(KycKnowledgePage),
  ],
})
export class KycKnowledgePageModule {}
