import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController, ToastController, Platform, AlertController, Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Api } from '../../providers/api/api';
import { Sql } from '../../providers/sql/sql';
import { UserProvider } from '../../providers/user/user';

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
	errors:any = [];
	ca_id: any = "";
	load:any;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				private api: Api,
				public currentUser: UserProvider,
				public platform: Platform,
				private sql: Sql,
				public events: Events,
				public alertCtrl: AlertController,
				private loadingCtrl: LoadingController,
				public toastCtrl: ToastController) {

		//get ca_id
		this.ca_id = this.currentUser.id;
		// this.initializeItems();
		this.events.subscribe('farmer:updateToServer', () => {
			this.ionViewDidEnter();
		});
	}

	ionViewDidEnter(){
		for (let i = 0; i < this.items.length; i++) {
			this.isUpdated(i);
			this.isUploaded(i);
			this.hasAnyError(i);
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

		this.query = 'SELECT *, (fm_fname || \' \' || fm_mname || \' \' || fm_lname) as fm_name FROM tbl_farmers WHERE fm_caid = ? ORDER BY fm_modifieddt DESC LIMIT ?,?';
		this.doInfinite();
	}

	doInfinite(infiniteScroll?) {

		this.sql.query(this.query, [this.ca_id, this.offset, this.limit]).then(data => {
			console.log(data);
            if (data.res.rows.length > 0) {
                for(let i=0; i<data.res.rows.length; i++){

                	let item = data.res.rows.item(i);
                	item.update = false;

                	let idd = this.items.push(item) - 1;
                	this.isUpdated(idd);
                	setTimeout(() => {
	                	this.isUploaded(idd);
	                	this.hasAnyError(idd);
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
		console.log(farmer);
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
                	//crawl each table and send if local_upload is 0
                    this.sql.query("SELECT name FROM sqlite_master WHERE type='table'").then( (data) => {
                        // console.log(data);
                        if (data.res.rows.length > 0) {
                            for (let i = 0; i < data.res.rows.length; i++) {
                                let table = data.res.rows.item(i);
                                if(table.name == 'tbl_personal_detail'
									|| table.name == 'tbl_residence_details'
									|| table.name == 'tbl_applicant_knowledge'
									|| table.name == 'tbl_spouse_knowledge'
									|| table.name == 'tbl_applicant_phone'
									|| table.name == 'tbl_family_details'
									|| table.name == 'tbl_appliances_details'
									|| table.name == 'tbl_spouse_details'
									|| table.name == 'tbl_land_details'
									|| table.name == 'tbl_asset_details'
									|| table.name == 'tbl_livestock_details'
									|| table.name == 'tbl_cultivation_data'
									|| table.name == 'tbl_yield_details'
									|| table.name == 'tbl_financial_details'
									|| table.name == 'tbl_loan_details' 
                                ){
                                    
									this.sql.query( "Delete from "+table.name+" where fm_id = ?;", [local_id])
									.catch(err => { console.log(err) });
                                }
                            }

                            this.sql.query( "SELECT * from tbl_farmers where local_id = ?;", [local_id])
							.then(d => {
								if(d.res.rows.length > 0){
									let final_farmer = d.res.rows.item(0);

		                            this.sql.query( "Delete from tbl_farmers where local_id = ?;", [local_id])
									.then(data => {
										
			                            let index = this.items.indexOf(farmer);
			                            
										console.log(final_farmer);
										let server_id = final_farmer.fm_id;
										if(index !== -1){
											this.items.splice(index, 1);
											//if its sent to server then add server_id to delete queu
						                	if (server_id != '' && server_id !== null) {
						                		this.sql.addToDelete("tbl_farmers", server_id);
						                	}
										}
										
									},err => { console.log(err) });
								}

							},err => { console.log(err) });

							
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
			this.query = 'SELECT *, (fm_fname || \' \' || fm_mname || \' \' || fm_lname) as fm_name FROM tbl_farmers WHERE fm_caid = ? and (fm_mobileno LIKE \'%'+ val +'%\' OR fm_name LIKE \'%'+ val +'%\')';
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
				for (let j = 0; j < d.res.rows.length; j++) {
					let row = d.res.rows.item(j);
					for (let i = 0; i < 16; i++) {
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

	async hasAnyError(len){
		let item = this.items[len];
		await this.sql.query("SELECT * FROM tbl_errors WHERE local_id = ?", [item.local_id])
		.then(d => {
			// console.log("errors", d);
			if(d.res.rows.length > 0){
				this.items[len].hasErrors = true;
				this.errors[item.local_id] = [];
				for (let i = 0; i < d.res.rows.length; i++) {
					this.errors[item.local_id].push(d.res.rows.item(i));
				}
			}else{
				this.items[len].hasErrors = false;
			}
		});
	}


	// loadOnlineFarmers(){

	// 	this.load = this.loadingCtrl.create();
	// 	this.load.present();

	// 	this.sql.query('select fm_id from tbl_farmers where fm_id != \'\'').then(local_data => {
	// 		let fm_ids = [];
	// 		if(local_data.res.rows.length > 0){
	// 			for (let i = 0; i < local_data.res.rows.length; i++) {
	// 				let item = local_data.res.rows.item(i);
	// 				if(item.fm_id != ''){
	// 					fm_ids.push(item.fm_id);
	// 				}
	// 			}
	// 		}
	// 		console.log(fm_ids);
	// 		let data = { fm_ids : fm_ids, total: ''};

	// 		this.api.post('fm_data', data)
	//         .map((res) => res.json())
	//         .subscribe(success => {
	//         	console.log(success);
	//         	if(success.success){
	//         		for (let j = 0; j < success.data.length; j++) {
	//         			let farmer = success.data[j];
	//         			console.log('1', farmer);
	//         			for (let k = 0; k < farmer.values.length; k++) {
	//         				console.log('2', farmer.values[k]);

	//         				if(k == farmer.values.length -1){
	// 	        				this.cloneData(farmer.fm_id, farmer.values[k], true);
	//         				}else{
	// 	        				this.cloneData(farmer.fm_id, farmer.values[k]);
	//         				}
	//         			}
	//         		}
	//         	}
	//         	else{
	//         		this.load.dismiss();
	//         	}
	//         }, err => {
	//         	console.log(err);
	//         	this.load.dismiss();
	//         });
	// 	});
	// }

	// async cloneData(fm_id, val, isLast?){

	// 	console.log('3', val);
	// 	let tablename = val['tablename'];

	// 	if(tablename != ''){
	// 		console.log('tablename', tablename);

	// 		await this.sql.query("SELECT sql FROM sqlite_master WHERE tbl_name = ? AND type = 'table'", [tablename]).then(data => {
	// 			console.log('under query', tablename);

	// 			let columns = this.getColArray(data.res.rows.item(0).sql);
	// 		    let query = 'Insert into ' + tablename;
	// 		    query += '(' + columns.toString() + ') values(';
	// 		    for (let i = 0; i < columns.length; i++) {
	// 		    	query += '?,';
	// 		    }
	// 		    query = query.substring(0,query.length - 1);
	// 		    query += ')';

	// 			console.log('rows', val.rows);

	// 		    for (let m = 0; m < val.rows.length; m++) {
	// 				console.log('4', val.rows[m]);

	// 			    let serverRow = val.rows[m];
	// 			    let final_data:any = {};
	// 			    for (let i = 0; i < columns.length; i++) {
	// 			    	final_data[columns[i]] = serverRow[columns[i]] || '';
	// 			    }

	// 			    if(tablename != 'tbl_farmers'){
	// 			    	console.log('4.5', tablename);
	// 				    this.sql.query('Select local_id from tbl_farmers where fm_id = ? ', [fm_id]).then(d => {
	// 			    		console.log('4.7', fm_id);

	// 				    	if(d.res.rows.length > 0){
	// 				    		let item = d.res.rows.item(0);
	// 					    	final_data['fm_id'] = item['local_id'];
	// 					    	delete final_data['id'];

	// 					    	let dumFinal = [];
	// 					    	for (let key in final_data) {
	// 					    		dumFinal.push(final_data[key]);
	// 					    	}

	// 					    	console.log('5', dumFinal, query);
	// 						    this.sql.query(query, dumFinal).then(dat => {}, err => {console.log(err)});
	// 				    	}

	// 				    }, err => {
	// 				    	console.log(err);
	// 				    });
				    	
	// 			    }else{
	// 			    	delete final_data['id'];

	// 			    	let dumFinal = [];
	// 			    	for (let key in final_data) {
	// 			    		dumFinal.push(final_data[key]);
	// 			    	}
				    	
	// 			    	console.log('5', dumFinal, query);
	// 				    this.sql.query(query, dumFinal).then(dat => { console.log('success inserted farmer',dat) }, err => {console.log(err)});
	// 			    }

	// 			    if(isLast){
	// 			    	if(this.load){
	// 			    		this.load.dismiss()
	// 			    	}
	// 			    }

	// 		    }

	// 		});
	// 	}
	// }

	// getColArray(sql){
	//     sql = sql + '';
	//  	let columns = sql.split('(');
	//  	columns = columns[1].split(')')[0];
	//  	columns = columns.split(',');

	//  	let colarray = [];
	//  	for (let i = 0; i < columns.length; i++) {
	//  		let a = columns[i].trim().split(' ');

	//  		colarray.push(a[0]);
	//  	}
	//     return colarray;		
	// }
}
