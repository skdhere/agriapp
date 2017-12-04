import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import { Sql } from '../../providers/sql/sql';

interface point<T> {
    [K: string]: T;
}

@IonicPage()
@Component({
  selector: 'page-forms',
  templateUrl: 'forms.html'
})


export class Forms {

	current_farmer: any;
	form_name: string;
	points: point<string>;
	forms:Array<any>;
	rootNavCtrl: NavController;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				private sql: Sql,
				public loadingCtrl: LoadingController){

		this.current_farmer = navParams.get('farmer');
		this.form_name = navParams.get('form_name');
		this.rootNavCtrl = navParams.get('rootNavCtrl');
		
		this.getFarmerPoints(this.current_farmer.id);
		// let loading = this.presentLoading('Please wait...');
		// loading.present();
		// setTimeout(() => {
		//     loading.dismiss();
		// }, 1000);
	}

	getFarmerPoints(id: string){
		//some http work here
		this.points = {
			'item1' : '10',
			'item2' : '20',
			'item3' : '30',
			'item4' : '40',
			'item5' : '50',
		};

		if(this.form_name == 'kyc'){
			this.forms = [
				{ title: 'Applicant\'s Personal Details',   isUpdated:false, tableName: 'tbl_personal_detail', pageName: 'PersonalDetailsPage', point: '0', icon : 'person'},
				{ title: 'Residence Status & Details',      isUpdated:false, tableName: 'tbl_residence_details', pageName: 'ResidenceDetailsPage', point: '0', icon : 'locate'},
				{ title: 'Applicant\'s Knowledge',     		isUpdated:false, tableName: 'tbl_applicant_knowledge', pageName: 'KycKnowledgePage', point: '0', icon : 'book'},
				{ title: 'Applicant\'s Phone Details', 		isUpdated:false, tableName: 'tbl_applicant_phone', pageName: 'KycPhonePage', point: '0', icon : 'phone-portrait'},
				{ title: 'Spouse Details',             		isUpdated:false, tableName: 'tbl_spouse_details', pageName: 'KycSpousePage', point: '0', icon : 'woman'},
				{ title: 'Spouse\'s Knowledge',             isUpdated:false, tableName: 'tbl_spouse_knowledge', pageName: 'SpouseKnowledgePage', point: '0', icon : 'book'},
				{ title: 'Family Details',             		isUpdated:false, tableName: 'tbl_family_details', pageName: 'KycFamilyPage', point: '0', icon : 'people'},
				{ title: 'Appliances Motors',          		isUpdated:false, tableName: 'tbl_appliances_details', pageName: 'KycAppliancesPage', point: '0', icon : 'cog'},
			];
		}
		else if(this.form_name == 'land details'){
			this.forms = [
				{ title: 'Farm Land Details',  isUpdated:false, tableName: 'tbl_land_details', pageName: 'LandFarmPage', point: '0', icon : 'locate'},
			];
		}
		else if(this.form_name == 'crop details'){
			this.forms = [
				{ title: 'Crop And Cultivation Details',  isUpdated:false, tableName: '', pageName: 'CropCultivationPage', point: '0', icon : 'leaf'},
				{ title: 'Previous Crop Cycle Details',   isUpdated:false, tableName: '', pageName: 'CropPreviousPage', point: '0', icon : 'leaf'},
			];
		}
		else if(this.form_name == 'assets'){
			this.forms = [
				{ title: 'Assets Details',  isUpdated:false, tableName: '', pageName: 'AssetsDetailsPage', point: '0', icon : 'arrow-round-forward'},
				{ title: 'Live Stock',      isUpdated:false, tableName: '', pageName: 'AssetsStockPage',   point: '0', icon : 'arrow-round-forward'},
			];
		}
		else if(this.form_name == 'loan and liability'){
			this.forms = [
				{ title: 'Financial Details',     isUpdated:false, tableName: '', pageName: '', point: '0', icon : 'cash'},
			];
		}
		else if(this.form_name == 'Documents'){
			this.forms = [];
		}
	}

	ionViewDidEnter(){
		//check if its updated in local database
		for (var i = 0; i < this.forms.length; i++) {
			if(this.forms[i].tableName){
				// console.log(this.forms[i].tableName);
				this.updateStatus(i);
			}
		}
	}

	updateStatus(index){
		this.sql.query('SELECT fm_id FROM ' + this.forms[index].tableName + ' WHERE fm_id = ? LIMIT 1', [this.current_farmer.local_id]).then(data => {
			if (data.res.rows.length > 0) {
				this.forms[index].isUpdated = true;
			}
			else{
				this.forms[index].isUpdated = false;
			}
		},
		err => {
			console.log(err);
		});
	}

	presentLoading(text: string) {
	  let loading = this.loadingCtrl.create({
	    content: text
	  });

	  return loading;
	}

	onTap(page: string){
		let that = this;
		if (page) {
			let myCallback = function(param){
				if(param){
					that.ionViewDidEnter();
				}
			};

			this.rootNavCtrl.push(page, { 
				farmer_id: this.current_farmer.local_id,
				callback: myCallback
			});
		}
	}
}
