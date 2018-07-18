import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Api } from '../../providers/api/api';

/**
* Generated class for the ReportsPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
	selector: 'page-reports',
	templateUrl: 'reports.html',
})
export class ReportsPage {

	loading: any;
	MyAlert: any;
	items: any;
	sdate: any = '';
	edate: any = '';

	constructor(public navCtrl: NavController,
				private loadingCtrl: LoadingController,
				private api: Api,
				public alertCtrl: AlertController,
				public navParams: NavParams) {
	}

	ionViewDidEnter() {
		this.loading = this.loadingCtrl.create({
			dismissOnPageChange: true,
			content : 'Loading Reports...'
		});
		this.loading.present().then(() => {
			this.loadReport();
		});
	}

	onDateChange(){
		console.log(this.sdate, this.edate);
		if(this.sdate != '' && this.edate != ''){
			console.log('called');
			let date1 = new Date(this.sdate);
			let date2 = new Date(this.edate);

			if(date1.getTime() > date2.getTime()){
				let alt = this.alertCtrl.create({
					subTitle: 'Start date cannot be greater than End date.',
					buttons:[{ text: 'ok'}]
				});
				alt.present();
			}else{
				this.ionViewDidEnter();
			}
		}
	}

	loadReport(){
		this.api.post("getReport", {startDate: this.sdate, endDate: this.edate})
        .map((res) => res.json())
        .subscribe(success =>{

            if(success.success){
        		this.items = success.data;
	        	this.loading ? this.loading.dismiss() : {};
	        	console.log(success);
            }
            else{
	        	console.log(success);
	        	this.loading ? this.loading.dismiss() : {};
        		this.showMessage('Failed!', 'An error has occurred please try again.', 'Retry');
            }

        }, err => {
        	console.log(err);
        	this.loading ? this.loading.dismiss() : {};
        	this.showMessage('Failed!', 'Something went wrong while loading Reports, make sure the Internet connection is on and retry again!', 'Retry');
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
                	this.ionViewDidEnter();
                }
            }
            ],
            enableBackdropDismiss: false
        });
        this.MyAlert.present();
	}
}
