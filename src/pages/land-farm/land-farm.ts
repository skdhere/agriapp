import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Sql } from '../../providers/sql/sql';

/**
 * Generated class for the LandFarmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-land-farm',
  templateUrl: 'land-farm.html',
})
export class LandFarmPage {

	fm_id : any;
	lands : Array<any> = [];

	constructor(public navCtrl: NavController, 
                public sql: Sql,
				public alertCtrl: AlertController,
				public navParams: NavParams) {
  	}
	

	ionViewDidLoad() {
		console.log('ionViewDidLoad Land details list');
		this.lands = [];
		this.fm_id = this.navParams.get('farmer_id');
        this.sql.query('SELECT * FROM tbl_land_details WHERE fm_id = ? ORDER BY f9_modified_date DESC', [this.fm_id]).then( (data) => {

            if (data.res.rows.length > 0) {
            	this.lands = [];

                for (var i = 0; i < data.res.rows.length; i++) {
                	this.lands.push(data.res.rows.item(i));
                }

				console.log(this.lands);
            }
            else{
            	this.lands = [];
            }

        }, err => {
            console.log(err);
        });
	}

	itemTapped(event, land){
		// callback...
		let _that = this;
		let myCallbackFunction = function(_params) {
			return new Promise((resolve, reject) => {
				console.log(_params);
				if(_params){
					_that.ionViewDidLoad();
				}
				resolve();
			});
		}

		this.navCtrl.push('LandFarmAddPage', {
			farmer_id : this.fm_id,
			local_land_id : land.local_land_id,
			callback: myCallbackFunction
		});
	}

	deleteItem(land){
		let alert = this.alertCtrl.create({
            title: 'Delete',
            subTitle: 'This action cant\'t be undo!',
            message: 'Do you really want to delete "' + land.f9_survey_number + '"?',
            buttons: [
            {
                text: 'No',
                role: 'cancel',
                cssClass: 'app',
                handler: () => {
                }
            },
            {
                text: 'Yes',
                cssClass: 'danger',
                handler: () => {
					this.sql.query("Delete from tbl_land_details where local_land_id = ?" , [land.local_land_id]).then(data => {
						if(data.res.rowsAffected > 0){

							let index = this.lands.indexOf(land);
							if(index !== -1){
								this.lands.splice(index, 1);
							}
						}
					});
                }
            }]
        });
		alert.present();
	}

	addnew(){
		// callback...
		let _that = this;
		let myCallbackFunction = function(_params) {
			return new Promise((resolve, reject) => {
				console.log(_params);
				if(_params){
					_that.ionViewDidLoad();
				}
				resolve();
			});
		}

		this.navCtrl.push('LandFarmAddPage', {
			farmer_id : this.fm_id,
			callback: myCallbackFunction
		});
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
