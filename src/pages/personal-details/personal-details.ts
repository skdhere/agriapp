import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';

/**
 * Generated class for the PersonalDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-personal-details',
 	templateUrl: 'personal-details.html',
 })
 export class PersonalDetailsPage {

 	personal: FormGroup;
    submitAttempt: boolean = false;
    retryButton: boolean = false;
    fm_id: any;
    exist: boolean = false;    

 	constructor(public navCtrl: NavController, 
                public navParams: NavParams, 
                public sql: Sql,
                public formBuilder: FormBuilder) {

 		this.personal = formBuilder.group({

            f1_mfname: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
            f1_mmname: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
            f1_dob: ['', Validators.required],
            f1_age: [''],
            f1_altno: ['', Validators.pattern('^[0-9]{10}$')],
            any_other_select: ['', Validators.required],
            f1_ppno: ['', Validators.pattern('^[0-9A-Za-z-/\_$&@]{12}$')],
            f1_pancard: ['', Validators.pattern('^[0-9A-Za-z-/\_$&@]{10}$')],
            f1_vote: ['', Validators.pattern('^[0-9A-Za-z-/\_$&@]{12}$')],
            f1_licno: ['', Validators.pattern('^[0-9A-Za-z-/\_$&@]{12}$')],
            f1_otherno: ['', Validators.compose([Validators.maxLength(20),Validators.pattern('^[0-9A-Za-z-/\_$&@]*')] )],
            f1_expfarm: ['', Validators.compose([Validators.maxLength(2), Validators.pattern('^[0-9.]*'), Validators.required])],
        });

        this.personal.controls.f1_dob.valueChanges.subscribe(() => {
        	let dob = this.personal.controls.f1_dob.value;
        	this.personal.controls.f1_age.setValue(this.getAge(dob));
        });
 	}

 	getAge(dateString) {
	    let today = new Date();
	    let birthDate = new Date(dateString);
	    let age = today.getFullYear() - birthDate.getFullYear();
	    let m = today.getMonth() - birthDate.getMonth();
	    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
	        age--;
	    }
	    return age;
	}

 	ionViewDidEnter() {

        this.exist = false;
        this.fm_id = this.navParams.get('farmer_id');

        this.sql.query('SELECT * FROM tbl_personal_detail WHERE fm_id = ? limit 1', [this.fm_id]).then( (data) => {

            if (data.res.rows.length > 0) {

                let sqlData = data.res.rows.item(0);
                let formData = [];

                formData['f1_mfname']        = sqlData.f1_mfname;
                formData['f1_mmname']        = sqlData.f1_mmname;
                formData['f1_dob']           = sqlData.f1_dob;
                formData['f1_age']           = sqlData.f1_age;
                formData['f1_altno']         = sqlData.f1_altno;
                formData['any_other_select'] = sqlData.any_other_select;
                formData['f1_ppno']          = sqlData.f1_ppno;
                formData['f1_pancard']       = sqlData.f1_pancard;
                formData['f1_vote']          = sqlData.f1_vote;
                formData['f1_licno']         = sqlData.f1_licno;
                formData['f1_otherno']       = sqlData.f1_otherno;
                formData['f1_expfarm']       = sqlData.f1_expfarm;

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
            console.log("success!")
            console.log(this.personal.value);

            let date = new Date();
            let dateNow = date.getTime()/1000|0;

            if (this.exist) {
                this.sql.query('UPDATE tbl_personal_detail SET f1_mfname = ?, f1_mmname = ?, f1_dob = ?, f1_age = ?, f1_altno  = ?, any_other_select = ?, f1_ppno = ?, f1_pancard = ?, f1_vote = ?, f1_licno = ?, f1_otherno = ?, f1_expfarm = ?, f1_modified_date = ? WHERE fm_id = ?', [

                    this.personal.value.f1_mfname,
                    this.personal.value.f1_mmname,
                    this.personal.value.f1_dob,
                    this.personal.value.f1_age,
                    this.personal.value.f1_altno,
                    this.personal.value.any_other_select,
                    this.personal.value.f1_ppno, 
                    this.personal.value.f1_pancard, 
                    this.personal.value.f1_vote, 
                    this.personal.value.f1_licno, 
                    this.personal.value.f1_otherno, 
                    this.personal.value.f1_expfarm,
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
                this.sql.query('INSERT INTO tbl_personal_detail(fm_id, f1_mfname, f1_mmname, f1_dob, f1_age, f1_altno ,any_other_select, f1_ppno, f1_pancard, f1_vote, f1_licno, f1_otherno, f1_expfarm, f1_created_date, f1_modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [

                    this.fm_id,
                    this.personal.value.f1_mfname,
                    this.personal.value.f1_mmname,
                    this.personal.value.f1_dob,
                    this.personal.value.f1_age,
                    this.personal.value.f1_altno,
                    this.personal.value.any_other_select,
                    this.personal.value.f1_ppno, 
                    this.personal.value.f1_pancard, 
                    this.personal.value.f1_vote, 
                    this.personal.value.f1_licno, 
                    this.personal.value.f1_otherno, 
                    this.personal.value.f1_expfarm,
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

 }
