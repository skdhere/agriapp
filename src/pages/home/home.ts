import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';
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

 	constructor(private menu: MenuController, public navCtrl: NavController, public currentUser: UserProvider) {
 		this.menu.enable(true);
 		console.log(currentUser);
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad HomePage');
 	}

 }
