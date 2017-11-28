import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';

/**
 * Generated class for the SpouseKnowledgePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-spouse-knowledge',
  templateUrl: 'spouse-knowledge.html',
})
export class SpouseKnowledgePage {


	knowledge: FormGroup;
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
			this.knowledge = formBuilder.group({
			

			'f2_edudetail' : ['', Validators.required], //drp
			'f2_proficiency' : ['', Validators.required], //drp
			'f2_participation' : [''], //drp
			'f2_typeprog' : ['', Validators.required], //drp
			'f2_date' : ['', Validators.required], //drp
			'f2_durprog' : ['', Validators.compose([Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]+$')]) ],
			'f2_condprog' : ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)]) ],
			'f2_cropprog' : ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)]) ],
			'f2_pname' : ['', Validators.required], //drp
		});
  }

  ionViewDidLoad() {
		this.retryButton = false;

		//update validation here
		this.setValidation();

		//Listen for form changes
		this.knowledge.controls['f2_edudetail'].valueChanges.subscribe(() => {this.setValidation();});
		this.knowledge.controls['f2_proficiency'].valueChanges.subscribe(() => {this.setValidation();});
		this.knowledge.controls['f2_participation'].valueChanges.subscribe(() => {this.setValidation();});
	}

	setValidation(){
		let controls = this.knowledge.controls;
		if(controls['f2_participation'].value == 'yes'){

			controls['f2_typeprog'].enable({ emitEvent: false });
			controls['f2_durprog'].enable({ emitEvent: false });
			controls['f2_condprog'].enable({ emitEvent: false });
			controls['f2_cropprog'].enable({ emitEvent: false });
			controls['f2_pname'].enable({ emitEvent: false });
			controls['f2_date'].enable({ emitEvent: false });
			
		}
		else{

			controls['f2_typeprog'].setValue('', { emitEvent: false });
			controls['f2_durprog'].setValue('', { emitEvent: false });
			controls['f2_condprog'].setValue('', { emitEvent: false });
			controls['f2_cropprog'].setValue('', { emitEvent: false });
			controls['f2_pname'].setValue('', { emitEvent: false });
			controls['f2_date'].setValue('', { emitEvent: false });


			controls['f2_typeprog'].disable({ emitEvent: false });
			controls['f2_durprog'].disable({ emitEvent: false });
			controls['f2_condprog'].disable({ emitEvent: false });
			controls['f2_cropprog'].disable({ emitEvent: false });
			controls['f2_pname'].disable({ emitEvent: false });
			controls['f2_date'].disable({ emitEvent: false });

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
		if (this.knowledge.valid) {

			let loading = this.loadingCtrl.create({
			    content: 'Loading data...'
			});
			loading.present();

			console.log('is POST ', this.addNew);
			if(this.addNew){
				//do post request
				this.api.post('kyc_knowledge', this.knowledge.value)
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
				this.api.put('kyc_knowledge', this.knowledge.value)
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

			console.log(this.knowledge.value);
		}else{
			console.log('Validation error', this.knowledge.controls);
			this.showMessage("Please fill valid data!", "danger", 100000);
		}
	}

}
