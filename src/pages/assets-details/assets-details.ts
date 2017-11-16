import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the AssetsDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-assets-details',
  templateUrl: 'assets-details.html',
})
export class AssetsDetailsPage {

	assets: FormGroup;
	submitAttempt: boolean = false;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public toastCtrl: ToastController,
				public formBuilder: FormBuilder) {
		this.assets = formBuilder.group({
			'f12_points' : ['0'],

			'f12_vehicle' : ['', Validators.required],
			// 'f12_total_val_of_vehical' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f12_machinery' : ['', Validators.required],
			// 'f12_total_val_of_machinery' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f12_any_other_assets' : [''],
			'f12_name_of_other_assets' : [''],
			// 'f12_mention_value_of_assets' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
		});
	}

	setValidation(){
		let controls = this.assets.controls;
		if(controls['f12_any_other_assets'].value == 'yes'){
			controls['f12_name_of_other_assets'].enable();
			// controls['f12_mention_value_of_assets'].enable();
		}
		else{
			controls['f12_name_of_other_assets'].setValue('', { emitEvent: false });
			// controls['f12_mention_value_of_assets'].setValue('', { emitEvent: false });
			controls['f12_name_of_other_assets'].disable();
			// controls['f12_mention_value_of_assets'].disable();
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AssetsDetailsPage');

		this.setValidation();
		//Listen for form changes
		this.assets.controls['f12_any_other_assets'].valueChanges.subscribe(() => {
			this.setValidation();
		});

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
