import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, } from 'ionic-angular';
import { Observable} from 'rxjs/Observable';
import { AuthService} from '../../providers/providers';
import { MenuController } from 'ionic-angular';


// import { Dashboard } from '../dashboard/dashboard';
// import { UserSignup } from '../user-signup/user-signup';
// import { UserForgotpassword } from '../user-forgotpassword/user-forgotpassword';

@IonicPage()
@Component({
    selector: 'page-user-login',
    templateUrl: 'user-login.html',
})
export class UserLogin {

    loading: Loading;
    registerCredentials = { email: '', password: '' };

    constructor(private nav: NavController, 
                private menu: MenuController, 
                private auth: AuthService, 
                private alertCtrl: AlertController,
                private loadingCtrl: LoadingController){

        this.menu.enable(false);
    }

    public createAccount() {
        this.nav.push('RegisterPage');
    }

    public login() {
        this.showLoading();
        this.auth.login(this.registerCredentials).subscribe(allowed => {
            if (allowed) {        
                this.nav.setRoot('HomePage');
            } else {
                this.showError("Access Denied");
            }
            // this.loading.dismiss();
        },
        error => {
            this.showError(error);
        });
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            dismissOnPageChange: true
        });
        this.loading.present();
    }

    showError(text) {
        this.loading.dismiss();

        let alert = this.alertCtrl.create({
            title: 'Fail',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }
    forgotPasswordPage(){ this.nav.push('UserForgotpassword'); }

}
