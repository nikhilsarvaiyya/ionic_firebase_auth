import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController,LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';

import * as firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {
	email : any;
	password : any;
	authState: any = null;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public afAuth : AngularFireAuth,
		public googleplus : GooglePlus,
		public alertCtrl: AlertController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public storage: Storage
		) {

		this.afAuth.authState.subscribe((auth) => {

			this.authState = auth;
			console.log("Detail",this.authState);
			window.localStorage.setItem('userDetails', JSON.stringify(this.authState));
			
			//this.storage.set('userDetail', this.authState);

		});
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad LoginPage');
	}

	emailLogin(email:string, password:string) {
		let loading = this.loadingCtrl.create({ content: 'Loading...' });
		loading.present();
		return this.afAuth.auth.signInWithEmailAndPassword(email, password)
		.then((user) => {
			this.authState = user
			loading.dismiss();
			this.presentToast("Login Successfully.");
			this.navCtrl.pop();
			
		})
		.catch((error) => {
			loading.dismiss();
			console.log(error);
			this.presentToast("Incorrect Credientials.");
		})

	}

	gmailLogin(){
		let loading = this.loadingCtrl.create({ content: 'Loading...' });
		loading.present();
		this.googleplus.login({
			'webClientId':'283845155465-7iedlf3qftmrof5stl6d55jgpndnipee.apps.googleusercontent.com',
			'offline':true
		}).then(res=>{
			firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
			.then(suc=>{
				loading.dismiss();
				this.presentToast("Login Successfully...!");
				this.navCtrl.pop();
			}).catch(ns=>{
				loading.dismiss();
				this.presentToast("Something went wrong. ");
			})
		})
	}

	presentAlert(text) {
		let alert = this.alertCtrl.create({
			title: text,
			buttons: ['OK']
		});
		alert.present();
	}

	presentToast(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 3000,
			position: "center"
		});
		toast.present();
	}

}
