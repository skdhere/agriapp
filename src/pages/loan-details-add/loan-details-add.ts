import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';

/**
* Generated class for the LoanDetailsAddPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
	selector: 'page-loan-details-add',
	templateUrl: 'loan-details-add.html',
})
export class LoanDetailsAddPage {

	loan: FormGroup;
	submitAttempt: boolean = false;
	fm_id: any;
    local_crop_id: any;
    exist: boolean = false;
    local_loan_id: any;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams,
				public sql: Sql, 
				public toastCtrl: ToastController,
				public formBuilder: FormBuilder) {

		this.loan = formBuilder.group({

			loan_sanctioned:                    ['', Validators.required],
			loan_type:                          ['', Validators.required],
            loan_provider:                      ['', Validators.compose([Validators.maxLength(100), Validators.required])],
            f15_borrowed_amount:                ['', Validators.compose([Validators.maxLength(7), Validators.pattern('^[0-9]*'), Validators.required])],
            f15_borrowed_loan_per:              ['', Validators.compose([Validators.maxLength(7), Validators.pattern('^[0-9.]*'), Validators.required])],
            f15_borrowed_loan_month:            ['', Validators.compose([Validators.maxLength(5), Validators.pattern('^[0-9.]*'), Validators.required])],
			f15_borrowed_total_amount:          [0, Validators.required],
			f15_borrowed_total_int:             [0, Validators.required],
			f15_borrowed_amount_emi:            [0, Validators.required],
            f15_borrowed_emi_paid:              ['', Validators.compose([Validators.maxLength(5), Validators.pattern('^[0-9.]*'), Validators.required])],
			f15_borrowed_outstanding_amount:    [0, Validators.required],
			f15_borrowed_outstanding_principal: [0, Validators.required],
			f15_borrowed_amount_emi_rem:        [0, Validators.required]
        });

        this.loan.controls.f15_borrowed_amount.valueChanges.subscribe(() => { this.updateCalc1(); });
        this.loan.controls.f15_borrowed_loan_per.valueChanges.subscribe(() => { this.updateCalc1(); });
        this.loan.controls.f15_borrowed_loan_month.valueChanges.subscribe(() => { this.updateCalc1(); });

        this.loan.controls.f15_borrowed_emi_paid.valueChanges.subscribe(() => { this.updateCalc1(); });
	}

	updateCalc1(){
		let amount     = this.loan.controls.f15_borrowed_amount.value;
		let loan_per   = this.loan.controls.f15_borrowed_loan_per.value;
		let loan_month = this.loan.controls.f15_borrowed_loan_month.value;

		//calculations
		let r = (loan_per/1200);
		let E = amount * r * Math.pow((1+r),loan_month) / (Math.pow((1+r),loan_month)- 1);
		let totPayment = E * loan_month;
		let totInt	= totPayment - amount;
		let final_E = Math.round(E);

		let final_totInt = Math.round(totInt);
		let final_totPayment = Math.round(totPayment);
		
		if (final_E == Infinity){
			final_E = 0;
		}
		this.loan.controls.f15_borrowed_amount_emi.setValue(final_E || 0, { emitEvent: false });
		this.loan.controls.f15_borrowed_total_int.setValue(final_totInt || 0, { emitEvent: false });
		this.loan.controls.f15_borrowed_total_amount.setValue(final_totPayment || 0, { emitEvent: false });


		//call calc2 if emi paid has some value
		if (this.loan.controls.f15_borrowed_emi_paid.value) {
			let f15_borrowed_emi_paid = this.loan.controls.f15_borrowed_emi_paid.value
					
			if(f15_borrowed_emi_paid!="")
			{
				let oustanding_loan_interest = Number(totPayment) -(Number(E) * Number(f15_borrowed_emi_paid));
				this.loan.controls.f15_borrowed_outstanding_amount.setValue(Math.round(oustanding_loan_interest) || 0, { emitEvent: false });
				
				let remaining_int   =(totInt/loan_month);
				remaining_int       =(remaining_int * (loan_month-f15_borrowed_emi_paid))
				let oustanding_loan =oustanding_loan_interest-remaining_int;

				if(oustanding_loan_interest == 0)
				{
					oustanding_loan = 0;
				}

				this.loan.controls.f15_borrowed_outstanding_principal.setValue(Math.round(oustanding_loan) || 0, { emitEvent: false });
				this.loan.controls.f15_borrowed_amount_emi_rem.setValue( loan_month - f15_borrowed_emi_paid || 0, { emitEvent: false });
			}
		}else{
			this.loan.controls.f15_borrowed_outstanding_amount.setValue( 0, { emitEvent: false });
			this.loan.controls.f15_borrowed_outstanding_principal.setValue( 0, { emitEvent: false });
			this.loan.controls.f15_borrowed_amount_emi_rem.setValue( 0, { emitEvent: false });
		}
	}

	ionViewDidEnter() {

		this.exist         = false;
		this.fm_id         = this.navParams.get('farmer_id');
		this.local_loan_id = this.navParams.get('local_loan_id') || false;

		if(this.local_loan_id !== false){
	        this.sql.query('SELECT * FROM tbl_loan_details WHERE local_loan_id = ? limit 1', [this.local_loan_id]).then( (data) => {

	            if (data.res.rows.length > 0) {

	                let sqlData = data.res.rows.item(0);
	                let formData = [];

					formData['loan_sanctioned']                   = sqlData.loan_sanctioned;
					formData['loan_type']                         = sqlData.loan_type;
					formData['loan_provider']                     = sqlData.loan_provider;
					formData['f15_borrowed_amount']                = sqlData.f15_borrowed_amount;
					formData['f15_borrowed_loan_per']              = sqlData.f15_borrowed_loan_per;
					formData['f15_borrowed_loan_month']            = sqlData.f15_borrowed_loan_month;
					formData['f15_borrowed_total_amount']          = sqlData.f15_borrowed_total_amount;
					formData['f15_borrowed_total_int']             = sqlData.f15_borrowed_total_int;
					formData['f15_borrowed_amount_emi']            = sqlData.f15_borrowed_amount_emi;
					formData['f15_borrowed_emi_paid']              = sqlData.f15_borrowed_emi_paid;
					formData['f15_borrowed_outstanding_amount']    = sqlData.f15_borrowed_outstanding_amount;
					formData['f15_borrowed_outstanding_principal'] = sqlData.f15_borrowed_outstanding_principal;
					formData['f15_borrowed_amount_emi_rem']        = sqlData.f15_borrowed_amount_emi_rem;

	                this.loan.setValue(formData);
	                this.exist = true;
	            }

	        }, err => {
	            console.log(err);
	        });
	    }
	}

	save() {

        this.submitAttempt = true;
        if (!this.loan.valid) {
            console.log("Validation error!")
        } else {
            console.log("success!")
            console.log(this.loan.value);

            let date = new Date();
            let dateNow = date.getTime()/1000 | 0;

            if (this.exist) {
                this.sql.query('UPDATE tbl_loan_details SET loan_sanctioned = ?, loan_type = ?, loan_provider = ?, f15_borrowed_amount = ?, f15_borrowed_loan_per = ?, f15_borrowed_loan_month = ?, f15_borrowed_total_amount = ?, f15_borrowed_total_int = ?, f15_borrowed_amount_emi = ?, f15_borrowed_emi_paid = ?, f15_borrowed_outstanding_amount = ?, f15_borrowed_outstanding_principal = ?, f15_borrowed_amount_emi_rem = ?, f15_modified_date = ? WHERE local_loan_id = ?', [

                    this.loan.value.loan_sanctioned,
                    this.loan.value.loan_type,
                    this.loan.value.loan_provider,
                    this.loan.value.f15_borrowed_amount, 
                    this.loan.value.f15_borrowed_loan_per, 
                    this.loan.value.f15_borrowed_loan_month, 
                    this.loan.value.f15_borrowed_total_amount, 
                    this.loan.value.f15_borrowed_total_int, 
                    this.loan.value.f15_borrowed_amount_emi,
                    this.loan.value.f15_borrowed_emi_paid,
                    this.loan.value.f15_borrowed_outstanding_amount,
                    this.loan.value.f15_borrowed_outstanding_principal,
                    this.loan.value.f15_borrowed_amount_emi_rem,

                    dateNow,
                    this.local_loan_id
                ]).then(data => {
                    let callback = this.navParams.get("callback") || false;
	                if(callback){
	                    callback(true).then(()=>{
	                        this.navCtrl.pop();
	                    });
	                }else{
	                    this.navCtrl.pop();
	                }
                },
                err => {
                    console.log(err);
                });               
            }
            else{
                this.sql.query('INSERT INTO tbl_loan_details(fm_id, loan_sanctioned, loan_type, loan_provider, f15_borrowed_amount, f15_borrowed_loan_per, f15_borrowed_loan_month, f15_borrowed_total_amount, f15_borrowed_total_int, f15_borrowed_amount_emi, f15_borrowed_emi_paid, f15_borrowed_outstanding_amount, f15_borrowed_outstanding_principal, f15_borrowed_amount_emi_rem, f15_created_date, f15_modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [

                    this.fm_id,
                    this.loan.value.loan_sanctioned,
                    this.loan.value.loan_type,
                    this.loan.value.loan_provider,
                    this.loan.value.f15_borrowed_amount, 
                    this.loan.value.f15_borrowed_loan_per, 
                    this.loan.value.f15_borrowed_loan_month, 
                    this.loan.value.f15_borrowed_total_amount, 
                    this.loan.value.f15_borrowed_total_int, 
                    this.loan.value.f15_borrowed_amount_emi,
                    this.loan.value.f15_borrowed_emi_paid,
                    this.loan.value.f15_borrowed_outstanding_amount,
                    this.loan.value.f15_borrowed_outstanding_principal,
                    this.loan.value.f15_borrowed_amount_emi_rem,
                    dateNow,
                    dateNow
                ]).then(data => {
                    let callback = this.navParams.get("callback") || false;
	                if(callback){
	                    callback(true).then(()=>{
	                        this.navCtrl.pop();
	                    });
	                }else{
	                    this.navCtrl.pop();
	                }
                },
                err => {
                    console.log(err);
                });
            }

        }
    }

}
