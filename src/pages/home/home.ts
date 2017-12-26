import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Platform } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';
import { Sql } from '../../providers/sql/sql';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { File } from '@ionic-native/file';
import { Api } from '../../providers/api/api';
import { Http, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-home',
 	templateUrl: 'home.html',
 })
 export class HomePage {

 	totalFarmers: any = 0;
 	totalUploaded: any = 0;
 	isApp: boolean = false;
 	constructor(private menu: MenuController, 
 				public navCtrl: NavController,
                public  platform: Platform, 
 				private sql: Sql,
 				private sqlitePorter: SQLitePorter,
 				private file: File,
 				private api: Api,
 				public http: Http,
 				private loadingCtrl: LoadingController, 
				public toastCtrl: ToastController,
 				public currentUser: UserProvider) {

 		this.menu.enable(true);
 		console.log(currentUser);

 		platform.ready().then(() => {
 			if(this.platform.is('core') || this.platform.is('mobileweb') ){
 				this.isApp = false;
 			}else{
 				this.isApp = true;
 			}
 		});
 	}

 	ionViewDidEnter() {
 		this.sql.query('SELECT count(*) as total FROM tbl_farmers').then(data => {
 			console.log(data);
 			if(data.res.rows.length > 0){
 				this.totalFarmers = data.res.rows.item(0).total;
 			}
 		},
 		err => {
 			console.log(err);
 		});

 		this.sql.query('SELECT count(*) as total FROM tbl_farmers WHERE local_upload = 1').then(data => {
 			console.log(data);
 			if(data.res.rows.length > 0){
 				this.totalUploaded = data.res.rows.item(0).total;
 			}
 		},
 		err => {
 			console.log(err);
 		});
 	}

 	goto(page){
 		if(page == 'FarmersPage'){
	 		this.navCtrl.setRoot(page);
 		}
 		else{
	 		this.navCtrl.push(page);
 		}
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

 	upload(){
 		if (this.isApp) {
	 		const win: any = window;
	 		var db = win.sqlitePlugin.openDatabase({
	            name: '__agribridgeDb',
	            location: 2,
	            createFromLocation: 0
	        });

			let load = this.loadingCtrl.create({dismissOnPageChange: true, content: 'It will take some time!'});
			load.present();

	 		this.sqlitePorter.exportDbToSql(db).then((data)=>{

	 			let params = new URLSearchParams();
	            params.set('data', data) 
		        params.set('user_id', this.currentUser.emailId);

	 			this.http.post('http://acrefin.com/agribridge/api/getsql.php', params)
				.map(res => res.json())
				.subscribe(
					data => {
						console.log(data);
						if(data.success){
							this.showMessage("Uploaded Successfully...", "success");
				 			setTimeout( () => {
					 			load.dismiss();
				 			}, 500);
						}else{
							this.showMessage("Error While Sending Data...", "danger");
				 			setTimeout( () => {
					 			load.dismiss();
				 			}, 500);
						}
					}, err => {
						console.log(err);
						this.showMessage("Error While Sending Data...", "danger");
			 			setTimeout( () => {
				 			load.dismiss();
			 			}, 500);
				});

	 		},
	 		(err) => {
	 			console.log(err);
	 			this.showMessage("Error While Exporting...", "danger");
	 			setTimeout( () => {
		 			load.dismiss();
	 			}, 500);
	 		});
 		}
 		else{
 			this.showMessage('To upload the data open this application in device.', 'black', 10000);
 		}
 	}
 }
