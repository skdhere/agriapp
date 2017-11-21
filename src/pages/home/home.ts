import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';
import { Sql } from '../../providers/sql/sql';

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

 	constructor(private menu: MenuController, 
 				public navCtrl: NavController,
 				private sql: Sql,
 				public currentUser: UserProvider) {

 		this.menu.enable(true);
 		console.log(currentUser);
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
 }
