import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {SuperTabs, SuperTabsController} from "ionic2-super-tabs";

interface point<T> {
    [K: string]: T;
}

@IonicPage({
	segment: 'farmerdetail/:type'
})
@Component({
  selector: 'page-farmerdetail',
  templateUrl: 'farmerdetail.html'
})


export class Farmerdetail {

	@ViewChild(SuperTabs) superTabs: SuperTabs;

	page1: any = 'Forms';
	page2: any = 'Forms';
	page3: any = 'Forms';
	page4: any = 'Forms';
	page5: any = 'Forms';

	showIcons: boolean  = false;
	showTitles: boolean = true;
	pageTitle: string   = 'Farmer Name';

	current_farmer: any;
	parmsPage1: any;
	parmsPage2: any;
	parmsPage3: any;
	parmsPage4: any;
	parmsPage5: any;

	constructor(public navCtrl: NavController, private navParams: NavParams, private superTabsCtrl: SuperTabsController) {
		this.current_farmer = navParams.get('farmer');
		this.pageTitle      = this.current_farmer.fm_name;
		this.parmsPage1     = {rootNavCtrl: this.navCtrl ,farmer: this.current_farmer, form_name : 'kyc' };
		this.parmsPage2     = {rootNavCtrl: this.navCtrl ,farmer: this.current_farmer, form_name : 'land details' };
		this.parmsPage3     = {rootNavCtrl: this.navCtrl ,farmer: this.current_farmer, form_name : 'crop details' };
		this.parmsPage4     = {rootNavCtrl: this.navCtrl ,farmer: this.current_farmer, form_name : 'assets' };
		this.parmsPage5     = {rootNavCtrl: this.navCtrl ,farmer: this.current_farmer, form_name : 'loan and liability' };
	}

	ngAfterViewInit() {
		// this.superTabsCtrl.increaseBadge('page1', 10);
		// this.superTabsCtrl.enableTabSwipe('page3', false);
		// this.superTabsCtrl.enableTabsSwipe(false);
		// Test issue #122
		// setTimeout(() => {
		//   this.superTabs.slideTo(4);
		// }, 2000);
	}

	onTabSelect(tab: { index: number; id: string; }) {
		console.log(`Selected tab: `, tab);
	}
}
