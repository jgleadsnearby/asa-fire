import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {ToastController} from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  userName: any;
  userPass: any;
  phone: any;
  acctNumber: any;
    passwordType = 'password';
    passwordIcon = 'eye-off';

    constructor(private callNumber: CallNumber, private storage: Storage, public toastCtrl: ToastController) {
        this.getData('userInfo');
    }

    hideShowPassword() {
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
        this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    }

    submit() {
        if (this.userName === null || this.userName === undefined || this.userName === '') {
            this.presentToast('Please enter a Username');
            // console.log('userName error = ', this.userName);
        } else if (this.userPass === null || this.userPass === undefined || this.userPass === '') {
            this.presentToast('Please enter a Password');
            // console.log('userPass error= ', this.userPass);
        } else if (this.phone === null || this.phone === undefined || this.phone === '') {
            this.presentToast('Please enter a Phone Number');
            // console.log('userPass error= ', this.userPass);
        } else if (this.acctNumber === null || this.acctNumber === undefined || this.acctNumber === '') {
            this.presentToast('Please enter an Account Number');
            // console.log('userPass error= ', this.userPass);
    } else {
        // console.log('userName = ', this.userName);
        // console.log('userPass = ', this.userPass);
        const param = {
            userName: this.userName,
            userPass: this.userPass,
            phone: this.phone,
            acctNumber: this.acctNumber
        };
        this.setData('userInfo', param);
      }
    }

    async setData(key, value) {
        const res = await this.storage.set(key, value);
        if (res) {
            this.presentToast('Successfully save user info');
        }
        console.log(res);
    }

    async getData(key) {
        const keyVal = await this.storage.get(key);
        if (keyVal) {
            this.userName = keyVal.userName;
            this.userPass = keyVal.userPass;
            this.phone = keyVal.phone;
            this.acctNumber = keyVal.acctNumber;
        } else {
            this.userName = '';
            this.userPass = '';
            this.phone = '';
            this.acctNumber = '';
        }
    }

    async presentToast(text) {
        const toast = await this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'bottom'
        });
        toast.present().then(res => res);
    }

    callSupport(): void {
        this.callNumber.callNumber('18009323822', true);
    }
}
