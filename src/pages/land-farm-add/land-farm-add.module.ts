import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LandFarmAddPage } from './land-farm-add';
import { SelectSearchableModule } from '../../components/select-searchable/select-searchable-module';

@NgModule({
  declarations: [
    LandFarmAddPage,
  ],
  imports: [
    IonicPageModule.forChild(LandFarmAddPage),
    SelectSearchableModule,
  ],
})
export class LandFarmAddPageModule {}
