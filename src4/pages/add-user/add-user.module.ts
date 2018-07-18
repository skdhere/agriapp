import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddUserPage } from './add-user';
import { DirectivesModule } from '../../directives/directives.module';
import { SelectSearchableModule } from '../../components/select-searchable/select-searchable-module';

@NgModule({
  declarations: [
    AddUserPage,
  ],
  imports: [
    IonicPageModule.forChild(AddUserPage),
    DirectivesModule,
    SelectSearchableModule,
  ],
})
export class AddUserPageModule {}
