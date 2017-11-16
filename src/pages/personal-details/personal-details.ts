import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/**
 * Generated class for the PersonalDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-personal-details',
 	templateUrl: 'personal-details.html',
 })
 export class PersonalDetailsPage {

 	personal: FormGroup;
    submitAttempt: boolean = false;
    retryButton: boolean = false;

 	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
 		this.personal = formBuilder.group({

            f1_mfname: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
            f1_mmname: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
            f1_dob: ['', Validators.required],
            f1_age: [''],
            f1_altno: ['', Validators.pattern('^[0-9]{10}$')],
            any_other_select: ['', Validators.required],
            f1_ppno: ['', Validators.pattern('^[0-9A-Za-z-/\_$&@]{12}$')],
            f1_pancard: ['', Validators.pattern('^[0-9A-Za-z-/\_$&@]{10}$')],
            f1_vote: ['', Validators.pattern('^[0-9A-Za-z-/\_$&@]{12}$')],
            f1_licno: ['', Validators.pattern('^[0-9A-Za-z-/\_$&@]{12}$')],
            f1_otherno: ['', Validators.compose([Validators.maxLength(20),Validators.pattern('^[0-9A-Za-z-/\_$&@]*')] )],
            f1_expfarm: ['', Validators.compose([Validators.maxLength(2), Validators.pattern('^[0-9.]*'), Validators.required])],
        });

        this.personal.controls.f1_dob.valueChanges.subscribe(() => {
        	let dob = this.personal.controls.f1_dob.value;
        	this.personal.controls.f1_age.setValue(this.getAge(dob));
        });
 	}

 	getAge(dateString) {
	    let today = new Date();
	    let birthDate = new Date(dateString);
	    let age = today.getFullYear() - birthDate.getFullYear();
	    let m = today.getMonth() - birthDate.getMonth();
	    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
	        age--;
	    }
	    return age;
	}

 	ionViewDidLoad() {
        console.log('ionViewDidLoad PersonalDetailsPage');
    }

    save() {

        this.submitAttempt = true;
        if (!this.personal.valid) {
            console.log("Validation error!")
        } else {
            console.log("success!")
            console.log(this.personal.value);
        }
    }

 }
