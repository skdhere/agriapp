import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';
/**
 * Generated class for the KycSpousePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kyc-spouse',
  templateUrl: 'kyc-spouse.html',
})
export class KycSpousePage {

	spouse: FormGroup;
	farmer_id: string;
	submitAttempt: boolean = false;
	retryButton: boolean = false;
	addNew: boolean = true;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public formBuilder: FormBuilder, 
				private loadingCtrl: LoadingController, 
				public toastCtrl: ToastController,
				private api: Api) {

		this.farmer_id = this.navParams.get('farmer_id') || 0;
		//creating form via formbuilder 
		this.spouse = formBuilder.group({
			'f3_points' : ['0'],

			'f3_spouse_fname' : ['', Validators.compose([Validators.maxLength(50), Validators.minLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			'f3_spouse_age' : ['', Validators.compose([Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')])],
			'f3_spouse_mobno' : ['', Validators.compose([Validators.required, Validators.minLength(10) ,Validators.maxLength(10), Validators.pattern('^[0-9]+$')])],
			'f3_spouse_adhno' : ['', Validators.compose([Validators.required, Validators.minLength(12) ,Validators.maxLength(12), Validators.pattern('^[0-9]+$')])],
			'f3_spouse_shg' : ['', Validators.required],
			'f3_spouse_shgname' : ['', Validators.compose([Validators.maxLength(50), Validators.minLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			'f3_spouse_occp' : ['', Validators.required],
			'f3_spouse_owned_prop' : ['', Validators.required],
			'f3_spouse_prop_type' : ['', Validators.required],
			'f3_property_details' : ['', Validators.compose([Validators.maxLength(100), Validators.minLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			'f3_spouse_get_any_income' : ['', Validators.required],
			'f3_spouse_yearly_income' : ['', Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+$')])],
			'f3_spouse_mfi' : ['', Validators.required],
			'f3_spouse_mfiname' : ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			'f3_spouse_mfiamount' : ['', Validators.compose([Validators.required, Validators.maxLength(8), Validators.pattern('^[0-9]+$')])],
			'f3_affliation_status' : ['', Validators.required],
			'f3_fpo_name' : ['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			'f3_bank_name' : ['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
		});
	}

	ionViewDidLoad() {
	// 	this.retryButton = false;
	// 	let loading = this.loadingCtrl.create({
	// 	    content: 'Loading data...'
	// 	});
	// 	loading.present();
		
	// 	this.api.get('kyc_spouse/'+ this.farmer_id)
	// 	.map(res => res.json())
	// 	.subscribe(
	// 		data => {
	// 			if(data.success){
	// 				console.log(data.data);
	// 				for (let key in data.data) {
	// 					if(this.spouse.controls[key]){
	// 						this.spouse.controls[key].setValue(data.data[key], { emitEvent : false });
	// 					}
	// 					this.addNew = false;
	// 				}
	// 			}
	// 			else{
	// 				this.retryButton = true;
	// 			}
	// 			loading.dismiss();
	// 			this.showMessage("All * marked fields are mandatory!", "");
	// 		}, 
	// 		err => {
	// 			console.log(err);
	// 			setTimeout(() => {
	// 			    loading.dismiss();
	// 				this.retryButton = true;
	// 				this.showMessage("Something went wrong, make sure that Internet connection is on!", "danger");
	// 			}, 1000);
	// 		}
	// 	);

		//update validation here
		this.setValidation();

		//Listen for form changes
		this.spouse.controls['f3_spouse_shg'].valueChanges.subscribe(() => {this.setValidation();});
		this.spouse.controls['f3_spouse_owned_prop'].valueChanges.subscribe(() => {this.setValidation();});
		this.spouse.controls['f3_spouse_mfi'].valueChanges.subscribe(() => {this.setValidation();});
		this.spouse.controls['f3_spouse_mfi'].valueChanges.subscribe(() => {this.setValidation();});
	}

	setValidation(){
		let controls = this.spouse.controls;
		if(controls['f3_spouse_shg'].value == 'yes'){
			controls['f3_spouse_shgname'].enable();
		}
		else{
			controls['f3_spouse_shgname'].disable();
			controls['f3_spouse_shgname'].setValue('', { emitEvent : false });
		}

		if(controls['f3_spouse_owned_prop'].value == 'yes'){
			controls['f3_spouse_prop_type'].enable();
			controls['f3_property_details'].enable();
			controls['f3_spouse_get_any_income'].enable();
			controls['f3_spouse_yearly_income'].enable();
		}
		else{
			controls['f3_spouse_prop_type'].disable();
			controls['f3_property_details'].disable();
			controls['f3_spouse_get_any_income'].disable();
			controls['f3_spouse_yearly_income'].disable();

			controls['f3_spouse_prop_type'].setValue('', { emitEvent : false });
			controls['f3_property_details'].setValue('', { emitEvent : false });
			controls['f3_spouse_get_any_income'].setValue('', { emitEvent : false });
			controls['f3_spouse_yearly_income'].setValue('', { emitEvent : false });
		}


		if(controls['f3_spouse_mfi'].value == 'yes'){
			controls['f3_spouse_mfiname'].enable();
			controls['f3_spouse_mfiamount'].enable();
		}
		else{
			controls['f3_spouse_mfiname'].disable();
			controls['f3_spouse_mfiamount'].disable();

			controls['f3_spouse_mfiname'].setValue('', { emitEvent : false });
			controls['f3_spouse_mfiamount'].setValue('', { emitEvent : false });
		}


		if(controls['f3_affliation_status'].value == 'yes'){
			controls['f3_fpo_name'].enable();
		}
		else{
			controls['f3_fpo_name'].disable();
			controls['f3_fpo_name'].setValue('', { emitEvent : false });
		}
	}

	getTotal(){

		let values = this.spouse.getRawValue();
		let points = {};
		let total:number = 0;
		points['f2_edudetail']     = 0;
		points['f2_proficiency']   = 0;
		points['f2_participation'] = 0;

		//setting points based on values
		//f2_edudetail
		switch (values['f2_edudetail']) {
			case "illiterate":
				points['f2_edudetail'] = 2;
				break;
			case "primary education":
				points['f2_edudetail'] = 4;
				break;
			case "matriculate":
				points['f2_edudetail'] = 6;
				break;
			case "graduate":
				points['f2_edudetail'] = 8;
				break;
			case "post graduate":
				points['f2_edudetail'] = 10;
				break;
		}

		//f2_proficiency
		switch (values['f2_proficiency']) {
			case "read write":
				points['f2_proficiency'] = 10;
				break;
			case "read only":
				points['f2_proficiency'] = 5;
				break;
			case "understand only":
				points['f2_proficiency'] = 0;
				break;
		}

		//f2_participation
		switch (values['f2_participation']) {
			case "yes":
				points['f2_participation'] = 10;
				break;
			case "no":
				points['f2_participation'] = 0;
				break;
		}

		//sum of calculated points
		for(let point in points){
			total += Number(points[point]);
		}

		console.log(total);
		total = parseFloat((total/3).toFixed(2));
		this.spouse.get('f2_points').setValue(total, { emitEvent: false });
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
		if (this.spouse.valid) {

			let loading = this.loadingCtrl.create({
			    content: 'Loading data...'
			});
			loading.present();

			console.log('is POST ', this.addNew);
			if(this.addNew){
				//do post request
				this.api.post('kyc_spouse', this.spouse.value)
				.map(res => res.json())
				.subscribe(data => {
					
					if(data.success){		
						this.showMessage("Saved successfully!", "success");
					}
				    loading.dismiss();

				}, err => {
					console.log(err);
					this.showMessage("Data not updated, please try again!", "danger");
				    loading.dismiss();
				});
			}
			else{
				//do put request
				this.api.put('kyc_spouse', this.spouse.value)
				.map(res => res.json())
				.subscribe(data => {
				    this.showMessage("Saved successfully!", "success");
				    loading.dismiss();
				}, err => {
					console.log(err);
					this.showMessage("Data not updated, please try again!", "danger");
				    loading.dismiss();
				});
			}

			console.log(this.spouse.value);
		}else{
			console.log('Validation error', this.spouse.controls);
			this.showMessage("Please fill valid data!", "danger", 100000);
		}
	}

}
