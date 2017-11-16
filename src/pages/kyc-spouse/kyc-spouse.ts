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
            'f3_married_status' : ['',Validators.required],
            'f3_spouse_fname' : ['', Validators.compose([Validators.maxLength(50), Validators.minLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			'f3_spouse_mname' : ['', Validators.compose([Validators.maxLength(50), Validators.minLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			'f3_spouse_lname' : ['', Validators.compose([Validators.maxLength(50), Validators.minLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			'f3_spouse_age' : ['', Validators.compose([Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')])],
			'f3_spouse_mobno' : ['', Validators.compose([Validators.required, Validators.minLength(10) ,Validators.maxLength(10), Validators.pattern('^[0-9]+$')])],
			'f3_spouse_adhno' : ['', Validators.compose([Validators.required, Validators.minLength(12) ,Validators.maxLength(12), Validators.pattern('^[0-9]+$')])],
			'f3_loan_interest' : ['', Validators.compose([Validators.required, Validators.minLength(1) ,Validators.maxLength(2), Validators.pattern('^[0-9]+$')])],
			'f3_loan_tenure' : ['', Validators.compose([Validators.required, Validators.minLength(1) ,Validators.maxLength(2), Validators.pattern('^[0-9]+$')])],
			'f3_loan_emi' : ['', Validators.compose([Validators.required, Validators.minLength(1) ,Validators.maxLength(2), Validators.pattern('^[0-9]+$')])],
			'f3_spouse_shg' : ['', Validators.required],
			'f3_spouse_income' : ['',Validators.required],
			'f3_spouse_shgname' : ['', Validators.compose([Validators.maxLength(50), Validators.minLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			'f3_spouse_occp' : ['', Validators.required],
			'f3_spouse_mfi' : ['', Validators.required],
			'f3_loan_purpose' : ['',Validators.required],
			'f3_spouse_mfiname' : ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			'f3_spouse_mfiamount' : ['', Validators.compose([Validators.required, Validators.maxLength(8), Validators.pattern('^[0-9]+$')])],
			
			
		});
	}

	ionViewDidLoad() {
		//update validation here
		this.setValidation();

		//Listen for form changes
		
		this.spouse.controls['f3_married_status'].valueChanges.subscribe(() => {this.setValidation();});
		this.spouse.controls['f3_spouse_shg'].valueChanges.subscribe(() => {this.setValidation();});
		this.spouse.controls['f3_spouse_occp'].valueChanges.subscribe(() => {this.setValidation();});
		this.spouse.controls['f3_spouse_mfi'].valueChanges.subscribe(() => {this.setValidation();});

		
		
	}

	setValidation(){
		let controls = this.spouse.controls;
		if(controls['f3_married_status'].value == 'yes'){
			
			
			controls['f3_spouse_fname'].enable({ emitEvent: false });
			controls['f3_spouse_lname'].enable({ emitEvent: false });
			controls['f3_spouse_mname'].enable({ emitEvent: false });
			controls['f3_spouse_age'].enable({ emitEvent: false });
			controls['f3_spouse_mobno'].enable({ emitEvent: false });
			controls['f3_spouse_adhno'].enable({ emitEvent: false });
			controls['f3_spouse_shg'].enable({ emitEvent: false });
			controls['f3_spouse_occp'].enable({ emitEvent: false });
			controls['f3_spouse_occp'].enable({ emitEvent: false });
			controls['f3_spouse_mfi'].enable({ emitEvent: false });
			controls['f3_spouse_shgname'].enable({ emitEvent: false });
			
			
		}
		else
		{
			console.log('cbsdjsdg');
			controls['f3_spouse_fname'].setValue('', { emitEvent: false });
			controls['f3_spouse_lname'].setValue('', { emitEvent: false });
			controls['f3_spouse_mname'].setValue('', { emitEvent: false });
			controls['f3_spouse_age'].setValue('', { emitEvent: false });
			controls['f3_spouse_mobno'].setValue('', { emitEvent: false });
			controls['f3_spouse_adhno'].setValue('', { emitEvent: false });
			controls['f3_spouse_shg'].setValue('', { emitEvent: false });
			controls['f3_spouse_shgname'].setValue({ emitEvent: false });
			controls['f3_spouse_occp'].setValue('', { emitEvent: false });
			
			controls['f3_spouse_mfi'].setValue('', { emitEvent: false });

			controls['f3_spouse_fname'].disable({ emitEvent: false });
			controls['f3_spouse_lname'].disable({ emitEvent: false });
			controls['f3_spouse_mname'].disable({ emitEvent: false });
			controls['f3_spouse_age'].disable({ emitEvent: false });
			controls['f3_spouse_mobno'].disable({ emitEvent: false });
			controls['f3_spouse_adhno'].disable({ emitEvent: false });
			controls['f3_spouse_shg'].disable({ emitEvent: false });
			controls['f3_spouse_occp'].disable({ emitEvent: false });
			
			controls['f3_spouse_mfi'].disable({ emitEvent: false });
			controls['f3_spouse_shgname'].disable({ emitEvent: false });

			if(controls['f3_spouse_occp'].value =="farmer" && controls['f3_spouse_occp'].value =="other")
			{

				controls['f3_spouse_income'].enable({ emitEvent: false });
			}
			else
			{
				controls['f3_spouse_income'].setValue('', { emitEvent: false });
				controls['f3_spouse_income'].disable({ emitEvent: false });
			}
			
		}




		if(controls['f3_spouse_shg'].value == 'yes')
		{
			controls['f3_spouse_shgname'].enable({ emitEvent: false });
		}
		else
		{

			controls['f3_spouse_shgname'].setValue('', { emitEvent: false });
			controls['f3_spouse_shgname'].disable({ emitEvent: false });
		}

		

		if(controls['f3_spouse_mfi'].value =="yes")
		{
			 controls['f3_loan_purpose'].enable({ emitEvent: false });
			 controls['f3_spouse_mfiname'].enable({ emitEvent: false });
			 controls['f3_spouse_mfiamount'].enable({ emitEvent: false });
			 controls['f3_loan_interest'].enable({ emitEvent: false });
			 controls['f3_loan_tenure'].enable({ emitEvent: false });
			 controls['f3_loan_emi'].enable({ emitEvent: false });
		}
		else
		{
			 controls['f3_loan_purpose'].setValue('', { emitEvent: false });
			 controls['f3_spouse_mfiname'].setValue('', { emitEvent: false });
			 controls['f3_spouse_mfiamount'].setValue('', { emitEvent: false });
			 controls['f3_loan_interest'].setValue('', { emitEvent: false });
			 controls['f3_loan_tenure'].setValue('', { emitEvent: false });
			 controls['f3_loan_emi'].setValue('', { emitEvent: false });

			 controls['f3_loan_purpose'].disable({ emitEvent: false });
			 controls['f3_spouse_mfiname'].disable({ emitEvent: false });
			 controls['f3_spouse_mfiamount'].disable({ emitEvent: false });
			 controls['f3_loan_interest'].disable({ emitEvent: false });
			 controls['f3_loan_tenure'].disable({ emitEvent: false });
			 controls['f3_loan_emi'].disable({ emitEvent: false });
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
