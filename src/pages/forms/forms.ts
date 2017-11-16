import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';

interface point<T> {
    [K: string]: T;
}

@IonicPage()
@Component({
  selector: 'page-forms',
  templateUrl: 'forms.html'
})


export class Forms {

	current_farmer: {id:string, image:string, fm_name: string, address: string, points: string};
	form_name: string;
	points: point<string>;
	forms:Array<any>;
	rootNavCtrl: NavController;

	constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController){
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
				{ title: 'Applicant\'s Personal Details',   pageName: 'PersonalDetailsPage', point: '0', icon : 'person'},
				{ title: 'Residence Status & Details',      pageName: 'ResidenceDetailsPage', point: '0', icon : 'locate'},
				{ title: 'Applicant\'s Knowledge',     		pageName: 'KycKnowledgePage', point: '0', icon : 'book'},
				{ title: 'Applicant\'s Phone Details', 		pageName: 'KycPhonePage', point: '0', icon : 'phone-portrait'},
				{ title: 'Spouse Details',             		pageName: 'KycSpousePage', point: '0', icon : 'woman'},
				{ title: 'Spouse\'s Knowledge',             pageName: 'SpouseKnowledgePage', point: '0', icon : 'book'},
				{ title: 'Family Details',             		pageName: 'KycFamilyPage', point: '0', icon : 'people'},
				{ title: 'Appliances Motors',          		pageName: 'KycAppliancesPage', point: '0', icon : 'cog'},
			];
		}
		else if(this.form_name == 'land details'){
			this.forms = [
				{ title: 'Farm Land Details',  pageName: 'LandFarmPage', point: '0', icon : 'locate'},
			];
		}
		else if(this.form_name == 'crop details'){
			this.forms = [
				{ title: 'Crop And Cultivation Details',  pageName: 'CropCultivationPage', point: '0', icon : 'leaf'},
				{ title: 'Previous Crop Cycle Details',   pageName: 'CropPreviousPage', point: '0', icon : 'leaf'},
			];
		}
		else if(this.form_name == 'assets'){
			this.forms = [
				{ title: 'Assets Details',  pageName: 'AssetsDetailsPage', point: '0', icon : 'arrow-round-forward'},
				{ title: 'Live Stock',      pageName: 'AssetsStockPage',   point: '0', icon : 'arrow-round-forward'},
			];
		}
		else if(this.form_name == 'loan and liability'){
			this.forms = [
				{ title: 'Financial Details',     pageName: '', point: '0', icon : 'cash'},
			];
		}
	}

	presentLoading(text: string) {
	  let loading = this.loadingCtrl.create({
	    content: text
	  });

	  return loading;
	}

	onTap(page: string){
		if (page) {
			this.rootNavCtrl.push(page, { farmer_id: this.current_farmer.id });
		}
	}
}
