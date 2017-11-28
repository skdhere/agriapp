import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, menu: MenuController,) {
  		menu.enable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreloadPage');
  }

}
