import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';
import { Helper } from '../../validators/ExtraValidator';

@IonicPage()
@Component({
  selector: 'page-land-farm-add',
  templateUrl: 'land-farm-add.html',
})
export class LandFarmAddPage {

    land: FormGroup;
    submitAttempt: boolean = false;
    fm_id: any;
    local_id: any;
    exist: boolean = false;
    states: any[];
    districts: any[];
    talukas: any[];
    villages: any[];

	constructor(public navCtrl: NavController, 
				public navParams: NavParams,
                public sql: Sql,
				public toastCtrl: ToastController,
				public formBuilder: FormBuilder) {
		this.land = formBuilder.group({

			'f9_name' : ['', Validators.compose([ Validators.required, Validators.maxLength(50)]) ],
			'f9_land_size' : ['', Validators.compose([ Validators.required, Validators.maxLength(6), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
            'f9_land_unit' : ['', Validators.required],
			'f9_owner' : ['', Validators.required],
			'f9_lease_year' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f9_amount_on_rent' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f9_contract_year' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f9_state' : ['', Validators.required],
			'f9_district' : ['', Validators.required],
			'f9_taluka' : ['', Validators.required],
			'f9_vilage' : ['', Validators.required],
			'f9_survey_number' : ['', Validators.compose([ Validators.required, Validators.maxLength(50)]) ],
			'f9_pincode' : ['', Validators.compose([ Validators.required, Validators.pattern('^[0-9]{6}$')])],
			// 'f9_lat' : ['', Validators.required],
			// 'f9_long' : ['', Validators.required],
			'f9_soil_type' : ['', Validators.required],
			'f9_soil_tested' : ['', Validators.required],
			// 'f9_soil_depth' : ['', Validators.compose([ Validators.required, Validators.maxLength(6), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			// 'f9_source_of_water' : ['', Validators.required],
		});

		// load states
        this.sql.query('SELECT * FROM tbl_state', []).then( (data) => {
            if (data.res.rows.length > 0) {
            	let sta = [];
                for(let i=0; i<data.res.rows.length; i++){
                    sta.push(data.res.rows.item(i));
                }
                this.states = sta;
            }
        }, (error) =>{
            console.log(error);
        });
	}

	setValidation(){
		let controls = this.land.controls;

		if(controls['f9_owner'].value === 'Rented'){
			controls['f9_amount_on_rent'].enable({ emitEvent: false });
		}
		else{
			controls['f9_amount_on_rent'].setValue('', { emitEvent: false });
			controls['f9_amount_on_rent'].disable({ emitEvent: false });
		}

		if(controls['f9_owner'].value === 'Contracted'){
			controls['f9_contract_year'].enable({ emitEvent: false });
		}
		else{
			controls['f9_contract_year'].setValue('', { emitEvent: false });
			controls['f9_contract_year'].disable({ emitEvent: false });
		}

		if(controls['f9_owner'].value === 'Leased'){
			controls['f9_lease_year'].enable({ emitEvent: false });
		}
		else{
			controls['f9_lease_year'].setValue('', { emitEvent: false });
			controls['f9_lease_year'].disable({ emitEvent: false });
		}
	}


    list_f9_owner = [
        {id: "Owned", name: "Owned"},
        {id: "Ancestral", name: "Ancestral"},
        {id: "Leased", name: "Leased"},
        {id: "Contracted", name: "Contracted"},
    ];

    list_f9_soil_tested = [
        {id: "yes", name: "Yes"},
        {id: "no", name: "No"},
    ];

    list_f9_soil_type = [
        {id: "Alluvial Soil", name: "Alluvial Soil"},
        {id: "Black Soil", name: "Black Soil"},
        {id: "Red Soil", name: "Red Soil"},
        {id: "Mountain Soil", name: "Mountain Soil"},
        {id: "Peat", name: "Peat"},
        {id: "Laterite Soil", name: "Laterite Soil"},
        {id: "Desert Soil", name: "Desert Soil"},
    ];

    list_f9_land_unit = [
        {id: "0", name: "Acre"},
        {id: "1", name: "Guntha"},
        {id: "2", name: "Hectare"},
    ];

	ionViewDidEnter() {
		console.log('ionViewDidLoad LandFarmAddPage');

		//Listen for form changes
		this.land.controls['f9_owner'].valueChanges.subscribe(() => {
			this.setValidation();
		});

		this.exist         = false;
		this.fm_id         = this.navParams.get('farmer_id');
		this.local_id = false;
        if(this.navParams.get('local_id') != ''){
            this.local_id = this.navParams.get('local_id');
        }

		if(this.local_id !== false){
	        this.sql.query('SELECT * FROM tbl_land_details WHERE fm_id = ? and local_id = ? limit 1', [this.fm_id, this.local_id]).then( (data) => {

	            if (data.res.rows.length > 0) {

	                let sqlData = data.res.rows.item(0);
	                let formData = [];

					formData['f9_name']           = sqlData.f9_name;
                    formData['f9_land_size']      = sqlData.f9_land_size;
					formData['f9_land_unit']      = Helper.checkInList(this.list_f9_land_unit, 'id', sqlData.f9_land_unit);
					formData['f9_owner']          = Helper.checkInList(this.list_f9_owner, 'id', sqlData.f9_owner);
					formData['f9_lease_year']     = sqlData.f9_lease_year;
					formData['f9_amount_on_rent'] = sqlData.f9_amount_on_rent;
					formData['f9_contract_year']  = sqlData.f9_contract_year;
					
					formData['f9_state']          = { name : sqlData.f9_state };
                	this.stateChange('p',{value : formData['f9_state']});

					formData['f9_district']       = { name : sqlData.f9_district };
                	this.districtChange('p',{value : formData['f9_district']});

					formData['f9_taluka']         = { name : sqlData.f9_taluka };
                	this.talukaChange('p',{value : formData['f9_taluka']});

					formData['f9_vilage']         = { name : sqlData.f9_vilage };
					formData['f9_survey_number']  = sqlData.f9_survey_number;
					formData['f9_pincode']        = sqlData.f9_pincode;
					formData['f9_soil_type']      = Helper.checkInList(this.list_f9_soil_type, 'id', sqlData.f9_soil_type);
					formData['f9_soil_tested']    = Helper.checkInList(this.list_f9_soil_tested, 'id', sqlData.f9_soil_tested);

	                this.land.setValue(formData);
	                this.exist = true;
	            }

	        }, err => {
	            console.log(err);
	        });
		}
	}

	stateChange( type, event?: any) {
        console.log('value:', event.value);
        this.sql.query('SELECT * FROM tbl_district WHERE state_id=(SELECT id FROM tbl_state WHERE name=? LIMIT 1)', [event.value.name]).then( (data) => {
            if (data.res.rows.length > 0) {
                if(type == 'p'){
                    this.districts = [];
                    for(let i=0; i<data.res.rows.length; i++){
                        this.districts.push(data.res.rows.item(i));
                    }
                    event.value.id != undefined ? this.land.controls["f9_district"].setValue('') : {};
                    event.value.id != undefined ? this.land.controls["f9_taluka"].setValue('') : {};
                    event.value.id != undefined ? this.land.controls["f9_vilage"].setValue('') : {};

                }
            }
        }, (error) =>{
            console.log(error);
        });
    }

    districtChange( type, event?: any){
        console.log('value:', event.value);
        this.sql.query('SELECT * FROM tbl_taluka WHERE district_id=(SELECT id FROM tbl_district WHERE name=? LIMIT 1)', [event.value.name]).then( (data) => {
            if (data.res.rows.length > 0) {
                if(type == 'p'){
                    this.talukas = [];
                    for(let i=0; i<data.res.rows.length; i++){
                        this.talukas.push(data.res.rows.item(i));
                    }
                    event.value.id != undefined ? this.land.controls["f9_taluka"].setValue('') : {};
                    event.value.id != undefined ? this.land.controls["f9_vilage"].setValue('') : {};  
                }
            }
        }, (error) =>{
            console.log(error);
        });
    }

    talukaChange( type, event?: any){
        console.log('value:', event.value);
        this.sql.query('SELECT * FROM tbl_village WHERE taluka_id=(SELECT id FROM tbl_taluka WHERE name=? LIMIT 1)', [event.value.name]).then( (data) => {
            if (data.res.rows.length > 0) {
                if(type == 'p'){
                    this.villages = [];
                    for(let i=0; i<data.res.rows.length; i++){
                        this.villages.push(data.res.rows.item(i));
                    }
                    event.value.id != undefined ? this.land.controls["f9_vilage"].setValue(''): {}; 
                }
            }
        }, (error) =>{
            console.log(error);
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
		if (this.land.valid) {
			console.log('success', this.land.value);

			let date = new Date();
            let dateNow = date.getTime()/1000|0;

            if (this.exist) {
                this.sql.query('UPDATE tbl_land_details SET f9_name = ?, f9_land_size = ?, f9_land_unit = ?, f9_owner = ?, f9_lease_year = ?, f9_amount_on_rent = ?, f9_contract_year = ?, f9_state = ?, f9_district = ?, f9_taluka = ?, f9_vilage = ?, f9_survey_number = ?, f9_pincode = ?, f9_soil_type = ?, f9_soil_tested = ?, f9_modified_date = ? WHERE fm_id = ? and local_id = ?', [

                    this.land.value.f9_name,
                    this.land.value.f9_land_size,
                    this.land.value.f9_land_unit,
                    this.land.value.f9_owner,
                    this.land.value.f9_lease_year,
                    this.land.value.f9_amount_on_rent,
                    this.land.value.f9_contract_year,
                    this.land.value.f9_state.name,
                    this.land.value.f9_district.name, 
                    this.land.value.f9_taluka.name, 
                    this.land.value.f9_vilage.name, 
                    this.land.value.f9_survey_number, 
                    this.land.value.f9_pincode, 
                    this.land.value.f9_soil_type,
                    this.land.value.f9_soil_tested,
                    dateNow,
                    this.fm_id,
                    this.local_id
                ]).then(data => {
                    this.sql.updateUploadStatus('tbl_land_details', [this.fm_id, this.local_id],'0');
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
                this.sql.query('INSERT INTO tbl_land_details(fm_id, f9_name, f9_land_size, f9_land_unit, f9_owner, f9_lease_year, f9_amount_on_rent, f9_contract_year, f9_state, f9_district, f9_taluka, f9_vilage, f9_survey_number, f9_pincode, f9_soil_type, f9_soil_tested, f9_created_date, f9_modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [

                    this.fm_id,
                    this.land.value.f9_name,
                    this.land.value.f9_land_size,
                    this.land.value.f9_land_unit,
                    this.land.value.f9_owner,
                    this.land.value.f9_lease_year,
                    this.land.value.f9_amount_on_rent,
                    this.land.value.f9_contract_year,
                    this.land.value.f9_state.name,
                    this.land.value.f9_district.name, 
                    this.land.value.f9_taluka.name, 
                    this.land.value.f9_vilage.name, 
                    this.land.value.f9_survey_number, 
                    this.land.value.f9_pincode, 
                    this.land.value.f9_soil_type,
                    this.land.value.f9_soil_tested,
                    dateNow,
                    dateNow
                ]).then(data => {
                    console.log(data);
                    if(data.res.insertId != undefined){
                        this.sql.updateUploadStatus('tbl_land_details', [this.fm_id, data.res.insertId], '0');
                    }

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
