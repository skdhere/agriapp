import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the AssetsStockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-assets-stock',
  templateUrl: 'assets-stock.html',
})
export class AssetsStockPage {

	assets: FormGroup;
	submitAttempt: boolean = false;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public toastCtrl: ToastController,
				public formBuilder: FormBuilder) {
		this.assets = formBuilder.group({
			'f13_points' : ['0'],

			'f13_dairy_cattle' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_draft_cattle' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_buffalo' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_ox' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_sheep' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_goat' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_pig' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_poultry' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_donkeys' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AssetsDetailsPage');
	}

	showMessage(message, style: string, dur?: number){
		const toast = this.toastCtrl.create({
	      message: message,
	      showCloseButton: true,
	      duration: dur || 5000,
	      closeButtonText: 'Ok',
	      cssClass: style,
	      dismissOnPageChange: true
	    });

	    toast.present();
	}

	save(){
		this.submitAttempt = true;

		if (this.assets.valid) {
			console.log(this.assets.value);
		}else{
			console.log('Validation error');
			this.showMessage("Please fill valid data!", "danger", 100000);
		}
	}

}
