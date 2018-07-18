import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, Events} from 'ionic-angular';
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
                public events: Events, 
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
            if (allowed == 'success') {        
                this.nav.setRoot('HomePage');
                this.events.publish('auth:onLogin');
            } else if(allowed == 'fail'){
                this.showError("Access Denied");
            } else{
                this.showError('Something went wrong, please try again!');
            }
        },
        error => {
            this.showError('Something went wrong, please try again!');
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
