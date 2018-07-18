import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanDetailsPage } from './loan-details';

@NgModule({
  declarations: [
    LoanDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanDetailsPage),
  ],
})
export class LoanDetailsPageModule {}
