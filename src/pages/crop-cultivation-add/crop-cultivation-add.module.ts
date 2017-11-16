import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CropCultivationAddPage } from './crop-cultivation-add';

@NgModule({
  declarations: [
    CropCultivationAddPage,
  ],
  imports: [
    IonicPageModule.forChild(CropCultivationAddPage),
  ],
})
export class CropCultivationAddPageModule {}
