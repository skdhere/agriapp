import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { Forms } from './forms';

@NgModule({
  declarations: [
    Forms,
  ],
  imports: [
    IonicPageModule.forChild(Forms),
  ],
  exports: [
    Forms
  ]
})
export class FormModule { }