import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController, ToastController, Platform, AlertController, Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Api } from '../../providers/api/api';
import { Sql } from '../../providers/sql/sql';

@IonicPage()
@Component({
		selector: 'farmers-page',
		templateUrl: 'farmers.html'
})
export class FarmersPage {
		selectedItem: any;
		icons: string[];
		items: Array<any> = [];
		limit: number = 10;
		offset: number = 0;
		retryButton: boolean = false;
		loading: any;
		query: string;
		infinit_complete: boolean = false;

		constructor(public navCtrl: NavController, 
					public navParams: NavParams, 
					private api: Api,
					public platform: Platform,
					private sql: Sql,
					public events: Events,
					public alertCtrl: AlertController,
					private loadingCtrl: LoadingController,
					public toastCtrl: ToastController) {
			// this.initializeItems();
			this.events.subscribe('farmer:updateToServer', () => {
				this.ionViewDidEnter();
			});
		}

		ionViewDidEnter(){
			for (let i = 0; i < this.items.length; i++) {
				this.isUpdated(i);
				this.isUploaded(i);
			}
		}

		ionViewDidLoad() {
			this.platform.ready().then(() => {
	        	this.initializeItems();
	        });
	    }

		initializeItems(){
			this.items = [];
			this.limit = 10;
			this.offset = 0;

			this.query = 'SELECT *, (fm_fname || \' \' || fm_mname || \' \' || fm_lname) as fm_name FROM tbl_farmers ORDER BY fm_modifieddt DESC LIMIT ?,?';
			this.doInfinite();
		}

		doInfinite(infiniteScroll?) {

			this.sql.query(this.query, [this.offset, this.limit]).then(data => {
				console.log(data);
	            if (data.res.rows.length > 0) {
	                for(let i=0; i<data.res.rows.length; i++){

	                	let item = data.res.rows.item(i);
	                	item.update = false;

	                	let idd = this.items.push(item) - 1;
	                	this.isUpdated(idd);
	                	setTimeout(() => {
		                	this.isUploaded(idd);
	                	}, 200);
					}
					infiniteScroll ? infiniteScroll.complete() : {};
					if(data.res.rows.length < 10){
						this.infinit_complete = true;
					}
	            }
	            else{
	            	if(infiniteScroll){
		            	infiniteScroll.enable(false);
		            	this.infinit_complete = true;
	            	} 
	            }
	            this.loading ? this.loading.dismiss() : {};
	        },
	        err => {
	        	console.log(err);
	        	infiniteScroll ? infiniteScroll.complete() : {};
				this.loading ? this.loading.dismiss() : {};
				this.showMessage("Something went wrong! please retry to load Farmers.", 'toast-danger', true);
				this.retryButton = true;
	        });

			this.offset += this.limit;
			console.log("offset: ", this.offset);
		}

		deleteItem(farmer){
			let alert = this.alertCtrl.create({
                title: 'Delete',
                subTitle: 'This action cant\'t be undo!',
                message: 'Do you really want to delete "' + farmer.fm_name + '" from your farmer list?',
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
						let local_id = farmer.local_id;
						this.sql.query("Delete from tbl_farmers where local_id=" + local_id , []).then(data => {
							console.log(data);
							if(data.res.rowsAffected > 0){

								let index = this.items.indexOf(farmer);
								if(index !== -1){
									this.items.splice(index, 1);
								}
							}
						});
                    }
                }]
            });
			alert.present();
		}

		onRetryClick(){
			this.offset = 0;
			this.retryButton = false;
			this.initializeItems();
		}

		//on search text box fill
		getItems(ev: any) {

			this.items = [];
			this.limit = 10;
			this.offset = 0;

			// set val to the value of the searchbar
			let val = ev.target.value;

			// if the value is an empty string don't filter the items
			// val = val.trim();
			if (val && val.trim() != '') {
				this.query = 'SELECT *, (fm_fname || \' \' || fm_mname || \' \' || fm_lname) as fm_name FROM tbl_farmers WHERE (fm_mobileno LIKE \'%'+ val +'%\' OR fm_name LIKE \'%'+ val +'%\')';
				this.query +=' ORDER BY fm_modifieddt DESC LIMIT ?,?';
				this.doInfinite();
			}
			else{
				this.initializeItems();
			}
		}

		showMessage(message, style, retry?: boolean, dur?: number){
			const toast = this.toastCtrl.create({
				message: message,
				showCloseButton: true,
				duration: dur || 0,
				closeButtonText: 'Ok',
				cssClass: style,
				dismissOnPageChange: true
		    });
		    toast.present();
		}

		itemTapped(event, farmer) {
			console.log(farmer);
			this.navCtrl.push('Farmerdetail', {
					farmer: farmer
			});
		}


		goto(page: string){
			// callback...
			let _that = this;
			let myCallbackFunction = function(_params) {
				return new Promise((resolve, reject) => {
					console.log(_params);
					if(_params){
						_that.initializeItems();
					}
					resolve();
				});
			}

			this.navCtrl.push(page, {
			    callback: myCallbackFunction
			});
		}

		async isUpdated(len){
			let item = this.items[len];
			await this.sql.query(`SELECT t0.fm_id
				FROM tbl_personal_detail AS t0 JOIN tbl_residence_details AS t1
					 ON t0.fm_id = t1.fm_id JOIN tbl_applicant_knowledge AS t2
					 ON t0.fm_id = t2.fm_id JOIN tbl_spouse_knowledge AS t3 
					 ON t0.fm_id = t3.fm_id JOIN tbl_applicant_phone AS t4 
					 ON t0.fm_id = t4.fm_id JOIN tbl_family_details AS t5 
					 ON t0.fm_id = t5.fm_id JOIN tbl_appliances_details AS t6 
					 ON t0.fm_id = t6.fm_id JOIN tbl_spouse_details AS t7 
					 ON t0.fm_id = t7.fm_id JOIN tbl_asset_details AS t8 
					 ON t0.fm_id = t8.fm_id JOIN tbl_livestock_details AS t9 
					 ON t0.fm_id = t9.fm_id JOIN tbl_financial_details AS t10
					 ON t0.fm_id = t10.fm_id JOIN tbl_land_details AS t11
					 ON t0.fm_id = t11.fm_id JOIN tbl_cultivation_data AS t12
					 ON t0.fm_id = t12.fm_id JOIN tbl_yield_details AS t13
					 ON t0.fm_id = t13.fm_id JOIN tbl_loan_details AS t14
					 ON t0.fm_id = t14.fm_id 
				WHERE t0.fm_id = ?`, [item.local_id])
			.then(d => {
				if(d.res.rows.length > 0){
					this.items[len].update = true;
				}else{
					this.items[len].update = false;
				}
			});
		}

		async isUploaded(len){
			let item = this.items[len];
			await this.sql.query(`SELECT t0.local_upload AS table0, t1.local_upload AS table1, t2.local_upload AS table2, t3.local_upload AS table3, t4.local_upload AS table4, t5.local_upload AS table5, t6.local_upload AS table6, t7.local_upload AS table7, t8.local_upload AS table8, t9.local_upload AS table9, t10.local_upload AS table10, t11.local_upload AS table11, t12.local_upload AS table12, t13.local_upload AS table13, t14.local_upload AS table14, t15.local_upload AS table15

				FROM tbl_farmers AS t0 LEFT JOIN tbl_residence_details AS t1
					 ON t0.local_id = t1.fm_id LEFT JOIN tbl_applicant_knowledge AS t2
					 ON t0.local_id = t2.fm_id LEFT JOIN tbl_spouse_knowledge AS t3 
					 ON t0.local_id = t3.fm_id LEFT JOIN tbl_applicant_phone AS t4 
					 ON t0.local_id = t4.fm_id LEFT JOIN tbl_family_details AS t5 
					 ON t0.local_id = t5.fm_id LEFT JOIN tbl_appliances_details AS t6 
					 ON t0.local_id = t6.fm_id LEFT JOIN tbl_spouse_details AS t7 
					 ON t0.local_id = t7.fm_id LEFT JOIN tbl_asset_details AS t8 
					 ON t0.local_id = t8.fm_id LEFT JOIN tbl_livestock_details AS t9 
					 ON t0.local_id = t9.fm_id LEFT JOIN tbl_financial_details AS t10
					 ON t0.local_id = t10.fm_id LEFT JOIN tbl_land_details AS t11
					 ON t0.local_id = t11.fm_id LEFT JOIN tbl_cultivation_data AS t12
					 ON t0.local_id = t12.fm_id LEFT JOIN tbl_yield_details AS t13
					 ON t0.local_id = t13.fm_id LEFT JOIN tbl_loan_details AS t14
					 ON t0.local_id = t14.fm_id LEFT JOIN tbl_personal_detail AS t15
					 ON t0.local_id = t15.fm_id
				WHERE t0.local_id = ` + item.local_id)
			.then(d => {
				// console.log('Updateeee', d);
				if(d.res.rows.length > 0){
					let updated = true;
					for (var j = 0; j < d.res.rows.length; j++) {
						let row = d.res.rows.item(j);
						for (var i = 0; i < 16; i++) {
							if(row['table'+ i] == 0){
								updated = false;
							}
						}
					}

					this.items[len].local_upload = updated;
				}else{
					this.items[len].local_upload = false;
				}
			},
			err => {
				console.log(err);
			});
		}
}
