import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';

/**
 * Generated class for the CropCultivationAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crop-cultivation-add',
  templateUrl: 'crop-cultivation-add.html',
})
export class CropCultivationAddPage {
	
	cultivation: FormGroup;
	submitAttempt: boolean = false;
	fm_id: any;
    local_id: any;
    exist: boolean = false;
    farms: any = [];
    crops: any[];
    varieties: any[];

	constructor(public navCtrl: NavController, 
				public navParams: NavParams,
				public sql: Sql, 
				public toastCtrl: ToastController,
				public formBuilder: FormBuilder) {
		this.cultivation = formBuilder.group({
			
			'f10_land' : ['', Validators.required],
			'f10_cultivating' : ['', Validators.required],
			'f10_crop_variety' : ['', Validators.required],
			'f10_other_variety' : ['', Validators.compose([ Validators.required, Validators.maxLength(50)]) ],
			'f10_stage' : ['', Validators.required],
			'f10_expected' : ['', Validators.compose([ Validators.required, Validators.maxLength(8), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f10_expectedprice' : ['', Validators.compose([ Validators.required, Validators.maxLength(8), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')])],
			'f10_diseases' : ['', Validators.required],
			'f10_pest' : ['', Validators.required],
		});

		// load crops
        this.sql.query('SELECT * FROM tbl_crops', []).then( (data) => {
            if (data.res.rows.length > 0) {
            	let sta = [];
                for(let i=0; i<data.res.rows.length; i++){
                    sta.push(data.res.rows.item(i));
                }
                this.crops = sta;
            }
        }, (error) =>{
            console.log(error);
        });

        //Listen for form changes
		this.cultivation.controls['f10_crop_variety'].valueChanges.subscribe(() => {this.setValidation();});

	}

	setValidation(){
		let controls = this.cultivation.controls;
		if(controls['f10_crop_variety'].value.id != undefined){
			if(controls['f10_crop_variety'].value.id == 0){
				controls['f10_other_variety'].enable({ emitEvent: false });
			}
			else{
				controls['f10_other_variety'].setValue('', { emitEvent: false });
				controls['f10_other_variety'].disable({ emitEvent: false });
			}
		}
	}

	ionViewDidEnter() {
		console.log('ionViewDidLoad cultivationFarmAddPage');
		this.setValidation();

		//Fetch value from sqlite and update form data 
		this.exist         = false;
		this.fm_id         = this.navParams.get('farmer_id');
		
		this.local_id = false;
		if(this.navParams.get('local_id') != undefined){
			this.local_id = this.navParams.get('local_id');
		}

		this.sql.query('SELECT * FROM tbl_land_details WHERE fm_id = ? ORDER BY f9_modified_date DESC', [this.fm_id]).then( (data) => {

            if (data.res.rows.length > 0) {
            	this.farms = [];

                for (var i = 0; i < data.res.rows.length; i++) {
                	this.farms.push(data.res.rows.item(i));
                }

				console.log(this.farms);
            }
            else{
            	this.farms = [];
            }

        }, err => {
            console.log(err);
        });

		if(this.local_id !== false){
			this.sql.query('SELECT * FROM tbl_cultivation_data WHERE fm_id = ? and local_id = ? limit 1', [this.fm_id, this.local_id]).then( (data) => {

	            if (data.res.rows.length > 0) {

	                let sqlData = data.res.rows.item(0);
	                let formData = [];

					formData['f10_land']          = sqlData.f10_land;
					formData['f10_cultivating']   = sqlData.f10_cultivating;
					formData['f10_crop_variety']  = sqlData.f10_crop_variety;
					formData['f10_other_variety'] = sqlData.f10_other_variety;
					formData['f10_stage']         = sqlData.f10_stage;
					formData['f10_expected']      = sqlData.f10_expected;
					formData['f10_expectedprice'] = sqlData.f10_expectedprice;
					formData['f10_diseases']      = sqlData.f10_diseases.split(',');
					formData['f10_pest']          = sqlData.f10_pest;

	                this.cultivation.setValue(formData);
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

		if (this.cultivation.valid) 
		{
			console.log('success', this.cultivation.value);

			let date = new Date();
            let dateNow = date.getTime()/1000|0;

			if (this.exist) {
                this.sql.query('UPDATE tbl_cultivation_data SET f10_land = ?, f10_cultivating = ?, f10_crop_variety = ?, f10_stage = ?, f10_expected = ?, f10_expectedprice = ?, f10_diseases = ?, f10_pest = ?,  f10_modified_date = ? WHERE fm_id = ? and local_id = ?', [

                    this.cultivation.value.f10_land,
                    this.cultivation.value.f10_cultivating.id,
                    this.cultivation.value.f10_crop_variety.id,
                    this.cultivation.value.f10_other_variety,
                    this.cultivation.value.f10_stage,
                    this.cultivation.value.f10_expected,
                    this.cultivation.value.f10_expectedprice,
                    this.cultivation.value.f10_diseases, 
                    this.cultivation.value.f10_pest, 
                    
                    dateNow,
                    this.fm_id,
                    this.local_id

                ]).then(data => {
                    this.sql.updateUploadStatus('tbl_cultivation_data', this.fm_id, '0');
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
                this.sql.query('INSERT INTO tbl_cultivation_data(fm_id, f10_land, f10_cultivating, f10_crop_variety, f10_stage, f10_expected, f10_expectedprice, f10_diseases, f10_pest, f10_created_date, f10_modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [

                    this.fm_id,
                    this.cultivation.value.f10_land,
                    this.cultivation.value.f10_cultivating.id,
                    this.cultivation.value.f10_crop_variety.id,
                    this.cultivation.value.f10_other_variety,
                    this.cultivation.value.f10_stage,
                    this.cultivation.value.f10_expected,
                    this.cultivation.value.f10_expectedprice,
                    this.cultivation.value.f10_diseases, 
                    this.cultivation.value.f10_pest, 
                    dateNow,
                    dateNow
                ]).then(data => {
                    this.sql.updateUploadStatus('tbl_cultivation_data', this.fm_id, '0');
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
		else
		{
			this.showMessage("Validation error!", "danger");
			console.log('Validation error');
			console.log('Validation error', this.cultivation.controls);
		}

	}


	cropChange( type, event?: any) {
        this.sql.query('SELECT * FROM tbl_varieties WHERE crop_id=(SELECT id FROM tbl_crops WHERE name=? LIMIT 1)', [event.value.name]).then( (data) => {
            this.varieties = [{id: 0, name: 'Other'}];
            if (data.res.rows.length > 0) {
                for(let i=0; i<data.res.rows.length; i++){
                    this.varieties.push(data.res.rows.item(i));
                }
            }
        }, (error) =>{
            console.log(error);
        });
        this.cultivation.controls["f10_crop_variety"].setValue('');
    }
}
