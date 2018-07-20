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
    user_name :any ="Add User";
    value_chain:any;

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
        this.ca_id      = this.user.id;
        
        this.personal   = formBuilder.group({
            fname: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
            emailId: ['', Validators.compose([Validators.maxLength(100), Validators.required, Validators.email]), (control) => ExtraValidator.FpoCheckEmail(control, this.api, this.exist)],
            contactno: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*'), Validators.required]), (control) => ExtraValidator.FpoCheckMobile(control, this.api, this.exist)],
            password: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
            organisation:['', Validators.required],
            userType:['', Validators.required],
            value_chain:['',Validators.required],
        });

        
		if(this.navParams.get('user'))
        {
            this.update_req = true;
            this.fpo_detail = this.navParams.get('user');
            this.exist      = true;
            this.user_name  = this.fpo_detail.fname;
        }
        // load fpos
        this.sql.query('SELECT * FROM tbl_fpos', []).then( (data) => {
            if (data.res.rows.length > 0) {
                let sta = [];
                for(let i=0; i<data.res.rows.length; i++){
                    sta.push(data.res.rows.item(i));
                }
                this.fpos = sta;
                console.log('fpos',this.fpos);
            }
        }, (error) =>{
            console.log(error);
        });


        if(this.exist !== false){

            let user                 = this.fpo_detail
            let formData             = [];

            console.log('users',user);
            formData['fname']        = user.fname;
            formData['emailId']      = user.emailId || '';
            formData['contactno']    = user.contactno || '';
            formData['password']     = user.password || '';
            formData['organisation'] = user.organisation ? {id:parseInt(user.organisation)} : '';
            formData['value_chain']= user.value_chain ? {id:parseInt(user.value_chain)} : '';
            console.log(formData);
            formData['userType']  = {'name':user.userType};
            
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
        this.loading ? this.loading.dismiss() : {};
    }

    save(){

        this.submitAttempt = true;
        if (this.personal.valid) {
            this.loading = this.loadingCtrl.create({ dismissOnPageChange : true });
            this.loading.present();
            console.log(this.personal.value);

            let date = new Date();
            let dateNow = date.getTime()/1000|0;

            let final_data = {
                fname         : this.personal.value.fname,
                emailId       : this.personal.value.emailId,
                contactno     : this.personal.value.contactno,
                password      : this.personal.value.password,
                fm_gender     : this.personal.value.fm_gender,
                organisation  : this.personal.value.organisation.id,
                userType      : this.personal.value.userType.name
                // fpo_state : this.personal.value.fpo_state.name,
                // fpo_district : this.personal.value.fpo_district.name,
                // fpo_taluka : this.personal.value.fpo_taluka.name,
                // fpo_village : this.personal.value.fpo_village.name
            };
            console.log('final_data',final_data);

            if (this.exist) {
                //do put
                final_data['id'] = this.fpo_detail.id;
                console.log('final data ',final_data);
                this.api.put('add_user', final_data)//api for user
                .map((res) => res.json())
                .subscribe(data => {
                    if(data.success){
                        let callback = this.navParams.get('callback') || false;
                        if(callback){
                            callback(final_data);
                        }
                        this.navCtrl.pop();
                         console.log('true');
                    }
                    else{
                        console.log(data);
                        this.showMessage("Somthing went wrong please try again!", "danger", 10000);
                    }
                }, err => {
                    console.log(err);
                    this.showMessage("Somthing went wrong please try again!", "danger", 10000);
                });
            }
            else{
                //do post
                //console.log('user type'+this.personal.value.user_type);
                this.api.post('add_user', final_data)//api for user
                .map((res) => res.json())
                .subscribe(data => {
                    if(data.success){
                        let callback = this.navParams.get('callback') || false;
                        if(callback){
                            callback(true);
                        }
                        this.navCtrl.pop();
                    }
                    else{
                        console.log(data);
                        this.showMessage("Somthing went wrong please try again!", "danger", 10000);
                    }
                }, err => {
                    console.log(err);
                    this.showMessage("Somthing went wrong please try again!", "danger", 10000);
                });
            }

        }else{
            console.log('Validation error',this.personal);
            this.showMessage("Please fill valid data!", "danger", 100000);
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AddUserPage');
    }

    ionViewDidEnter()
    {
        // load value_chain
        this.sql.query('SELECT * FROM tbl_value_chain', []).then( (data) => {
            if (data.res.rows.length > 0) {
                let val = [];
                for(let i=0; i<data.res.rows.length; i++){
                    val.push(data.res.rows.item(i));
                }
                this.value_chain = val;
                console.log('Value chain',this.value_chain);
            }
        }, (error) =>{
            console.log(error);
        });
    }
}


