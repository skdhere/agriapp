import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CropPreviousPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crop-previous',
  templateUrl: 'crop-previous.html',
})
export class CropPreviousPage {

	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CropPreviousPage');
	}

	addnew(id: string){
		if(id){

		}else{
			this.navCtrl.push('CropPreviousAddPage');
		}
	}

}
