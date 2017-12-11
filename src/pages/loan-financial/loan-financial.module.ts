import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanFinancialPage } from './loan-financial';

@NgModule({
  declarations: [
    LoanFinancialPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanFinancialPage),
  ],
})
export class LoanFinancialPageModule {}
