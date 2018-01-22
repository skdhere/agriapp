import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';
import { SelectSearchable } from '../../components/select-searchable/select-searchable';


@IonicPage()
@Component({
	selector: 'page-residence-details',
	templateUrl: 'residence-details.html',
})
export class ResidenceDetailsPage {

	personal: FormGroup;
    submitAttempt: boolean = false;
    retryButton: boolean = false;
    fm_id: any;
    exist: boolean = false;
    states: any[];
    districts: any[];
    talukas: any[];
    villages: any[];
    cstates: any[];
    cdistricts: any[];
    ctalukas: any[];
    cvillages: any[];

	constructor(public navCtrl: NavController, 
                public navParams: NavParams, 
                public sql: Sql,
                public formBuilder: FormBuilder) {
		this.personal = formBuilder.group({
            
            f7_resistatus: ['', Validators.required],
            f7_phouse: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9/,\-\@&$# ]*')])],
            f7_pstreet: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9/,\-\@&$# ]*')])],
            f7_parea: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9/,\-\@&$# ]*'), Validators.required])],
            f7_pstate: ['', Validators.required],
            f7_pdistrict: ['', Validators.required],
            f7_ptaluka: ['', Validators.required],
            f7_pvillage: ['', Validators.required],
            f7_ppin: ['', Validators.compose([Validators.pattern('^[0-9]{6}$'), Validators.required])],

            f7_chouse: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9/,\-\@&$# ]*')])],
            f7_cstreet: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9/,\-\@&$# ]*')])],
            f7_carea: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9/,\-\@&$# ]*'), Validators.required])],
            f7_cstate: ['', Validators.required],
            f7_cdistrict: ['', Validators.required],
            f7_ctaluka: ['', Validators.required],
            f7_cvillage: ['', Validators.required],
            f7_cpin: ['', Validators.compose([Validators.pattern('^[0-9]{6}$'), Validators.required])]
        });

        // load states
        this.sql.query('SELECT * FROM tbl_state', []).then( (data) => {
            if (data.res.rows.length > 0) {
                let sta = [];
                for(let i=0; i<data.res.rows.length; i++){
                    sta.push(data.res.rows.item(i));
                }
                this.states = sta;
                this.cstates = sta;
            }
            console.log(this.states);
        }, (error) =>{
            console.log(error);
        });

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
                    event.value.id != undefined ? this.personal.controls["f7_pdistrict"].setValue('') : {};
                    event.value.id != undefined ? this.personal.controls["f7_ptaluka"].setValue('') : {};
                    event.value.id != undefined ? this.personal.controls["f7_pvillage"].setValue('') : {};

                }else{
                    this.cdistricts = [];
                    for(let i=0; i<data.res.rows.length; i++){
                        this.cdistricts.push(data.res.rows.item(i));
                    }
                    event.value.id != undefined ? this.personal.controls["f7_cdistrict"].setValue('') : {};
                    event.value.id != undefined ? this.personal.controls["f7_ctaluka"].setValue('') : {};
                    event.value.id != undefined ? this.personal.controls["f7_cvillage"].setValue('') : {};
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
                    event.value.id != undefined ? this.personal.controls["f7_ptaluka"].setValue('') : {};
                    event.value.id != undefined ? this.personal.controls["f7_pvillage"].setValue('') : {};  
                }else{
                    this.ctalukas = [];
                    for(let i=0; i<data.res.rows.length; i++){
                        this.ctalukas.push(data.res.rows.item(i));
                    }
                    event.value.id != undefined ? this.personal.controls["f7_ctaluka"].setValue('') : {};
                    event.value.id != undefined ? this.personal.controls["f7_cvillage"].setValue('') : {};
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
                    event.value.id != undefined ? this.personal.controls["f7_pvillage"].setValue(''): {}; 
                }else{
                    this.cvillages = [];
                    for(let i=0; i<data.res.rows.length; i++){
                        this.cvillages.push(data.res.rows.item(i));
                    }
                    event.value.id != undefined ? this.personal.controls["f7_cvillage"].setValue(''): {}; 
                }
            }
        }, (error) =>{
            console.log(error);
        });
    }

	ionViewDidEnter() {
        this.exist = false;
        this.fm_id = this.navParams.get('farmer_id');

        this.sql.query('SELECT * FROM tbl_residence_details WHERE fm_id = ? limit 1', [this.fm_id]).then( (data) => {

            if (data.res.rows.length > 0) {

                let sqlData = data.res.rows.item(0);
                let formData = [];

                formData['f7_resistatus'] = sqlData.f7_resistatus;
                formData['f7_phouse']     = sqlData.f7_phouse;
                formData['f7_pstreet']    = sqlData.f7_pstreet;
                formData['f7_parea']      = sqlData.f7_parea;

                formData['f7_pstate']     = {name : sqlData.f7_pstate};
                this.stateChange('p',{value : formData['f7_pstate']});

                formData['f7_pdistrict']  = {name : sqlData.f7_pdistrict};
                this.districtChange('p',{value : formData['f7_pdistrict']});

                formData['f7_ptaluka']    = {name : sqlData.f7_ptaluka};
                this.talukaChange('p',{value : formData['f7_ptaluka']});

                formData['f7_pvillage']   = {name : sqlData.f7_pvillage};
                formData['f7_ppin']       = sqlData.f7_ppin;
                formData['f7_chouse']     = sqlData.f7_chouse;
                formData['f7_cstreet']    = sqlData.f7_cstreet;
                formData['f7_carea']      = sqlData.f7_carea;

                formData['f7_cstate']     = {name : sqlData.f7_cstate};
                this.stateChange('c',{value : formData['f7_cstate']});

                formData['f7_cdistrict']  = {name : sqlData.f7_cdistrict};
                this.districtChange('c',{value : formData['f7_cdistrict']});

                formData['f7_ctaluka']    = {name : sqlData.f7_ctaluka};
                this.talukaChange('c',{value : formData['f7_ctaluka']});

                formData['f7_cvillage']   = {name : sqlData.f7_cvillage};
                formData['f7_cpin']       = sqlData.f7_cpin;

                this.personal.setValue(formData);
                this.exist = true;
            }

        }, err => {
            console.log(err);
        });
	}

	save() {

        this.submitAttempt = true;
        if (!this.personal.valid) {
            console.log("Validation error!")
        } else {
            console.log("success!");
            console.log(this.personal.value);

            let date = new Date();
            let dateNow = date.getTime()/1000|0;

            if (this.exist) {
                this.sql.query('UPDATE tbl_residence_details SET f7_resistatus = ?, f7_phouse = ?, f7_pstreet = ?, f7_parea = ?, f7_pstate = ?, f7_pdistrict = ?, f7_ptaluka = ?, f7_pvillage = ?, f7_ppin = ?, f7_chouse = ?, f7_cstreet = ?, f7_carea = ?, f7_cstate = ?, f7_cdistrict = ?, f7_ctaluka = ?, f7_cvillage = ?, f7_cpin = ?, f7_modified_date = ? WHERE fm_id = ?', [

                    this.personal.value.f7_resistatus,
                    this.personal.value.f7_phouse,
                    this.personal.value.f7_pstreet,
                    this.personal.value.f7_parea,
                    this.personal.value.f7_pstate.name,
                    this.personal.value.f7_pdistrict.name,
                    this.personal.value.f7_ptaluka.name, 
                    this.personal.value.f7_pvillage.name, 
                    this.personal.value.f7_ppin, 
                    this.personal.value.f7_chouse, 
                    this.personal.value.f7_cstreet, 
                    this.personal.value.f7_carea,
                    this.personal.value.f7_cstate.name,
                    this.personal.value.f7_cdistrict.name,
                    this.personal.value.f7_ctaluka.name,
                    this.personal.value.f7_cvillage.name,
                    this.personal.value.f7_cpin,
                    dateNow,
                    this.fm_id
                ]).then(data => {
                    this.sql.updateUploadStatus('tbl_residence_details', this.fm_id, '0');
                    this.navCtrl.pop();
                },
                err => {
                    console.log(err);
                });               
            }
            else{
                this.sql.query('INSERT INTO tbl_residence_details(fm_id, f7_resistatus, f7_phouse, f7_pstreet, f7_parea, f7_pstate, f7_pdistrict, f7_ptaluka, f7_pvillage, f7_ppin, f7_chouse, f7_cstreet, f7_carea, f7_cstate, f7_cdistrict, f7_ctaluka, f7_cvillage, f7_cpin, f7_created_date, f7_modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [

                    this.fm_id,
                    this.personal.value.f7_resistatus,
                    this.personal.value.f7_phouse,
                    this.personal.value.f7_pstreet,
                    this.personal.value.f7_parea,
                    this.personal.value.f7_pstate.name,
                    this.personal.value.f7_pdistrict.name,
                    this.personal.value.f7_ptaluka.name, 
                    this.personal.value.f7_pvillage.name, 
                    this.personal.value.f7_ppin, 
                    this.personal.value.f7_chouse, 
                    this.personal.value.f7_cstreet, 
                    this.personal.value.f7_carea,
                    this.personal.value.f7_cstate.name,
                    this.personal.value.f7_cdistrict.name,
                    this.personal.value.f7_ctaluka.name,
                    this.personal.value.f7_cvillage.name,
                    this.personal.value.f7_cpin,
                    dateNow,
                    dateNow
                ]).then(data => {
                    this.sql.updateUploadStatus('tbl_residence_details', this.fm_id, '0');
                    this.navCtrl.pop();
                },
                err => {
                    console.log(err);
                });
            }
        }
    }

    copyAddress() {
        this.personal.controls['f7_chouse'].setValue(this.personal.value.f7_phouse);
        this.personal.controls['f7_cstreet'].setValue(this.personal.value.f7_pstreet);
        this.personal.controls['f7_carea'].setValue(this.personal.value.f7_parea);
        this.personal.controls['f7_cstate'].setValue(this.personal.value.f7_pstate);
        this.personal.controls['f7_cdistrict'].setValue(this.personal.value.f7_pdistrict);
        this.personal.controls['f7_ctaluka'].setValue(this.personal.value.f7_ptaluka);
        this.personal.controls['f7_cvillage'].setValue(this.personal.value.f7_pvillage);
        this.personal.controls['f7_cpin'].setValue(this.personal.value.f7_ppin);
    }

    changeState(type, name){
        if (type == 'p') {
            this.personal.controls.f7_pdistrict.reset();
        }else{
            this.personal.controls.f7_cdistrict.reset();
        }

        console.log(name);
    }

    changeDistrict(type, name){
        if (type == 'p') {
            this.personal.controls.f7_ptaluka.reset();
        }else{
            this.personal.controls.f7_ctaluka.reset();
        }
        console.log(name);
    }

    changeTaluka(type, name){
        if (type == 'p') {
            this.personal.controls.f7_pvillage.reset();
        }else{
            this.personal.controls.f7_cvillage.reset();
        }
        console.log(name);
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
