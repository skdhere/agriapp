import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CropPreviousAddPage } from './crop-previous-add';
import { SelectSearchableModule } from '../../components/select-searchable/select-searchable-module';

@NgModule({
  declarations: [
    CropPreviousAddPage,
  ],
  imports: [
    IonicPageModule.forChild(CropPreviousAddPage),
    SelectSearchableModule,
  ],
})
export class CropPreviousAddPageModule {}
