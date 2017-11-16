import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
* Generated class for the ResidenceDetailsPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
	selector: 'page-residence-details',
	templateUrl: 'residence-details.html',
})
export class ResidenceDetailsPage {

	personal: FormGroup;
    submitAttempt: boolean = false;
    retryButton: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.personal = formBuilder.group({
            
            f7_resistatus: ['', Validators.required],
            f7_phouse: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9/,\-\@&$# ]*')])],
            f7_pstreet: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9/,\-\@&$# ]*')])],
            f7_parea: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9/,\-\@&$# ]*'), Validators.required])],
            f7_pstate: ['', Validators.required],
            f7_pdistrict: ['', Validators.required],
            f7_ptaluka: ['', Validators.required],
            f7_pvillage: ['', Validators.required],
            f7_ppin: ['', Validators.compose([Validators.pattern('^[0-9]{6}$'), Validators.required])],

            f7_chouse: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9/,\-\@&$# ]*')])],
            f7_cstreet: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9/,\-\@&$# ]*')])],
            f7_carea: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9/,\-\@&$# ]*'), Validators.required])],
            f7_cstate: ['', Validators.required],
            f7_cdistrict: ['', Validators.required],
            f7_ctaluka: ['', Validators.required],
            f7_cvillage: ['', Validators.required],
            f7_cpin: ['', Validators.compose([Validators.pattern('^[0-9]{6}$'), Validators.required])]
        });
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ResidenceDetailsPage');
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

    copyAddress() {
        this.personal.controls['f7_chouse'].setValue(this.personal.value.f7_phouse);
        this.personal.controls['f7_cstreet'].setValue(this.personal.value.f7_pstreet);
        this.personal.controls['f7_carea'].setValue(this.personal.value.f7_parea);
        this.personal.controls['f7_cstate'].setValue(this.personal.value.f7_pstate);
        this.personal.controls['f7_cdistrict'].setValue(this.personal.value.f7_pdistrict);
        this.personal.controls['f7_ctaluka'].setValue(this.personal.value.f7_ptaluka);
        this.personal.controls['f7_cvillage'].setValue(this.personal.value.f7_pvillage);
        this.personal.controls['f7_cpin'].setValue(this.personal.value.f7_ppin);
    }
}
