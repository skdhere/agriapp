import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';
import { UserProvider } from '../../providers/user/user';


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

    private storage: Storage;

    constructor(private sql: Sql,
        public navCtrl: NavController,
        public navParams: NavParams,
        public user: UserProvider,
        public formBuilder: FormBuilder) {

        this.personal = formBuilder.group({
            fm_fname: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
            fm_mname: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
            fm_lname: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
            fm_mobileno: ['', Validators.compose([Validators.pattern('^[0-9\-]{10}$'), Validators.required])],
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

            let date = new Date();
            let dateNow = date.getTime() / 1000 | 0;

            this.sql.query("INSERT INTO tbl_farmers (fm_fname, fm_mname, fm_lname, fm_mobileno, fm_aadhar, fm_createddt, fm_modifieddt) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    this.personal.value.fm_fname,
                    this.personal.value.fm_mname,
                    this.personal.value.fm_lname,
                    this.personal.value.fm_mobileno,
                    this.personal.value.fm_aadhar,
                    dateNow,
                    dateNow
                ])
                .then((data) => {
                    console.log("success!");
                    let callback = this.navParams.get("callback") || false;
                    if (callback) {
                        callback(true).then(() => {
                            this.navCtrl.pop();
                        });
                    }
                    else {
                        this.navCtrl.setRoot('FarmersPage');
                    }

                }, (error) => {
                    console.log(error);
                });
        }
    }

}
