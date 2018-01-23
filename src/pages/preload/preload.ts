import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AuthService } from '../../providers/providers';
import { Sql } from '../../providers/sql/sql';

import {Http, Response} from '@angular/http';
import 'rxjs/Rx';

/**
* Generated class for the PreloadPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
	selector: 'page-preload',
	templateUrl: 'preload.html',
})
export class PreloadPage {

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public sql: Sql,
				public http:Http,
				menu: MenuController,
				private auth: AuthService) {

		menu.enable(false);
	}

	ionViewDidLoad() {

		// load states
		this.sql.query('SELECT * FROM tbl_state LIMIT 1', []).then( (data) => {
            if (data.res.rows.length < 1) {
            	this.http.get("assets/json/state.json").map((res:Response) => res.json()).subscribe((data) => {
        			let stateStr = "";
        			for (let row of data) {
        				stateStr += "("+row.id+",'"+row.name+"'),";
        			}
        			stateStr = stateStr.substring(0,stateStr.length-1);
    				this.sql.query('INSERT into tbl_state(id, name) values '+ stateStr).then();
        		});
            }
        }, (error) =>{
        	console.log(error);
        });

		// load Districts
		this.sql.query('SELECT * FROM tbl_district LIMIT 1', []).then((data) => {
            if (data.res.rows.length < 1) {
            	this.http.get("assets/json/district.json")
        		.map((res:Response) => res.json())
        		.subscribe((d) => {
        			let distStr = "";
        			for (let row of d) {
        				distStr += "("+row.id+","+row.state_id+",'"+row.name+"'),";
        			}
        			distStr = distStr.substring(0,distStr.length-1);
    				this.sql.query('INSERT into tbl_district(id, state_id, name) values '+ distStr).then();
        		});
            }
        }, (error) =>{
        	console.log(error);
        });
		

		// load Taluka
		this.sql.query('SELECT * FROM tbl_taluka LIMIT 1', []).then( (data) => {
            if (data.res.rows.length < 1) {
            	this.http.get("assets/json/taluka.json")
        		.map((res:Response) => res.json())
        		.subscribe((data) => {
        			let talukaStr = "";
        			for (let row of data) {
        				talukaStr += "("+row.id+","+row.district_id+",'"+row.name+"'),";
        			}
        			talukaStr = talukaStr.substring(0,talukaStr.length-1);
    				this.sql.query('INSERT into tbl_taluka(id, district_id, name) values '+ talukaStr).then();
        		});
            }
        }, (error) =>{
        	console.log(error);
        });

		// load village
		this.sql.query('SELECT * FROM tbl_village LIMIT 1', []).then( (data) => {
            if (data.res.rows.length < 1) {
            	this.http.get("assets/json/village.json")
        		.map((res:Response) => res.json())
        		.subscribe((data) => {
        			let villageStr = "";
        			for (let row of data) {
        				villageStr += "("+row.id+","+row.talukas_id+",'"+row.name+"'),";
        			}
        			villageStr = villageStr.substring(0,villageStr.length-1);
    				this.sql.query('INSERT into tbl_village(id, taluka_id, name) values '+ villageStr).then((dtat)=>{
						this.goHome();
    				}, (error) => {
    					console.log(error);
    				});
    				
        		});
            }
            else{
				this.goHome();
            }
        }, (error) =>{
        	console.log(error);
			this.goHome();
        });

        // load crops
        this.sql.query('SELECT * FROM tbl_crops LIMIT 1', []).then( (data) => {
            if (data.res.rows.length < 1) {
                this.http.get("assets/json/crops.json").map((res:Response) => res.json()).subscribe((data) => {
                    let cropStr = "";
                    for (let row of data) {
                        cropStr += "("+row.crop_id+",'"+row.crop_name+"'),";
                    }
                    cropStr = cropStr.substring(0,cropStr.length-1);
                    this.sql.query('INSERT into tbl_crops(id, name) values '+ cropStr).then();
                });
            }
        }, (error) =>{
            console.log(error);
        });

        // load varieties
        this.sql.query('SELECT * FROM tbl_varieties LIMIT 1', []).then( (data) => {
            if (data.res.rows.length < 1) {
                this.http.get("assets/json/crop_varieties.json").map((res:Response) => res.json()).subscribe((data) => {
                    let varietiesStr = "";
                    for (let row of data) {
                        varietiesStr += "("+row.variety_id+","+row.crop_id+",'"+row.variety_name+"'),";
                    }
                    varietiesStr = varietiesStr.substring(0,varietiesStr.length-1);
                    this.sql.query('INSERT into tbl_varieties(id, crop_id, name) values '+ varietiesStr).then();
                });
            }
        }, (error) =>{
            console.log(error);
        });
	}

	goHome(){
		setTimeout(()=>{
            this.auth.isAuthenticated().subscribe(success => {
                if(success){
                    this.navCtrl.setRoot('HomePage');
                }
                else{
                    this.navCtrl.setRoot('UserLogin');
                }
            });
        }, 500);
	}

}
