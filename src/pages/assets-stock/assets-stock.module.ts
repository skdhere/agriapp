import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssetsStockPage } from './assets-stock';

@NgModule({
  declarations: [
    AssetsStockPage,
  ],
  imports: [
    IonicPageModule.forChild(AssetsStockPage),
  ],
})
export class AssetsStockPageModule {}
