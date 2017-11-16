import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the CropCultivationAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crop-cultivation-add',
  templateUrl: 'crop-cultivation-add.html',
})
export class CropCultivationAddPage {
	cultivation: FormGroup;
	submitAttempt: boolean = false;

	constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.cultivation = formBuilder.group({
			'f10_land' : ['', Validators.required],
			'f10_crop_variety' : ['', Validators.required],
			'f10_cultivating' : ['', Validators.required],
			'f10_stage' : ['', Validators.required],
			'f10_expected' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f10_expectedprice' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')])],
			'f10_diseases' : ['', Validators.required],
			'f10_pest' : ['', Validators.required],
			
			
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad cultivationFarmAddPage');
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
		if (this.cultivation.valid) {
			this.showMessage("Data added successfully!", "danger");
		}else{
			this.showMessage("Validation error!", "danger");
			console.log('Validation error');
			console.log('Validation error', this.cultivation.controls);
		}

	}
}
