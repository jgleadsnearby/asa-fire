import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Clipboard} from '@ionic-native/clipboard/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {

    scannedData: any;
    data;
    resultUrl;
    url;

    constructor(private route: ActivatedRoute,
                private clipboard: Clipboard,
                private iab: InAppBrowser,
                private socialSharing: SocialSharing,
                public toastCtrl: ToastController) {
    }

  ngOnInit() {

      this.route.params.subscribe(params => {
          this.scannedData = params['ids'];
      });
      this.data = JSON.parse(this.scannedData);
      this.url = this.setUrl(this.data.text);
      this.resultUrl = this.url + this.data.text;
  }

    // Copy Event
    copyText() {
        this.clipboard.copy(this.resultUrl).then((res) => {
            console.log('copy');
            this.presentToast('Url is copied');
        });
    }

    // In App Browser
    openInApp() {
        this.iab.create(this.resultUrl);
    }

    // Share via email
    shareMail() {
        this.socialSharing.share(this.resultUrl, null, null, null).then((res) => {
            // Success!
            console.log('sucess ::', res);
        }).catch((err) => {
            // Error!
            console.log('sucess ::', err);
        });
    }

    async presentToast(text) {
        const toast = await this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'bottom'
        });
        toast.present().then(res => res);
    }

    setUrl(url) {
        return url.substring(0, 4) === 'http' ? '' : 'https://';
    }
}
