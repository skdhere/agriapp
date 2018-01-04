import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

import { Sql } from '../../providers/sql/sql';

declare var cordova: any;

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
	images: any = [];
	// lastImage: string = null;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				private sql: Sql,
				private camera: Camera,
				private file: File,
				private filePath: FilePath,
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

	readFile(e, img){
			console.log(e);
			console.log(e.target.files[0].webkitRelativePath);
		let index = this.images.indexOf(img);
		if(index !== -1){
			this.images[index].uri = e.target.value;
		}
	};

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
				{ title: 'Crop And Cultivation Details',  isUpdated:false, tableName: 'tbl_cultivation_data', pageName: 'CropCultivationPage', point: '0', icon : 'leaf'},
				{ title: 'Previous Crop Cycle Details',   isUpdated:false, tableName: 'tbl_yield_details', pageName: 'CropPreviousPage', point: '0', icon : 'leaf'},
			];
		}
		else if(this.form_name == 'assets'){
			this.forms = [
				{ title: 'Assets Details',  isUpdated:false, tableName: 'tbl_asset_details', pageName: 'AssetsDetailsPage', point: '0', icon : 'arrow-round-forward'},
				{ title: 'Live Stock',      isUpdated:false, tableName: 'tbl_livestock_details', pageName: 'AssetsStockPage',   point: '0', icon : 'arrow-round-forward'},
			];
		}
		else if(this.form_name == 'Documents'){
			this.forms = [];

			this.images = [
				{ title: 'Adhaar Card', uri: 'assets/images/no-image.png'},
				{ title: 'Adhaar Card', uri: 'assets/images/no-image.png'},
				{ title: 'Adhaar Card', uri: 'assets/images/no-image.png'},
				{ title: 'Adhaar Card', uri: 'assets/images/no-image.png'},
				{ title: 'Adhaar Card', uri: 'assets/images/no-image.png'},
				{ title: 'Adhaar Card', uri: 'assets/images/no-image.png'}
			];
		}
	}

	ionViewDidEnter(){
		
		if(this.form_name === 'loan and liability'){

			this.forms = [
				{ title: 'Financial Details',     isUpdated:false, tableName: 'tbl_financial_details', pageName: 'LoanFinancialPage', point: '0', icon : 'cash'},
			];

			let that = this;
			this.sql.query("SELECT * FROM tbl_financial_details WHERE f8_loan_taken = ? and fm_id = ? limit 1" , ['yes', this.current_farmer.local_id]).then( (data) => {
				console.log('thissssss ',data);
	            if (data.res.rows.length > 0) {
					that.forms.push({ title: 'Loan Details',isUpdated:false, tableName: 'tbl_loan_details', pageName: 'LoanDetailsPage', point: '0', icon : 'cash'});

					//check if its updated in local database
					for (var i = 0; i < this.forms.length; i++) {
						if(this.forms[i].tableName){
							// console.log(this.forms[i].tableName);
							this.updateStatus(i);
						}
					}
					
	            }
	        }, err => {
	            console.log(err);
	        });
		}

		//check if its updated in local database
		for (var i = 0; i < this.forms.length; i++) {
			if(this.forms[i].tableName){
				// console.log(this.forms[i].tableName);
				this.updateStatus(i);
			}
		}

	}

	async updateStatus(index){
		await this.sql.query('SELECT fm_id FROM ' + this.forms[index].tableName + ' WHERE fm_id = ? LIMIT 1', [this.current_farmer.local_id]).then(data => {
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

	capture(img){
		let index = this.images.indexOf(img);
		if(index !== -1){

			let options: CameraOptions = {
				quality: 20,
				sourceType: this.camera.PictureSourceType.CAMERA,
    			saveToPhotoAlbum: false,
			}

			this.camera.getPicture(options).then((imagePath) => {

				let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
				let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
				this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), index);

			}, (err) => {
				// Handle error
				console.log(err);
			});

		}
	}

	// Create a new name for the image
	private createFileName() {
		let d = new Date(),
		n = d.getTime(),
		newFileName =  n + ".jpg";
		return newFileName;
	}

	// Copy the image to a local folder
	private copyFileToLocalDir(namePath, currentName, newFileName, index) {
		this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
			// this.lastImage = newFileName;
			this.images[index].uri = this.pathForImage(newFileName);
		}, error => {
			console.log('Error while storing file.');
		});
	}

	// Always get the accurate path to your apps folder
	public pathForImage(img) {
		if (img === null) {
			return '';
		} else {
			return cordova.file.dataDirectory + img;
		}
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
