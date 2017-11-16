import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the KycFamilyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kyc-family',
  templateUrl: 'kyc-family.html',
})
export class KycFamilyPage {

  	family: FormGroup;
	submitAttempt: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.family = formBuilder.group({
			'f6_points' : ['0'],

			'f6_jointfamily' : ['', Validators.required],
			'f6_members' : ['', Validators.required],
			'f6_children' : ['', Validators.required],
			'f6_smartuse' : ['',Validators.required],
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad KycPhonePage');

		this.family.controls['f6_children'].valueChanges.subscribe(() => {this.setValidation();});

	}

	setValidation()
	{
		let controls = this.family.controls;

		console.log(controls['f6_smartuse'].value);
		if(controls['f6_children'].value > 0)
		{
			controls['f6_smartuse'].enable({ emitEvent: false });
			console.log('ddddf');
		}
		else{

			controls['f6_smartuse'].setValue('', { emitEvent: false });
			controls['f6_smartuse'].disable();

		}

	}
	save(){
		this.submitAttempt = true;
		if (this.family.valid) {
			console.log(this.family.value);
		}else{
			console.log('Validation error');
		}
	}

}
