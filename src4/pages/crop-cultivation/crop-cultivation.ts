import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Sql } from '../../providers/sql/sql';

/**
 * Generated class for the CropCultivationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crop-cultivation',
  templateUrl: 'crop-cultivation.html',
})
export class CropCultivationPage {

	fm_id : any;
	crops : Array<any> = [];

	constructor(public navCtrl: NavController, 
                public sql: Sql,
				public alertCtrl: AlertController,
				public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CropPreviousPage');
		this.crops = [];
		this.fm_id = this.navParams.get('farmer_id');
        this.sql.query('SELECT * FROM tbl_cultivation_data WHERE fm_id = ? ORDER BY f10_modified_date DESC', [this.fm_id]).then( (data) => {

            if (data.res.rows.length > 0) {
            	this.crops = [];

                for (var i = 0; i < data.res.rows.length; i++) {
                	let item = data.res.rows.item(i);
                	item.crop_name = this.getCropName(item.f10_cultivating);
                	item.land_name = this.getLandName(item.f10_land);
                	item.variety_name = this.getVarietyName(item.f10_crop_variety);
                	this.crops.push(item);
                }

				console.log(this.crops);
            }
            else{
            	this.crops = [];
            }

        }, err => {
            console.log(err);
        });
	}


	itemTapped(event, crop){
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

		this.navCtrl.push('CropCultivationAddPage', {
			farmer_id : this.fm_id,
			local_id : crop.local_id,
			callback: myCallbackFunction
		});
	}

	deleteItem(crop){
		let alert = this.alertCtrl.create({
            title: 'Delete',
            subTitle: 'This action cant\'t be undo!',
            message: 'Do you really want to delete "' + crop.f10_cultivating + '"?',
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
					this.sql.query("Delete from tbl_cultivation_data where local_id = ?" , [crop.local_id]).then(data => {
						if(data.res.rowsAffected > 0){

							let index = this.crops.indexOf(crop);
							let server_id = crop.server_id != undefined ? crop.server_id : '';

							if(index !== -1){
								this.crops.splice(index, 1);
								//if its sent to server then add server_id to delete queu
			                	if (server_id != '' && server_id !== null) {
			                		this.sql.addToDelete("tbl_cultivation_data", server_id);
			                	}
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

		this.navCtrl.push('CropCultivationAddPage', {
			farmer_id : this.fm_id,
			callback: myCallbackFunction
		});
	}

	async getLandName(id){
		return await this.sql.query('SELECT * FROM tbl_land_details WHERE local_id = ?',[id]).then(data => {
			if(data.res.rows.length > 0){
				let unit = data.res.rows.item(0).f9_land_unit == 0 ? 'Acres' : (data.res.rows.item(0).f9_land_unit == 1 ? 'Gunthas' : 'Hectares');
				return  unit + " - " + data.res.rows.item(0).f9_name;
			}else{
				return 'None';
			}
		});
	}

	async getCropName(id){
		return await this.sql.query('select * from tbl_crops where id = ?',[id]).then(data => {
			if(data.res.rows.length > 0){
				return data.res.rows.item(0).name;
			}else{
				return 'None';
			}
		});
	}

	async getVarietyName(id){
		return await this.sql.query('select * from tbl_varieties where id = ?',[id]).then(data => {
			if(data.res.rows.length > 0){
				return data.res.rows.item(0).name;
			}else{
				return 'None';
			}
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
