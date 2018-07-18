import { NgModule } from '@angular/core';
import { IonicPageModule  } from 'ionic-angular';
import { UserLogin } from './user-login';

@NgModule({
  declarations: [
    UserLogin,
  ],
  imports: [
    IonicPageModule.forChild(UserLogin),
  ]
})
export class UserLoginModule {
	
	
}
