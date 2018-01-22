import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { UserProvider } from '../user/user';
import { Events } from 'ionic-angular';


/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
    // url: string = 'http://acrefin.com/agribridge/api/v1';
    url: string = 'http://localhost/app/Github/agribridge-api/v1';
    // url: string = 'http://sqoreyard.com/sqyardpanel/rest/v1';
    options: RequestOptions;
    activeCalls: number = 0;

    constructor(public http: Http, private storage: Storage, public currentUser: UserProvider, public events?: Events) {
        this.storage.set('httpStatus', 'false');
    }

    setHeaders(){
        let myHeaders: Headers = new Headers;
        myHeaders.set('Content-Type', 'application/x-www-form-urlencoded');
        if(this.currentUser.token){
            myHeaders.set('Authorization', this.currentUser.token);
        }
        this.options = new RequestOptions({ headers: myHeaders });
    }

    get(endpoint: string, params?: any) {
        this.setHeaders();
        // Support easy query params for GET requests
        if (params) {
            let p = new URLSearchParams();
            for (let k in params) {
                p.set(k, params[k]);
                endpoint += "/" + params[k];
            }
            // Set the search field if we have params and don't already have
            // a search field set in options.
            // this.options.search = p;
        }
        this.httpCallRequested();
        return this.http.get(this.url + '/' + endpoint , this.options).finally(() => {
            this.httpCallReady();
        });
    }

    post(endpoint: string, body: any) {
        this.setHeaders();
        let params = new URLSearchParams();
        for(let key in body){
            params.set(key, body[key]) 
        }
        this.httpCallRequested();
        return this.http.post(this.url + '/' + endpoint, params, this.options)
        .finally(() => {
            this.httpCallReady();
        });
    }

    put(endpoint: string, body: any) {
        this.setHeaders();
        let params = new URLSearchParams();
        for(let key in body){
            params.set(key, body[key]) 
        }
        this.httpCallRequested();
        return this.http.put(this.url + '/' + endpoint, params, this.options)
        .finally(() => {
            this.httpCallReady();
        });
    }

    delete(endpoint: string) {
        this.httpCallRequested();
        return this.http.delete(this.url + '/' + endpoint, this.options)
        .finally(() => {
            this.httpCallReady();
        });
    }

    patch(endpoint: string, body: any) {
        return this.http.put(this.url + '/' + endpoint, body, this.options);
    }


    private httpCallReady(): void {
        this.activeCalls--;
        if (this.activeCalls === 0) {
            // console.log('Http Done!');
            this.events.publish('API:RequestIdle');
            this.storage.set('httpStatus', 'false');
        }
    }

    private httpCallRequested(): void {
        if (this.activeCalls === 0) {
            // console.log('Http start!');
            this.events.publish('API:RequestBusy');
            this.storage.set('httpStatus', 'true');    
        }
        this.activeCalls++;
    }

    getHttpStatus(){
        return this.storage.get('httpStatus');
    }
}
