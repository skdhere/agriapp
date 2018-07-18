import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
* Generated class for the SlidesPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
	selector: 'page-slides',
	templateUrl: 'slides.html',
})
export class SlidesPage {

	slides:any = [];
	constructor(public navCtrl: NavController, public navParams: NavParams) {

		this.slides = [
		    {image: "assets/slides/1.png"},
		    {image: "assets/slides/2.png"},
		    {image: "assets/slides/3.png"},
		    {image: "assets/slides/4.png"},
		    {image: "assets/slides/5.png"},
		    {image: "assets/slides/6.png"}
		];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SlidesPage');
	}

	continue(){
		this.navCtrl.pop();
	}
}
