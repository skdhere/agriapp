import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';

/**
 * Generated class for the KycKnowledgePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kyc-knowledge',
  templateUrl: 'kyc-knowledge.html',
})
export class KycKnowledgePage {

	knowledge: FormGroup;
	farmer_id: string;
	submitAttempt: boolean = false;
	retryButton: boolean = false;
    fm_id: any;
    exist: boolean = false;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
                public sql: Sql,
				public formBuilder: FormBuilder, 
				private loadingCtrl: LoadingController, 
				public toastCtrl: ToastController) {

		this.farmer_id = this.navParams.get('farmer_id') || 0;
		//creating form via formbuilder 
		this.knowledge = formBuilder.group({

			'f2_edudetail' : ['', Validators.required], //drp
			'f2_proficiency' : ['', Validators.required], //drp
			'f2_participation' : [''], //drp
			'f2_typeprog' : ['', Validators.required], //drp
			'f2_date' : ['', Validators.required], //drp
			'f2_durprog' : ['', Validators.compose([Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]+$')]) ],
			'f2_condprog' : ['', Validators.compose([Validators.required, Validators.maxLength(100)]) ],
			'f2_cropprog' : ['', Validators.compose([Validators.required, Validators.maxLength(100)]) ],
			'f2_pname' : ['', Validators.required], //drp
		});
		
		//Listen for form changes
		this.knowledge.controls['f2_edudetail'].valueChanges.subscribe(() => {this.setValidation();});
		this.knowledge.controls['f2_proficiency'].valueChanges.subscribe(() => {this.setValidation();});
		this.knowledge.controls['f2_participation'].valueChanges.subscribe(() => {this.setValidation();});
	}

	ionViewDidEnter() {
		this.retryButton = false;

		//update validation here
		this.setValidation();


		this.exist = false;
        this.fm_id = this.navParams.get('farmer_id');

        this.sql.query('SELECT * FROM tbl_applicant_knowledge WHERE fm_id = ? limit 1', [this.fm_id]).then( (data) => {

            if (data.res.rows.length > 0) {

                let sqlData = data.res.rows.item(0);
                let formData = [];

				formData['f2_edudetail']     = sqlData.f2_edudetail;
				formData['f2_proficiency']   = sqlData.f2_proficiency;
				formData['f2_participation'] = sqlData.f2_participation;
				formData['f2_typeprog']      = sqlData.f2_typeprog;
				formData['f2_date']          = sqlData.f2_date;
				formData['f2_durprog']       = sqlData.f2_durprog;
				formData['f2_condprog']      = sqlData.f2_condprog;
				formData['f2_cropprog']      = sqlData.f2_cropprog;
				formData['f2_pname']         = sqlData.f2_pname;

                this.knowledge.setValue(formData);
                this.exist = true;
            }

        }, err => {
            console.log(err);
        });
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
			console.log('success');
			console.log(this.knowledge.value);

			let date = new Date();
            let dateNow = date.getTime()/1000|0;

            if (this.exist) {
                this.sql.query('UPDATE tbl_applicant_knowledge SET f2_edudetail = ?, f2_proficiency = ?, f2_participation = ?, f2_typeprog = ?, f2_date = ?, f2_durprog = ?, f2_condprog = ?, f2_cropprog = ?, f2_pname = ?, f2_modified_date = ? WHERE fm_id = ?', [

                    this.knowledge.value.f2_edudetail || '',
                    this.knowledge.value.f2_proficiency || '',
                    this.knowledge.value.f2_participation || '',
                    this.knowledge.value.f2_typeprog || '',
                    this.knowledge.value.f2_date || '',
                    this.knowledge.value.f2_durprog || '',
                    this.knowledge.value.f2_condprog || '', 
                    this.knowledge.value.f2_cropprog || '', 
                    this.knowledge.value.f2_pname || '',

                    dateNow,
                    this.fm_id
                ]).then(data => {
                    this.navCtrl.pop();
                },
                err => {
                    console.log(err);
                });               
            }
            else{
                this.sql.query('INSERT INTO tbl_applicant_knowledge(fm_id, f2_edudetail, f2_proficiency, f2_participation, f2_typeprog, f2_date, f2_durprog, f2_condprog, f2_cropprog, f2_pname, f2_created_date, f2_modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [

                    this.fm_id,
                    this.knowledge.value.f2_edudetail || '',
                    this.knowledge.value.f2_proficiency || '',
                    this.knowledge.value.f2_participation || '',
                    this.knowledge.value.f2_typeprog || '',
                    this.knowledge.value.f2_date || '',
                    this.knowledge.value.f2_durprog || '',
                    this.knowledge.value.f2_condprog || '', 
                    this.knowledge.value.f2_cropprog || '', 
                    this.knowledge.value.f2_pname || '',
                    dateNow,
                    dateNow
                ]).then(data => {
                    this.navCtrl.pop();
                },
                err => {
                    console.log(err);
                });
            }
		}else{
			console.log('Validation error', this.knowledge.controls);
			this.showMessage("Please fill valid data!", "danger", 100000);
		}
	}

	//this function will call while leaving the page
    //the function will then call the callback of previous page method
    ionViewWillLeave(){
        let callback = this.navParams.get('callback') || false;
        if(callback){
            callback(true);
        }
    }
}
