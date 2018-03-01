import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, MenuController, AlertController, IonicApp, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { AuthService } from '../providers/providers';
import { UserProvider } from '../providers/user/user';
import { Sql } from '../providers/sql/sql';
import { Api } from '../providers/api/api';
import { InAppBrowser } from '@ionic-native/in-app-browser';


import { HttpClientModule } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    version: string = "1.1.0";
    rootPage: any = 'PreloadPage';
    // rootPage: any = 'LoginPage';
    alert: any;
    pages: Array<{title: string, component: any, icon:string}>;
    online: boolean = false;
    httpSubscriptions: any = [];
    MyAlert: any;
    constructor(private auth: AuthService,
                private ionicApp: IonicApp,
                private network: Network,
                private iab: InAppBrowser,
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

            if (this.network.type !== 'none' && this.network.type !== 'undefined' && this.network.type !== '') {
                console.log('Alert');
                this.api.post("app_version", {version: this.version})
                .map((res) => res.json())
                .subscribe(success =>{

                    if(success.success){

                        let url = success.data.url;
                        let message = success.data.desc;

                        this.MyAlert = this.alertCtrl.create({
                            title: 'App Update',
                            subTitle: message,
                            buttons: [{
                                text: 'Ok',
                                handler: () => {
                                    let browse = this.iab.create(url, '_system');
                                    return false;
                                }
                            }],
                            enableBackdropDismiss: false
                        });
                        this.MyAlert.present();
                    }

                }, err => {console.log(err)});
            }

            this.auth.isAuthenticated().subscribe(success => {
                if(success){
                    //network connection status
                    if (this.network.type !== 'none' && this.network.type !== 'undefined' && this.network.type !== '') {
                        this.online = true;
                        setTimeout(() => {
                            console.log("syncing server....");
                            this.deleteServer();
                            this.sendAllData();
                        }, 5000);
                    }
                }
            });


            this.network.onConnect().subscribe(() => { 
                this.auth.isAuthenticated().subscribe(success => {
                    if(success){
                        this.online = true;
                        setTimeout(() => {
                            console.log("syncing server....");
                            this.loadFpos();
                            
                            this.deleteServer();
                            this.sendAllData();
                        }, 5000);
                    }
                });
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
            this.events.subscribe('auth:onLogin', () => {
                //network connection status
                if (this.network.type !== 'none' && this.network.type !== 'undefined' && this.network.type !== '') {
                    this.online = true;
                    setTimeout(() => {
                        console.log("syncing server....");
                        this.deleteServer();
                        this.sendAllData();
                    }, 5000);
                }
            });
            this.events.subscribe('table:updated', (tablename, fm_id, local_id = '') => { 
                if(tablename == 'tbl_land_details' || tablename == 'tbl_cultivation_data' || tablename == 'tbl_yield_details' || tablename == 'tbl_loan_details'){
                    this.eventExtraTableUpdated(tablename, fm_id, local_id, true);
                }else{
                    this.eventTableUpdated(tablename, fm_id);
                }
            });
            this.events.subscribe('table:farmerAdded', (local_fm_id) => { this.serverAddFarmer(local_fm_id); });
            //subscribe for global events
            this.events.subscribe('farmer:deletedLocal', () => { this.deleteServer(); });

            //Register hardware back button
            platform.registerBackButtonAction(() => {

                let currentView = this.nav.getActive();
                if(this.MyAlert == null){
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
                        else{

                            let activePopover = this.ionicApp._modalPortal.getActive() ||
                                                this.ionicApp._toastPortal.getActive() ||
                                                this.ionicApp._overlayPortal.getActive();
                            if(activePopover){
                                activePopover.dismiss();
                            }
                            else{
                                if(currentView.component.name == 'FarmersPage'){
                                    this.nav.setRoot('HomePage');
                                }else{
                                    this.nav.pop();
                                }
                            }
                        }
                    }
                }
            });
        });

        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home',       component: 'HomePage',      icon: 'home'},
            { title: 'My Farmers', component: 'FarmersPage',   icon: 'people'},
            { title: 'Help',       component: 'SlidesPage',    icon: 'help-buoy'},
        ];
            // { title: 'Account',    component: 'HomePage',      icon: 'analytics'},
        // if(this.currentUser.userType == 'Admin'){
        //     console.log(this.currentUser, "....");
        //     this.pages.push({ title: 'FPO', component: 'FpoPage',    icon: 'person-add'});
        // }
    }

    loadFpos(){
        this.sql.query('select id from tbl_fpos').then(local_data => {
            let fpo_ids = [];

            if(local_data.res.rows.length > 0){
                for (let i = 0; i < local_data.res.rows.length; i++) {
                    let item = local_data.res.rows.item(i);
                    if(item.id != ''){
                        fpo_ids.push(item.id);
                    }
                }
            }
            let data = { fpo_ids : fpo_ids.toString()};

            this.api.post("get_all_fpo", data)
            .map((res) => res.json())
            .subscribe(success =>{

                if(success.success){

                    let db = this.sql.getDb();
                    db.transaction((tx: any) => {
                        if(success.data.length > 0){
                            let stateStr = "";
                            for (let row of success.data) {
                                stateStr += "("+row.id+",'"+row.fpo_name+"','"+row.fpo_state+"','"+row.fpo_district+"','"+row.fpo_taluka+"','"+row.fpo_village+"'),";
                            }
                            stateStr = stateStr.substring(0,stateStr.length-1);
                            this.sql.query('INSERT into tbl_fpos(id, fpo_name, fpo_state, fpo_district, fpo_taluka, fpo_village) values '+ stateStr).then();
                        }
                    });
                }

            }, err => {
                console.log(err);
            });
        }, err => console.log(err));
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if(page){
            let currentView = this.nav.getActive();

            if(currentView.component.name != page.component){
                if (page.component == "SlidesPage") {
                    this.nav.push(page.component);
                }else{
                    this.nav.setRoot(page.component);
                }
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
            // console.log(tablename);
            await this.sql.query("SELECT * FROM " + tablename + " WHERE fm_id = ?", [lfm_id]).then(sdata => {
                
                // if table name is personal_detail then check if tbl_farmer data is sent or not
                // if its already sent then make a put request to update the data
                if(tablename === 'tbl_personal_detail'){
                    this.sql.query("SELECT * FROM tbl_farmers WHERE local_id = ?", [lfm_id]).then(farmerData => {
                        if (farmerData.res.rows.length > 0) {
                            let fmdata = farmerData.res.rows.item(0);
                            if(fmdata['fm_id'] !== 'false' && fmdata['fm_id'] != '' && fmdata['fm_id'] != null){
                                // if(fmdata['local_upload'] == 0){
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
                                // }
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
                        // if(data['local_upload'] == 0){

                            delete data['fm_id'];
                            delete data['fm_caid'];
                            delete data['local_upload'];

                            data['tablename'] = tablename;

                            this.updateServer(lfm_id, data);
                        // }
                    }
                }
                else{
                    this.sql.updateUploadStatus(tablename, lfm_id, '1');
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
    async eventExtraTableUpdated(tablename, lfm_id, local_id, cultivation = false){
        // console.log(tablename,'event called', this.online);
        //look for internet
        if(this.online){
            //Get data from local sql
            await this.sql.query("SELECT * FROM " + tablename + " WHERE fm_id = ? AND local_id = ?", [lfm_id, local_id]).then(sdata => {
                
                if (sdata.res.rows.length > 0) {
                    //send one by one data to server
                    for(var i = 0; i < sdata.res.rows.length; i++) {

                        let data = sdata.res.rows.item(i);

                        data['tablename'] = tablename;
                        //check if table is crop_cultivation
                        if(tablename == 'tbl_cultivation_data' && cultivation){
                            this.sql.query("SELECT * FROM tbl_land_details WHERE local_id = ?", [data['f10_land']]).then(land => {
                                if (land.res.rows.length > 0) {
                                    let item = land.res.rows.item(0);
                                    console.log('Found Land ', item);

                                    //if server_id is not null then only send data
                                    if(item['server_id'] != undefined && item['server_id'] != '' && item['server_id'] != null){
                                        data['f10_land'] = item['server_id'];
                                        this.updateExtraServer(lfm_id, local_id, data);
                                    }
                                }
                            });
                        }
                        else if(tablename != 'tbl_cultivation_data'){
                            this.updateExtraServer(lfm_id, local_id, data);
                        }
                    }
                }
                else{
                    this.sql.updateUploadStatus(tablename, [lfm_id, local_id], '1');
                }
            }, err => {
                console.log(err);
            });
        }
    }

    //the sub function called from eventExtraTableUpdated()
    async updateExtraServer(lfm_id, local_id, data){
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
                            this.sql.updateUploadStatus(data.tablename, [lfm_id, local_id], '1');

                            //update upcomming insert id as server id
                            if(success.data.insert_id != undefined){
                                this.sql.updateExtraTableServerID(data.tablename, data['local_id'], success.data.insert_id);

                                //now send cultivation data
                                if(data.tablename == 'tbl_land_details'){
                                    this.eventExtraTableUpdated('tbl_cultivation_data', lfm_id, local_id, true);
                                }
                            }
                        }
                        else{
                            //add error messages to error table
                            for(let j = 0; j < success.data.length; j++){
                                let id = lfm_id + ',' + local_id;
                                this.sql.addError(data.tablename, id, success.data[j].error_code, success.data[j].error_message);
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
                            this.sql.updateUploadStatus(data.tablename, [lfm_id, local_id], '1');
                        }
                        else{
                            //add error messages to error table
                            for(let j = 0; j < success.data.length; j++){
                                let id = lfm_id + ',' + local_id;
                                this.sql.addError(data.tablename, id, success.data[j].error_code, success.data[j].error_message);
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
        this.sql.updateUploadStatus('tbl_farmers', lfm_id, '0');
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
        await this.sql.query("SELECT * FROM tbl_queue").then((queue) => {
            if(queue.res.rows.length > 0) {
                //Go through all queue
                for (var j = 0; j < queue.res.rows.length; j++) {
                    let que = queue.res.rows.item(j);
                    if(que['tablename'] === 'tbl_farmers'){
                        //get farmer row from tbl_farmers
                        queue.tx.executeSql('SELECT * FROM tbl_farmers WHERE local_id = ?', [que['local_id']], (txx, data) => {

                            if(data.rows.length > 0){
                                let single = data.rows.item(0);

                                //update to server if required
                                if(single.fm_id !== 'false' && single.fm_id != '' && single.fm_id != null){
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
                            }

                        }, (txx, err) => {console.log(err);});
                    }
                    else{
                        if( que['tablename'] == 'tbl_land_details' || 
                            que['tablename'] == 'tbl_cultivation_data' || 
                            que['tablename'] == 'tbl_yield_details' || 
                            que['tablename'] == 'tbl_loan_details'){

                            this.eventExtraTableUpdated(que['tablename'], que['local_id'], que['extra_id'], true);
                        }else{
                            this.eventTableUpdated(que['tablename'], que['local_id']);
                        }
                    }
                }
            }
        }, (err) => {
            console.log(err);
        });
    }

    //Delete functionality
    async deleteServer(){
        if(this.online){
            await this.sql.query("SELECT * FROM tbl_delete", []).then(sdata => {
                if(sdata.res.rows.length > 0){
                    for (var i = 0; i < sdata.res.rows.length; i++) {

                        let single = {};
                        let tbl_delete = sdata.res.rows.item(i);
                        if(tbl_delete['tablename'] == 'tbl_farmers'){

                            single['fm_id'] = tbl_delete['server_id'];

                            let req = this.api.post("fm_delete", single)
                            .map((res) => res.json())
                            .subscribe(success => {
                                //on success change upload status to 1
                                if(success.success){
                                    this.sql.query("DELETE FROM tbl_delete WHERE server_id = ? and tablename = ? ", [single['fm_id'], 'tbl_farmers']).catch(err => { console.log(err) });
                                }
                            }, error => {
                                console.log(error);
                            });
                            this.httpSubscriptions.push(req);

                        }else{

                            single['tablename'] = tbl_delete['tablename'];
                            single['server_id'] = tbl_delete['server_id'];

                            let req = this.api.post("delete_extra_table", single)
                            .map((res) => res.json())
                            .subscribe(success => {
                                //on success change upload status to 1
                                if(success.success){
                                    this.sql.query("DELETE FROM tbl_delete WHERE server_id = ? and tablename = ? ", [single['server_id'], single['tablename']]).catch(err => { console.log(err) });
                                }
                            }, error => {
                                console.log(error);
                            });
                            this.httpSubscriptions.push(req);

                        }

                    }
                }
            });
        }
    }
}
