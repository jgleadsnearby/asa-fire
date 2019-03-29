import { Component } from '@angular/core';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {Router} from '@angular/router';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    scannedData: {};
    cancelled = true;

    constructor(
        private barcodeScanner: BarcodeScanner,
        private router: Router,
    ) {
        // this.scanCode();
    }

    scanCode() {
        this.barcodeScanner.scan().then(barcodeData => {
            this.cancelled = barcodeData.cancelled;
            this.scannedData = JSON.stringify(barcodeData);
            console.log(this.cancelled);
            if (!this.cancelled) {
                this.router.navigate(['/result', {ids: [this.scannedData]}]);
            }
        }).catch(err => {
            console.log('Error', err);
        });
    }
}
