import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  userName: any;
  userPass: any;
  phone: any;
    passwordType = 'password';
    passwordIcon = 'eye-off';

    constructor(private storage: Storage, public toastCtrl: ToastController) {
        this.getData('userInfo');
    }

    hideShowPassword() {
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
        this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    }

    submit() {
      if (this.userName === null || this.userName === undefined || this.userName === '') {
        this.presentToast('Please enter username');
          // console.log('userName error = ', this.userName);
      } else if (this.userPass === null || this.userPass === undefined || this.userPass === '') {
          this.presentToast('Please enter password');
          // console.log('userPass error= ', this.userPass);
      } else if (this.phone === null || this.phone === undefined || this.phone === '') {
          this.presentToast('Please enter phone number');
          // console.log('userPass error= ', this.userPass);
      } else {
        // console.log('userName = ', this.userName);
        // console.log('userPass = ', this.userPass);
        const param = {
            userName: this.userName,
            userPass: this.userPass,
            phone: this.phone
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
        } else {
            this.userName = '';
            this.userPass = '';
            this.phone = '';
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
}
