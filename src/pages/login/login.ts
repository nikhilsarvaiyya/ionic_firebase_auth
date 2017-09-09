import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController,LoadingController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';

import * as firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';

import { HomePage } from '../home/home'

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {
	email : any;
	password : any;
	authState: any = null;
	displayName;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public afAuth : AngularFireAuth,
		public googleplus : GooglePlus,
		public alertCtrl: AlertController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		private fb: Facebook, 
		private platform: Platform
		) {

		this.afAuth.authState.subscribe((auth) => {

			this.authState = auth;
			console.log("Detail",this.authState);
			window.localStorage.setItem('userDetails', JSON.stringify(this.authState));
			
			//this.storage.set('userDetail', this.authState);

			afAuth.authState.subscribe(user => {
				if (!user) {
					this.displayName = null;        
					return;
				}
				this.displayName = user.displayName;      
			});

		});
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad LoginPage');
	}

	signInWithFacebook() {
		if (this.platform.is('cordova')) {
			return this.fb.login(['email', 'public_profile']).then(res => {
				const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
				console.log(JSON.stringify(res));
				this.navCtrl.push(HomePage);
				return firebase.auth().signInWithCredential(facebookCredential);

			}).catch(error =>{
				console.log(JSON.stringify(error));
			})
		}
		else {
			return this.afAuth.auth
			.signInWithPopup(new firebase.auth.FacebookAuthProvider())
			.then(res => 
			{
				console.log(res);
				this.navCtrl.push(HomePage);
			});
		}
	}

	emailLogin(email:string, password:string) {
		let loading = this.loadingCtrl.create({ content: 'Loading...' });
		loading.present();
		setTimeout(function () {
			loading.dismiss();
		}, 3000);
		
		return this.afAuth.auth.signInWithEmailAndPassword(email, password)
		.then((user) => {
			this.authState = user;
			loading.dismiss();
			this.presentToast("Login Successfully.");
			this.navCtrl.pop();
			
		})
		.catch((error) => {
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
	/*facebookLogin(){
		let loading = this.loadingCtrl.create({ content: 'Loading...' });
		loading.present();

		let provider = new firebase.auth.FacebookAuthProvider();


		firebase.auth().signInWithRedirect(provider).then(()=>{
			firebase.auth().getRedirectResult().then((result)=>{
				loading.dismiss();
				this.presentToast("Login Successfully...!");
				console.log(JSON.stringify(result));

			}).catch(function(error){
				loading.dismiss();
				this.presentToast("Something went wrong. ");
				console.log(JSON.stringify(error));
			})
		})
	}*/

	twitterLogin(){
		let loading = this.loadingCtrl.create({ content: 'Loading...' });
		loading.present();

		let provider = new firebase.auth.TwitterAuthProvider();
		firebase.auth().signInWithRedirect(provider).then(()=>{
			firebase.auth().getRedirectResult().then((result)=>{
				loading.dismiss();
				this.presentToast("Login Successfully...!");
				console.log(JSON.stringify(result));
				this.navCtrl.push(HomePage);

			}).catch(function(error){
				loading.dismiss();
				this.presentToast("Something went wrong. ");
				console.log(JSON.stringify(error));
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
