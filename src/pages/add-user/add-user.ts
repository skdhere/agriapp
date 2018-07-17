import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Sql } from '../../providers/sql/sql';
import { UserProvider } from '../../providers/user/user';
import { ExtraValidator } from '../../validators/ExtraValidator';
import { Events } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';

/**
 * Generated class for the AddUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-user',
  templateUrl: 'add-user.html',
})
export class AddUserPage {

  personal: FormGroup;
    submitAttempt: boolean = false;
    retryButton: boolean = false;
    exist: boolean = false;
    ca_id: any = "";
    states: any[];
    districts: any[];
    talukas: any[];
    villages: any[];
    fpo_id:any;
    local_id:any;
    update_req: boolean=false;
    fpo_detail: any;
    loading : any;
    fpos:any;
    userType : any;

    private storage: Storage;

    constructor(public navCtrl: NavController, 
				public navParams: NavParams,
                private api: Api,
                public sql: Sql,
				public toastCtrl: ToastController,
                private loadingCtrl: LoadingController,
				public user:UserProvider,
				public formBuilder: FormBuilder) {

        //get ca_id
        this.userType   = [{'name':'Admin'},{'name':'Change Agent'}]
        this.ca_id = this.user.id;
        
        this.personal = formBuilder.group({
            fpo_name: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
            fpo_email: ['', Validators.compose([Validators.maxLength(100), Validators.required, Validators.email]), (control) => ExtraValidator.FpoCheckEmail(control, this.api, this.exist)],
            fpo_mobile: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*'), Validators.required]), (control) => ExtraValidator.FpoCheckMobile(control, this.api, this.exist)],
            fpo_password: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
            fm_fpo:['', Validators.required],
            user_type:['', Validators.required],
        });

        
		if(this.navParams.get('fpo'))
        {
            this.update_req = true;
            this.fpo_detail = this.navParams.get('fpo');
            this.exist      = true;
        }

        if(this.exist !== false){

            let _fpo     = this.fpo_detail
            let formData = [];

                  
            formData['fpo_name']     = _fpo.fpo_name;
            formData['fpo_email']    = _fpo.fpo_email || '';
            formData['fpo_mobile']   = _fpo.fpo_mobile || '';
            formData['fpo_password'] = _fpo.fpo_password || '';

            // formData['fpo_state']    = _fpo.fpo_state ? { name : _fpo.fpo_state } : '';
            // this.stateChange('p',{value : formData['fpo_state']});
            
            // formData['fpo_district'] = _fpo.fpo_district ? { name : _fpo.fpo_district } : '';
            // this.districtChange('p',{value : formData['fpo_district']});
            
            // formData['fpo_taluka']   = _fpo.fpo_taluka ? { name : _fpo.fpo_taluka } : '';
            // this.talukaChange('p',{value : formData['fpo_taluka']});
            
            // formData['fpo_village']  = _fpo.fpo_village ? { name : _fpo.fpo_village } : '';

            this.personal.setValue(formData);
            this.exist = true;
        }

        // load fpos
        this.sql.query('SELECT * FROM tbl_fpos', []).then( (data) => {
            if (data.res.rows.length > 0) {
                let sta = [];
                for(let i=0; i<data.res.rows.length; i++){
                    sta.push(data.res.rows.item(i));
                }
                this.fpos = sta;
            }
        }, (error) =>{
            console.log(error);
        });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddUserPage');
  }

}
