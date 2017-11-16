import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CropCultivationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crop-cultivation',
  templateUrl: 'crop-cultivation.html',
})
export class CropCultivationPage {

	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CropCultivationPage');
	}

    addnew(id: string){
		if(id){

		}else{
			this.navCtrl.push('CropCultivationAddPage');
		}
	}
}
