import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireModule } from 'angularfire2';
import firebase from 'firebase'

import { LoginPage } from '../login/login'
@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	constructor(
		public navCtrl: NavController,
		
		) {
		if(!this.isLoggedIn()){
			window.localStorage.removeItem('currentUser')
			console.log("U re not Logged In");
			this.navCtrl.push(LoginPage);
		}
	}

	isLoggedIn(){
		if(window.localStorage.getItem('currentUser')){
			return true
		}
	}

	

}
