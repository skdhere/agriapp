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
		    {
		      title: "Welcome to the Docs!",
		      description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
		      image: "assets/slides/1.png",
		      color: "#e91e63"
		    },
		    {
		      title: "What is Ionic?",
		      description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
		      image: "assets/slides/2.png",
		      color: "#00bcd4"
		    },
		    {
		      title: "What is Ionic Cloud?",
		      description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
		      image: "assets/slides/3.png",
		      color: "#9c27b0"
		    }
		];
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SlidesPage');
	}

	continue(){
		this.navCtrl.pop();
	}
}
