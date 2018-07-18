import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFarmerPage } from './add-farmer';
import { DirectivesModule } from '../../directives/directives.module';
import { SelectSearchableModule } from '../../components/select-searchable/select-searchable-module';

@NgModule({
  declarations: [
    AddFarmerPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFarmerPage),
    DirectivesModule,
    SelectSearchableModule,
  ],
})
export class AddFarmerPageModule {}
