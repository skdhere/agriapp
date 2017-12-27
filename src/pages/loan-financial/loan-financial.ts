import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';

/**
* Generated class for the LoanFinancialPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
	selector: 'page-loan-financial',
	templateUrl: 'loan-financial.html',
})
export class LoanFinancialPage {

	loan: FormGroup;
    submitAttempt: boolean = false;
    fm_id: any;
    exist: boolean = false;

	constructor(public navCtrl: NavController, 
                public navParams: NavParams, 
                public sql: Sql,
                public formBuilder: FormBuilder) {

		this.loan = formBuilder.group({

			loan_want:                         ['', Validators.required],
            loan_amount:                       ['', Validators.compose([Validators.maxLength(8), Validators.pattern('^[0-9]*'), Validators.required])],
			fx_monthly_income:                 ['', Validators.required],
			f8_loan_taken:                     ['', Validators.required],
			f8_private_lenders:                ['', Validators.required],
			f8_borrowed_amount_date:           ['', Validators.required],
            f8_borrowed_amount:                ['', Validators.compose([Validators.maxLength(8), Validators.pattern('^[0-9]*'), Validators.required])],
            f8_borrowed_loan_per:              ['', Validators.compose([Validators.maxLength(8), Validators.pattern('^[0-9.]*'), Validators.required])],
            f8_borrowed_loan_month:            ['', Validators.compose([Validators.maxLength(5), Validators.pattern('^[0-9.]*'), Validators.required])],
			f8_borrowed_total_amount:          [0, Validators.required],
			f8_borrowed_total_int:             [0, Validators.required],
			f8_borrowed_amount_emi:            [0, Validators.required],
            f8_borrowed_emi_paid:              ['', Validators.compose([Validators.maxLength(5), Validators.pattern('^[0-9.]*'), Validators.required]), (control) => this.compareMinEqual(control, this.loan.controls.f8_borrowed_loan_month.value)],
			f8_borrowed_outstanding_amount:    [0, Validators.required],
			f8_borrowed_outstanding_principal: [0, Validators.required],
			f8_borrowed_amount_emi_rem:        [0, Validators.required]
        });

		this.setValidation();
        this.loan.controls.loan_want.valueChanges.subscribe(() => {this.setValidation();});
        this.loan.controls.f8_private_lenders.valueChanges.subscribe(() => {this.setValidation();});

        this.loan.controls.f8_borrowed_amount.valueChanges.subscribe(() => { this.updateCalc1(); });
        this.loan.controls.f8_borrowed_loan_per.valueChanges.subscribe(() => { this.updateCalc1(); });
        this.loan.controls.f8_borrowed_loan_month.valueChanges.subscribe(() => { this.updateCalc1(); });

        this.loan.controls.f8_borrowed_emi_paid.valueChanges.subscribe(() => { this.updateCalc1(); });
	}

	updateCalc1(){
		let amount     = this.loan.controls.f8_borrowed_amount.value;
		let loan_per   = this.loan.controls.f8_borrowed_loan_per.value;
		let loan_month = this.loan.controls.f8_borrowed_loan_month.value;

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
		this.loan.controls.f8_borrowed_amount_emi.setValue(final_E || 0, { emitEvent: false });
		this.loan.controls.f8_borrowed_total_int.setValue(final_totInt || 0, { emitEvent: false });
		this.loan.controls.f8_borrowed_total_amount.setValue(final_totPayment || 0, { emitEvent: false });


		//call calc2 if emi paid has some value
		if (this.loan.controls.f8_borrowed_emi_paid.value) {
			let f8_borrowed_emi_paid = this.loan.controls.f8_borrowed_emi_paid.value
					
			if(f8_borrowed_emi_paid!="")
			{
				let oustanding_loan_interest = Number(totPayment) -(Number(E) * Number(f8_borrowed_emi_paid));
				this.loan.controls.f8_borrowed_outstanding_amount.setValue(Math.round(oustanding_loan_interest) || 0, { emitEvent: false });
				
				let remaining_int   =(totInt/loan_month);
				remaining_int       =(remaining_int * (loan_month-f8_borrowed_emi_paid))
				let oustanding_loan =oustanding_loan_interest-remaining_int;

				if(oustanding_loan_interest == 0)
				{
					oustanding_loan = 0;
				}

				this.loan.controls.f8_borrowed_outstanding_principal.setValue(Math.round(oustanding_loan) || 0, { emitEvent: false });
				this.loan.controls.f8_borrowed_amount_emi_rem.setValue( loan_month - f8_borrowed_emi_paid || 0, { emitEvent: false });
			}
		}else{
			this.loan.controls.f8_borrowed_outstanding_amount.setValue( 0, { emitEvent: false });
			this.loan.controls.f8_borrowed_outstanding_principal.setValue( 0, { emitEvent: false });
			this.loan.controls.f8_borrowed_amount_emi_rem.setValue( 0, { emitEvent: false });
		}
	}

	ionViewDidEnter() {

		this.exist = false;
        this.fm_id = this.navParams.get('farmer_id');

        this.sql.query('SELECT * FROM tbl_financial_details WHERE fm_id = ? limit 1', [this.fm_id]).then( (data) => {

            if (data.res.rows.length > 0) {

                let sqlData = data.res.rows.item(0);
                let formData = [];

				formData['loan_want']                         = sqlData.loan_want;
				formData['loan_amount']                       = sqlData.loan_amount;
				formData['fx_monthly_income']                 = sqlData.fx_monthly_income;
				formData['f8_loan_taken']                     = sqlData.f8_loan_taken;
				formData['f8_private_lenders']                = sqlData.f8_private_lenders;
				formData['f8_borrowed_amount_date']           = sqlData.f8_borrowed_amount_date;
				formData['f8_borrowed_amount']                = sqlData.f8_borrowed_amount;
				formData['f8_borrowed_loan_per']              = sqlData.f8_borrowed_loan_per;
				formData['f8_borrowed_loan_month']            = sqlData.f8_borrowed_loan_month;
				formData['f8_borrowed_total_amount']          = sqlData.f8_borrowed_total_amount;
				formData['f8_borrowed_total_int']             = sqlData.f8_borrowed_total_int;
				formData['f8_borrowed_amount_emi']            = sqlData.f8_borrowed_amount_emi;
				formData['f8_borrowed_emi_paid']              = sqlData.f8_borrowed_emi_paid;
				formData['f8_borrowed_outstanding_amount']    = sqlData.f8_borrowed_outstanding_amount;
				formData['f8_borrowed_outstanding_principal'] = sqlData.f8_borrowed_outstanding_principal;
				formData['f8_borrowed_amount_emi_rem']        = sqlData.f8_borrowed_amount_emi_rem;

                this.loan.setValue(formData);
                this.exist = true;
            }

        }, err => {
            console.log(err);
        });
	}

	setValidation(){
		console.log('setValidation Called');
		let controls = this.loan.controls;
		if(controls['loan_want'].value == 'yes'){

			controls['loan_amount'].enable({ emitEvent: false });
		}
		else{
			controls['loan_amount'].setValue('', { emitEvent: false });
			controls['loan_amount'].disable({ emitEvent: false });
		}

		if(controls['f8_private_lenders'].value == 'yes'){

			controls['f8_borrowed_amount_date'].enable({ emitEvent: false });
			controls['f8_borrowed_amount'].enable({ emitEvent: false });
			controls['f8_borrowed_loan_per'].enable({ emitEvent: false });
			controls['f8_borrowed_loan_month'].enable({ emitEvent: false });
			controls['f8_borrowed_total_amount'].enable({ emitEvent: false });
			controls['f8_borrowed_total_int'].enable({ emitEvent: false });
			controls['f8_borrowed_amount_emi'].enable({ emitEvent: false });
			controls['f8_borrowed_emi_paid'].enable({ emitEvent: false });
			controls['f8_borrowed_outstanding_amount'].enable({ emitEvent: false });
			controls['f8_borrowed_outstanding_principal'].enable({ emitEvent: false });
			controls['f8_borrowed_amount_emi_rem'].enable({ emitEvent: false });
		}
		else{
			controls['f8_borrowed_amount_date'].setValue('', { emitEvent: false });
			controls['f8_borrowed_amount'].setValue('', { emitEvent: false });
			controls['f8_borrowed_loan_per'].setValue('', { emitEvent: false });
			controls['f8_borrowed_loan_month'].setValue('', { emitEvent: false });
			controls['f8_borrowed_total_amount'].setValue('', { emitEvent: false });
			controls['f8_borrowed_total_int'].setValue('', { emitEvent: false });
			controls['f8_borrowed_amount_emi'].setValue('', { emitEvent: false });
			controls['f8_borrowed_emi_paid'].setValue('', { emitEvent: false });
			controls['f8_borrowed_outstanding_amount'].setValue('', { emitEvent: false });
			controls['f8_borrowed_outstanding_principal'].setValue('', { emitEvent: false });
			controls['f8_borrowed_amount_emi_rem'].setValue('', { emitEvent: false });

			controls['f8_borrowed_amount_date'].disable({ emitEvent: false });
			controls['f8_borrowed_amount'].disable({ emitEvent: false });
			controls['f8_borrowed_loan_per'].disable({ emitEvent: false });
			controls['f8_borrowed_loan_month'].disable({ emitEvent: false });
			controls['f8_borrowed_total_amount'].disable({ emitEvent: false });
			controls['f8_borrowed_total_int'].disable({ emitEvent: false });
			controls['f8_borrowed_amount_emi'].disable({ emitEvent: false });
			controls['f8_borrowed_emi_paid'].disable({ emitEvent: false });
			controls['f8_borrowed_outstanding_amount'].disable({ emitEvent: false });
			controls['f8_borrowed_outstanding_principal'].disable({ emitEvent: false });
			controls['f8_borrowed_amount_emi_rem'].disable({ emitEvent: false });
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
                this.sql.query('UPDATE tbl_financial_details SET loan_want = ?, loan_amount = ?, fx_monthly_income = ?, f8_loan_taken = ?, f8_private_lenders = ?, f8_borrowed_amount_date = ?, f8_borrowed_amount = ?, f8_borrowed_loan_per = ?, f8_borrowed_loan_month = ?, f8_borrowed_total_amount = ?, f8_borrowed_total_int = ?, f8_borrowed_amount_emi = ?, f8_borrowed_emi_paid = ?, f8_borrowed_outstanding_amount = ?, f8_borrowed_outstanding_principal = ?, f8_borrowed_amount_emi_rem = ?, f8_modified_date = ? WHERE fm_id = ?', [

                    this.loan.value.loan_want,
                    this.loan.value.loan_amount,
                    this.loan.value.fx_monthly_income,
                    this.loan.value.f8_loan_taken,
                    this.loan.value.f8_private_lenders,
                    this.loan.value.f8_borrowed_amount_date,
                    this.loan.value.f8_borrowed_amount, 
                    this.loan.value.f8_borrowed_loan_per, 
                    this.loan.value.f8_borrowed_loan_month, 
                    this.loan.value.f8_borrowed_total_amount, 
                    this.loan.value.f8_borrowed_total_int, 
                    this.loan.value.f8_borrowed_amount_emi,
                    this.loan.value.f8_borrowed_emi_paid,
                    this.loan.value.f8_borrowed_outstanding_amount,
                    this.loan.value.f8_borrowed_outstanding_principal,
                    this.loan.value.f8_borrowed_amount_emi_rem,

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
                this.sql.query('INSERT INTO tbl_financial_details(fm_id, loan_want, loan_amount, fx_monthly_income, f8_loan_taken, f8_private_lenders, f8_borrowed_amount_date, f8_borrowed_amount, f8_borrowed_loan_per, f8_borrowed_loan_month, f8_borrowed_total_amount, f8_borrowed_total_int, f8_borrowed_amount_emi, f8_borrowed_emi_paid, f8_borrowed_outstanding_amount, f8_borrowed_outstanding_principal, f8_borrowed_amount_emi_rem, f8_created_date, f8_modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [

                    this.fm_id,
                    this.loan.value.loan_want,
                    this.loan.value.loan_amount,
                    this.loan.value.fx_monthly_income,
                    this.loan.value.f8_loan_taken,
                    this.loan.value.f8_private_lenders,
                    this.loan.value.f8_borrowed_amount_date,
                    this.loan.value.f8_borrowed_amount, 
                    this.loan.value.f8_borrowed_loan_per, 
                    this.loan.value.f8_borrowed_loan_month, 
                    this.loan.value.f8_borrowed_total_amount, 
                    this.loan.value.f8_borrowed_total_int, 
                    this.loan.value.f8_borrowed_amount_emi,
                    this.loan.value.f8_borrowed_emi_paid,
                    this.loan.value.f8_borrowed_outstanding_amount,
                    this.loan.value.f8_borrowed_outstanding_principal,
                    this.loan.value.f8_borrowed_amount_emi_rem,
                    dateNow,
                    dateNow
                ]).then(data => {
                    this.navCtrl.pop();
                },
                err => {
                    console.log(err);
                });
            }

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

    compareMinEqual(control, maxVal){

    	return new Promise(resolve => {
	    	if(maxVal != null || maxVal != '' || maxVal != 0){

	    		if(maxVal < parseInt(control.value)){
	    			resolve({
		    			'notvalid': true
		    		});
	    		}
	    		else{
	    			resolve(null);
	    		}

	    	}else{
	    		resolve({
	    			'notvalid': true
	    		});
	    	}
        });
    }
}
