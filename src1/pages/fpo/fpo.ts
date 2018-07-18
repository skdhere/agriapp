import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController, ToastController, Platform, AlertController, Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Api } from '../../providers/api/api';
import { Sql } from '../../providers/sql/sql';
import { UserProvider } from '../../providers/user/user';


@IonicPage()
@Component({
  selector: 'page-fpo',
  templateUrl: 'fpo.html',
})
export class FpoPage {
	items: Array<any>         = [];
	limit: number             = 15;
	offset: number            = 0;
	retryButton: boolean      = false;
	loading: any;
	query: string;
	infinit_complete: boolean = false;
	MyAlert: any;
	last_selected: any;

  constructor(  public navCtrl: NavController, 
			    public navParams: NavParams, 
			    private api: Api,
			    public currentUser: UserProvider,
			    public platform: Platform,
				private sql: Sql,
				public events: Events,
				public alertCtrl: AlertController,
				private loadingCtrl: LoadingController,
				public user:UserProvider,
				public zone: NgZone,
				public toastCtrl: ToastController){
	}

  
    goto(page: string){
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

		this.navCtrl.push(page, {
		    callback: myCallbackFunction
		});
    }

    ionViewDidLoad() {
    	setTimeout(() => {
	    	this.initializeItems();
	    }, 100);
    }

    initializeItems(){
		this.items = [];
		this.limit = 10;
		this.offset = 0;
		this.infinit_complete = false;
		this.loading = this.loadingCtrl.create({
			dismissOnPageChange: true,
			content : 'Loading FPOs'
		});

		this.loading.present().then(() => {
			this.doInfinite();
		});
	}

	doInfinite(infiniteScroll?) {
		
		this.api.post("get_fpo", {offset: this.offset, limit: this.limit})
        .map((res) => res.json())
        .subscribe(success =>{

            if(success.success){
            	for (var i = 0; i < success.data.length; i++) {
            		this.items.push(success.data[i]);
            	}

            	infiniteScroll ? infiniteScroll.complete() : {};
				if(success.data.length < this.limit){
					this.infinit_complete = true;
				}

		        this.offset += this.limit;
				console.log("offset: ", this.offset);

	        	this.loading ? this.loading.dismiss() : {};
            }
            else{
	        	console.log(success);
	        	this.loading ? this.loading.dismiss() : {};
        		this.showMessage('Failed!', 'An error has occurred please try again.', 'Retry');
            }

        }, err => {
        	console.log(err);
        	this.loading ? this.loading.dismiss() : {};
        	this.showMessage('Failed!', 'Something went wrong while loading fpos, make sure the Internet connection is on and retry again!', 'Retry');
        });

	}

	showMessage(title, message, btnTxt){
		this.MyAlert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                    this.navCtrl.setRoot('HomePage');
                }
            },
            {
                text: btnTxt,
                handler: () => {
                	this.initializeItems();
                }
            }
            ],
            enableBackdropDismiss: false
        });
        this.MyAlert.present();
	}

	itemTapped(event, row_num) {
		this.last_selected = row_num;
		let fpo = this.items[row_num];

		let _that = this;
		let myCallbackFunction = function(_params) {
			return new Promise((resolve, reject) => {
				console.log(_params);
				if(_params){
					console.log('callback handler', _params);
					_that.zone.run(() => {
						_that.items[_that.last_selected] = _params;
					});
				}
				resolve();
			});
		}

		console.log(fpo);
		this.navCtrl.push('AddFpoPage', {
			fpo: fpo,
			callback: myCallbackFunction
		});
	}


	deleteItem(row_num){
		let fpo = this.items[row_num];

		let alert = this.alertCtrl.create({
            title: 'Delete',
            subTitle: 'This action cant\'t be undo!',
            message: 'Do you really want to delete "' + fpo.fpo_name + '" from your fpo list?',
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
                	this.loading = this.loadingCtrl.create({ dismissOnPageChange : true });
                	this.loading.present().then(() => {
	                	this.api.post("delete_fpo", {id: fpo['id']})
				        .map((res) => res.json())
				        .subscribe(success =>{

				            if(success.success){

				            	this.items.splice(row_num, 1);
					        	this.loading ? this.loading.dismiss() : {};
				            }
				            else{
					        	console.log(success);
					        	this.loading ? this.loading.dismiss() : {};
				        		this.showMessage('Failed!', 'An error has occurred please try again.', 'Retry');
				            }

				        }, err => {
				        	console.log(err);
				        	this.loading ? this.loading.dismiss() : {};
				        	this.showMessage('Failed!', 'Something went wrong while loading fpos, make sure the Internet connection is on and retry again!', 'Retry');
				        });
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
}
