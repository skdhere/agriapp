import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/**
 * Generated class for the AddFarmerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-add-farmer',
    templateUrl: 'add-farmer.html',
})
export class AddFarmerPage {

    personal: FormGroup;
    submitAttempt: boolean = false;
    retryButton: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
        this.personal = formBuilder.group({
            f1_fname: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
            f1_mname: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
            f1_lname: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
            fm_mobileno: ['', Validators.compose([Validators.pattern('^[0-9]{10}$'), Validators.required])],
            fm_aadhar: ['', Validators.compose([Validators.pattern('^[0-9]{12}$'), Validators.required])],
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AddFarmerPage');
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
