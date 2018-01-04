import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';

/**
 * Generated class for the CropPreviousAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crop-previous-add',
  templateUrl: 'crop-previous-add.html',
})
export class CropPreviousAddPage {

  	previous: FormGroup;
  	submitAttempt: boolean = false;
  	fm_id: any;
    local_crop_id: any;
    exist: boolean = false;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams,
                public sql: Sql,
				public toastCtrl: ToastController,
				public formBuilder: FormBuilder) {
		this.previous = formBuilder.group({
			// 'f11_points' : ['0'],
			'f11_cultivating' : ['', Validators.required],
			'f11_achieved' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f11_income' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f11_diseases' : ['', Validators.required],
			'f11_fertilizers' : ['', Validators.required],
			// 'f11_consumption_fertilizer' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			// 'f11_damaged_prev_crop' : ['', Validators.required],
			// 'f11_what_was_the_reason1' : ['', Validators.required],
		});
	}

	ionViewDidEnter() {
		console.log('ionViewDidLoad LandFarmAddPage');

		this.exist         = false;
		this.fm_id         = this.navParams.get('farmer_id');
		this.local_crop_id = this.navParams.get('local_crop_id') || false;

		if(this.local_crop_id !== false){
	        this.sql.query('SELECT * FROM tbl_yield_details WHERE fm_id = ? and local_crop_id = ? limit 1', [this.fm_id, this.local_crop_id]).then( (data) => {

	            if (data.res.rows.length > 0) {

	                let sqlData = data.res.rows.item(0);
	                let formData = [];

					formData['f11_cultivating'] = sqlData.f11_cultivating;
					formData['f11_achieved']    = sqlData.f11_achieved;
					formData['f11_income']      = sqlData.f11_income;
					formData['f11_diseases']    = sqlData.f11_diseases;
					formData['f11_fertilizers'] = sqlData.f11_fertilizers;

	                this.previous.setValue(formData);
	                this.exist = true;
	            }

	        }, err => {
	            console.log(err);
	        });
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
		if (this.previous.valid) {
			console.log('success', this.previous.value);

			let date = new Date();
            let dateNow = date.getTime()/1000|0;

            if (this.exist) {
                this.sql.query('UPDATE tbl_yield_details SET f11_cultivating = ?, f11_achieved = ?, f11_income = ?, f11_diseases = ?, f11_fertilizers = ?, f11_modified_date = ? WHERE fm_id = ? and local_crop_id = ?', [

                    this.previous.value.f11_cultivating,
                    this.previous.value.f11_achieved,
                    this.previous.value.f11_income,
                    this.previous.value.f11_diseases,
                    this.previous.value.f11_fertilizers,

                    dateNow,
                    this.fm_id,
                    this.local_crop_id
                ]).then(data => {
                    this.sql.updateUploadStatus('tbl_yield_details', this.fm_id, '0');
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
                this.sql.query('INSERT INTO tbl_yield_details(fm_id, f11_cultivating, f11_achieved, f11_income, f11_diseases, f11_fertilizers, f11_created_date, f11_modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [

                    this.fm_id,
                    this.previous.value.f11_cultivating,
                    this.previous.value.f11_achieved,
                    this.previous.value.f11_income,
                    this.previous.value.f11_diseases,
                    this.previous.value.f11_fertilizers,
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
		}else{
			console.log('Validation error');
			this.showMessage("Please fill valid data!", "danger", 100000);
		}
	}

}
