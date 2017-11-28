import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../providers/providers';
import { UserProvider } from '../providers/user/user';

import { HttpClientModule } from '@angular/common/http';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = 'PreloadPage';
    // rootPage: any = 'LoginPage';
    alert: any;
    pages: Array<{title: string, component: any, icon:string}>;

    constructor(private auth: AuthService,
                platform: Platform, 
                statusBar: StatusBar, 
                splashScreen: SplashScreen, 
                menu: MenuController,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                public currentUser: UserProvider) {

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            statusBar.overlaysWebView(true);
            statusBar.backgroundColorByHexString("#33000000");
            // statusBar.styleBlackOpaque();

            splashScreen.hide();
            
            setTimeout(()=>{
                this.auth.isAuthenticated().subscribe(success => {
                    if(success){
                        this.nav.setRoot('HomePage');
                    }
                    else{
                        this.nav.setRoot('UserLogin');
                    }
                });
            }, 500);
            

            platform.registerBackButtonAction(() => {

                let currentView = this.nav.getActive();

                if(menu.isOpen()){
                    menu.close();
                }
                else{

                    if(currentView.component.name == 'HomePage' || currentView.component.name == 'UserLogin' ){
                        if(this.alert == null){
                            this.alert = this.alertCtrl.create({
                                title: 'Agribridge',
                                message: 'Press Exit to exit.',
                                buttons: [
                                {
                                    text: 'Cancel',
                                    role: 'cancel',
                                    handler: () => {
                                        console.log('Cancel clicked');
                                        this.alert = null;
                                    }
                                },
                                {
                                    text: 'Exit',
                                    handler: () => {
                                        platform.exitApp();
                                    }
                                }
                                ]
                            });

                            this.alert.present();
                            console.log(1212122);
                        }
                        else{
                            this.alert.dismiss();
                            this.alert = null;
                        }

                    }
                    else if(currentView.component.name == 'FarmersPage'){
                        this.nav.setRoot('HomePage');
                    }
                    else{
                        this.nav.pop();
                    }
                }

            });
        });


        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home',       component: 'HomePage',    icon: 'home'},
            { title: 'My Farmers', component: 'FarmersPage', icon: 'people'},
            { title: 'Account',    component: 'HomePage',    icon: 'analytics'},
            { title: 'Settings',   component: 'HomePage',    icon: 'settings'},
        ];

    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if(page){
            this.nav.setRoot(page.component);
        }
    }

    logout(){
        let loading = this.presentLoading('Please wait...');
        loading.present();

        this.auth.logout().subscribe();
        this.nav.setRoot('UserLogin');
        loading.dismiss();
    }


    presentLoading(text: string) {
        let loading = this.loadingCtrl.create({
            content: text
        });

        return loading;
    }
}
