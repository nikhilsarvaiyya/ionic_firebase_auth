import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';

import firebase from 'firebase'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login'
 
export const firebaseConfig = {
  apiKey: "AIzaSyDgT2-BXHMbR9-E-z_Nb5JVizRqNSj_d3A",
    authDomain: "vast-web-auth.firebaseapp.com",
    databaseURL: "https://vast-web-auth.firebaseio.com",
    projectId: "vast-web-auth",
    storageBucket: "vast-web-auth.appspot.com",
    messagingSenderId: "283845155465"
}
firebase.initializeApp(firebaseConfig)

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus,
    AngularFireAuth,
    AngularFireDatabase,
    Camera
   
  ]
})
export class AppModule {}
