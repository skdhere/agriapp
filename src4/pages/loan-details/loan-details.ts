import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Sql } from '../../providers/sql/sql';

/**
* Generated class for the LoanDetailsPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
	selector: 'page-loan-details',
	templateUrl: 'loan-details.html',
})
export class LoanDetailsPage {

	fm_id : any;
	loans : Array<any> = [];

	constructor(public navCtrl: NavController, 
                public sql: Sql,
				public alertCtrl: AlertController,
				public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoanDetailsPage');
		this.loans = [];
		this.fm_id = this.navParams.get('farmer_id');
        this.sql.query('SELECT * FROM tbl_loan_details WHERE fm_id = ? ORDER BY f15_modified_date DESC', [this.fm_id]).then( (data) => {

            if (data.res.rows.length > 0) {
            	this.loans = [];

                for (var i = 0; i < data.res.rows.length; i++) {
                	this.loans.push(data.res.rows.item(i));
                }

				console.log(this.loans);
            }
            else{
            	this.loans = [];
            }

        }, err => {
            console.log(err);
        });
	}


	itemTapped(event, loan){
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

		this.navCtrl.push('LoanDetailsAddPage', {
			farmer_id : this.fm_id,
			local_id : loan.local_id,
			callback: myCallbackFunction
		});
	}

	deleteItem(loan){
		let alert = this.alertCtrl.create({
            title: 'Delete',
            subTitle: 'This action cant\'t be undo!',
            message: 'Do you really want to delete "' + loan.loan_type + '"?',
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
					this.sql.query("Delete from tbl_loan_details where local_id = ?" , [loan.local_id]).then(data => {
						if(data.res.rowsAffected > 0){

							let index = this.loans.indexOf(loan);
							let server_id = loan.server_id != undefined ? loan.server_id : '';

							if(index !== -1){
								this.loans.splice(index, 1);
								//if its sent to server then add server_id to delete queu
			                	if (server_id != '' && server_id !== null) {
			                		this.sql.addToDelete("tbl_loan_details", server_id);
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

		this.navCtrl.push('LoanDetailsAddPage', {
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
