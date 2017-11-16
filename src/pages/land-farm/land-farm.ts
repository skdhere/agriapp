import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LandFarmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-land-farm',
  templateUrl: 'land-farm.html',
})
export class LandFarmPage {

	constructor(public navCtrl: NavController, public navParams: NavParams) {
  	}
	

	ionViewDidLoad() {
		console.log('ionViewDidLoad KycPhonePage');
	}

	addnew(id: string){
		if(id){

		}else{
			this.navCtrl.push('LandFarmAddPage');
		}
	}
}
