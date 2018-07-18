import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';
import { Helper } from '../../validators/ExtraValidator';

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
	fm_id: any;
    exist: boolean = false;

  constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public formBuilder: FormBuilder, 
                public sql: Sql,
				private loadingCtrl: LoadingController, 
				public toastCtrl: ToastController) {


		  	this.farmer_id = this.navParams.get('farmer_id') || 0;
				//creating form via formbuilder 
			this.knowledge = formBuilder.group({
			

			'f4_edudetail' : ['', Validators.required], //drp
			'f4_proficiency' : ['', Validators.required], //drp
			'f4_participation' : [''], //drp
			'f4_typeprog' : ['', Validators.required], //drp
			'f4_date' : ['', Validators.required], //drp
			'f4_durprog' : ['', Validators.compose([Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]+$')]) ],
			'f4_condprog' : ['', Validators.compose([Validators.required, Validators.maxLength(100)]) ],
			'f4_cropprog' : ['', Validators.compose([Validators.required, Validators.maxLength(100)]) ],
			'f4_pname' : ['', Validators.required], //drp
		});
			
		//Listen for form changes
		this.knowledge.controls['f4_edudetail'].valueChanges.subscribe(() => {this.setValidation();});
		this.knowledge.controls['f4_proficiency'].valueChanges.subscribe(() => {this.setValidation();});
		this.knowledge.controls['f4_participation'].valueChanges.subscribe(() => {this.setValidation();});
  	}

  	list_f4_edudetail = [
  		{id: 'illiterate', name: 'Illiterate'},
		{id: 'primary education', name: 'Primary Education'},
		{id: 'matriculate', name: 'Matriculate'},
		{id: 'graduate', name: 'Graduate'},
		{id: 'post graduate', name: 'Post Graduate'}
  	];

	list_f4_proficiency = [
  		{id: 'fluent', name: 'Fluent'},
		{id: 'read only', name: 'Read Only'},
		{id: 'write only', name: 'Write Only'},
		{id: 'speak only', name: 'Speak Only'},
		{id: 'understand only', name: 'Understand Only'},
		{id: "Don't Know", name: "Don't Know"},
	];

	list_f4_participation = [
		{id: 'yes', name: 'Yes'},
		{id: 'no', name: 'No'}
	];

	list_f4_typeprog = [
		{id: 'organic farming training', name: 'Organic Farming Training'},
		{id: 'equipment training', name: 'Equipment Training'},
		{id: 'technology training', name: 'Technology Training'},
		{id: 'pesticide fertilizer training', name: 'Pesticide/Fertilizer Training'},
		{id: 'other farming training', name: 'Other Farming Training'},
		{id: 'others', name: 'Others'},
	];


    ionViewDidEnter() {
		this.retryButton = false;

		//update validation here
		this.setValidation();

		this.exist = false;
        this.fm_id = this.navParams.get('farmer_id');

        this.sql.query('SELECT * FROM tbl_spouse_knowledge WHERE fm_id = ? limit 1', [this.fm_id]).then( (data) => {

            if (data.res.rows.length > 0) {

                let sqlData = data.res.rows.item(0);
                let formData = [];

				formData['f4_edudetail']     = Helper.checkInList(this.list_f4_edudetail, 'id', sqlData.f4_edudetail);
				formData['f4_proficiency']   = Helper.checkInList(this.list_f4_proficiency, 'id', sqlData.f4_proficiency);
				formData['f4_participation'] = Helper.checkInList(this.list_f4_participation, 'id', sqlData.f4_participation);
				formData['f4_typeprog']      = Helper.checkInList(this.list_f4_typeprog, 'id', sqlData.f4_typeprog);
				formData['f4_date']          = sqlData.f4_date;
				formData['f4_durprog']       = sqlData.f4_durprog;
				formData['f4_condprog']      = sqlData.f4_condprog;
				formData['f4_cropprog']      = sqlData.f4_cropprog;
				formData['f4_pname']         = sqlData.f4_pname;

                this.knowledge.setValue(formData);
                this.exist = true;
            }

        }, err => {
            console.log(err);
        });
	}

	setValidation(){
		let controls = this.knowledge.controls;
		if(controls['f4_participation'].value == 'yes'){

			controls['f4_typeprog'].enable({ emitEvent: false });
			controls['f4_durprog'].enable({ emitEvent: false });
			controls['f4_condprog'].enable({ emitEvent: false });
			controls['f4_cropprog'].enable({ emitEvent: false });
			controls['f4_pname'].enable({ emitEvent: false });
			controls['f4_date'].enable({ emitEvent: false });
			
		}
		else{

			controls['f4_typeprog'].setValue('', { emitEvent: false });
			controls['f4_durprog'].setValue('', { emitEvent: false });
			controls['f4_condprog'].setValue('', { emitEvent: false });
			controls['f4_cropprog'].setValue('', { emitEvent: false });
			controls['f4_pname'].setValue('', { emitEvent: false });
			controls['f4_date'].setValue('', { emitEvent: false });


			controls['f4_typeprog'].disable({ emitEvent: false });
			controls['f4_durprog'].disable({ emitEvent: false });
			controls['f4_condprog'].disable({ emitEvent: false });
			controls['f4_cropprog'].disable({ emitEvent: false });
			controls['f4_pname'].disable({ emitEvent: false });
			controls['f4_date'].disable({ emitEvent: false });

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
                this.sql.query('UPDATE tbl_spouse_knowledge SET f4_edudetail = ?, f4_proficiency = ?, f4_participation = ?, f4_typeprog = ?, f4_date = ?, f4_durprog = ?, f4_condprog = ?, f4_cropprog = ?, f4_pname = ?, f4_modified_date = ? WHERE fm_id = ?', [

                    this.knowledge.value.f4_edudetail || '',
                    this.knowledge.value.f4_proficiency || '',
                    this.knowledge.value.f4_participation || '',
                    this.knowledge.value.f4_typeprog || '',
                    this.knowledge.value.f4_date || '',
                    this.knowledge.value.f4_durprog || '',
                    this.knowledge.value.f4_condprog || '', 
                    this.knowledge.value.f4_cropprog || '', 
                    this.knowledge.value.f4_pname || '',

                    dateNow,
                    this.fm_id
                ]).then(data => {
                	this.sql.updateUploadStatus('tbl_spouse_knowledge', this.fm_id, '0');
                    this.navCtrl.pop();
                },
                err => {
                    console.log(err);
                });               
            }
            else{
                this.sql.query('INSERT INTO tbl_spouse_knowledge(fm_id, f4_edudetail, f4_proficiency, f4_participation, f4_typeprog, f4_date, f4_durprog, f4_condprog, f4_cropprog, f4_pname, f4_created_date, f4_modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [

                    this.fm_id,
                    this.knowledge.value.f4_edudetail || '',
                    this.knowledge.value.f4_proficiency || '',
                    this.knowledge.value.f4_participation || '',
                    this.knowledge.value.f4_typeprog || '',
                    this.knowledge.value.f4_date || '',
                    this.knowledge.value.f4_durprog || '',
                    this.knowledge.value.f4_condprog || '', 
                    this.knowledge.value.f4_cropprog || '', 
                    this.knowledge.value.f4_pname || '',
                    dateNow,
                    dateNow
                ]).then(data => {
                	this.sql.updateUploadStatus('tbl_spouse_knowledge', this.fm_id, '0');
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
