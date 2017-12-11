import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanDetailsAddPage } from './loan-details-add';

@NgModule({
  declarations: [
    LoanDetailsAddPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanDetailsAddPage),
  ],
})
export class LoanDetailsAddPageModule {}
