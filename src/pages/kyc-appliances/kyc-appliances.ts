import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the KycAppliancesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kyc-appliances',
  templateUrl: 'kyc-appliances.html',
})
export class KycAppliancesPage {

    appliances: FormGroup;
    numbers: Array<number> = Array(11).fill(0).map((x,i)=>i); 
	submitAttempt: boolean = false;

	constructor(public navCtrl: NavController,
				public navParams: NavParams, 
				public toastCtrl: ToastController,
				public formBuilder: FormBuilder) {
		this.appliances = formBuilder.group({
			'f7_points' : ['0'],

			'f7_television' : ['', Validators.required],
			'f7_refrigerator' : ['', Validators.required],
			'f7_wmachine' : ['', Validators.required],
			'f7_mixer' : ['', Validators.required],
			'f7_stove' : ['', Validators.required],
			'f7_bicycle' : ['', Validators.required],
			'f7_ccylinder' : ['', Validators.required],
			'f7_fans' : ['', Validators.required],
			'f7_motorcycle' : ['', Validators.required],
			'f7_car' : ['', Validators.required],
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad KycPhonePage');
		this.appliances.valueChanges.subscribe(()=>{
			this.getTotal();
		});
	}

	getTotal(){
		let values = this.appliances.getRawValue();
		let points = {};
		let total:number = 0;
		points['f7_television']   = values['f7_television'] ? 4 : 0;
		points['f7_refrigerator'] = values['f7_refrigerator'] ? 4 : 0;
		points['f7_wmachine']     = values['f7_wmachine'] ? 4 : 0;
		points['f7_mixer']        = values['f7_mixer'] ? 4 : 0;
		points['f7_stove']        = values['f7_stove'] ? 4 : 0;
		points['f7_bicycle']      = values['f7_bicycle'] ? 4 : 0;
		points['f7_ccylinder']    = values['f7_ccylinder'] ? 4 : 0;
		points['f7_fans']         = values['f7_fans'] ? 4 : 0;
		points['f7_motorcycle']   = values['f7_motorcycle'] ? 8 : 0;
		points['f7_car']          = values['f7_car'] ? 10 : 0;

		
		//sum of calculated points
		for(let point in points){
			total += Number(points[point]);
		}

		console.log(total);

		total = parseFloat((total/10).toFixed(2));
		this.appliances.get('f7_points').setValue(total, { emitEvent: false });
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
		if (this.appliances.valid) {
			console.log(this.appliances.value);
		}else{
			console.log('Validation error');
			this.showMessage("Please fill valid data!", "danger", 100000);
		}
	}

}
