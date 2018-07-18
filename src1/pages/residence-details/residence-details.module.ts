import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResidenceDetailsPage } from './residence-details';
import { SelectSearchableModule } from '../../components/select-searchable/select-searchable-module';

@NgModule({
  declarations: [
    ResidenceDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ResidenceDetailsPage),
    SelectSearchableModule,
    
  ],
})
export class ResidenceDetailsPageModule {}
