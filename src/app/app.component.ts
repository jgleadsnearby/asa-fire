import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
        this.statusBar.styleLightContent();
        this.statusBar.backgroundColorByHexString('#FF001B');
        this.splashScreen.hide();

        // OneSignal Code start:
        // Enable to debug issues:
        // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

        this.oneSignal.startInit('26a45797-1b56-4138-a45b-b29d01bac7e6', '347289742559');

        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

        this.oneSignal.handleNotificationReceived().subscribe(() => {
         // do something when notification is received
          console.log('Received');
        });

        this.oneSignal.handleNotificationOpened().subscribe(() => {
          // do something when a notification is opened
          console.log('open');
        });

        this.oneSignal.endInit();

    });
  }
}
