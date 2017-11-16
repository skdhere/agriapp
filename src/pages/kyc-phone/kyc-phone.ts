import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/**
 * Generated class for the KycPhonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kyc-phone',
  templateUrl: 'kyc-phone.html',
})
export class KycPhonePage {

    phone: FormGroup;
	submitAttempt: boolean = false;

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				public toastCtrl: ToastController,
				public formBuilder: FormBuilder) {
		this.phone = formBuilder.group({
			'f5_points' : ['0'],

			'f5_phonetype' : ['', Validators.required],
			// 'f5_any_one_have_smart_phone' : ['', Validators.required],
			'f5_servpro' : [''],
			'f5_network' : [''],
			'f5_datapack' : [''],
			'f5_datapackname' : [''],
			'f5_appuse' : [''],
			// 'f5_app_name' : ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
			'f5_farmapp' : [''],
			
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad KycPhonePage');

		//update validation here
		this.setValidation();

		//Listen for form changes
		this.phone.controls['f5_phonetype'].valueChanges.subscribe(() => {
			this.setValidation();
		});

		this.phone.controls['f5_datapack'].valueChanges.subscribe(() => {
			this.setValidation();
		});
	}

	setValidation(){
		let controls = this.phone.controls;
		if(controls['f5_phonetype'].value === 'smartphone'){

			controls['f5_datapack'].enable({ emitEvent: false });
			controls['f5_appuse'].enable({ emitEvent: false });
			// controls['f5_app_name'].enable({ emitEvent: false });
			controls['f5_farmapp'].enable({ emitEvent: false });
		}
		else{
			controls['f5_datapack'].setValue('', { emitEvent: false });
			controls['f5_appuse'].setValue('', { emitEvent: false });
			// controls['f5_app_name'].setValue('', { emitEvent: false });
			controls['f5_farmapp'].setValue('', { emitEvent: false });

			controls['f5_datapack'].disable({ emitEvent: false });
			controls['f5_appuse'].disable({ emitEvent: false });
			// controls['f5_app_name'].disable({ emitEvent: false });
			controls['f5_farmapp'].disable({ emitEvent: false });
		}
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
		if (this.phone.valid) {
			console.log(this.phone.value);
		}else{
			console.log('Validation error');
			this.showMessage("Please fill valid data!", "danger", 100000);
		}
	}

}
