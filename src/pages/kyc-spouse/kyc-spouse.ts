import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';
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
		this.spouse = formBuilder.group({
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

		//Listen for form changes
		this.spouse.controls['f3_married_status'].valueChanges.subscribe(() => {this.setValidation();});
		this.spouse.controls['f3_spouse_shg'].valueChanges.subscribe(() => {this.setValidation();});
		this.spouse.controls['f3_spouse_occp'].valueChanges.subscribe(() => {this.setValidation();});
		this.spouse.controls['f3_spouse_mfi'].valueChanges.subscribe(() => {this.setValidation();});
	}

	ionViewDidEnter() {
		//update validation here
		this.setValidation();

		//Fetch value from sqlite and update form data 
		this.exist = false;
        this.fm_id = this.navParams.get('farmer_id');
		
		this.sql.query('SELECT * FROM tbl_spouse_details WHERE fm_id = ? limit 1', [this.fm_id]).then( (data) => {

            if (data.res.rows.length > 0) {

                let sqlData = data.res.rows.item(0);
                let formData = [];

				formData['f3_married_status']   = sqlData.f3_married_status;
				formData['f3_spouse_fname']     = sqlData.f3_spouse_fname;
				formData['f3_spouse_mname']     = sqlData.f3_spouse_mname;
				formData['f3_spouse_lname']     = sqlData.f3_spouse_lname;
				formData['f3_spouse_age']       = sqlData.f3_spouse_age;
				formData['f3_spouse_mobno']     = sqlData.f3_spouse_mobno;
				formData['f3_spouse_adhno']     = sqlData.f3_spouse_adhno;
				formData['f3_loan_interest']    = sqlData.f3_loan_interest;
				formData['f3_loan_tenure']      = sqlData.f3_loan_tenure;
				formData['f3_loan_emi']         = sqlData.f3_loan_emi;
				formData['f3_spouse_shg']       = sqlData.f3_spouse_shg;
				formData['f3_spouse_income']    = sqlData.f3_spouse_income;
				formData['f3_spouse_shgname']   = sqlData.f3_spouse_shgname;
				formData['f3_spouse_occp']      = sqlData.f3_spouse_occp;
				formData['f3_spouse_mfi']       = sqlData.f3_spouse_mfi;
				formData['f3_loan_purpose']     = sqlData.f3_loan_purpose;
				formData['f3_spouse_mfiname']   = sqlData.f3_spouse_mfiname;
				formData['f3_spouse_mfiamount'] = sqlData.f3_spouse_mfiamount;

                this.spouse.setValue(formData);
                this.exist = true;
            }

        }, err => {
            console.log(err);
        });
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
			console.log('is POST ', this.addNew);
			
			//Check if data already exists
			//accordingly update or inster data
			let date = new Date();
            let dateNow = date.getTime()/1000|0;

			if (this.exist) {
                this.sql.query('UPDATE tbl_spouse_details SET f3_married_status = ?, f3_spouse_fname = ?, f3_spouse_mname = ?, f3_spouse_lname = ?, f3_spouse_age = ?, f3_spouse_mobno = ?, f3_spouse_adhno = ?, f3_loan_interest = ?, f3_loan_tenure = ?, f3_loan_emi = ?, f3_spouse_shg = ?, f3_spouse_income = ?, f3_spouse_shgname = ?, f3_spouse_occp = ?, f3_spouse_mfi = ?, f3_loan_purpose = ?, f3_spouse_mfiname = ?, f3_spouse_mfiamount = ?,  f3_modified_date = ? WHERE fm_id = ?', [

                    this.spouse.value.f3_married_status || '',
                    this.spouse.value.f3_spouse_fname || '',
                    this.spouse.value.f3_spouse_mname || '',
                    this.spouse.value.f3_spouse_lname || '',
                    this.spouse.value.f3_spouse_age || '',
                    this.spouse.value.f3_spouse_mobno || '',
                    this.spouse.value.f3_spouse_adhno || '', 
                    this.spouse.value.f3_loan_interest || '', 
                    this.spouse.value.f3_loan_tenure || '',
                    this.spouse.value.f3_loan_emi || '',
                    this.spouse.value.f3_spouse_shg || '',
                    this.spouse.value.f3_spouse_income || '',
                    this.spouse.value.f3_spouse_shgname || '',
                    this.spouse.value.f3_spouse_occp || '',
                    this.spouse.value.f3_spouse_mfi || '',
                    this.spouse.value.f3_loan_purpose || '', 
                    this.spouse.value.f3_spouse_mfiname || '', 
                    this.spouse.value.f3_spouse_mfiamount || '',

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
                this.sql.query('INSERT INTO tbl_spouse_details(fm_id, f3_married_status, f3_spouse_fname, f3_spouse_mname, f3_spouse_lname, f3_spouse_age, f3_spouse_mobno, f3_spouse_adhno, f3_loan_interest, f3_loan_tenure, f3_loan_emi, f3_spouse_shg, f3_spouse_income, f3_spouse_shgname, f3_spouse_occp, f3_spouse_mfi, f3_loan_purpose, f3_spouse_mfiname, f3_spouse_mfiamount, f3_created_date, f3_modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [

                    this.fm_id,
                    this.spouse.value.f3_married_status || '',
                    this.spouse.value.f3_spouse_fname || '',
                    this.spouse.value.f3_spouse_mname || '',
                    this.spouse.value.f3_spouse_lname || '',
                    this.spouse.value.f3_spouse_age || '',
                    this.spouse.value.f3_spouse_mobno || '',
                    this.spouse.value.f3_spouse_adhno || '', 
                    this.spouse.value.f3_loan_interest || '', 
                    this.spouse.value.f3_loan_tenure || '',
                    this.spouse.value.f3_loan_emi || '',
                    this.spouse.value.f3_spouse_shg || '',
                    this.spouse.value.f3_spouse_income || '',
                    this.spouse.value.f3_spouse_shgname || '',
                    this.spouse.value.f3_spouse_occp || '',
                    this.spouse.value.f3_spouse_mfi || '',
                    this.spouse.value.f3_loan_purpose || '', 
                    this.spouse.value.f3_spouse_mfiname || '', 
                    this.spouse.value.f3_spouse_mfiamount || '',
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
			console.log('Validation error', this.spouse.controls);
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
