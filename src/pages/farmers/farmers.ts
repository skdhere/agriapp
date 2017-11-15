import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController, ToastController } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';

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

		constructor(public navCtrl: NavController, 
					public navParams: NavParams, 
					private api: Api, 
					private loadingCtrl: LoadingController,
					public toastCtrl: ToastController) {
			this.initializeItems();
		}

		initializeItems(){
			this.loading = this.loadingCtrl.create({
			    content: 'Loading data...'
			});
			this.loading.present();

			this.items = [];
			this.doInfinite();
		}

		doInfinite(infiniteScroll?) {
			this.api.get('farmers', { limit : this.limit, offset : this.offset })
			.map(res => res.json())
			.subscribe( data => {
				console.log(data);
				if(data.success){
					for(let item in data.data){
						this.items.push(data.data[item]);
					}
					infiniteScroll ? infiniteScroll.complete() : {};
				}
				if(data.data.length === 0){
					infiniteScroll ? infiniteScroll.enable(false) : {};
				}
				this.loading ? this.loading.dismiss() : {};
			},
			err => {
				console.log(err);
				infiniteScroll ? infiniteScroll.complete() : {};
				this.loading ? this.loading.dismiss() : {};
				this.showMessage("Something went wrong! make sure internet connection is on, please retry to load Farmers.", 'toast-danger', true);
				this.retryButton = true;
			});

			this.offset += this.limit;
			console.log("offset: ", this.offset);
		}

		onRetryClick(){
			this.offset = 0;
			this.retryButton = false;
			this.initializeItems();
		}

		getItems(ev: any) {
				// Reset items back to all of the items
				this.initializeItems();

				// set val to the value of the searchbar
				let val = ev.target.value;

				// if the value is an empty string don't filter the items
				// val = val.trim();
				if (val && val.trim() != '') {
						this.items = this.items.filter((item) => {
								return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1) || (item.address.toLowerCase().indexOf(val.toLowerCase()) > -1);
						})
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
		  //   if(retry){
		  //   	toast.onDidDismiss(() => {
				//     console.log('Retry');
				//     this.initializeItems();
				// });
		  //   }
		    toast.present();
		}

		itemTapped(event, farmer) {
			console.log(farmer);
				this.navCtrl.push('Farmerdetail', {
						farmer: farmer
				});
		}

		goto(page: string){
				this.navCtrl.push(page);
		}
}
