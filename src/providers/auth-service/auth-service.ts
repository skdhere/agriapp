import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Api } from '../api/api';
import { UserProvider } from '../user/user';



@Injectable()
export class AuthService {
    // currentUser: UserProvider;

    constructor(private api: Api, private storage: Storage, public currentUser: UserProvider) {}

    public login(credentials) {
        if (credentials.email === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        } else {
            return Observable.create(observer => {
                let access = false;
                // At this point make a request to your backend to make a real check!
                this.api.post('login', credentials)
                .map(res => res.json())
                .subscribe( data => {
                    //store data in storage
                    if (data.success == true) {
                        this.storage.set('user_data', data.data);
                        this.currentUser.setUser(
                                data.data.fname,
                                data.data.emailId,
                                data.data.userType,
                                data.data.token,
                                data.data.contactno,
                                data.data.token_expiry
                        );
                        access = true;
                    }
                    else{
                        access = false;
                    }
                    observer.next(access);
                    observer.complete();
                    console.log(data);
                });

            });
        }
    }

    public isAuthenticated(){
        
        return Observable.create(observer => {
            //check if token is not expired
            this.storage.get('user_data').then(val => {
                if(val){
                    this.currentUser.setUser(
                            val.fname,
                            val.emailId,
                            val.userType,
                            val.token,
                            val.contactno,
                            val.token_expiry
                    );
                    
                    let enddate = new Date(this.currentUser.token_expiry);
                    let now = new Date();

                    // if(now.getTime() > enddate.getTime()){
                    //     console.log('false');
                    //     observer.next(false);
                    // }
                    // else{
                        console.log('yes authenticated true');
                        observer.next(true);
                    // }
                }
                else{
                    observer.next(false);
                }
                observer.complete();
            });
        });
    }

    public getUserInfo() : UserProvider {
        return this.currentUser;
    }

    public logout() {
        return Observable.create(observer => {
            // this.currentUser = null;
            this.storage.remove('user_data');
            observer.next(true);
            observer.complete();
        });
    }
}