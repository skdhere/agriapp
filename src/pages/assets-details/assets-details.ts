import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';
/**
 * Generated class for the AssetsDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-assets-details',
  templateUrl: 'assets-details.html',
})
export class AssetsDetailsPage {

	assets: FormGroup;
	submitAttempt: boolean = false;
	addNew: boolean = true;
	fm_id: any;
    exist: boolean = false;   

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public sql: Sql,
				public toastCtrl: ToastController,
				public formBuilder: FormBuilder) {
		this.assets = formBuilder.group({
			
			'f12_vehicle' : ['', Validators.required],
			// 'f12_total_val_of_vehical' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f12_machinery' : ['', Validators.required],
			// 'f12_total_val_of_machinery' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f12_any_other_assets' : [''],
			'f12_name_of_other_assets' : [''],
			// 'f12_mention_value_of_assets' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
		});
		//Listen for form changes
		this.assets.controls['f12_any_other_assets'].valueChanges.subscribe(() => {this.setValidation();});
	}

	setValidation(){
		let controls = this.assets.controls;
		if(controls['f12_any_other_assets'].value == 'yes'){
			controls['f12_name_of_other_assets'].enable();
			// controls['f12_mention_value_of_assets'].enable();
		}
		else{
			controls['f12_name_of_other_assets'].setValue('', { emitEvent: false });
			// controls['f12_mention_value_of_assets'].setValue('', { emitEvent: false });
			controls['f12_name_of_other_assets'].disable();
			// controls['f12_mention_value_of_assets'].disable();
		}
	}

	ionViewDidEnter() {
		
		this.setValidation();
		
		//Fetch value from sqlite and update form data 
		this.exist = false;
        this.fm_id = this.navParams.get('farmer_id');

        this.sql.query('SELECT * FROM tbl_asset_details WHERE fm_id = ? limit 1', [this.fm_id]).then( (data) => {

            if (data.res.rows.length > 0) {

                let sqlData = data.res.rows.item(0);
                let formData = [];

				formData['f12_vehicle']   = sqlData.f12_vehicle;
				formData['f12_machinery']     = sqlData.f12_machinery;
				formData['f12_any_other_assets']     = sqlData.f12_any_other_assets;
				formData['f12_name_of_other_assets']     = sqlData.f12_name_of_other_assets;
				

                this.assets.setValue(formData);
                this.exist = true;
            }

        }, err => {
            console.log(err);
        });

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
		if (this.assets.valid) {
			console.log('is POST ', this.addNew);
			
			//Check if data already exists
			//accordingly update or inster data
			let date = new Date();
            let dateNow = date.getTime()/1000|0;

			if (this.exist) {
                this.sql.query('UPDATE tbl_asset_details SET f12_vehicle = ?, f12_machinery = ?, f12_any_other_assets = ?, f12_name_of_other_assets = ?, f12_modified_date = ? WHERE fm_id = ?', [

                    this.assets.value.f12_vehicle || '',
                    this.assets.value.f12_machinery || '',
                    this.assets.value.f12_any_other_assets || '',
                    this.assets.value.f12_name_of_other_assets || '',
                    

                    dateNow,
                    this.fm_id
                ]).then(data => {
                    this.sql.updateUploadStatus('tbl_asset_details', this.fm_id, '0');
                    this.navCtrl.pop();
                },
                err => {
                    console.log(err);
                });               
            }
            else{
                this.sql.query('INSERT INTO tbl_asset_details(fm_id, f12_vehicle, f12_machinery, f12_any_other_assets, f12_name_of_other_assets, f12_created_date, f12_modified_date) VALUES (?, ?, ?, ?, ?, ?, ?)', [

                    this.fm_id,
                    this.assets.value.f12_vehicle || '',
                    this.assets.value.f12_machinery || '',
                    this.assets.value.f12_any_other_assets || '',
                    this.assets.value.f12_name_of_other_assets || '',
                    
                    dateNow,
                    dateNow
                ]).then(data => {
                    this.sql.updateUploadStatus('tbl_asset_details', this.fm_id, '0');
                    this.navCtrl.pop();
                },
                err => {
                    console.log(err);
                });
            }

		}else{
			console.log('Validation error', this.assets.controls);
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
