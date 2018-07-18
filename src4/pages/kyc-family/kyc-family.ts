import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';
import { Helper } from '../../validators/ExtraValidator';


@IonicPage()
@Component({
  selector: 'page-kyc-family',
  templateUrl: 'kyc-family.html',
})
export class KycFamilyPage {

  	family: FormGroup;
	submitAttempt: boolean = false;
	fm_id: any;
    exist: boolean = false;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
                public sql: Sql,
                public toastCtrl: ToastController,
				public formBuilder: FormBuilder) {

		this.family = formBuilder.group({
			'f6_jointfamily' : ['', Validators.required],
			'f6_members' : ['', Validators.required],
			'f6_children' : ['', Validators.required],
			'f6_smartuse' : ['',Validators.required],
		});

		this.family.controls['f6_children'].valueChanges.subscribe(() => {this.setValidation();});
	}

	list_f6_jointfamily = [
		{id: "yes", name: "Yes"},
		{id: "no", name: "No"},
	];

	list_f6_members = [
		{id: '0', name: '0'},
		{id: '1', name: '1'},
		{id: '2', name: '2'},
		{id: '3', name: '3'},
		{id: '4', name: '4'},
		{id: '5', name: '5'},
		{id: '6', name: '6'},
		{id: '7', name: '7'},
		{id: '8', name: '8'},
		{id: '9', name: '9'},
		{id: '10+', name: '10 / 10+'},
	];

	list_f6_children = [
		{id: '0', name: '0'},
		{id: '1', name: '1'},
		{id: '2', name: '2'},
		{id: '3', name: '3'},
		{id: '4', name: '4'},
		{id: '5', name: '5'},
		{id: '6', name: '6'},
		{id: '7', name: '7'},
		{id: '8', name: '8'},
		{id: '9', name: '9'},
		{id: '10+', name: '10 / 10+'},
	];

	list_f6_smartuse = [
		{id: "yes", name: "Yes"},
		{id: "no", name: "No"},
	];



	ionViewDidEnter() {
		//update validation here
		this.setValidation();

		this.exist = false;
        this.fm_id = this.navParams.get('farmer_id');

        this.sql.query('SELECT * FROM tbl_family_details WHERE fm_id = ? limit 1', [this.fm_id]).then( (data) => {

            if (data.res.rows.length > 0) {

                let sqlData = data.res.rows.item(0);
                let formData = [];

				formData['f6_jointfamily'] = Helper.checkInList(this.list_f6_jointfamily, 'id', sqlData.f6_jointfamily);
				formData['f6_members']     = Helper.checkInList(this.list_f6_members, 'id', sqlData.f6_members);
				formData['f6_children']    = Helper.checkInList(this.list_f6_children, 'id', sqlData.f6_children);
				formData['f6_smartuse']    = Helper.checkInList(this.list_f6_smartuse, 'id', sqlData.f6_smartuse);

                this.family.setValue(formData);
                this.exist = true;
            }

        }, err => {
            console.log(err);
        });
	}

	setValidation()
	{
		let controls = this.family.controls;

		console.log(controls['f6_smartuse'].value);
		if(controls['f6_children'].value > 0)
		{
			controls['f6_smartuse'].enable({ emitEvent: false });
			console.log('ddddf');
		}
		else{

			controls['f6_smartuse'].setValue('', { emitEvent: false });
			controls['f6_smartuse'].disable();

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


	save(){
		this.submitAttempt = true;
		if (this.family.valid) {
			console.log('Success');
			console.log(this.family.value);

			let date = new Date();
            let dateNow = date.getTime()/1000|0;

            if (this.exist) {
                this.sql.query('UPDATE tbl_family_details SET f6_points = ?, f6_jointfamily = ?, f6_members = ?, f6_children = ?, f6_smartuse = ?, f6_modified_date = ? WHERE fm_id = ?', [

                    this.family.value.f6_points || '',
                    this.family.value.f6_jointfamily || '',
                    this.family.value.f6_members || '',
                    this.family.value.f6_children || '',
                    this.family.value.f6_smartuse || '',

                    dateNow,
                    this.fm_id
                ]).then(data => {
                    this.sql.updateUploadStatus('tbl_family_details', this.fm_id, '0');
                    this.navCtrl.pop();
                },
                err => {
                    console.log(err);
                });               
            }
            else{
                this.sql.query('INSERT INTO tbl_family_details(fm_id, f6_points, f6_jointfamily, f6_members, f6_children, f6_smartuse,  f6_created_date, f6_modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [

                    this.fm_id,
                    this.family.value.f6_points || '',
                    this.family.value.f6_jointfamily || '',
                    this.family.value.f6_members || '',
                    this.family.value.f6_children || '',
                    this.family.value.f6_smartuse || '',
                    dateNow,
                    dateNow
                ]).then(data => {
                    this.sql.updateUploadStatus('tbl_family_details', this.fm_id, '0');
                    this.navCtrl.pop();
                },
                err => {
                    console.log(err);
                });
            }

		}else{
			console.log('Validation error');
			this.showMessage("Please fill valid data!", "danger", 100000);
		}
	}

	//this function will call while leaving the page
    //the function will then call the callback of previous page method
    ionViewWillLeave(){
        let callback = this.navParams.get('callback') || false;
        if(callback){
            callback(true);
        }
    }

}
