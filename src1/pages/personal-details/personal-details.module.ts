import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalDetailsPage } from './personal-details';
import { SelectSearchableModule } from '../../components/select-searchable/select-searchable-module';

@NgModule({
  declarations: [
    PersonalDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalDetailsPage),
    SelectSearchableModule,
  ],
})
export class PersonalDetailsPageModule {}
