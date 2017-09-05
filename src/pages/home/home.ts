import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Camera, CameraOptions } from '@ionic-native/camera';

import * as firebase from 'firebase';

import { LoginPage } from '../login/login'
@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	images: Array<{src: String}>;
	base64Image : any;
	constructor(
		public navCtrl: NavController,
		public afAuth : AngularFireAuth,
		private camera: Camera

		) {
		this.images = [];

		if(!this.isLoggedIn()){
			window.localStorage.removeItem('currentUser')
			console.log("You are not Logged In");
			this.navCtrl.push(LoginPage);
		}
	}

	isLoggedIn(){
		if(window.localStorage.getItem('currentUser')){
			return true
		}
	}

	signOut(): void {
		this.afAuth.auth.signOut();
		this.navCtrl.push(LoginPage);
	}

	takePhoto() {


		const options: CameraOptions = {
			quality: 80,
			destinationType: this.camera.DestinationType.DATA_URL,
			sourceType: this.camera.PictureSourceType.CAMERA,
			allowEdit: false,
			encodingType: this.camera.EncodingType.JPEG,
			saveToPhotoAlbum: false
		}
		this.camera.getPicture(options).then((imageData) => {
			// imageData is either a base64 encoded string or a file URI
			// If it's base64:
			this.base64Image = 'data:image/jpeg;base64,' + imageData;

			this.images.unshift({
				src: this.base64Image
			})
		}, (err) => {
			// Handle error
		});
	}

	upload() {
		let storageRef = firebase.storage().ref();
		// Create a timestamp as filename
		const filename = Math.floor(Date.now() / 1000);

		// Create a reference to 'images/todays-date.jpg'
		const imageRef = storageRef.child(`images/${filename}.jpg`);

		imageRef.putString(this.base64Image, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
			// Do something here when the data is succesfully uploaded!
		});

	}



}
