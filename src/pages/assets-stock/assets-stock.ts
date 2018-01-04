import { Component, Input} from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';

/**
 * Generated class for the AssetsStockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-assets-stock',
  templateUrl: 'assets-stock.html',
})
export class AssetsStockPage {

	assets: FormGroup;
	numbers: Array<number> = Array(11).fill(0).map((x,i)=>i);
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
			//'f13_points' : ['0'],

			'f13_dairy_cattle' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_draft_cattle' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_buffalo' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_ox' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_sheep' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_goat' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_pig' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_poultry' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_donkeys' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
		});
	}

	ionViewDidEnter() {
		console.log('ionViewDidLoad AssetsDetailsPage');
		//Fetch value from sqlite and update form data 
		this.exist = false;
        this.fm_id = this.navParams.get('farmer_id');
		
		this.sql.query('SELECT * FROM tbl_livestock_details WHERE fm_id = ? limit 1', [this.fm_id]).then( (data) => {

            if (data.res.rows.length > 0) {

                let sqlData = data.res.rows.item(0);
                let formData = [];

				formData['f13_dairy_cattle'] = sqlData.f13_dairy_cattle;
				formData['f13_draft_cattle'] = sqlData.f13_draft_cattle;
				formData['f13_buffalo']      = sqlData.f13_buffalo;
				formData['f13_ox']           = sqlData.f13_ox;
				formData['f13_sheep']        = sqlData.f13_sheep;
				formData['f13_goat']         = sqlData.f13_goat;
				formData['f13_pig']          = sqlData.f13_pig;
				formData['f13_poultry']      = sqlData.f13_poultry;
				formData['f13_donkeys']      = sqlData.f13_donkeys;
				

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
                this.sql.query('UPDATE tbl_livestock_details SET f13_dairy_cattle = ?, f13_draft_cattle = ?, f13_buffalo = ?, f13_ox = ?, f13_sheep = ?, f13_goat = ?, f13_pig = ?, f13_poultry = ?, f13_donkeys = ?,   f13_modified_date = ? WHERE fm_id = ?', [

                    this.assets.value.f13_dairy_cattle,
                    this.assets.value.f13_draft_cattle,
                    this.assets.value.f13_buffalo,
                    this.assets.value.f13_ox,
                    this.assets.value.f13_sheep,
                    this.assets.value.f13_goat,
                    this.assets.value.f13_pig, 
                    this.assets.value.f13_poultry, 
                    this.assets.value.f13_donkeys,
                    
                    dateNow,
                    this.fm_id
                ]).then(data => {
                    this.sql.updateUploadStatus('tbl_livestock_details', this.fm_id, '0');
                    this.navCtrl.pop();
                },
                err => {
                    console.log(err);
                });               
            }
            else{
                this.sql.query('INSERT INTO tbl_livestock_details(fm_id, f13_dairy_cattle, f13_draft_cattle, f13_buffalo, f13_ox, f13_sheep, f13_goat, f13_pig, f13_poultry, f13_donkeys, f13_created_date, f13_modified_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [

                    this.fm_id,
                    this.assets.value.f13_dairy_cattle,
                    this.assets.value.f13_draft_cattle,
                    this.assets.value.f13_buffalo,
                    this.assets.value.f13_ox,
                    this.assets.value.f13_sheep,
                    this.assets.value.f13_goat,
                    this.assets.value.f13_pig, 
                    this.assets.value.f13_poultry, 
                    this.assets.value.f13_donkeys,
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
		else
		{
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
