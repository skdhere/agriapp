import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, MenuController, AlertController, IonicApp, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { AuthService } from '../providers/providers';
import { UserProvider } from '../providers/user/user';
import { Sql } from '../providers/sql/sql';
import { Api } from '../providers/api/api';

import { HttpClientModule } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = 'PreloadPage';
    // rootPage: any = 'LoginPage';
    alert: any;
    pages: Array<{title: string, component: any, icon:string}>;
    online: boolean = false;
    httpSubscriptions: any = [];

    constructor(private auth: AuthService,
                private ionicApp: IonicApp,
                private network: Network,
                private sql: Sql,
                private api: Api,
                platform: Platform, 
                statusBar: StatusBar, 
                splashScreen: SplashScreen, 
                menu: MenuController,
                public events: Events,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                public currentUser: UserProvider) {

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            // statusBar.styleDefault();
            statusBar.overlaysWebView(true);
            statusBar.overlaysWebView(false);
            statusBar.overlaysWebView(true);
            statusBar.backgroundColorByHexString("#33000000");
            // statusBar.styleBlackOpaque();

            splashScreen.hide();

            //network connection status
            if (this.network.type !== 'none' && this.network.type !== 'undefined') {
                this.online = true;
                setTimeout(() => {
                    console.log("sending data to server....");
                    this.sendAllData();
                }, 5000);
            }

            this.network.onConnect().subscribe(() => { 
                this.online = true;
                setTimeout(() => {
                    console.log("sending data to server....");
                    this.sendAllData();
                }, 5000);
            });
            
            this.network.onDisconnect().subscribe(() => { 
                this.online = false;
                for (let i = 0; i < this.httpSubscriptions.length; i++) {
                    // console.log('offline mode : deleting inprogress http subscriptions', i);
                    if(this.httpSubscriptions[i] != undefined){
                        this.httpSubscriptions[i].unsubscribe();
                        delete this.httpSubscriptions[i];
                    }
                }
            });
            
            
            //subscribe for global events
            this.events.subscribe('table:updated', (tablename, fm_id) => { 
                //clear all existing errors for this device
                // this.sql.query("DELETE FROM tbl_errors WHERE local_id = ? and tablename = ?", [fm_id, tablename]).then();
                if(tablename == 'tbl_land_details' || tablename == 'tbl_cultivation_data' || tablename == 'tbl_yield_details' || tablename == 'tbl_loan_details'){
                    this.eventExtraTableUpdated(tablename, fm_id);
                }else{
                    this.eventTableUpdated(tablename, fm_id);
                }
            });
            this.events.subscribe('table:farmerAdded', (local_fm_id) => { this.serverAddFarmer(local_fm_id); });

            //Register hardware back button
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
                            // console.log(1212122);
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

                        let activePopover = this.ionicApp._modalPortal.getActive() ||
                                            this.ionicApp._toastPortal.getActive() ||
                                            this.ionicApp._overlayPortal.getActive();
                        if(activePopover){
                            activePopover.dismiss();
                        }
                        else{
                            this.nav.pop();
                        }
                    }
                }
            });
        });

        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home',       component: 'HomePage',      icon: 'home'},
            { title: 'My Farmers', component: 'FarmersPage',   icon: 'people'},
            { title: 'Account',    component: 'HomePage',      icon: 'analytics'},
            { title: 'Help',       component: 'SlidesPage',    icon: 'help-buoy'},
        ];

    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if(page){
            if (page.component == "SlidesPage") {
                this.nav.push(page.component);
            }else{
                this.nav.setRoot(page.component);
            }
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

    //fired when any form udated
    async eventTableUpdated(tablename, lfm_id){
        // console.log(tablename,'event called', this.online);
        //look for internet
        if(this.online){
            // console.log('test', this.online);

            //Get data from local sql
            await this.sql.query("SELECT * FROM " + tablename + " WHERE fm_id = ?", [lfm_id]).then(sdata => {
                
                // if table name is personal_detail then check if tbl_farmer data is sent or not
                // if its already sent then make a put request to update the data
                if(tablename === 'tbl_personal_detail'){
                    this.sql.query("SELECT * FROM tbl_farmers WHERE local_id = ?", [lfm_id]).then(farmerData => {
                        if (farmerData.res.rows.length > 0) {
                            let fmdata = farmerData.res.rows.item(0);
                            if(fmdata['fm_id'] !== 'false' && fmdata['fm_id'] != '' && fmdata['fm_id'] != null){
                                if(fmdata['local_upload'] == 0){
                                    let req = this.api.put("add_farmer", fmdata)
                                    .map((res) => res.json())
                                    .subscribe(success => {
                                        //on success change upload status to 1
                                        if(success.success){
                                            this.sql.updateUploadStatus('tbl_farmers', fmdata['local_id'], '1');
                                        }
                                        else{
                                            //add error messages to error table
                                            for(let j = 0; j < success.data.length; j++){
                                                this.sql.addError('tbl_farmers', fmdata['local_id'], success.data[j].error_code, success.data[j].error_message);
                                            }
                                        }
                                    }, error => {
                                        console.log(error);
                                    });
                                    this.httpSubscriptions.push(req);
                                }
                            }
                        }
                    },err => {
                        console.log(err);
                    });
                }

                if (sdata.res.rows.length > 0) {
                    //send one by one data to server
                    for(var i = 0; i < sdata.res.rows.length; i++) {

                        let data = sdata.res.rows.item(i);
                        if(data['local_upload'] == 0){

                            delete data['fm_id'];
                            delete data['fm_caid'];
                            delete data['local_upload'];

                            data['tablename'] = tablename;

                            this.updateServer(lfm_id, data);
                        }
                    }
                }
            }, err => {
                console.log(err);
            });
            
        }
    }

    //the sub function called from eventTableUdated()
    async updateServer(lfm_id, data){
        //check whether this farmer has sent already
        //if tbl_farmer has fm_id of this local_id then its already sent
        await this.sql.getFarmerByLocalId(lfm_id).then(farmer_data => {
            let fm_id = 'false';
            let item_farmer:any = {};
            if(farmer_data.res.rows.length > 0){
                item_farmer = farmer_data.res.rows.item(0);
                fm_id = item_farmer.fm_id;
            }

            if(fm_id !== 'false' && fm_id != '' && fm_id != null){
                //its already has been sent
                
                data['fm_id'] = fm_id;
                let req = this.api.post("send_table", data)
                .map((res) => res.json())
                .subscribe(success => {
                    //on success change upload status to 1
                    if(success.success){
                        this.sql.updateUploadStatus(data.tablename, lfm_id, '1');
                    }
                    else{
                        //add error messages to error table
                        for(let j = 0; j < success.data.length; j++){
                            this.sql.addError(data.tablename, lfm_id, success.data[j].error_code, success.data[j].error_message);
                        }
                    }
                }, error => {
                    console.log(error);
                });
                this.httpSubscriptions.push(req);
            }
            else{
                //send it for first time
                //add farmer first to server
                delete item_farmer['fm_id'];
                delete item_farmer['fm_caid'];
                delete item_farmer['local_id'];
                delete item_farmer['local_upload'];

                let req = this.api.post("add_farmer", item_farmer)
                .map((res) => res.json())
                .subscribe(success => {
                    // console.log(success);
                    if(success.success){
                        //set tbl_farmers fm_id as comming from api server
                        this.sql.set_fm_id(success.data.fm_id, lfm_id);
                        this.sql.updateUploadStatus('tbl_farmers', lfm_id, '1');

                        //send table data now
                        data['fm_id'] = success.data.fm_id;
                        let req1 = this.api.post("send_table" , data)
                        .map((res) => res.json())
                        .subscribe(suc => {
                            // console.log(suc);
                            //on success change upload status to 1
                            if(suc.success){
                                this.sql.updateUploadStatus(data.tablename, lfm_id, '1');
                            }
                            else{
                                //add error messages to error table
                                for(let j = 0; j < suc.data.length; j++){
                                    this.sql.addError(data.tablename, lfm_id, suc.data[j].error_code, suc.data[j].error_message);
                                }
                            }

                        }, err => {
                            console.log(err);
                        });

                        this.httpSubscriptions.push(req1);
                    }
                    else{
                        //thers an error while adding farmer to server
                        console.log(success.data);
                        //add error messages to error table
                        for(let j = 0; j < success.data.length; j++){
                            this.sql.addError('tbl_farmers', lfm_id, success.data[j].error_code, success.data[j].error_message);
                        }
                    }
                }, error => {
                    console.log(error);
                });

                this.httpSubscriptions.push(req);
            }
            
        }, err => {
            console.log(err);
        });
    }

    //fired when extra table form udated
    async eventExtraTableUpdated(tablename, lfm_id){
        // console.log(tablename,'event called', this.online);
        //look for internet
        if(this.online){
            //Get data from local sql
            await this.sql.query("SELECT * FROM " + tablename + " WHERE fm_id = ?", [lfm_id]).then(sdata => {
                
                if (sdata.res.rows.length > 0) {
                    //send one by one data to server
                    for(var i = 0; i < sdata.res.rows.length; i++) {

                        let data = sdata.res.rows.item(i);
                        if(data['local_upload'] == 0){

                            data['tablename'] = tablename;
                            //check if table is crop_cultivation
                            if(tablename == 'tbl_cultivation_data'){
                                console.log('Inside cuntivation');
                                this.sql.query("SELECT * FROM tbl_land_details WHERE local_id = ?", [data['f10_land']]).then(land => {
                                    if (land.res.rows.length > 0) {
                                        let item = land.res.rows.item(0);
                                        console.log('Found Land ', item);

                                        //if server_id is not null then only send data
                                        if(item['server_id'] != undefined && item['server_id'] != '' && item['server_id'] != null){
                                            data['f10_land'] = item['server_id'];
                                            this.updateExtraServer(lfm_id, data);
                                        }
                                    }
                                });
                            }else{
                                this.updateExtraServer(lfm_id, data);
                            }
                        }
                    }
                }
            }, err => {
                console.log(err);
            });
            
        }
    }

    //the sub function called from eventExtraTableUpdated()
    async updateExtraServer(lfm_id, data){
        //check whether this farmer has sent already
        //if tbl_farmer has fm_id of this local_id then its already sent
        await this.sql.getFarmerByLocalId(lfm_id).then(farmer_data => {
            let fm_id = 'false';
            let item_farmer:any = {};
            if(farmer_data.res.rows.length > 0){
                item_farmer = farmer_data.res.rows.item(0);
                fm_id = item_farmer.fm_id;
            }

            if(fm_id !== 'false' && fm_id != '' && fm_id != null){

                //check if its post or put
                if(data['server_id'] == null || data['server_id'] == ''){
                    //its already has been sent
                    data['fm_id'] = fm_id;
                    let req = this.api.post("send_extra_table", data)
                    .map((res) => res.json())
                    .subscribe(success => {
                        //on success change upload status to 1
                        if(success.success){
                            this.sql.updateUploadStatus(data.tablename, lfm_id, '1');

                            //update upcomming insert id as server id
                            if(success.data.insert_id != undefined){
                                this.sql.updateExtraTableServerID(data.tablename, data['local_id'], success.data.insert_id);
                            }
                        }
                        else{
                            //add error messages to error table
                            for(let j = 0; j < success.data.length; j++){
                                this.sql.addError(data.tablename, lfm_id, success.data[j].error_code, success.data[j].error_message);
                            }
                        }
                    }, error => {
                        console.log(error);
                    });
                    this.httpSubscriptions.push(req);
                }else{
                    //its already has been sent
                    data['fm_id'] = fm_id;
                    let req = this.api.put("send_extra_table", data)
                    .map((res) => res.json())
                    .subscribe(success => {
                        //on success change upload status to 1
                        if(success.success){
                            this.sql.updateUploadStatus(data.tablename, lfm_id, '1');
                        }
                        else{
                            //add error messages to error table
                            for(let j = 0; j < success.data.length; j++){
                                this.sql.addError(data.tablename, lfm_id, success.data[j].error_code, success.data[j].error_message);
                            }
                        }
                    }, error => {
                        console.log(error);
                    });
                    this.httpSubscriptions.push(req);
                }
            }
        }, err => {
            console.log(err);
        });
    }

    //fired when new farmer added to local database
    async serverAddFarmer(lfm_id){
        
        if(this.online){
            //check whether this farmer has sent already
            //if tbl_farmer has fm_id of this local_id then its already sent
            await this.sql.getFarmerByLocalId(lfm_id).then(farmer_data => {
                let fm_id = 'false';
                let item_farmer:any = {};
                if(farmer_data.res.rows.length > 0){
                    item_farmer = farmer_data.res.rows.item(0);

                    //send it for first time
                    //add farmer first to server
                    delete item_farmer['fm_id'];
                    delete item_farmer['fm_caid'];
                    delete item_farmer['local_id'];
                    delete item_farmer['local_upload'];

                    let req = this.api.post("add_farmer", item_farmer)
                    .map((res) => res.json())
                    .subscribe(success => {
                        // console.log(success);
                        if(success.success){
                            //set tbl_farmers fm_id as comming from api server
                            this.sql.set_fm_id(success.data.fm_id, lfm_id);
                            this.sql.updateUploadStatus('tbl_farmers', lfm_id, '1');
                        }
                        else{
                            //thers an error while adding farmer to server
                            console.log(success.data);
                            //add error messages to error table
                            for(let j = 0; j < success.data.length; j++){
                                console.log(lfm_id);
                                this.sql.addError('tbl_farmers', lfm_id, success.data[j].error_code, success.data[j].error_message);
                            }
                        }
                    }, error => {
                        console.log(error);
                    });

                    this.httpSubscriptions.push(req);
                }
            });
        }
    }

    //send local data to server 
    async sendAllData(){
        //Fetch all available farmers from local database
        await this.sql.query("SELECT * FROM tbl_farmers").then((farmers) => {
            // console.log(farmers);
            if (farmers.res.rows.length > 0) {

                //Go through all farmers
                for (var j = 0; j < farmers.res.rows.length; j++) {
                    let single = farmers.res.rows.item(j);


                    //if farmer main details has some changes and it's already send to the server
                    //then update his main data too
                    if(single.local_upload == 0 && single.fm_id !== 'false' && single.fm_id != '' && single.fm_id != null){
                        single['tablename'] = 'tbl_farmers';

                        let req = this.api.put("add_farmer", single)
                        .map((res) => res.json())
                        .subscribe(success => {
                            //on success change upload status to 1
                            if(success.success){
                                this.sql.updateUploadStatus(single.tablename, single['local_id'], '1');
                            }
                            else{
                                //add error messages to error table
                                for(let j = 0; j < success.data.length; j++){
                                    this.sql.addError(single.tablename, single['local_id'], success.data[j].error_code, success.data[j].error_message);
                                }
                            }
                        }, error => {
                            console.log(error);
                        });
                        this.httpSubscriptions.push(req);
                    }

                    //crawl each table and send if local_upload is 0
                    this.sql.query("SELECT name FROM sqlite_master WHERE type='table'").then( (data) => {
                        // console.log(data);
                        if (data.res.rows.length > 0) {
                            for (var i = 0; i < data.res.rows.length; i++) {
                                let table = data.res.rows.item(i);
                                if(table.name != "__WebKitDatabaseInfoTable__" 
                                    && table.name != "tbl_errors" 
                                    && table.name != "tbl_state" 
                                    && table.name != "tbl_district" 
                                    && table.name != "tbl_taluka" 
                                    && table.name != "tbl_village" 
                                    && table.name != "tbl_farmers" 
                                ){
                                    //clear all existing errors for this device
                                    // this.sql.query("DELETE FROM tbl_errors WHERE local_id = ? and tablename = ?", [single['local_id'], table.name]).then();
                                    //the following function will upload the data 
                                    //if upload failed for any reason it will store the data in error table
                                    if(table.name == 'tbl_land_details' || table.name == 'tbl_cultivation_data' || table.name == 'tbl_yield_details' || table.name == 'tbl_loan_details'){
                                        this.eventExtraTableUpdated(table.name, single['local_id']);
                                    }else{
                                        this.eventTableUpdated(table.name, single['local_id']);
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    }

}
