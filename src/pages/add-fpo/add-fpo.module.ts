import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFpoPage } from './add-fpo';
import { SelectSearchableModule } from '../../components/select-searchable/select-searchable-module';

@NgModule({
  declarations: [
    AddFpoPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFpoPage),
    SelectSearchableModule,
  ],
})
export class AddFpoPageModule {}
