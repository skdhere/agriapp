import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CropCultivationPage } from './crop-cultivation';

@NgModule({
  declarations: [
    CropCultivationPage,
  ],
  imports: [
    IonicPageModule.forChild(CropCultivationPage),
  ],
})
export class CropCultivationPageModule {}
