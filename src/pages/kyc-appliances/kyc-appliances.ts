import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';

/**
 * Generated class for the KycAppliancesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kyc-appliances',
  templateUrl: 'kyc-appliances.html',
})
export class KycAppliancesPage {

    appliances: FormGroup;
    numbers: Array<number> = Array(11).fill(0).map((x,i)=>i); 
	submitAttempt: boolean = false;
	fm_id: any;
    exist: boolean = false;

	constructor(public navCtrl: NavController,
				public navParams: NavParams, 
                public sql: Sql,
				public toastCtrl: ToastController,
				public formBuilder: FormBuilder) {
		this.appliances = formBuilder.group({

			'f7_television' : ['', Validators.required],
			'f7_refrigerator' : ['', Validators.required],
			'f7_wmachine' : ['', Validators.required],
			'f7_mixer' : ['', Validators.required],
			'f7_stove' : ['', Validators.required],
			'f7_bicycle' : ['', Validators.required],
			'f7_ccylinder' : ['', Validators.required],
			'f7_fans' : ['', Validators.required],
			'f7_motorcycle' : ['', Validators.required],
			'f7_car' : ['', Validators.required],
		});
	}

	ionViewDidEnter() {
		console.log('ionViewDidLoad KycAppliancesPage');

		this.exist = false;
        this.fm_id = this.navParams.get('farmer_id');

        this.sql.query('SELECT * FROM tbl_appliances_details WHERE fm_id = ? limit 1', [this.fm_id]).then( (data) => {

            if (data.res.rows.length > 0) {

                let sqlData = data.res.rows.item(0);
                let formData = [];

				formData['f7_television']   = sqlData.f7_television;
				formData['f7_refrigerator'] = sqlData.f7_refrigerator;
				formData['f7_wmachine']     = sqlData.f7_wmachine;
				formData['f7_mixer']        = sqlData.f7_mixer;
				formData['f7_stove']        = sqlData.f7_stove;
				formData['f7_bicycle']      = sqlData.f7_bicycle;
				formData['f7_ccylinder']    = sqlData.f7_ccylinder;
				formData['f7_fans']         = sqlData.f7_fans;
				formData['f7_motorcycle']   = sqlData.f7_motorcycle;
				formData['f7_car']          = sqlData.f7_car;

                this.appliances.setValue(formData);
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
		if (this.appliances.valid) {
			console.log(this.appliances.value);

			let date = new Date();
            let dateNow = date.getTime()/1000|0;

            if (this.exist) {
                this.sql.query('UPDATE tbl_appliances_details SET f7_television = ?, f7_refrigerator = ?, f7_wmachine = ?, f7_mixer = ?, f7_stove = ?, f7_bicycle = ?, f7_ccylinder = ?, f7_fans = ?, f7_motorcycle = ?, f7_car = ?, f6_modified_date = ? WHERE fm_id = ?', [

                    this.appliances.value.f7_television || '',
                    this.appliances.value.f7_refrigerator || '',
                    this.appliances.value.f7_wmachine || '',
                    this.appliances.value.f7_mixer || '',
                    this.appliances.value.f7_stove || '',
                    this.appliances.value.f7_bicycle || '',
                    this.appliances.value.f7_ccylinder || '',
                    this.appliances.value.f7_fans || '',
                    this.appliances.value.f7_motorcycle || '',
                    this.appliances.value.f7_car || '',

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
                this.sql.query('INSERT INTO tbl_appliances_details(fm_id, f7_television, f7_refrigerator, f7_wmachine, f7_mixer, f7_stove, f7_bicycle, f7_ccylinder, f7_fans, f7_motorcycle, f7_car, f7_created_date, f7_modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [

                    this.fm_id,
                    this.appliances.value.f7_television || '',
                    this.appliances.value.f7_refrigerator || '',
                    this.appliances.value.f7_wmachine || '',
                    this.appliances.value.f7_mixer || '',
                    this.appliances.value.f7_stove || '',
                    this.appliances.value.f7_bicycle || '',
                    this.appliances.value.f7_ccylinder || '',
                    this.appliances.value.f7_fans || '',
                    this.appliances.value.f7_motorcycle || '',
                    this.appliances.value.f7_car || '',
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
			console.log('Validation error');
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
