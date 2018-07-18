import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CropCultivationAddPage } from './crop-cultivation-add';
import { SelectSearchableModule } from '../../components/select-searchable/select-searchable-module';

@NgModule({
  declarations: [
    CropCultivationAddPage,
  ],
  imports: [
    IonicPageModule.forChild(CropCultivationAddPage),
    SelectSearchableModule,
  ],
})
export class CropCultivationAddPageModule {}
