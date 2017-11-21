import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController, ToastController, Platform, AlertController } from 'ionic-angular';
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
					public alertCtrl: AlertController,
					private loadingCtrl: LoadingController,
					public toastCtrl: ToastController) {
			// this.initializeItems();
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
						this.items.push(data.res.rows.item(i));
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
}
